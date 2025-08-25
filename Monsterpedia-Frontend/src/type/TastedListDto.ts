export interface TastedListItemDto {
    monsterId: number;
    monsterName: string;
    imageUrl: string;
    rating: number;
    comment: string;
}

export interface TastedListDto {
    tastedListId: number;
    items: TastedListItemDto[];
}