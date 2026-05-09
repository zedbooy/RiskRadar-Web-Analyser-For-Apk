<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

use App\Models\Scan;

class ReportController extends Controller
{
    public function exportPdf($id, Request $request)
    {
        $scan = Scan::with(['results', 'aiInsights'])->find($id);

        if ($scan) {
            $data = [
                'project' => $scan->file_name,
                'score' => $scan->global_score,
                'risk_level' => $scan->risk_classification,
                'date' => $scan->created_at->format('d/m/Y H:i'),
                'signature' => 'Ghalbane Ziad & Elmahfoudi Anas',
                'ai_summary' => $scan->aiInsights->executive_summary ?? 'Aucun résumé IA disponible.',
                'ai_plan' => array_map(function($line) {
                    return ['level' => 'IMPORTANT', 'desc' => ltrim($line, ' -123456789.')];
                }, explode("\n", $scan->aiInsights->correction_priorities ?? "Aucun plan d'action spécifique.")),
                'stats' => [
                    'vulnerabilities' => count($scan->results->vulnerabilities ?? []),
                    'secrets' => count($scan->results->secrets ?? []),
                    'permissions' => count($scan->results->dangerous_permissions ?? []),
                    'dependencies' => count($scan->results->sbom_data ?? []),
                    'obsolete' => count($scan->results->obsolete_dependencies ?? [])
                ],
                'secrets' => $scan->results->secrets ?? [],
                'dangerous_permissions' => $scan->results->dangerous_permissions ?? [],
                'sbom' => $scan->results->sbom_data ?? []
            ];
        } else {
            // Fallback to dummy data for testing
            $data = [
                'project' => 'App-demo.apk',
                'score' => 85,
                'risk_level' => 'faible',
                'date' => now()->format('d/m/Y H:i'),
                'signature' => 'Ghalbane Ziad & Elmahfoudi Anas',
                'ai_summary' => "L'application est globalement saine.",
                'ai_plan' => [],
                'stats' => ['vulnerabilities' => 0, 'secrets' => 0, 'permissions' => 5, 'dependencies' => 10, 'obsolete' => 0],
                'secrets' => [],
                'dangerous_permissions' => [],
                'sbom' => []
            ];
        }

        $pdf = Pdf::loadView('pdf.report', $data);
        return $pdf->download('RiskRadar_Report_' . $id . '.pdf');
    }
}
