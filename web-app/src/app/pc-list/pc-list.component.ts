// Angular assets
import { Component } from '@angular/core';
import { OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

// AngularFire assets
import {FirebaseListObservable} from 'angularfire2/database';
import {AngularFireAuth} from 'angularfire2/auth';
import { FirebaseObjectObservable } from 'angularfire2/database';

// Authored assets
import { PC } from '../pc-detail/PC';
import { CharacterService } from '../_services/character.service';
import { NewPcComponent } from './new-pc/new-pc.component';
import { DeletePcComponent } from './delete-pc/delete-pc.component';

@Component({
    selector: 'pc-list',
    templateUrl: './pc-list.component.html',
    styleUrls: ['./pc-list.component.css'],
})
export class PCListComponent implements OnInit {
    constructor(
        private characterService: CharacterService,
        private router: Router,
        private afAuth: AngularFireAuth,
        private dialog: MdDialog
    ) { }

    currentPC: PC;
    myCharacters: FirebaseListObservable<any>;

    onSelect(character: PC): void {
        this.currentPC = character;
    }
    ngOnInit(): void {
        if (!this.myCharacters) {
            this.getPCs();
        }
    }
    getPCs(): void {
        const uid = this.afAuth.auth.currentUser.uid;
        this.myCharacters = this.characterService.getPCs(uid);
    }
    gotoDetail(): void {
        this.router.navigate(['/myPCs', this.currentPC.name]);
    }
    createCharacter(): void {
        // Open dialog for name
        const dRef = this.dialog.open(NewPcComponent, { width: '37rem'});
        // navigate to new character sheet
        dRef.afterClosed().subscribe(name => {
            if (name !== '') {
                this.router.navigate(['/myPCs', name]);
            }
        });
    }
    deleteCharacter(): void {
        // Open dialog for confirmation
        const dRef = this.dialog.open(DeletePcComponent, { width: '37rem', data: { name: this.currentPC.name }});
        dRef.afterClosed().subscribe( confirm => {
            if (confirm) {
                const user = this.afAuth.auth.currentUser.uid;
                this.characterService.deletePC(user, this.currentPC.name);
                this.currentPC = null;
            }
        });
    }
}
