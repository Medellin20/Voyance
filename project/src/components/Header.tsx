import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Menu, X, LogOut, User } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-900/95 via-purple-800/95 to-indigo-900/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/50 group-hover:scale-110 transition">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Voyance Étoilée</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-purple-100 hover:text-white transition font-medium">
              Accueil
            </Link>
            <Link to="/packs" className="text-purple-100 hover:text-white transition font-medium">
              Nos Packs
            </Link>
            <Link to="/contact" className="text-purple-100 hover:text-white transition font-medium">
              Contact
            </Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-purple-100">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{user.full_name}</span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 px-4 py-2 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Déconnexion</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-purple-100 hover:text-white transition font-medium"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-amber-600 hover:to-amber-700 transition shadow-lg shadow-amber-500/30"
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-purple-900/98 backdrop-blur-md border-t border-white/10">
          <div className="px-4 py-4 space-y-3">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-purple-100 hover:text-white transition font-medium py-2"
            >
              Accueil
            </Link>
            <Link
              to="/packs"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-purple-100 hover:text-white transition font-medium py-2"
            >
              Nos Packs
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-purple-100 hover:text-white transition font-medium py-2"
            >
              Contact
            </Link>
            {user ? (
              <>
                <div className="flex items-center space-x-2 text-purple-100 py-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{user.full_name}</span>
                </div>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 px-4 py-3 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Déconnexion</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-purple-100 hover:text-white transition font-medium py-2"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-lg font-semibold text-center hover:from-amber-600 hover:to-amber-700 transition shadow-lg shadow-amber-500/30"
                >
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
