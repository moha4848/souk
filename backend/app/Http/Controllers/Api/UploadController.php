<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'type' => 'nullable|string'
        ]);

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $path = $file->store('uploads', 'public');
            $url = asset('storage/' . $path);

            return response()->json([
                'url' => $url,
                'path' => $path,
                'message' => 'Fichier téléchargé avec succès'
            ]);
        }

        return response()->json(['message' => 'Aucun fichier fourni'], 400);
    }
}
