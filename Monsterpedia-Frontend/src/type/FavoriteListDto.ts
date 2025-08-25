export interface FavoriteListItemDto {
    monsterId: number;
    monsterName: string;
    imageUrl: string;
    rating: number;
    comment: string;
}

export interface FavoriteListItemDto {
    favoriteListId: number;
    items: FavoriteListItemDto[];
}