import { motion } from 'motion/react';
import { Sparkles, Target, Zap, Brain, TrendingUp, Lightbulb } from 'lucide-react';
import { UserProgress } from '../types';

interface AIInsightsProps {
  progress: UserProgress;
}

export default function AIInsights({ progress }: AIInsightsProps) {
  const profile = progress?.profile;
  const careerGoal = profile?.careerGoal || "General Professional Growth";

  const insights = [
    {
      title: "Technical Gap Analysis",
      description: `Targeting ${careerGoal.split(' ').slice(-1)[0]} requires 40% more focus on ML Ops.`,
      icon: Target,
      color: "text-red-500",
      bg: "bg-red-50"
    },
    {
      title: "Synergy Alert",
      description: "Your background in PMing synergizes with 'Transport Layers' theory.",
      icon: Zap,
      color: "text-amber-500",
      bg: "bg-amber-50"
    },
    {
      title: "Adaptive Recommendation",
      description: "Next module: 'LLM Latency Optimization' to reach Senior level.",
      icon: Lightbulb,
      color: "text-indigo-500",
      bg: "bg-indigo-50"
    }
  ];

  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles size={18} className="text-indigo-600" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 font-mono">Neural Insights & Gap Analysis</h3>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {insights.map((insight, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group"
          >
            <div className={`w-10 h-10 ${insight.bg} ${insight.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <insight.icon size={20} />
            </div>
            <h4 className="font-bold text-gray-900 mb-1">{insight.title}</h4>
            <p className="text-xs text-gray-500 leading-relaxed font-medium">
              {insight.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Visual Roadmap MOCK */}
      <div className="mt-6 p-6 bg-gray-900 rounded-3xl overflow-hidden relative">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xs">
            <h4 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
              <Brain size={20} className="text-indigo-400" />
              Nexus Knowledge Graph
            </h4>
            <p className="text-gray-400 text-xs leading-relaxed">
              Our neural engine has mapped your progress against industry standard 
              <span className="text-indigo-400 font-bold"> {careerGoal}</span> path.
            </p>
          </div>

          <div className="flex-1 w-full max-w-md h-32 flex items-center justify-around relative">
             {/* Simple visual representation of nodes */}
             {[1, 2, 3, 4, 5].map((node, i) => (
               <motion.div
                 key={i}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ 
                    opacity: [0.3, 1, 0.3],
                    y: [0, -10, 0],
                    scale: [1, 1.2, 1] 
                 }}
                 transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    delay: i * 0.5 
                 }}
                 className="relative"
               >
                 <div className={`w-3 h-3 rounded-full ${i < 3 ? 'bg-indigo-400 shadow-[0_0_15px_rgba(129,140,248,0.5)]' : 'bg-gray-700'}`} />
                 {i < 4 && (
                   <div className="absolute top-1.5 left-full w-12 md:w-16 h-px bg-gradient-to-r from-gray-700 via-gray-800 to-transparent" />
                 )}
               </motion.div>
             ))}
             <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 -translate-y-1/2" />
          </div>

          <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-400/20 px-4 py-2 rounded-xl">
             <TrendingUp size={16} className="text-indigo-400" />
             <span className="text-[10px] font-bold text-white uppercase tracking-widest">+12% Mastery this week</span>
          </div>
        </div>

        {/* Decorative ambient light */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl" />
      </div>
    </section>
  );
}
