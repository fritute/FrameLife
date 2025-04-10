'use strict'

document.addEventListener('DOMContentLoaded', async () => {
    const apiUrlListarPublicacoes = 'https://back-spider.vercel.app/publicacoes/listarPublicacoes'
    const apiUrlAtualizar = 'https://back-spider.vercel.app/publicacoes/atualizarPublicacao'
    const publicacoesContainer = document.getElementById('publicacoes-container')

    try {
        // Busca as publicações
        const responsePublicacoes = await fetch(apiUrlListarPublicacoes)
        if (!responsePublicacoes.ok) {
            throw new Error('Erro ao buscar publicações')
        }
        const publicacoes = await responsePublicacoes.json()

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

    // Ícone de lápis para editar a publicação
    const lapis = document.createElement('button')
    lapis.textContent = '✏️' // Ícone de lápis
    lapis.classList.add('lapis')
    lapis.addEventListener('click', () => abrirFormularioAtualizar(publicacao))
    container.appendChild(lapis)

    return container
}

function abrirFormularioAtualizar(publicacao) {
    const novaDescricao = prompt('Digite a nova descrição:', publicacao.descricao)
    const novaImagem = prompt('Digite a nova URL da imagem:', publicacao.imagem)
    const novoLocal = prompt('Digite o novo local:', publicacao.local)

    if (novaDescricao && novaImagem && novoLocal) {
        atualizarPublicacao(publicacao.id, { descricao: novaDescricao, imagem: novaImagem, local: novoLocal })
    }
}

async function atualizarPublicacao(id, atualizacao) {
    const apiUrlAtualizar = `https://back-spider.vercel.app/publicacoes/atualizarPublicacao/${id}`

    try {
        const response = await fetch(apiUrlAtualizar, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(atualizacao),
        })

        if (!response.ok) {
            throw new Error('Erro ao atualizar publicação')
        }

        alert('Publicação atualizada com sucesso!')
        window.location.reload() // Recarrega a página para atualizar a lista
    } catch (error) {
        alert('Erro ao atualizar publicação.')
    }
}