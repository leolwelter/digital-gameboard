import { Spell } from '../_types/Spell';
import {Action} from '../_types/Action';
import {CharacterClass} from '../_types/CharacterClass';

export class Character {
    constructor(charData?: Partial<Character>) {
      Object.assign(this, charData);
      console.log(this);
    }

    // General
    name: string;
    classOne?: CharacterClass;
    classOneLevel?: number;
    background?: string;
    player: string;
    race?: string;
    alignment?: string;
    xp?: number;

    // Ability Scores
    abilities?: number[];
    absMods?: number[];

    inspiration?: boolean;
    proficiency?: number;

    // Saves
    saveProficiencies?: boolean[];
    saves?: number[];

    // Skills
    skillProficiencies?: boolean[];
    skills?: number[];
    passivePerception?: number;

    // Proficiencies (tools, languages, etc)
    proficiencies?: string[];

    // Battle
    armorClass?: number;
    initiative?: number;
    speed?: number[]; // land, climb, swim, fly
    maxHP?: number;
    currentHP?: number;
    tempHP?: number;
    currentHitDice?: number;
    maxHitDice?: number;
    deathSaves?: number[]; // successes, failures

    // Role Play Overview
    personality?: string;
    ideals?: string;
    bonds?: string;
    flaws?: string;

    // Default Actions and Equipment
    myActions?: Action[];
    money?: number[]; // cp, sp, ep, gp, pp
    equipment?: string[]; // one per Item
    treasure?: string[]; // again, one per Item

    // Features
    classFeatures?: string[];
    raceFeatures?: string[];

    // Role Play In-depth
    age?: number;
    height?: number;
    weight?: number;
    eyes?: string;
    skin?: string;
    hair?: string;
    portrait?: HTMLCanvasElement;
    backstory?: string;
    allies?: string[];
    organizations?: string[];
    symbol?: HTMLCanvasElement;

    // Spellcasting
    spellcastingClass?: string;
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
