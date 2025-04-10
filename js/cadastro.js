async function cadastrarUser(data) {
    try {
        const response = await fetch('https://back-spider.vercel.app/user/cadastrarUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao cadastrar usuário.');
        }

        const result = await response.json();
        console.log('Resultado do cadastro:', result);
        showMensagem('Cadastro realizado com sucesso!', 'sucesso');

        // Redireciona para a página de login após o cadastro
        setTimeout(() => {
            window.location.href = './index.html';
        }, 2000);
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        showMensagem(error.message, 'erro');
    }
}

function showMensagem(mensagem, tipo) {
    const mensagemElemento = document.getElementById('mensagem');
    if (mensagemElemento) {
        mensagemElemento.textContent = mensagem;
        mensagemElemento.className = tipo; // Define a classe como 'erro' ou 'sucesso'
        mensagemElemento.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const button = document.getElementById('botaoCadastrar');
    if (button) {
        button.addEventListener('click', function (event) {
            event.preventDefault();

            const nomeInput = document.getElementById('nome');
            const emailInput = document.getElementById('email');
            const senhaInput = document.getElementById('senha');
            const senhaRecuperacaoInput = document.getElementById('senhaRecuperacao');
            const imagemInput = document.getElementById('imagem');

            if (nomeInput && emailInput && senhaInput && senhaRecuperacaoInput && imagemInput) {
                if (
                    nomeInput.value.trim() === '' ||
                    emailInput.value.trim() === '' ||
                    senhaInput.value.trim() === '' ||
                    senhaRecuperacaoInput.value.trim() === '' ||
                    imagemInput.value.trim() === ''
                ) {
                    showMensagem('Por favor, preencha todos os campos.', 'erro');
                    return;
                }

                const userData = {
                    nome: nomeInput.value,
                    email: emailInput.value,
                    senha: senhaInput.value,
                    senhaRecuperacao: senhaRecuperacaoInput.value,
                    imagemPerfil: imagemInput.value, // Adiciona o campo de imagem
                    premium: "0", // Valor padrão para premium
                };
                console.log('Dados do usuário:', userData);
                cadastrarUser(userData);
            } else {
                showMensagem('Erro ao capturar os campos do formulário.', 'erro');
            }
        });
    }
});