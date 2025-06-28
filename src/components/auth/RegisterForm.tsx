"use client";

import Image from 'next/image';
import Link from 'next/link';

interface RegisterFormProps{
    onSubmit: void;
    loading: void;
    success: void;
}

export default function RegisterForm({ onSubmit, loading, success }: RegisterFormProps) {
    return (
        <>
            <div className="min-w-full">
                <Image 
                    className="mx-auto h-10 w-auto" 
                    src="/globe.svg" 
                    alt="Your Company" 
                    width={40} 
                    height={40} 
                    priority
                />
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Daftar Akun Baru
                </h2>
            </div>

            {success && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg min-w-full">
                    <div className="flex min-w-full">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-green-800">
                                Berhasil!
                            </h3>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-10 min-w-full">
                <form className="space-y-6" onSubmit={onSubmit}>
                <div>
                        <label htmlFor="nama_lengkap" className="block text-sm font-medium leading-6 text-gray-900">
                            Nama Lengkap <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="nama_lengkap"
                                id="nama_lengkap"
                                autoComplete="name"
                                required
                                placeholder="Masukkan nama lengkap Anda"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            Alamat Email <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                            <input
                                type="email"
                                name="email"
                                id="email"
                                autoComplete="email"
                                required
                                placeholder="contoh@email.com"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                            <input
                                type="password"
                                name="password"
                                id="password"
                                autoComplete="new-password"
                                required
                                minLength={6}
                                placeholder="Minimal 6 karakter"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Minimal 6 karakter
                            </p>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="no_telp" className="block text-sm font-medium leading-6 text-gray-900">
                            Nomor Telepon <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                            <input
                                type="tel"
                                name="no_telp"
                                id="no_telp"
                                autoComplete="tel"
                                required
                                placeholder="08xxxxxxxxxx"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="alamat_lengkap" className="block text-sm font-medium leading-6 text-gray-900">
                            Alamat Lengkap <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                            <textarea
                                name="alamat_lengkap"
                                id="alamat_lengkap"
                                rows={3}
                                required
                                placeholder="Masukkan alamat lengkap Anda"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold text-white shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors ${
                                loading 
                                    ? 'bg-indigo-400 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-500'
                            }`}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Memproses...
                                </>
                            ) : 'Daftar'}
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Sudah punya akun?{' '}
                    <Link 
                        href="/auth/login" 
                        className={`font-semibold leading-6 text-indigo-600 hover:text-indigo-500 ${
                            loading ? 'pointer-events-none opacity-50' : ''
                        }`}
                        onClick={(e) => loading ? e.preventDefault() : null}
                    >
                        Login disini!
                    </Link>
                </p>
            </div>
        </>
    );
}
