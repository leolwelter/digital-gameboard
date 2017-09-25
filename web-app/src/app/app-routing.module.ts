// Angular routing modules
import { NgModule } from '@angular/core';
import { Router, RouterModule} from '@angular/router';
import { Routes } from '@angular/router';

// Authored components
import { DashboardComponent } from './dashboard/dashboard.component';
import { PCDetailComponent } from './pc-detail/pc-detail.component';
import { PCListComponent } from './pc-list/pc-list.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './_services/auth-guard.service';
import {RegisterComponent} from './login/register.component';

// Define all routes for the application
const routes: Routes = [
    {
        path: 'myPCs',
        component: PCListComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'myPCs/:name',
        component: PCDetailComponent,
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
