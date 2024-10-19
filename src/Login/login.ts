/* 1. Tela de Login
Funcionalidades:

Formulário de login com campos para email e senha. (Campo senha, ser possível ver ou não os caracteres)
Validação de entrada (e.g., campos obrigatórios, formato de email).
Autenticação do usuário utilizando a Fake Store API.
Armazenamento do token de autenticação no sessionStorage.
Regras:

Apenas usuários autenticados podem acessar as demais funcionalidades da aplicação.
Mensagens de erro claras para tentativas de login inválidas. */

const campoEmail = document.getElementById('email') as HTMLInputElement;
const campoSenha = document.getElementById('senha') as HTMLInputElement;


async function login() {
  const email = campoEmail.value;
  const senha = campoSenha.value;

  if (!email || !senha) {
    alert('Preencha todos os campos.');
    return;
  }

  try {
    const response = await fetch('https://fakestoreapi.com/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: email, password: senha }),
    });

    if (!response.ok) {
      throw new Error('Usuário e/ou senha inválido(s).');
    }
    const data = await response.json();
    sessionStorage.setItem('token', data.token);

    window.location.pathname = '/src/ListagemDeProdutos/listagemProdutos.html';
  } catch (error: unknown) {
    if (error instanceof Error) {
      alert(error.message);
    } 
  }
}

const buttonLogin = document.getElementById('buttonLogin');

buttonLogin?.addEventListener('click', () => login())
