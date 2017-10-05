import {
  MdButtonModule, MdCardModule, MdCheckboxModule, MdChipsModule, MdDialogModule, MdExpansionModule, MdGridListModule,
  MdIconModule,
  MdInputModule,
  MdMenuModule, MdOptionModule, MdPaginatorModule, MdProgressBarModule, MdSidenavModule, MdSliderModule,
  MdSlideToggleModule,
  MdSnackBarModule,
  MdToolbarModule
} from '@angular/material';
import {NgModule} from '@angular/core';

@NgModule({
  imports: [
    MdButtonModule,
    MdCheckboxModule,
    MdToolbarModule,
    MdCheckboxModule,
    MdIconModule,
    MdMenuModule,
    MdCardModule,
    MdDialogModule,
    MdExpansionModule,
    MdInputModule,
    MdPaginatorModule,
    MdOptionModule,
    MdChipsModule,
    MdGridListModule,
    MdProgressBarModule,
    MdSliderModule,
    MdSlideToggleModule,
    MdSnackBarModule,
    MdSidenavModule
  ],
  exports: [
    MdButtonModule,
    MdCheckboxModule,
    MdToolbarModule,
    MdCheckboxModule,
    MdIconModule,
    MdMenuModule,
    MdCardModule,
    MdDialogModule,
    MdExpansionModule,
    MdInputModule,
    MdPaginatorModule,
    MdOptionModule,
    MdChipsModule,
    MdGridListModule,
    MdProgressBarModule,
    MdSliderModule,
    MdSlideToggleModule,
    MdSnackBarModule,
    MdSidenavModule
  ],
})
export class CustomMaterialModule { }
