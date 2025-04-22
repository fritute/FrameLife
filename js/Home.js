'use strict'

const apiUrl = 'https://back-spider.vercel.app/publicacoes'
const apiUrlUsuarios = 'https://back-spider.vercel.app/user/listarUsers'
const publicacoesContainer = document.getElementById('publicacoes-container')
const modal = document.getElementById('modal')
const modalForm = document.getElementById('modal-form')
let currentPostId = null
let usuarios = []
let usuarioLogado = null // Armazena os dados do usuário logado

// Função para carregar o usuário logado
const carregarUsuarioLogado = async () => {
    try {
        const response = await fetch('https://back-spider.vercel.app/user/getUser')
        if (!response.ok) throw new Error('Erro ao buscar dados do usuário logado')
        usuarioLogado = await response.json()
    } catch (error) {
        console.error('Erro ao carregar o usuário logado:', error)
    }
}

// Função para carregar usuários
const carregarUsuarios = async () => {
    try {
        const response = await fetch(apiUrlUsuarios)
        if (!response.ok) throw new Error('Erro ao carregar usuários')
        usuarios = await response.json()
    } catch (error) {
        console.error('Erro ao carregar usuários:', error)
    }
}

// Função para carregar publicações
const carregarPublicacoes = async () => {
    try {
        const response = await fetch(`${apiUrl}/listarPublicacoes`)
        if (!response.ok) throw new Error('Erro ao carregar publicações')
        const publicacoes = await response.json()
        publicacoesContainer.replaceChildren()
        publicacoes.forEach(criarPublicacao)
    } catch (error) {
        console.error('Erro ao carregar publicações:', error)
        publicacoesContainer.textContent = 'Erro ao carregar publicações.'
    }
}

// Função para criar uma publicação no DOM
const criarPublicacao = ({ id, descricao, dataPublicacao, imagem, local, idUsuario, comentarios = [], curtidas = [] }) => {
    const publicacao = document.createElement('div')
    publicacao.classList.add('publicacao')
    publicacao.dataset.id = id

    const titulo = document.createElement('h2')
    titulo.textContent = descricao
    publicacao.appendChild(titulo)

    const detalhes = document.createElement('p')
    detalhes.textContent = `📍 ${local} | ${new Date(dataPublicacao).toLocaleDateString('pt-BR')}`
    publicacao.appendChild(detalhes)

    if (imagem) {
        const img = document.createElement('img')
        img.src = imagem
        img.alt = 'Imagem da publicação'
        img.classList.add('imagem')
        publicacao.appendChild(img)
    }

    const footer = document.createElement('div')
    footer.classList.add('post-footer')

    const likeButton = document.createElement('button')
    likeButton.classList.add('like-button')
    likeButton.textContent = `${curtidas.length} ❤️`
    likeButton.addEventListener('click', () => darLike(id, likeButton))
    footer.appendChild(likeButton)

    const commentButton = document.createElement('button')
    commentButton.classList.add('comment-button')
    commentButton.textContent = '💬 Comentar'
    commentButton.addEventListener('click', () => toggleComentarios(id))
    footer.appendChild(commentButton)

    if (usuarioLogado && idUsuario === usuarioLogado.id) {
        const editButton = document.createElement('button')
        editButton.classList.add('edit-button')
        editButton.textContent = '✏️ Editar'
        editButton.addEventListener('click', () => abrirModal(id))
        footer.appendChild(editButton)

        const deleteButton = document.createElement('button')
        deleteButton.classList.add('delete-button')
        deleteButton.textContent = '🗑️ Excluir'
        deleteButton.addEventListener('click', () => deletarPublicacao(id))
        footer.appendChild(deleteButton)
    }

    publicacao.appendChild(footer)

    const commentsContainer = document.createElement('div')
    commentsContainer.classList.add('comments-container')
    commentsContainer.id = `comments-${id}`
    commentsContainer.style.display = 'none'

    comentarios.forEach(({ idUsuario, descricao }) => {
        const comment = document.createElement('div')
        comment.classList.add('comment')

        const strong = document.createElement('strong')
        strong.textContent = `${getNomeUsuario(idUsuario)}: `
        comment.appendChild(strong)

        const span = document.createElement('span')
        span.textContent = descricao
        comment.appendChild(span)

        commentsContainer.appendChild(comment)
    })

    const commentForm = document.createElement('form')
    commentForm.addEventListener('submit', (event) => enviarComentario(event, id))

    const input = document.createElement('input')
    input.type = 'text'
    input.placeholder = 'Digite seu comentário...'
    input.required = true
    commentForm.appendChild(input)

    const submitButton = document.createElement('button')
    submitButton.type = 'submit'
    submitButton.textContent = 'Enviar'
    commentForm.appendChild(submitButton)

    commentsContainer.appendChild(commentForm)
    publicacao.appendChild(commentsContainer)

    publicacoesContainer.appendChild(publicacao)
}

// Função para obter o nome do usuário pelo ID
const getNomeUsuario = (idUsuario) => {
    const usuario = usuarios.find(user => user.id === idUsuario)
    return usuario ? usuario.nome : 'Usuário desconhecido'
}

// Função para dar like
const darLike = async (id, button) => {
    if (!usuarioLogado) {
        alert('Você precisa estar logado para curtir.')
        return
    }

    try {
        const response = await fetch(`${apiUrl}/likePublicacao/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idUsuario: usuarioLogado.id })
        })
        if (!response.ok) throw new Error('Erro ao dar like')
        const curtidas = parseInt(button.textContent) + 1
        button.textContent = `${curtidas} ❤️`
    } catch (error) {
        console.error('Erro ao dar like:', error)
        alert('Erro ao curtir a publicação.')
    }
}

// Função para enviar comentário
const enviarComentario = async (event, id) => {
    event.preventDefault()
    if (!usuarioLogado) {
        alert('Você precisa estar logado para comentar.')
        return
    }

    const input = event.target.querySelector('input')
    try {
        const response = await fetch(`${apiUrl}/commentPublicacao/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ descricao: input.value, idUsuario: usuarioLogado.id })
        })
        if (!response.ok) throw new Error('Erro ao enviar comentário')
        carregarPublicacoes()
    } catch (error) {
        console.error('Erro ao enviar comentário:', error)
        alert('Erro ao enviar comentário.')
    }
}

// Função para abrir o modal de edição
const abrirModal = (id) => {
    currentPostId = id
    const publicacao = document.querySelector(`.publicacao[data-id="${id}"]`)
    document.getElementById('modal-descricao').value = publicacao.querySelector('h2').textContent
    document.getElementById('modal-imagem').value = publicacao.querySelector('img')?.src || ''
    document.getElementById('modal-local').value = publicacao.querySelector('.post-local')?.textContent || ''
    modal.style.display = 'flex' // Exibe o modal
}

// Função para fechar o modal
const fecharModal = () => {
    modal.style.display = 'none' // Oculta o modal
}

// Fecha o modal ao clicar no botão "X"
document.getElementById('modal-close').addEventListener('click', fecharModal)

// Fecha o modal ao clicar fora do conteúdo
if (modal) {
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            fecharModal()
        }
    })
}

// Alterna a visibilidade dos comentários
const toggleComentarios = (id) => {
    const container = document.getElementById(`comments-${id}`)
    container.style.display = container.style.display === 'none' ? 'block' : 'none'
}

// Inicialização
(async () => {
    await carregarUsuarioLogado()
    await carregarUsuarios()
    carregarPublicacoes()
})()