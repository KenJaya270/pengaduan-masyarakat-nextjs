import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";
interface KeluhanModalProps{

    event : () => void;

}


export default function KeluhanModal({event} : KeluhanModalProps){

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const router = useRouter();

    const uploadImage = async (file: File) => {

        try{

            const fileExt = file.name.split(".").pop();

            const fileName = `${Math.random()}.${fileExt}`

            const filePath = `${fileName}`;

            const {error:uploadError} = await supabase
            .storage
            .from("gambarkeluhan")
            .upload(filePath, file);

            if(uploadError) throw uploadError;

            const {data: urlData} = supabase.storage.from("gambarkeluhan").getPublicUrl(filePath);

            return urlData.publicUrl;

        }catch(error){
            console.log("Error uploading image: ", error);
            return null;
        }

    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        setLoading(true);
        setError(false);
        setSuccess(false);

        try{

            const formData = new FormData(e.currentTarget);
    
            const judul = formData.get("judul");
            const description = formData.get("description");
            const media = formData.get("file") as File;
    
            
            if (!media || !media.type.startsWith('image/')) {
                throw new Error('File harus berupa gambar');
            }

            const mediaUrl = await uploadImage(media);

            if(!mediaUrl) throw new Error("Gagal upload gambar");

            const userData = localStorage.getItem("user");
    
            if(!userData){
                setError(true);
                return router.push("/auth/login");
            }
    
            const user = JSON.parse(userData);
    
            const payload = {
                judul,
                description,
                status : "pending",
                media: mediaUrl,
                user_id: user.id,
            }

            const {error:dbError} = await supabase
            .from("keluhan")
            .insert([payload])

            if(dbError) throw dbError;

            setSuccess(true);
            event();

        }catch (error){

            console.log("Error inserting data: ", error);
            return 0;

        }finally{
            setLoading(false);
        } 


    }

    return <>

    <div className="relative p-4 w-full max-w-md max-h-full">

        <div className="relative bg-white rounded-lg shadow-lg dark:bg-gray-700">
            
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Adukan Keluhan
                </h3>

                <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal" onClick={event}>
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span className="sr-only">Close modal</span>
                </button>

            </div>

            <div className="p-4 md:p-5">

                <form onSubmit={handleSubmit}>

                    <div className="grid gap-4 mb-4 grid-cols-2">
                            
                        <div className="col-span-2">

                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Judul Keluhan</label>

                            <input type="text" name="title" id="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Tulis judul keluhan" required={true}/>

                        </div>
                        <div className="col-span-2">

                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Upload Foto</label>

                            <input type="file" name="file" id="file" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required={true}/>

                        </div>


                        <div className="col-span-2">

                            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Deskripsi</label>

                            <textarea id="description" rows={4} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Tulis deskripsi keluhan" name="description"></textarea>                    

                        </div>
                        
                    </div>

                    <button type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">

                        <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>

                        Tambahkan Keluhan

                    </button>

                </form>

            </div>

        </div>

    </div>

</>

}