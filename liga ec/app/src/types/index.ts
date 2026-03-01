export type Position = 'GK' | 'DEF' | 'MID' | 'FWD';
export type Category = 'Iconic' | 'Gold' | 'Silver';

export interface Team {
    id: string;
    name: string;
}

export interface Player {
    id: string;
    name: string;
    position: Position;
    category: Category;
    team_id: string | null;
    image_url?: string;
}
