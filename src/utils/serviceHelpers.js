import { supabase } from './supabase'

/**
 * Cria um serviço para um usuário
 * @param {Object} serviceData - Dados do serviço
 * @param {string} serviceData.user_id - ID do usuário
 * @param {string} serviceData.title - Título do serviço
 * @param {string} serviceData.description - Descrição do serviço
 * @param {string} serviceData.category - Categoria do serviço
 * @param {string} serviceData.experience - Experiência do prestador
 * @param {string} serviceData.contact_phone - Telefone de contato
 * @param {string} serviceData.contact_email - Email de contato
 * @returns {Promise<{data: any, error: any}>}
 */
export const createService = async (serviceData) => {
  try {
    // Verificar se o usuário está autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { data: null, error: { message: 'Usuário não autenticado' } }
    }

    // Verificar se o user_id corresponde ao usuário autenticado
    if (serviceData.user_id !== user.id) {
      return { data: null, error: { message: 'Não autorizado' } }
    }

    // Verificar se o usuário tem email confirmado
    const userActive = user.email_confirmed_at !== null

    const { data, error } = await supabase
      .from('services')
      .insert({
        ...serviceData,
        user_active: userActive,
        is_active: true
      })
      .select()

    return { data, error }
  } catch (error) {
    console.error('Erro ao criar serviço:', error)
    return { data: null, error }
  }
}

/**
 * Atualiza o status de ativação de todos os serviços de um usuário
 * @param {string} userId - ID do usuário
 * @param {boolean} isActive - Status de ativação
 * @returns {Promise<{data: any, error: any}>}
 */
export const updateUserServicesActiveStatus = async (userId, isActive) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .update({ user_active: isActive })
      .eq('user_id', userId)
      .select()

    return { data, error }
  } catch (error) {
    console.error('Erro ao atualizar status dos serviços:', error)
    return { data: null, error }
  }
}

/**
 * Busca serviços com filtros
 * @param {Object} filters - Filtros de busca
 * @param {string} filters.searchTerm - Termo de busca
 * @param {string} filters.category - Categoria
 * @param {boolean} filters.includeInactive - Incluir serviços de usuários inativos (apenas para admin)
 * @returns {Promise<{data: any, error: any}>}
 */
export const getServices = async (filters = {}) => {
  try {
    let query = supabase
      .from('services')
      .select(`
        *,
        profiles:user_id (
          name,
          phone
        )
      `)
      .eq('is_active', true)

    // Por padrão, mostrar apenas serviços de usuários ativos
    if (!filters.includeInactive) {
      query = query.eq('user_active', true)
    }

    // Aplicar filtro de categoria
    if (filters.category && filters.category !== 'Todos') {
      query = query.eq('category', filters.category)
    }

    // Aplicar filtro de busca
    if (filters.searchTerm) {
      query = query.or(`title.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    return { data: data || [], error }
  } catch (error) {
    console.error('Erro ao buscar serviços:', error)
    return { data: [], error }
  }
}
