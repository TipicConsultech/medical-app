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
    {Schema::create('address', function (Blueprint $table) {
        $table->id();
        $table->foreignId('customer_id')->constrained('users')->onDelete('cascade');
        $table->string('address_line1');
        $table->string('address_line2')->nullable();
        $table->string('city');
        $table->string('state');
        $table->string('postal_code');
        $table->string('country');
        $table->string('landmark')->nullable();
        $table->decimal('latitude', 10, 8)->nullable();
        $table->decimal('longitude', 11, 8)->nullable();
        $table->enum('address_type', ['home', 'office'])->default('home');
        $table->timestamps();
    });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('address');// //
    }
};
