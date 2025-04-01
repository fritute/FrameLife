'use strict'

document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('formulario');
    const inputPalavraChave = document.getElementById('email'); // Note que seu input é type="email" mas está sendo usado para palavra-chave
    const loginButton = document.getElementById('login-button');

    loginButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        const palavraChave = inputPalavraChave.value.trim();
        
        if (!palavraChave) {
            alert('Por favor, digite uma palavra-chave válida.');
            return;
        }

        // Aqui você normalmente teria o ID do usuário ou algum identificador
        // Como não está claro na pergunta, vou assumir que você tem essa informação
        // Em um sistema real, você precisaria obter isso de algum lugar (localStorage, session, etc.)
        const userId = obterUserId(); // Você precisará implementar esta função
        
        if (!userId) {
            alert('Usuário não identificado. Faça login novamente.');
            return;
        }

        enviarPalavraChave(userId, palavraChave);
    });

    function obterUserId() {
        // Implemente esta função para obter o ID do usuário atual
        // Isso pode vir de:
        // 1. localStorage/sessionStorage
        // 2. Parâmetro na URL
        // 3. Outra fonte de dados
        // Exemplo básico:
        return localStorage.getItem('userId');
    }

    async function enviarPalavraChave(userId, palavraChave) {
        try {
            // Note que a URL fornecida é para cadastrar usuário, não para atualizar
            // Você provavelmente precisará de um endpoint diferente para atualizar a senha de recuperação
            const response = await fetch('https://back-spider.vercel.app/user/cadastrarUser', {
                method: 'POST', // ou 'PUT' se for um endpoint de atualização
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    senhaRecuperacao: palavraChave
                    // Em um caso real, você provavelmente precisaria do ID do usuário também
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Palavra-chave de recuperação cadastrada com sucesso!');
                // Redirecionar para outra página se necessário
                // window.location.href = '/alguma-pagina';
            } else {
                throw new Error(data.message || 'Erro ao cadastrar palavra-chave');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Ocorreu um erro ao cadastrar a palavra-chave: ' + error.message);
        }
    }
});