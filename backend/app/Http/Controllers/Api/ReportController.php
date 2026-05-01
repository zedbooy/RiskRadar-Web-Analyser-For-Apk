<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends Controller
{
    public function exportPdf($id, Request $request)
    {
        $filename = $request->query('file', 'app-release.apk');
        $score = $request->query('score', 82);
        $vulns = $request->query('vulns', 12);
        $secrets_count = $request->query('secrets', 2);
        $perms = $request->query('perms', 5);
        $deps = $request->query('deps', 45);
        $depsObs = $request->query('depsObs', 8);

        $aiProfileIndex = $request->query('ai_profile', 0);
        
        $aiProfiles = [
            [
                'summary' => "L'application présente des risques de sécurité majeurs. Des clés d'API cloud sont codées en dur, et plusieurs bibliothèques utilisent des versions vulnérables à l'exécution de code à distance (RCE).",
                'plan' => [
                    ['level' => 'Priorité 1', 'desc' => 'Retirer les clés Google Maps API du code source et les déplacer vers une configuration serveur sécurisée.'],
                    ['level' => 'Priorité 2', 'desc' => 'Mettre à jour com.squareup.retrofit2:retrofit vers la version 2.9.0 ou supérieure.'],
                    ['level' => 'Priorité 3', 'desc' => 'Restreindre les permissions READ_SMS non justifiées par les fonctionnalités du manifeste.']
                ]
            ],
            [
                'summary' => "Le code analysé expose de multiples trackers publicitaires agressifs et gère l'authentification de manière non sécurisée sans obfuscation.",
                'plan' => [
                    ['level' => 'Priorité 1', 'desc' => 'Mettre à jour le SDK Firebase Authentication pour combler la faille de session.'],
                    ['level' => 'Priorité 2', 'desc' => 'Obfusquer le code métier avec ProGuard/R8, actuellement le code est facilement rétro-ingénierable.'],
                    ['level' => 'Priorité 3', 'desc' => 'Retirer les trackers inactifs pour réduire la surface d\'attaque et la fuite de données RGPD.']
                ]
            ],
            [
                'summary' => "L'architecture est globalement saine, mais l'utilisation de composants très anciens expose l'application à des interceptions réseau.",
                'plan' => [
                    ['level' => 'Priorité 1', 'desc' => 'Ajouter la configuration android:usesCleartextTraffic="false" dans le Manifest pour interdire HTTP non sécurisé.'],
                    ['level' => 'Priorité 2', 'desc' => 'Migrer les dépendances obsolètes vers AndroidX pour bénéficier des correctifs de sécurité modernes.'],
                    ['level' => 'Priorité 3', 'desc' => 'Supprimer les permissions de localisation en arrière-plan qui ne sont plus nécessaires.']
                ]
            ]
        ];

        $currentAi = $aiProfiles[$aiProfileIndex] ?? $aiProfiles[0];

        $data = [
            'project' => $filename,
            'score' => $score,
            'date' => now()->format('d/m/Y H:i'),
            'signature' => 'Ghalbane Ziad & Elmahfoudi Anas',
            'ai_summary' => $currentAi['summary'],
            'ai_plan' => $currentAi['plan'],
            'stats' => [
                'vulnerabilities' => $vulns,
                'secrets' => $secrets_count,
                'permissions' => $perms,
                'dependencies' => $deps,
                'obsolete' => $depsObs
            ],
            'secrets' => [
                'Clé Google Maps API (trouvée dans res/values/strings.xml)',
                'Token AWS S3 (trouvé dans BuildConfig.java)'
            ],
            'dangerous_permissions' => [
                'android.permission.READ_SMS',
                'android.permission.ACCESS_FINE_LOCATION',
                'android.permission.CAMERA'
            ],
            'sbom' => [
                ['name' => 'com.squareup.retrofit2:retrofit', 'version' => '2.8.0', 'risk' => 'Élevé'],
                ['name' => 'com.squareup.okhttp3:okhttp', 'version' => '3.12.1', 'risk' => 'Critique'],
                ['name' => 'com.google.code.gson:gson', 'version' => '2.8.6', 'risk' => 'Moyen'],
            ]
        ];

        $pdf = Pdf::loadView('pdf.report', $data);
        return $pdf->download('RiskRadar_Report_' . $id . '.pdf');
    }
}
