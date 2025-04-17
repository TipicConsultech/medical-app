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
    { Schema::create('preorder', function (Blueprint $table) {
        $table->id();
        $table->foreignId('customer_id')->constrained('users')->onDelete('cascade');
        $table->string('prescription_path')->nullable();
        $table->tinyInteger('schedule_h')->default(0);
        $table->tinyInteger('payment_type')->default(0);
        $table->foreignId('address_id')->constrained('address')->onDelete('cascade');
        $table->tinyInteger('status')->default(0);
        $table->timestamps();
    });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('preorder');// 
    }
};
