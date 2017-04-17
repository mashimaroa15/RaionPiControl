"""\
Simple g-code streaming script for grbl
Provided as an illustration of the basic communication interface
for grbl. When grbl has finished parsing the g-code block, it will
return an 'ok' or 'error' response. When the planner buffer is full,
grbl will not send a response until the planner buffer clears space.
G02/03 arcs are special exceptions, where they inject short line 
segments directly into the planner. So there may not be a response 
from grbl for the duration of the arc.
"""

import serial
import time

# Open grbl serial port
s = serial.Serial('/dev/ttyUSB0',250000)
f = open('/home/pi/scripts/currentVersion.txt','w+')
# Wake up grbl
#s.write("\r\n\r\n")
time.sleep(1)   # Wait for grbl to initialize 
if (s.in_waiting != 0):
	s.reset_input_buffer()
s.reset_input_buffer()
time.sleep(2)
s.write("M283\n") # Send g-code block to grbl
time.sleep(2)
s.reset_input_buffer()
s.write("M283\n")
grbl_out = s.readline() # Wait for grbl response with carriage return
print grbl_out
f.write(grbl_out)
f.close()
s.close() 
