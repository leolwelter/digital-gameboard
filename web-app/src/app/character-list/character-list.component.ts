// Angular assets
import { Component } from '@angular/core';
import { OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

// Authored assets
import { PC } from '../character-detail/Character';
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
        private dialog: MdDialog
    ) { }

    currentPC: PC;
    myCharacters: any;

    onSelect(character: PC): void {
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
      this.myCharacters = this.characterService.getPCs();
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
