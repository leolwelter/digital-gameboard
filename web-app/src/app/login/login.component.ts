import {Component} from '@angular/core';
import {MdSnackBar} from '@angular/material';
import {Observable} from 'rxjs/Observable';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Component({
    selector: 'login',
    templateUrl: 'login.component.html',
})
export class LoginComponent {
    user: Observable<firebase.User>;
    email: string;
    password: string;

    constructor(
        private afAuth: AngularFireAuth,
        public snackBar: MdSnackBar
    ) {
        this.user = afAuth.authState;
    }

    login() {
        if (this.afAuth.auth.currentUser !== null) {
            this.snackBar.open('Already Logged In!', '', {
                duration: 2000
            });
            return;
        }
        this.afAuth.auth.signInWithEmailAndPassword(this.email, this.password)
            .then(pr => {
                    console.log('Success');
                    this.email = '';
                    this.password = '';
                }
            )
            .catch(err =>
                console.log(err.message)
            );
    }

    logout() {
        this.afAuth.auth.signOut();
    }
}
