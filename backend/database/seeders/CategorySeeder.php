<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Category::insert([
            ['name' => 'Konferencija'],
            ['name' => 'Ispit'],
            ['name' => 'Radionica'],
            ['name' => 'Projekat'],
            ['name' => 'Plenum'],
        ]);
    }
}
