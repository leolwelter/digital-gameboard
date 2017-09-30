import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';


import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AuthGuard implements CanActivate {
    user: Observable<firebase.User>;
    constructor(
        public afAuth: AngularFireAuth,
        public router: Router
    ) {
        this.user = afAuth.authState;
    }

    canActivate() {
        if (this.afAuth.auth.currentUser === null) {
            this.router.navigate(['']);
            return false;
        }
        return true;
    }
}