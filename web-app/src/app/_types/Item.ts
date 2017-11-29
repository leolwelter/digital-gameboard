export class Item {
  constructor(itemData: Partial<Item>) {
    Object.assign(this, itemData);
  }

  name: string;
  description: string;
  rarity: string;
  hasCharges?: boolean;
  maxCharges?: number;
  currentCharges?: number;
  equippable?: boolean;
  isEquipped?: boolean;
  equipmentType?: string;
  equipmentTags?: string[];
}
