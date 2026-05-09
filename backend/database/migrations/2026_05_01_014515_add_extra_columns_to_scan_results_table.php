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
        Schema::table('scan_results', function (Blueprint $table) {
            $table->json('dangerous_permissions')->nullable()->after('permissions');
            $table->json('components')->nullable()->after('transitive_risks');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('scan_results', function (Blueprint $table) {
            $table->dropColumn(['dangerous_permissions', 'components']);
        });
    }
};
