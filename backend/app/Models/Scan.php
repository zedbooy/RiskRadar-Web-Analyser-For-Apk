<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Support\Str;

class Scan extends Model
{
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'file_name',
        'file_path',
        'file_type',
        'status',
        'global_score',
        'risk_classification',
    ];

    protected $casts = [
        'global_score' => 'integer',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    public function results()
    {
        return $this->hasOne(ScanResult::class);
    }

    public function aiInsights()
    {
        return $this->hasOne(ScanAiInsight::class);
    }
}
