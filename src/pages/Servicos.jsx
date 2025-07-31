import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import { useAuth } from '../contexts/AuthContext'

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
  }, [])

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          profiles:user_id (
            name,
            phone
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setServices(data || [])
    } catch (error) {
      console.error('Erro ao buscar serviços:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === '' || selectedCategory === 'Todos' ||
      service.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const ServiceCard = ({ service }) => {
    const showContactInfo = user !== null

    return (
      <div className="card hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {service.title}
            </h3>
            <span className="inline-block bg-primary-100 text-primary-800 text-sm px-3 py-1 rounded-full">
              {service.category}
            </span>
          </div>
        </div>

        <p className="text-gray-600 mb-4">
          {service.description}
        </p>

        {service.experience && (
          <p className="text-sm text-gray-500 mb-4">
            <strong>Experiência:</strong> {service.experience}
          </p>
        )}

        <div className="border-t pt-4">
          {showContactInfo ? (
            <div className="space-y-2">
              <p className="text-sm">
                <strong>Prestador:</strong> {service.profiles?.name || 'Nome não disponível'}
              </p>
              <p className="text-sm">
                <strong>Telefone:</strong> {service.contact_phone}
              </p>
              <p className="text-sm">
                <strong>Email:</strong> {service.contact_email}
              </p>
              <div className="flex space-x-2 mt-4">
                <a
                  href={`tel:${service.contact_phone}`}
                  className="btn-primary text-sm"
                >
                  Ligar
                </a>
                <a
                  href={`mailto:${service.contact_email}`}
                  className="btn-secondary text-sm"
                >
                  Email
                </a>
                <a
                  href={`https://wa.me/55${service.contact_phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                <strong>Faça login para ver as informações de contato</strong>
              </p>
              <p className="text-yellow-600 text-xs mt-1">
                Prestador: {service.profiles?.name || 'Nome disponível após login'}
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

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
            Encontre profissionais qualificados em Santa Rita do Sapucaí
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
                id="search"
                type="text"
                placeholder="Digite o que você procura..."
                className="input-field"
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
                className="input-field"
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

        {/* Aviso para usuários não logados */}
        {!user && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-800">
                  <strong>Informação:</strong> Faça login para ver as informações de contato dos prestadores de serviço.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Lista de serviços */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum serviço encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              Tente ajustar os filtros ou buscar por outros termos.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Servicos
