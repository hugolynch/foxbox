<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Library extends Model
{

    protected $fillable = [
        'address', 'lat', 'lng', 'verified', 'size_id'
    ];


    public function size()
    {
        return $this->belongsTo('App\LibrarySize');
    }

    public function images()
    {
        return $this->hasMany('App\LibraryImage');
    }

    public function tags()
    {
        return $this->belongsToMany('App\LibraryTag');
    }
}
