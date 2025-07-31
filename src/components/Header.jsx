import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'

const Header = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CS</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              Conecta Santa Rita
            </span>
            <span className="text-lg font-bold text-gray-900 sm:hidden">
              CS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/servicos" 
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Serviços
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/criar-servico" 
                  className="btn-primary"
                >
                  Criar Serviço
                </Link>
                <span className="text-gray-600 text-sm">
                  Olá, {user.user_metadata?.name || user.email.split('@')[0]}
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

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/servicos" 
                className="text-gray-600 hover:text-primary-600 transition-colors px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Serviços
              </Link>
              
              {user ? (
                <>
                  <Link 
                    to="/criar-servico" 
                    className="text-primary-600 font-medium px-2 py-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Criar Serviço
                  </Link>
                  <div className="px-2 py-1 text-sm text-gray-600">
                    Olá, {user.user_metadata?.name || user.email.split('@')[0]}
                  </div>
                  <button
                    onClick={() => {
                      handleSignOut()
                      setMobileMenuOpen(false)
                    }}
                    className="text-left text-gray-600 hover:text-gray-900 px-2 py-1"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-gray-600 hover:text-primary-600 transition-colors px-2 py-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Entrar
                  </Link>
                  <Link 
                    to="/cadastro" 
                    className="text-primary-600 font-medium px-2 py-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Cadastrar
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
