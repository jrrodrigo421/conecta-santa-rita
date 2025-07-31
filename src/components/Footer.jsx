const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CS</span>
              </div>
              <span className="text-xl font-bold">Conecta Santa Rita</span>
            </div>
            <p className="text-gray-300 mb-4">
              Conectando pessoas que precisam de serviços locais com prestadores 
              qualificados em Santa Rita do Sapucaí.
            </p>
            <p className="text-gray-400 text-sm">
              © 2024 Conecta Santa Rita. Todos os direitos reservados.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Links Úteis</h3>
            <ul className="space-y-2">
              <li>
                <a href="/servicos" className="text-gray-300 hover:text-white transition-colors">
                  Serviços
                </a>
              </li>
              <li>
                <a href="/cadastro" className="text-gray-300 hover:text-white transition-colors">
                  Cadastrar Serviço
                </a>
              </li>
              <li>
                <a href="/sobre" className="text-gray-300 hover:text-white transition-colors">
                  Sobre Nós
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Santa Rita do Sapucaí - MG</li>
              <li>contato@conectasantarita.com</li>
              <li>(35) 9999-9999</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
