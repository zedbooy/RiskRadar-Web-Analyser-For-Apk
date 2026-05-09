import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldAlert, Bug, Key, Shield, AlertTriangle, ArrowLeft, MessageSquare, X, Send, Loader2 } from 'lucide-react';
import axios from 'axios';

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { scanId } = location.state || {};
  
  const [scanData, setScanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!scanId) {
      navigate('/upload');
      return;
    }

    const fetchResults = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/v1/scans/${scanId}`);
        setScanData(response.data);
      } catch (err) {
        console.error('Failed to fetch results:', err);
        setError("Impossible de récupérer les résultats de l'analyse.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [scanId, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <Loader2 className="w-12 h-12 text-rr-primary animate-spin mb-4" />
        <p className="text-slate-400">Chargement des résultats...</p>
      </div>
    );
  }

  if (error || !scanData) {
    return (
      <div className="text-center py-20">
        <p className="text-rr-critical text-xl">{error}</p>
        <button onClick={() => navigate('/upload')} className="mt-4 text-rr-primary underline">Retourner à l'upload</button>
      </div>
    );
  }

  const { results, ai_insights: aiInsights, global_score: score, risk_classification: riskLevel, file_name: fileName } = scanData;
  
  const vulns = results?.vulnerabilities?.length || 0;
  const secrets = results?.secrets?.length || 0;
  const perms = results?.dangerous_permissions?.length || results?.permissions?.length || 0;
  const deps = results?.sbom_data?.length || 0;

  let riskColor = "bg-green-500/20 text-green-400 border-green-500/30";
  let scoreColor = "text-rr-success";
  
  if (riskLevel === "critique") {
    riskColor = "bg-red-500/20 text-red-400 border-red-500/30";
    scoreColor = "text-rr-critical";
  } else if (riskLevel === "élevé") {
    riskColor = "bg-orange-500/20 text-orange-400 border-orange-500/30";
    scoreColor = "text-orange-400";
  } else if (riskLevel === "moyen") {
    riskColor = "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    scoreColor = "text-yellow-400";
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4">
      <button 
        onClick={() => navigate('/')} 
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Résultats de l'Analyse</h1>
          <p className="text-slate-400">{fileName} • Scanné le {new Date(scanData.created_at).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-4 bg-rr-surface px-6 py-3 rounded-xl border border-slate-700">
          <div>
            <p className="text-sm text-slate-400">Score Global</p>
            <p className={`text-3xl font-bold ${scoreColor}`}>{score}<span className="text-lg text-slate-500">/100</span></p>
          </div>
          <div className="h-12 w-px bg-slate-700"></div>
          <div>
            <p className="text-sm text-slate-400">Niveau de Risque</p>
            <span className={`inline-block mt-1 px-3 py-1 font-semibold rounded-lg text-sm border uppercase ${riskColor}`}>
              {riskLevel}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<Bug className="text-red-400" />} title="Vulnérabilités" value={vulns} subtext="CVE détectées" color="border-red-500/50 bg-red-500/5" />
        <StatCard icon={<Key className="text-orange-400" />} title="Secrets Exposés" value={secrets} subtext="Clés détectées" color="border-orange-500/50 bg-orange-500/5" />
        <StatCard icon={<AlertTriangle className="text-yellow-400" />} title="Permissions" value={perms} subtext="Total détecté" color="border-yellow-500/50 bg-yellow-500/5" />
        <StatCard icon={<Shield className="text-blue-400" />} title="Dépendances" value={deps} subtext="Composants SBOM" color="border-blue-500/50 bg-blue-500/5" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-rr-surface p-6 rounded-2xl border border-slate-700 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <ShieldAlert className="text-rr-primary" /> Plan d'Action & Recommandations
          </h2>
          {aiInsights ? (
            <div className="prose prose-invert max-w-none text-slate-300">
              <div className="bg-slate-800/50 p-4 rounded-xl mb-4 border-l-4 border-rr-primary">
                <h3 className="text-white text-lg font-semibold mb-2">Résumé Exécutif</h3>
                <p className="whitespace-pre-line text-sm">{aiInsights.executive_summary}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiInsights.correction_priorities && (
                  <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700">
                    <h3 className="text-rr-critical text-sm font-bold uppercase mb-2">Priorités</h3>
                    <p className="whitespace-pre-line text-sm leading-relaxed">{aiInsights.correction_priorities}</p>
                  </div>
                )}
                
                {aiInsights.update_plan && (
                  <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700">
                    <h3 className="text-rr-success text-sm font-bold uppercase mb-2">Plan d'Update</h3>
                    <p className="whitespace-pre-line text-sm leading-relaxed">{aiInsights.update_plan}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center py-8 text-slate-500 italic">
               <p>Génération des conseils IA en cours ou non disponible...</p>
            </div>
          )}
        </div>

        <div className="bg-rr-surface p-6 rounded-2xl border border-slate-700 shadow-xl flex flex-col">
          <h2 className="text-xl font-bold text-white mb-4">Export & Rapports</h2>
          <p className="text-slate-400 mb-6 flex-1 text-sm">Téléchargez le rapport complet au format PDF (norme MASVS) ou exportez les données brutes JSON.</p>
          <div className="space-y-3">
            <button 
              onClick={() => window.open(`http://127.0.0.1:8000/api/v1/scans/${scanId}/report/pdf`, '_blank')}
              className="w-full bg-rr-primary hover:bg-blue-600 py-3 rounded-lg font-semibold transition-colors cursor-pointer text-white flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
            >
              Télécharger PDF
            </button>
            <button 
              onClick={() => {
                const blob = new Blob([JSON.stringify(scanData, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = `RiskRadar_${fileName}.json`; a.click();
              }}
              className="w-full bg-slate-700 hover:bg-slate-600 py-3 rounded-lg font-semibold transition-colors cursor-pointer text-white"
            >
              Exporter JSON
            </button>
          </div>
        </div>
      </div>

      <div className="bg-rr-surface rounded-2xl border border-slate-700 shadow-2xl overflow-hidden mb-20">
        <AnalysisDetails results={results} />
      </div>
      
      <ChatAssistant fileName={fileName} />
    </div>
  );
}

function AnalysisDetails({ results }) {
  const [activeTab, setActiveTab] = useState('secrets');

  const tabs = [
    { id: 'vulnerabilities', label: 'Vulnérabilités', icon: <Bug className="w-4 h-4 text-red-400" /> },
    { id: 'secrets', label: 'Secrets', icon: <Key className="w-4 h-4" /> },
    { id: 'permissions', label: 'Permissions', icon: <Shield className="w-4 h-4" /> },
    { id: 'sbom', label: 'SBOM & Dépendances', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'components', label: 'Composants', icon: <AlertTriangle className="w-4 h-4" /> },
  ];

  return (
    <div>
      <div className="flex border-b border-slate-700 bg-slate-800/50 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id 
                ? 'text-rr-primary border-b-2 border-rr-primary bg-rr-primary/5' 
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6 min-h-[300px]">
        {activeTab === 'vulnerabilities' && (
          <div className="space-y-4">
            <h3 className="text-white font-bold mb-4">Vulnérabilités et Failles Détectées</h3>
            {results?.vulnerabilities?.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {results.vulnerabilities.map((v, i) => (
                  <div key={i} className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 flex flex-col md:flex-row gap-4 md:items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Bug className="w-4 h-4 text-red-400" />
                        <span className="font-bold text-white">{v.id}</span>
                      </div>
                      <p className="text-sm text-slate-300">{v.desc}</p>
                    </div>
                    <div className="shrink-0">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        v.severity === 'HIGH' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'
                      }`}>
                        {v.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <Shield className="w-12 h-12 mx-auto mb-2 opacity-20 text-green-400" />
                <p>Aucune vulnérabilité directe détectée.</p>
              </div>
            )}
          </div>
        )}
        {activeTab === 'secrets' && (
          <div className="space-y-4">
            <h3 className="text-white font-bold mb-4">Clés et Secrets Détectés</h3>
            {results?.secrets?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-slate-400 bg-slate-800/50">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">Type</th>
                      <th className="px-4 py-3">Valeur (Masquée)</th>
                      <th className="px-4 py-3 rounded-tr-lg">Source</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {results.secrets.map((s, i) => (
                      <tr key={i} className="hover:bg-slate-700/20 transition-colors">
                        <td className="px-4 py-3 text-orange-400 font-mono font-bold uppercase">{s.type}</td>
                        <td className="px-4 py-3 text-slate-300 font-mono text-xs">{s.value.substring(0, 8)}********</td>
                        <td className="px-4 py-3 text-slate-500 italic">{s.file}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <Shield className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p>Aucun secret détecté dans le code source.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'permissions' && (
          <div className="space-y-4">
            <h3 className="text-white font-bold mb-4">Permissions Déclarées</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(results?.dangerous_permissions || results?.permissions || []).map((p, i) => {
                const isDangerous = results?.dangerous_permissions?.includes(p);
                return (
                  <div key={i} className={`p-4 rounded-xl border flex items-center justify-between ${
                    isDangerous ? 'bg-red-500/5 border-red-500/20' : 'bg-slate-800/30 border-slate-700'
                  }`}>
                    <span className={`font-mono text-xs ${isDangerous ? 'text-red-400 font-bold' : 'text-slate-300'}`}>
                      {p.split('.').pop()}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded uppercase ${
                      isDangerous ? 'bg-red-500/20 text-red-400' : 'bg-slate-700 text-slate-400'
                    }`}>
                      {isDangerous ? 'DANGEREUX' : 'NORMAL'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'sbom' && (
          <div className="space-y-4">
            <h3 className="text-white font-bold mb-4">Software Bill of Materials (SBOM)</h3>
            <div className="overflow-x-auto rounded-xl border border-slate-700">
              <table className="w-full text-left text-sm">
                <thead className="text-slate-400 bg-slate-800/50">
                  <tr>
                    <th className="px-4 py-3">Bibliothèque</th>
                    <th className="px-4 py-3">Version</th>
                    <th className="px-4 py-3">Risque</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {(results?.sbom_data || []).map((lib, i) => (
                    <tr key={i} className="hover:bg-slate-700/20 transition-colors">
                      <td className="px-4 py-3 text-white font-semibold">{lib.name}</td>
                      <td className="px-4 py-3 text-slate-400 font-mono">{lib.version}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          lib.risk === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                        }`}>
                          {lib.risk || 'low'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'components' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-slate-400 text-xs font-bold uppercase mb-3">Activités ({results?.components?.activities?.length || 0})</h4>
              <div className="flex flex-wrap gap-2">
                {(results?.components?.activities || []).map((a, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs border border-slate-700">
                    {a.split('.').pop()}
                  </span>
                ))}
              </div>
            </div>
            
            {results?.components?.services?.length > 0 && (
              <div>
                <h4 className="text-slate-400 text-xs font-bold uppercase mb-3">Services ({results?.components?.services?.length || 0})</h4>
                <div className="flex flex-wrap gap-2">
                  {results.components.services.map((s, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-500/5 text-blue-300 rounded-lg text-xs border border-blue-500/20">
                      {s.split('.').pop()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
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
    
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        sender: 'ai', 
        text: `Concernant votre question : "${userMsg}", je vous recommande de vérifier les priorités de correction dans le tableau de bord. Voulez-vous que je détaille un point spécifique ?` 
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
