<?php

/**
 * Script to save uploaded image, crop it and resize it, and update db info.
 */


class LibraryController
{
    private $upload_dir;
    private $db_file;

    public function __construct($upload_dir, $db_file)
    {
        $this->upload_dir = $upload_dir;
        $this->db_file = $db_file;
    }


    public function savePhoto($address, $file)
    {
        $filename = $this->slugify($address) . ".jpg";
        
        $uploadfile = $this->upload_dir . $filename;

        // verify the file is a GIF, JPEG, or PNG
        $fileType = exif_imagetype($file["tmp_name"]);
        $allowed = array(IMAGETYPE_GIF, IMAGETYPE_JPEG, IMAGETYPE_PNG);
        if (!in_array($fileType, $allowed)) {
            echo "Bad file";
            die;
        }


        if (move_uploaded_file($file['tmp_name'], $uploadfile)) {
            $convert_params = "-resize '300x300^' -gravity Center -crop 300x300+0+0";
            exec("convert $uploadfile $convert_params $uploadfile");
            copy($uploadfile, "./images/" . $filename);

            $this->updateDb($address, $filename);
        } else {
            echo "Possible file upload attack!\n";
        }
    }


    public function updateDb($address, $image)
    {
        $db = json_decode(file_get_contents($this->db_file), true);

        $timestamp = new DateTime();
        $ip = $_SERVER['REMOTE_ADDR'];

        foreach ($db as &$library) {
            if ($library['address'] == $address) {
                $library['image'] = $image;
                $library['created_at'] = $timestamp->format('Y-m-d H:i:s');
                $library['created_ip'] = $ip;
            }
        }
        unset($library);

        $r = json_encode($db,  JSON_PRETTY_PRINT);
        $result = file_put_contents($this->db_file, $r);
    }

    public function saveToDb($address, $data)
    {
        $db = json_decode(file_get_contents($this->db_file), true);

        $timestamp = new DateTime();
        $ip = $_SERVER['REMOTE_ADDR'];
        $entry = [
            'address' => $address,
            'created_at' => $timestamp->format('Y-m-d H:i:s'),
            'created_ip' => $ip,
            'coordinates' => [ (float)$data['lat'], (float)$data['lon']]
        ];
        array_push($db, $entry);

        $r = json_encode($db,  JSON_PRETTY_PRINT);

        $result = file_put_contents($this->db_file, $r);
        //print_r($result);
    }


    private function getCoords($address)
    {

        $address .= " Toronto";
        $address = str_replace(' ', '+', $address);

        $url = "http://nominatim.openstreetmap.org/search?format=json&limit=5&q="
                . $address;

        $data = json_decode(file_get_contents($url), true);

        return $data[0];
     
    }

    private function slugify($text)
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
}
