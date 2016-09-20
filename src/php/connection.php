<?php

$post_field = "{\"command\": \"connect\",
                \"port\": \"/dev/ttyUSB0\",
                \"baudrate\": 250000,
                \"autoconnect\": true}";
if ($_POST["connect"] == "no") {
    $post_field = "{\"command\": \"disconnect\",
                    \"autoconnect\": true}";
}

//echo json_encode($_POST["connect"]);

$curl = curl_init();

curl_setopt_array($curl, array(
    CURLOPT_URL => "http://localhost:5001/api/connection",
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