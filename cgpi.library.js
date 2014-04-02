var pixel = {
	
	draw : function(x,y,scope)
	{
		paper = scope;
		var size = new paper.Size(1, 1);
		var point = new paper.Point(x,y);
		var rectangle = new paper.Rectangle(point, size);
		var path = new paper.Path.Rectangle(rectangle);
		path.fillColor = '#000000';
		
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

$(function(){

window.myCanvasScope = new window.paper.PaperScope();
window.mapeamentoCanvasScope = new window.paper.PaperScope();

window.myCanvasScope.setup($("#myCanvas")[0]);
window.mapeamentoCanvasScope.setup($("#mapeamentoCanvas")[0]);

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

function line (pontoInicial, pontoFinal, scope){

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
					pixel.draw(pontoInicial.x, i, scope);	
				}else{
					pixel.draw(parseInt(this.funcaoY(i)), i, scope);
				}
			}
			pixel.refresh(scope);
		}else{
			if(pontoInicial.x > pontoFinal.x){ aux = pontoInicial.x; pontoInicial.x = pontoFinal.x; pontoFinal.x = aux;}		
			for(var i = pontoInicial.x; i <= pontoFinal.x; i++){
				if(coeficienteAngular == 0){
					pixel.draw(i, pontoInicial.y, scope);	
				}else{
					pixel.draw(i, parseInt(this.funcaoX(i)) , scope);
				}
			}
			pixel.refresh(scope);
		}
		
		//draw.refresh(5, mapeamentoCanvasScope);
	};
	
}

function circle (pontoInicial, pontoFinal, scope){
	this.draw = function(){
		var deltaY = pontoFinal.y - pontoInicial.y;
		var deltaX = pontoFinal.x - pontoInicial.x;
		var raio = Math.sqrt( (deltaY*deltaY) + (deltaX*deltaX) );
		for(var i=0; i< 2*Math.PI*raio; i++){
			pixel.draw(parseInt(pontoInicial.x + raio * Math.cos(i)), parseInt(pontoInicial.y  + raio * Math.sin(i)), scope);
		}
		pixel.refresh(scope);
	};
}

function rectangle(pontoInicial, pontoFinal, scope){
	this.draw = function(){
		var linha = new line(new Ponto(pontoInicial.x, pontoInicial.y), new Ponto(pontoFinal.x, pontoInicial.y), scope).draw();
		var linha = new line(new Ponto(pontoFinal.x, pontoInicial.y), new Ponto(pontoFinal.x, pontoFinal.y), scope).draw();
		var linha = new line(new Ponto(pontoInicial.x, pontoInicial.y), new Ponto(pontoInicial.x, pontoFinal.y), scope).draw();
		var linha = new line(new Ponto(pontoInicial.x, pontoFinal.y), new Ponto(pontoFinal.x, pontoFinal.y), scope).draw();		
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
    			console.log(JSON.stringify(data));
    		}
    		break;
    	case 'borracha':
    		borracha.apagar(event.pageX, event.pageY);

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
    }

});


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



var draw = {
	
	refresh : function (razao, scope){
		this.clear(scope);
		for (var i = 0; i < data.length; i++) {
			switch(data[i].tipo){
				case 'reta':
					new line(new Ponto(data[i].pontoInicial.x / razao, data[i].pontoInicial.y / razao), new Ponto(data[i].pontoFinal.x / razao, data[i].pontoFinal.y / razao), scope).draw();
				break;
				case 'circulo':
					new circle(new Ponto(data[i].pontoInicial.x / razao, data[i].pontoInicial.y / razao), new Ponto(data[i].pontoFinal.x / razao, data[i].pontoFinal.y / razao), scope).draw();
				break;
				case 'retangulo':
					new rectangle(new Ponto(data[i].pontoInicial.x / razao, data[i].pontoInicial.y / razao), new Ponto(data[i].pontoFinal.x / razao, data[i].pontoFinal.y / razao), scope).draw();
				break;
				case 'poligono':
					for(var count=0; count<data[i].retas.length; count++){
						new line(new Ponto(data[i].retas[count].pontoInicial.x / razao, data[i].retas[count].pontoInicial.y / razao), new Ponto(data[i].retas[count].pontoFinal.x / razao, data[i].retas[count].pontoFinal.y / razao), scope ).draw();
					}
				break;
				case 'linha_poligonal':
					for(var count=0; count<data[i].retas.length; count++){
						new line(new Ponto(data[i].retas[count].pontoInicial.x / razao, data[i].retas[count].pontoInicial.y / razao), new Ponto(data[i].retas[count].pontoFinal.x / razao, data[i].retas[count].pontoFinal.y / razao), scope ).draw();
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
