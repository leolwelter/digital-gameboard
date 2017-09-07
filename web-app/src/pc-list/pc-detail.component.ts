import { Component } from '@angular/core';
import { Input } from '@angular/core';

import { PC } from './PC';


@Component({
    selector: 'pc-detail',
    templateUrl: './pc-detail.component.html'
})
export class PcDetailComponent {
    @Input() pc: PC; // input from pc list view
}
