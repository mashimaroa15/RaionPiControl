<?php

$cmd = $_POST["command"];
$axe = $_POST["axe"];
$dist = $_POST["dist"];
$feedrate = $_POST["feedrate"];
$axehome = $_POST["axehome"];
switch ($cmd) {
    case "jog":
        $post_field = '{"command": "jog","'.
                        $axe.
                        '":'.$dist.
                        '}';
        break;
    case "feedrate":
        $post_field = '{"command": "feedrate",'.
                        '"factor":'.$feedrate.
                        '}';
        break;
    case "home":
        $post_field = '{"command": "home",'.
                        '"axes":'.$axehome.
                        '}';
}

$curl = curl_init();

curl_setopt_array($curl, array(
    CURLOPT_URL => "http://localhost:5001/api/printer/printhead",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "POST",
    CURLOPT_POSTFIELDS => $post_field,
    CURLOPT_HTTPHEADER => array(
        "cache-control: no-cache",
        "content-type: application/json",
        "x-api-key: raionpi"
    ),
));

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
    echo "cURL Error #:" . $err;
} else {
    echo $response;
}