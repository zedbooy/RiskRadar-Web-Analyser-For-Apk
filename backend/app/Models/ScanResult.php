<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScanResult extends Model
{
    protected $fillable = [
        'scan_id',
        'sbom_data',
        'vulnerabilities',
        'permissions',
        'dangerous_permissions',
        'secrets',
        'licenses',
        'trackers',
        'obsolete_dependencies',
        'transitive_risks',
        'components',
    ];

    protected $casts = [
        'sbom_data' => 'array',
        'vulnerabilities' => 'array',
        'permissions' => 'array',
        'dangerous_permissions' => 'array',
        'secrets' => 'array',
        'licenses' => 'array',
        'trackers' => 'array',
        'obsolete_dependencies' => 'array',
        'transitive_risks' => 'array',
        'components' => 'array',
    ];

    public function scan()
    {
        return $this->belongsTo(Scan::class);
    }
}
