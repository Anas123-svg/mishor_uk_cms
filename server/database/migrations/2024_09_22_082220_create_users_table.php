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
        Schema::table('users', function (Blueprint $table) {
            // Rename first_name and last_name to name
            $table->string('name')->after('id');  // Add the new 'name' field
            $table->dropColumn('first_name');  // Remove the 'first_name' column
            $table->dropColumn('last_name');   // Remove the 'last_name' column

            // Rename mobile_phone_number to phone
            $table->renameColumn('mobile_phone_number', 'phone');  // Rename 'mobile_phone_number' to 'phone'

            // Drop the unnecessary columns
            $table->dropColumn(['postal_code', 'city', 'country', 'bank_details', 'is_verified', 'confirmation_of_knowledge']);  // Remove unnecessary fields
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Restore the original structure if rolled back
            $table->dropColumn('name');  // Drop 'name' if rollback

            // Restore 'first_name' and 'last_name'
            $table->string('first_name')->after('id');
            $table->string('last_name')->after('first_name');

            // Rename 'phone' back to 'mobile_phone_number'
            $table->renameColumn('phone', 'mobile_phone_number');

            // Restore the dropped columns
            $table->string('postal_code')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->nullable();
            $table->text('bank_details')->nullable();
            $table->boolean('is_verified')->default(false);
            $table->boolean('confirmation_of_knowledge')->default(false);
        });
    }
};
