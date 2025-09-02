export interface TastedListDto {
    tastedListId: number;
    items: TastedListItemDto[];
}

export interface TastedListItemDto {
    monsterId: number;
    monsterName: string;
    imageUrl: string;
    rating: number;
    grade: string;
    comment: string;
}

export interface AddTastedListRequestDto {
    monsterId: number;
}

export interface RatingRequestDto {
    rating: number;
}

export interface CommentRequestDto {
    comment: string;
}