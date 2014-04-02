<?php 

function gera_reta($inicial_x,$inicial_y,$final_x,$final_y){

			/*$inicial_x = floatval($child->Ponto[0]->x) * 1000;
			$inicial_y = floatval($child->Ponto[0]->y) * 500;
			$final_x = floatval($child->Ponto[1]->x) * 1000;
			$final_y = floatval($child->Ponto[1]->y) * 500;*/
			return '{ "tipo":"reta", "pontoInicial": {"x":'. ($inicial_x ) .', "y":'.($inicial_y).'}, "pontoFinal":{"x":'.($final_x).', "y":'.($final_y).'}}';

}

$array_to_be_transf = array();
//var_dump($_FILES['file']['tmp_name']);
$xml = simplexml_load_file('carregar.xml');
foreach($xml->children() as $child)
{
	switch($child->getName()){
		case 'Reta':
			$inicial_x = floatval($child->Ponto[0]->x) * 1000;
			$inicial_y = floatval($child->Ponto[0]->y) * 500;
			$final_x = floatval($child->Ponto[1]->x) * 1000;
			$final_y = floatval($child->Ponto[1]->y) * 500;
			$array_to_be_transf[] = gera_reta($inicial_x, $inicial_y, $final_x, $final_y);
		break;
		case 'Retangulo':
			$inicial_x = floatval($child->Ponto[0]->x) * 1000;
			$inicial_y = floatval($child->Ponto[0]->y) * 500;
			$final_x = floatval($child->Ponto[1]->x) * 1000;
			$final_y = floatval($child->Ponto[1]->y) * 500;
			$array_to_be_transf[] = '{ "tipo":"retangulo", "pontoInicial": {"x":'. ($inicial_x ) .', "y":'.($inicial_y).'}, "pontoFinal":{"x":'.($final_x).', "y":'.($final_y).'}}';			
		break;
		case 'Circulo':
			$inicial_x = floatval($child->Ponto[0]->x) * 1000;
			$inicial_y = floatval($child->Ponto[0]->y) * 500;
			if($child->Raio > 1)
				$child->Raio = 0.1;
			$final_x = $inicial_x + (floatval($child->Raio)*1000);
			$final_y = $inicial_y;
			$array_to_be_transf[] = '{ "tipo":"circulo", "pontoInicial": {"x":'. ($inicial_x ) .', "y":'.($inicial_y).'}, "pontoFinal":{"x":'.($final_x).', "y":'.($final_y).'}}';			
		break;
		case 'Poligono':
			$string = '{ "tipo":"poligono",';
			$string .= ' "retas": [';
			$size_of_ponto = sizeof($child->Ponto) - 1;
			$child->Ponto[$size_of_ponto]->x = $child->Ponto[0]->x;
			$child->Ponto[$size_of_ponto]->y = $child->Ponto[0]->y;			
				for($i=0; $i< sizeof($child->Ponto) - 1; $i++){
						$strings_gera_reta[]= gera_reta(floatval($child->Ponto[$i]->x) * 1000, floatval($child->Ponto[$i]->y) * 500, floatval($child->Ponto[$i+1]->x) * 1000, floatval($child->Ponto[$i+1]->y) * 500);
				}
			$string.= implode(',',$strings_gera_reta);				
			$string .= ']}';
			$array_to_be_transf[] = $string;
		break;
		
		case 'LinhaPoligonal':
			$string = '{ "tipo":"linha_poligonal",';
			$string .= ' "retas": [';
			//$size_of_ponto = sizeof($child->Ponto) - 1;
			//$child->Ponto[$size_of_ponto]->x = $child->Ponto[0]->x;
			//$child->Ponto[$size_of_ponto]->y = $child->Ponto[0]->y;			
				for($i=0; $i< sizeof($child->Ponto) - 1; $i++){
						$strings_gera_reta[]= gera_reta(floatval($child->Ponto[$i]->x) * 1000, floatval($child->Ponto[$i]->y) * 500, floatval($child->Ponto[$i+1]->x) * 1000, floatval($child->Ponto[$i+1]->y) * 500);
				}
			$string.= implode(',',$strings_gera_reta);				
			$string .= ']}';
			$array_to_be_transf[] = $string;
		break;		
	}
		//var_dump($array_to_be_transf);
}

echo '['.implode(',',$array_to_be_transf).']';

?>