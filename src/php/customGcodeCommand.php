<?php

$curl = curl_init();

if ($_POST["multiple"] == "no"){
    $post_field = "{\"command\":\"".$_POST["command"]."\"}";
} else {
    $post_field = "{\"commands\":[".$_POST["command"]."]}";
}


curl_setopt_array($curl, array(
    CURLOPT_URL => "http://localhost:5001/api/printer/command",
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