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

ADD OR REPLACE:0000[ID]
MAPS:					1
ID			XY Dimensions		One Row at a Time
1 Byte		2 Bytes				X Bytes Y Times
0001		0-255,0-255			((rrggbbmm)*x)*y

PLAYERS AND ENEMIES:	2
ID		Char ID		X Cordinates	Y Cordinates	Color			Max Movement
1 Byte	1 Byte		1 Byte			1 Byte			1 Byte			1 Byte
0010	0-254		0-255			0-255			rrggbbXX		0-255
													(if XX = 01,	(if 0, don't allow movement)
													is player		(if 255 don't run pathfinding, allow movement)
													if XX = 10,
													is enemy)

ITEMS:					3
ID		Item ID		X Cordinates	Y Cordinates
1 Byte	1 Byte		1 Byte			1 Byte
0011	0-254		0-255			0-255

ROOMS:					4
ID		Room ID		top left coords bottom right coords
1 Byte	1 Byte		2 Bytes			2 Bytes
0100	0-254		(0-255),(0-255)	(0-255),(0-255)
(Room for more)

REMOVE 0001[ID]

PLAYERS AND ENEMIES:	17	
ID		Char ID
1 Byte	1 Byte
0001	0-254(255 removes everything)

REMOVE ITEMS:			18
ID		ITEMS ID
1 Byte	1 Byte
0010	0-254(255 removes everything)

REMOVE ROOMS:			19
ID		ITEMS ID
1 Byte	1 Byte
0010	0-254(255 removes everything)

(Room for more)

Flow 0010[ID]

PLAYER TURN:			33
ID		Char ID
1 Byte	1 Byte
0001	0-63

CENTER MAP: (Top Left)	34
ID		X Coord		Y Coord
1 Byte	1 Byte		1 Byte
0010	0-255		0-255

SCROLL:					35
ID		DIRECTION
1 Byte	1 Byte
0011	(1 = Up)(2 = Right)(3 = Down)(4 = Left)

(Room for more)

DRAWING 0011XXXX

Load Image:					49(allows you to load an image)
ID		RGB * 100
1 Byte	300 Bytes
0001	((RGB) * x) * y

Draw Image:					50(puts the image on the screen)	(allows for better timed animations)
ID
1 Byte
0010




/////////////////////////////////////////////////////////////////////////////////////////////////

UART Protocol (Sending):


Packet Structure:

All data should start with a single byte identifying the type of data being sent.
IDs are organized next to similar commands in the following way:

Player Commands:
Byte = 0000XXXX

Draw Commands:(for non combat situations)
Byte = 0001XXXX


Player Commands 0000[ID]:

MOVE PLAYER:
ID		XY Coord	
1 Byte	2 Bytes		
0001	0-255,0-255
		(verified)
					
Attack Player:
ID		XY Coord	Enemy ID
1 Byte	2 Bytes		1 Byte
0010	0-255		0-63

Draw Commands (0001 [ID]):

Button Press:
IDs	 	Button Number
1 Bytes	1 Byte
0001	0-99