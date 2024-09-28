<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddResetCodeToUsersTable extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('reset_code')->nullable(); // Column for the reset code
            $table->timestamp('reset_code_expires_at')->nullable(); // Expiry time for reset code
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['reset_code', 'reset_code_expires_at']);
        });
    }
}
