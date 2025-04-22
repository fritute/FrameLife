'use strict'

document.addEventListener('DOMContentLoaded', () => {
    const recuperarSenhaButton = document.getElementById('recuperarSenhaButton')
    const emailInput = document.getElementById('emailInput')
    const wordKeyInput = document.getElementById('wordKeyInput')

    recuperarSenhaButton.addEventListener('click', async () => {
        const email = emailInput.value.trim()
        const wordKey = wordKeyInput.value.trim()

        if (!email || !wordKey) {
            alert('Por favor, preencha todos os campos.')
            return
        }

        try {
            const response = await fetch('https://back-spider.vercel.app/user/RememberPassword', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ 
                    email: email,
                    wordKey: wordKey
                })
            })

            const responseData = await response.json()

            if (!response.ok) {
                throw new Error(responseData.message || 'Erro ao recuperar a senha')
            }

            if (responseData.senha) {
                mostrarSenha(responseData.senha)
            } else {
                mostrarMensagem(responseData.message || 'Senha recuperada com sucesso!')
            }
        } catch (error) {
            console.error('Erro:', error)
            alert(error.message || 'Erro ao recuperar a senha. Verifique os dados e tente novamente.')
        }
    })

    function mostrarSenha(senha) {
        document.body.innerHTML = `
            <div id="nova-tela">
                <h1>SUA SENHA É:</h1>
                <p>${senha}</p>
                <button id="voltarButton">Voltar</button>
            </div>
        `
        document.getElementById('voltarButton').addEventListener('click', () => window.location.reload())
    }

    function mostrarMensagem(mensagem) {
        document.body.innerHTML = `
            <div id="nova-tela">
                <h1>${mensagem}</h1>
                <button id="voltarButton">Voltar</button>
            </div>
        `
        document.getElementById('voltarButton').addEventListener('click', () => window.location.reload())
    }
})