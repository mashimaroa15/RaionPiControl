<?php
//    attention write 1 to turn off
    echo shell_exec('gpio -g mode 12 out && gpio -g write 12 1');
?>
