<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('discount_percentage', 5, 2)->nullable();
            $table->enum('cutting_status', ['cut', 'uncut'])->default('uncut');
            $table->string('manufacturer');
            $table->boolean('schedule_h')->default(false);
            $table->boolean('available')->default(true);
            $table->decimal('weight', 8, 2);
            $table->boolean('available')->default(true);
            $table->string('thumbnail')->nullable();
            $table->enum('weight_type', ['gm', 'ml'])->default('gm');
            $table->integer('qty')->default(1);
            $table->integer('mg')->nullable();
            $table->timestamps();
        });

        Schema::create('product_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->string('src'); // Image URL or path
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_images');
        Schema::dropIfExists('products');
    }
};
