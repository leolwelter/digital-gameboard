import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AuthGuard implements CanActivate {
    user: Observable<firebase.User>;
    constructor(public afAuth: AngularFireAuth) {
        this.user = afAuth.authState;
    }

    canActivate() {
        console.log('Attempt to access user services');
        return (this.afAuth.auth.currentUser !== null);
    }
}