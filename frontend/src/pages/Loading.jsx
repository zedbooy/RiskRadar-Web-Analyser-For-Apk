import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2, CheckCircle2, Circle } from 'lucide-react';

const STEPS = [
  "Extraction du fichier",
  "Lecture du Manifest",
  "Analyse des dépendances",
  "Vérification des vulnérabilités",
  "Détection des secrets",
  "Analyse des licences",
  "Calcul du score de risque",
  "Génération des recommandations IA (RiskRadarTester)"
];

function Loading() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Simulation du processus de backend pour l'instant
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= STEPS.length - 1) {
          clearInterval(interval);
          setTimeout(() => navigate('/dashboard', { state: location.state }), 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 1500); // Passe à l'étape suivante toutes les 1.5s

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="bg-rr-surface p-10 rounded-2xl shadow-2xl max-w-lg w-full border border-slate-700 relative overflow-hidden">
      <div className="text-center mb-8">
        <Loader2 className="w-16 h-16 text-rr-primary animate-spin mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white">Analyse en cours...</h2>
        <p className="text-slate-400 mt-2">Veuillez patienter pendant que RiskRadar examine votre fichier.</p>
      </div>

      <div className="space-y-4">
        {STEPS.map((step, index) => {
          let statusColor = "text-slate-500";
          let Icon = Circle;
          let iconClass = "w-5 h-5 text-slate-600";

          if (index < currentStep) {
            statusColor = "text-slate-300";
            Icon = CheckCircle2;
            iconClass = "w-5 h-5 text-rr-success";
          } else if (index === currentStep) {
            statusColor = "text-white font-medium";
            Icon = Loader2;
            iconClass = "w-5 h-5 text-rr-primary animate-spin";
          }

          return (
            <div key={index} className={`flex items-center gap-3 transition-colors ${statusColor}`}>
              <Icon className={iconClass} />
              <span>{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Loading;
