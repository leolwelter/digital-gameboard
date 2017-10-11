import pyrebase
from PyQt5 import QtWidgets
import sys
import test_ui
import json
import collections

config = {
    "apiKey": "AIzaSyDRVUzSZjcBev8uY0eiL3zwqwy7MIVpIFc",
    "authDomain": "tabletop-1c4a9.firebaseapp.com",
    "databaseURL": "https://tabletop-1c4a9.firebaseio.com",
    "projectID": "tabletop-1c4a9",
    "storageBucket": "tabletop-1c4a9.appspot.com",
    "messagingSenderId": "875322092974"
}


class ApplicationWindow(QtWidgets.QMainWindow, test_ui.Ui_MainWindow):
    def __init__(self, parent=None):
        super(ApplicationWindow, self).__init__(parent)
        self.setupUi(self)

    def pullFirebase(self, jsonDict):
        characterInfoString = ""
        characters = jsonDict["characters"]
        for character in sorted(characters.items()):
            characterInfoString += character[0] + "\n"
            specs = character[1]
            for spec in sorted(specs.items()):
                characterInfoString += "\t"+spec[0]+" : "+str(spec[1])+"\n"
            characterInfoString += "\n\n"
        #print(characterInfoString)
        self.textBrowser.setText(characterInfoString)

def main():
    firebase = pyrebase.initialize_app(config)

    auth = firebase.auth()
    # testcreate = auth.create_user_with_email_and_password()
    user = auth.sign_in_with_email_and_password("test@1.com", "testpass1")

    db = firebase.database()

    data = {"name": "Mugumbo", "class": "cleric"}

    users = db.child("users").get()
    test = db.child("users").child(user["localId"]).shallow().get()


    userdata = users.val()[auth.current_user["localId"]]
    #userdata = collections.OrderedDict(userdata)
    #print(users.val())
    print(test.val())

    app = QtWidgets.QApplication(sys.argv)
    application = ApplicationWindow()
    application.pullFirebase(userdata)
    application.show()
    sys.exit(app.exec_())

if __name__ == "__main__":
    main()
