import {Component, Inject} from '@angular/core';
import {MD_DIALOG_DATA, MdDialog, MdDialogRef} from '@angular/material';
import { CharacterService } from '../../_services/character.service';

@Component({
    selector: 'new-pc',
    templateUrl: 'new-pc.component.html',
})
export class NewCharacterComponent {
    constructor(
        private characterService: CharacterService,
        public dialogRef: MdDialogRef<NewCharacterComponent>,
        @Inject(MD_DIALOG_DATA) public data: any
    ) {}
    name: string;

    onNoClick(): void {
        this.dialogRef.close();
    }


    createCharacter() {
    }
}
