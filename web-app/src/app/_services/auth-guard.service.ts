import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private afAuth: AngularFireAuth,
        public router: Router
    ) {
    }
    canActivate() {
        if (this.afAuth.auth.currentUser === null) {
            this.router.navigate(['']);
            return false;
        }
        return true;
    }
}
