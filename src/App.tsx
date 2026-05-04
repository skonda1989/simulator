import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import LessonPlayer from './components/LessonPlayer';
import Onboarding from './components/Onboarding';
import CourseGenerator from './components/CourseGenerator';
import { useProgress } from './useProgress';
import { Lesson, UserProfile, Course } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from './hooks/useAuth';
import { getCourseById } from './services/courseService';

export default function App() {
  const { user, loading: authLoading } = useAuth();
  const { progress, completeLesson, setProfile, addCustomCourse, addPendingTask, removePendingTask } = useProgress(user?.uid);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [isCheckingSharedLink, setIsCheckingSharedLink] = useState(false);

  // Handle shared course links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedCourseId = params.get('courseId');
    const sharedLessonId = params.get('lessonId');
    
    if (sharedCourseId) {
      const loadSharedCourse = async () => {
        setIsCheckingSharedLink(true);
        setNotification('Fetching shared curriculum...');
        const course = await getCourseById(sharedCourseId);
        if (course) {
          addCustomCourse(course);
          
          if (sharedLessonId) {
            const lesson = course.lessons.find(l => l.id === sharedLessonId);
            if (lesson) {
              setSelectedLesson(lesson);
              setNotification(`Module Loaded: ${lesson.title}`);
            } else {
              setNotification(`Curriculum Loaded: ${course.title}`);
            }
          } else {
            setNotification(`Curriculum Loaded: ${course.title}`);
          }
          
          // Auto-onboard as Guest if no profile
          if (!progress.profile) {
             setProfile({ name: 'Guest Learner', role: 'Anonymous User' });
          }
        } else {
          setNotification('Curriculum link is invalid or expired.');
        }
        // Clear param without reload
        window.history.replaceState({}, '', window.location.pathname);
        setTimeout(() => setNotification(null), 5000);
        setIsCheckingSharedLink(false);
      };
      loadSharedCourse();
    }
  }, []);

  const handleFinishLesson = (lessonId: string, points: number) => {
    completeLesson(lessonId, points);
    setSelectedLesson(null);
  };

  const handleOnboardingComplete = (profile: UserProfile) => {
    setProfile(profile);
  };

  const handleCourseGenerated = (course: Course) => {
    addCustomCourse(course);
    setNotification(`${course.title} is now ready in your dashboard!`);
    setTimeout(() => setNotification(null), 5000);
  };

  if (!progress || authLoading || isCheckingSharedLink) return null;

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      <AnimatePresence>
        {!progress.profile && (
          <Onboarding onComplete={handleOnboardingComplete} />
        )}
      </AnimatePresence>

      <Header points={progress.points} profile={progress.profile} user={user} />

      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[300] bg-indigo-600 text-white px-6 py-3 rounded-full shadow-2xl font-bold flex items-center gap-3"
          >
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            {notification}
          </motion.div>
        )}
      </AnimatePresence>
      
      <main>
        <Dashboard 
          progress={progress} 
          onSelectLesson={(lesson) => setSelectedLesson(lesson)} 
          onOpenGenerator={() => setIsGeneratorOpen(true)}
        />
      </main>

      <AnimatePresence>
        {isGeneratorOpen && (
          <CourseGenerator 
            onBack={() => setIsGeneratorOpen(false)}
            onCourseGenerated={handleCourseGenerated}
            addPendingTask={addPendingTask}
            removePendingTask={removePendingTask}
            onNotification={setNotification}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedLesson && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LessonPlayer 
              lesson={selectedLesson} 
              onClose={() => setSelectedLesson(null)}
              onFinish={handleFinishLesson}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="mt-24 border-t border-gray-100 py-12 px-6 bg-gray-50/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white">
               <BookOpen size={16} />
            </div>
            <span className="font-bold text-gray-900">Nexus<span className="text-indigo-600">.ai</span></span>
          </div>
          <div className="flex gap-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <a href="#" className="hover:text-indigo-600 transition-colors">Neural Assets</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Architecture API</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Nexus Labs</a>
          </div>
          <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">© 2026 Nexus Learning Systems.</p>
        </div>
      </footer>
    </div>
  );
}
