<?php
/**
 * Created by PhpStorm.
 * User: lnguyen
 * Date: 28/04/2017
 * Time: 11:59
 */

$output = shell_exec('sudo -u pi ../../scripts/update_RaionPiControl.sh');
echo $output;