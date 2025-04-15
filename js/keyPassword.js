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

        
        const userId = obterUserId(); 
        
        if (!userId) {
            alert('Usuário não identificado. Faça login novamente.');
            return;
        }

        enviarPalavraChave(userId, palavraChave);
    });

    function obterUserId() {
       
        return localStorage.getItem('userId');
    }

    async function enviarPalavraChave(userId, palavraChave) {
        try {
            
            const response = await fetch('https://back-spider.vercel.app/user/cadastrarUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    senhaRecuperacao: palavraChave
                    
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Palavra-chave de recuperação cadastrada com sucesso!');
                
            } else {
                throw new Error(data.message || 'Erro ao cadastrar palavra-chave');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Ocorreu um erro ao cadastrar a palavra-chave: ' + error.message);
        }
    }
});