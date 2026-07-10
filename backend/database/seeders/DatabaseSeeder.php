<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'tiucrs@gmail.com'],
            [
                'name' => 'Cristian',
                'password' => bcrypt('Letmein#1#'),
                'role' => 'admin',
            ]
        );
    }
}
