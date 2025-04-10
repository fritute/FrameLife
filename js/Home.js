'use strict'

let currentPostId = null // Variável global para armazenar o ID da publicação atual
let usuarioLogado = null // Variável global para armazenar o usuário logado

document.addEventListener('DOMContentLoaded', async () => {
    const apiUrlListarPublicacoes = 'https://back-spider.vercel.app/publicacoes/listarPublicacoes'
    const apiUrlListarUsuarios = 'https://back-spider.vercel.app/user/listarUsers'
    const publicacoesContainer = document.getElementById('publicacoes-container')
    const modal = document.getElementById('modal')
    const modalForm = document.getElementById('modal-form')
    const modalDescricao = document.getElementById('modal-descricao')
    const modalImagem = document.getElementById('modal-imagem')
    const modalLocal = document.getElementById('modal-local')
    const modalClose = document.getElementById('modal-close')

    try {
        // Simula o usuário logado (substitua isso com a lógica real de login)
        usuarioLogado = {
            id: 2, // ID do usuário logado (exemplo: Gustavo)
            nome: 'Gustavo'
        }

        // Busca as publicações
        const responsePublicacoes = await fetch(apiUrlListarPublicacoes)
        if (!responsePublicacoes.ok) {
            throw new Error('Erro ao buscar publicações')
        }
        const publicacoes = await responsePublicacoes.json()

        // Busca os usuários
        const responseUsuarios = await fetch(apiUrlListarUsuarios)
        if (!responseUsuarios.ok) {
            throw new Error('Erro ao buscar usuários')
        }
        const usuarios = await responseUsuarios.json()

        // Exibe todas as publicações retornadas pela API
        if (publicacoes.length > 0) {
            publicacoes.forEach(publicacao => {
                const usuario = usuarios.find(user => user.id === publicacao.idUsuario) // Associa o usuário à publicação
                const publicacaoElement = criarPublicacao(publicacao, usuario)
                publicacoesContainer.appendChild(publicacaoElement)
            })
        } else {
            publicacoesContainer.innerHTML = '<p>Nenhuma publicação encontrada.</p>'
        }
    } catch (error) {
        console.error('Erro ao carregar publicações ou usuários:', error)
        publicacoesContainer.innerHTML = '<p>Erro ao carregar publicações ou usuários.</p>'
    }

    // Evento para fechar o modal ao clicar no botão "X"
    modalClose.addEventListener('click', () => {
        modal.style.display = 'none'
    })

    // Evento de envio do formulário do modal
    modalForm.addEventListener('submit', async (event) => {
        event.preventDefault()

        const atualizacao = {
            descricao: modalDescricao.value,
            imagem: modalImagem.value,
            local: modalLocal.value
        }

        if (currentPostId) {
            await atualizarPublicacao(currentPostId, atualizacao)
            modal.style.display = 'none' // Fecha o modal após a atualização
        }
    })
})

function criarPublicacao(publicacao, usuario) {
    const container = document.createElement('div')
    container.classList.add('publicacao')

    const titulo = document.createElement('h2')
    titulo.textContent = publicacao.descricao // Exibe a descrição como título
    container.appendChild(titulo)

    const conteudo = document.createElement('p')
    conteudo.textContent = `Local: ${publicacao.local} | Data: ${publicacao.dataPublicacao}`
    container.appendChild(conteudo)

    if (usuario) {
        const usuarioInfo = document.createElement('p')
        usuarioInfo.textContent = `Postado por: ${usuario.nome}` 
        usuarioInfo.classList.add('usuario-info')
        container.appendChild(usuarioInfo)
    }

    if (usuarioLogado) {
        const logadoInfo = document.createElement('p')
        logadoInfo.textContent = `Você está logado como: ${usuarioLogado.nome}`
        logadoInfo.classList.add('logado-info')
        container.appendChild(logadoInfo)
    }

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
    lapis.addEventListener('click', () => abrirModal(publicacao))
    container.appendChild(lapis)

    // Botão de lixeira para deletar a publicação
    const lixeira = document.createElement('button')
    lixeira.textContent = '🗑️' 
    lixeira.classList.add('lixeira')
    lixeira.addEventListener('click', () => deletarPublicacao(publicacao.id))
    container.appendChild(lixeira)

    return container
}

function abrirModal(publicacao) {
    const modal = document.getElementById('modal')
    const modalDescricao = document.getElementById('modal-descricao')
    const modalImagem = document.getElementById('modal-imagem')
    const modalLocal = document.getElementById('modal-local')

    // Preenche os campos do modal com os dados da publicação
    modalDescricao.value = publicacao.descricao
    modalImagem.value = publicacao.imagem
    modalLocal.value = publicacao.local

    // Define o ID da publicação atual
    currentPostId = publicacao.id

    // Exibe o modal
    modal.style.display = 'block'
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

async function deletarPublicacao(id) {
    const apiUrlDeletar = `https://back-spider.vercel.app/publicacoes/deletarPublicacao/${id}`

    if (!confirm('Tem certeza que deseja deletar esta publicação?')) {
        return
    }

    try {
        const response = await fetch(apiUrlDeletar, {
            method: 'DELETE',
        })

        if (!response.ok) {
            throw new Error('Erro ao deletar publicação')
        }

        alert('Publicação deletada com sucesso!')
        window.location.reload() // Recarrega a página para atualizar a lista
    } catch (error) {
        alert('Erro ao deletar publicação.')
    }
}