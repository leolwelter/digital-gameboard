// Angular Core
import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, Validators} from '@angular/forms';
import 'rxjs/add/operator/switchMap';

// Authored
import {ItemService} from '../_services/item.service';
import {Item} from '../_types/Item';

// AngularFire2
import {AngularFireObject} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';
import {MatSnackBar} from '@angular/material';


@Component({
  selector: 'item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css']
})
export class ItemDetailComponent implements OnInit {
  constructor(
    private itemService: ItemService,
    private route: ActivatedRoute,
    private location: Location,
    private snackbar: MatSnackBar,
  ) {}
  item: Item;
  itemRef: AngularFireObject<Item>;
  itemData: Observable<Item>;
  rarities: string[] = ['common', 'uncommon', 'rare', 'very rare', 'legendary'];
  newTag = '';

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const name = params.get('name');
      this.itemRef = this.itemService.getItemRef(name);
      this.itemData = this.itemRef.valueChanges();
      this.itemData.subscribe(item => {
        this.initItem(item);
      });
    });
  }

  toggleCharged(): void {
    if (!this.item.hasCharges) {
      this.item.maxCharges = 0;
      this.item.currentCharges = 0;
    }
  }

  toggleEquippable(): void {
    if (this.item.equippable) {
      this.clearTags('weapon');
      this.clearTags('armor');
      this.item.equipmentType = '';
      console.log(this.item);
    }
  }

  clearTags(type: string): void {
    if (type === 'armor') {
      this.item.armorTags = [];
    } else if (type === 'weapon') {
      this.item.weaponTags = [];
    }
  }

  addTag(type: string): void {
    console.log(`Adding ${this.newTag}`);
    if (type === 'armor') {
      if (!this.item.armorTags) {
        this.item.armorTags = [];
      }
      this.item.armorTags.push(this.newTag);
    } else if (type === 'weapon') {
      if (!this.item.weaponTags) {
        this.item.weaponTags = [];
      }
      this.item.weaponTags.push(this.newTag);
    }
    this.newTag = '';
  }

  initItem(itemData: Item): void {
    this.item = new Item(itemData);
  }

  saveItem(): void {
    this.itemRef.update(this.item)
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
