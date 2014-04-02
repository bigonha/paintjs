<?php 

$img = str_replace('data:image/png;base64,', '', $_POST['imageData']);
$img = str_replace(' ', '+', $img);
//echo $img;
$data = base64_decode($img);

$file = 'images/' . uniqid() . '.png';
$success = file_put_contents($file, $data);

//resize

$dst_x = 0;   // X-coordinate of destination point. 
$dst_y = 0;   // Y --coordinate of destination point. 
$src_x = $_POST['x_start']+1; // Crop Start X position in original image
$src_y = $_POST['y_start']+1; // Crop Srart Y position in original image
$dst_w = sqrt(pow($_POST['x_start'] - $_POST['x_end'], 2))-1; // Thumb width
$dst_h = sqrt(pow($_POST['y_start'] - $_POST['y_end'], 2))-1; // Thumb height
$src_w = $dst_w; //$_POST['x_end'];   Crop end X position in original image
$src_h = $dst_h; // $_POST['y_start'];   Crop end Y position in original image

// Creating an image with true colors having thumb dimensions.( to merge with the original image )
$dst_image = imagecreatetruecolor($dst_w,$dst_h);
// Get original image
$src_image = imagecreatefrompng($file);

$backgroundColor = imagecolorallocate($dst_image, 255, 255, 255);
imagefill($dst_image, 0, 0, $backgroundColor);

// Cropping 
imagecopyresampled($dst_image, $src_image, $dst_x, $dst_y, $src_x, $src_y, $dst_w, $dst_h, $src_w, $src_h);
// Saving 
imagejpeg($dst_image, $file,100);

echo $file;

?>