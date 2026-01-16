import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const router = useRouter();
  const { login, registerUser, user, hasRole } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    setMounted(true);
  }, []);

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError('');

    try {
      if (isRegister) {
        await registerUser(data);
        alert("Đăng ký thành công! Hãy đăng nhập.");
        setIsRegister(false);
      } else {
        await login(data.username, data.password);
        router.push('/admin/users');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Thao tác thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating bubbles */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-rose-200 rounded-full animate-bounce opacity-60"></div>
        <div className="absolute top-40 right-32 w-6 h-6 bg-pink-200 rounded-full animate-ping opacity-50"></div>
        <div className="absolute bottom-32 left-40 w-3 h-3 bg-purple-200 rounded-full animate-pulse opacity-70"></div>
        <div className="absolute top-60 right-20 w-5 h-5 bg-rose-300 rounded-full animate-bounce opacity-40"></div>
        <div className="absolute bottom-20 right-40 w-4 h-4 bg-pink-300 rounded-full animate-ping opacity-60"></div>

        {/* Decorative circles */}
        <div className="absolute top-10 right-10 w-32 h-32 border-2 border-rose-100 rounded-full animate-spin-slow opacity-30"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 border-2 border-pink-100 rounded-full animate-spin-reverse opacity-20"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border-2 border-purple-100 rounded-full animate-pulse opacity-25"></div>
      </div>

      {/* Main card */}
      <div className={`w-full max-w-md bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-rose-100/50 border border-white/50 p-8 relative z-10 transition-all duration-1000 ${mounted ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8'}`}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl shadow-rose-200/50 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-bounce"></div>
          </div>

          <h2 className="text-4xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-slate-600 font-medium text-sm uppercase tracking-widest">
            Syllabus Management System
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5">
            {/* Username */}
            <div className="relative group">
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2 tracking-wider">
                Username
              </label>
              <div className="relative">
                <input
                  {...register('username', { required: 'Username is required' })}
                  className="w-full bg-slate-50/80 border-2 border-slate-200 rounded-2xl px-6 py-4 text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all duration-300 outline-none hover:bg-white/90"
                  placeholder="Enter your username"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              {errors.username && <p className="text-rose-500 text-xs mt-2 animate-shake">{(errors.username as any).message}</p>}
            </div>

            {/* Full Name (register only) */}
            {isRegister && (
              <div className="relative group animate-slide-down">
                <label className="block text-xs font-bold uppercase text-slate-500 mb-2 tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    {...register('fullName', { required: 'Full name is required' })}
                    className="w-full bg-slate-50/80 border-2 border-slate-200 rounded-2xl px-6 py-4 text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all duration-300 outline-none hover:bg-white/90"
                    placeholder="Your full name"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors duration-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Password */}
            <div className="relative group">
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2 tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password', { required: 'Password is required' })}
                  type="password"
                  className="w-full bg-slate-50/80 border-2 border-slate-200 rounded-2xl px-6 py-4 text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all duration-300 outline-none hover:bg-white/90"
                  placeholder="••••••••"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              {errors.password && <p className="text-rose-500 text-xs mt-2 animate-shake">{(errors.password as any).message}</p>}
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-gradient-to-r from-rose-50 to-pink-50 text-rose-600 text-sm p-4 rounded-2xl border-2 border-rose-200 font-semibold text-center animate-slide-down">
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-rose-200/50 hover:shadow-rose-300/50 hover:from-rose-600 hover:via-pink-600 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
          >
            <div className="flex items-center justify-center space-x-2">
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </div>
          </button>
        </form>

        {/* Toggle link */}
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            className="text-slate-600 font-semibold text-sm hover:text-rose-600 transition-all duration-300 relative group"
          >
            <span className="relative z-10">
              {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Join us"}
            </span>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-rose-500 to-purple-500 group-hover:w-full transition-all duration-300"></div>
          </button>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-3 -right-3 w-6 h-6 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute -bottom-3 -left-3 w-5 h-5 bg-gradient-to-br from-purple-400 to-rose-500 rounded-full opacity-60 animate-ping"></div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 10s linear infinite;
        }
        .animate-slide-down {
          animation: slide-down 0.5s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
