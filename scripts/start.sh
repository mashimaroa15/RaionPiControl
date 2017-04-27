#!/usr/bin/env bash
clear
cd /home/pi
echo ################
echo # START WEBCAM #
echo ################
mjpg_streamer -i "/home/pi/mjpg-streamer/mjpg-streamer-experimental/input_uvc.so -d /dev/video0 -r 640x480 --fps 15" -o "/home/pi/mjpg-streamer/mjpg-streamer-experimental/output_http.so -p 8081" &
mjpg_streamer -i "/home/pi/mjpg-streamer/mjpg-streamer-experimental/input_raspicam.so -x 640 -y 480 -fps 15" -o "/home/pi/mjpg-streamer/mjpg-streamer-experimental/output_http.so -p 8082" &
#/usr/local/bin/mjpg_streamer -i "/usr/local/lib/input_raspicam.so -fps 5" -o "/usr/local/lib/output_http.so" &
echo Webcam started!
#sleep 1
echo ###################
echo # START OCTOPRINT #
echo ###################
#~/RaionPi/venv/bin/python ~/RaionPi/run --daemon start --port 5002 --pid /tmp/octoprint2 --basedir ~/.octoprint
#~/RaionPi/venv/bin/python ~/RaionPi/run --daemon start --port 5003 --pid /tmp/octoprint1 --basedir ~/.octoprint1
raionpi --daemon start
