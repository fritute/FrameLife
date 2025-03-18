'use strict'


const API_URL = 'https://back-spider.vercel.app/login'

// Função para realizar o login
async function login(email, password) {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('Enviando dados para a API:', { email, password })

            const data = {
                email: email,
                senha: password
            }

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data) 
            })

            console.log('Status da resposta:', response.status)

            if (response.ok) {
                const data = await response.json()
                console.log('Dados recebidos:', data)
                showSuccess('Login realizado com sucesso!')
                resolve(data) 
            } else {
                const errorData = await response.json()
                console.error('Erro da API:', errorData)
                showError(errorData.message || 'E-mail ou senha inválidos.') // Exibe a mensagem de erro retornada pela API
                reject(errorData)
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error)
            showError('Erro ao conectar ao servidor.')
            reject(error)
        }
    })
}

// Evento de clique no botão de login
document.getElementById('login-button').addEventListener('click', async () => {
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    if (!email || !password) {
        showError('Por favor, preencha todos os campos.')
        return
    }

    login(email, password)
        .then(data => {
            // Exibe uma caixinha indicando que os dados foram retornados
            showDataBox(`Dados retornados: ${JSON.stringify(data)}`)
        })
        .catch(error => {
            console.error('Erro na promessa:', error)
        })
})

// Função para exibir mensagens de erro
function showError(message) {
    const errorMessage = document.getElementById('error-message')
    errorMessage.textContent = message
    errorMessage.style.display = 'block'
    errorMessage.style.color = 'red'
}

