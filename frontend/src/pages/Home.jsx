import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, FileArchive } from 'lucide-react';
import logo from '../assets/logo.png';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-rr-surface p-10 rounded-2xl shadow-2xl max-w-2xl text-center border border-slate-700 w-full relative overflow-hidden">
      {/* Glow effect in background */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-rr-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-rr-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

      <img src={logo} alt="RiskRadar Logo" className="w-32 h-32 mx-auto mb-6 rounded-2xl shadow-lg border border-slate-700 relative z-10" />
      
      <h1 className="text-5xl font-bold bg-gradient-to-r from-rr-primary to-rr-secondary bg-clip-text text-transparent mb-4 tracking-tight relative z-10">
        RiskRadar
      </h1>
      <p className="text-slate-300 text-lg mb-8 relative z-10">
        Plateforme web d’analyse statique Android et d'évaluation de sécurité par l'IA.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
        <button 
          onClick={() => navigate('/upload?type=apk')}
          className="bg-rr-primary hover:bg-blue-600 px-8 py-3 rounded-lg font-semibold transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 cursor-pointer"
        >
          <ShieldCheck className="w-5 h-5" />
          Analyser APK
        </button>
        <button 
          onClick={() => navigate('/upload?type=zip')}
          className="bg-slate-700 hover:bg-slate-600 px-8 py-3 rounded-lg font-semibold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          <FileArchive className="w-5 h-5" />
          Upload ZIP
        </button>
      </div>
      
      <div className="mt-10 pt-6 border-t border-slate-700 text-sm text-slate-400 relative z-10">
        <p className="font-medium text-slate-300">Signature officielle :</p>
        <p className="mt-1 tracking-wide">Ghalbane Ziad & Elmahfoudi Anas</p>
      </div>
    </div>
  );
}

export default Home;
