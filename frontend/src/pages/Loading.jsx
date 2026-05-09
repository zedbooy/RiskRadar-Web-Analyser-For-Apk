import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2, CheckCircle2, Circle } from 'lucide-react';


import axios from 'axios';

const STEPS = [
  { id: 'pending', label: "Initialisation" },
  { id: 'extracting', label: "Extraction et lecture du Manifest" },
  { id: 'analyzing', label: "Analyse statique (dépendances, vulnérabilités, secrets)" },
  { id: 'ai_processing', label: "Génération des recommandations IA (RiskRadarTester)" },
  { id: 'completed', label: "Analyse terminée" }
];

function Loading() {
  const navigate = useNavigate();
  const location = useLocation();
  const { scanId, fileName } = location.state || {};
  const [currentStatus, setCurrentStatus] = useState('pending');

  useEffect(() => {
    if (!scanId) {
      navigate('/upload');
      return;
    }

    const pollStatus = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/v1/scans/${scanId}/status`);
        const status = response.data.status;
        setCurrentStatus(status);

        if (status === 'completed') {
          setTimeout(() => navigate('/dashboard', { state: { scanId, fileName } }), 1000);
        } else if (status === 'failed') {
          alert("L'analyse a échoué. Veuillez réessayer.");
          navigate('/upload');
        }
      } catch (error) {
        console.error('Polling failed:', error);
      }
    };

    const interval = setInterval(pollStatus, 2000);
    return () => clearInterval(interval);
  }, [scanId, navigate, fileName]);

  const getCurrentStepIndex = () => {
    return STEPS.findIndex(step => step.id === currentStatus);
  };

  return (
    <div className="bg-rr-surface p-10 rounded-2xl shadow-2xl max-w-lg w-full border border-slate-700 relative overflow-hidden">
      <div className="text-center mb-8">
        <Loader2 className="w-16 h-16 text-rr-primary animate-spin mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white">Analyse en cours...</h2>
        <p className="text-slate-400 mt-2">Veuillez patienter pendant que RiskRadar examine votre fichier.</p>
      </div>

      <div className="space-y-4">
        {STEPS.map((step, index) => {
          const stepIndex = getCurrentStepIndex();
          let statusColor = "text-slate-500";
          let Icon = Circle;
          let iconClass = "w-5 h-5 text-slate-600";

          if (index < stepIndex || currentStatus === 'completed') {
            statusColor = "text-slate-300";
            Icon = CheckCircle2;
            iconClass = "w-5 h-5 text-rr-success";
          } else if (index === stepIndex) {
            statusColor = "text-white font-medium";
            Icon = Loader2;
            iconClass = "w-5 h-5 text-rr-primary animate-spin";
          }

          return (
            <div key={index} className={`flex items-center gap-3 transition-colors ${statusColor}`}>
              <Icon className={iconClass} />
              <span>{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Loading;
