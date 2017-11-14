
# python core
import sys

# PyQt
from PyQt5.QtWidgets import QMainWindow, QTextEdit, QAction, QApplication, QInputDialog, QWidget
from PyQt5.QtGui import QIcon

# UI components
import test_ui
import landingUI
import ui_cellEditor
from loginUI import *
from extendPushButton import myButton

# embedded
import serial
from uart import *

# database
import pyrebase
import Configuration

class GameInstance(LoginWindow):
    def __init__(self):
        LoginWindow.__init__(self)
        # initialize windows
        self.AppWindow = QtWidgets.QMainWindow()

        ### landing window
        self.LandingWindow = QtWidgets.QMainWindow()
        self.landingui = landingUI.Ui_MainWindow()
        self.landingui.setupUi(self.LandingWindow)

        # Define Actions
        self.openMapAction = QAction(QIcon('open.png'), 'Load Map')
        self.openMapAction.triggered.connect(self.loadMap)
        self.exitAction = QAction(QIcon('exit24.png'), 'Exit')
        self.exitAction.triggered.connect(sys.exit)
        self.loadCharacterAction = QAction(QIcon('open.png'), 'Load Character')
        self.loadCharacterAction.triggered.connect(self.loadCharacter)
        self.loadMonsterAction = QAction(QIcon('open.png'), 'Load Monster')
        self.loadMonsterAction.triggered.connect(self.loadMonster)

        # Define File menu and add actions
        self.landingui.fileMenu = self.landingui.menubar.addMenu('&File')
        self.landingui.fileMenu.addAction(self.exitAction)
        self.landingui.fileMenu.addAction(self.openMapAction)

        # Define Characters menu
        self.landingui.characterMenu = self.landingui.menubar.addMenu('&Characters')
        self.landingui.characterMenu.addAction(self.loadCharacterAction)
        self.landingui.characterMenu.addAction(self.loadMonsterAction)

        ### landing window ###

        self.editui = ui_cellEditor.Ui_MainWindow()
        self.EditWindow = QtWidgets.QMainWindow()
        self.editui.setupUi(self.EditWindow)
        self.setWindowIcon(QIcon('favicon.ico'))


        # initialize embedded systems
        try:
            self.ser = initUART()
        except Exception as err:
            print("Error in initUART: {0}".format(err))

        # handle login
        self.loginSignal.connect(lambda: self.loadMap())

        # configure firebase
        self.config = Configuration.getConfig()
        self.firebase = pyrebase.initialize_app(self.config)
        self.auth = self.firebase.auth()
        self.db = self.firebase.database()
        self.users = self.db.child("users").get()
        self.charRefList = []
        self.charDataList = [] # player characters saved on map (sync Pi <-> Firebase)
        self.playerCreatureList = [] # player characters on board (sync Board <-> Pi)
        self.monsterRefList = []
        self.monsterDataList = [] # monsters on map (Pi <-> Firebase)
        self.monsterCreatureList = [] # monsters on board (sync Board <-> Pi))


    def loadCharacter(self):
        try:
            characters = self.db.child("users").child(self.user['localId']).child('characters').shallow().get().val()
            charName, ok = QInputDialog.getItem(self, "Select Character", "Name:", characters, 0, False)
            if ok and charName:
                coordY, ok = QInputDialog.getInt(self, "Coordinates", "Row?", 0, 0, self.mapy, 1)
                if coordY and ok:
                    coordX, ok = QInputDialog.getInt(self, "Coordinates", "Column?", 0, 0, self.mapx, 1)
                    if coordX and ok:
                        charRef = self.db.child("users").child(self.user['localId']).child('characters').child(charName).get()
                        charData = charRef.val()

                        # add creature to Pi list
                        self.charRefList.append(charRef)
                        self.charDataList.append(charData)

                        # add creature to cell in Firebase, to creatures list in Firebase
                        self.map['cells'][str(coordY) + ',' + str(coordX)]['creature'] = charData
                        if self.map.get('characters'):
                            self.map['characters'][charData['name']] = charData # DO NOT append (these should be unique)
                        self.db.child('users').child(self.user['localId']).child('maps').child(self.map['name']).update(self.map, token=self.user['idToken'])
                        charCreature = Creature(charData['name'], charData.get('speed'), True, Color(0, 1, 2), coordX, coordY)
                        self.playerCreatureList.append(charCreature)

                        # load creature onto Board
                        writeCreature(self.ser, charCreature)
        except Exception as err:
            print("Error loading character: {0}".format(err))

    def loadMonster(self):
        try:
            monsters = self.db.child("users").child(self.user['localId']).child('monsters').shallow().get().val()
            monsterName, ok = QInputDialog.getItem(self, "Select Monster", "Name:", monsters, 0, False)
            if ok and monsterName:
                coordY, ok = QInputDialog.getInt(self, "Coordinates", "Row?", 0, 0, self.mapy, 1)
                if coordY and ok:
                    coordX, ok = QInputDialog.getInt(self, "Coordinates", "Column?", 0, 0, self.mapx, 1)
                    if coordX and ok:
                        monsterRef = self.db.child("users").child(self.user['localId']).child('monsters').child(monsterName).get()
                        monsterData = monsterRef.val()

                        # add creature to Pi list
                        self.monsterRefList.append(monsterRef)
                        self.monsterDataList.append(monsterData)

                        # add creature to cell in Firebase, to creatures list in Firebase
                        self.map['cells'][str(coordY) + ',' + str(coordX)]['creature'] = monsterData
                        self.map['monsters'][monsterData['name']] = monsterData # DO NOT append (these should be unique)
                        self.db.child('users').child(self.user['localId']).child('maps').child(self.map['name']).update(self.map, token=self.user['idToken'])
                        monsterCreature = Creature(monsterData['name'], 255, False, Color(3, 0, 0), coordX, coordY)
                        self.playerCreatureList.append(monsterCreature)

                        # load creature onto Board
                        writeCreature(self.ser, monsterCreature)
        except Exception as err:
            print("Error loading character: {0}".format(err))

    def loadMap(self):
        try:
            self.users = self.db.child("users").get()
            print('getting new map')
            # delete all current characters from the MCU
            for creature in self.playerCreatureList:
                deleteCreature(self.ser, creature)
            for monster in self.monsterCreatureList:
                deleteCreature(self.ser, monster)

            # get new map name from user
            maps = self.db.child("users").child(self.user['localId']).child('maps').shallow().get().val()
            mapName, ok = QInputDialog.getItem(self, "Select Map", "Name:", maps, 0, False)
            if ok:
                self.getMapByName(mapName)

            # parse map data
            self.cellList = self.cellDictToList(self.map['cells']) # form readable by Board
            self.playerCreatureList = self.creatureDictToList(self.map.get('characters'), isPlayer=True)
            self.monsterCreatureList = self.creatureDictToList(self.map.get('monsters'), isPlayer=False)
            self.makeMapGrid()

            # write map, characters, and monsters to the board
            writeMap(self.map['sizeX'], self.map['sizeY'], self.cellList, self.ser)
            for creature in (self.playerCreatureList + self.monsterCreatureList):
                writeCreature(self.ser, creature)
            self.LandingWindow.show()
        except Exception as err:
            print("Error in loading application: {0}".format(err))
            sys.exit(1)

    def getMapByName(self, mapName):
        self.mapref = self.db.child("users").child(self.user["localId"]).child("maps").child(mapName).get()
        self.map = self.mapref.val()

    def cellDictToList(self, cellDict):
        cellList = []
        for coordKey, data in cellDict.items():
            #print('{0}   |   {1}'.format(coordKey.split(','), data['color']))
            color = Color(data['color']['red'], data['color']['green'], data['color']['blue'])
            coordX = data['coordX']
            coordY = data['coordY']
            cost = data['cost']
            order = data['order']
            cellList.append(Cell(cost, color, coordX=coordX, coordY=coordY, order=order))
            cellList.sort(key=lambda cell: cell.order)
        return cellList

    def creatureDictToList(self, cDict, isPlayer=False):
        # parse dictionary of creature data, return list of Creatures
        cList = []
        if cDict:
            for name, data in cDict.items():
                creature = Creature(name, data.get('speed'), isPlayer, Color(0, 1, 2), )
                cList.append(creature)
        return cList

    def makeMapGrid(self):
        self.mapx = self.map["sizeX"]
        self.mapy = self.map["sizeY"]
        self.maplayout = QtWidgets.QGridLayout()
        for i in range(self.mapy):
            for j in range(self.mapx):
                button = myButton()
                button.setObjectName("tile_row" + str(i) + "col" + str(j))
                button.setFixedHeight(30)
                button.setFixedWidth(30)
                button.clicked.connect(lambda z=1, m=i, ll=j: self.editCell(m, ll))
                tilecolor = self.makeCSSColor(i, j)

                # if there's a creature on the cell, draw it
                if self.map['cells'][str(i) + ',' + str(j)].get('creature'):
                    button.setText(self.map['cells'][str(i) + ',' + str(j)].get('creature')['name'][0])
                button.setStyleSheet(
                    "background-color: #" + tilecolor + "; border-radius: 0px; border: 1px solid gray;")
                self.maplayout.addWidget(button, i, j, 1, 1)
        self.landingui.scrollAreaWidgetContents.resize(30 * self.mapx, 30 * self.mapy)
        if self.landingui.scrollAreaWidgetContents.layout():
            QWidget().setLayout(self.landingui.scrollAreaWidgetContents.layout())
        self.landingui.scrollAreaWidgetContents.setLayout(self.maplayout)


    def editCell(self, row, col):
        self.showCellInfo(row, col)
        currentCell = self.map["cells"][str(row) + "," + str(col)]
        tab1text = QtWidgets.QLineEdit()
        tab1label = QtWidgets.QTextBrowser()
        tab1label.setText("Red Value:")
        tab1label.setFixedHeight(30)
        tab1text.setText(str(currentCell["color"]["red"]))
        tab2label = QtWidgets.QTextBrowser()
        tab2label.setText("Green Value:")
        tab2label.setFixedHeight(30)
        tab2text = QtWidgets.QLineEdit()
        tab2text.setText(str(currentCell["color"]["green"]))
        tab3label = QtWidgets.QTextBrowser()
        tab3label.setText("Blue Value:")
        tab3label.setFixedHeight(30)
        tab3text = QtWidgets.QLineEdit()
        tab3text.setText(str(currentCell["color"]["blue"]))
        cellupdatebtn = QtWidgets.QPushButton()
        cellupdatebtn.setText("Update cell")
        cellupdatebtn.clicked.connect(lambda cell=currentCell: self.updateCell(cell))
        self.editui.gridLayout_3.addWidget(tab1label, 0, 0, 1, 1)
        self.editui.gridLayout_3.addWidget(tab1text, 0, 1, 1, 1)
        self.editui.gridLayout_3.addWidget(tab2label, 1, 0, 1, 1)
        self.editui.gridLayout_3.addWidget(tab2text, 1, 1, 1, 1)
        self.editui.gridLayout_3.addWidget(tab3label, 2, 0, 1, 1)
        self.editui.gridLayout_3.addWidget(tab3text, 2, 1, 1, 1)
        self.editui.gridLayout_3.addWidget(cellupdatebtn, 3, 0, 1, 1)
        self.EditWindow.show()

    def showCellInfo(self, row, col):
        currentCell = self.map["cells"][str(row) + "," + str(col)]
        cellinfostring = ""
        cellinfostring += self.map["name"]+"\n\n"
        cellinfostring += "Width: "+str(self.map["sizeX"])+"\n"
        cellinfostring += "Height:"+str(self.map["sizeY"])+"\n\n"
        cellinfostring += "Current Cell: "+"("+str(row)+","+str(col)+")\n"
        #cellinfostring += "\tItems: "+currentCell["items"]
        self.landingui.textBrowser.setText(cellinfostring)

    def updateCell(self, cellData):
        print("Celldata {0}".format(cellData))
        print(self.EditWindow)




    def makeCSSColor(self, row, col):
        cell = self.map["cells"][str(row) + ',' + str(col)]
        if cell.get("creature"):
            return "0007FF"  # TODO: replace with actual character color
        else:
            red = str(
                hex(round(int(cell["color"]["red"]) * 255 / 7))[2:].zfill(2))
            green = str(
                hex(round(int(cell["color"]["green"]) * 255 / 7))[2:].zfill(2))
            blue = str(
                hex(round(int(cell["color"]["blue"]) * 255 / 3))[2:].zfill(2))
            return red + green + blue





if __name__ == '__main__':
    app = QtWidgets.QApplication(sys.argv)
    GameInstance = GameInstance()
    screen = app.primaryScreen()
    size = screen.size()
    rect = screen.availableGeometry()
    # print('Screen: %s' % screen.name())
    # print('Size: %d x %d' % (size.width(), size.height()))
    # print('Available: %d x %d' % (rect.width(), rect.height()))
    sys.exit(app.exec_())
