<?php
//    attention write 0 to turn on
    echo shell_exec('gpio -g mode 12 out && gpio -g write 12 0');
?>
