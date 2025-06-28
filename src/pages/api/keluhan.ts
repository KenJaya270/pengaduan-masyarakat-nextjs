// file: pages/api/keluhan.ts
import { supabase } from "@/lib/supabase";
import type { NextApiRequest, NextApiResponse } from "next";

const SUPABASE_TIMEOUT = 10000; // 10 detik

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // 1. Ambil data keluhan
        const { data: keluhanData, error: keluhanError } = await supabase
            .from("keluhan")
            .select("*")
            .order("created_at", { ascending: false });

        if (keluhanError) {
            console.error("Keluhan query error:", keluhanError);
            return res.status(500).json({ error: keluhanError.message });
        }

        if (!keluhanData || keluhanData.length === 0) {
            return res.status(200).json([]);
        }

        // 2. Ambil data reporter
        const userIds = [...new Set(
            keluhanData.map(item => item.user_id).filter(Boolean)
        )];

        let reporterData = null;

        if (userIds.length > 0) {
            const { data, error: reporterError } = await supabase
                .from("profiles")
                .select("user_id, nama_lengkap") // Hanya ambil field yang diperlukan
                .in("user_id", userIds);

            if (reporterError) {
                console.error("Reporter query error:", reporterError);
            } else {
                reporterData = data;
            }
        }

        // 3. Gabungkan data
        const dataKeluhan = keluhanData.map(item => {
            const reporter = reporterData?.find(profile => profile.user_id === item.user_id);
            return {
                ...item,
                reporter: reporter?.nama_lengkap || null
            };
        });

        console.log("Data yang akan dikirim:", {
            keluhanCount: keluhanData.length,
            reporterCount: reporterData?.length || 0,
            sampleItem: dataKeluhan[0]
        });

        return res.status(200).json(dataKeluhan);

    } catch (error: any) {
        console.error("Unhandled error in API route:", error);
        return res.status(500).json({ 
            error: error.message || "Internal Server Error",
            details: error.details || null
        });
    }
}