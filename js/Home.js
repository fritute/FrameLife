'use strict'

document.addEventListener('DOMContentLoaded', async () => {
    const apiUrl = 'https://back-spider.vercel.app/publicacoes/listarPublicacoes'
    const publicacoesContainer = document.getElementById('publicacoes-container')

    try {
        const response = await fetch(apiUrl)
        if (!response.ok) {
            throw new Error('Erro ao buscar publicações')
        }

        const publicacoes = await response.json()

        // Exibe todas as publicações retornadas pela API
        if (publicacoes.length > 0) {
            publicacoes.forEach(publicacao => {
                const publicacaoElement = criarPublicacao(publicacao)
                publicacoesContainer.appendChild(publicacaoElement)
            })
        } else {
            publicacoesContainer.innerHTML = '<p>Nenhuma publicação encontrada.</p>'
        }
    } catch (error) {
        console.error('Erro ao carregar publicações:', error)
        publicacoesContainer.innerHTML = '<p>Erro ao carregar publicações.</p>'
    }
})

function criarPublicacao(publicacao) {
    const container = document.createElement('div')
    container.classList.add('publicacao')

    const titulo = document.createElement('h2')
    titulo.textContent = publicacao.descricao // Exibe a descrição como título
    container.appendChild(titulo)

    const conteudo = document.createElement('p')
    conteudo.textContent = `Local: ${publicacao.local} | Data: ${publicacao.dataPublicacao}`
    container.appendChild(conteudo)

    if (publicacao.imagem) {
        const imagem = document.createElement('img')
        imagem.src = publicacao.imagem
        imagem.alt = 'Imagem da publicação'
        imagem.classList.add('imagem') // Classe para estilizar a imagem
        container.appendChild(imagem)
    }

    return container
}