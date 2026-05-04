import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowLeft, ArrowRight, Zap, CheckCircle2, AlertCircle, BookOpen, Target, Lightbulb, Trophy, Play, HelpCircle, ExternalLink, FileText, RefreshCw, Star, Heart, Sparkles } from 'lucide-react';
import { Lesson } from '../types';
import AISimulator from './AISimulator';

interface LessonPlayerProps {
  lesson: Lesson;
  onClose: () => void;
  onFinish: (lessonId: string, points: number) => void;
}

function Flashcards({ cards }: { cards: { front: string; back: string }[] }) {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const toggleFlip = () => {
    setFlipped(prev => ({ ...prev, [currentIndex]: !prev[currentIndex] }));
  };

  const next = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="space-y-6 pt-6 flex flex-col items-center">
       <div 
         onClick={toggleFlip}
         className="w-full max-w-sm aspect-[3/4] sm:aspect-[4/3] relative cursor-pointer perspective-1000 group"
       >
          <motion.div
            animate={{ rotateY: flipped[currentIndex] ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="w-full h-full relative preserve-3d"
          >
             {/* Front */}
             <div className="absolute inset-0 backface-hidden bg-white border-2 border-indigo-100 rounded-3xl shadow-xl p-8 flex flex-col items-center justify-center text-center">
                <div className="absolute top-4 left-4 text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest">Question</div>
                <p className="text-xl font-bold text-gray-900 leading-tight">{cards[currentIndex].front}</p>
                <div className="mt-8 flex items-center gap-2 text-indigo-500 text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                   <RefreshCw size={14} />
                   Click to flip
                </div>
             </div>
             {/* Back */}
             <div className="absolute inset-0 backface-hidden bg-indigo-600 text-white rounded-3xl shadow-xl p-8 flex flex-col items-center justify-center text-center rotate-y-180">
                <div className="absolute top-4 left-4 text-[10px] font-mono font-bold text-white/50 uppercase tracking-widest">Answer</div>
                <p className="text-xl font-medium leading-relaxed">{cards[currentIndex].back}</p>
                 <div className="mt-8 flex items-center gap-2 text-white/50 text-xs font-bold uppercase tracking-wider">
                   <RefreshCw size={14} />
                   Click to flip back
                </div>
             </div>
          </motion.div>
       </div>

       <div className="flex items-center gap-6">
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            disabled={currentIndex === 0}
            className="p-3 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">
            {currentIndex + 1} OF {cards.length}
          </div>
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); next(); }}
            disabled={currentIndex === cards.length - 1}
            className="p-3 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm"
          >
            <ArrowRight size={18} />
          </button>
       </div>
    </div>
  );
}

export default function LessonPlayer({ lesson, onClose, onFinish }: LessonPlayerProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showInCorrectEffect, setShowInCorrectEffect] = useState(false);
  const [simulatorFinished, setSimulatorFinished] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showStrategySummary, setShowStrategySummary] = useState(true);

  const currentStep = lesson.steps[currentStepIndex];
  const isLastStep = currentStepIndex === lesson.steps.length - 1;
  const progress = ((currentStepIndex + 1) / lesson.steps.length) * 100;

  const handleNext = () => {
    if (currentStep.interactiveType === 'simulator' && !simulatorFinished) {
      setShowInCorrectEffect(true);
      setTimeout(() => setShowInCorrectEffect(false), 500);
      return;
    }

    if (currentStep.interactiveType && !['none', 'simulator', 'video', 'case-study', 'guide', 'flashcard'].includes(currentStep.interactiveType)) {
      if (isCorrect === null) {
         if (currentStep.interactiveType === 'multiple-choice') {
            setShowInCorrectEffect(true);
            setTimeout(() => setShowInCorrectEffect(false), 500);
            return;
         }
      }
      if (!isCorrect) {
          setShowInCorrectEffect(true);
          setTimeout(() => setShowInCorrectEffect(false), 500);
          return;
      }
    }

    if (isLastStep) {
      setShowCelebration(true);
    } else {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      setAnswer('');
      setIsCorrect(null);
      setSimulatorFinished(false);
      setShowSolution(false);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setAnswer('');
      setIsCorrect(null);
      setShowSolution(false);
    }
  };

  const checkAnswer = (selected: string) => {
    setAnswer(selected);
    const correct = selected.toLowerCase() === (currentStep.correctAnswer || '').toLowerCase();
    setIsCorrect(correct);
    if (!correct) {
      setShowInCorrectEffect(true);
      setTimeout(() => setShowInCorrectEffect(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
          <div>
            <h2 className="text-sm font-bold text-gray-900">{lesson.title}</h2>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">STEP {currentStepIndex + 1} OF {lesson.steps.length}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 flex-1 max-w-md mx-8">
          <div className="h-1.5 bg-gray-100 flex-1 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-indigo-600"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
          <Zap size={14} className="text-indigo-600" />
          <span className="text-xs font-mono font-bold text-indigo-700">{lesson.points} PTS</span>
        </div>
      </div>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto px-6 py-12 relative">
        <AnimatePresence>
          {showStrategySummary && (
            <motion.div 
               initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
               animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
               exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
               className="absolute inset-0 z-50 bg-white/40 flex items-center justify-center p-6"
            >
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9, y: 20 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 className="max-w-md w-full bg-gray-900 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden"
               >
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white">
                        <Sparkles size={20} />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg">AI Strategy Brief</h3>
                        <p className="text-gray-400 text-[10px] font-mono uppercase tracking-widest">Architectural Context</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                       <p className="text-indigo-200 text-sm leading-relaxed font-medium">
                         Based on your target goal of <span className="text-white font-bold">{lesson.title}</span>, 
                         this module focuses on the strategic intersection of technical feasibility and product ROI.
                       </p>
                       <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                          <p className="text-xs text-gray-300 italic leading-relaxed">
                            "In this session, we'll bridge the gap between low-level technical infrastructure and high-level product strategy."
                          </p>
                       </div>
                    </div>

                    <button 
                      onClick={() => setShowStrategySummary(false)}
                      className="w-full py-4 bg-white text-gray-900 rounded-xl font-bold hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                    >
                      Enter Module
                      <ArrowRight size={18} />
                    </button>
                  </div>

                  {/* Ambient Blobs */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-600/30 rounded-full blur-2xl" />
                  <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-indigo-600/10 rounded-full blur-2xl" />
               </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ 
                opacity: 1, 
                x: 0,
                rotate: showInCorrectEffect ? [-1, 1, -1, 1, 0] : 0 
              }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-gray-900 leading-tight">
                  {currentStep.title}
                </h3>
                <div className="prose prose-indigo max-w-none text-lg text-gray-600 leading-relaxed">
                  {currentStep.content.includes('Real-World Example:') ? (
                    <div className="space-y-6">
                      <p>{currentStep.content.split('Real-World Example:')[0].trim()}</p>
                      <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-2xl">
                        <div className="flex items-center gap-2 text-amber-800 mb-2 font-bold uppercase tracking-wider text-xs">
                          <Lightbulb size={16} />
                          Real-World Example
                        </div>
                        <p className="text-amber-900 text-base italic leading-relaxed">
                          {currentStep.content.split('Real-World Example:')[1].trim()}
                        </p>
                      </div>
                    </div>
                  ) : (
                    currentStep.content
                  )}
                </div>
              </div>

              {currentStep.interactiveType === 'guide' && (
                <div className="pt-6 space-y-6">
                  {currentStep.guideUrl && (
                    <a 
                      href={currentStep.guideUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-6 bg-indigo-600 text-white rounded-2xl shadow-xl hover:bg-indigo-700 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-xl group-hover:rotate-12 transition-transform">
                          <FileText size={24} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-bold uppercase tracking-widest opacity-80">Instructional Write-up</p>
                          <h4 className="text-lg font-bold">
                            {currentStep.title.toLowerCase().includes('deep dive') 
                              ? currentStep.title 
                              : `Deep Dive: ${currentStep.title}`}
                          </h4>
                        </div>
                      </div>
                      <ExternalLink size={24} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                    </a>
                  )}

                  {currentStep.readingReferences && currentStep.readingReferences.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-gray-400">
                        <BookOpen size={16} />
                        <span className="text-xs font-bold uppercase tracking-widest">Recommended Reading</span>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {currentStep.readingReferences.map((ref, idx) => (
                          <a 
                            key={idx}
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl hover:border-indigo-200 hover:bg-white transition-all text-gray-700 group"
                          >
                            <span className="font-medium">{ref.title}</span>
                            <ExternalLink size={16} className="text-gray-300 group-hover:text-indigo-500 transition-colors" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {!currentStep.guideUrl && (!currentStep.readingReferences || currentStep.readingReferences.length === 0) && (
                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col items-center text-center space-y-3">
                      <AlertCircle size={32} className="text-gray-400" />
                      <div>
                        <h4 className="text-gray-900 font-bold">Knowledge Base Offline</h4>
                        <p className="text-sm text-gray-500">The deep dive for this specialized topic is currently being updated.</p>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-3 text-sm text-gray-500 bg-gray-50 p-4 rounded-xl">
                    <Target size={16} className="text-indigo-600" />
                    <span>This guide was curated from top industry sources for maximum hands-on utility.</span>
                  </div>
                </div>
              )}

              {currentStep.interactiveType === 'video' && currentStep.videoUrl && (
                <div className="pt-6">
                  <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl">
                    <iframe
                      src={currentStep.videoUrl}
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="mt-4 flex items-center gap-3 text-sm text-gray-500 bg-gray-50 p-4 rounded-xl">
                    <Play size={16} className="text-indigo-600" />
                    <span>Watch carefully — insights from this video apply to the next sandbox.</span>
                  </div>
                </div>
              )}

              {currentStep.interactiveType === 'case-study' && currentStep.caseStudy && (
                <div className="space-y-6 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                      <div className="flex items-center gap-2 text-blue-700 mb-2">
                        <BookOpen size={18} />
                        <span className="text-xs font-bold uppercase tracking-wider">Context</span>
                      </div>
                      <p className="text-sm text-blue-900 leading-relaxed font-medium">{currentStep.caseStudy.context}</p>
                    </div>
                    <div className="p-6 bg-red-50 rounded-2xl border border-red-100">
                      <div className="flex items-center gap-2 text-red-700 mb-2">
                        <Target size={18} />
                        <span className="text-xs font-bold uppercase tracking-wider">Challenge</span>
                      </div>
                      <p className="text-sm text-red-900 leading-relaxed font-medium">{currentStep.caseStudy.challenge}</p>
                    </div>
                    <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                      <div className="flex items-center gap-2 text-indigo-700 mb-2">
                        <Lightbulb size={18} />
                        <span className="text-xs font-bold uppercase tracking-wider">Solution</span>
                      </div>
                      <p className="text-sm text-indigo-900 leading-relaxed font-medium">{currentStep.caseStudy.solution}</p>
                    </div>
                    <div className="p-6 bg-green-50 rounded-2xl border border-green-100">
                      <div className="flex items-center gap-2 text-green-700 mb-2">
                        <Trophy size={18} />
                        <span className="text-xs font-bold uppercase tracking-wider">Results</span>
                      </div>
                      <p className="text-sm text-green-900 leading-relaxed font-medium">{currentStep.caseStudy.results}</p>
                    </div>
                  </div>
                </div>
              )}

              {currentStep.interactiveType === 'multiple-choice' && (
                <div className="space-y-3 pt-6">
                  <p className="font-medium text-gray-900 mb-4">{currentStep.question}</p>
                  {currentStep.options?.map((option) => (
                    <button
                      key={option}
                      onClick={() => !isCorrect && checkAnswer(option)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                        answer === option 
                          ? isCorrect 
                            ? 'bg-green-50 border-green-500 text-green-700' 
                            : 'bg-red-50 border-red-400 text-red-700'
                          : 'bg-white border-gray-100 hover:border-indigo-200'
                      } ${isCorrect && answer !== option ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      <span className="font-medium">{option}</span>
                      {answer === option && (
                        isCorrect ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />
                      )}
                    </button>
                  ))}
                  {isCorrect === false && (
                    <p className="text-sm text-red-600 font-medium">Not quite. Try another one!</p>
                  )}
                  {isCorrect === true && (
                    <p className="text-sm text-green-600 font-medium">Excellent work!</p>
                  )}
                </div>
              )}

              {currentStep.interactiveType === 'text-input' && (
                <div className="space-y-3 pt-6">
                  <p className="font-medium text-gray-900 mb-4">{currentStep.question}</p>
                  <div className="relative">
                    <input
                      type="text"
                      className={`w-full p-4 rounded-xl border-2 outline-none transition-all ${
                        isCorrect === true ? 'border-green-500 bg-green-50 text-green-700' : 
                        isCorrect === false ? 'border-red-400 bg-red-50 text-red-700' :
                        'border-gray-100 focus:border-indigo-600'
                      }`}
                      placeholder="Type your answer..."
                      value={answer}
                      onChange={(e) => {
                        setAnswer(e.target.value);
                        setIsCorrect(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') checkAnswer(answer);
                      }}
                    />
                    <button
                      onClick={() => checkAnswer(answer)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700"
                    >
                      Check
                    </button>
                  </div>
                  {isCorrect === true && (
                    <p className="text-sm text-green-600 font-medium">Correct!</p>
                  )}
                </div>
              )}

              {currentStep.interactiveType === 'flashcard' && currentStep.flashcards && (
                <Flashcards cards={currentStep.flashcards} />
              )}

             {currentStep.interactiveType === 'simulator' && (
                <div className="pt-6">
                   <AISimulator 
                      type={currentStep.simulatorConfig?.type || 'rag-conflict'}
                      onComplete={() => {
                        setSimulatorFinished(true);
                        setTimeout(handleNext, 1000);
                      }}
                   />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer Controls */}
      <div className="px-6 py-6 border-t border-gray-100">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-all font-medium"
          >
            <ArrowLeft size={20} />
            Back
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all font-bold shadow-lg shadow-indigo-200"
          >
            {isLastStep ? 'Complete Lesson' : 'Next Step'}
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
      {/* Celebration Overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-indigo-600/95 flex flex-col items-center justify-center p-6 text-white text-center"
          >
             <motion.div
               initial={{ scale: 0.5, y: 20 }}
               animate={{ scale: 1, y: 0 }}
               className="space-y-8"
             >
                <div className="relative inline-block">
                   <motion.div 
                     animate={{ rotate: 360 }}
                     transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                     className="absolute -inset-4 border-4 border-dashed border-indigo-200/30 rounded-full" 
                   />
                   <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-indigo-600 shadow-2xl relative">
                     <Trophy size={48} />
                   </div>
                </div>

                <div className="space-y-2">
                   <h2 className="text-4xl font-bold">Lesson Mastered!</h2>
                   <p className="text-indigo-100 text-lg">You've unlocked the critical concepts for {lesson.title}.</p>
                </div>

                <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-sm border border-white/20 inline-block">
                   <div className="flex items-center gap-4">
                      <div className="text-left">
                         <p className="text-xs font-mono font-bold text-indigo-200 uppercase tracking-widest">Reward Unlocked</p>
                         <p className="text-2xl font-bold">+{lesson.points} Strategy Points</p>
                      </div>
                      <div className="w-12 h-12 bg-indigo-500/50 rounded-2xl flex items-center justify-center">
                         <Star className="text-yellow-300" />
                      </div>
                   </div>
                </div>

                <div className="pt-8">
                   <button 
                     onClick={() => onFinish(lesson.id, lesson.points)}
                     className="px-12 py-4 bg-white text-indigo-600 rounded-2xl font-bold text-xl hover:scale-105 active:scale-95 transition-all shadow-xl"
                   >
                     Claim Reward
                   </button>
                </div>
             </motion.div>

             {/* Background particles simulated with motion */}
             {[...Array(12)].map((_, i) => (
               <motion.div
                 key={i}
                 initial={{ opacity: 0, x: 0, y: 0 }}
                 animate={{ 
                   opacity: [0, 1, 0],
                   x: (Math.random() - 0.5) * 600,
                   y: (Math.random() - 0.5) * 600,
                   scale: [0.5, 1.5, 0.5]
                 }}
                 transition={{ 
                   duration: 3, 
                   repeat: Infinity, 
                   delay: i * 0.2,
                   ease: "easeOut" 
                 }}
                 className="absolute pointer-events-none"
               >
                 <Zap className="text-yellow-400/30" />
               </motion.div>
             ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
