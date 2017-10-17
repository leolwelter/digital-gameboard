export class Spell {
  name: string;
  level: number;
  description: string;
  school?: string;

  components?: boolean[]; // Verbal Somatic Material
  materials?: string;
  castingTime: string;
  duration?: string;
  range?: number; // in feet
  target?: string;

  damageDice?: string;
  damageType?: string;
  spellSlotDice?: number; // X per slot above
  spellSlotDie?: string; // dY
  save?: string; // [ABILITY negates | halves] | null
  isAttack?: boolean;
  isPrepared?: boolean;
}
