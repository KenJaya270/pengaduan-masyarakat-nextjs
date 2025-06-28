import Link from 'next/link';
import Image from 'next/image';
export default function NavbarPage(){

    return (

        <nav className='relative top-0 w-full shadow-md bg-white flex items-center justify-between px-4 py-4'>
            <div className="flex items-center justify-between px-4 py-2">
                <Link href="/" className="flex items-center">
                    <Image src="/globe.svg" alt="Logo" width={40} height={40} className="h-10 w-auto" />
                    <span className="ml-2 text-xl font-bold">Pengaduan Masyarakat</span>
                </Link>
            </div>
            <ul className='flex items-center space-x-4 px-4 py-2'>
                <li className='rounded-full bg-red-700 text-white px-4 py-2 hover:cursor-pointer hover:bg-red-800 transition'><Link href="/logout">Logout</Link></li>
            </ul>
        </nav>
    )
}