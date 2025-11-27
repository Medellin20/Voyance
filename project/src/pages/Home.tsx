import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Star, Sparkles, Moon, Sun, Zap, Shield } from 'lucide-react';
import type { Testimonial } from '../types';

export default function Home() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setTestimonials(data);
    }
  };

  const services = [ 
    {
      icon: Moon,
      title: 'Première consultation gratuite',
      description: 'Consultation offerte pour vous permettre de découvrir nos services',
    },
    {
      icon: Moon,
      title: 'Voyance par Téléphone',
      description: 'Consultations personnalisées avec nos voyants expérimentés',
    },
    {
      icon: Star,
      title: 'Tarot et Cartes',
      description: 'Lecture des tarots pour éclairer votre chemin',
    },
    {
      icon: Sun,
      title: 'Astrologie',
      description: 'Horoscopes personnalisés et études astrologiques complètes',
    },
    {
      icon: Sparkles,
      title: 'Guidance Spirituelle',
      description: 'Accompagnement spirituel pour votre développement personnel',
    },
    {
      icon: Zap,
      title: 'Prédictions Avenir',
      description: 'Révélations sur votre futur et vos possibilités',
    },
    {
      icon: Shield,
      title: 'Protection Énergétique',
      description: 'Conseils pour vous protéger des énergies négatives',
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-amber-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <div className="mb-8 inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full shadow-2xl shadow-amber-500/50 animate-pulse">
            <Sparkles className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Découvrez Votre
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
              Destinée Étoilée
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-purple-200 mb-12 max-w-3xl mx-auto leading-relaxed">
            Consultez nos voyants expérimentés et obtenez des réponses claires à vos questions.
            Votre avenir vous attend.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/packs"
              className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-amber-600 hover:to-amber-700 transition shadow-2xl shadow-amber-500/50 hover:scale-105 transform"
            >
              Découvrir nos packs
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto bg-white/10 backdrop-blur-md text-white border-2 border-white/20 px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition"
            >
              Contacter un voyant
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-4xl font-bold text-amber-400 mb-2">10+</div>
              <p className="text-purple-200">Voyants experts</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-4xl font-bold text-amber-400 mb-2">1000+</div>
              <p className="text-purple-200">Clients satisfaits</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-4xl font-bold text-amber-400 mb-2">24/7</div>
              <p className="text-purple-200">Disponibilité</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-purple-900 mb-4">
              Nos Services
            </h2>
            <p className="text-xl text-purple-700">
              Une guidance spirituelle complète pour éclairer votre chemin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition border border-purple-100 hover:border-purple-300 group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition shadow-lg shadow-purple-500/50">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-purple-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-purple-700 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Témoignages de nos Clients
            </h2>
            <p className="text-xl text-purple-200">
              Plus de 1000 personnes nous font confiance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-purple-100 mb-4 leading-relaxed line-clamp-4">
                  "{testimonial.content}"
                </p>
                <p className="text-amber-400 font-semibold">
                  {testimonial.author_name}
                </p>
              </div>
            ))}
          </div>

          {testimonials.length === 0 && (
            <div className="text-center text-purple-200">
              Chargement des témoignages...
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-purple-900 mb-6">
            Prêt à Découvrir Votre Avenir ?
          </h2>
          <p className="text-xl text-purple-700 mb-10 leading-relaxed">
            Rejoignez des milliers de personnes qui ont trouvé des réponses et une guidance spirituelle avec nos voyants experts.
          </p>
          <Link
            to="/packs"
            className="inline-block bg-gradient-to-r from-amber-500 to-amber-600 text-white px-10 py-5 rounded-full font-bold text-xl hover:from-amber-600 hover:to-amber-700 transition shadow-2xl shadow-amber-500/50 hover:scale-105 transform"
          >
            Choisir mon pack
          </Link>
        </div>
      </section>
    </div>
  );
}
