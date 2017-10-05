import {Component} from '@angular/core';
import {MdSnackBar} from '@angular/material';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';

@Component({
    selector: 'register',
    templateUrl: 'register.component.html'
})
export class RegisterComponent {
    constructor(
        private router: Router,
        private afAuth: AngularFireAuth,
        private snackbar: MdSnackBar,
    ){ }

    email: string;
    password: string;
    passwordConfirm: string;

    toLogin() {
        this.router.navigate(['/login']);
    }

    registerUser() {
      if (this.password !== this.passwordConfirm) {
        this.snackbar.open('PASSWORDS DO NOT MATCH', '', { duration: 2000 });
      } else {
        this.afAuth.auth.createUserWithEmailAndPassword(this.email, this.password)
          .then( () => {
            this.router.navigate(['/dashboard']);
          })
          .catch( () => {
            this.snackbar.open('Something went wrong :(', '', { duration: 2000 });
          });
      }
    }


}
