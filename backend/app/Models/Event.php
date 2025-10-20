<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'location',
        'user_id',
        'start_time',
        'end_time',
    ];

   
    public function users()
    {
        return $this->belongsToMany(User::class, 'event_user');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
