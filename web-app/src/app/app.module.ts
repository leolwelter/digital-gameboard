// Angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    MdCardModule, MdDialogModule, MdExpansionModule, MdInputModule, MdSelectModule,
    MdSnackBarModule
} from '@angular/material';

// Authored Assets
import { PCListComponent } from './pc-list/pc-list.component';
import { PCDetailComponent } from './pc-detail/pc-detail.component';
import { ArraySortPipe } from './_pipes/order-by.pipe';
import { AppComponent } from './app.component';
import { CharacterService } from './_services/character.service';
import { DashboardComponent} from './dashboard/dashboard.component';
import { AppRoutingModule} from './app-routing.module';
import { environment } from '../environments/environment';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './_services/auth-guard.service';
import { RegisterComponent } from './login/register.component';
import { NewPcComponent } from './pc-list/new-pc/new-pc.component';
// AngularFire
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { DeletePcComponent } from './pc-list/delete-pc/delete-pc.component';

@NgModule({
  declarations: [
    // Components
    AppComponent,
    DashboardComponent,
    PCListComponent,
    PCDetailComponent,
    LoginComponent,
    RegisterComponent,
    NewPcComponent,
    DeletePcComponent,
    // PIPES
    ArraySortPipe,
  ],
  entryComponents: [
    NewPcComponent,
    DeletePcComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    HttpModule,
    AngularFireModule.initializeApp(environment.firebase, 'dt-web-app'),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    MdSnackBarModule,
    MdDialogModule,
    MdExpansionModule,
    MdCardModule,
    MdInputModule,
    MdSelectModule,
  ],
  providers: [
      CharacterService,
      AuthGuard,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
