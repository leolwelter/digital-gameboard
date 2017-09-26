import {Component, Inject} from '@angular/core';
import {MD_DIALOG_DATA, MdDialog, MdDialogRef} from '@angular/material';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { CharacterService } from '../../_services/character.service';

@Component({
    selector: 'new-pc',
    templateUrl: 'new-pc.component.html',
})
export class NewPcComponent {
    constructor(
        private db: AngularFireDatabase,
        private afAuth: AngularFireAuth,
        private characterService: CharacterService,
        public dialogRef: MdDialogRef<NewPcComponent>,
        @Inject(MD_DIALOG_DATA) public data: any
    ) {}
    name: string;

    onNoClick(): void {
        this.dialogRef.close();
    }

    createCharacter() {
        const user = this.afAuth.auth.currentUser.uid;
        this.characterService.createPC(user, this.name)
            .then(() => {
            this.dialogRef.close(this.name);
            })
            .catch(err => {
                console.log('update failed');
            });
    }
}
