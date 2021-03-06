<?php

$method = $_SERVER['REQUEST_METHOD'];

$curl = curl_init();

if ($_POST["command"] === "pause") {
    $post_field = "{\"command\": \"pause\",
                    \"action\": \"pause\"}";
} elseif ($_POST["command"] === "cancel") {
    $post_field = "{\"command\": \"cancel\"}";
}

curl_setopt_array($curl, array(
    CURLOPT_URL => "http://localhost:5001/api/job",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => $method,
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