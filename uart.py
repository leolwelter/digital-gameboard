#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
#  test-spi.py
#  
#  Copyright 2017  <pi@raspberrypi>
#  
#  This program is free software; you can redistribute it and/or modify
#  it under the terms of the GNU General Public License as published by
#  the Free Software Foundation; either version 2 of the License, or
#  (at your option) any later version.
#  
#  This program is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU General Public License for more details.
#  
#  You should have received a copy of the GNU General Public License
#  along with this program; if not, write to the Free Software
#  Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
#  MA 02110-1301, USA.
#  
#  
import serial
import time

def main(args):
	ser = serial.Serial(
		port='/dev/ttyS0', 
		baudrate=9600,
		parity=serial.PARITY_NONE,
		stopbits=serial.STOPBITS_ONE,
		bytesize=serial.EIGHTBITS
	)
	print(ser.name)
	while(True):
		ser.flush()
		time.sleep(0.001)
		
		# now read one byte
		read_data = ser.read(size=10)
		print("Data: {0}   |   {1}\n".format(read_data, time.time()))

		time.sleep(0.001)
		# write one byte
		write_data = b'ABCDEFGH' * 32
		ser.write(write_data)
	ser.close()
	
	
		

if __name__ == '__main__':
    import sys
    sys.exit(main(sys.argv))

