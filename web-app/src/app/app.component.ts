import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';
import {Observable} from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(
    public router: Router,
    public afAuth: AngularFireAuth,
    private snackbar: MatSnackBar
  ) {
    this.user = afAuth.authState;
  }
  user: Observable<firebase.User>;

  logout(): void {
    this.afAuth.auth.signOut();
    this.router.navigate(['/login']);
    console.log('successfully logged out');
  }

  openHelp(): void {
    this.snackbar.open('NO HELP ON THE EXAM', 'ok :(', {
      duration : 2000
    });
  }
}
