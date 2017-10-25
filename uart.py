import serial
import time
from cell import Cell
from color import Color
from creature import Creature

class UART:
	BOARD_SIZE_X = 10
	BOARD_SIZE_Y = 10
	BAUD_RATE = 115200
	PORT = '/dev/ttyS0'
	TIMEOUT = 2
	READ_SIZE = 10
	WRITE_WAIT = .5
	
	CODE_MAP = 1
	CODE_SCROLL = 35
	CODE_ADD_CREATURE = 2
	CODE_DELETE_CREATURE = 17
	CODE_ADD_ITEM = 3
	CODE_DELETE_ITEM = 19
	
	SCROLL_UP = 1
	SCROLL_DOWN = 3
	SCROLL_LEFT = 4
	SCROLL_RIGHT = 2
	
	MAP_SIZE_X = 0
	MAP_SIZE_Y = 0

def initUART():
	ser = serial.Serial(
		port=UART.PORT, 
		baudrate=UART.BAUD_RATE,
		parity=serial.PARITY_NONE,
		stopbits=serial.STOPBITS_ONE,
		bytesize=serial.EIGHTBITS,
		timeout=UART.TIMEOUT
	)
	return ser
	
def writeItem(ser, item):
	if (item.x < UART.MAP_SIZE_X and item.y < UART.MAP_SIZE_Y and item.x >= 0 and item.y >= 0):
		ser.write([UART.CODE_ADD_ITEM, item.itemID, item.x, item.y])
		return 0
	return 1
	
def writeCreature(ser, creature):
	if (creature.x < UART.MAP_SIZE_X and creature.y < UART.MAP_SIZE_Y and creature.x >= 0 and creature.y >= 0):
		ser.write([UART.CODE_ADD_CREATURE, creature.creatureID, creature.x, creature.y, creature.colorVal(), creature.movement])
		return 0
	return 1
	
def deleteCreature(ser, creature):
	ser.write([UART.CODE_DELETE_CREATURE, creature.creatureID])

def scrollMap(direction, ser):
	if (direction == "up"):
		direction = UART.SCROLL_UP
	elif (direction == "down"):
		direction = UART.SCROLL_DOWN
	elif (direction == "left"):
		direction = UART.SCROLL_LEFT
	elif (direction == "right"):
		direction = UART.SCROLL_RIGHT
	ser.write([UART.CODE_SCROLL, direction])
	
#@param sizeX int, sizeY int, cellList int[][], ser Serial
def writeMap(sizeX, sizeY, cellList, ser):
	UART.MAP_SIZE_X = sizeX
	UART.MAP_SIZE_Y = sizeY
	cellList = padCells(cellList, sizeX, sizeY)
	if (sizeX < UART.BOARD_SIZE_X):
		sizeX = UART.BOARD_SIZE_X
	if (sizeY < UART.BOARD_SIZE_Y):
		sizeY = UART.BOARD_SIZE_Y
	#~ printMap(cellList, sizeX, sizeY)
	cellList = convertMap(cellList)
	if (sizeX < 256 and sizeY < 256):
		ser.flush()
		ser.write([UART.CODE_MAP])
		ser.write([sizeX])
		ser.write([sizeY])
		ser.write(cellList)
		return 0
	return 1

def main(args):
	ser = initUART();
	sizeX = 10
	sizeY = 10
	cellList = testMap()#createCells(sizeX,sizeY,0,3,2)
	
	# write map data
	writeMap(sizeX, sizeY,cellList,ser)
	paul = Creature("Paulllll", 10, Color(3,3,3))
	direction = "start"
	while (direction != "quit"):
		time.sleep(UART.WRITE_WAIT)
		if (writeCreature(ser, paul) == 1):
			paul.x = x
			paul.y = y
		x = paul.x
		y = paul.y
		ser.flush()
		direction = input("Enter direction to move: ")
		if (direction == "up"):
			paul.y -= 1
		if (direction == "down"):
			paul.y += 1
		if (direction == "left"):
			paul.x -= 1
		if (direction == "right"):
			paul.x += 1
		if (direction == "reset"):
			paul.x = 0
			paul.y = 0
		#~ if (direction == "up" or direction == "down" or
		#~ direction == "left" or direction == "right"):
			#~ scrollMap(direction, ser)
	deleteCreature(ser, paul)
	print(ser.read(size=UART.READ_SIZE))
	ser.close()
		
def printMap(cells, x, y):
	for i in range(0, x * y):
		cells[i].printCell()
		if ((i + 1) % x == 0 and i > 0):
			print("")

def convertMap(cells):
	convertedCells = [cell.toByteStruct() for cell in cells]
	return convertedCells
	
def padCells(cells,x,y):
	newCells = []
	if (x >= UART.BOARD_SIZE_X):
		if (y >= UART.BOARD_SIZE_Y):
			return cells
		else:
			cells.extend([Cell(0, Color(0,0,0))] * (x * (UART.BOARD_SIZE_Y - y)))
	else:
		if (y >= UART.BOARD_SIZE_Y):
			for i in reversed(range(0, y)):
				newCells = [Cell(0, Color(0,0,0))] * (UART.BOARD_SIZE_X - x)
				cells[x * (i + 1) - 2: x * (i + 1) - 2] = newCells
		else:
			for i in reversed(range(0, y)):
				newCells = [Cell(0, Color(0,0,0))] * (UART.BOARD_SIZE_X - x)
				cells[x * (i + 1): x * (i + 1)] = newCells
			cells.extend([Cell(0, Color(0,0,0))] * (UART.BOARD_SIZE_X * (UART.BOARD_SIZE_Y - y)))
	return cells
	
def createCells(x, y, r, g, b):
	cells = []
	for i in range(0, x * y):
		cell = Cell(1, Color(r, g, b))
		cells.append(cell)
	return cells
	
def testMap():
	cells = []
	
	cells.append(Cell(0, Color(1,0,0)))
	cells.append(Cell(0, Color(1,0,0)))
	cells.append(Cell(2, Color(1,1,0)))
	cells.append(Cell(2, Color(1,1,0)))
	cells.append(Cell(1, Color(1,0,1)))
	cells.append(Cell(0, Color(1,0,0)))
	cells.append(Cell(0, Color(1,0,0)))
	cells.append(Cell(2, Color(1,1,0)))
	cells.append(Cell(2, Color(1,1,0)))
	cells.append(Cell(1, Color(0,1,0)))
	cells.append(Cell(0, Color(1,0,0)))
	cells.append(Cell(2, Color(1,1,0)))
	cells.append(Cell(2, Color(1,1,0)))
	cells.append(Cell(1, Color(0,1,0)))
	cells.append(Cell(0, Color(0,0,1)))
	cells.append(Cell(0, Color(1,0,0)))
	cells.append(Cell(1, Color(0,1,0)))
	cells.append(Cell(1, Color(0,1,0)))
	cells.append(Cell(0, Color(0,0,1)))
	cells.append(Cell(0, Color(0,0,1)))
	cells.append(Cell(0, Color(1,0,0)))
	cells.append(Cell(1, Color(0,1,0)))
	cells.append(Cell(0, Color(0,0,1)))
	cells.append(Cell(0, Color(0,0,1)))
	cells.append(Cell(0, Color(0,0,1)))
	
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	cells.append(Cell(0, Color(0,0,0)))
	
	return cells
	
if __name__ == '__main__':
    import sys
    sys.exit(main(sys.argv))

