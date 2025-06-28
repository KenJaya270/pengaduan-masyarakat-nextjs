import LoginForm from "@/components/auth/LoginForm";
import {useRouter} from "next/router";
import {useState} from "react";
import {supabase} from "@/lib/supabase";


export default function LoginPage(){

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [success, setSuccess] = useState(false);

    const router = useRouter()

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setErrorMsg("")
        setSuccess(false)


        const formData = new FormData(e.currentTarget)
        const email = formData.get("email");
        const password = formData.get("password");

        const {data, error} = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email).eq("password", password)
        .single()

        if(error || !data){
            setErrorMsg("Email atau password salah!");
            
        }else {
            setSuccess(true)
            
            localStorage.setItem("user", JSON.stringify(data))

            console.log("Login berhasil: ", data);
        }

        setLoading(false);

        setTimeout(() => {
            router.push("/user")
        }, 2000)
    }

    return (
        <div className="flex min-h-full flex-col justify-center items-center px-6 py-12 lg:px-8">

            <div className="bg-white p-8 rounded-lg shadow-md sm:mx-auto sm:w-full sm:max-w-sm">

                <LoginForm onSubmit={handleLogin} loading={loading} success={success} errorMsg={errorMsg}></LoginForm>
                
            </div>
        </div>

    )
}