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

        # Define File menu and add actions
        self.landingui.fileMenu = self.landingui.menubar.addMenu('&File')
        self.landingui.fileMenu.addAction(self.exitAction)
        self.landingui.fileMenu.addAction(self.openMapAction)
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

        # configure firebase
        self.config = Configuration.getConfig()
        self.firebase = pyrebase.initialize_app(self.config)
        self.auth = self.firebase.auth()
        self.db = self.firebase.database()

        # handle login
        self.loginSignal.connect(lambda: self.loadMap(userEmail=self.user['email']))

    def loadMap(self, userEmail=None):
        try:
            self.users = self.db.child("users").get()
            print('getting new map')
            mapName, ok = QInputDialog.getText(None, 'Select Map', 'Enter map name:')
            if ok:
                self.pullMapString(mapName)
            self.makeMapGrid()
            self.cellList = self.cellDictToList(self.map['cells'])
            writeMap(self.map['sizeX'], self.map['sizeY'], self.cellList, self.ser)
            self.LandingWindow.show()
        except Exception as err:
            print("Error in loading application: {0}".format(err))
            sys.exit(1)

    def pullMapString(self, mapName):
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
                tilecolor = self.makeCSSColor(i, j)
                button.setStyleSheet(
                    "background-color: #" + tilecolor + "; border-radius: 0px; border: 1px solid gray;")

                self.maplayout.addWidget(button, i, j, 1, 1)
        self.landingui.scrollAreaWidgetContents.resize(30 * self.mapx, 30 * self.mapy)
        if self.landingui.scrollAreaWidgetContents.layout():
            QWidget().setLayout(self.landingui.scrollAreaWidgetContents.layout())
        self.landingui.scrollAreaWidgetContents.setLayout(self.maplayout)


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
        red = str(
            hex(round(int(self.map["cells"][str(row) + "," + str(col)]["color"]["red"]) * 255 / 7))[2:].zfill(2))
        green = str(
            hex(round(int(self.map["cells"][str(row) + "," + str(col)]["color"]["green"]) * 255 / 7))[2:].zfill(2))
        blue = str(
            hex(round(int(self.map["cells"][str(row) + "," + str(col)]["color"]["blue"]) * 255 / 3))[2:].zfill(2))
        return red + green + blue

    # def pullFirebase(self, jsonDict):
    #     characterInfoString = ""
    #     characters = jsonDict["characters"]
    #     print(characters)
    #     for character in sorted(characters.items()):
    #         characterInfoString += character[0] + "\n"
    #         specs = character[1]
    #         for spec in sorted(specs.items()):
    #             characterInfoString += "\t" + spec[0] + " : " + str(spec[1]) + "\n"
    #         characterInfoString += "\n\n"




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
