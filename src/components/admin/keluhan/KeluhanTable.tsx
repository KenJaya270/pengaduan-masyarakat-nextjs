import { FaPlus, FaEdit, FaTrash, FaExclamationCircle, FaSpinner } from "react-icons/fa"

interface Complaint {
    id: number;
    title: string;
    description: string;
    user_id: number;
    status: string;
    date: string;
    // Data yang sudah di-join dari profiles
    pelapor_nama?: string;
}

interface KeluhanTableProps {
    complaints: Complaint[]
    openModal: (type: string, complaint?: Complaint) => void
    handleDelete: (type: string, id: number) => Promise<void>
    getStatusBadge: (status: string) => JSX.Element
    isDeleting?: number | null
    isLoading?: boolean
}

export default function KeluhanTable({
    complaints, 
    openModal, 
    handleDelete, 
    getStatusBadge,
    isDeleting,
    isLoading = false
}: KeluhanTableProps) {

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const truncateText = (text: string, maxLength: number = 100) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    if (isLoading) {
        return (
            <div className="bg-white shadow-sm rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Data Keluhan</h2>
                </div>
                <div className="flex items-center justify-center py-12">
                    <FaSpinner className="animate-spin text-2xl text-gray-400 mr-3" />
                    <span className="text-gray-500">Memuat data keluhan...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-sm rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">Data Keluhan</h2>
                    <button
                        onClick={() => openModal('complaint')}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                    >
                        <FaPlus className="mr-2" />
                        Tambah Keluhan
                    </button>
                </div>
            </div>
                    
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Judul
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Deskripsi
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Pelapor
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tanggal
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {complaints.map((complaint) => (
                            <tr key={complaint.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <FaExclamationCircle className="text-orange-500 mr-3 flex-shrink-0" />
                                        <div className="text-sm font-medium text-gray-900 max-w-xs">
                                            {complaint.judul}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div 
                                        className="text-sm text-gray-900 max-w-xs"
                                        title={complaint.description}
                                    >
                                        {truncateText(complaint.description, 80)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {complaint.pelapor_nama || 'Unknown User'}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        ID: {complaint.user_id}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getStatusBadge(complaint.status)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatDate(complaint.date)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => openModal('complaint', complaint)}
                                            className="text-blue-600 hover:text-blue-900 p-1"
                                            disabled={isDeleting === complaint.id}
                                            title="Edit Keluhan"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete('complaint', complaint.id)}
                                            className="text-red-600 hover:text-red-900 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={isDeleting === complaint.id}
                                            title={isDeleting === complaint.id ? "Menghapus..." : "Hapus Keluhan"}
                                        >
                                            {isDeleting === complaint.id ? (
                                                <FaSpinner className="animate-spin" />
                                            ) : (
                                                <FaTrash />
                                            )}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        
                        {complaints.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                    <div className="flex flex-col items-center">
                                        <FaExclamationCircle className="text-4xl mb-2 opacity-50" />
                                        <p>Tidak ada data keluhan</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}