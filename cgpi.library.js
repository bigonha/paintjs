var pixel = {
	
	draw : function(x,y,scope, color)
	{
		color = color || '#000000';
		paper = scope;
		var size = new paper.Size(1, 1);
		var point = new paper.Point(x,y);
		var rectangle = new paper.Rectangle(point, size);
		var path = new paper.Path.Rectangle(rectangle);
		path.fillColor = color;
		
	},
	refresh: function (scope){
		paper = scope;
		paper.view.draw();
	},
	clear: function(scope){
		paper = scope;
		paper.project.activeLayer.removeChildren();
	paper.view.draw();
	}
	
};

var pivot = {
	draw: function (x,y, scope, color){
		paper = scope;
		var size = new paper.Size(10, 10);
		var point = new paper.Point(x,y);
		var rectangle = new paper.Rectangle(point, size);
		var path = new paper.Path.Rectangle(rectangle);
		path.fillColor = color;
		paper.view.draw();
	}
}

$(function(){

window.myCanvasScope = new window.paper.PaperScope();
window.mapeamentoCanvasScope = new window.paper.PaperScope();

window.myCanvasScope.setup($("#myCanvas")[0]);
window.mapeamentoCanvasScope.setup($("#mapeamentoCanvas")[0]);

window.colorForSelectedElement = '#E25098';

//window.myCanvasTool = new myCanvasScope.Tool();
//window.mapeamentoCanvasTool = new mapeamentoCanvasScope.Tool();


//new line(new Ponto(10,10), new Ponto(20,20), window.mapeamentoCanvasScope).draw();

	$('#import_xml').submit(function(){
		$.ajax({
			url: $(this).attr('action'),
			dataType: 'text',
			type: 'post',
			data: {},
			
		}).done(function(data){
			//console.log(JSON.stringify(window.data));
			window.data = jQuery.parseJSON(data);
			//console.log(JSON.stringify(window.data));
			draw.refresh(1, window.myCanvasScope);
			draw.refresh(5, mapeamentoCanvasScope);	
		});
		return false;
	});
	

function Ponto(x,y){
	this.x = x;
	this.y = y;
	
}

function corrigir_coordenadas(y){
	return (document.getElementById('myCanvas').height) - y;
}

function line (pontoInicial, pontoFinal, scope, color){

	this.draw = function()
	{	
		var deltaY = pontoFinal.y - pontoInicial.y;
		var deltaX = pontoFinal.x - pontoInicial.x;
		if(deltaX == 0){
			var coeficienteAngular = 0;				
		}else{
			var coeficienteAngular = (deltaY)/(deltaX);				
		}			
		var coeficienteLinear = pontoInicial.y - (coeficienteAngular * pontoInicial.x);		
		
		this.funcaoX = function(x){
			return (coeficienteAngular * x) + coeficienteLinear;
		};
		this.funcaoY = function(y){		
			return (y - coeficienteLinear) / coeficienteAngular;
		};
		
		
		if(Math.abs(deltaY) > Math.abs(deltaX))
		{ 	
			if(pontoInicial.y > pontoFinal.y){ aux = pontoInicial.y; pontoInicial.y = pontoFinal.y; pontoFinal.y = aux;}
			for(var i=pontoInicial.y; i<=pontoFinal.y; i++){
				if(coeficienteAngular == 0){
					pixel.draw(pontoInicial.x, i, scope, color);	
				}else{
					pixel.draw(parseInt(this.funcaoY(i)), i, scope, color);
				}
			}
			pixel.refresh(scope);
		}else{
			if(pontoInicial.x > pontoFinal.x){ aux = pontoInicial.x; pontoInicial.x = pontoFinal.x; pontoFinal.x = aux;}		
			for(var i = pontoInicial.x; i <= pontoFinal.x; i++){
				if(coeficienteAngular == 0){
					pixel.draw(i, pontoInicial.y, scope, color);	
				}else{
					pixel.draw(i, parseInt(this.funcaoX(i)) , scope, color);
				}
			}
			pixel.refresh(scope);
		}
		
		//draw.refresh(5, mapeamentoCanvasScope);
	};
	
}

function circle (pontoInicial, pontoFinal, scope, color){
	this.draw = function(){
		var deltaY = pontoFinal.y - pontoInicial.y;
		var deltaX = pontoFinal.x - pontoInicial.x;
		var raio = Math.sqrt( (deltaY*deltaY) + (deltaX*deltaX) );
		for(var i=0; i< 2*Math.PI*raio; i++){
			pixel.draw(parseInt(pontoInicial.x + raio * Math.cos(i)), parseInt(pontoInicial.y  + raio * Math.sin(i)), scope, color);
		}
		pixel.refresh(scope);
	};
}

function rectangle(pontoInicial, pontoFinal, scope, color){
	this.draw = function(){
		var linha = new line(new Ponto(pontoInicial.x, pontoInicial.y), new Ponto(pontoFinal.x, pontoInicial.y), scope, color).draw();
		var linha = new line(new Ponto(pontoFinal.x, pontoInicial.y), new Ponto(pontoFinal.x, pontoFinal.y), scope, color).draw();
		var linha = new line(new Ponto(pontoInicial.x, pontoInicial.y), new Ponto(pontoInicial.x, pontoFinal.y), scope, color).draw();
		var linha = new line(new Ponto(pontoInicial.x, pontoFinal.y), new Ponto(pontoFinal.x, pontoFinal.y), scope, color).draw();		
		pixel.refresh(scope);
		//draw.refresh(1, myCanvasScope);
	};
	
}





var primeiroPontoGlobal = null;
var pontoTemporarioGlobal = null;
var pontoFinalGlobal = null;

window.data = [];
var id = 0;
window.clipping = {x_start: null, y_start: null, x_end : null, y_end : null };


	$('#get_canvas').click(function(){
		
		var oCanvas     =   document.getElementById('myCanvas');
		var canvasData  =   oCanvas.toDataURL('image/png');
		
		$.ajax({
			url: $(this).attr('href'),
			dataType: 'html',
			type: 'post',
			data: {imageData: canvasData,
				   x_start: window.clipping.x_start,
				   y_start: window.clipping.y_start, 
				   x_end: window.clipping.x_end, 
				   y_end: window.clipping.y_end }
			
		}).done(function(data){
			
			$('#clippingCanvas img').remove();
			$('#clippingCanvas').append('<img src="'+data+'" />');
		});
		
		return false;
	});	

$('#controls').change(function(){
	switch($('#controls').find(":selected").text()){
		case 'translacao': break;
		case 'rotacao': break;
		case 'escala': break;
		default :
		unselect_element.all();
		draw.refresh(1, myCanvasScope);
		draw.refresh(5, mapeamentoCanvasScope);		
	}
});

$('#myCanvas').click(function(event)
{	    		    			
	if(primeiroPontoGlobal == null)
		primeiroPontoGlobal = new Ponto(event.pageX, event.pageY);
	
	if(pontoTemporarioGlobal == null)
		pontoTemporarioGlobal = new Ponto(event.pageX, event.pageY);
	else
		pontoFinalGlobal = new Ponto(event.pageX, event.pageY);
	
	switch($('#controls').find(":selected").text()){
		case 'poligono':
    		poligono.mouseDown(event);
    		break;
    	case 'linha_poligonal':
    		linha_poligonal.mouseDown(event);
    		break;
    	case 'clipping':
    	draw.refresh(1, window.myCanvasScope);
    		if(pontoTemporarioGlobal != null && pontoFinalGlobal != null){					    			    		
    			retangulo = new rectangle(new Ponto(pontoTemporarioGlobal.x, pontoTemporarioGlobal.y), new Ponto(pontoFinalGlobal.x, pontoFinalGlobal.y), window.myCanvasScope).draw();
    			id++;
    			
				window.clipping.x_start = pontoTemporarioGlobal.x;
				window.clipping.y_start = pontoTemporarioGlobal.y;
				window.clipping.x_end = pontoFinalGlobal.x;
				window.clipping.y_end = pontoFinalGlobal.y;
				
    			pontoTemporarioGlobal = null;
    			pontoFinalGlobal = null;
    			primeiroPontoGlobal = null;
    			
    			$('#get_canvas').click();
    			
    		}    		
    	break;
    	case 'retangulo':
    	draw.refresh(1, window.myCanvasScope);
    		if(pontoTemporarioGlobal != null && pontoFinalGlobal != null){					    			    		
    			retangulo = new rectangle(new Ponto(pontoTemporarioGlobal.x, pontoTemporarioGlobal.y), new Ponto(pontoFinalGlobal.x, pontoFinalGlobal.y), window.myCanvasScope).draw();
    			pixel.refresh(window.myCanvasScope);
    			id++;
				data.push({id:id, tipo:'retangulo', pontoInicial: new Ponto(pontoTemporarioGlobal.x, pontoTemporarioGlobal.y), pontoFinal: new Ponto(pontoFinalGlobal.x, pontoFinalGlobal.y)});
				    			draw.refresh(5, mapeamentoCanvasScope);
    			pontoTemporarioGlobal = null;
    			pontoFinalGlobal = null;
    			primeiroPontoGlobal = null;
    		}
    		break;
			case 'circulo':
			draw.refresh(1, window.myCanvasScope);
				if(pontoTemporarioGlobal != null && pontoFinalGlobal != null){
					new circle(new Ponto(pontoTemporarioGlobal.x, pontoTemporarioGlobal.y), new Ponto(pontoFinalGlobal.x, pontoFinalGlobal.y), window.myCanvasScope).draw();
					id++;
					data.push({id:id, tipo:'circulo', pontoInicial: new Ponto(pontoTemporarioGlobal.x, pontoTemporarioGlobal.y), pontoFinal: new Ponto(pontoFinalGlobal.x, pontoFinalGlobal.y)});
					draw.refresh(5, mapeamentoCanvasScope);					
	    			pontoTemporarioGlobal = null;
	    			pontoFinalGlobal = null;
	    			primeiroPontoGlobal = null;
				}
			break;
    	case 'reta':
    	draw.refresh(1, window.myCanvasScope);
    		if(pontoTemporarioGlobal != null && pontoFinalGlobal != null){
    			id++;
    			data.push({id:id, tipo:'reta', pontoInicial: new Ponto(pontoTemporarioGlobal.x, pontoTemporarioGlobal.y), pontoFinal: new Ponto(pontoFinalGlobal.x, pontoFinalGlobal.y)});			
    			new line(new Ponto(pontoTemporarioGlobal.x, pontoTemporarioGlobal.y), new Ponto(pontoFinalGlobal.x, pontoFinalGlobal.y), window.myCanvasScope).draw();
    			draw.refresh(5, mapeamentoCanvasScope);
	    		pontoTemporarioGlobal = null;
	    		pontoFinalGlobal = null;
	    		primeiroPontoGlobal = null;
    			//console.log(JSON.stringify(data));
    		}
    		break;
    	case 'borracha':
    		borracha.apagar(event.pageX, event.pageY);

    	break;
    	case 'translacao':
    		select_element.select(event.pageX, event.pageY);
    	break;
    	case 'rotacao':
    		select_element.select(event.pageX, event.pageY);
    	break;    	
    	case 'escala':
    		select_element.select(event.pageX, event.pageY);
    	break;    	

    }
	
	

});


$('#myCanvas').dblclick(function(event){
	switch($('#controls').find(":selected").text()){
		case 'poligono':
    		poligono.doubleClick(event);
    		break;
    	case 'linha_poligonal':
    		linha_poligonal.doubleClick(event);
    		break;
    	case 'translacao':
    		if(select_element.any_selected() === true){
    			translacao.fazer(event);
    		}
    		break;
    	case 'rotacao':
	    	if(select_element.any_selected() === true){
	    		rotacao.fazer(event);
	    	}
    	break;
    	case 'escala':
    		if(select_element.any_selected() === true){
	    		escala.fazer(event);
	    	}
    	break;
    }

});

var translacao = {
	fazer: function (event){
		for (var i = 0; i < data.length; i++) {
			if(data[i].selected === true){
				var deltaX = event.pageX - data[i].pontoInicial.x;
				var deltaY = event.pageY - data[i].pontoInicial.y;	
				data[i].pontoInicial = new Ponto(event.pageX, event.pageY);
				if('retas' in data[i]){
					data[i].retas[0].pontoInicial = new Ponto(event.pageX, event.pageY);
					data[i].retas[0].pontoFinal = new Ponto(data[i].retas[0].pontoFinal.x + deltaX, data[i].retas[0].pontoFinal.y + deltaY);					
					for(var count=1; count<data[i].retas.length; count++){
						data[i].retas[count].pontoInicial = new Ponto(data[i].retas[count].pontoInicial.x + deltaX, data[i].retas[count].pontoInicial.y + deltaY);
						data[i].retas[count].pontoFinal = new Ponto(data[i].retas[count].pontoFinal.x + deltaX, data[i].retas[count].pontoFinal.y + deltaY);
					}
				}else{
					data[i].pontoFinal = new Ponto(data[i].pontoFinal.x + deltaX, data[i].pontoFinal.y + deltaY);
				}
			}
		}
		draw.refresh(1, myCanvasScope);
		draw.refresh(5, mapeamentoCanvasScope);	
	}
};

var rotacao = {
	fazer: function(event){
		pivot.draw(event.pageX, event.pageY, myCanvasScope, window.colorForSelectedElement);				
		angulo = prompt('Informe o ângulo de rotação:') * Math.PI/180 * -1;
		var centro = new Ponto(event.pageX, event.pageY);
		for (var i = 0; i < data.length; i++) {
			if(data[i].selected === true){
				//se for retangulo, entao transforma pra poligono, pois vai rotacionar
				if(data[i].tipo == 'retangulo'){
					data[i] = {id:id, tipo:'poligono', 
							   pontoInicial:  new Ponto(data[i].pontoInicial.x, data[i].pontoInicial.y),
							   retas: [
							   			{tipo:'reta', pontoInicial: new Ponto(data[i].pontoInicial.x, data[i].pontoInicial.y), pontoFinal: new Ponto(data[i].pontoFinal.x, data[i].pontoInicial.y) },
							   			{tipo:'reta', pontoInicial: new Ponto(data[i].pontoFinal.x, data[i].pontoInicial.y), pontoFinal: new Ponto(data[i].pontoFinal.x, data[i].pontoFinal.y) },
							   			{tipo:'reta', pontoInicial: new Ponto(data[i].pontoInicial.x, data[i].pontoInicial.y), pontoFinal: new Ponto(data[i].pontoInicial.x, data[i].pontoFinal.y) },
							   			{tipo:'reta', pontoInicial: new Ponto(data[i].pontoInicial.x, data[i].pontoFinal.y), pontoFinal: new Ponto(data[i].pontoFinal.x, data[i].pontoFinal.y) },						
						
					], selected: true}; 
				}
				data[i].pontoInicial = transform_point_rotation.fazer(data[i].pontoInicial, centro, angulo );
				if('retas' in data[i]){
					data[i].retas[0].pontoInicial = transform_point_rotation.fazer(data[i].retas[0].pontoInicial, centro, angulo);
					data[i].retas[0].pontoFinal = transform_point_rotation.fazer(data[i].retas[0].pontoFinal, centro, angulo);
					for(var count=1; count<data[i].retas.length; count++){
						data[i].retas[count].pontoInicial =  transform_point_rotation.fazer(data[i].retas[count].pontoInicial, centro, angulo);
						data[i].retas[count].pontoFinal = transform_point_rotation.fazer(data[i].retas[count].pontoFinal, centro, angulo);
					}
				}else{
					data[i].pontoFinal = transform_point_rotation.fazer(data[i].pontoFinal, centro, angulo );			
				}	
			}
		}
		draw.refresh(1, myCanvasScope);
		draw.refresh(5, mapeamentoCanvasScope);
	}
};

var escala = {
	fazer : function(event){
		pivot.draw(event.pageX, event.pageY, myCanvasScope, window.colorForSelectedElement);					
		razao_escala = prompt('Informe a razão da escala:');
		//escalaY = prompt('Informe a escala no eixo y:');
		var centro = new Ponto(event.pageX, event.pageY);		
		for (var i = 0; i < data.length; i++) {
			if(data[i].selected === true){
				data[i].pontoInicial = transform_point_scale.fazer(data[i].pontoInicial, razao_escala, centro);
				if('retas' in data[i]){
					data[i].retas[0].pontoInicial = transform_point_scale.fazer(data[i].retas[0].pontoInicial, razao_escala, centro);
					data[i].retas[0].pontoFinal = transform_point_scale.fazer(data[i].retas[0].pontoFinal, razao_escala, centro);
					for(var count=1; count<data[i].retas.length; count++){
						data[i].retas[count].pontoInicial =  transform_point_scale.fazer(data[i].retas[count].pontoInicial, razao_escala, centro);
						data[i].retas[count].pontoFinal = transform_point_scale.fazer(data[i].retas[count].pontoFinal, razao_escala, centro);
					}
				}else{
					data[i].pontoFinal = transform_point_scale.fazer(data[i].pontoFinal, razao_escala, centro);
				}
			}
		}
		draw.refresh(1, myCanvasScope);
		draw.refresh(5, mapeamentoCanvasScope);
	}
};

//transformacao da matriz escala

var transform_point_scale = {
	fazer: function(point, razao_escala, center){
		var xt = point.x - center.x;
		var yt = point.y - center.y;	
		var xr = xt * razao_escala;
		var yr = yt * razao_escala;
		var x2 = xr + center.x;
		var y2 = yr + center.y;
		return new Ponto(parseInt(x2), parseInt(y2));
	}
}

//transformacao da matriz rotacao

var transform_point_rotation = {
	fazer: function(point, center, angulo){
		var xt = point.x - center.x;
		var yt = point.y - center.y;
		var c = Math.cos(angulo); 
		var s = Math.sin(angulo);
		var xr = xt * c - yt * s;
		var yr = xt * s + yt * c;
		var x2 = xr + center.x;
		var y2 = yr + center.y;
		return new Ponto(parseInt(x2), parseInt(y2));
	}
}

var poligono = {

	retas_intermediarias : [],
	mouseDown: function (event)
	{	
		
		if(pontoTemporarioGlobal !=null && pontoFinalGlobal !=null){
			reta = new line(new Ponto(pontoTemporarioGlobal.x,pontoTemporarioGlobal.y ), new Ponto(pontoFinalGlobal.x, pontoFinalGlobal.y), window.myCanvasScope).draw();
			this.retas_intermediarias.push( {tipo:'reta', pontoInicial: new Ponto(pontoTemporarioGlobal.x, pontoTemporarioGlobal.y), pontoFinal: new Ponto(pontoFinalGlobal.x, pontoFinalGlobal.y) } );
			pontoTemporarioGlobal = new Ponto(pontoFinalGlobal.x, pontoFinalGlobal.y);
			pontoFinalGlobal = null;		
		}
	},
	
	doubleClick: function (event){
		reta = new line(new Ponto(pontoTemporarioGlobal.x,pontoTemporarioGlobal.y ), new Ponto(primeiroPontoGlobal.x, primeiroPontoGlobal.y), window.myCanvasScope).draw();
		this.retas_intermediarias.push( {tipo:'reta', pontoInicial: new Ponto(pontoTemporarioGlobal.x, pontoTemporarioGlobal.y), pontoFinal: new Ponto(primeiroPontoGlobal.x, primeiroPontoGlobal.y) } );
		id++;
		data.push({id:id, tipo:'poligono', pontoInicial:  new Ponto(primeiroPontoGlobal.x, primeiroPontoGlobal.y), retas: this.retas_intermediarias }); 
		    			draw.refresh(5, mapeamentoCanvasScope);
		this.retas_intermediarias = [];
		primeiroPontoGlobal = null;
		pontoTemporarioGlobal = null;	
		pontoFinalGlobal = null;
	}

};

var linha_poligonal = {
	retas_intermediarias : [],
	mouseDown: function (event)
	{
		if(pontoTemporarioGlobal !=null && pontoFinalGlobal !=null){
			reta = new line(new Ponto(pontoTemporarioGlobal.x,pontoTemporarioGlobal.y ), new Ponto(pontoFinalGlobal.x, pontoFinalGlobal.y), window.myCanvasScope).draw();
			this.retas_intermediarias.push( {tipo:'reta', pontoInicial: new Ponto(pontoTemporarioGlobal.x, pontoTemporarioGlobal.y), pontoFinal: new Ponto(pontoFinalGlobal.x, pontoFinalGlobal.y) } );
			pontoTemporarioGlobal = new Ponto(pontoFinalGlobal.x, pontoFinalGlobal.y);
			pontoFinalGlobal = null;		
		}
	
	},
	doubleClick: function (event){
		data.push({id:id, tipo:'linha_poligonal', pontoInicial:  new Ponto(primeiroPontoGlobal.x, primeiroPontoGlobal.y), retas: this.retas_intermediarias }); 
		    			draw.refresh(5, mapeamentoCanvasScope);
		    			this.retas_intermediarias = [];
		primeiroPontoGlobal = null;
		pontoTemporarioGlobal = null;	
		pontoFinalGlobal = null;
	}
	
};

var borracha = {
	
	apagar : function (x,y){
		for (var i = 0; i < data.length; i++) {
 			if( ( x < data[i].pontoInicial.x + 20 && x > data[i].pontoInicial.x - 20 )   && 
 				( y < data[i].pontoInicial.y + 20 && y > data[i].pontoInicial.y - 20 )   ){
 				data.splice(i, 1);
 			}
 			primeiroPontoGlobal = null;
			pontoTemporarioGlobal = null;	
			pontoFinalGlobal = null;
		}
	draw.refresh(1, myCanvasScope);
	draw.refresh(5, mapeamentoCanvasScope);	
	}
	
};

var select_element = {
	
	select : function(x,y){
		for (var i = 0; i < data.length; i++) {
 			if( ( x < data[i].pontoInicial.x + 20 && x > data[i].pontoInicial.x - 20 )   && 
 				( y < data[i].pontoInicial.y + 20 && y > data[i].pontoInicial.y - 20 )   ){
 				if(data[i].selected !== true){
 					unselect_element.all();
 					data[i].selected = true;
 				}else{
 					data[i].selected = false;
 				}
 			}
 			primeiroPontoGlobal = null;
			pontoTemporarioGlobal = null;	
			pontoFinalGlobal = null;
		}
		draw.refresh(1, myCanvasScope);
		draw.refresh(5, mapeamentoCanvasScope);	
	},
	any_selected:function(){
		for (var i = 0; i < data.length; i++) {
			if(data[i].selected === true)
				return true;
		}
	}
	
};

var unselect_element = {
	
	all:function(){
		for (var i = 0; i < data.length; i++) {
			if(data[i].selected)
				data[i].selected = false;
		}
	}
};



var draw = {
	
	refresh : function (razao, scope){
		this.clear(scope);
		for (var i = 0; i < data.length; i++) {
			var color = null;
			if(data[i].selected === true){
				color = window.colorForSelectedElement;
			}
			switch(data[i].tipo){
				case 'reta':
					new line(new Ponto(data[i].pontoInicial.x / razao, data[i].pontoInicial.y / razao), new Ponto(data[i].pontoFinal.x / razao, data[i].pontoFinal.y / razao), scope, color).draw();
				break;
				case 'circulo':
					new circle(new Ponto(data[i].pontoInicial.x / razao, data[i].pontoInicial.y / razao), new Ponto(data[i].pontoFinal.x / razao, data[i].pontoFinal.y / razao), scope, color).draw();
				break;
				case 'retangulo':
					new rectangle(new Ponto(data[i].pontoInicial.x / razao, data[i].pontoInicial.y / razao), new Ponto(data[i].pontoFinal.x / razao, data[i].pontoFinal.y / razao), scope, color).draw();
				break;
				case 'poligono':
					for(var count=0; count<data[i].retas.length; count++){
						new line(new Ponto(data[i].retas[count].pontoInicial.x / razao, data[i].retas[count].pontoInicial.y / razao), new Ponto(data[i].retas[count].pontoFinal.x / razao, data[i].retas[count].pontoFinal.y / razao), scope , color).draw();
					}
				break;
				case 'linha_poligonal':
					for(var count=0; count<data[i].retas.length; count++){
						new line(new Ponto(data[i].retas[count].pontoInicial.x / razao, data[i].retas[count].pontoInicial.y / razao), new Ponto(data[i].retas[count].pontoFinal.x / razao, data[i].retas[count].pontoFinal.y / razao), scope , color).draw();
					}
				break;
			}
		}
				console.log(JSON.stringify(data));
	},
	
	clear : function (scope){
		//project.activeLayer.removeChildren();
		pixel.clear(scope);
	}

};

});
