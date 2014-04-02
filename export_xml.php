<?php 

//var_dump($_POST['figura']);

$data = ' ';

$largura = 1000;
$altura = 500;

if(!$_POST['figura'])
	$_POST['figura'] = array();
	
foreach($_POST['figura'] as $f){
	switch($f['tipo']){
		case 'reta':
			$data .= '<Reta>
						<Ponto>
							<x>'.$f['pontoInicial']['x'] / $largura.'</x>
							<y>'.$f['pontoInicial']['y'] / $altura.'</y>
						</Ponto>
						<Ponto>
							<x>'.$f['pontoFinal']['x'] / $largura.'</x>
							<y>'.$f['pontoFinal']['y'] / $altura.'</y>
						</Ponto>
						<Cor>
							<R>0</R>
							<G>0</G>
							<B>0</B>														
						</Cor>
					</Reta>';
		break;
		case 'circulo':
			$data.= '<Circulo>
						<Ponto>
							<x>'.$f['pontoInicial']['x'] / $largura.'</x>
							<y>'.$f['pontoInicial']['y'] / $altura.'</y>
						</Ponto>							
						<Raio>'.sqrt(pow( ($f['pontoInicial']['x'] / $largura) - ($f['pontoFinal']['x'] / $largura),2) + pow( ($f['pontoInicial']['y'] / $altura) - ($f['pontoFinal']['y'] / $altura ),2)).'</Raio>
						<Cor>
							<R>0</R>
							<G>0</G>
							<B>0</B>							
						</Cor>
					</Circulo>';
		break;
		case 'retangulo':
			$data .= '<Retangulo>
						<Ponto>
							<x>'.$f['pontoInicial']['x'] / $largura.'</x>
							<y>'.$f['pontoInicial']['y'] / $altura.'</y>
						</Ponto>
						<Ponto>
							<x>'.$f['pontoFinal']['x'] / $largura.'</x>
							<y>'.$f['pontoFinal']['y'] / $altura.'</y>
						</Ponto>
						<Cor>
							<R>0</R>
							<G>0</G>
							<B>0</B>							
						</Cor>
					 </Retangulo>';
		break;
		case 'poligono':
			$data.='<Poligono>';
				$data.='<Ponto>
							<x>'.$f['pontoInicial']['x'] / $largura.'</x>
							<y>'.$f['pontoInicial']['y'] / $altura.'</y>
						</Ponto>';
				foreach($f['retas'] as $r){
					$data.='<Ponto>
							<x>'.$r['pontoFinal']['x'] / $largura.'</x>
							<y>'.$r['pontoFinal']['y'] / $altura.'</y>
						</Ponto>';
				}
			$data.='<Cor>
							<R>0</R>
							<G>0</G>
							<B>0</B>	
						</Cor></Poligono>';
		break;
		case 'linha_poligonal':
					$data.='<LinhaPoligonal>';
				$data.='<Ponto>
							<x>'.$f['pontoInicial']['x'] / $largura.'</x>
							<y>'.$f['pontoInicial']['y'] / $altura.'</y>
						</Ponto>';
				foreach($f['retas'] as $r){
					$data.='<Ponto>
							<x>'.$r['pontoFinal']['x'] / $largura.'</x>
							<y>'.$r['pontoFinal']['y'] / $altura.'</y>
						</Ponto>';
				}
			$data.='<Cor>
							<R>0</R>
							<G>0</G>
							<B>0</B>	
						</Cor></LinhaPoligonal>';
		break;
	}
}

$data = '<Figura>'.$data.'</Figura>';

$file = fopen($_SERVER['DOCUMENT_ROOT'].'/cgpi/renato_afonso_thiago.xml', 'w');
fwrite($file, $data);
fclose($file);

echo 'file:///Users/Renato/Dropbox/server/cgpi/renato_afonso_thiago.xml';

?>