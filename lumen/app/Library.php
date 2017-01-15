<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Library extends Model
{

    protected $fillable = [
        'address', 'lat', 'lng', 'verified', 'size_id'
    ];


}
