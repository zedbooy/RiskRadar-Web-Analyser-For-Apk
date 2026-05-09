<!DOCTYPE html>
<html>
<head>
    <title>RiskRadar Report</title>
    <style>
        body { font-family: sans-serif; color: #333; font-size: 14px; line-height: 1.5; }
        .header { text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 20px; }
        .title { color: #1e293b; font-size: 28px; font-weight: bold; margin-bottom: 5px; }
        .subtitle { color: #64748b; font-size: 16px; margin-bottom: 15px; }
        .score-box { background-color: #fef2f2; border: 1px solid #fecaca; border-left: 5px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .score-text { font-size: 24px; color: #ef4444; font-weight: bold; }
        h3 { color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; margin-top: 30px; }
        .ai-section { background-color: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #cbd5e1; }
        .priority-item { margin-bottom: 8px; }
        .priority-label { font-weight: bold; color: #ef4444; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; }
        th { background-color: #f1f5f9; color: #334155; }
        .risk-critique { color: #ef4444; font-weight: bold; }
        .risk-élevé { color: #f97316; font-weight: bold; }
        .risk-moyen { color: #eab308; font-weight: bold; }
        .risk-faible { color: #22c55e; font-weight: bold; }
        ul { padding-left: 20px; }
        .footer { position: fixed; bottom: 0; width: 100%; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px; padding-bottom: 10px;}
    </style>
</head>
<body>
    <div class="header">
        <div class="title">RiskRadar Security Report</div>
        <div class="subtitle">Analyse statique avancée par intelligence artificielle</div>
        <p><strong>Fichier analysé :</strong> {{ $project }} &nbsp; | &nbsp; <strong>Date :</strong> {{ $date }}</p>
    </div>

    <div class="score-box" style="border-left-color: {{ $score < 50 ? '#ef4444' : ($score < 85 ? '#eab308' : '#22c55e') }};">
        <div class="score-text" style="color: {{ $score < 50 ? '#ef4444' : ($score < 85 ? '#eab308' : '#22c55e') }};">
            Score Global de Risque : {{ $score }} / 100 ({{ strtoupper($risk_level ?? 'Inconnu') }})
        </div>
        <p style="margin: 5px 0 0 0; color: #64748b;">
            @if($score < 50)
                Cette application présente un niveau de risque critique. Une intervention immédiate est recommandée.
            @elseif($score < 85)
                L'application présente des risques modérés. Des corrections sont nécessaires avant le déploiement.
            @else
                L'application est globalement conforme aux standards de sécurité de base.
            @endif
        </p>
    </div>

    <div class="ai-section">
        <h3>Recommandations IA (RiskRadarTester)</h3>
        <p><strong>Résumé Exécutif :</strong> {{ $ai_summary }}</p>
        
        <h4>Plan d'Action (Update Plan) :</h4>
        <ul>
            @foreach($ai_plan as $plan)
                <li class="priority-item"><span class="priority-label">{{ $plan['level'] }}:</span> {{ $plan['desc'] }}</li>
            @endforeach
        </ul>
    </div>

    <h3>Résumé Statistique</h3>
    <table style="width: 50%;">
        <tr><td>Vulnérabilités critiques/hautes</td><td><strong>{{ $stats['vulnerabilities'] }}</strong></td></tr>
        <tr><td>Secrets exposés en dur</td><td><strong>{{ $stats['secrets'] }}</strong></td></tr>
        <tr><td>Permissions dangereuses (Manifest)</td><td><strong>{{ $stats['permissions'] }}</strong></td></tr>
        <tr><td>Dépendances totales</td><td><strong>{{ $stats['dependencies'] }}</strong></td></tr>
        <tr><td>Dépendances obsolètes</td><td><strong>{{ $stats['obsolete'] }}</strong></td></tr>
    </table>

    <h3>Secrets Exposés</h3>
    <ul>
        @foreach($secrets as $secret)
            <li>
                <span style="color: #ef4444; font-weight: bold;">[ALERTE]</span> 
                @if(is_array($secret))
                    <strong>{{ $secret['type'] ?? 'Secret' }}</strong> : <code>{{ $secret['value'] ?? 'N/A' }}</code> 
                    <small>({{ $secret['file'] ?? 'Emplacement inconnu' }})</small>
                @else
                    {{ $secret }}
                @endif
            </li>
        @endforeach
    </ul>

    <h3>Permissions Dangereuses</h3>
    <ul>
        @foreach($dangerous_permissions as $perm)
            <li>{{ $perm }}</li>
        @endforeach
    </ul>

    <h3>Software Bill of Materials (SBOM) - Extraits Risqués</h3>
    <table>
        <thead>
            <tr>
                <th>Composant (Librairie)</th>
                <th>Version</th>
                <th>Niveau de Risque</th>
            </tr>
        </thead>
        <tbody>
            @foreach($sbom as $item)
            <tr>
                <td>{{ $item['name'] }}</td>
                <td>{{ $item['version'] }}</td>
                <td class="risk-{{ $item['risk'] }}">{{ $item['risk'] }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div style="margin-top: 50px;">
        <p><strong>Conclusion du Rapport :</strong> L'équipe de développement doit traiter le Plan d'Action prioritaire avant tout déploiement sur les stores d'applications. Les références de configuration AWS et les API Google Maps doivent être masquées.</p>
    </div>

    <div class="footer">
        Généré automatiquement par le moteur d'analyse statique RiskRadar<br>
        Signature officielle : {{ $signature }}
    </div>
</body>
</html>
