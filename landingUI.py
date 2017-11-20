# -*- coding: utf-8 -*-

# Form implementation generated from reading ui file 'landing.ui'
#
# Created by: PyQt5 UI code generator 5.9
#
# WARNING! All changes made in this file will be lost!

from PyQt5 import QtCore, QtGui, QtWidgets
from PyQt5.QtGui import QIcon
from PyQt5.QtWidgets import QAction, QInputDialog
import sys

from ClientApp import GameInstance

class Ui_MainWindow(object):

    def setupUi(self, MainWindow):

        MainWindow.setObjectName("MainWindow")
        MainWindow.resize(1201, 733)

        self.centralwidget = QtWidgets.QWidget(MainWindow)
        self.centralwidget.setObjectName("centralwidget")
        self.gridLayout = QtWidgets.QGridLayout(self.centralwidget)
        self.gridLayout.setObjectName("gridLayout")
        self.scrollArea = QtWidgets.QScrollArea(self.centralwidget)
        self.scrollArea.setWidgetResizable(False)
        self.scrollArea.setObjectName("scrollArea")
        self.scrollAreaWidgetContents = QtWidgets.QWidget()
        self.playerText = QtWidgets.QTextBrowser()
        self.playerText.setObjectName('playerTextBrowser')
        self.GMtoolbox = QtWidgets.QGroupBox("GM Toolbox")
        self.GMpush1 = QtWidgets.QPushButton("Pushbutton 1")
        self.GMpush2 = QtWidgets.QPushButton("Pushbutton 2")
        self.GMpush3 = QtWidgets.QPushButton("Pushbutton 3")
        self.GMpush4 = QtWidgets.QPushButton("Pushbutton 4")
        self.GMtoolLayout = QtWidgets.QGridLayout(self.GMtoolbox)

        #self.scrollAreaWidgetContents.setGeometry(QtCore.QRect(0, 0, 1181, 329))
        self.scrollAreaWidgetContents.setObjectName("scrollAreaWidgetContents")
        self.scrollArea.setWidget(self.scrollAreaWidgetContents)
        self.gridLayout.addWidget(self.scrollArea, 0, 0, 1, 1)
        self.gridLayout.addWidget(self.playerText, 0, 1, 1, 1)
        self.scrollArea_2 = QtWidgets.QScrollArea(self.centralwidget)
        self.scrollArea_2.setWidgetResizable(True)
        self.scrollArea_2.setObjectName("scrollArea_2")
        self.scrollAreaWidgetContents_2 = QtWidgets.QWidget()
        self.scrollAreaWidgetContents_2.setGeometry(QtCore.QRect(0, 0, 1181, 229))
        self.scrollAreaWidgetContents_2.setObjectName("scrollAreaWidgetContents_2")
        self.verticalLayout_2 = QtWidgets.QVBoxLayout(self.scrollAreaWidgetContents_2)
        self.verticalLayout_2.setContentsMargins(0, 0, 0, 0)
        self.verticalLayout_2.setObjectName("verticalLayout_2")
        self.textBrowser = QtWidgets.QTextBrowser(self.scrollAreaWidgetContents_2)
        self.textBrowser.setObjectName("textBrowser")
        self.verticalLayout_2.addWidget(self.textBrowser)
        self.scrollArea_2.setWidget(self.scrollAreaWidgetContents_2)
        self.gridLayout.addWidget(self.scrollArea_2, 1, 0, 1, 1)
        self.GMtoolLayout.addWidget(self.GMpush1, 0, 0, 1, 1)
        self.GMtoolLayout.addWidget(self.GMpush2, 0, 1, 1, 1)
        self.GMtoolLayout.addWidget(self.GMpush3, 1, 0, 1, 1)
        self.GMtoolLayout.addWidget(self.GMpush4, 1, 1, 1, 1)
        self.gridLayout.addWidget(self.GMtoolbox, 1, 1, 1, 1)
        self.bottomButtons = QtWidgets.QWidget()
        self.bottomButtonForm = QtWidgets.QFormLayout()
        self.logoutButton = QtWidgets.QPushButton()
        self.logoutButton.setObjectName("logoutButton")
        self.logoutButton.setText("Logout")
        self.nextPhaseButton = QtWidgets.QPushButton()
        self.nextPhaseButton.setText("Next Phase")
        self.nextPhaseButton.setObjectName("nextPhaseButton")
        self.bottomButtonForm.addRow(self.nextPhaseButton, self.logoutButton)
        self.bottomButtons.setLayout(self.bottomButtonForm)
        self.gridLayout.addWidget(self.bottomButtons, 2, 0, 1, 1)
        MainWindow.setCentralWidget(self.centralwidget)

        # Add activities to menu bar
        self.menubar = QtWidgets.QMenuBar(MainWindow)
        self.menubar.setGeometry(QtCore.QRect(0, 0, 1201, 25))
        self.menubar.setObjectName("menubar")

        self.menuDigital_Gameboard_Console = QtWidgets.QMenu(self.menubar)
        self.menuDigital_Gameboard_Console.setObjectName("menuDigital_Gameboard_Console")
        MainWindow.setMenuBar(self.menubar)
        self.statusbar = QtWidgets.QStatusBar(MainWindow)
        self.statusbar.setObjectName("statusbar")


        MainWindow.setStatusBar(self.statusbar)
        self.menubar.addAction(self.menuDigital_Gameboard_Console.menuAction())

        self.retranslateUi(MainWindow)
        QtCore.QMetaObject.connectSlotsByName(MainWindow)

    def retranslateUi(self, MainWindow):
        _translate = QtCore.QCoreApplication.translate
        MainWindow.setWindowTitle(_translate("MainWindow", "DM Console"))
        self.menuDigital_Gameboard_Console.setTitle(_translate("MainWindow", "Digital Gameboard Console"))


if __name__ == "__main__":
    import sys
    app = QtWidgets.QApplication(sys.argv)
    MainWindow = QtWidgets.QMainWindow()
    ui = Ui_MainWindow()
    ui.setupUi(MainWindow)
    MainWindow.show()
    sys.exit(app.exec_())

