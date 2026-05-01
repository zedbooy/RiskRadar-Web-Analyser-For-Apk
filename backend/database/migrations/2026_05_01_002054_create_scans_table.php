<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('scans', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('file_name');
            $table->enum('file_type', ['apk', 'zip', 'gradle', 'manifest']);
            $table->enum('status', ['pending', 'extracting', 'analyzing', 'ai_processing', 'completed', 'failed'])->default('pending');
            $table->integer('global_score')->nullable();
            $table->enum('risk_classification', ['faible', 'moyen', 'élevé', 'critique'])->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scans');
    }
};
