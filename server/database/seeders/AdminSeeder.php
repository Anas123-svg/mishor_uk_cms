<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * @return void
     */
    public function run()
    {
        Admin::create([
            'name' => 'Admin',
            'email' => 'admin@mishor.com',
            'password' => Hash::make('12345678'),
            'role' => 'superadmin',
            'profile_pic' => 'https://example.com/images/adminuser.jpg',
            'permissions' => [
                'Customers' => true,
                'Products' => true,
                'Orders' => true
            ],
        ]);
    }
}
