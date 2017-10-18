// Angular assets
import { Component } from '@angular/core';
import { OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// Authored assets
import { Character } from '../_types/Character';
import { CharacterService } from '../_services/character.service';
import { NewCharacterComponent } from './new-character/new-pc.component';
import { DeleteCharacterComponent } from './delete-character/delete-character.component';

@Component({
    selector: 'pc-list',
    templateUrl: './character-list.component.html',
    styleUrls: ['./character-list.component.css'],
})
export class CharacterListComponent implements OnInit {
    constructor(
        private characterService: CharacterService,
        private router: Router,
        private dialog: MatDialog
    ) { }

    currentPC: Character;
    myCharacters: any;

    onSelect(character: Character): void {
      if (this.currentPC !== character) {
        this.currentPC = character;
      } else {
        this.currentPC = null;
      }
    }
    ngOnInit(): void {
        if (!this.myCharacters) {
            this.getPCs();
        }
    }
    getPCs(): void {
      this.myCharacters = this.characterService.getPcObservableList();
    }
    gotoDetail(): void {
        this.router.navigate(['/myCharacters', this.currentPC.name]);
    }
    createCharacter(): void {
        // Open dialog for name
        const dRef = this.dialog.open(NewCharacterComponent, { width: '37rem'});
        // navigate to new character sheet
        dRef.afterClosed().subscribe(name => {
            if (name && name !== '') {
                this.router.navigate(['/myCharacters', name]);
            }
        });
    }
    deleteCharacter(): void {
        // Open dialog for confirmation
        const dRef = this.dialog.open(DeleteCharacterComponent, { width: '37rem', data: { name: this.currentPC.name }});
        dRef.afterClosed().subscribe( confirm => {
            if (confirm) {
                this.currentPC = null;
            }
        });
    }
}
