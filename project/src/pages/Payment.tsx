import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { CreditCard, Building2, Check, ArrowLeft } from 'lucide-react';
import type { Pack } from '../types';

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const pack = location.state?.pack as Pack;
  const [paymentMethod, setPaymentMethod] = useState<'rib' | 'paypal'>('paypal');
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!pack || !user) {
    navigate('/packs');
    return null;
  }

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

  const handlePayment = async () => {
    setLoading(true);

    const { error } = await supabase.from('subscriptions').insert({
      user_id: user.id,
      pack_id: pack.id,
      status: 'pending',
      payment_method: paymentMethod,
    });

    if (!error) {
      const paymentDetails = `Pack: ${pack.name} (${pack.price}€)\nMéthode: ${paymentMethod === 'paypal' ? 'PayPal' : 'Virement bancaire'}`;

      await supabase.from('user_logs').insert({
        user_id: user.id,
        action_type: 'payment',
        email: user.email,
        full_name: user.full_name,
        message: paymentDetails,
      });

      await sendNotification('payment', user.email, user.full_name, undefined, paymentDetails, user.id);

      setShowConfirmation(true);
    }

    setLoading(false);
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 py-32 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/50">
              <Check className="w-10 h-10 text-white" />
            </div>

            <h2 className="text-3xl font-bold text-white mb-4">
              Commande Enregistrée !
            </h2>

            <p className="text-purple-200 mb-6 leading-relaxed">
              Votre commande pour le pack <span className="text-amber-400 font-semibold">{pack.name}</span> a été enregistrée avec succès.
            </p>

            {paymentMethod === 'rib' && (
              <div className="bg-white/10 rounded-xl p-6 mb-6 text-left border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Informations de virement bancaire
                </h3>
                <div className="space-y-2 text-purple-200">
                  <p><span className="text-amber-400 font-semibold">IBAN:</span> FR76 1234 5678 9012 3456 7890 123</p>
                  <p><span className="text-amber-400 font-semibold">BIC:</span> BNPAFRPPXXX</p>
                  <p><span className="text-amber-400 font-semibold">Bénéficiaire:</span> Voyance Étoilée</p>
                  <p><span className="text-amber-400 font-semibold">Montant:</span> {pack.price}€</p>
                  <p><span className="text-amber-400 font-semibold">Référence:</span> {user.email} - {pack.name}</p>
                </div>
                <p className="text-purple-300 text-sm mt-4">
                  Veuillez effectuer le virement et nous vous contacterons dès réception du paiement.
                </p>
              </div>
            )}

            {paymentMethod === 'paypal' && (
              <div className="bg-white/10 rounded-xl p-6 mb-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Paiement PayPal
                </h3>
                <p className="text-purple-200 mb-4">
                  Envoyez votre paiement de <span className="text-amber-400 font-semibold">{pack.price}€</span> à:
                </p>
                <div className="bg-white/10 rounded-lg p-4 mb-4 border border-white/20">
                  <p className="text-amber-400 font-semibold text-lg">
                    paiement@voyance-etoilee.fr
                  </p>
                </div>
                <p className="text-purple-300 text-sm">
                  N'oubliez pas de mentionner votre email ({user.email}) dans le commentaire du paiement.
                </p>
                <a
                  href={`https://www.paypal.com/paypalme/voyanceetoilee/${pack.price}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 bg-[#0070ba] hover:bg-[#005ea6] text-white px-8 py-3 rounded-lg font-semibold transition"
                >
                  Payer avec PayPal
                </a>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={() => navigate('/contact')}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 rounded-lg font-semibold hover:from-amber-600 hover:to-amber-700 transition shadow-lg shadow-amber-500/50"
              >
                Contacter un voyant
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full bg-white/20 hover:bg-white/30 text-white py-3 rounded-lg font-semibold transition border border-white/30"
              >
                Retour à l'accueil
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 py-32 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/packs')}
          className="flex items-center space-x-2 text-purple-200 hover:text-white transition mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour aux packs</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Résumé de la commande</h2>

            <div className="bg-white/10 rounded-xl p-6 mb-6 border border-white/20">
              <h3 className="text-xl font-semibold text-amber-400 mb-2">
                {pack.name}
              </h3>
              <p className="text-purple-200 text-sm mb-4">
                Durée: {pack.duration_months} mois
              </p>

              <ul className="space-y-2 mb-6">
                {pack.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Check className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span className="text-purple-100 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-white/20 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-purple-200 font-semibold">Total:</span>
                  <span className="text-3xl font-bold text-amber-400">{pack.price}€</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-500/20 rounded-xl p-4 border border-amber-500/50">
              <p className="text-amber-100 text-sm leading-relaxed">
                Votre abonnement sera activé dès réception de votre paiement. Vous recevrez un email de confirmation.
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Mode de paiement</h2>

            <div className="space-y-4 mb-8">
              <button
                onClick={() => setPaymentMethod('paypal')}
                className={`w-full p-6 rounded-xl border-2 transition ${
                  paymentMethod === 'paypal'
                    ? 'border-amber-400 bg-white/10'
                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    paymentMethod === 'paypal' ? 'bg-amber-500' : 'bg-white/20'
                  }`}>
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="text-white font-semibold text-lg">PayPal</h3>
                    <p className="text-purple-200 text-sm">Paiement rapide et sécurisé</p>
                  </div>
                  {paymentMethod === 'paypal' && (
                    <Check className="w-6 h-6 text-amber-400" />
                  )}
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod('rib')}
                className={`w-full p-6 rounded-xl border-2 transition ${
                  paymentMethod === 'rib'
                    ? 'border-amber-400 bg-white/10'
                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    paymentMethod === 'rib' ? 'bg-amber-500' : 'bg-white/20'
                  }`}>
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="text-white font-semibold text-lg">Virement bancaire</h3>
                    <p className="text-purple-200 text-sm">Par RIB/IBAN</p>
                  </div>
                  {paymentMethod === 'rib' && (
                    <Check className="w-6 h-6 text-amber-400" />
                  )}
                </div>
              </button>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-4 rounded-lg font-bold text-lg hover:from-amber-600 hover:to-amber-700 transition shadow-lg shadow-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Traitement...' : 'Confirmer la commande'}
            </button>

            <p className="text-purple-300 text-xs text-center mt-4">
              En confirmant, vous acceptez nos conditions générales de vente
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
