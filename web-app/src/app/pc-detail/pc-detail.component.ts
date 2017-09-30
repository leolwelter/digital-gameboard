// Angular Core
import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

// Authored
import {CharacterService} from '../_services/character.service';

// AngularFire2
import {AngularFireAuth} from 'angularfire2/auth';
import {FirebaseObjectObservable} from 'angularfire2/database';
import {PC} from './PC';


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

    pc: PC;
    character: FirebaseObjectObservable<any>;

    ngOnInit(): void {
        this.pc = new PC();
        this.route.paramMap.subscribe(params => {
            this.pc.name = params.get('name');
        });
        const uid = this.afAuth.auth.currentUser.uid;
        this.character = this.characterService.getPC(uid, this.pc.name);
        this.setFormProperties();
    }

    savePC(): void {
        const uid = this.afAuth.auth.currentUser.uid;
        this.characterService.updatePC(uid, this.pc);
    }

    setFormProperties(): void {
        for (const prop of Object.getOwnPropertyNames(this.character)) {
            console.log(prop);
        }
    }

    goBack(): void {
        this.location.back();
    }
}
