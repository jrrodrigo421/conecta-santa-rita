import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getServices } from '../utils/serviceHelpers'

const Servicos = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const { user } = useAuth()

  const categories = [
    'Todos',
    'Limpeza',
    'Jardinagem',
    'Elétrica',
    'Encanamento',
    'Pintura',
    'Informática',
    'Aulas Particulares',
    'Outros'
  ]

  useEffect(() => {
    fetchServices()
  }, [searchTerm, selectedCategory])

  const fetchServices = async () => {
    setLoading(true)
    try {
      const filters = {
        searchTerm,
        category: selectedCategory
      }
      
      const { data, error } = await getServices(filters)
      
      if (error) {
        console.error('Erro ao buscar serviços:', error)
      } else {
        setServices(data)
      }
    } catch (error) {
      console.error('Erro ao buscar serviços:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredServices = services.filter(service => {
    const matchesSearch = !searchTerm || 
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = !selectedCategory || 
      selectedCategory === 'Todos' || 
      service.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando serviços...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Serviços Disponíveis
          </h1>
          <p className="text-lg text-gray-600">
            Encontre o profissional ideal para suas necessidades
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Buscar serviços
              </label>
              <input
                type="text"
                id="search"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Digite o que você procura..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                id="category"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category === 'Todos' ? '' : category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Serviços */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum serviço encontrado
            </h3>
            <p className="text-gray-600">
              Tente ajustar os filtros ou buscar por outros termos.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div key={service.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {service.title}
                      </h3>
                      <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                        {service.category}
                      </span>
                    </div>
                    {/* Indicador de status do usuário */}
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full ${service.user_active ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                      <span className={`ml-1 text-xs ${service.user_active ? 'text-green-600' : 'text-yellow-600'}`}>
                        {service.user_active ? 'Verificado' : 'Pendente'}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {service.description}
                  </p>
                  
                  {service.experience && (
                    <p className="text-sm text-gray-500 mb-4">
                      <span className="font-medium">Experiência:</span> {service.experience}
                    </p>
                  )}
                  
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-gray-900 mb-2">
                      {service.profiles?.name || 'Nome não disponível'}
                    </p>
                    
                    {user ? (
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Telefone:</span> {service.contact_phone}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Email:</span> {service.contact_email}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-md p-3">
                        <p className="text-sm text-gray-600 text-center">
                          <a href="/login" className="text-primary-600 hover:text-primary-500 font-medium">
                            Faça login
                          </a> para ver informações de contato
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Servicos
