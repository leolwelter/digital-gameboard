export class Item {
  constructor(itemData: Partial<Item>) {
    Object.assign(this, itemData);
  }

  name: string;
  description: string;
  rarity: string;
  charges?: number;
  isEquipped?: boolean;
  weaponTags?: string[];
}
