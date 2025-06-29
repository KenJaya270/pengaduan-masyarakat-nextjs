import React, { useState, useEffect } from 'react';
import { 
    FaTimes,
    FaUsers,
    FaComments
} from 'react-icons/fa';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import UserTable from "@/components/admin/user/UserTable";
import UserModal from "@/components/admin/user/UserModal";
import KeluhanTable from "@/components/admin/keluhan/KeluhanTable";
import KeluhanModal from "@/components/admin/keluhan/KeluhanModal";
import {supabase} from "@/lib/supabase";
import User from '@/types/user.types';

interface Complaint {
    id: number;
    judul: string;
    description: string;
    user_id: number;
    status: string;
    date: string;
    pelapor_nama?: string;
    media?: string;
}

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('users');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [editingItem, setEditingItem] = useState<User | Complaint | null>(null);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

    const fetcher = (url: string) => fetch(url).then(res => res.json());
    const {data: userData, error, mutate: mutateUsers} = useSWR('/api/users', fetcher);

    // State untuk users
    const [users, setUsers] = useState<any[]>([]);
    
    // State untuk complaints
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [complaintsLoading, setComplaintsLoading] = useState(false);

    useEffect(() => {
        if(userData) setUsers(userData);
    }, [userData]);

    // Fetch complaints dengan JOIN ke profiles
    const fetchComplaints = async () => {
        setComplaintsLoading(true);
        try {
            const { data, error } = await supabase
                .from('keluhan')
                .select(`
                    id,
                    judul,
                    description,
                    user_id,
                    status,
                    created_at,
                    media,
                    profiles!inner(nama_lengkap)
                `)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching complaints:', error);
                return;
            }

            // Transform data untuk menambahkan nama pelapor
            const transformedData = data?.map(complaint => ({
                id: complaint.id,
                judul: complaint.judul,
                description: complaint.description,
                user_id: complaint.user_id,
                status: complaint.status,
                date: complaint.created_at,
                media: complaint.media,
                pelapor_nama: complaint.profiles?.nama_lengkap || 'Unknown User'
            })) || [];

            setComplaints(transformedData);
        } catch (error) {
            console.error('Error fetching complaints:', error);
        } finally {
            setComplaintsLoading(false);
        }
    };

    // Load complaints saat component mount atau tab berubah ke complaints
    useEffect(() => {
        if (activeTab === 'complaints') {
            fetchComplaints();
        }
    }, [activeTab]);

    const handleSubmitUser = async (formData: User) => {
        try {
            if(formData.id) {
                const { error } = await supabase
                    .from('profiles')
                    .update(formData)
                    .eq('id', formData.id);
                
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('profiles')
                    .insert(formData);
                
                if (error) throw error;
            }

            // Refresh users data
            mutateUsers();
            
        } catch(error) {
            console.log("Error saving user: ", error);
            throw error; // Re-throw untuk ditangani di UserModal
        }
    };

    const openModal = (type: string, item?: User | Complaint) => {
        setModalType(type);
        setShowModal(true);
        setEditingItem(item || null);
    };

    const closeModal = () => {
        setShowModal(false);
        setModalType('');
        setEditingItem(null);
    };

    const handleDelete = async (type: string, id: number) => {
        // Konfirmasi delete
        const confirmMessage = type === 'user' 
            ? 'Apakah Anda yakin ingin menghapus user ini? Semua keluhan yang terkait juga akan dihapus.'
            : 'Apakah Anda yakin ingin menghapus keluhan ini?';
            
        if (!window.confirm(confirmMessage)) {
            return;
        }

        setIsDeleting(id);
        
        try {
            if (type === 'user') {
                // Get all complaints for this user to delete their photos
                const { data: userComplaints, error: fetchError } = await supabase
                    .from('keluhan')
                    .select('media')
                    .eq('user_id', id);

                if (fetchError) throw fetchError;

                // Delete photos from storage
                if (userComplaints && userComplaints.length > 0) {
                    for (const complaint of userComplaints) {
                        if (complaint.media) {
                            await deletePhotoFromStorage(complaint.media);
                        }
                    }
                }

                // Delete user dan cascade delete semua keluhan yang terkait
                // Supabase akan otomatis handle cascade jika foreign key constraint ada
                const { error: profileError } = await supabase
                    .from('profiles')
                    .delete()
                    .eq('id', id);

                if (profileError) {
                    // Jika ada constraint error, hapus keluhan dulu
                    if (profileError.code === '23503') {
                        const { error: keluhanError } = await supabase
                            .from("keluhan")
                            .delete()
                            .eq("user_id", id);

                        if (keluhanError) throw keluhanError;

                        // Coba hapus profile lagi
                        const { error: profileError2 } = await supabase
                            .from('profiles')
                            .delete()
                            .eq('id', id);

                        if (profileError2) throw profileError2;
                    } else {
                        throw profileError;
                    }
                }

                // Refresh users data
                mutateUsers();
                
                // Refresh complaints jika sedang di tab complaints
                if (activeTab === 'complaints') {
                    await fetchComplaints();
                }

                alert('User berhasil dihapus!');

            } else if (type === 'complaint') {
                // Find the complaint to get photo URL
                const complaintToDelete = complaints.find(c => c.id === id);
                
                // Delete photo from storage if exists
                if (complaintToDelete?.media) {
                    await deletePhotoFromStorage(complaintToDelete.media);
                }

                // Delete complaint from database
                const { error } = await supabase
                    .from('keluhan')
                    .delete()
                    .eq('id', id);

                if (error) throw error;

                // Refresh complaints data
                await fetchComplaints();
                
                alert('Keluhan berhasil dihapus!');
            }

        } catch (error) {
            console.error('Error deleting data:', error);
            
            let errorMessage = 'Gagal menghapus data: ';
            if (error instanceof Error) {
                errorMessage += error.message;
            } else {
                errorMessage += 'Terjadi kesalahan yang tidak diketahui';
            }
            
            alert(errorMessage);
        } finally {
            setIsDeleting(null);
        }
    };

    const deletePhotoFromStorage = async (photoUrl: string) => {
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
                console.error('Error deleting photo from storage:', error);
            }
        } catch (error) {
            console.error('Error deleting photo from storage:', error);
        }
    };

    const getStatusBadge = (status: string) => {
        const statusColors = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'on_progress': 'bg-blue-100 text-blue-800', 
            'done': 'bg-green-100 text-green-800'
        };
        
        const statusLabels = {
            'pending': 'Pending',
            'on_progress': 'On Progress',
            'done': 'Done'
        };
        
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
                {statusLabels[status] || status}
            </span>
        );
    };

    const router = useRouter();
    const handleLogout = async () => {
        localStorage.removeItem('user');
        router.push('/auth/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-600">
                                <button type="button" className='px-5 py-1 rounded-full text-white bg-red-600 hover:bg-red-700 transition hover:cursor-pointer' onClick={handleLogout}>Logout</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeTab === 'users' 
                                ? 'bg-white text-blue-600 shadow-sm' 
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <FaUsers className="mr-2" />
                        Manajemen User ({users.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('complaints')}
                        className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeTab === 'complaints' 
                                ? 'bg-white text-blue-600 shadow-sm' 
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <FaComments className="mr-2" />
                        Keluhan Masyarakat ({complaints.length})
                    </button>
                </div>

                {/* Users Table */}
                {activeTab === 'users' && (
                    <UserTable 
                        users={users} 
                        openModal={openModal} 
                        handleDelete={handleDelete}
                        isDeleting={isDeleting}
                    />
                )}

                {/* Complaints Table */}
                {activeTab === 'complaints' && (
                    <KeluhanTable 
                        complaints={complaints} 
                        openModal={openModal} 
                        handleDelete={handleDelete} 
                        getStatusBadge={getStatusBadge}
                        isDeleting={isDeleting}
                        isLoading={complaintsLoading}
                    />
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
                    <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {editingItem ? 'Edit' : 'Tambah'} {modalType === 'user' ? 'User' : 'Keluhan'}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <FaTimes />
                            </button>
                        </div>
                        
                        <div className="p-6">
                            {modalType === 'user' && (
                                <UserModal 
                                    dataUser={editingItem as User} 
                                    handleClose={closeModal} 
                                    handlerSubmit={handleSubmitUser}
                                />
                            )}

                            {modalType === 'complaint' && (
                                <KeluhanModal 
                                    dataKeluhan={editingItem as Complaint}
                                    handleClose={closeModal}
                                    onSubmit={fetchComplaints} // Refresh data setelah submit
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;