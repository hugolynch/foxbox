<?php

/**
 * Script to save uploaded image, crop it and resize it, and update db info.
 */


require_once 'LibraryController.php';


$controller = new LibraryController('uploads/');

$address = $_REQUEST['address'];
$file = $_FILES['photo'];

$action = $_REQUEST['action'];

if ($action == 'add') {
    $data = $controller->getCoords($address);
    $controller->saveToDb($address, $data);
}

if ($action == 'photo') {
    $controller->savePhoto($address, $file);
}



header('Location: index.html');


