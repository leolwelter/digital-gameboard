import {Component, OnInit} from '@angular/core';
import { Input } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { PC } from './PC';
import {CharacterService} from '../_services/character.service';
import {AngularFireAuth} from 'angularfire2/auth';


@Component({
    selector: 'pc-detail',
    templateUrl: './pc-detail.component.html',
    styleUrls: ['./pc-detail.component.css']
})
export class PCDetailComponent implements OnInit {
    constructor(
        private characterService: CharacterService,
        private afAuth: AngularFireAuth,
        private route: ActivatedRoute,
        private location: Location
    ) {}
    @Input() pc: PC; // input from pc list view
    ngOnInit(): void {

    }
    goBack(): void {
        this.location.back();
    }
}
