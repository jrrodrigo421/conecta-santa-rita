import { Link } from 'react-router-dom'

const LandingPage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Conecta Santa Rita
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Conectando pessoas que precisam de serviços locais com prestadores qualificados
            </p>
            <p className="text-lg mb-8 text-primary-200">
              A plataforma que une quem precisa com quem pode ajudar em Santa Rita do Sapucaí
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/servicos" 
                className="bg-white text-primary-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition-colors duration-200"
              >
                Encontrar Serviços
              </Link>
              <Link 
                to="/cadastro" 
                className="bg-primary-500 hover:bg-primary-400 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
              >
                Oferecer Serviços
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Como Funciona
            </h2>
            <p className="text-xl text-gray-600">
              Simples, rápido e seguro
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">1. Busque</h3>
              <p className="text-gray-600">
                Encontre o serviço que você precisa na nossa plataforma
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">2. Conecte</h3>
              <p className="text-gray-600">
                Entre em contato diretamente com o prestador de serviço
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">3. Contrate</h3>
              <p className="text-gray-600">
                Negocie diretamente e contrate o serviço que precisa
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Categorias de Serviços
            </h2>
            <p className="text-xl text-gray-600">
              Encontre profissionais em diversas áreas
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Limpeza', icon: '🧹' },
              { name: 'Jardinagem', icon: '🌱' },
              { name: 'Elétrica', icon: '⚡' },
              { name: 'Encanamento', icon: '🔧' },
              { name: 'Pintura', icon: '🎨' },
              { name: 'Informática', icon: '💻' },
              { name: 'Aulas', icon: '📚' },
              { name: 'Outros', icon: '🛠️' },
            ].map((category) => (
              <div key={category.name} className="card text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="font-semibold text-gray-900">{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para começar?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Junte-se à nossa comunidade e conecte-se com profissionais locais
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/cadastro" 
              className="bg-white text-primary-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Cadastrar Meu Serviço
            </Link>
            <Link 
              to="/servicos" 
              className="bg-primary-500 hover:bg-primary-400 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Buscar Serviços
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
