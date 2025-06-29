import { useRouter } from 'next/router';
import NavbarPage from '@/components/layouts/Navbar';
import { useEffect, useState } from 'react';

type AppshellProps = {
  children: React.ReactNode;
};

// Pages that don't show navbar
const disableNavbar = [
  "/auth/login", 
  "/auth/register", 
  "/auth/forgot-password", 
  "/404", 
  "/500", 
  "/",
  "/admin"
];

// Pages that require authentication
const protectedRoutes = ["/user", "/admin"];
const adminOnlyRoutes = ["/admin"];

export default function AppShell(props: AppshellProps) {
  const { children } = props;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
        const userData = localStorage.getItem('user');
        const parsedUser = userData ? JSON.parse(userData) : null;
        setUser(parsedUser);
        setIsLoading(false);

      // Handle route protection
        if (!parsedUser && protectedRoutes.includes(router.pathname)) {
            router.push('/auth/login');
            return;
        }

        if (parsedUser) {
            // Redirect if trying to access auth pages while logged in
            if (router.pathname.startsWith('/auth')) {
            router.push(parsedUser.role === 'admin' ? '/admin' : '/user');
            return;
            }

            // Check admin access
            if (adminOnlyRoutes.includes(router.pathname) && parsedUser.role !== 'admin') {
            router.push('/user');
            return;
            }
        }
    };

    checkAuth();

    // Clear localStorage when tab is closed
    const handleBeforeUnload = () => {
      localStorage.removeItem('user');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [router.pathname]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const showNavbar = !disableNavbar.includes(router.pathname);

  return (
    <main>
      {showNavbar && <NavbarPage user={user} />}
      {children}
    </main>
  );
}