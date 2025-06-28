import KeluhanList from "@/components/KeluhanList";
import { Keluhan } from "@/types/keluhan.types";
import { useState } from 'react';
import KeluhanDetail from "@/components/KeluhanDetail";
import Image from "next/image";
import { AiOutlinePlus } from "react-icons/ai";
import KeluhanModal from "@/components/modals/KeluhanModal";
import useSWR from "swr";

export default function UserViews() {   
    const [selectedComplaint, setSelectedComplaint] = useState<Keluhan | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleComplaintClick = (complaint: Keluhan) => {
        setSelectedComplaint(complaint);
    };

    const handleClick = () => {
        setIsOpen(!isOpen);
    }
    
    const fetcher = async (url: string) => {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error('Failed to fetch data');
        }
        return res.json();
    };
    
    const { data: keluhan, error, isLoading } = useSWR("/api/keluhan", fetcher);
    
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-red-500">
                Error loading complaints: {error.message}
            </div>
        );
    }

    console.log("keluhan: ", keluhan);

    return (
        <section className="keluhan-list">
            <div className="mx-auto px-4 py-8">
                <div className="flex items-start justify-between space-x-14">
                    <div className="mr-4 border-r-1 border-gray-300 pr-3">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-800">Daftar Keluhan</h1>
                            <button 
                                type="button" 
                                className="bg-blue-500 text-white py-2 px-2 rounded-full hover:cursor-pointer hover:bg-blue-700 transition" 
                                onClick={handleClick}
                            >
                                <AiOutlinePlus size={20} />
                            </button>
                        </div>
                        <div>
                            {keluhan && keluhan.length > 0 ? (
                                <KeluhanList 
                                    complaints={keluhan} 
                                    clickList={handleComplaintClick} 
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full p-8 text-gray-500">
                                    <Image 
                                        src="/globe.svg" 
                                        alt="Logo" 
                                        width={40} 
                                        height={40} 
                                        className="h-10 w-auto mb-4" 
                                    />
                                    <p>Tidak ada keluhan</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="w-2/5 sticky top-8">
                        {selectedComplaint ? (
                            <KeluhanDetail selectedComplaint={selectedComplaint} />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full p-8 text-gray-500">
                                <Image 
                                    src="/globe.svg" 
                                    alt="Logo" 
                                    width={40} 
                                    height={40} 
                                    className="h-10 w-auto mb-4" 
                                />
                                <p>Pilih keluhan untuk melihat detail</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
                
            <div 
                id="crud-modal" 
                tabIndex={-1} 
                aria-hidden="true" 
                className={`${isOpen ? 'flex' : 'hidden'} overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full h-full`} 
                style={{background: 'rgba(0, 0, 0, 0.5)'}}
            >
                <KeluhanModal event={handleClick}/>
            </div>
        </section>
    );
}