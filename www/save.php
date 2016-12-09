<?php


$uploaddir = 'uploads/';

$address = $_REQUEST['loc'];
$filename = str_replace([' ', '.', ',', ';', '\''], '', $address);
$filename = strtolower($filename) . ".jpg";

$uploadfile = $uploaddir . basename($_FILES['photo']['name']);
$uploadfile = $uploaddir . $filename;


// verify the file is a GIF, JPEG, or PNG
$fileType = exif_imagetype($_FILES["photo"]["tmp_name"]);
$allowed = array(IMAGETYPE_GIF, IMAGETYPE_JPEG, IMAGETYPE_PNG);
if (!in_array($fileType, $allowed)) {
    echo "Bad file";
    die;
}



$db = json_decode(file_get_contents("./libraries.json"), true);

foreach ($db as &$library) {
    if ($library['address'] == $address) {
        $library['image'] = $filename;
    }
}
unset($library);


$r = json_encode($db,  JSON_PRETTY_PRINT);
$result = file_put_contents("./libraries.json", $r);


if (move_uploaded_file($_FILES['photo']['tmp_name'], $uploadfile)) {
    exec("convert $uploadfile -resize '300x300^' -gravity Center -crop 300x300+0+0 $uploadfile");
    copy($uploadfile, "./images/" . $filename);
} else {
    echo "Possible file upload attack!\n";
}



header('Location: index.html');
