export type Keluhan = {
    id: number;
    judul: string;
    created_at: string;
    status: 'Pending' | 'On Progress' | 'Done';
    description: string;
    user_id: number;
    media: string;
}