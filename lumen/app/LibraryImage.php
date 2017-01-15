<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class LibraryImage extends Model
{

    protected $table = 'images';

    protected $fillable = [
        'library_id', 'file_name'
    ];


}
