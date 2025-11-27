import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Check, Crown } from 'lucide-react';
import type { Pack } from '../types';

export default function Packs() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadPacks();
  }, []);

  const loadPacks = async () => {
    const { data } = await supabase
      .from('packs')
      .select('*')
      .order('price', { ascending: true });

    if (data) {
      setPacks(data);
    }
    setLoading(false);
  };

  const handleSelectPack = (pack: Pack) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/payment', { state: { pack } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Chargement des packs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Choisissez Votre Pack
          </h1>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            Sélectionnez l'offre qui correspond à vos besoins spirituels et commencez votre voyage vers la découverte de votre destinée.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {packs.map((pack) => (
            <div
              key={pack.id}
              className={`relative bg-white/10 backdrop-blur-lg rounded-2xl border-2 overflow-hidden transition hover:scale-105 hover:shadow-2xl ${
                pack.popular
                  ? 'border-amber-400 shadow-2xl shadow-amber-500/30'
                  : 'border-white/20'
              }`}
            >
              {pack.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-center py-2 font-semibold text-sm flex items-center justify-center space-x-1">
                  <Crown className="w-4 h-4" />
                  <span>PLUS POPULAIRE</span>
                </div>
              )}

              <div className={`p-8 ${pack.popular ? 'pt-14' : ''}`}>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {pack.name}
                </h3>

                <div className="mb-6">
                  <span className="text-5xl font-bold text-amber-400">
                    {pack.price}€
                  </span>
                  <span className="text-purple-200 ml-2">
                    / {pack.duration_months} mois
                  </span>
                </div>

                <ul className="space-y-3 mb-8">
                  {pack.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span className="text-purple-100 text-sm leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPack(pack)}
                  className={`w-full py-4 rounded-lg font-bold text-lg transition ${
                    pack.popular
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/50'
                      : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                  }`}
                >
                  Choisir ce pack
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-4 text-center">
            Tous nos packs incluent
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <Check className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
              <span className="text-purple-100">Satisfaction garantie</span>
            </div>
            <div className="flex items-start space-x-3">
              <Check className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
              <span className="text-purple-100">Voyants certifiés et expérimentés</span>
            </div>
            <div className="flex items-start space-x-3">
              <Check className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
              <span className="text-purple-100">Confidentialité absolue</span>
            </div>
            <div className="flex items-start space-x-3">
              <Check className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
              <span className="text-purple-100">Service client disponible 7j/7</span>
            </div>
          </div>
        </div>

        {!user && (
          <div className="mt-12 text-center">
            <p className="text-purple-200 mb-4">
              Vous devez être connecté pour choisir un pack
            </p>
            <Link
              to="/login"
              className="inline-block bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-lg font-semibold transition border border-white/30"
            >
              Se connecter
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
