import pyrebase
from PyQt5 import QtWidgets, QtGui, QtCore
import sys
import ui_cellEditor
import Configuration






class LoginWindow(QtWidgets.QWidget):
    def __init__(self):
        super().__init__()
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
        pushb = QtWidgets.QPushButton("Sign In")
        self.loginForm.addRow(pushb)
        pushb.clicked.connect(self.attemptLogin)

        self.show()

    def attemptLogin(self):
        username = self.uname.text()
        password = self.passw.text()
        config = Configuration.getConfig()
        firebase = pyrebase.initialize_app(config)
        auth = firebase.auth()
        try:
            self.user = auth.sign_in_with_email_and_password(username, password)
        except:
            self.validation.setText("Incorrect login information.\n")
        print(self.user)


class GameInstance(LoginWindow):
    def __init__(self):
        self.config = Configuration.getConfig()
        LoginWindow.__init__(self)



if __name__ == '__main__':
    app = QtWidgets.QApplication(sys.argv)
    #login = LoginWindow()
    GameInstance = GameInstance()

    sys.exit(app.exec_())

