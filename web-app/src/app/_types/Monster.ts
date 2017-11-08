import { Spell } from './Spell';
import {Action} from './Action';

export class Monster {
  constructor(monsterData?: Partial<Monster>) {
    if (!monsterData.abilities) {
      monsterData.abilities = [0, 0, 0, 0, 0, 0];
    }
    if (!monsterData.saves) {
      monsterData.saves = [0, 0, 0, 0, 0, 0];
    }
    if (!monsterData.absMods) {
      monsterData.absMods = [0, 0, 0, 0, 0, 0];
    }
    Object.assign(this, monsterData);
    console.log(this);
  }

  // General
  name: string;
  race?: string;
  alignment?: string;
  xpReward?: number;

  // Ability Scores
  abilities?: number[];
  absMods?: number[];

  proficiency?: number;

  // Saves
  saveProficiencies?: boolean[];
  saves?: number[];


  // Skills
  skillProficiencies?: boolean[];
  skills?: number[];
  passivePerception?: number;


  // Battle
  armorClass?: number;
  initiative?: number;
  speed?: number[]; // land, climb, swim, fly
  maxHP?: number;
  currentHP?: number;
  tempHP?: number;


  // Actions and Abilities
  actions?: Action[];
  legendaryActions?: Action[];
  equipment?: string[]; // one per Item
  treasure?: string[]; // again, one per Item


  // Spellcasting
  spellcastingAbility?: string;
  spellSaveDC?: number;
  spellAttackBonus?: number;


  // List
  cantrips: Spell[];
  spellsKnown: Spell[];
  spellsPrepared: Spell[];
  currentSpellSlots: number[]; // 1 - 9 (current)
  maxSpellSlots: number[]; // 1 - 9 (max)

}
