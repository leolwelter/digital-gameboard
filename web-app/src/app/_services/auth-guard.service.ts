import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private afAuth: AngularFireAuth,
        public router: Router
    ) {
    }
    canActivate(): Observable<boolean> {
      return this.afAuth.authState
        .take(1)
        .map(authState => !!authState)
        .do(authenticated => {
          if ( !authenticated ) {
            this.router.navigate(['']);
          }
        });
    }
}
