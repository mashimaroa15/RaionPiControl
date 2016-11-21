<?php
// Output JSON
function outputJSON($msg, $status = 'error'){
    header('Content-Type: application/json');
    die(json_encode(array(
        'data' => $msg,
        'status' => $status
    )));
}

$dir = "/home/pi/.octoprint/uploads";
//$dir = "/tmp/php";
$path = $dir."/";

// create new directory with 744 permissions if it does not exist yet
// owner will be the user/group the PHP script is run under
if ( !file_exists($dir) ) {
    $oldmask = umask(0);  // helpful when used in linux server
    if (!mkdir ($dir, 0766)) {
        outputJSON('An error ocurred when create directory.');
    }

}

// Check for errors
if($_FILES['SelectedFile']['error'] > 0){
    outputJSON('An error ocurred when uploading.');
}

//if(!getimagesize($_FILES['SelectedFile']['tmp_name'])){
//    outputJSON('Please ensure you are uploading an image.');
//}
//
// Check filetype
$allowed =  array('gcode','stl');
$filename = $_FILES['SelectedFile']['name'];
$ext = pathinfo($filename, PATHINFO_EXTENSION);
if(!in_array($ext,$allowed) ) {
    outputJSON('Unsupported filetype uploaded.');
}

// Check filesize
if($_FILES['SelectedFile']['size'] > 20000000){
    outputJSON('File uploaded exceeds maximum upload size.');
}

// Check if the file exists
if(file_exists($path . $_FILES['SelectedFile']['name'])){
    outputJSON('File with that name already exists.');
}

// Upload file
if(!move_uploaded_file($_FILES['SelectedFile']['tmp_name'], $path . $_FILES['SelectedFile']['name'])){
    outputJSON('Error uploading file - check destination is writeable : '.$path. $_FILES['SelectedFile']['name']);
}

// Success!
outputJSON('File uploaded successfully to "' . $path . $_FILES['SelectedFile']['name'] . '".', 'success');