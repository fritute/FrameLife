'use strict';

document.addEventListener('DOMContentLoaded', async () => {
    // Configurações
    const USER_ID = 1; // ID do usuário logado
    const API_BASE_URL = 'https://back-spider.vercel.app';
    const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=Usuario&background=0D8ABC&color=fff';

    // Elementos da página
    const elements = {
        nomeUsuario: document.getElementById('nome-usuario'),
        emailUsuario: document.getElementById('email-usuario'),
        fotoPerfil: document.getElementById('foto-perfil'),
        listaPublicacoes: document.getElementById('lista-publicacoes'),
        perfilContainer: document.getElementById('perfil-container')
    };

    // Mapa de usuários para armazenar nomes e fotos
    let usuariosMap = {};

    // Função para exibir erro
    function showError(message) {
        console.error(message);
        elements.perfilContainer.innerHTML = `
            <div class="error">
                <h3>Erro ao carregar perfil</h3>
                <p>${message}</p>
            </div>
        `;
    }

    // Carregar dados dos usuários
    async function carregarUsuarios() {
        try {
            const response = await fetch(`${API_BASE_URL}/user/listarUsers`);
            if (!response.ok) throw new Error('Erro ao carregar usuários');
           
            const usuarios = await response.json();
            usuarios.forEach(usuario => {
                usuariosMap[usuario.id] = {
                    nome: usuario.nome,
                    foto: usuario.imagemPerfil || DEFAULT_AVATAR
                };
            });
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
        }
    }

    // Função para exibir interações (curtidas/comentários)
    function exibirInteracoes(post) {
        return `
            <div class="post-interactions">
                <span class="likes-count">
                    <span class="heart-icon">❤️</span>
                    ${post.curtidas?.length || 0}
                </span>
                <span class="comments-toggle" onclick="toggleComentarios(${post.id})">
                    <span class="comment-icon">💬</span>
                    ${post.comentarios?.length || 0}
                </span>
            </div>
            <div id="comentarios-${post.id}" class="comentarios-container" style="display:none">
                ${post.comentarios?.length ? gerarComentarios(post.comentarios) : '<p class="sem-comentarios">Nenhum comentário</p>'}
            </div>
        `;
    }

    // Função para gerar HTML dos comentários
    function gerarComentarios(comentarios) {
        return comentarios.map(comentario => {
            const usuario = usuariosMap[comentario.idUsuario] || {
                nome: `Usuário ${comentario.idUsuario}`,
                foto: DEFAULT_AVATAR
            };
           
            return `
                <div class="comentario">
                    <div class="comentario-header">
                        <img src="${usuario.foto}" alt="${usuario.nome}" class="comentario-avatar">
                        <span class="comentario-autor">${usuario.nome}</span>
                    </div>
                    <div class="comentario-texto">${comentario.descricao}</div>
                </div>
            `;
        }).join('');
    }

    // Função global para alternar comentários
    window.toggleComentarios = function(postId) {
        const container = document.getElementById(`comentarios-${postId}`);
        if (container.style.display === 'none') {
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
        }
    };

    // Função principal para carregar publicações
    async function carregarPublicacoes() {
        try {
            // Primeiro carrega os usuários
            await carregarUsuarios();
           
            // Buscar publicações
            const postsResponse = await fetch(`${API_BASE_URL}/publicacoes/listarPublicacoes`);
            if (!postsResponse.ok) throw new Error('Erro ao carregar publicações');
           
            const allPosts = await postsResponse.json();
            const publicacoes = allPosts.filter(post => post.idUsuario == USER_ID);

            // Exibir publicações
            elements.listaPublicacoes.innerHTML = publicacoes.length === 0
                ? '<p class="no-posts">Nenhuma publicação encontrada.</p>'
                : publicacoes.map(post => `
                    <div class="post" id="post-${post.id}">
                        <div class="post-header">
                            <span class="post-date">${new Date(post.dataPublicacao).toLocaleDateString('pt-BR')}</span>
                            ${post.local ? `<span class="post-location">📍 ${post.local}</span>` : ''}
                        </div>
                       
                        ${post.imagem ? `
                        <div class="post-image-container">
                            <img src="${post.imagem}" alt="Publicação" class="post-image">
                        </div>` : ''}
                       
                        <div class="post-content">${post.descricao}</div>
                       
                        <!-- Seção de Interações -->
                        ${exibirInteracoes(post)}
                    </div>
                `).join('');

        } catch (error) {
            console.error('Erro:', error);
            showError('Falha ao carregar publicações');
        }
    }

    // Inicialização
    try {
        // Carregar dados do usuário atual
        const userResponse = await fetch(`${API_BASE_URL}/user/listarUsers`);
        if (userResponse.ok) {
            const users = await userResponse.json();
            const usuario = users.find(u => u.id == USER_ID);
            if (usuario) {
                elements.nomeUsuario.textContent = usuario.nome;
                elements.emailUsuario.textContent = usuario.email;
                elements.fotoPerfil.src = usuario.imagemPerfil || DEFAULT_AVATAR;
            }
        }

        // Carregar publicações
        carregarPublicacoes();

    } catch (error) {
        console.error('Erro:', error);
        showError('Falha ao carregar perfil');
    }
});
