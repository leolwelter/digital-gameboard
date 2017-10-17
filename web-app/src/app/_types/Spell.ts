export class Spell {
  name: string;
  level: number;
  description: string;
  castingTime: string;
  components?: boolean[]; // Verbal Somatic Material
  materials?: string;
  damageDice?: string;
  damageType?: string;
  duration?: string;
  spellSlotDice?: number; // X per slot above
  spellSlotDie?: string; // dY
  range?: number; // in feet
  save?: string; // [ABILITY negates | halves] | null
  school?: string;
  target?: string;
  isAttack?: boolean;
  isPrepared?: boolean;
}
