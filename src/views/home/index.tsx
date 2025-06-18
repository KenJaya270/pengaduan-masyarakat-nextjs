import Link from 'next/link';
import { BsArrowRight } from "react-icons/bs";

export default function HomePage(){
    return (
        <div className="container mx-auto my-auto bg-blue-700 min-h-screen flex justify-center items-center">
            <div className="wrapper">
                <h1 className="text-white text-7xl text-center">Pengaduan Masyarakat</h1>
                <p className="text-white text-2xl text-center mt-4">Sampaikan keluhan Anda dengan mudah!</p>
                <div className="flex justify-center mt-8">
                    <Link href={"/auth/login"} className="flex items-center justify-center">
                        <div className="bg-white p-6 rounded-full shadow-lg">
                            <BsArrowRight className='text-blue-700 text-xl'/>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}