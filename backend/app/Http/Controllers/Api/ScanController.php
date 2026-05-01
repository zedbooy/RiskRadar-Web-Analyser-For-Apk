<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ScanController extends Controller
{
    public function upload(Request $request) { return response()->json(['status' => 'success']); }
    public function status($id) { return response()->json(['status' => 'completed']); }
    public function show($id) { return response()->json(['status' => 'success']); }
    public function details($id, $module) { return response()->json(['status' => 'success']); }
    public function aiInsights($id) { return response()->json(['status' => 'success']); }
}
