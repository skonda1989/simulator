import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle2, Wand2, Filter, Share2, Cloud, Copy, Check, Award, BookOpen, HelpCircle, RefreshCw, Sparkles } from 'lucide-react';
import { COURSES } from '../constants';
import { Lesson, UserProgress, Course } from '../types';
import { getUserCourses } from '../services/courseService';
import { generateCertificate } from '../services/certificateService';
import { auth } from '../lib/firebase';

import AIInsights from './AIInsights';

interface DashboardProps {
  progress: UserProgress;
  onSelectLesson: (lesson: Lesson) => void;
  onOpenGenerator: () => void;
}

type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'All';

const DIFFICULTY_DESCRIPTIONS: Record<Difficulty, string> = {
  All: 'View the complete curriculum across all skill levels.',
  Beginner: 'Foundational concepts, perfect for getting started.',
  Intermediate: 'Applied knowledge and common PM workflows.',
  Advanced: 'Complex architectural decisions and strategy.',
};

export default function Dashboard({ progress, onSelectLesson, onOpenGenerator }: DashboardProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('All');
  const [hoveredDifficulty, setHoveredDifficulty] = useState<Difficulty | null>(null);
  const [cloudCourses, setCloudCourses] = useState<Course[]>([]);
  const [sharingCourseId, setSharingCourseId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const goalProgress = ((progress?.points || 0) / (progress?.currentGoal || 500)) * 100;
  const profile = progress?.profile;
  
  // Merge static, local custom, and cloud courses
  const allCourses = [...COURSES, ...(progress?.customCourses || [])];
  
  // Dedup logic: preferred cloud versions if they exist
  const uniqueCourseIds = new Set(allCourses.map(c => c.id));
  cloudCourses.forEach(c => {
    if (!uniqueCourseIds.has(c.id)) {
      allCourses.push(c);
      uniqueCourseIds.add(c.id);
    }
  });

  const pendingTasks = progress?.pendingTasks || [];
  const difficulties: Difficulty[] = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const contentTypes = [
    { id: 'all', label: 'All Content', icon: Filter },
    { id: 'guide', label: 'Theory', icon: BookOpen },
    { id: 'quiz', label: 'Quizzes', icon: HelpCircle },
    { id: 'flashcard', label: 'Flashcards', icon: RefreshCw }
  ];
  const [activeContentType, setActiveContentType] = useState('all');

  useEffect(() => {
    if (auth.currentUser) {
      getUserCourses(auth.currentUser.uid).then(setCloudCourses);
    }
  }, [auth.currentUser]);

  const handleShare = (courseId: string) => {
    if (!auth.currentUser) {
      alert("Please sign in to share a curriculum link. Courses created as a guest are saved only to your local browser storage.");
      return;
    }
    const url = `${window.location.origin}?courseId=${courseId}`;
    navigator.clipboard.writeText(url);
    setSharingCourseId(courseId);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setSharingCourseId(null);
    }, 3000);
  };

  const isCourseComplete = (course: Course) => {
    return course.lessons.every(lesson => progress.completedLessons.includes(lesson.id));
  };

  const handleDownloadCertificate = async (course: Course) => {
    await generateCertificate(course, profile || null, auth.currentUser?.displayName);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Progress Section */}
      <section className="mb-12">
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-950 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-mono border border-white/10 mb-6 uppercase tracking-[0.2em] backdrop-blur-md">
                <Sparkles size={12} className="text-indigo-400" />
                Nexus Curriculum Engine
              </div>
              <h2 className="text-4xl font-bold mb-3 tracking-tight">Nexus Analytics</h2>
              <p className="text-indigo-200/80 mb-8 max-w-sm text-base leading-relaxed">
                Strategic path developed for <span className="text-white font-bold">{profile?.careerGoal || 'AI Product Leadership'}</span>.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-xs font-mono tracking-widest text-indigo-300">
                  <span>MASTERY QUOTA</span>
                  <span>{progress.points} / {progress.currentGoal} PTS</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(goalProgress, 100)}%` }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-300 shadow-[0_0_15px_rgba(129,140,248,0.5)]"
                  />
                </div>
              </div>

              <div className="flex gap-6">
                <div className="bg-white/5 px-5 py-3 rounded-2xl border border-white/5 backdrop-blur-sm group hover:bg-white/10 transition-colors">
                  <p className="text-[10px] text-indigo-400 uppercase tracking-widest font-mono mb-1">Knowledge Units</p>
                  <p className="text-2xl font-bold font-mono tracking-tighter">{progress.completedLessons.length}</p>
                </div>
                <div className="bg-white/5 px-5 py-3 rounded-2xl border border-white/5 backdrop-blur-sm group hover:bg-white/10 transition-colors">
                  <p className="text-[10px] text-indigo-400 uppercase tracking-widest font-mono mb-1">Active Streak</p>
                  <p className="text-2xl font-bold font-mono tracking-tighter">5.0d</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center md:justify-end">
              <button 
                onClick={onOpenGenerator}
                className="group relative bg-indigo-600 hover:bg-indigo-500 text-white p-8 rounded-[2rem] border border-indigo-400/30 transition-all font-bold text-center space-y-4 w-full md:w-auto shadow-xl shadow-indigo-950/40 active:scale-95"
              >
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto transition-transform group-hover:rotate-12">
                  <Wand2 size={32} />
                </div>
                <div>
                  <p className="text-lg">Architect New Path</p>
                  <p className="text-[10px] opacity-70 font-normal uppercase tracking-widest">Custom Generator</p>
                </div>
              </button>
            </div>
          </div>
          
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        </div>
      </section>

      {/* AI Insights Section */}
      <AIInsights progress={progress} />

      {/* Courses List */}
      <section>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">Available Lessons</h3>
            {pendingTasks.length > 0 && (
              <div className="flex items-center gap-2 text-indigo-600 animate-pulse mb-1">
                <Wand2 size={14} />
                <span className="text-xs font-bold uppercase tracking-wider font-mono">
                  AI Architecting: {pendingTasks.join(', ')}...
                </span>
              </div>
            )}
            <p className="text-gray-500">Pick a module and start learning in 5 minutes.</p>
          </div>
          <button 
            onClick={onOpenGenerator}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-colors"
          >
            <Wand2 size={16} />
            Generate New Path
          </button>
        </div>

        <div className="flex flex-col gap-4 mb-12 p-5 bg-gray-50/50 rounded-2xl border border-gray-100">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 mr-2 px-1 text-gray-400 text-[10px] font-bold uppercase tracking-widest font-mono">
              <Filter size={12} />
              <span>Skill Level</span>
            </div>
            {difficulties.map((diff) => (
              <div key={diff} className="relative">
                <button
                  onMouseEnter={() => setHoveredDifficulty(diff)}
                  onMouseLeave={() => setHoveredDifficulty(null)}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedDifficulty === diff 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
                  }`}
                >
                  {diff}
                </button>
                <AnimatePresence>
                  {hoveredDifficulty === diff && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.95 }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 p-3 bg-gray-900 text-white text-[10px] rounded-xl shadow-xl z-50 pointer-events-none"
                    >
                      <p className="leading-relaxed">{DIFFICULTY_DESCRIPTIONS[diff]}</p>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="h-px bg-gray-100 w-full" />

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 mr-2 px-1 text-gray-400 text-[10px] font-bold uppercase tracking-widest font-mono">
              <BookOpen size={12} />
              <span>Format</span>
            </div>
            {contentTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveContentType(type.id)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeContentType === type.id 
                    ? 'bg-indigo-100 text-indigo-700 shadow-sm' 
                    : 'bg-white text-gray-400 hover:text-gray-600 border border-gray-100'
                }`}
              >
                <type.icon size={13} />
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-12">
          {allCourses.map((course) => {
            const filteredLessons = course.lessons.filter(lesson => {
              const matchesDifficulty = selectedDifficulty === 'All' || lesson.difficulty === selectedDifficulty;
              
              let matchesType = true;
              if (activeContentType === 'guide') {
                matchesType = lesson.steps.some(s => s.interactiveType === 'guide' || s.interactiveType === 'none' || s.interactiveType === 'case-study');
              } else if (activeContentType === 'quiz') {
                matchesType = lesson.steps.some(s => s.interactiveType === 'multiple-choice');
              } else if (activeContentType === 'flashcard') {
                matchesType = lesson.steps.some(s => s.interactiveType === 'flashcard');
              }
              
              return matchesDifficulty && matchesType;
            });

            if (filteredLessons.length === 0) return null;

            return (
              <div key={course.id}>
                <div className="flex items-center justify-between mb-4 border-l-4 border-indigo-600 pl-4">
                  <h4 className="flex items-center gap-3 text-sm font-mono text-gray-400 uppercase tracking-wider">
                    {course.title}
                    {progress?.customCourses?.find(c => c.id === course.id) && (
                      <span className="bg-gray-100 text-gray-400 px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-widest border border-gray-200/50">local_buffer</span>
                    )}
                    {cloudCourses.find(c => c.id === course.id) && (
                      <span className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-widest flex items-center gap-1 border border-indigo-500/20 shadow-[0_0_10px_rgba(129,140,248,0.1)]">
                        <Cloud size={10} />
                        neural_sync
                      </span>
                    )}
                  </h4>
                  
                  {/* Share & Certificate Controls */}
                  <div className="flex items-center gap-2">
                    {isCourseComplete(course) && (
                      <button 
                        onClick={() => handleDownloadCertificate(course)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg text-xs font-bold hover:bg-yellow-100 shadow-sm transition-all"
                      >
                        <Award size={14} />
                        Claim Certificate
                      </button>
                    )}
                    
                    {!COURSES.find(c => c.id === course.id) && (
                      <button 
                        onClick={() => handleShare(course.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          sharingCourseId === course.id 
                            ? 'bg-green-600 text-white' 
                            : 'bg-white border border-gray-200 text-gray-500 hover:border-indigo-600 hover:text-indigo-600 shadow-sm'
                        }`}
                        title="Share full curriculum"
                      >
                        {sharingCourseId === course.id ? (
                          <>
                            <Check size={14} />
                            Link Copied
                          </>
                        ) : (
                          <>
                            <Share2 size={14} />
                            Share Curriculum
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  
                  <span className="text-[10px] font-mono text-gray-300 ml-4">
                    {filteredLessons.length} lessons
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredLessons.map((lesson, index) => {
                    const isCompleted = progress.completedLessons.includes(lesson.id);
                    return (
                      <motion.div
                        key={lesson.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -4 }}
                        onClick={() => onSelectLesson(lesson)}
                        className="group bg-white rounded-2xl border border-gray-100 p-6 cursor-pointer shadow-sm hover:shadow-md transition-all relative overflow-hidden"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <span className={`text-[10px] uppercase font-mono font-bold tracking-widest px-2 py-1 rounded ${
                            lesson.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                            lesson.difficulty === 'Intermediate' ? 'bg-orange-100 text-orange-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {lesson.difficulty}
                          </span>
                          <div className="flex items-center gap-2">
                             <button
                               onClick={(e) => {
                                 e.stopPropagation();
                                 const url = `${window.location.origin}?courseId=${course.id}&lessonId=${lesson.id}`;
                                 navigator.clipboard.writeText(url);
                                 setSharingCourseId(`lesson-${lesson.id}`);
                                 setTimeout(() => setSharingCourseId(null), 2000);
                               }}
                               className={`p-1.5 rounded-lg transition-all ${
                                 sharingCourseId === `lesson-${lesson.id}`
                                   ? 'bg-green-500 text-white'
                                   : 'text-gray-400 hover:bg-indigo-50 hover:text-indigo-600'
                               }`}
                               title="Share this specific module link"
                             >
                               {sharingCourseId === `lesson-${lesson.id}` ? <Check size={14} /> : <Share2 size={14} />}
                             </button>
                             {isCompleted && (
                               <div className="bg-green-500 text-white p-1 rounded-full">
                                 <CheckCircle2 size={14} />
                               </div>
                             )}
                          </div>
                   
                          <span className="text-xs font-mono text-gray-400">{lesson.points} PTS</span>
                        </div>
                        
                        <h5 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                          {lesson.title}
                        </h5>
                        <p className="text-sm text-gray-500 mb-6 line-clamp-2">
                          {lesson.description}
                        </p>

                        <div className="flex items-center justify-between text-indigo-600 font-medium text-sm">
                          <span>{isCompleted ? 'Review Lesson' : 'Start Lesson'}</span>
                          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </div>

                        {/* Decor layer */}
                        <div className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/2 w-24 h-24 bg-gray-50 rounded-full group-hover:bg-indigo-50 transition-colors" />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

