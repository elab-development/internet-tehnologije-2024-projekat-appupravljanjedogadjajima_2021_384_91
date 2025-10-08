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
            'user_id' => User::factory(),
            'start_time' => $this->faker->dateTimeBetween('+1 days', '+1 month'),
            'end_time' => $this->faker->dateTimeBetween('+1 month', '+2 months'),
        ];
    }
}
