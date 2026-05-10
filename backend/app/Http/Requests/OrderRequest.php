<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'store_id' => 'required|exists:vendors,id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'client_name' => 'required|string',
            'client_email' => 'nullable|email',
            'client_phone' => 'required|string',
            'shipping_address' => 'required|string',
            'shipping_city' => 'required|string',
            'payment_method' => 'required|string|in:cod,online,card',
            'delivery_method' => 'required|string',
            'notes' => 'nullable|string',
            'points_used' => 'nullable|integer|min:0',
        ];
    }
}
