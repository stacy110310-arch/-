import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  updateProfile 
} from '../lib/firebase';
import { Lock, Mail, User, Sparkles, AlertCircle, LogIn, UserPlus } from 'lucide-react';

interface AuthScreenProps {
  onAuthSuccess: () => void;
}

export function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getFriendlyErrorMessage = (errCode: string): string => {
    switch (errCode) {
      case 'auth/invalid-email':
        return '無效的電子郵件格式。';
      case 'auth/user-disabled':
        return '此使用者帳號已被停用。';
      case 'auth/user-not-found':
        return '找不到此使用者。請先註冊帳號！';
      case 'auth/wrong-password':
        return '密碼錯誤，請再試一次。';
      case 'auth/email-already-in-use':
        return '此電子郵件已被註冊，請直接登入！';
      case 'auth/weak-password':
        return '密碼強度不足，請輸入至少 6 位字元。';
      case 'auth/popup-closed-by-user':
        return 'Google 登入視窗已被關閉。';
      case 'auth/invalid-credential':
        return '電子郵件或密碼不正確，請重新檢查。';
      default:
        return '發生錯誤，請稍後再試。';
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        // Log In
        await signInWithEmailAndPassword(auth, email.trim(), password);
      } else {
        // Register
        if (!displayName.trim()) {
          throw new Error('請輸入暱稱！');
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        // Set display name
        if (userCredential.user) {
          await updateProfile(userCredential.user, {
            displayName: displayName.trim(),
          });
        }
      }
      onAuthSuccess();
    } catch (err: any) {
      console.error(err);
      const isCustomNicknameError = err instanceof Error && err.message === '請輸入暱稱！';
      if (isCustomNicknameError) {
        setError(err.message);
      } else {
        setError(getFriendlyErrorMessage(err?.code || ''));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      onAuthSuccess();
    } catch (err: any) {
      console.error(err);
      setError(getFriendlyErrorMessage(err.code || ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] text-slate-800 font-sans selection:bg-amber-200 p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#FFFDFB] rounded-[2.5rem] p-6 sm:p-8 md:p-10 border-4 border-slate-900 shadow-[10px_10px_0px_0px_rgba(15,23,42,1)]"
      >
        {/* Banner Logo */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="p-4 bg-yellow-300 text-slate-900 rounded-3xl border-3 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] select-none text-4xl mb-4 transform -rotate-3 hover:rotate-3 transition-transform duration-200">
            🐣
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-none font-display">
            寵物心情養成花園
          </h2>
          <p className="text-xs font-bold text-slate-400 mt-2.5">
            開始你的情緒陪伴之旅，一起孵化屬於你的心靈夥伴
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#FAF8F5] border-2 border-slate-900 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setError(null);
            }}
            className={`py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 ${
              isLogin 
                ? 'bg-amber-300 border-2 border-slate-900 text-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>帳號登入</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setError(null);
            }}
            className={`py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 ${
              !isLogin 
                ? 'bg-amber-300 border-2 border-slate-900 text-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>註冊新帳號</span>
          </button>
        </div>

        {/* Error Messaging */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-5 p-3.5 bg-rose-50 border-2 border-rose-300 text-rose-700 rounded-xl text-xs font-bold flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-rose-500" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Main form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                可愛暱稱 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="例如：抹茶果凍"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                disabled={loading}
                className="w-full px-3.5 py-2.5 bg-white border-2 border-slate-900 rounded-xl text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-yellow-300 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              電子郵件 <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full px-3.5 py-2.5 bg-white border-2 border-slate-900 rounded-xl text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-yellow-300 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              設定密碼 (最少 6 位) <span className="text-rose-500">*</span>
            </label>
            <input
              type="password"
              placeholder="請輸入安全密碼"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full px-3.5 py-2.5 bg-white border-2 border-slate-900 rounded-xl text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-yellow-300 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-2 py-3 bg-[#FFFDFB] border-3 border-slate-900 text-slate-900 rounded-2xl text-xs sm:text-sm font-black shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[2px] hover:translate-y-[2px] cursor-pointer transition-all active:scale-98 flex items-center justify-center gap-2 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Sparkles className="w-4 h-4 text-yellow-500 fill-yellow-300" />
            <span>{loading ? '驗證與載入中...' : isLogin ? '登入儀表板' : '完成註冊並孵化'}</span>
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-7">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dashed border-slate-300" />
          </div>
          <div className="relative flex justify-center text-xs font-bold">
            <span className="px-3 bg-[#FFFDFB] text-slate-400">或使用快速連結</span>
          </div>
        </div>

        {/* Google sign-in */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full py-2.5 bg-white border-2 border-slate-900 rounded-xl text-xs sm:text-sm font-black shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] cursor-pointer hover:bg-slate-50 transition-all flex items-center justify-center gap-2.5"
        >
          <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.54 14.98 1 12 1 7.35 1 3.42 3.65 1.54 7.54l3.86 3C6.35 7.56 8.96 5.04 12 5.04z"
            />
            <path
              fill="#4285F4"
              d="M23.49 12.27c0-.81-.07-1.59-.2-2.27H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.73 2.89c2.18-2.01 3.7-4.99 3.7-8.71z"
            />
            <path
              fill="#FBBC05"
              d="M5.4 14.46c-.25-.73-.39-1.51-.39-2.31s.14-1.58.39-2.31l-3.86-3C.68 8.44 0 10.15 0 12s.68 3.56 1.54 5.16l3.86-3z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.24 0 5.97-1.08 7.96-2.91l-3.73-2.89c-1.1.74-2.52 1.18-4.23 1.18-3.04 0-5.65-2.52-6.57-5.5l-3.86 3C3.42 20.35 7.35 23 12 23z"
            />
          </svg>
          <span>使用 Google 帳號登入</span>
        </button>

        <p className="text-center text-[10px] font-bold text-slate-400 mt-6 leading-relaxed">
          安心保障：本養成系統採用 Firebase Cloud Auth
          安全加密認證技術，保護您的情緒記錄與夥伴隱私安全。
        </p>
      </motion.div>
    </div>
  );
}
