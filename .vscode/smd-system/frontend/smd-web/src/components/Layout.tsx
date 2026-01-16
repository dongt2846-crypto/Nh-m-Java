import { ReactNode, useState } from 'react';
import { useRouter } from 'next/router';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading } = useAuth();

  // Derive primary role from the user object (first role) or blank
  const userRole = user?.roles?.[0] || '';

  if (loading) {
    // Optionally show a loading state until user is known
    return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  }

  // Don't show layout for login page
  if (router.pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        open={sidebarOpen} 
        setOpen={setSidebarOpen}
        userRole={userRole}
      />
      
      <div className={`${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} transition-all duration-300`}>
        <Header 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          userRole={userRole}
        />
        
        <main className="py-6">
          {children}
        </main>
      </div>
    </div>
  );
}