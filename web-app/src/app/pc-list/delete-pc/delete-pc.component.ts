import {Component, Inject} from '@angular/core';
import {MD_DIALOG_DATA, MdDialog, MdDialogRef} from '@angular/material';

@Component({
    selector: 'delete-pc',
    templateUrl: 'delete-pc.component.html',
})
export class DeletePcComponent {
    constructor(
        public dialogRef: MdDialogRef<DeletePcComponent>,
        @Inject(MD_DIALOG_DATA) public data: any
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
        this.dialogRef.close(true);
    }
}
