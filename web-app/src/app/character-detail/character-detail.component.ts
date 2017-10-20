// Angular Core
import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, Validators} from '@angular/forms';
import 'rxjs/add/operator/switchMap';

// Authored
import {CharacterService} from '../_services/character.service';
import {Character} from '../_types/Character';

// AngularFire2
import {AngularFireObject} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';
import {classes} from '../_types/CharacterClass';
import {MatSnackBar} from '@angular/material';


@Component({
    selector: 'character-detail',
    templateUrl: './character-detail.component.html',
    styleUrls: ['./character-detail.component.css'],
})
export class CharacterDetailComponent implements OnInit {
    constructor(
        private characterService: CharacterService,
        private route: ActivatedRoute,
        private location: Location,
        private snackbar: MatSnackBar,
    ) {}
    pcClasses: any[] = classes;
    pc: Character;
    pcRef: AngularFireObject<Character>;
    pcData: Observable<Character>;

    levelFormControl = new FormControl('', [
      Validators.min(1),
      Validators.max(20),
    ]);

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const name = params.get('name');
            this.pcRef = this.characterService.getPcRef(name);
            this.pcData = this.pcRef.valueChanges();
            this.pcData.subscribe(character => {
              this.initPC(character);
            });
        });
    }


    initPC(charData: Character): void {
      this.pc = new Character(charData);
    }

    savePC(): void {
      this.pcRef.update(this.pc)
        .then(success => {
          this.snackbar.open('Success!', '', {duration: 2000});
        })
        .catch(fail => {
          this.snackbar.open('Something went wrong', '', {duration: 2000});
        });
    }

    goBack(): void {
        this.location.back();
    }


}
