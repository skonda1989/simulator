import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Info, AlertTriangle, CheckCircle2, XCircle, Search, Clock, ShieldCheck, Database, Zap, DollarSign, BarChart3, Lock, Cpu, ArrowRight } from 'lucide-react';

interface AISimulatorProps {
  type: 'rag-conflict' | 'token-cost' | 'latency-tradeoff' | 'eval-thresholds' | 'mcp-security' | 'agent-loops';
  onComplete: () => void;
}

export default function AISimulator({ type, onComplete }: AISimulatorProps) {
  const [knobs, setKnobs] = useState<any>({});
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<'neutral' | 'error' | 'warning' | 'success'>('neutral');
  const [metrics, setMetrics] = useState<any>({});

  // Initialize knobs based on type
  useEffect(() => {
    switch (type) {
      case 'rag-conflict':
        setKnobs({ freshness: false, confidence: false, refuse: false });
        break;
      case 'token-cost':
        setKnobs({ contextLength: 4000, modelType: 'pro', instances: 1 });
        break;
      case 'latency-tradeoff':
        setKnobs({ streaming: true, quantization: '8-bit', speculative: false });
        break;
      case 'eval-thresholds':
        setKnobs({ similarity: 0.8, factuality: 0.7 });
        break;
      case 'mcp-security':
        setKnobs({ readOnly: true, rowLevel: false, audit: true });
        break;
    }
  }, [type]);

  useEffect(() => {
    // Simulation Logic
    switch (type) {
      case 'rag-conflict':
        if (knobs.refuse) {
          setOutput("⚠️ I found conflicting policies (3 days vs 5 days) for your 4-day delay. Aborting generation for safety.");
          setStatus('warning');
        } else if (knobs.freshness) {
          setOutput("✅ Yes, your refund is approved. Recent 2024 policy (Doc B) allows refunds for delays over 3 days.");
          setStatus('success');
        } else {
          setOutput("❌ No, refund requires a 5-day delay as per our standard policy (Doc A).");
          setStatus('error');
        }
        break;

      case 'token-cost':
        const baseCost = knobs.modelType === 'pro' ? 0.01 : 0.002;
        const totalCost = (knobs.contextLength / 1000) * baseCost * knobs.instances;
        setMetrics({ cost: totalCost.toFixed(4), tokens: knobs.contextLength });
        setOutput(`Estimated monthly cost: $${(totalCost * 30000).toLocaleString()} for ${knobs.instances.toLocaleString()} daily users.`);
        setStatus(totalCost > 0.05 ? 'error' : 'success');
        break;

      case 'latency-tradeoff':
        const baseLatency = knobs.speculative ? 80 : 250;
        const finalLatency = knobs.quantization === '4-bit' ? baseLatency * 0.6 : baseLatency;
        setMetrics({ latency: finalLatency + 'ms', quality: knobs.quantization === '4-bit' ? '82%' : '98%' });
        setOutput(knobs.streaming ? "Output is streaming instantly. Perceived latency is low." : `Response delivered in ${finalLatency}ms.`);
        setStatus(finalLatency < 150 ? 'success' : 'warning');
        break;

      case 'eval-thresholds':
        const passed = knobs.similarity >= 0.9 && knobs.factuality >= 0.8;
        setOutput(passed ? "✅ Production deployment approved. Quality gates verified." : "❌ Deployment blocked. Failed to meet strict similarity thresholds (Need 0.9).");
        setStatus(passed ? 'success' : 'error');
        break;

      case 'mcp-security':
        if (knobs.readOnly && knobs.audit) {
          setOutput("✅ MCP connection secure. All write attempts logged and blocked.");
          setStatus('success');
        } else {
          setOutput("⚠️ Security vulnerability detected. Connection is not strictly read-only.");
          setStatus('warning');
        }
        break;
    }
  }, [knobs, type]);

  const renderKnobs = () => {
    switch (type) {
      case 'rag-conflict':
        return (
          <div className="space-y-4">
            {['freshness', 'confidence', 'refuse'].map(k => (
              <label key={k} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={knobs[k]} onChange={e => setKnobs({...knobs, [k]: e.target.checked})} className="w-5 h-5 rounded border-gray-200 checked:bg-indigo-600 transition-all" />
                <span className="text-sm font-bold text-gray-800 capitalize">{k.replace(/([A-Z])/g, ' $1')} Mode</span>
              </label>
            ))}
          </div>
        );
      case 'token-cost':
        return (
          <div className="space-y-6">
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 block mb-2">Context Tokens ({knobs.contextLength})</label>
              <input type="range" min="1000" max="128000" step="1000" value={knobs.contextLength} onChange={e => setKnobs({...knobs, contextLength: parseInt(e.target.value)})} className="w-full accent-indigo-600" />
            </div>
            <div className="flex gap-4">
              {['pro', 'flash'].map(m => (
                <button key={m} onClick={() => setKnobs({...knobs, modelType: m})} className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase transition-all ${knobs.modelType === m ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}>{m}</button>
              ))}
            </div>
          </div>
        );
      case 'latency-tradeoff':
        return (
            <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={knobs.speculative} onChange={e => setKnobs({...knobs, speculative: e.target.checked})} className="w-5 h-5 rounded border-gray-200 checked:bg-indigo-600 transition-all" />
                    <span className="text-sm font-bold text-gray-800 capitalize">Speculative Decoding</span>
                </label>
                <div>
                   <label className="text-[10px] uppercase font-bold text-gray-400 block mb-2">Quantization</label>
                   <div className="flex gap-2">
                        {['4-bit', '8-bit', 'FP16'].map(q => (
                            <button key={q} onClick={() => setKnobs({...knobs, quantization: q})} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${knobs.quantization === q ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}>{q}</button>
                        ))}
                   </div>
                </div>
            </div>
        );
      default:
        return <p className="text-xs text-gray-400 italic">No knobs available for this simulation type.</p>;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden max-w-4xl mx-auto">
      <div className="bg-gray-900 p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
            <Cpu size={20} />
          </div>
          <div>
            <h3 className="font-bold text-lg capitalize">{type.replace('-', ' ')} Simulator</h3>
            <p className="text-[10px] font-mono text-indigo-300 uppercase tracking-widest leading-none">Architectural Tuning Lab</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 min-h-[400px]">
        <div className="p-8 border-r border-gray-100 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-4 text-gray-500">
               <Settings size={16} />
               <h4 className="text-xs font-bold uppercase tracking-widest font-mono">Control Panel</h4>
            </div>
            {renderKnobs()}
          </div>

          {metrics && Object.keys(metrics).length > 0 && (
              <div className="pt-8 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-4 text-gray-500">
                    <BarChart3 size={16} />
                    <h4 className="text-xs font-bold uppercase tracking-widest font-mono">Engine Metrics</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      {Object.entries(metrics).map(([key, val]: [string, any]) => (
                          <div key={key} className="bg-gray-50 p-3 rounded-2xl">
                              <p className="text-[9px] uppercase font-bold text-gray-400 mb-1">{key}</p>
                              <p className="text-sm font-mono font-bold text-gray-900">{val}</p>
                          </div>
                      ))}
                  </div>
              </div>
          )}
        </div>

        <div className="p-8 bg-gray-50 flex flex-col items-center justify-center text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={status}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg mb-6 ${
                  status === 'success' ? 'bg-green-100 text-green-600' :
                  status === 'error' ? 'bg-red-100 text-red-600' :
                  status === 'warning' ? 'bg-amber-100 text-amber-600' :
                  'bg-indigo-100 text-indigo-600'
                }`}
              >
                {status === 'success' && <CheckCircle2 size={40} />}
                {status === 'error' && <XCircle size={40} />}
                {status === 'warning' && <AlertTriangle size={40} />}
              </motion.div>
            </AnimatePresence>

            <div className="w-full space-y-2 mb-8">
                 <h4 className="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-bold">Simulator Output</h4>
                 <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm min-h-[100px] flex items-center justify-center">
                    <p className="text-gray-900 font-medium text-sm leading-relaxed">
                        {output || "Configure knobs to see results."}
                    </p>
                 </div>
            </div>

            <button
                onClick={onComplete}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
            >
              Confirm and Continue
              <ArrowRight size={18} />
            </button>
        </div>
      </div>
    </div>
  );
}
