import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Header = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CS</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                Conecta Santa Rita
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/servicos" 
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Serviços
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">
                  Olá, {user.user_metadata?.name || user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="btn-secondary"
                >
                  Sair
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Entrar
                </Link>
                <Link 
                  to="/cadastro" 
                  className="btn-primary"
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </nav>

          {/* Menu mobile */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-gray-900">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
