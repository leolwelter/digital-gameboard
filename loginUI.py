import pyrebase
from PyQt5 import QtWidgets, QtGui, QtCore
from PyQt5.QtCore import QRect
from PyQt5.QtWidgets import QDesktopWidget

import Configuration

class LoginWindow(QtWidgets.QWidget):
    loginSignal = QtCore.pyqtSignal()

    def __init__(self):
        super(LoginWindow, self).__init__()
        self.initUI()
        self.user = 0
        self.username = ''
        self.config = Configuration.getConfig()
        self.firebase = pyrebase.initialize_app(self.config)
        self.auth = self.firebase.auth()


    def initUI(self):
        screenSize = QDesktopWidget().availableGeometry()
        currentSize = self.frameGeometry()
        self.setGeometry(screenSize)
        self.setGeometry(500, 300, 300, 220)
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
        self.pushb.clicked.connect(self.attemptLogin)
        self.show()

    def attemptLogin(self):
        username = self.uname.text()
        password = self.passw.text()
        try:
            self.user = self.auth.sign_in_with_email_and_password(username, password)
            self.hide()
            self.loginSignal.emit()  # EMIT SIGNAL
        except:
            self.validation.setText("Incorrect login information.\n")
