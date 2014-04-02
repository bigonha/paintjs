var isInTheMiddleOfDrawing = false;
var currentMousePoint;
var mouseDownPoint;
var currentCanvas = document.getElementById('myCanvas');
var ctx= currentCanvas.getContext('2d');

var pixel = {
	
	size: new Size(1, 1),
	draw: function(x,y)
	{
		var point = new Point(x,y);
		var rectangle = new Rectangle(point, this.size);
		var path = new Path.Rectangle(rectangle);
		path.fillColor = '#000000';

		
	}
	
}

function corrigir_coordenadas(y){
	return (currentCanvas.height) - y;
}

function line (pontoInicial, pontoFinal){
	
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
					pixel.draw(pontoInicial.x, i);	
				}else{
					pixel.draw(parseInt(this.funcaoY(i)), i);
				}
			}
		}else{
			if(pontoInicial.x > pontoFinal.x){ aux = pontoInicial.x; pontoInicial.x = pontoFinal.x; pontoFinal.x = aux;}		
			for(var i = pontoInicial.x; i <= pontoFinal.x; i++){
				if(coeficienteAngular == 0){
					pixel.draw(i, pontoInicial.y);	
				}else{
					pixel.draw(i, parseInt(this.funcaoX(i)) );
				}
			}
		}
		
		
	};
	
}

//reta = new line(new Point(10,10), new Point(50,50)).draw();

function onMouseDown(event) {
	if(isInTheMiddleOfDrawing){
		isInTheMiddleOfDrawing = false;
		alert('linha acabada');
	}
	else
		isInTheMiddleOfDrawing = true;
	mouseDownPoint = event.point;
}


	//primeiroPonto = event.point;
    //segundoPonto = currentMousePoint;
    //reta = new line(new Point(primeiroPonto.x,primeiroPonto.y), new Point(segundoPonto.x,segundoPonto.y)).draw();

function onMouseMove(event) {
	currentMousePoint = event.point;
	if(isInTheMiddleOfDrawing){
		new line(mouseDownPoint, currentMousePoint).draw();
		
	}
}



//alert(document.getElementById('myCanvas').height);
//pixel.draw(1,1);
//pixel.draw(2,2);