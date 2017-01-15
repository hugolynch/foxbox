@extends('layout')

@section('content')


<form method="post" action="{{$library->id}}">
    Address: <input name="address" value="{{ $library->address }}"/>
    OSM: {{ $library->osm_name or '' }}

    <br/>
	Latitude: <input name="lat" value="{{ $library->lat }}"/>
    OSM: {{ $library->osm_lat }}
    
    <br/>
    Longitude: <input name="lng" value="{{ $library->lng }}"/>
    OSM: {{ $library->osm_lng }}

    <br/>
	Box latitude: <input name="box_lat" value="{{ $library->lat }}"/>
    
    <br/>
    Box longitude: <input name="box_lng" value="{{ $library->lng }}"/>

    <br/>
    LFL No: <input name="lfl_no" value="{{ $library->lfl_no }}"/>

    <br/>
    Verified: <input type="checkbox" value="1" name="verified" @if($library->verified) checked @endif/>


    <div>
    Size: 
    <select name="size_id">
        <option value="">Select size</option>
        @foreach ($sizes as $size)
            <option
                @if($library->size_id == $size->id) selected @endif
                value="{{ $size->id }}">{{ $size->name }}</option> 
        @endforeach
    </select>
    </div>

    <br/>
    <input type="submit" value="Save"/>
    
</form>


@foreach ($library->images as $image)

    <img src="../../images/{{ $image->file_name }}"/>
@endforeach
@endsection
