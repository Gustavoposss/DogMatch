import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <nav style={{
      background: '#4299e1',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 32,
      color: '#fff',
      borderRadius: 8
    }}>
      <div>
        <Link to="/" style={{ color: '#fff', fontWeight: 'bold', textDecoration: 'none', marginRight: 24 }}>
          DogMatch
        </Link>
        {token && (
          <>
            <Link to="/pets" style={{ color: '#fff', marginRight: 16, textDecoration: 'none' }}>Meus Pets</Link>
            <Link to="/swipe" style={{ color: '#fff', marginRight: 16, textDecoration: 'none' }}>Swipe</Link>
            <Link to="/matches" style={{ color: '#fff', marginRight: 16, textDecoration: 'none' }}>Matches</Link>
            {/* Adicione mais links aqui se quiser */}
          </>
        )}
      </div>
      <div>
        {token ? (
          <button onClick={handleLogout} style={{
            background: '#fff',
            color: '#4299e1',
            border: 'none',
            borderRadius: 6,
            padding: '6px 16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            Sair
          </button>
        ) : (
          <>
            <Link to="/login" style={{ color: '#fff', marginRight: 16, textDecoration: 'none' }}>Login</Link>
            <Link to="/register" style={{ color: '#fff', textDecoration: 'none' }}>Cadastro</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;