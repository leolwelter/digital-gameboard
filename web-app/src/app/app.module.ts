// Angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import {HttpModule} from '@angular/http';

// Angularfire2
import {AngularFireModule} from 'angularfire2';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFireDatabaseModule} from 'angularfire2/database';

// Authored
import {CustomMaterialModule} from './custom-material.module';
import {LoginComponent} from './login/login.component';
import {AppRoutingModule} from './app-routing.module';
import {RegisterComponent} from './login/register.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {ArraySortPipe} from './_pipes/order-by.pipe';
import {CharacterDetailComponent} from './character-detail/character-detail.component';
import {DeleteCharacterComponent} from './character-list/delete-character/delete-character.component';
import {NewCharacterComponent} from './character-list/new-character/new-pc.component';
import {CharacterListComponent} from './character-list/character-list.component';
import {CharacterService} from './_services/character.service';
import {AuthGuard} from './_services/auth-guard.service';
import {environment} from '../environments/environment';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    CustomMaterialModule,
    BrowserAnimationsModule,
    HttpModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
  ],
  declarations: [
    // Components
    CharacterDetailComponent,
    DeleteCharacterComponent,
    NewCharacterComponent,
    CharacterListComponent,
    DashboardComponent,
    LoginComponent,
    RegisterComponent,
    AppComponent,
    // Pipes
    ArraySortPipe,
  ],
  providers: [
    CharacterService,
    AuthGuard,
  ],
  entryComponents: [
    NewCharacterComponent,
    DeleteCharacterComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
