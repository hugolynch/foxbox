<?php

/*
    Program to standardize street names 
*/


$addresses = [
    '2789 Lake Shore Blvd W',
    '37 Avon Avenue',
    '500 Queen St',
    '89 Armadale ave',
    "8 Rosita Cres.",
    "666 Durie St",
    "548 Atlas Ave.",
    "112 Braemore Gardens",
    "84 Caithness Avenue, front yard",
    "127 Highbourne Road",
    "65 King Georges Rd",
    "21 Airdrie Rd.",
    "247 Hastings Avenue",
    "25 Delaney Crescent",
    "15 Magwood Court",
];


$mappings = [
    'Ave.' => ['Avenue', 'Av'],
    'Blvd.' => ['Boulevard'],
    'Cir.' => ['Circle'],
    'Crt.' => ['Court'],
    'Cres.' => ['Crescent'],
    'Dr.' => ['Drive'],
    'Espl.' => ['Esplanade'],
    'Expy.' => ['Expressway'],
    'Hwy.' => ['Highway'],
    'Pk.' => ['Park'],
    'Pky.' => ['Parkway'],
    'Pl.' => ['Place'],
    'Rd.' => ['Road'],
    'St.' => ['Street'],
    'Sq.' => ['Square']
];


foreach ($addresses as $address) {
    foreach ($mappings as $key => $value) {
        $patterns = get_patterns($key, $value);

        $address = preg_replace($patterns, $key, $address, 1);
    }
    echo "$address\n";
}




/* Get list of patterns and convert them to regex pattern */
function get_patterns($key, $patterns) {

    // Add target key, without period at end
    $patterns[] = preg_replace("/\.$/","", $key);

    $p = [];
    foreach ($patterns as &$pattern) {
        //$pattern = '/' . $pattern . '\z/i';
        $p[] = '/' . $pattern . '\z/i';
        //$p[] = '/' . $pattern . '/i';
    }
    unset($pattern);
    return $p;
}
