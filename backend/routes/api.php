<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ScanController;
use App\Http\Controllers\Api\ReportController;

Route::prefix('v1')->group(function () {
    Route::post('/scans/upload', [ScanController::class, 'upload']);
    Route::get('/scans/{id}/status', [ScanController::class, 'status']);
    Route::get('/scans/{id}', [ScanController::class, 'show']);
    Route::get('/scans/{id}/details/{module}', [ScanController::class, 'details']);
    Route::get('/scans/{id}/ai-insights', [ScanController::class, 'aiInsights']);
    Route::get('/scans/{id}/export/pdf', [ReportController::class, 'exportPdf']);
    Route::get('/scans/{id}/report/pdf', [ReportController::class, 'exportPdf']);
    Route::get('/scans/{id}/export/sbom', [ReportController::class, 'exportSbomJson']);
    Route::get('/scans/{id}/export/csv', [ReportController::class, 'exportCsv']);
});
