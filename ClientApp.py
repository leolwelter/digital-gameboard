import pyrebase
import sys
from PyQt5.QtWidgets import QMainWindow, QTextEdit, QAction, QApplication
from PyQt5.QtGui import QIcon

import Configuration
import serial
import test_ui
import landingUI
import ui_cellEditor
from loginUI import *
from uart import *

class GameInstance(LoginWindow):
    def __init__(self):
        LoginWindow.__init__(self)
        # initialize windows
        self.AppWindow = QtWidgets.QMainWindow()
        self.appui = test_ui.Ui_MainWindow()
        self.appui.setupUi(self.AppWindow)
        self.LandingWindow = QtWidgets.QMainWindow()
        self.landingui = landingUI.Ui_MainWindow()
        self.landingui.setupUi(self.LandingWindow)
        self.editui = ui_cellEditor.Ui_MainWindow()
        self.EditWindow = QtWidgets.QMainWindow()
        self.editui.setupUi(self.EditWindow)
        self.setWindowIcon(QIcon('favicon.ico'))


        # initialize embedded systems
        try:
            self.ser = initUART()
        except Exception as err:
            print("Error in initUART: {0}".format(err))

        # configure firebase
        self.config = Configuration.getConfig()
        self.firebase = pyrebase.initialize_app(self.config)
        self.auth = self.firebase.auth()
        self.db = self.firebase.database()

        # handle login
        self.loginSignal.connect(lambda: self.onLogin(userEmail=self.user['email']))

    def onLogin(self, userEmail):
        try:
            self.users = self.db.child("users").get()
            self.pullMapString('McDonalds')
            self.makeMapGrid()
            self.cellList = self.cellDictToList(self.map['cells'])
            #writeMap(self.map['sizeX'], self.map['sizeY'], self.cellList, self.ser)
            self.LandingWindow.show()
        except Exception as err:
            print("Error in loading application: {0}".format(err))
            sys.exit(1)


    def cellDictToList(self, cellDict):
        cellList = []
        for coordKey, data in cellDict.items():
            print('{0}   |   {1}'.format(coordKey.split(','), data['color']))
            color = Color(data['color']['red'], data['color']['green'], data['color']['blue'])
            coordX = data['coordX']
            coordY = data['coordY']
            cost = data['cost']
            order = data['order']
            cellList.append(Cell(cost, color, coordX=coordX, coordY=coordY, order=order))
            cellList.sort(key=lambda cell: cell.order)
        return cellList

    def makeMapGrid(self):
        self.mapx = self.map["sizeX"]
        self.mapy = self.map["sizeY"]
        self.maplayout = QtWidgets.QGridLayout()
        for i in range(self.mapy):
            for j in range(self.mapx):
                button = QtWidgets.QPushButton()
                button.setObjectName("tile_row" + str(i) + "col" + str(j))
                button.setFixedHeight(30)
                button.setFixedWidth(30)
                button.clicked.connect(lambda z=1, m=i, ll=j: self.editCell(m, ll))
                self.makeCSSColor(i, j)
                button.setStyleSheet(
                    "background-color: #" + self.tilecolor + "; border-radius: 0px; border: 1px solid gray;")

                self.maplayout.addWidget(button, i, j, 1, 1)
        self.landingui.scrollAreaWidgetContents.resize(30 * self.mapx, 30 * self.mapy)
        self.landingui.scrollAreaWidgetContents.setLayout(self.maplayout)

    def pullMapString(self, mapName):
        self.mapref = self.db.child("users").child(self.user["localId"]).child("maps").child(mapName).get()
        self.map = self.mapref.val()


    def editCell(self, row, col):
        # print(str(row) + "row, and col is " + str(col))
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
        self.editui.gridLayout_3.addWidget(tab1label, 0, 0, 1, 1)
        self.editui.gridLayout_3.addWidget(tab1text, 0, 1, 1, 1)
        self.editui.gridLayout_3.addWidget(tab2label, 1, 0, 1, 1)
        self.editui.gridLayout_3.addWidget(tab2text, 1, 1, 1, 1)
        self.editui.gridLayout_3.addWidget(tab3label, 2, 0, 1, 1)
        self.editui.gridLayout_3.addWidget(tab3text, 2, 1, 1, 1)
        self.editui.gridLayout_3.addWidget(cellupdatebtn, 3, 0, 1, 1)
        self.EditWindow.show()

    def makeCSSColor(self, row, col):
        self.red = str(
            hex(round(int(self.map["cells"][str(row) + "," + str(col)]["color"]["red"]) * 255 / 7))[2:].zfill(2))
        self.green = str(
            hex(round(int(self.map["cells"][str(row) + "," + str(col)]["color"]["green"]) * 255 / 7))[2:].zfill(2))
        self.blue = str(
            hex(round(int(self.map["cells"][str(row) + "," + str(col)]["color"]["blue"]) * 255 / 3))[2:].zfill(2))
        self.tilecolor = self.red + self.green + self.blue

    def pullFirebase(self, jsonDict):
        characterInfoString = ""
        characters = jsonDict["characters"]
        print(characters)
        for character in sorted(characters.items()):
            characterInfoString += character[0] + "\n"
            specs = character[1]
            for spec in sorted(specs.items()):
                characterInfoString += "\t" + spec[0] + " : " + str(spec[1]) + "\n"
            characterInfoString += "\n\n"
        self.appui.textBrowser.setText(characterInfoString)


if __name__ == '__main__':
    app = QtWidgets.QApplication(sys.argv)
    GameInstance = GameInstance()
    screen = app.primaryScreen()
    size = screen.size()
    rect = screen.availableGeometry()
    print('Screen: %s' % screen.name())
    print('Size: %d x %d' % (size.width(), size.height()))
    print('Available: %d x %d' % (rect.width(), rect.height()))
    sys.exit(app.exec_())
