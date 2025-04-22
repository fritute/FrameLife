document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('formUsuario')

    // Função para carregar o usuário logado do localStorage
    const carregarUsuarioLogado = () => {
        const usuario = localStorage.getItem('usuarioLogado')
        if (usuario) {
            try {
                return JSON.parse(usuario)
            } catch (error) {
                console.error('Erro ao analisar os dados do usuário logado:', error)
                localStorage.removeItem('usuarioLogado') // Remove dados inválidos
            }
        }
        return null
    }

    const usuarioLogado = carregarUsuarioLogado()

    if (!usuarioLogado) {
        alert('Nenhum usuário logado encontrado. Redirecionando para a tela de login.')
        window.location.href = '../src/index.html' // Redireciona para a tela de login
        return
    }

    try {
        // Busca todos os usuários no endpoint
        const response = await fetch('https://back-spider.vercel.app/user/listarUsers')
        if (!response.ok) throw new Error('Erro ao buscar usuários')

        const usuarios = await response.json()

        // Filtra o usuário logado com base no ID
        const usuarioAtual = usuarios.find(user => user.id === usuarioLogado.id)

        if (!usuarioAtual) {
            alert('Usuário logado não encontrado na base de dados.')
            window.location.href = '../src/index.html' // Redireciona para a tela de login
            return
        }

        // Preenche o formulário com os dados do usuário logado
        document.getElementById('nome').value = usuarioAtual.nome || ''
        document.getElementById('email').value = usuarioAtual.email || ''
        document.getElementById('imagemPerfil').value = usuarioAtual.imagemPerfil || ''
        document.getElementById('senhaRecuperacao').value = usuarioAtual.senhaRecuperacao || ''

        // Submissão do formulário de edição
        form.addEventListener('submit', async (e) => {
            e.preventDefault()

            const nome = document.getElementById('nome').value
            const email = document.getElementById('email').value
            const imagemPerfil = document.getElementById('imagemPerfil').value
            const senhaRecuperacao = document.getElementById('senhaRecuperacao').value

            const payload = {
                nome,
                email,
                imagemPerfil,
                senhaRecuperacao
            }

            try {
                // Atualiza os dados do usuário logado na API
                const updateResponse = await fetch(`https://back-spider.vercel.app/user/atualizarUser/${usuarioAtual.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                })

                if (!updateResponse.ok) throw new Error('Erro ao atualizar usuário')

                // Atualiza os dados no localStorage com os dados retornados pela API
                const data = await updateResponse.json()
                localStorage.setItem('usuarioLogado', JSON.stringify({ ...usuarioAtual, ...data }))

                alert('Usuário atualizado com sucesso!')

                // Redireciona para a tela de perfil
                window.location.href = '../src/perfil.html'
            } catch (error) {
                alert('Erro ao atualizar usuário: ' + error.message)
            }
        })
    } catch (error) {
        console.error('Erro ao carregar os dados do usuário:', error)
        alert('Erro ao carregar os dados do usuário.')
    }
})