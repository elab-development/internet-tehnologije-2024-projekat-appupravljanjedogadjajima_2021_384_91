<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role', 
    ];

    /**
     * The attributes that should be hidden for arrays.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    
    public function events()
    {
        return $this->belongsToMany(Event::class)
                    ->withPivot('status') 
                    ->withTimestamps();
    }

    
    public function organizedEvents()
    {
        return $this->hasMany(Event::class);
    }
    public function isAdmin()
{
    return $this->role === 'admin';
}

public function isOrganizer()
{
    return $this->role === 'organizer';
}

public function isUser()
{
    return $this->role === 'user';
}
}
