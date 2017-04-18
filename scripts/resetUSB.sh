#!/usr/bin/env bash
# version 0.1
PORT=$(lsusb | grep -o "[0-9]\{3\}: ID .*QinHeng" | grep -o "^.\{3\}")
echo reset USB on port ${PORT}
sudo /home/pi/scripts/resetUSB /dev/bus/usb/001/${PORT}