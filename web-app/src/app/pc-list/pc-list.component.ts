// Angular assets
import { Component } from '@angular/core';
import { OnInit} from '@angular/core';
// Authored assets
import { PC } from '../pc-detail/PC';
import { CreatureService } from '../../_services/creature.service';

@Component({
    selector: 'pc-list',
    templateUrl: './pc-list.component.html',
    styleUrls: ['./pc-list.component.css'],
})
export class PCListComponent implements OnInit {
    constructor(private CreatureService: CreatureService) {}
    currentPC: PC;
    myCharacters: PC[];
    onSelect(character: PC): void {
        this.currentPC = character;
    }
    getPCs(): void {
        this.CreatureService.getPCs()
        .then(PCs =>
            this.myCharacters = PCs
        );
    }
    ngOnInit(): void {
        this.getPCs();
    }
}
