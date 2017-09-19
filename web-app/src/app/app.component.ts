import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {Router} from '@angular/router';


@Component({
    selector: 'web-app',
    templateUrl: './app.component.html'
})
export class AppComponent {
    user: Observable<firebase.User>;

    constructor(public afAuth: AngularFireAuth, public router: Router) {
        this.user = afAuth.authState;
    }

    logout() {
        this.afAuth.auth.signOut();
        this.router.navigate(['/login']);
    }
}
