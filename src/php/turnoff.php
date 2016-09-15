<?php
//    attention write 1 to turn off
    echo shell_exec('gpio -g mode 12 out && gpio -g write 12 0');
//    echo shell_exec('gpio -g mode 12 out && gpio -g write 12 1');
//    echo shell_exec('/home/pi/script/turnoff.sh');
