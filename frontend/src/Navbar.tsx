import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Navbar() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/login');
    setIsMenuOpen(false);
  }

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-white font-bold text-xl hover:text-blue-100 transition-colors duration-200"
            >
              🐕 DogMatch
            </Link>
          </div>

          {/* Menu Desktop */}
          {token && (
            <div className="hidden md:flex items-center space-x-6">
              <Link 
                to="/pets" 
                className="text-white hover:text-blue-100 transition-colors duration-200 font-medium"
              >
                Meus Pets
              </Link>
              <Link 
                to="/swipe" 
                className="text-white hover:text-blue-100 transition-colors duration-200 font-medium"
              >
                Swipe
              </Link>
              <Link 
                to="/matches" 
                className="text-white hover:text-blue-100 transition-colors duration-200 font-medium"
              >
                Matches
              </Link>
              <Link 
                to="/subscription" 
                className="text-white hover:text-blue-100 transition-colors duration-200 font-medium flex items-center"
              >
                💎 Assinatura
              </Link>
              <Link 
                to="/plans" 
                className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 px-4 py-2 rounded-lg font-bold transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                ⬆️ Upgrade
              </Link>
            </div>
          )}

          {/* Botões de Ação Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {token ? (
              <button 
                onClick={handleLogout}
                className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                Sair
              </button>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-white hover:text-blue-100 transition-colors duration-200 font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  Cadastro
                </Link>
              </div>
            )}
          </div>

          {/* Menu Hambúrguer Mobile */}
          <div className="md:hidden">
            {token ? (
              <button
                onClick={toggleMenu}
                className="text-white hover:text-blue-100 focus:outline-none focus:text-blue-100"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/login" 
                  className="text-white hover:text-blue-100 transition-colors duration-200 font-medium text-sm"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-white text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg text-sm"
                >
                  Cadastro
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Menu Mobile Dropdown */}
        {token && isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-blue-600 bg-opacity-95 rounded-lg mt-2 shadow-lg">
              <Link 
                to="/pets" 
                className="block px-3 py-2 text-white hover:text-blue-100 transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                🐾 Meus Pets
              </Link>
              <Link 
                to="/swipe" 
                className="block px-3 py-2 text-white hover:text-blue-100 transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                👆 Swipe
              </Link>
              <Link 
                to="/matches" 
                className="block px-3 py-2 text-white hover:text-blue-100 transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                💕 Matches
              </Link>
              <Link 
                to="/subscription" 
                className="block px-3 py-2 text-white hover:text-blue-100 transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                💎 Assinatura
              </Link>
              <Link 
                to="/plans" 
                className="block px-3 py-2 bg-yellow-400 text-gray-900 hover:bg-yellow-300 rounded-lg font-bold transition-colors duration-200 shadow-md hover:shadow-lg mx-3 my-2 text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                ⬆️ Upgrade
              </Link>
              <button 
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg mx-3 my-2"
              >
                🚪 Sair
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;