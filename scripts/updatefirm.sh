#!/bin/bash
#================================================
#=============Version check script===============
#=======Author: Tung Doan Date 07/07/16==========
#================================================
# Requirements: avrdude, avrdude conf with wiring / arduino, cut, grep
# NOTES: firmware.hex must be in the same folder with this script

 
		echo "Start updating"
		avrdude -p m2560 -c wiring -b 115200 -D -P /dev/ttyUSB0 -U flash:w:/home/pi/scripts/firmware.hex:i -vvv 
		if test $? == "0"
		then
			echo "Upgrade successfully"
		else 
			echo "Upgrade error: $?"
			## send back log to server?
		fi
