<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Event;
use App\Models\User;

class EventFactory extends Factory
{
    protected $model = Event::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(),
            'location' => $this->faker->city(),
            'start_time' => $this->faker->dateTimeBetween('+1 week', '+2 weeks'),
            'end_time' => $this->faker->dateTimeBetween('+3 weeks', '+4 weeks'),
            'user_id' => \App\Models\User::factory(),    
            'category_id' => \App\Models\Category::factory(),
        ];
    }
}
