'use strict'

document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://back-spider.vercel.app/publicacoes/cadastrarPublicacao'
    const formulario = document.getElementById('nova-postagem-form')

    formulario.addEventListener('submit', async (event) => {
        event.preventDefault()

        
        const agora = new Date()
        const dataPublicacao = `${agora.getDate().toString().padStart(2, '0')}/${(agora.getMonth() + 1).toString().padStart(2, '0')}/${agora.getFullYear()}`
        const horarioPublicacao = `${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')}`

        const novaPublicacao = {
            descricao: document.getElementById('descricao').value,
            dataPublicacao: `${dataPublicacao} ${horarioPublicacao}`, 
            imagem: document.getElementById('imagem').value,
            local: document.getElementById('local').value,
            idUsuario: 2 
        }

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(novaPublicacao),
            })

            if (!response.ok) {
                throw new Error('Erro ao cadastrar publicação')
            }

            alert('Publicação cadastrada com sucesso!')
            window.location.href = '../src/home.html' 
        } catch (error) {
    
            alert('Erro ao cadastrar publicação.')
        }
    })
})