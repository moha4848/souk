<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail as VerifyEmailBase;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Lang;

class VerifyEmailNotification extends VerifyEmailBase
{
    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $verificationUrl = $this->verificationUrl($notifiable);

        return (new MailMessage)
            ->subject(Lang::get('Validez votre compte SOUK ✦'))
            ->line(Lang::get('Merci de vous être inscrit ! Veuillez cliquer sur le bouton ci-dessous pour vérifier votre adresse e-mail.'))
            ->action(Lang::get('Valider votre compte'), $verificationUrl)
            ->line(Lang::get('Si vous n\'avez pas créé de compte, aucune action supplémentaire n\'est requise.'));
    }

    /**
     * Get the verification URL for the given notifiable.
     *
     * @param  mixed  $notifiable
     * @return string
     */
    protected function verificationUrl($notifiable)
    {
        // Custom URL for API verification
        return url('/api/verify-email/' . $notifiable->getKey() . '/' . sha1($notifiable->getEmailForVerification()));
    }
}
