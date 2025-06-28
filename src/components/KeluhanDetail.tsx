import Image from 'next/image';
import { Keluhan } from "@/types/keluhan.types";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from 'react';

interface Reporter {
  user_id: string;
  nama_lengkap: string;
}

export default function KeluhanDetail({selectedComplaint} : {selectedComplaint: Keluhan}) {
    const [reporter, setReporter] = useState<Reporter | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReporter = async () => {
            if (!selectedComplaint?.user_id) return;
            
            setLoading(true);
            setError(null);
            
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('id, nama_lengkap')
                    .eq('id', selectedComplaint.user_id)
                    .single();

                if (error) throw error;
                setReporter(data);
            } catch (err) {
                console.error('Error fetching reporter:', err);
                setError('Gagal memuat data pelapor');
            } finally {
                setLoading(false);
            }
        };

        fetchReporter();
    }, [selectedComplaint]);

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-48 w-full">
                <Image
                    src={selectedComplaint.media || '/default-image.jpg'}
                    alt="Preview Keluhan"
                    layout="fill"
                    objectFit="cover"
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {selectedComplaint.judul}
                </h2>
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{new Date(selectedComplaint.created_at).toLocaleDateString('id')}</span>
                </div>
            
                <div className="mb-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${selectedComplaint.status === 'On Progress' ? 'bg-yellow-100 text-yellow-800' :
                        selectedComplaint.status === 'Done' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'}`}>
                        {selectedComplaint.status}
                    </span>
                </div>
                <div className="space-y-3">
                    <div>
                        <h3 className="text-sm font-medium text-gray-600">Pelapor:</h3>
                        {loading ? (
                            <p className="text-sm text-gray-500">Memuat data pelapor...</p>
                        ) : error ? (
                            <p className="text-sm text-red-500">{error}</p>
                        ) : (
                            <p className="text-sm text-gray-800">
                                {reporter?.nama_lengkap || 'Tidak diketahui'}
                            </p>
                        )}
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-600">Deskripsi:</h3>
                        <p className="text-sm text-gray-800">{selectedComplaint.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}