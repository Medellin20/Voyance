import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { MessageCircle, Mail, Phone, Send } from 'lucide-react';

export default function Contact() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const sendNotification = async (
    actionType: string,
    userEmail: string,
    fullName?: string,
    phone?: string,
    messageText?: string,
    userId?: string
  ) => {
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send_user_notification`;

      await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          action_type: actionType,
          email: userEmail,
          full_name: fullName,
          phone,
          message: messageText,
          user_id: userId,
        }),
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const { error } = await supabase.from('contacts').insert({
      user_id: user?.id || null,
      name,
      email,
      message,
      contact_type: 'form',
    });

    if (!error) {
      await supabase.from('user_logs').insert({
        user_id: user?.id || null,
        action_type: 'contact',
        email,
        full_name: name,
        message,
      });

      await sendNotification('contact', email, name, undefined, message, user?.id);

      setSuccess(true);
      setMessage('');
      setTimeout(() => setSuccess(false), 5000);
    }

    setLoading(false);
  };

  const voyantPhone = '+33612345678';

  const whatsApp1 = '+33612345678';
  const whatsApp2 = '+33787654321';
  const email1 = 'voyant@voyance-etoilee.fr';
  const email2 = 'support@voyance-etoilee.fr';

  const whatsappMessage1 = encodeURIComponent(
    `Bonjour, je souhaite consulter un voyant pour une consultation personnalisée. ${user ? `Mon nom: ${user.full_name}` : ''}`
  );

  const whatsappMessage2 = encodeURIComponent(
    `Bonjour, je souhaite obtenir des informations sur vos services et packs. ${user ? `Mon nom: ${user.full_name}` : ''}`
  );

  const gmailSubject1 = encodeURIComponent('Demande de Consultation Voyance');
  const gmailBody1 = encodeURIComponent(
    `Bonjour,\n\nJe souhaite prendre rendez-vous pour une consultation de voyance.\n\n${
      user ? `Nom: ${user.full_name}\nEmail: ${user.email}\n` : ''
    }\nCordialement`
  );

  const gmailSubject2 = encodeURIComponent('Renseignements sur les Services');
  const gmailBody2 = encodeURIComponent(
    `Bonjour,\n\nJe souhaiterais obtenir plus d'informations sur vos services et tarifs.\n\n${
      user ? `Nom: ${user.full_name}\nEmail: ${user.email}\n` : ''
    }\nCordialement`
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Contactez un Voyant
          </h1>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            Choisissez votre méthode de contact préférée pour une consultation personnalisée
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-8">Contact Direct</h2>

            <div className="space-y-4">
              <a
                href={`https://wa.me/${whatsApp1}?text=${whatsappMessage1}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-4 bg-green-500 hover:bg-green-600 text-white p-5 rounded-xl transition shadow-lg hover:scale-105 transform"
              >
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">WhatsApp - Consultation</h3>
                  <p className="text-green-100 text-sm">Demande de consultation personnalisée</p>
                </div>
              </a>

              <a
                href={`https://wa.me/${whatsApp2}?text=${whatsappMessage2}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-4 bg-green-600 hover:bg-green-700 text-white p-5 rounded-xl transition shadow-lg hover:scale-105 transform"
              >
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">WhatsApp - Informations</h3>
                  <p className="text-green-100 text-sm">Renseignements sur nos services</p>
                </div>
              </a>

              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${email1}&su=${gmailSubject1}&body=${gmailBody1}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-4 bg-red-500 hover:bg-red-600 text-white p-5 rounded-xl transition shadow-lg hover:scale-105 transform"
              >
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">Email - Consultation</h3>
                  <p className="text-red-100 text-sm">Rendez-vous de voyance</p>
                </div>
              </a>

              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${email2}&su=${gmailSubject2}&body=${gmailBody2}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-4 bg-red-600 hover:bg-red-700 text-white p-5 rounded-xl transition shadow-lg hover:scale-105 transform"
              >
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">Email - Support</h3>
                  <p className="text-red-100 text-sm">Questions sur nos packs et tarifs</p>
                </div>
              </a>

              <a
                href={`tel:${voyantPhone}`}
                className="flex items-center space-x-4 bg-amber-500 hover:bg-amber-600 text-white p-5 rounded-xl transition shadow-lg hover:scale-105 transform"
              >
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">Appel Direct</h3>
                  <p className="text-amber-100 text-sm mb-1">Service client disponible 7j/7</p>
                  <p className="text-white font-semibold">{voyantPhone}</p>
                </div>
              </a>
            </div>

            <div className="mt-8 bg-purple-500/20 rounded-xl p-6 border border-purple-500/50">
              <h3 className="text-white font-semibold mb-2 flex items-center space-x-2">
                <Phone className="w-5 h-5 text-amber-400" />
                <span>Horaires d'ouverture</span>
              </h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>Lundi - Vendredi: 9h - 21h</li>
                <li>Samedi - Dimanche: 10h - 20h</li>
                <li className="text-amber-400 font-semibold">Service d'urgence 24/7</li>
              </ul>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-8">Formulaire de Contact</h2>

            {success && (
              <div className="bg-green-500/20 border border-green-500 text-white px-4 py-3 rounded-lg mb-6 flex items-center space-x-2">
                <Send className="w-5 h-5" />
                <span>Message envoyé avec succès ! Nous vous répondrons rapidement.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                  Nom complet
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                  placeholder="Votre nom"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition resize-none"
                  placeholder="Décrivez votre demande..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-4 rounded-lg font-bold text-lg hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-purple-900 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/50 flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>{loading ? 'Envoi en cours...' : 'Envoyer le message'}</span>
              </button>
            </form>

            <p className="text-purple-300 text-sm text-center mt-6">
              Nous répondons généralement dans les 24 heures
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 backdrop-blur-lg rounded-2xl p-8 border border-amber-500/50 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Besoin d'une consultation immédiate ?
          </h3>
          <p className="text-purple-200 mb-6">
            Notre équipe de voyants est disponible 24/7 pour vous accompagner dans vos moments importants
          </p>
          <a
            href={`tel:${voyantPhone}`}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-amber-600 hover:to-amber-700 transition shadow-lg shadow-amber-500/50"
          >
            <Phone className="w-6 h-6" />
            <span>Appeler maintenant</span>
          </a>
        </div>
      </div>
    </div>
  );
}
