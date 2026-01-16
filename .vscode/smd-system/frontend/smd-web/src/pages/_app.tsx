import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import Layout from '../components/Layout';
import { AuthProvider, useAuth } from '../context/AuthContext';
import '../styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Thành phần bảo vệ quyền truy cập
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Nếu đã tải xong dữ liệu, không có user và không phải đang ở trang login
    // thì lập tức đẩy người dùng về trang đăng nhập
    if (!loading && !user && router.pathname !== '/login') {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Hiển thị màn hình chờ khi đang kiểm tra Token từ Cookie
  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mb-4"></div>
        <p className="text-slate-500 font-bold animate-pulse text-sm uppercase tracking-widest">SMD System Loading...</p>
      </div>
    );
  }

  // Nếu chưa đăng nhập và đang ở trang login, cho phép hiển thị trang login mà không có Layout
  if (!user && router.pathname === '/login') {
    return <>{children}</>;
  }

  // Nếu đã đăng nhập, hiển thị nội dung bên trong Layout hệ thống
  return <Layout>{children}</Layout>;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthGuard>
          <Component {...pageProps} />
        </AuthGuard>
      </AuthProvider>
    </QueryClientProvider>
  );
}