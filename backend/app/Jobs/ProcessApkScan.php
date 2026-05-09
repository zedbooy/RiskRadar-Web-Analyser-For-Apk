<?php

namespace App\Jobs;

use App\Models\Scan;
use App\Models\ScanResult;
use App\Jobs\ProcessAiInsights;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Process;

class ProcessApkScan implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $scan;

    /**
     * Create a new job instance.
     */
    public function __construct(Scan $scan)
    {
        $this->scan = $scan;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $this->scan->update(['status' => 'analyzing']);

        $filePath = realpath(storage_path('app/private/' . $this->scan->file_path));
        $pythonScript = base_path('../python_engine/main.py');

        // Execute Python script
        $result = Process::run([
            'python', 
            $pythonScript, 
            '--file', $filePath
        ]);

        if ($result->failed()) {
            Log::error("Python Analysis Failed: " . $result->errorOutput());
            $this->scan->update(['status' => 'failed']);
            return;
        }

        $output = json_decode($result->output(), true);

        if (isset($output['status']) && $output['status'] === 'error') {
            Log::error("Python Analysis Logic Error: " . $output['message']);
            $this->scan->update(['status' => 'failed']);
            return;
        }

        // Store results
        ScanResult::create([
            'scan_id' => $this->scan->id,
            'sbom_data' => $output['sbom_data'] ?? [],
            'vulnerabilities' => $output['vulnerabilities'] ?? [],
            'permissions' => $output['permissions'] ?? [],
            'dangerous_permissions' => $output['dangerous_permissions'] ?? [],
            'secrets' => $output['secrets'] ?? [],
            'licenses' => $output['licenses'] ?? [],
            'trackers' => $output['trackers'] ?? [],
            'obsolete_dependencies' => $output['obsolete_dependencies'] ?? [],
            'transitive_risks' => $output['transitive_risks'] ?? [],
            'components' => $output['components'] ?? [],
        ]);

        // Real scoring logic based on Python results
        $score = 100;
        
        // 1. Permissions (max -25)
        if (isset($output['permissions'])) {
            $totalPerms = count($output['permissions']);
            $score -= min(10, $totalPerms * 0.5); // Small penalty for total permissions
        }
        if (isset($output['dangerous_permissions'])) {
            $score -= min(15, count($output['dangerous_permissions']) * 4);
        }
        
        // 2. Vulnerabilities (max -40)
        if (isset($output['vulnerabilities'])) {
            $score -= min(40, count($output['vulnerabilities']) * 15);
        }
        
        // 3. Trackers (max -15)
        if (isset($output['trackers'])) {
            $score -= min(15, count($output['trackers']) * 5);
        }

        // 4. Secrets (max -25)
        if (isset($output['secrets'])) {
            $score -= min(25, count($output['secrets']) * 12);
        }

        // 5. Manifest Security (max -10)
        if (isset($output['manifest_analysis'])) {
            if ($output['manifest_analysis']['allow_backup'] ?? false) $score -= 3;
            if ($output['manifest_analysis']['debuggable'] ?? false) $score -= 5;
            if ($output['manifest_analysis']['test_only'] ?? false) $score -= 2;
        }

        // 6. Component Complexity
        if (isset($output['components'])) {
            $totalComponents = count($output['components']['activities'] ?? []) + 
                              count($output['components']['services'] ?? []) + 
                              count($output['components']['providers'] ?? []);
            if ($totalComponents > 20) $score -= 5;
            if ($totalComponents > 50) $score -= 10;
        }

        $score = max(0, $score);

        $riskClassification = 'faible';
        if ($score < 40) $riskClassification = 'critique';
        elseif ($score < 70) $riskClassification = 'élevé';
        elseif ($score < 85) $riskClassification = 'moyen';

        $this->scan->update([
            'status' => 'ai_processing',
            'global_score' => $score,
            'risk_classification' => $riskClassification,
        ]);

        // Dispatch AI Insight Job
        ProcessAiInsights::dispatch($this->scan);
    }
}
