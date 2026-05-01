import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldAlert, Bug, Key, Shield, AlertTriangle, ArrowLeft, MessageSquare, X, Send } from 'lucide-react';

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileName = location.state?.file || 'app-release.apk';

  // Simple hash function to generate deterministic numbers from filename
  const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash);
  };

  const fileHash = hashString(fileName);
  
  // Generate dynamic data
  const score = 20 + (fileHash % 75);
  const vulns = fileHash % 15;
  const vulnsCrit = Math.floor(vulns / 3);
  const secrets = fileHash % 5;
  const perms = 2 + (fileHash % 8);
  const deps = 30 + (fileHash % 50);
  const depsObs = fileHash % 12;

  // AI Profiles
  const aiProfiles = [
    {
      summary: "L'application présente des risques de sécurité majeurs. Des clés d'API cloud sont codées en dur, et plusieurs bibliothèques utilisent des versions vulnérables à l'exécution de code à distance (RCE).",
      plans: [
        { level: "Priorité 1", text: "Retirer les clés Google Maps API du code source et les déplacer vers une configuration serveur sécurisée." },
        { level: "Priorité 2", text: "Mettre à jour `com.squareup.retrofit2:retrofit` vers la version 2.9.0 ou supérieure." },
        { level: "Priorité 3", text: "Restreindre les permissions `READ_SMS` non justifiées par les fonctionnalités du manifeste." }
      ]
    },
    {
      summary: "Le code analysé expose de multiples trackers publicitaires agressifs et gère l'authentification de manière non sécurisée sans obfuscation.",
      plans: [
        { level: "Priorité 1", text: "Mettre à jour le SDK Firebase Authentication pour combler la faille de session." },
        { level: "Priorité 2", text: "Obfusquer le code métier avec ProGuard/R8, actuellement le code est facilement rétro-ingénierable." },
        { level: "Priorité 3", text: "Retirer les trackers inactifs pour réduire la surface d'attaque et la fuite de données RGPD." }
      ]
    },
    {
      summary: "L'architecture est globalement saine, mais l'utilisation de composants très anciens expose l'application à des interceptions réseau.",
      plans: [
        { level: "Priorité 1", text: "Ajouter la configuration `android:usesCleartextTraffic=\"false\"` dans le Manifest pour interdire HTTP non sécurisé." },
        { level: "Priorité 2", text: "Migrer les dépendances obsolètes vers AndroidX pour bénéficier des correctifs de sécurité modernes." },
        { level: "Priorité 3", text: "Supprimer les permissions de localisation en arrière-plan qui ne sont plus nécessaires." }
      ]
    }
  ];

  const aiProfileIndex = fileHash % 3;
  const currentAi = aiProfiles[aiProfileIndex];

  let riskLevel = "FAIBLE";
  let riskColor = "bg-green-500/20 text-green-400 border-green-500/30";
  let scoreColor = "text-rr-success";
  
  if (score < 40) {
    riskLevel = "CRITIQUE";
    riskColor = "bg-red-500/20 text-red-400 border-red-500/30";
    scoreColor = "text-rr-critical";
  } else if (score < 70) {
    riskLevel = "ÉLEVÉ";
    riskColor = "bg-orange-500/20 text-orange-400 border-orange-500/30";
    scoreColor = "text-orange-400";
  } else if (score < 90) {
    riskLevel = "MOYEN";
    riskColor = "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    scoreColor = "text-yellow-400";
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-8">
      <button 
        onClick={() => navigate('/')} 
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Résultats de l'Analyse</h1>
          <p className="text-slate-400">{fileName} • Scanné à l'instant</p>
        </div>
        <div className="flex items-center gap-4 bg-rr-surface px-6 py-3 rounded-xl border border-slate-700">
          <div>
            <p className="text-sm text-slate-400">Score Global</p>
            <p className={`text-3xl font-bold ${scoreColor}`}>{score}<span className="text-lg text-slate-500">/100</span></p>
          </div>
          <div className="h-12 w-px bg-slate-700"></div>
          <div>
            <p className="text-sm text-slate-400">Niveau de Risque</p>
            <span className={`inline-block mt-1 px-3 py-1 font-semibold rounded-lg text-sm border ${riskColor}`}>
              {riskLevel}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<Bug className="text-red-400" />} title="Vulnérabilités" value={vulns} subtext={`${vulnsCrit} Critiques`} color="border-red-500/50 bg-red-500/5" />
        <StatCard icon={<Key className="text-orange-400" />} title="Secrets Exposés" value={secrets} subtext="Clés détectées" color="border-orange-500/50 bg-orange-500/5" />
        <StatCard icon={<AlertTriangle className="text-yellow-400" />} title="Permissions" value={perms} subtext="Dangereuses" color="border-yellow-500/50 bg-yellow-500/5" />
        <StatCard icon={<Shield className="text-blue-400" />} title="Dépendances" value={deps} subtext={`${depsObs} Obsolètes`} color="border-blue-500/50 bg-blue-500/5" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-rr-surface p-6 rounded-2xl border border-slate-700 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4">Recommandations IA (RiskRadarTester)</h2>
          <div className="prose prose-invert max-w-none text-slate-300">
            <h3 className="text-white text-lg font-semibold">Résumé Exécutif</h3>
            <p>{currentAi.summary}</p>
            <h3 className="text-white text-lg font-semibold mt-4">Plan d'Action (Update Plan)</h3>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              {currentAi.plans.map((plan, idx) => {
                let colorClass = "text-rr-critical";
                if (plan.level === "Priorité 2") colorClass = "text-orange-400";
                if (plan.level === "Priorité 3") colorClass = "text-yellow-400";
                
                return (
                  <li key={idx}><strong className={colorClass}>{plan.level}:</strong> {plan.text}</li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="bg-rr-surface p-6 rounded-2xl border border-slate-700 shadow-xl flex flex-col">
          <h2 className="text-xl font-bold text-white mb-4">Export & Rapports</h2>
          <p className="text-slate-400 mb-6 flex-1">Générez un rapport complet au format PDF incluant le SBOM, l'analyse détaillée et les conseils MASVS.</p>
          <div className="space-y-3">
            <button 
              onClick={() => {
                const queryParams = new URLSearchParams({
                  file: fileName,
                  score,
                  vulns,
                  secrets,
                  perms,
                  deps,
                  depsObs,
                  risk: riskLevel,
                  ai_profile: aiProfileIndex
                }).toString();
                window.open(`http://127.0.0.1:8000/api/v1/scans/dummy/export/pdf?${queryParams}`, '_blank');
              }}
              className="w-full bg-rr-primary hover:bg-blue-600 py-3 rounded-lg font-semibold transition-colors cursor-pointer"
            >
              Télécharger Rapport PDF
            </button>
            <button 
              onClick={() => {
                const sbomData = {
                  project: fileName,
                  scanned_at: new Date().toISOString(),
                  score: score,
                  risk: riskLevel,
                  dependencies: [
                    { name: "com.squareup.retrofit2:retrofit", version: "2.8.0", risk: "high", recommendation: "Update to 2.9.0+" },
                    { name: "com.squareup.okhttp3:okhttp", version: "3.12.1", risk: "critical", recommendation: "Update to 4.9.0+" }
                  ]
                };
                const blob = new Blob([JSON.stringify(sbomData, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `RiskRadar_SBOM_${fileName}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="w-full bg-slate-700 hover:bg-slate-600 py-3 rounded-lg font-semibold transition-colors cursor-pointer"
            >
              Exporter SBOM (JSON)
            </button>
          </div>
        </div>
      </div>
      
      {/* Floating Chat Assistant */}
      <ChatAssistant fileName={fileName} />
    </div>
  );
}

function StatCard({ icon, title, value, subtext, color }) {
  return (
    <div className={`bg-rr-surface p-6 rounded-2xl border shadow-lg flex items-center gap-4 ${color}`}>
      <div className="p-3 bg-slate-800 rounded-xl">
        {icon}
      </div>
      <div>
        <p className="text-slate-400 text-sm">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-xs text-slate-500">{subtext}</p>
      </div>
    </div>
  );
}

function ChatAssistant({ fileName }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: `Bonjour ! Je suis RiskRadar IA. Avez-vous des questions sur les vulnérabilités détectées dans ${fileName} ?` }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    
    // Simulate AI thinking and replying
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        sender: 'ai', 
        text: `Concernant votre question : "${userMsg}", mon conseil est de vous référer au Plan d'Action (Priorité 1) généré ci-dessus. Je peux également vous aider à rédiger le correctif de code si vous le souhaitez !` 
      }]);
    }, 1500);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-rr-primary hover:bg-blue-600 text-white p-4 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)] flex items-center justify-center transition-transform hover:scale-110 z-50 cursor-pointer border border-blue-400/50"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 w-80 sm:w-96 bg-rr-surface rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col z-50 h-[28rem]">
      {/* Header */}
      <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShieldAlert className="w-6 h-6 text-rr-primary" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-rr-success border-2 border-slate-800"></div>
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">RiskRadar IA</h3>
            <p className="text-xs text-slate-400">En ligne</p>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-slate-900/50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === 'ai' ? 'justify-start' : 'justify-end'}`}>
            <div className={`p-3 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-md ${
              msg.sender === 'ai' 
                ? 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-sm' 
                : 'bg-rr-primary text-white rounded-tr-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-700 bg-slate-800 flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Poser une question à l'IA..."
          className="flex-1 bg-slate-900 text-white text-sm rounded-xl px-4 py-2 border border-slate-600 focus:outline-none focus:border-rr-primary focus:ring-1 focus:ring-rr-primary placeholder-slate-500"
        />
        <button 
          type="submit" 
          disabled={!input.trim()}
          className="bg-rr-primary hover:bg-blue-600 disabled:bg-slate-700 disabled:text-slate-500 text-white p-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

export default Dashboard;
