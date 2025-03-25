async function cadastrarUser(data) {
    try {
        const response = await fetch('URL_DA_API', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            throw new Error('Network response was not ok')
        }

        const result = await response.json()
        console.log('Resultado do cadastro:', result)
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error)
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const button = document.getElementById('botaoCadastrar')
    if (button) {
        button.addEventListener('click', function (event) {
            event.preventDefault() // Evita o comportamento padrão do botão

            const emailInput = document.getElementById('email')
            const nomeInput = document.getElementById('nome')
            const senhaInput = document.getElementById('senha')

            if (emailInput && nomeInput && senhaInput) {
                const userData = {
                    email: emailInput.value,
                    nome: nomeInput.value,
                    senha: senhaInput.value,
                }
                console.log('Dados do usuário:', userData)
                cadastrarUser(userData)
            } else {
                console.error('Um ou mais campos não foram encontrados no DOM.')
            }
        })
    } else {
        console.error('Botão de cadastro não encontrado no DOM.')
    }
})