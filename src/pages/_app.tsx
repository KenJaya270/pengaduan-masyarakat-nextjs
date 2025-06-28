import "@/styles/globals.css";
import type { AppProps } from "next/app";
import AppShell from "@/components/layouts/Appshell";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {

    const router = useRouter();

    const path = ["/auth/login", "/auth/register", "/auth/forgot-password", "/404", "/500", "/"];
    return (
        <AppShell>
            <div className={`${path.includes(router.pathname) ? `bg-blue-700` : ``} min-h-screen`}>
                <Component {...pageProps} />
            </div>
        </AppShell>
    );
}