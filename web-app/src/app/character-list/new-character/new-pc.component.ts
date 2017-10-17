import {Component, Inject} from '@angular/core';
import {MD_DIALOG_DATA, MdDialog, MdDialogRef} from '@angular/material';
import { CharacterService } from '../../_services/character.service';
import {Character} from '../../character-detail/Character';

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
        this.dialogRef.close(false);
    }


    createCharacter() {
      const pc = new Character();
      pc.name = this.name;
      this.characterService.createPC(pc)
        .then(pr => {
          this.dialogRef.close(pc.name);
        })
        .catch(err => {
          this.dialogRef.close(false);
        });
    }
}
