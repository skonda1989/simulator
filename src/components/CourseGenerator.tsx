import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Loader2, X, Plus, Minus, Wand2, Upload, FileText, Image as ImageIcon, FileCheck, Lightbulb, RefreshCw, ChevronRight, LogIn } from 'lucide-react';
import { generateCourse, generateCourseFromMaterial, getTopicSuggestions, refinePrompt, CourseOptions } from '../services/geminiService';
import { saveCourse } from '../services/courseService';
import { sendCourseCreationEmail } from '../services/emailService';
import { auth } from '../lib/firebase';
import { Course } from '../types';

interface CourseGeneratorProps {
  onBack: () => void;
  onCourseGenerated: (course: Course) => void;
  addPendingTask: (title: string) => void;
  removePendingTask: (title: string) => void;
  onNotification: (msg: string) => void;
}

type GeneratorMode = 'topic' | 'material';

export default function CourseGenerator({ onBack, onCourseGenerated, addPendingTask, removePendingTask, onNotification }: CourseGeneratorProps) {
  const [mode, setMode] = useState<GeneratorMode>('topic');
  const [topic, setTopic] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isRefining, setIsRefining] = useState(false);
  const [numLessons, setNumLessons] = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);
  const [difficulties, setDifficulties] = useState<string[]>(['Beginner', 'Intermediate', 'Advanced']);
  
  const [options, setOptions] = useState<CourseOptions>({
    includeLessons: true,
    includeQuizzes: true,
    includeFlashcards: true,
  });
  
  // Debounce logic for suggestions
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (topic.length >= 3 && mode === 'topic') {
        const result = await getTopicSuggestions(topic);
        setSuggestions(result);
      } else {
        setSuggestions([]);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [topic, mode]);

  const handleRefine = async () => {
    if (!topic) return;
    setIsRefining(true);
    try {
      const refined = await refinePrompt(topic);
      setTopic(refined);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefining(false);
    }
  };

  const [uploadedFile, setUploadedFile] = useState<{ name: string; type: 'text' | 'image' | 'pdf'; content: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      let type: 'text' | 'image' | 'pdf' = 'text';
      
      if (file.type.startsWith('image/')) type = 'image';
      else if (file.type === 'application/pdf') type = 'pdf';
      
      // For images and PDFs, content should be the base64 part
      const base64Content = type === 'text' ? content : content.split(',')[1];

      setUploadedFile({
        name: file.name,
        type,
        content: base64Content
      });
    };

    if (file.type.startsWith('image/') || file.type === 'application/pdf') {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
  };

  const [currentStep, setCurrentStep] = useState(0);
  const reasoningSteps = [
    "Analyzing target career ROI...",
    "Extracting technical strategic constraints...",
    "Synthesizing industry standard case studies...",
    "Optimizing for Technical PM baseline...",
    "Generating interactive sandbox labs...",
    "Finalizing neural knowledge graph mapping..."
  ];

  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setCurrentStep(prev => (prev + 1) % reasoningSteps.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  const handleGenerate = async () => {
    if (mode === 'topic' && !topic) return;
    if (mode === 'material' && !uploadedFile) return;
    
    const taskName = mode === 'topic' ? `Mastering ${topic}` : `Course from ${uploadedFile?.name}`;
    addPendingTask(taskName);
    setIsGenerating(true);
    
    // We start the generation and allow the user to continue
    // but we wrap the promise so it can complete even if UI is closed
    const generationPromise = (async () => {
      try {
        let course: Course;
        if (mode === 'topic') {
          const finalDifficulties = Array.from({ length: numLessons }, (_, i) => {
              return difficulties[i % difficulties.length];
          });
          course = await generateCourse(topic, numLessons, finalDifficulties, options);
        } else {
          course = await generateCourseFromMaterial(uploadedFile!.content, uploadedFile!.type, options);
        }

        // Save to Firebase if logged in
      if (auth.currentUser) {
        try {
          await saveCourse(course);
          if (auth.currentUser.email) {
            const emailSent = await sendCourseCreationEmail(auth.currentUser.email, course, window.location.origin);
            if (emailSent) {
              onNotification(`Curriculum architected! Check your inbox.`);
            }
          }
        } catch (e) {
          console.error("Failed to save course or send email:", e);
        }
      }

        removePendingTask(taskName);
        onCourseGenerated(course);
      } catch (error) {
        console.error("Failed to generate course:", error);
        removePendingTask(taskName);
      }
    })();

    // Show loading for a moment, then tell user it's in background
    setTimeout(() => {
        onBack();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[150] bg-white overflow-y-auto">
      <div className="min-h-full flex flex-col items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-xl py-8 pb-24">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-900 rounded-[1.25rem] flex items-center justify-center text-white shadow-xl shadow-gray-200">
                <Wand2 size={24} />
              </div>
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold text-gray-900 leading-tight tracking-tighter">Nexus Architect</h2>
                <p className="text-[10px] text-gray-400 font-mono uppercase tracking-[0.2em] mt-1">Systems Synthesis Engine</p>
              </div>
           </div>
           <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
             <X size={24} />
           </button>
        </div>

        <AnimatePresence mode="wait">
          {!isGenerating ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="flex p-1 bg-gray-50 rounded-2xl border border-gray-100">
                <button 
                  onClick={() => setMode('topic')}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${mode === 'topic' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Prompt to Course
                </button>
                <button 
                  onClick={() => setMode('material')}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${mode === 'material' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Upload Material
                </button>
              </div>

              {mode === 'topic' ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <label className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">Curriculum Focus</label>
                      <button 
                        onClick={handleRefine}
                        disabled={!topic || isRefining}
                        className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 hover:text-indigo-700 disabled:opacity-30 uppercase tracking-wider"
                      >
                        {isRefining ? <RefreshCw className="animate-spin" size={12} /> : <Sparkles size={12} />}
                        Refine with AI
                      </button>
                    </div>
                    <div className="relative">
                      <textarea 
                        autoFocus
                        placeholder="e.g., Mastering Claude Code CLI, AI-Driven Documentation..."
                        className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none transition-all text-lg font-medium resize-none min-h-[120px]"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                      />
                      <div className="absolute top-4 right-4 text-indigo-400">
                        <Lightbulb size={24} className={topic ? 'opacity-100' : 'opacity-20'} />
                      </div>
                    </div>

                    {/* AI Suggestions */}
                    <AnimatePresence>
                      {suggestions.length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex flex-wrap gap-2 pt-2"
                        >
                           {suggestions.map((s, i) => (
                             <button
                               key={i}
                               onClick={() => setTopic(s)}
                               className="text-[10px] sm:text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full border border-indigo-100 hover:bg-indigo-100 transition-all flex items-center gap-1 group"
                             >
                               <Plus size={10} className="group-hover:rotate-90 transition-transform" />
                               {s}
                             </button>
                           ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-3">
                        <label className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest px-1">Modules</label>
                        <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl justify-between border border-transparent hover:border-gray-100 transition-all">
                           <button 
                             onClick={() => setNumLessons(Math.max(1, numLessons - 1))}
                             className="w-10 h-10 rounded-xl bg-white flex items-center justify-center hover:text-indigo-600 transition-all shadow-sm active:scale-95"
                           >
                             <Minus size={18} />
                           </button>
                           <span className="text-2xl font-bold font-mono text-gray-900">{numLessons}</span>
                           <button 
                             onClick={() => setNumLessons(Math.min(10, numLessons + 1))}
                             className="w-10 h-10 rounded-xl bg-white flex items-center justify-center hover:text-indigo-600 transition-all shadow-sm active:scale-95"
                           >
                             <Plus size={18} />
                           </button>
                        </div>
                     </div>

                     <div className="space-y-3">
                        <label className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest px-1">Difficulty</label>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                           {['Beginner', 'Intermediate', 'Advanced'].map(d => (
                             <button
                               key={d}
                               onClick={() => {
                                 if (difficulties.includes(d)) setDifficulties(difficulties.filter(x => x !== d));
                                 else setDifficulties([...difficulties, d]);
                               }}
                               className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all border-2 ${
                                 difficulties.includes(d) 
                                   ? 'bg-indigo-600 border-indigo-600 text-white' 
                                   : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                               }`}
                             >
                               {d}
                             </button>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="space-y-3 pt-2">
                        <label className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest px-1">Curriculum Content</label>
                        <div className="grid grid-cols-3 gap-3">
                           {[
                             { id: 'includeLessons', label: 'Guides', icon: FileText },
                             { id: 'includeQuizzes', label: 'Quizzes', icon: Sparkles },
                             { id: 'includeFlashcards', label: 'Flashcards', icon: RefreshCw }
                           ].map(opt => (
                             <button
                               key={opt.id}
                               type="button"
                               onClick={() => setOptions(prev => ({ ...prev, [opt.id]: !prev[opt.id as keyof CourseOptions] }))}
                               className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${
                                 options[opt.id as keyof CourseOptions]
                                   ? 'bg-indigo-50 border-indigo-600 text-indigo-700' 
                                   : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                               }`}
                             >
                               <opt.icon size={18} />
                               <span className="text-[10px] font-bold uppercase tracking-wider">{opt.label}</span>
                             </button>
                           ))}
                        </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest px-1">Source Material</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full min-h-[160px] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center p-6 transition-all cursor-pointer group ${
                        uploadedFile 
                          ? 'border-indigo-600 bg-indigo-50/30' 
                          : 'border-gray-200 bg-gray-50/50 hover:bg-gray-100/50 hover:border-indigo-300'
                      }`}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        accept="text/*,.pdf,image/*"
                        onChange={handleFileUpload}
                      />
                      
                      {uploadedFile ? (
                        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                          {uploadedFile.type === 'image' ? (
                            <div className="bg-indigo-100 p-4 rounded-2xl mb-3 text-indigo-600">
                              <ImageIcon size={32} />
                            </div>
                          ) : uploadedFile.type === 'pdf' ? (
                            <div className="bg-red-100 p-4 rounded-2xl mb-3 text-red-600">
                              <FileCheck size={32} />
                            </div>
                          ) : (
                            <div className="bg-indigo-100 p-4 rounded-2xl mb-3 text-indigo-600">
                              <FileText size={32} />
                            </div>
                          )}
                          <p className="font-bold text-gray-900">{uploadedFile.name}</p>
                          <p className="text-xs text-gray-400 mt-1">Ready to convert to lessons</p>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setUploadedFile(null); }}
                            className="mt-4 text-xs font-bold text-indigo-600 hover:underline"
                          >
                            Replace File
                          </button>
                        </div>
                      ) : (
                        <div className="text-center space-y-4">
                          <div className="bg-white w-14 h-14 rounded-2xl shadow-sm flex items-center justify-center mx-auto text-gray-400 group-hover:text-indigo-600 transition-colors">
                            <Upload size={24} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">Drop slides, notes, or research here</p>
                            <p className="text-xs text-gray-400 mt-1">Supports PDF, JPG, or Text files</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {!auth.currentUser && (
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-4 mb-2">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
                    <LogIn size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-amber-900 leading-tight">Guest Mode Active</h4>
                    <p className="text-[10px] text-amber-700 mt-1 leading-normal">
                      Curriculum architected in Guest Mode is only saved to your local browser. 
                      Sign in before generating to sync across devices and enable curriculum sharing.
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={(mode === 'topic' && !topic) || (mode === 'material' && !uploadedFile) || difficulties.length === 0}
                className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-30 active:scale-[0.98]"
              >
                <Sparkles size={22} />
                Generate Lessons
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 space-y-8"
            >
               <div className="relative">
                  <Loader2 size={80} className="text-indigo-600 animate-spin mx-auto" />
                  <Sparkles size={32} className="absolute -top-4 -right-4 text-indigo-400 animate-pulse" />
               </div>
                <div className="space-y-4 max-w-sm mx-auto">
                  <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Architecting Curriculum</h3>
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 min-h-[60px] flex items-center justify-center p-6">
                    <AnimatePresence mode="wait">
                      <motion.p 
                        key={currentStep}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-indigo-600 font-mono text-xs uppercase tracking-widest font-bold text-center leading-relaxed"
                      >
                        {reasoningSteps[currentStep]}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                  <p className="text-gray-400 text-[10px] uppercase tracking-[0.2em] font-mono">Building {numLessons} optimized modules</p>
                </div>
               <div className="flex justify-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" />
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  </div>
);
}
