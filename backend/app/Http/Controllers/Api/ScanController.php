<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Jobs\ProcessApkScan;
use App\Models\Scan;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ScanController extends Controller
{
    public function upload(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|max:102400', // 100MB max
            'modules' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $file = $request->file('file');
        $fileName = $file->getClientOriginalName();
        $extension = $file->getClientOriginalExtension();
        
        // Determine file type
        $fileType = 'apk';
        if ($extension === 'zip') $fileType = 'zip';
        elseif (str_contains($fileName, 'gradle')) $fileType = 'gradle';
        elseif ($fileName === 'AndroidManifest.xml') $fileType = 'manifest';

        // Store file securely
        $path = $file->storeAs('scans', time() . '_' . $fileName);

        // Create scan record
        $scan = Scan::create([
            'file_name' => $fileName,
            'file_path' => $path,
            'file_type' => $fileType,
            'status' => 'pending',
        ]);

        // Dispatch Job for analysis
        ProcessApkScan::dispatch($scan);

        return response()->json([
            'id' => $scan->id,
            'status' => $scan->status,
            'message' => 'Upload successful, analysis starting...'
        ]);
    }

    public function status($id)
    {
        $scan = Scan::findOrFail($id);
        return response()->json([
            'id' => $scan->id,
            'status' => $scan->status,
            'global_score' => $scan->global_score,
        ]);
    }

    public function show($id)
    {
        $scan = Scan::with(['results', 'aiInsights'])->findOrFail($id);
        return response()->json($scan);
    }

    public function details($id, $module)
    {
        $scan = Scan::with('results')->findOrFail($id);
        $results = $scan->results;
        return response()->json($results ? $results->$module : null);
    }

    public function aiInsights($id)
    {
        $scan = Scan::with('aiInsights')->findOrFail($id);
        return response()->json($scan->aiInsights);
    }
}
