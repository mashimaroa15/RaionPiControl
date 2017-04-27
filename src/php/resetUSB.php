<?php
/**
 * Created by PhpStorm.
 * User: kennysang
 * Date: 27/04/17
 * Time: 18:11
 */

$output = shell_exec('../../scripts/resetUSB.sh');
echo $output;