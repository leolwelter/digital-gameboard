DND Gameboard
Embedded C

UART Protocol (RECEIVING):

Baud:			9600
Word Length:	8 Bits
Parity:			None
Stop Bits: 		1


Packet Structure:

All data should start with a single byte identifying the type of data being sent.
IDs are organized next to similar commands in the following way:

ADD(or REPLACE) Commands:
Byte = 0000XXXX

REMOVE Commands:
Byte = 0001XXXX

Flow Commands:
Byte = 0010XXXX

Draw Commands:(for non combat situations)
Byte = 0011XXXX


All other data should be structured in the following format:

ADD(or Replace) 0000[ID]
MAPS:
ID			XY Dimensions		One Row at a Time
1 Byte		2 Bytes				X Bytes Y Times
0001		0-255,0-255			((rrggbbmm)*x)*y

ADD OR REPLACE:
PLAYERS AND ENEMIES:
ID		Char ID		X Cordinates	Y Cordinates	Color		Max Movement
1 Byte	1 Byte		1 Byte			1 Byte			1 Byte		1 Byte
0010	0-63		0-255			0-255			rrrgggbb	0-255
																(if 0, don't allow movement)
																(if 255 don't run pathfinding, allow movement)

ITEMS:
ID		Item ID		X Cordinates	Y Cordinates
1 Byte	1 Byte		1 Byte			1 Byte
0011	0-63		0-255			0-255

(Room for more)

REMOVE 0001[ID]

PLAYERS AND ENEMIES:
ID		Char ID
1 Byte	1 Byte
0001	0-63

REMOVE ITEMS:
ID		ITEMS ID
1 Byte	1 Byte
0010	0-63

(Room for more)

Flow 0010[ID]

PLAYER TURN:
ID		Char ID
1 Byte	1 Byte
0001	0-63

CENTER MAP: (Top Left)
ID		X Coord		Y Coord
1 Byte	1 Byte		1 Byte
0010	0-255		0-255

SCROLL:
ID		DIRECTION
1 Byte	1 Byte
0011	(1 = Up)(2 = Right)(3 = Down)(4 = Left)

(Room for more)

DRAWING 0011XXXX

(NOT IMPLEMENTED)