@extends('layout')

@section('content')

<h1>Libraries</h1>

<table>
<tr>
    <td>ID</td>
    <td>Address</td>
    <td>Size</td>
    <td>Verified</td>
</tr>
@foreach ($libraries as $library)
    <tr>
        <td>
            {{ $library->id }}
        </td>
        <td>
            <a href="libraries/{{$library->id}}">
            {{ $library->address }}
            </a>
        </td>
        <td>
            {{ $library->size_id }}
        </td>
        <td>
            {{ $library->verified }}
        </td>
    </tr>
@endforeach
</table>
@endsection

