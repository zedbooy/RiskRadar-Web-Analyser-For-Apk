# Moteur d'Analyse (SAST & SBOM)

RiskRadar repose sur un script Python spécialisé, orchestré par Laravel.

## 1. Fonctionnement du Scanner Python (`main.py`)
Le moteur utilise la librairie `androguard` pour décompiler dynamiquement les fichiers `.apk`.

- **Parsing du Manifest** : Extrait la configuration système (ex: l'activation du flag `allowBackup` ou `debuggable`) et liste les permissions Android demandées (détection des permissions "Dangerous" comme SMS, GPS, Caméra).
- **Extraction Heuristique du SBOM** : Pour contourner l'obfuscation, le script scanne directement le bytecode (`.dex`) via des expressions régulières pour identifier les espaces de noms des librairies embarquées (`Lcom/squareup/okhttp3`). 
- **Base de Risque (Dependency Radar)** : Mappe les librairies trouvées à une base de données interne pour identifier les versions obsolètes, les problèmes de licences (GPL, Apache) et les trackers publicitaires (Firebase Analytics, AdMob).
- **Simulation Dynamique** : Selon l'application cible (ex: UnCrackable, r2pay), le moteur simule la découverte de secrets spécifiques (clés API hardcodées, vulnérabilités natives) pour démontrer les capacités de l'outil.

## 2. Algorithme de Scoring (`ProcessApkScan.php`)
Une fois le JSON retourné par Python, le backend calcule un score sur 100 :
- **-15 à -20 points** : Failles Critiques (Ex: Clé API de paiement en clair).
- **-15 points** : Failles Hautes (Ex: Stockage Insecure, Crypto faible).
- **-12 points** par secret exposé.
- **-5 points** par Tracker publicitaire détecté.

**Classification du Risque :**
- **0 - 39** : Risque Critique
- **40 - 69** : Risque Élevé
- **70 - 84** : Risque Moyen
- **85 - 100** : Risque Faible
