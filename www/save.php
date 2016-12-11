<?php

/**
 * Script to save uploaded image, crop it and resize it, and update db info.
 */


require_once 'LibraryController.php';


$controller = new LibraryController('uploads/', 'lfl.json');

$address = $_REQUEST['address'];
$file = $_FILES['photo'];
$action = $_REQUEST['action'];


if ($action == 'store') {
    $data = [ 'lat' => $_REQUEST['lat'], 'lon' => $_REQUEST['lon'] ];
    $controller->saveToDb($address, $data);
}


if ($action == 'add') {
    $data = $controller->getCoords($address);
    $controller->saveToDb($address, $data);
}

if ($action == 'photo') {
    $controller->savePhoto($address, $file);
}

header('Location: index.html');


