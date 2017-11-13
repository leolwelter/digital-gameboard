from PyQt5 import QtWidgets, QtGui, QtCore

class myButton(QtWidgets.QPushButton):
    rightclicked = QtCore.pyqtSignal()
    leftclicked = QtCore.pyqtSignal()

    def __init__(self):
        super(myButton, self).__init__()

    def mousePressEvent(self, QMouseEvent):
        if QMouseEvent.button() == QtCore.Qt.LeftButton:
            self.leftclicked.emit()
        elif QMouseEvent.button() == QtCore.Qt.RightButton:
            self.rightclicked.emit()
