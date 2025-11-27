import { Link } from 'react-router-dom';
import { Sparkles, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/50">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Voyance Étoilée</span>
            </div>
            <p className="text-purple-200 text-sm leading-relaxed">
              Votre guide spirituel de confiance. Découvrez votre destinée et trouvez les réponses que vous cherchez.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-amber-400">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-purple-200 hover:text-white transition text-sm">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/packs" className="text-purple-200 hover:text-white transition text-sm">
                  Nos Packs
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-purple-200 hover:text-white transition text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-purple-200 hover:text-white transition text-sm">
                  Connexion
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-amber-400">Services</h3>
            <ul className="space-y-2 text-sm text-purple-200">
              <li>Première consultation gratuite</li>
              <li>Voyance par téléphone</li>
              <li>Consultation tarot</li>
              <li>Astrologie personnalisée</li>
              <li>Guidance spirituelle</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-amber-400">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-purple-200">Service Client</p>
                  <a
                    href="tel:+33612345678"
                    className="text-white hover:text-amber-400 transition font-semibold"
                  >
                    +33 6 12 34 56 78
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-purple-200">Email</p>
                  <a
                    href="mailto:contact@voyance-etoilee.fr"
                    className="text-white hover:text-amber-400 transition"
                  >
                    contact@voyance-etoilee.fr
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-purple-200">Paris, France</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <p className="text-purple-300 text-sm text-center md:text-left">
            © 2024 Voyance Étoilée. Tous droits réservés.
          </p>
          <div className="flex items-center space-x-6">
            <a href="#" className="text-purple-300 hover:text-white transition text-sm">
              Mentions légales
            </a>
            <a href="#" className="text-purple-300 hover:text-white transition text-sm">
              Politique de confidentialité
            </a>
            <a href="#" className="text-purple-300 hover:text-white transition text-sm">
              CGV
            </a>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-6 py-3">
            <Phone className="w-5 h-5 text-amber-400" />
            <span className="text-amber-100 font-medium">
              Service client disponible 7j/7 :{' '}
              <a href="tel:+33757751606" className="text-amber-400 hover:text-amber-300 transition">
                +33 7 57 75 16 06
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
