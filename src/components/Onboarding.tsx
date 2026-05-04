import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';
import { Sparkles, ArrowRight, Briefcase, GraduationCap, Target, ArrowLeft, Loader2, BookOpen } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    role: 'Product Manager',
    careerGoal: ''
  });

  const handleFinish = () => {
    if (!profile.name || !profile.role || !profile.careerGoal) return;
    setIsGenerating(true);
    // Simulate "generating" a curriculum for better UX
    setTimeout(() => {
      onComplete(profile);
    }, 2000);
  };

  if (isGenerating) {
    return (
      <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="relative">
            <Loader2 size={64} className="text-indigo-600 animate-spin mx-auto" />
            <Sparkles className="absolute -top-2 -right-2 text-indigo-400 animate-pulse" size={24} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Setting Up Your Workspace</h2>
            <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">Tailoring lessons for {profile.role}s...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-6 py-12 flex items-center justify-center">
        <div className="max-w-xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="space-y-6 text-center">
              <div className="w-20 h-20 bg-gray-900 rounded-3xl flex items-center justify-center mx-auto text-white mb-6 shadow-xl shadow-gray-200">
                <BookOpen size={40} />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Nexus Learning.</h2>
              <p className="text-gray-500 text-lg">Define your career mission to architect your path.</p>
              
              <div className="text-left space-y-6 pt-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2 font-bold">What's your name?</label>
                  <input 
                    type="text" 
                    placeholder="Alex Chen"
                    autoFocus
                    className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-indigo-600 outline-none transition-all text-xl font-medium"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2 font-bold">What's your career objective?</label>
                  <input 
                    type="text" 
                    placeholder="Transition to AI PM at OpenAI"
                    className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-indigo-600 outline-none transition-all text-xl font-medium"
                    value={profile.careerGoal}
                    onChange={(e) => setProfile({ ...profile, careerGoal: e.target.value })}
                  />
                </div>
              </div>

              <button
                onClick={handleFinish}
                disabled={!profile.name || !profile.role || !profile.careerGoal}
                className="w-full py-5 mt-8 rounded-2xl bg-indigo-600 text-white font-bold text-xl flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-xl shadow-indigo-200"
              >
                Get Started
                <ArrowRight size={24} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

