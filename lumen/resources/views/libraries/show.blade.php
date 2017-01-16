@extends('layout')

@section('content')


<form method="post" action="{{$library->id}}">

    <div>
        <label>
        Address: <input name="address" value="{{ $library->address }}"/>
        </label>
        OSM: {{ $library->osm_name or '' }}
    </div>

    <div>
        <label>
        Latitude: <input name="lat" value="{{ $library->lat }}"/>
        </label>
        OSM: {{ $library->osm_lat }}
    </div>
    
    <div>
        <label>
        Longitude: <input name="lng" value="{{ $library->lng }}"/>
        </label>
        OSM: {{ $library->osm_lng }}
    </div>

    <div>
        <label>
        Box latitude: <input name="box_lat" value="{{ $library->box_lat }}"/>
        </label>
    </div>
    
    <div>
        <label>
        Box longitude: <input name="box_lng" value="{{ $library->box_lng }}"/>
        </label>
    </div>

    <div>
        <label>
        LFL No: <input name="lfl_no" value="{{ $library->lfl_no }}"/>
        </label>
    </div>

    <div>
        <label>
        Verified: <input type="checkbox" value="1" name="verified" @if($library->verified) checked @endif/>
        </label>
    </div>


    <div>
        <label>
        Size: 
        <select name="size_id">
            <option value="">Select size</option>
            @foreach ($sizes as $size)
                <option
                    @if($library->size_id == $size->id) selected @endif
                    value="{{ $size->id }}">{{ $size->name }}</option> 
            @endforeach
        </select>
        </label>
    </div>


@foreach ($library->images as $image)
    <div>
    <img src="../../images/{{ $image->file_name }}"/>
    <br/>
    Quality: <input type="number" min="1" max="5" value="{{ $image->quality }}"/>
    </div>
@endforeach

    <br/>
    <input type="submit" value="Save"/>
 
</form>

@endsection
