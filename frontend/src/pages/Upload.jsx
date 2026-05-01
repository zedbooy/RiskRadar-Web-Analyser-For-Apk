import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UploadCloud, ArrowLeft, ShieldAlert, CheckCircle2 } from 'lucide-react';

function Upload() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'apk';
  
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [modules, setModules] = useState({
    sbom: true,
    manifest: true,
    vulnerabilities: true,
    secrets: true,
    permissions: true,
    trackers: true,
    ai: true
  });

  const handleDrag = function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = function(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = function(e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const toggleModule = (moduleKey) => {
    setModules(prev => ({ ...prev, [moduleKey]: !prev[moduleKey] }));
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    // Passe à la page de chargement en lui envoyant éventuellement des données
    navigate('/loading', { state: { file: selectedFile.name, modules } });
  };

  return (
    <div className="bg-rr-surface p-8 rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-700 relative overflow-hidden">
      <button 
        onClick={() => navigate('/')} 
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Retour
      </button>

      <h2 className="text-3xl font-bold text-white mb-2">Nouvelle Analyse {type.toUpperCase()}</h2>
      <p className="text-slate-400 mb-8">Sélectionnez le fichier cible et choisissez les modules de sécurité à activer.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Zone Drag & Drop */}
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-slate-200 mb-3">Fichier Cible</h3>
          <div 
            className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 transition-colors ${dragActive ? 'border-rr-primary bg-rr-primary/10' : 'border-slate-600 hover:border-slate-500 bg-slate-800/50'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="text-center">
                <CheckCircle2 className="w-16 h-16 text-rr-success mx-auto mb-4" />
                <p className="text-lg font-medium text-white break-all">{selectedFile.name}</p>
                <p className="text-sm text-slate-400 mt-2">{(selectedFile.size / (1024*1024)).toFixed(2)} MB</p>
                <button 
                  onClick={() => setSelectedFile(null)} 
                  className="mt-4 text-sm text-rr-critical hover:text-red-400 underline"
                >
                  Retirer le fichier
                </button>
              </div>
            ) : (
              <div className="text-center">
                <UploadCloud className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-300 mb-2">Glissez et déposez votre fichier ici</p>
                <p className="text-slate-500 text-sm mb-4">Formats supportés: .apk, .zip</p>
                
                <label className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors inline-block">
                  Parcourir
                  <input type="file" className="hidden" accept=".apk,.zip" onChange={handleChange} />
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Modules d'analyse */}
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-slate-200 mb-3">Modules d'Analyse</h3>
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 flex-1 space-y-3">
            
            {Object.keys(modules).map(mod => (
              <label key={mod} className="flex items-center gap-3 p-2 hover:bg-slate-700/50 rounded-lg cursor-pointer transition-colors">
                <input 
                  type="checkbox" 
                  checked={modules[mod]} 
                  onChange={() => toggleModule(mod)}
                  className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-rr-primary focus:ring-rr-primary focus:ring-offset-slate-800"
                />
                <span className="text-slate-300 capitalize">{mod === 'ai' ? 'Analyse IA (RiskRadarTester)' : mod.replace('_', ' ')}</span>
              </label>
            ))}

          </div>
        </div>

      </div>

      <div className="mt-8 flex justify-end">
        <button 
          onClick={handleUpload}
          disabled={!selectedFile}
          className={`px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-all ${selectedFile ? 'bg-rr-primary hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30 cursor-pointer' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
        >
          <ShieldAlert className="w-5 h-5" />
          Lancer l'Analyse
        </button>
      </div>

    </div>
  );
}

export default Upload;
