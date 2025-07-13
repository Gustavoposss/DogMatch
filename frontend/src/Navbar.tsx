import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo e Links */}
          <div className="flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-white font-bold text-xl hover:text-blue-100 transition-colors duration-200"
            >
              🐕 DogMatch
            </Link>
            
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
              </div>
            )}
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center space-x-4">
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
        </div>
      </div>
    </nav>
  );
}

export default Navbar;