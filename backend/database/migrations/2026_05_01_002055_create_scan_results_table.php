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
        Schema::create('scan_results', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('scan_id')->constrained('scans')->cascadeOnDelete();
            $table->json('sbom_data')->nullable();
            $table->json('vulnerabilities')->nullable();
            $table->json('permissions')->nullable();
            $table->json('secrets')->nullable();
            $table->json('licenses')->nullable();
            $table->json('trackers')->nullable();
            $table->json('obsolete_dependencies')->nullable();
            $table->json('transitive_risks')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scan_results');
    }
};
