export const Categories = [
  "ENERGY",
  "ESPRESSO",
  "JAVA",
  "JUICE",
  "KILLER_BREW",
  "PUNCH",
  "REHAB",
  "RESERVED",
  "SUPER_FUEL",
  "ULTRA",
] as const;

export type Category = typeof Categories[number];

export type Section<T> = {
    id: string;
    title: string;
    items: T[];
};

export interface MonsterDto {
    id: number;
    name: string;
    category: Category;
    flavor?: string;
    origin?: string;
    description?: string;
    story?: string;
    imageUrl?: string;
    marcyOpinion?: string;
}

export interface CreateAndUpdateMonsterDto {
    name: string;
    category: Category;
    flavor?: string;
    origin?: string;
    description?: string;
    story?: string;
    imageUrl?: string;
    marcyOpinion?: string;
}