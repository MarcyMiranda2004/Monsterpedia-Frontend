export type category = "ENERGY" | "ESPRESSO" | "JAVA" | "JUICE" | "KILLER_BREW" | "PUNCH" | "REHAB" | "RESERVED" | "SUPER_FUEL" | "ULTRA";

export interface MonsterDto {
    id: number;
    name: string;
    category: category;
    flavor: string;
    origin: string;
    description: string;
    story: string;
    imageUrl: string;
    marcyOpinion: string;
}

export interface CreateAndUpdateMonsterDto {
    name: string;
    category: category;
    flavor: string;
    origin: string;
    description: string;
    story: string;
    imageUrl: string;
    marcyOpinion: string;
}