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

export const logosImg = [
    "https://res.cloudinary.com/dqtrha0hz/image/upload/v1759152732/Energy_Logo_duu0uv.webp",
    "https://res.cloudinary.com/dqtrha0hz/image/upload/v1759159007/Espresso_Logo_yrwbuv.png",
    "https://res.cloudinary.com/dqtrha0hz/image/upload/v1759152734/Java_Logo_m55w9k.png",
    "https://res.cloudinary.com/dqtrha0hz/image/upload/v1759152735/Juice_Logo_dbz72s.webp",
    "https://res.cloudinary.com/dqtrha0hz/image/upload/v1759152729/Killer_Brew_Logo_pwwfrf.png",
    "https://res.cloudinary.com/dqtrha0hz/image/upload/v1759152730/Punch_Logo_y4elds.png",
    "https://res.cloudinary.com/dqtrha0hz/image/upload/v1759152730/Rehab_Logo_ylgxq2.webp",
    "https://res.cloudinary.com/dqtrha0hz/image/upload/v1759166467/Monster_Reserve_tzktxy.png",
    "https://res.cloudinary.com/dqtrha0hz/image/upload/v1759152731/Super_Fuel_Logo_quhxbd.webp",
    "https://res.cloudinary.com/dqtrha0hz/image/upload/v1759152732/Ultra_Logo_vsals9.webp",
];
  
export const categoryLogos: Record<Category, string> = Categories.reduce(
  (acc, cat, i) => {
    acc[cat] = logosImg[i];
    return acc;
  },
  {} as Record<Category, string>
);

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