export interface FavoriteListItemDto {
    favoriteListId: number;
    items: FavoriteListItemDto[];
}

export interface FavoriteListItemDto {
    monsterId: number;
    monsterName: string;
    imageUrl: string;
    rating: number;
    grade: string;
    comment: string;
}

export interface AddFavoriteListRequestDto {
    monsterId: number;
}