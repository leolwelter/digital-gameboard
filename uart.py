import serial
import time

import defaultmap
from cell import Cell
from color import Color
from creature import Creature
from item import Item


class UART:
    BOARD_SIZE_X = 10
    BOARD_SIZE_Y = 10
    BAUD_RATE = 115200
    PORT = '/dev/ttyS0'
    TIMEOUT = .05
    READ_SIZE = 10

    CODE_ADD_MAP = 1
    CODE_ADD_CREATURE = 2
    CODE_ADD_ITEM = 3
    CODE_DELETE_CREATURE = 17
    CODE_DELETE_ITEM = 18
    CODE_PLAYER_TURN = 33
    CODE_CENTER_MAP = 34
    CODE_SCROLL = 35

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


def checkError(ser, command):
    err = ser.read(size=1)
    if not (err == b''):
        print("Attempt to {0} failed\nMicro error: {1}".format(command, err))
        return -1
    return 0


def writeItem(ser, item):
    if (item.x < UART.MAP_SIZE_X and item.y < UART.MAP_SIZE_Y and item.x >= 0 and item.y >= 0):
        ser.write([UART.CODE_ADD_ITEM, item.itemID, item.x, item.y])
        return checkError(ser, "write item")
    return 1


def deleteItem(ser, item):
    ser.write([UART.CODE_DELETE_ITEM, item.itemID])
    return checkError(ser, "delete item")


def writeCreature(ser, creature):
    if (creature.x < UART.MAP_SIZE_X and creature.y < UART.MAP_SIZE_Y and creature.x >= 0 and creature.y >= 0):
        ser.write([UART.CODE_ADD_CREATURE, creature.creatureID, creature.x, creature.y, creature.colorVal(),
                   creature.movement])
        return checkError(ser, "write creature")
    return 1


def deleteCreature(ser, creature):
    ser.write([UART.CODE_DELETE_CREATURE, creature.creatureID])
    return checkError(ser, "delete creature")


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
    return checkError(ser, "scroll creature")


def playerTurn(ser, creature):
    ser.write([UART.CODE_PLAYER_TURN, creature.creatureID])
    return checkError(ser, "player turn")


def waitForMove(ser, character):
    code = ser.read(size=1)
    while code != b'\x01':
        print(code)
        code = ser.read(size=1)
    x = ser.read(size=1)
    y = ser.read(size=1)
    character.x = x
    character.y = y


def centerMap(ser, x, y):
    if x < UART.MAP_SIZE_X and y < UART.MAP_SIZE_Y and x >= 0 and y >= 0:
        ser.write([UART.CODE_CENTER_MAP, x, y])
        return checkError(ser, "center map")
    return 1


# @param sizeX int, sizeY int, cellList int[][], ser Serial
def writeMap(sizeX, sizeY, cellList, ser):
    UART.MAP_SIZE_X = sizeX
    UART.MAP_SIZE_Y = sizeY
    cellList = padCells(cellList, sizeX, sizeY)
    if (sizeX < UART.BOARD_SIZE_X):
        sizeX = UART.BOARD_SIZE_X
    if (sizeY < UART.BOARD_SIZE_Y):
        sizeY = UART.BOARD_SIZE_Y
    cellList = convertMap(cellList)
    if (sizeX < 256 and sizeY < 256):
        ser.flush()
        ser.write([UART.CODE_ADD_MAP])
        ser.write([sizeX])
        ser.write([sizeY])
        ser.write(cellList)
        return checkError(ser, "write map")
    return 1

def cleanMap(ser):
    defaultCells = []
    for coordKey, data in defaultmap.defaultMap.items():
        color = Color(data['color']['red'], data['color']['green'], data['color']['blue'])
        coordX = data['coordX']
        coordY = data['coordY']
        cost = data['cost']
        order = data['order']
        defaultCells.append(Cell(cost, color, coordX=coordX, coordY=coordY, order=order))
        defaultCells.sort(key=lambda cell: cell.order)
    ser.flush()
    ser.write([UART.CODE_ADD_MAP])
    ser.write([10])
    ser.write([10])
    ser.write(defaultCells)
    return checkError(ser, "write map")



def main(args):
    ser = initUART();
    sizeX = 10
    sizeY = 10
    cellList = testMap()

    # write map data
    writeMap(sizeX, sizeY, cellList, ser)

    # init Player Characters
    paul = Creature("Paul", 27, True, Color(3, 1, 1))
    paul.x = 0
    paul.y = 1
    tyler = Creature("Tyler", 5, True, Color(0, 3, 3))
    tyler.x = 1
    tyler.y = 0

    leopluridon = Creature("Leopluridon", 3, True, Color(3, 0, 0))
    leopluridon.x = 9
    leopluridon.y = 6

    # init Items
    # ~ potion = Item("Potion", 2, 0)
    # ~ sword = Item("Sword", 4, 3)

    # write data to current game
    writeCreature(ser, paul)
    writeCreature(ser, tyler)
    writeCreature(ser, leopluridon)

    playerTurn(ser, paul)
    playerTurn(ser, leopluridon)

    cList = [paul, tyler, leopluridon]

    quitFlag = False
    while (not quitFlag):
        selected = input("Whose turn is it? : ")
        for creature in cList:
            if (creature.name == selected):
                playerTurn(ser, creature)
                waitForMove(ser, creature)
                print(creature.x, creature.y)

        if selected == 'quit':
            quitFlag = True
    ser.close()


def printMap(cells, x, y):
    for i in range(0, x * y):
        cells[i].printCell()
        if ((i + 1) % x == 0 and i > 0):
            print("")


def convertMap(cells):
    convertedCells = [cell.toByteStruct() for cell in cells]
    return convertedCells


def padCells(cells, x, y):
    newCells = []
    if (x >= UART.BOARD_SIZE_X):
        if (y >= UART.BOARD_SIZE_Y):
            return cells
        else:
            cells.extend([Cell(0, Color(0, 0, 0))] * (x * (UART.BOARD_SIZE_Y - y)))
    else:
        if (y >= UART.BOARD_SIZE_Y):
            for i in reversed(range(0, y)):
                newCells = [Cell(0, Color(0, 0, 0))] * (UART.BOARD_SIZE_X - x)
                cells[x * (i + 1) - 2: x * (i + 1) - 2] = newCells
        else:
            for i in reversed(range(0, y)):
                newCells = [Cell(0, Color(0, 0, 0))] * (UART.BOARD_SIZE_X - x)
                cells[x * (i + 1): x * (i + 1)] = newCells
            cells.extend([Cell(0, Color(0, 0, 0))] * (UART.BOARD_SIZE_X * (UART.BOARD_SIZE_Y - y)))
    return cells


def createCells(x, y, r, g, b):
    cells = []
    for i in range(0, x * y):
        cell = Cell(1, Color(r, g, b))
        cells.append(cell)
    return cells

def testMap():
    cells = []
    # 1
    cells.append(Cell(1, Color(0, 1, 0)))
    cells.append(Cell(1, Color(0, 1, 0)))
    cells.append(Cell(2, Color(1, 1, 0)))
    cells.append(Cell(2, Color(1, 1, 0)))
    cells.append(Cell(2, Color(1, 1, 0)))
    cells.append(Cell(2, Color(1, 1, 0)))
    cells.append(Cell(2, Color(1, 1, 0)))
    cells.append(Cell(2, Color(1, 1, 0)))
    cells.append(Cell(2, Color(1, 1, 0)))
    cells.append(Cell(2, Color(1, 1, 0)))
    # 2
    cells.append(Cell(1, Color(0, 1, 0)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(2, Color(1, 1, 0)))
    # 3
    cells.append(Cell(1, Color(0, 1, 0)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(2, Color(1, 1, 0)))
    # 4
    cells.append(Cell(1, Color(0, 1, 0)))
    cells.append(Cell(1, Color(0, 1, 0)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(2, Color(1, 1, 0)))
    # 5
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(1, Color(0, 1, 0)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(2, Color(1, 1, 0)))
    # 6
    cells.append(Cell(1, Color(0, 1, 0)))
    cells.append(Cell(1, Color(0, 1, 0)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(1, Color(1, 0, 1)))
    cells.append(Cell(1, Color(0, 1, 0)))
    cells.append(Cell(1, Color(0, 1, 0)))
    cells.append(Cell(1, Color(0, 1, 0)))
    # 7
    cells.append(Cell(1, Color(0, 1, 0)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(1, Color(0, 1, 0)))
    # 8
    cells.append(Cell(1, Color(0, 1, 0)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(1, Color(0, 1, 0)))
    cells.append(Cell(1, Color(0, 1, 0)))
    cells.append(Cell(1, Color(0, 1, 0)))
    cells.append(Cell(1, Color(0, 1, 0)))
    cells.append(Cell(1, Color(0, 1, 0)))
    cells.append(Cell(1, Color(0, 1, 0)))
    # 9
    cells.append(Cell(1, Color(0, 1, 0)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(1, Color(0, 1, 0)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    # 10
    cells.append(Cell(1, Color(0, 1, 0)))
    cells.append(Cell(1, Color(0, 1, 0)))
    cells.append(Cell(1, Color(0, 1, 0)))
    cells.append(Cell(1, Color(0, 1, 0)))
    cells.append(Cell(1, Color(0, 1, 0)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))
    cells.append(Cell(0, Color(0, 0, 1)))

    return cells


if __name__ == '__main__':
    import sys

    sys.exit(main(sys.argv))
