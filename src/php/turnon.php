<?php
//    attention write 0 to turn on for raion touch
    echo shell_exec('gpio -g mode 18 out && gpio -g write 18 0');

//raion touch
//    echo shell_exec('gpio -g mode 12 out && gpio -g write 12 0');
//    echo shell_exec('/home/pi/script/turnon.sh');
