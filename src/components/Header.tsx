import { Trophy, User as UserIcon, BookOpen, LogOut, LogIn, Cloud, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';
import { User } from 'firebase/auth';
import { signInWithGoogle, auth } from '../lib/firebase';

interface HeaderProps {
  points: number;
  profile?: UserProfile;
  user: User | null;
}

export default function Header({ points, profile, user }: HeaderProps) {
  const handleLogout = () => auth.signOut();
  const handleLogin = () => signInWithGoogle();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="bg-gray-900 p-2.5 rounded-xl text-white shadow-lg shadow-gray-200">
              <BookOpen size={24} />
            </div>
            <div>
              <h1 className="font-sans font-bold text-xl tracking-tighter text-gray-900 leading-none">Nexus<span className="text-indigo-600">.ai</span></h1>
              <p className="text-[10px] text-gray-400 font-mono uppercase tracking-[0.2em] mt-1 hidden sm:block">Curriculum Architect</p>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-1 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            <Sparkles size={12} className="text-indigo-600" />
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest tracking-[0.1em]">Enterprise Mode</span>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-indigo-100"
          >
            <Trophy size={16} className="text-indigo-600" />
            <span className="font-mono font-bold text-indigo-700 text-sm sm:text-base">{points} pts</span>
          </motion.div>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ''} className="w-8 h-8 rounded-full border border-gray-200" />
                ) : (
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                    <UserIcon size={18} />
                  </div>
                )}
                <div className="hidden md:block text-right">
                  <p className="text-xs font-bold text-gray-900 leading-none">{user.displayName}</p>
                  <p className="text-[10px] text-indigo-600 mt-0.5 font-bold flex items-center justify-end gap-1">
                    <Cloud size={10} />
                    Cloud Sync
                  </p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="hidden lg:block text-right mr-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Guest Mode</p>
                <p className="text-[10px] text-gray-300 mt-0.5 italic">Local Save Only</p>
              </div>
              <button 
                onClick={handleLogin}
                className="group relative flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100"
              >
                <LogIn size={16} />
                <span>Save Progress</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
