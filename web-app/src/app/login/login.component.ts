import {Component} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';
import * as firebase from 'firebase/app';
import {AngularFireAuth} from 'angularfire2/auth';

@Component({
    selector: 'login',
    templateUrl: 'login.component.html',
})
export class LoginComponent {
    constructor(
        public router: Router,
        public afAuth: AngularFireAuth,
        public snackBar: MatSnackBar
    ) {
        this.user = afAuth.authState;
    }

    user: Observable<firebase.User>;
    email: string;
    password: string;

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
            this.router.navigate(['/dashboard']);
        })
        .catch(err => {
            this.snackBar.open('Something went wrong', '', {duration:2000});
        });
    }
    logout() {
      this.afAuth.auth.signOut();
    }

    toRegister() {
        this.router.navigate(['/register']);
    }
}
