import {useRouter} from 'next/router';
import NavbarPage from '@/components/layouts/Navbar';

type AppshellProps = {

    children : React.ReactNode;

}

const disableNavbar = ["/auth/login", "/auth/register", "auth/forgot-password", "/404", "/500", "/"];

export default function AppShell(props: AppshellProps) {

    const {children} = props;
    const router = useRouter();

    console.log(router);

    const renderNavbar = !disableNavbar.includes(router.pathname);

    return (

        <main>

            {renderNavbar && <NavbarPage/>}

            {children}

        </main>

    )

}