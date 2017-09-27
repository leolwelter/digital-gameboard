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
    pcName: string;
    pc: FirebaseObjectObservable<any>;

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.pcName = params.get('name');
        });
        const uid = this.afAuth.auth.currentUser.uid;
        console.log('getting character: ' + this.pcName);
        this.pc = this.characterService.getPC(uid, this.pcName);
    }

    goBack(): void {
        this.location.back();
    }
}
