<?php

/**
 * Script to save uploaded image, crop it and resize it, and update db info.
 */


require_once 'LibraryController.php';


$controller = new LibraryController('../uploads/', '../lfl.json');

$address = $_REQUEST['address'];
$file = $_FILES['photo'];
$action = $_REQUEST['action'];

$id = $_GET['id'];
if ($id) {
    $data = $controller->get($id);
    header('Content-Type: application/json');
    echo json_encode($data);
exit;
}


if (!$action) {
    $data = $controller->getAll();
    header('Content-Type: application/json');
    echo $data;
}

if ($action == 'store') {
    $data = [ 'lat' => $_REQUEST['lat'], 'lon' => $_REQUEST['lon'] ];
    $controller->saveToDb($address, $data);
}


if ($action == 'add') {
    $data = $controller->getCoords($address);
    $controller->saveToDb($address, $data);
}

if ($action == 'photo') {
    $image = $controller->savePhoto($address, $file);

    header('Content-Type: application/json');
    echo json_encode(['address' => $address, 'image' => $image]);
}

//header('Location: index.html');


