<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScanAiInsight extends Model
{
    protected $fillable = [
        'scan_id',
        'executive_summary',
        'developer_explanation',
        'manager_explanation',
        'correction_priorities',
        'update_plan',
        'owasp_masvs_recommendations',
        'conclusion',
    ];

    public function scan()
    {
        return $this->belongsTo(Scan::class);
    }
}
