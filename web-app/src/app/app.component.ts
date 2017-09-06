import { Component } from '@angular/core';
import { PC } from './PC';


// Temporary hardcoded heroes
const myCharacters: PC[] = [
    { id: 11, name: 'Grog' },
    { id: 12, name: 'Pike' },
    { id: 13, name: 'Vex' },
    { id: 14, name: 'Vax' },
    { id: 15, name: 'Percival' },
    { id: 16, name: 'Tiberius' },
    { id: 17, name: 'Scanlan' },
    { id: 18, name: 'T.Darington' }
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pc-list';
  currentPC: PC;
  myCharacters: PC[] = myCharacters;
  onSelect(character: PC): void {
      this.currentPC = character;
  }
}
