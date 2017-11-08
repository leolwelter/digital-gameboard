// Angular routing modules
import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';
import { Routes } from '@angular/router';

// Authored components
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AuthGuard} from './_services/auth-guard.service';
import {CharacterListComponent} from './character-list/character-list.component';
import {CharacterDetailComponent} from './character-detail/character-detail.component';
import {MonsterListComponent} from './monster-list/monster-list.component';
import {MonsterDetailComponent} from './monster-detail/monster-detail.component';
import {MapListComponent} from './map-list/map-list.component';
import {MapDetailComponent} from './map-detail/map-detail.component';

// Define all routes for the application
const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'myCharacters',
    component: CharacterListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'myCharacters/:name',
    component: CharacterDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'myMaps',
    component: MapListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'myMaps/:name',
    component: MapDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'myMonsters',
    component: MonsterListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'myMonsters/:name',
    component: MonsterDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: '**',
    redirectTo: '/login',
  }
];

// update Angular RouterModule metadata to include our routes
// then ship it off to be imported by AppModule
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
