<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewVendorRegistered extends Notification
{
    use Queueable;

    protected $vendor;

    public function __construct($vendor)
    {
        $this->vendor = $vendor;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Nouveau vendeur en attente : ' . $this->vendor->shop_name)
            ->line('Un nouveau vendeur s\'est inscrit sur la plateforme SOUK.')
            ->line('Nom de la boutique : ' . $this->vendor->shop_name)
            ->line('E-mail : ' . $this->vendor->email)
            ->action('Voir la file de modération', url('/admin/moderation'))
            ->line('Merci de vérifier ce compte dès que possible.');
    }

    public function toArray($notifiable)
    {
        return [
            'vendor_id' => $this->vendor->id,
            'shop_name' => $this->vendor->shop_name,
            'email' => $this->vendor->email,
            'message' => 'Nouveau vendeur en attente de modération.',
        ];
    }
}
