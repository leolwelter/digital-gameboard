import pyrebase
from PyQt5 import QtWidgets, QtGui, QtCore
import sys
import ui_cellEditor
import Configuration
import serial
import time
import test_ui
import landingUI
import ui_cellEditor


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
        print(self.user)


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
        self.makeMapGrid()
        self.loginSignal.connect(self.loadApp)


    def loadApp(self):
        self.db = self.firebase.database()
        try:
            users = self.db.child("users").get()
            #test = self.db.child("users").child(self.user["localId"]).shallow().get()
            userdata = users.val()[self.auth.current_user["localId"]]
            self.LandingWindow.show()
        except:
            print("nope")

    def makeMapGrid(self):
        self.mapx = 40
        self.mapy = 40
        self.maplayout = QtWidgets.QGridLayout()
        for i in range(self.mapy):
            for j in range(self.mapx):
                button = QtWidgets.QPushButton()
                button.setObjectName("tile_row" + str(i) + "col" + str(j))
                button.setFixedHeight(30)
                button.setFixedWidth(30)
                button.clicked.connect(lambda z=1, m=i, ll=j: self.editCell(m, ll))
                #button.setText(str(i) + ", " + str(j))
                button.setStyleSheet("background-color: green; border-radius: 0px; border: 1px solid gray;")

                self.maplayout.addWidget(button, i, j, 1, 1)
        self.landingui.scrollAreaWidgetContents.resize(30*j, 30*i)
        self.landingui.scrollAreaWidgetContents.setLayout(self.maplayout)


    def editCell(self, row, col):
        print(str(row) + "row, and col is " + str(col))
        self.EditWindow.show()



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

