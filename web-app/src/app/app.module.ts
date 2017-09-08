import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import { PCListComponent } from '../pc-list/pc-list.component';
import { PCDetailComponent } from '../pc-list/pc-detail.component';
import { ArraySortPipe } from '../_pipes/order-by.pipe';
import {AppComponent} from './app.component';
import {CreatureService} from '../_services/creature.service';
import {DashboardComponent} from '../dashboard/dashboard.component';
import {AppRoutingModule} from './app-routing.module';

@NgModule({
  declarations: [
    // Components
    AppComponent,
    DashboardComponent,
    PCListComponent,
    PCDetailComponent,
    // PIPES
    ArraySortPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
      CreatureService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }


