import { supabase } from "@/lib/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Hanya izinkan metode GET
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // Mengambil data dari tabel profiles dengan order by created_at descending
        const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

        if (error) {
        throw error;
        }

        // Jika data ditemukan
        return res.status(200).json(data);
        
    } catch (error) {
        // Handle error
        console.error('Error fetching profiles:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}