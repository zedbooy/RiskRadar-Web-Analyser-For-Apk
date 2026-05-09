# Architecture de RiskRadar

RiskRadar est basé sur une architecture moderne séparant le client, le serveur et le moteur d'analyse lourde.

## 1. Frontend (React + Vite)
L'interface utilisateur est développée avec React (v19) et Vite.
- **Design System** : Utilisation de Tailwind CSS (v4) avec une approche Glassmorphism.
- **État & Navigation** : React Router DOM pour la navigation SPA (Single Page Application).
- **Communication API** : Axios pour interagir avec le backend Laravel.
- **Fonctionnalités** : Zone de Drag & Drop pour l'upload d'APK, tableau de bord interactif des résultats, chat IA intégré.

## 2. Backend (Laravel 11)
Le serveur principal gère la logique d'orchestration, le stockage et les APIs.
- **SGBD** : MySQL pour stocker l'historique des scans (`scans`), les résultats détaillés (`scan_results`) et les rapports IA (`scan_ai_insights`).
- **Files d'Attente (Queues)** : L'analyse d'un APK pouvant durer plusieurs secondes, Laravel utilise des Jobs (`ProcessApkScan`, `ProcessAiInsights`) exécutés en arrière-plan (Background Workers).
- **Export PDF** : Génération de rapports exécutifs via `dompdf`.

## 3. Intelligence Artificielle (Llama 3)
Intégration dynamique des API Groq et NVIDIA NIM pour générer des recommandations post-analyse.
- Le backend envoie le SBOM et les failles (au format JSON) à l'IA.
- Un prompt system ("Dependency Risk Radar expert") force le modèle LLM à formater sa réponse selon le standard de sécurité **OWASP MASVS**.
