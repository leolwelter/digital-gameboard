// Angular routing modules
import { NgModule } from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import { Routes } from '@angular/router';

// Authored components
import { DashboardComponent } from './dashboard/dashboard.component';
import { PCDetailComponent } from './pc-detail/pc-detail.component';
import { PCListComponent } from './pc-list/pc-list.component';

// Define all routes for the application
const routes: Routes = [
    {
        path: 'myPCs',
        component: PCListComponent
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'myPCs/:id',
        component: PCDetailComponent
    },
    {
        path: '**',
        redirectTo: '/dashboard',
    }
];

// update Angular RouterModule metadata to include our routes
@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}
