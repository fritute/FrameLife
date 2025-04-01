'use strict'

document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://back-spider.vercel.app/publicacoes/deletarPublicacao'
    const formulario = document.getElementById('deletar-postagem-form')

    if (!formulario) {
        alert('Formulário não encontrado no DOM.')
        return
    }

    formulario.addEventListener('submit', async (event) => {
        event.preventDefault()

        const idInput = document.getElementById('id')
        if (!idInput) {
            alert('Campo de ID não encontrado no formulário.')
            return
        }

        const id = idInput.value // Captura o ID da postagem

        try {
            const response = await fetch(`${apiUrl}/${id}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                throw new Error('Erro ao deletar publicação')
            }

            alert('Publicação deletada com sucesso!')
            window.location.href = '../src/home.html' // Redireciona para a página inicial
        } catch (error) {
            alert('Erro ao deletar publicação.')
        }
    })
})