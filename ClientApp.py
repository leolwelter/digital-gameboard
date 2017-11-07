import pyrebase
from PyQt5 import QtWidgets, QtGui, QtCore
import sys
import Configuration
import serial
import time
import test_ui
import landingUI
import ui_cellEditor
import json


#class ApplicationWindow(QtWidgets.QMainWindow, test_ui.Ui_MainWindow):
#    def __init__(self, parent=None):
#        super(ApplicationWindow, self).__init__(parent)
#        self.setupUi(self)#
#
#    def pullFirebase(self, jsonDict):
#        characterInfoString = ""
#        characters = jsonDict["characters"]
#        for character in sorted(characters.items()):
#            characterInfoString += character[0] + "\n"
#            specs = character[1]
#            for spec in sorted(specs.items()):
#                characterInfoString += "\t"+spec[0]+" : "+str(spec[1])+"\n"
#            characterInfoString += "\n\n"
#        #print(characterInfoString)
#        self.textBrowser.setText(characterInfoString)



class LoginWindow(QtWidgets.QWidget):
    loginSignal = QtCore.pyqtSignal()

    def __init__(self):
        super(LoginWindow, self).__init__()
        self.initUI()
        self.user = 0

    def initUI(self):
        self.setGeometry(0, 0, 400, 220)
        self.setWindowTitle("Digital Game Board Console")
        self.loginForm = QtWidgets.QFormLayout(self)
        self.uname = QtWidgets.QLineEdit(self)
        self.passw = QtWidgets.QLineEdit(self)
        self.passw.setEchoMode(QtWidgets.QLineEdit.Password)
        self.loginForm.addRow(QtWidgets.QLabel("Enter username and password:\n"))
        self.loginForm.addRow(QtWidgets.QLabel("Username:"), self.uname)
        self.loginForm.addRow(QtWidgets.QLabel("Password:"), self.passw)
        self.validation = QtWidgets.QLabel("\n\n")
        self.loginForm.addRow(self.validation)
        self.pushb = QtWidgets.QPushButton("Sign In")
        self.loginForm.addRow(self.pushb)
        self.pushb.clicked.connect(self.attemptLogin2)

        self.show()

    def attemptLogin2(self):
        username = self.uname.text()
        password = self.passw.text()
        self.config = Configuration.getConfig()
        self.firebase = pyrebase.initialize_app(self.config)
        self.auth = self.firebase.auth()
        try:
            self.user = self.auth.sign_in_with_email_and_password(username, password)
            self.hide()
            self.loginSignal.emit()  # EMIT SIGNAL
        except:
            self.validation.setText("Incorrect login information.\n")
            #self.loginSignal.emit()  # EMIT SIGNAL
        #print(self.auth.current_user)
        #print("in attemptlogin2")


class GameInstance(LoginWindow):
    def __init__(self):
        LoginWindow.__init__(self)
        self.AppWindow = QtWidgets.QMainWindow()
        self.appui = test_ui.Ui_MainWindow()
        self.appui.setupUi(self.AppWindow)
        self.LandingWindow = QtWidgets.QMainWindow()
        self.landingui = landingUI.Ui_MainWindow()
        self.landingui.setupUi(self.LandingWindow)
        self.editui = ui_cellEditor.Ui_MainWindow()
        self.EditWindow = QtWidgets.QMainWindow()
        self.editui.setupUi(self.EditWindow)
        self.loginSignal.connect(self.loadApp)


    def loadApp(self):
        self.db = self.firebase.database()
        try:
            #users = self.db.child("users").get()
            #test = self.db.child("users").child(self.user["localId"]).shallow().get()
            self.pullMapString()
            self.makeMapGrid()
            self.LandingWindow.show()
        #except:
        #    print("nopeee")
        finally:
            pass

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
                button.setStyleSheet("background-color: #"+self.tilecolor+"; border-radius: 0px; border: 1px solid gray;")

                self.maplayout.addWidget(button, i, j, 1, 1)
        self.landingui.scrollAreaWidgetContents.resize(30*self.mapx, 30*self.mapy)
        self.landingui.scrollAreaWidgetContents.setLayout(self.maplayout)

    def pullMapString(self):
        self.mapref = self.db.child("users").child(self.user["localId"]).child("maps").child("Testmap").get()
        self.map = self.mapref.val()


    def editCell(self, row, col):
        #print(str(row) + "row, and col is " + str(col))
        currentCell = self.map["cells"][str(row)+","+str(col)]
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
        self.red = str(hex(round(int(self.map["cells"][str(row)+","+str(col)]["color"]["red"])*255/7))[2:].zfill(2))
        self.green = str(hex(round(int(self.map["cells"][str(row)+","+str(col)]["color"]["green"])*255/7))[2:].zfill(2))
        self.blue = str(hex(round(int(self.map["cells"][str(row)+","+str(col)]["color"]["blue"])*255/3))[2:].zfill(2))
        self.tilecolor = self.red + self.green + self.blue


    #def populateEditor(self, row, col):


    def pullFirebase(self, jsonDict):
        characterInfoString = ""
        characters = jsonDict["characters"]
        print(characters)
        for character in sorted(characters.items()):
            characterInfoString += character[0] + "\n"
            specs = character[1]
            for spec in sorted(specs.items()):
                characterInfoString += "\t"+spec[0]+" : "+str(spec[1])+"\n"
            characterInfoString += "\n\n"
        #print(characterInfoString)
        self.appui.textBrowser.setText(characterInfoString)




def serial(args):
    ser = serial.Serial(
        port='/dev/ttyS0',
        baudrate=9600,
        parity=serial.PARITY_NONE,
        stopbits=serial.STOPBITS_ONE,
        bytesize=serial.EIGHTBITS
    )
    print(ser.name)
    while (True):
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
    app = QtWidgets.QApplication(sys.argv)
    GameInstance = GameInstance()
    #serial()

    sys.exit(app.exec_())

