export class PC {
    //Standard
    name: string;
    class1: string;
    background: string;
    race: string;
    alignment: string;
    experience: number;


    //Abilities
    absSTR: number;
    absDEX: number;
    absCON: number;
    absINT: number;
    absWIS: number;
    absCHA: number;

    modSTR: number;
    modDEX: number;
    modCON: number;
    modINT: number;
    modWIS: number;
    modCHA: number;

    //Saves
    saveSTR: number;
    saveDEX: number;
    saveCON: number;
    saveINT: number;
    saveWIS: number;
    saveCHA: number;

    //Skills
    skills: object
    passivePerception: number;
    
    //Combat
    AC: number;
    hpMax: number;
    hpTemp: number;
    hitDice: object;
    deathSaves: object;

    //Role Playing
    pTraits: string;
    ideals: string;
    bonds: string;
    flaws: string;

}
