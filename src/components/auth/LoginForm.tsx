import Link from 'next/link';
import Image from 'next/image';

interface LoginFormProps{

    onSubmit: void;
    loading: void;
    errorMsg: void;
    success: void;

}


export default function Form({onSubmit, loading, errorMsg, success}: LoginFormProps) {
    return <>
    
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <Image className="mx-auto h-10 w-auto" src="/globe.svg" alt="Your Company" width={40} height={40} />
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Login ke Akunmu!</h2>
        </div>

        {errorMsg && (
            <div className="mt-4 p-3 bg-red-100 text-red-600 text-sm rounded">
                {errorMsg}
            </div>

        )}

        {success && (
            <div className="mt-4 p-3 bg-green-100 text-green-600 text-sm rounded">
                Login berhasil!
            </div>
        )}

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" onSubmit={onSubmit} method="POST">
                <div>
                    <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">Alamat Email</label>
                    <div className="mt-2">
                        <input type="email" name="email" id="email" autoComplete="email" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between">
                        <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">Password</label>
                    </div>
                    <div className="mt-2">
                        <input type="password" name="password" id="password" autoComplete="current-password" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                    </div>
                </div>

                <div>
                    <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" disabled={loading}>

                    {loading ? "Memproses" : "Login"}
                    
                    </button>
                </div>
            </form>

            <p className="mt-10 text-center text-sm/6 text-gray-500">
                Belum punya akun? 
                <Link href="/auth/register" className="font-semibold text-indigo-600 hover:text-indigo-500"> Daftar disini!</Link>
            </p>
        </div>
    </>
}