<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use OpenAI;

class AIGeneratorController extends Controller
{
    /**
     * Call OpenAI API to generate a Store profile.
     */
    public function generateStore(Request $request)
    {
        $request->validate(['prompt' => 'required|string']);
        $prompt = $request->prompt;

        $apiKey = env('OPENAI_API_KEY');
        if (!$apiKey) {
            return response()->json(['error' => 'API Key manquante. Veuillez configurer OPENAI_API_KEY dans le .env'], 500);
        }

        try {
            $client = OpenAI::client($apiKey);
            
            $systemPrompt = "Tu es un expert en e-commerce et en branding d'artisanat marocain de luxe. L'utilisateur va décrire le type de boutique qu'il veut créer. Ton but est de renvoyer UNIQUEMENT un objet JSON strictement formaté de cette façon:
{
  \"shop_name\": \"Maison...\",
  \"description\": \"description captivante de 2 phrases maximum\",
  \"theme_settings\": {
      \"primaryColor\": \"#c9a84c\",
      \"secondaryColor\": \"#2a2a2a\",
      \"fontFamily\": \"'Cormorant Garamond', serif\"
  },
  \"categories\": [\"Catégorie 1\", \"Catégorie 2\", \"Catégorie 3\"]
}";

            $response = $client->chat()->create([
                'model' => 'gpt-4o',
                'messages' => [
                    ['role' => 'system', 'content' => $systemPrompt],
                    ['role' => 'user', 'content' => $prompt]
                ],
                'temperature' => 0.7,
                'response_format' => ['type' => 'json_object']
            ]);

            $content = $response->choices[0]->message->content;
            $json = json_decode($content, true);

            return response()->json($json);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la génération avec l\'IA.',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Call OpenAI API to generate a Product.
     */
    public function generateProduct(Request $request)
    {
        $request->validate(['name' => 'required|string']);
        $name = $request->name;

        $apiKey = env('OPENAI_API_KEY');
        if (!$apiKey) {
            return response()->json(['error' => 'API Key manquante. Veuillez configurer OPENAI_API_KEY dans le .env'], 500);
        }

        try {
            $client = OpenAI::client($apiKey);
            
            $systemPrompt = "Tu es un copywriter spécialisé dans le luxe marocain (SOUK ✦). L'utilisateur te donne le nom brut d'un produit. Ton but est d'élever ce produit pour une audience haut de gamme. Renvoie UNIQUEMENT un objet JSON strictement formaté :
{
  \"title\": \"Nom sublimé et prestigieux du produit\",
  \"description\": \"Storytelling envoûtant de 2 phrases maximum, soulignant le savoir-faire ancestral et le luxe\",
  \"category\": \"catégorie courte\",
  \"tags\": [\"tag1\", \"tag2\", \"tag3\"],
  \"suggested_price\": 1500,
  \"suggested_image_url\": \"https://image.pollinations.ai/prompt/luxurious...\"
}
Pour 'suggested_price', suggère un prix 'Luxe' élevé en MAD. Pour 'suggested_image_url', crée un prompt artistique en anglais décrivant ce produit (style photographie de luxe, 8k, bokeh) et ajoute le suffixe à 'https://image.pollinations.ai/prompt/'.";

            $response = $client->chat()->create([
                'model' => 'gpt-4o',
                'messages' => [
                    ['role' => 'system', 'content' => $systemPrompt],
                    ['role' => 'user', 'content' => $name]
                ],
                'temperature' => 0.7,
                'response_format' => ['type' => 'json_object']
            ]);

            $content = $response->choices[0]->message->content;
            $json = json_decode($content, true);

            return response()->json($json);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la génération avec l\'IA.',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}
