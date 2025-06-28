"use client"; // Tambahkan ini agar bisa pakai state & efek

import { useState } from "react";
import RegisterForm from "@/components/auth/RegisterForm";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/router";

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const payload = {
            nama_lengkap: formData.get("nama_lengkap"),
            email: formData.get("email"),
            password: formData.get("password"),
            no_telp: formData.get("no_telp"),
            alamat_lengkap: formData.get("alamat_lengkap"),
            role: "user"
        };

        const { error } = await supabase.from("profiles").insert(payload);

        if (error) {
            console.error("Gagal daftar:", error.message);
            setSuccess(false);
        } else {
            setSuccess(true);
        }

        
        setLoading(false);
        setTimeout(() => {
            router.push("/auth/login")

        }, 2000);
    };

    return (
        <div className="flex min-h-full flex-col justify-center items-center px-6 py-12 lg:px-8">
            <div className="bg-white p-8 rounded-lg shadow-md sm:mx-auto min-w-1/2 sm:max-w-sm">
                <RegisterForm onSubmit={handleSubmit} loading={loading} success={success} />
            </div>
        </div>
    );
}
