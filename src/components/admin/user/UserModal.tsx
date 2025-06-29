import { useState } from 'react';

interface User {
    id?: number;
    nama_lengkap: string;
    alamat_lengkap: string;
    no_telp: string;
    role: string;
    email: string;
    password: string;
}

interface UserModalProps {
    dataUser?: User | null;
    handleClose: () => void;
    handlerSubmit: (formData: User) => Promise<void>;
}

const defaultUser: User = {
    nama_lengkap: '',
    alamat_lengkap: '',
    no_telp: '',
    role: 'user',
    email: '',
    password: '',
}

export default function UserModal({dataUser = null, handleClose, handlerSubmit} : UserModalProps) {

    const [formData, setFormData] = useState<User>({
        id: dataUser?.id,
        nama_lengkap: dataUser?.nama_lengkap || '',
        alamat_lengkap: dataUser?.alamat_lengkap || '',
        no_telp: dataUser?.no_telp || '',
        role: dataUser?.role || 'user',
        email: dataUser?.email || '',
        password: dataUser?.password || '',
    });

    const [isSubmitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Reset error state
        setError(null);
        setSubmitting(true);

        try {
            await handlerSubmit(formData);
            handleClose();
        } catch (error) {
            console.log("Submission error: ", error);
            setError(error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan data');
        } finally {
            setSubmitting(false);
        }
    };

    const isEditMode = Boolean(dataUser?.id);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">
                        {isEditMode ? 'Edit User' : 'Tambah User'}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600"
                        disabled={isSubmitting}
                    >
                        ✕
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nama Lengkap
                        </label>
                        <input
                            type="text"
                            name="nama_lengkap"
                            value={formData.nama_lengkap}
                            onChange={handleChange}
                            className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={isSubmitting}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={isSubmitting}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            No. Telepon
                        </label>
                        <input
                            type="tel"
                            name="no_telp"
                            value={formData.no_telp}
                            onChange={handleChange}
                            className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={isSubmitting}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Alamat Lengkap
                        </label>
                        <input
                            type="text"
                            name="alamat_lengkap"
                            value={formData.alamat_lengkap}
                            onChange={handleChange}
                            className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={isSubmitting}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password {isEditMode && <span className="text-gray-500">(kosongkan jika tidak ingin mengubah)</span>}
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required={!isEditMode}
                            disabled={isSubmitting}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Role
                        </label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={isSubmitting}
                        >
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </select>
                    </div>
                    
                    <div className="flex space-x-3 pt-4">
                        <button 
                            type="submit" 
                            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Loading...
                                </span>
                            ) : (
                                isEditMode ? 'Update' : 'Simpan'
                            )}
                        </button>
                        
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            disabled={isSubmitting}
                        >
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}