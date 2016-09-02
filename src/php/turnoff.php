<?php
    echo shell_exec('gpio -g mode 18 out && gpio -g write 18 0');
?>
