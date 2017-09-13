import {Component, OnInit} from '@angular/core';
import { Input } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { PC } from './PC';
import {CreatureService} from '../_services/creature.service';


@Component({
    selector: 'pc-detail',
    templateUrl: './pc-detail.component.html',
    styleUrls: ['./pc-detail.component.css']
})
export class PCDetailComponent implements OnInit {
    constructor(
        private creatureService: CreatureService,
        private route: ActivatedRoute,
        private location: Location
    ) {}
    @Input() pc: PC; // input from pc list view
    ngOnInit(): void {
        this.route.paramMap
            .switchMap((params: ParamMap) => this.creatureService.getPC(+params.get('id')))
            .subscribe(pc => this.pc = pc);
    }
    goBack(): void {
        this.location.back();
    }
}
