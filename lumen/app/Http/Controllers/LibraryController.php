<?php

namespace App\Http\Controllers;

use App\Library;
use App\LibraryImage;
use App\LibrarySize;

use Illuminate\Http\Request;

class LibraryController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function listLibraries()
    {

        $libraries = Library::with('size')
            ->orderBy('lng')->get();

        return view('libraries.index')
            ->with('libraries', $libraries);
    }

    public function getLibraries()
    {
        $libraries = Library::with('images')->get();

        return $libraries;
    }

    public function showLibrary($id)
    {
        $library = Library::find($id);

        $images = LibraryImage::where('library_id', $id)->get();

        $sizes = LibrarySize::all();

        $coords = $this->getCoords($library->address);

        if (isset($coords['address']['house_number'])) {
            $library->osm_name = $coords['address']['house_number'];
        }
        if (isset($coords['address']['road'])) {
            $library->osm_name .= ' ' . $coords['address']['road'];
        }
    
        $library->osm_lat = $coords['lat'];
        $library->osm_lng = $coords['lon'];

        $library->images = $images;

        return view('libraries.show')
            ->with('sizes', $sizes)
            ->with('library', $library);
    }

    public function saveLibrary(Request $request, $id)
    {

        $data = $request->all();

        $data['verified'] = $request->get('verified');
        
        $library = Library::find($id);

        $library->update($data);

        return redirect('libraries');

    }

    public function addLibrary()
    {
        echo "Add new library";
    }

    private function getCoords($address)
    {

        $address .= " Toronto";
        $address = str_replace(' ', '+', $address);

        $url = "http://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=1&q="
                . $address;

        $data = json_decode(file_get_contents($url), true);

        if ($data) {
            return $data[0];
        }
     
    }



}
