import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {MapService} from '../../_services/map.service';

@Component({
  selector: 'delete-map',
  templateUrl: 'delete-map.component.html',
})
export class DeleteMapComponent {
  constructor(
    public mapService: MapService,
    public dialogRef: MatDialogRef<DeleteMapComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  name: string;
  nameCheck: boolean;

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  checkName() {
    this.nameCheck = (this.name === this.data.name);
  }

  confirmDelete() {
    this.mapService.deleteMap(this.name)
      .then(() => {
        this.dialogRef.close(true);
      })
      .catch(() => {
        this.dialogRef.close(false);
      });
  }
}
