import { useEffect } from 'react'

const EmailConfirmationModal = ({ isOpen, onClose, email, isProvider }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
            Cadastro Realizado com Sucesso! 🎉
          </h3>

          {/* Content */}
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Enviamos um email de confirmação para:
            </p>
            <p className="font-semibold text-primary-600 bg-primary-50 px-3 py-2 rounded-lg">
              {email}
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <h4 className="font-semibold text-blue-900 mb-2">📧 Próximos passos:</h4>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Verifique sua caixa de entrada</li>
                <li>Clique no link de confirmação no email</li>
                <li>Faça login na plataforma</li>
                {isProvider && (
                  <li>Crie seus serviços na área "Criar Serviço"</li>
                )}
              </ol>
            </div>

            {isProvider && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>💡 Dica:</strong> Seus serviços só ficarão visíveis após a confirmação do email!
                </p>
              </div>
            )}

            <p className="text-xs text-gray-500">
              Não recebeu o email? Verifique a pasta de spam ou lixo eletrônico.📤
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Entendi
            </button>
            <button
              onClick={() => {
                window.open(`https://${email.split('@')[1]}`, '_blank')
                onClose()
              }}
              className="flex-1 btn-primary"
            >
              Abrir Email
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailConfirmationModal
