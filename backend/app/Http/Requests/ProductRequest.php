<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'category' => 'required|string',
            'emoji' => 'nullable|string',
            'image_url' => 'nullable|string',
            'is_promo' => 'nullable|boolean',
            'promo_price' => 'nullable|numeric|min:0',
        ];
    }
}
