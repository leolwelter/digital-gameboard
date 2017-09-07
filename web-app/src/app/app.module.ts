import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import { PCListComponent } from '../pc-list/pc-list.component';
import { PcDetailComponent} from '../pc-list/pc-detail.component';
import { ArraySortPipe } from '../_pipes/order-by.pipe';
import {AppComponent} from './app.component';
import {CreatureService} from '../_services/creature.service';
import {DashboardComponent} from '../dashboard/dashboard.component';

@NgModule({
  declarations: [
    // Components
    AppComponent,
    DashboardComponent,
    PCListComponent,
    PcDetailComponent,
    // PIPES
    ArraySortPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([
        {
          path: 'myPCs',
          component: PCListComponent
        },
        {
          path: 'dashboard',
          component: DashboardComponent
        },
        {
          path: '**',
          redirectTo: '/dashboard',
        }
    ])
  ],
  providers: [
      CreatureService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }


