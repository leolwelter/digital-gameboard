import {Component} from '@angular/core';
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

    constructor(public afAuth: AngularFireAuth) {
        this.user = afAuth.authState;
    }

    login() {
        this.afAuth.auth.signInWithEmailAndPassword(this.email, this.password);
    }

    logout() {
        this.afAuth.auth.signOut();
    }
}
