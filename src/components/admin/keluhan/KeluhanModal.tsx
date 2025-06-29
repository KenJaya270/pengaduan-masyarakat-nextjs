import React, { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import Image from 'next/image';

interface Complaint {
    id?: number;
    judul: string;
    description: string;
    user_id: number;
    status: string;
    media?: string;
}

interface User {
    id: number;
    nama_lengkap: string;
    email: string;
}

interface KeluhanModalProps {
    dataKeluhan?: Complaint | null;
    handleClose: () => void;
    onSubmit: () => void; // Callback untuk refresh data
}

export default function KeluhanModal({ 
    dataKeluhan, 
    handleClose, 
    onSubmit 
}: KeluhanModalProps) {
    const [formData, setFormData] = useState<Complaint>({
        judul: '',
        description: '',
        user_id: 0,
        status: 'pending',
        media: ''
    });
    
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    // Load users untuk dropdown
    useEffect(() => {
        fetchUsers();
    }, []);

    // Set form data jika editing
    useEffect(() => {
        if (dataKeluhan) {
            setFormData({
                id: dataKeluhan.id,
                judul: dataKeluhan.judul || '',
                description: dataKeluhan.description || '',
                user_id: dataKeluhan.user_id || 0,
                status: dataKeluhan.status || 'pending',
                media: dataKeluhan.media || ''
            });
        }
    }, [dataKeluhan]);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, nama_lengkap, email')
                .order('nama_lengkap');

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('Gagal memuat data users');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'user_id' ? parseInt(value) || 0 : value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validasi tipe file
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                alert('Tipe file tidak didukung. Gunakan JPG, PNG, atau GIF.');
                return;
            }
            
            // Validasi ukuran file (maksimal 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Ukuran file terlalu besar. Maksimal 5MB.');
                return;
            }
            
            setSelectedFile(file);
        }
    };

    const uploadPhoto = async (file: File): Promise<string> => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `keluhan/${fileName}`;

        setIsUploading(true);
        setUploadProgress(0);

        try {
            const { data, error } = await supabase.storage
                .from('gambarkeluhan')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) throw error;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('gambarkeluhan')
                .getPublicUrl(filePath);

            return publicUrl;
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const deletePhoto = async (photoUrl: string) => {
        if (!photoUrl) return;
        
        try {
            // Extract file path from URL
            const urlParts = photoUrl.split('/');
            const fileName = urlParts[urlParts.length - 1];
            const filePath = `keluhan/${fileName}`;

            const { error } = await supabase.storage
                .from('gambarkeluhan')
                .remove([filePath]);

            if (error) {
                console.error('Error deleting photo:', error);
            }
        } catch (error) {
            console.error('Error deleting photo:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.judul.trim() || !formData.description.trim() || !formData.user_id) {
            alert('Semua field harus diisi');
            return;
        }

        setIsSubmitting(true);
        
        try {
            let fotoUrl = formData.media || '';
            
            // Upload foto jika ada file baru
            if (selectedFile) {
                // Jika edit dan ada foto lama, hapus foto lama
                if (formData.id && formData.media) {
                    await deletePhoto(formData.media);
                }
                
                fotoUrl = await uploadPhoto(selectedFile);
            }

            const keluhanData = {
                judul: formData.judul,
                description: formData.description,
                user_id: formData.user_id,
                status: formData.status,
                media: fotoUrl || null
            };

            if (formData.id) {
                // Update existing keluhan
                const { error } = await supabase
                    .from('keluhan')
                    .update({
                        ...keluhanData,
                    })
                    .eq('id', formData.id);

                if (error) throw error;
                alert('Keluhan berhasil diperbarui!');
            } else {
                // Insert new keluhan
                const { error } = await supabase
                    .from('keluhan')
                    .insert({
                        ...keluhanData,
                        created_at: new Date().toISOString()
                    });

                if (error) throw error;
                alert('Keluhan berhasil ditambahkan!');
            }

            // Refresh data dan tutup modal
            onSubmit();
            handleClose();

        } catch (error) {
            console.error('Error saving keluhan:', error);
            alert('Gagal menyimpan keluhan: ' + (error instanceof Error ? error.message : 'Unknown error'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const isEditing = !!dataKeluhan?.id;

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Judul <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="judul"
                    value={formData.judul}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan judul keluhan"
                    required
                    disabled={isSubmitting}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi <span className="text-red-500">*</span>
                </label>
                <textarea
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Masukkan deskripsi keluhan"
                    required
                    disabled={isSubmitting}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Foto Keluhan
                </label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isSubmitting || isUploading}
                />
                <p className="text-xs text-gray-500 mt-1">
                    Format: JPG, PNG, GIF. Maksimal 5MB
                </p>
                
                {/* Preview existing photo */}
                {formData.media && !selectedFile && (
                    <div className="mt-2">
                        <p className="text-xs text-gray-600 mb-1">Foto saat ini:</p>
                        <Image 
                            src={formData.media}
                            width={200} 
                            height={200}
                            alt="Foto keluhan" 
                            className="w-20 h-20 object-cover rounded border"
                        />
                    </div>
                )}
                
                {/* Preview selected file */}
                {selectedFile && (
                    <div className="mt-2">
                        <p className="text-xs text-gray-600 mb-1">Foto baru:</p>
                        <Image 
                            width={200}
                            height={200}
                            src={URL.createObjectURL(selectedFile)} 
                            alt="Preview" 
                            className="w-20 h-20 object-cover rounded border"
                        />
                    </div>
                )}
                
                {/* Upload progress */}
                {isUploading && (
                    <div className="mt-2">
                        <div className="bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Mengupload foto...</p>
                    </div>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pelapor <span className="text-red-500">*</span>
                </label>
                <select
                    name="user_id"
                    value={formData.user_id}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={isSubmitting || isLoading}
                >
                    <option value="">Pilih Pelapor</option>
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.nama_lengkap} ({user.email})
                        </option>
                    ))}
                </select>
                {isLoading && (
                    <p className="text-xs text-gray-500 mt-1">Memuat data users...</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status <span className="text-red-500">*</span>
                </label>
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={isSubmitting}
                >
                    <option value="Pending">Pending</option>
                    <option value="On Progress">On Progress</option>
                    <option value="Done">Done</option>
                </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    disabled={isSubmitting}
                >
                    Batal
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting || isLoading || isUploading}
                >
                    {isSubmitting ? 'Menyimpan...' : isUploading ? 'Mengupload...' : (isEditing ? 'Update' : 'Simpan')}
                </button>
            </div>
        </form>
    );
}