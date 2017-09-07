import { Component, OnInit } from '@angular/core';

import { CreatureService } from '../_services/creature.service';
import { PC } from '../pc-list/PC';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit{
    constructor(private creatureService: CreatureService) { }
    title = 'Welcome back';
    user = 'user'; // TODO: get user from auth service
    myCharacters: PC[] = [];

    ngOnInit(): void {
        this.creatureService.getPCs()
            .then(myPCs =>
                this.myCharacters = myPCs.slice(1, 5)
            );
    }
}
