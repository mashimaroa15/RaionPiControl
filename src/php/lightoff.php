<?php
//    attention write 1 to turn off for raion touch
    echo shell_exec('gpio -g mode 12 out && gpio -g write 12 1');

//raion touch
//    echo shell_exec('gpio -g mode 12 out && gpio -g write 12 1');
//    echo shell_exec('/home/pi/script/turnoff.sh');
