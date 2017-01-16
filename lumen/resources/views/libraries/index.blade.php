@extends('layout')

@section('content')

<h1>Libraries</h1>

<style>
table {
    margin: 1em auto;
    border-collapse: collapse;
}

th, td {
    border: 1px solid #ccc;
    padding: 5px;
}

</style>

<table>
<tr>
    <th>ID</th>
    <th>Address</th>
    <th>Size</th>
    <th>Verified</th>
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
            {{ $library->size->name or ''}}
        </td>
        <td>
            {{ $library->verified }}
        </td>
    </tr>
@endforeach
</table>
@endsection

