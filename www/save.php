<?php

/**
 * Script to save uploaded image, crop it and resize it, and update db info.
 */


$address = $_POST['loc'];
$file = $_FILES['photo'];

save_photo($address, $file);


header('Location: index.html');


function save_photo($address, $file)
{
    $filename = slugify($address) . ".jpg";
    
    $uploaddir = 'uploads/';
    $uploadfile = $uploaddir . $filename;

    // verify the file is a GIF, JPEG, or PNG
    $fileType = exif_imagetype($file["tmp_name"]);
    $allowed = array(IMAGETYPE_GIF, IMAGETYPE_JPEG, IMAGETYPE_PNG);
    if (!in_array($fileType, $allowed)) {
        echo "Bad file";
        die;
    }


    if (move_uploaded_file($file['tmp_name'], $uploadfile)) {
        exec("convert $uploadfile -resize '300x300^' -gravity Center -crop 300x300+0+0 $uploadfile");
        copy($uploadfile, "./images/" . $filename);

        update_db($address, $filename);
    } else {
        echo "Possible file upload attack!\n";
    }
}


function slugify($text)
{
  // replace non letter or digits by -
  $text = preg_replace('~[^\pL\d]+~u', '-', $text);

  // transliterate
  $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);

  // remove unwanted characters
  $text = preg_replace('~[^-\w]+~', '', $text);

  // trim
  $text = trim($text, '-');

  // remove duplicate -
  $text = preg_replace('~-+~', '-', $text);

  // lowercase
  $text = strtolower($text);

  if (empty($text)) {
    return 'n-a';
  }

  return $text;
}

function update_db($address, $image)
{
    $db = json_decode(file_get_contents("./libraries.json"), true);

    foreach ($db as &$library) {
        if ($library['address'] == $address) {
            $library['image'] = $image;
        }
    }
    unset($library);


    $r = json_encode($db,  JSON_PRETTY_PRINT);
    $result = file_put_contents("./libraries.json", $r);
}

