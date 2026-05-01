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
        Schema::create('scan_ai_insights', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('scan_id')->constrained('scans')->cascadeOnDelete();
            $table->text('executive_summary')->nullable();
            $table->text('developer_explanation')->nullable();
            $table->text('manager_explanation')->nullable();
            $table->text('correction_priorities')->nullable();
            $table->text('update_plan')->nullable();
            $table->text('owasp_masvs_recommendations')->nullable();
            $table->text('conclusion')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scan_ai_insights');
    }
};
