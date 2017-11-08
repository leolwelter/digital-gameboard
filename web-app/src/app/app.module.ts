// Angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormControl, FormsModule} from '@angular/forms';
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
import {MapListComponent} from './map-list/map-list.component';
import {NewMapComponent} from './map-list/new-map/new-map.component';
import {DeleteMapComponent} from './map-list/delete-map/delete-map.component';
import {MapService} from './_services/map.service';
import {MapDetailComponent} from './map-detail/map-detail.component';
import {PaletteDialogComponent} from './map-detail/palette-dialog/palette-dialog.component';
import {MonsterDetailComponent} from './monster-detail/monster-detail.component';
import {MonsterListComponent} from './monster-list/monster-list.component';
import {DeleteMonsterComponent} from './monster-list/delete-monster/delete-monster.component';
import {NewMonsterComponent} from './monster-list/new-monster/new-monster.component';
import {MonsterService} from './_services/monster.service';

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
    // Characters
    CharacterListComponent,
    CharacterDetailComponent,
    NewCharacterComponent,
    DeleteCharacterComponent,
    // Monsters
    MonsterListComponent,
    MonsterDetailComponent,
    NewMonsterComponent,
    DeleteMonsterComponent,
    // Maps
    MapListComponent,
    NewMapComponent,
    DeleteMapComponent,
    MapDetailComponent,
    PaletteDialogComponent,
    // Navigation
    DashboardComponent,
    LoginComponent,
    RegisterComponent,
    AppComponent,
    // Pipes
    ArraySortPipe,
  ],
  providers: [
    CharacterService,
    MonsterService,
    MapService,
    AuthGuard,
  ],
  entryComponents: [
    NewCharacterComponent,
    DeleteCharacterComponent,
    NewMonsterComponent,
    DeleteMonsterComponent,
    NewMapComponent,
    DeleteMapComponent,
    PaletteDialogComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
