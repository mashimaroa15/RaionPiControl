<?php
/**
 * Created by PhpStorm.
 * User: lnguyen
 * Date: 28/04/2017
 * Time: 16:22
 */

// Example JSON
/*
{
    "infos": {
        "id":"R3DPR",
        "name":"Raion PAA 3"
        "owner":"3DRaion"
    },
    "dimensions": {
        "x":220,
        "y":220,
        "z":198
    },
    "versions": {
        "RaionPiControl":"1.0.1",
        "Marlin":"2.0.1"
    }
}
*/

// Output JSON
function outputJSON($msg, $status = 'error'){
    header('Content-Type: application/json');
    die(json_encode(array(
        'data' => $msg,
        'status' => $status
    )));
}

$filepath = '/home/pi/printerInfo.json';

// Return result
if(!file_exists($filepath)){
    outputJSON('File doesn\'t exists.');
} else {
    // Read JSON file
    $json = file_get_contents($filepath);

    // Decode JSON
    $json_data = json_decode($json,true);

    outputJSON($json_data);
}
