const loginForm = document.getElementById('loginForm') as HTMLFormElement;
const usernameInput = document.getElementById('username') as HTMLInputElement;
const passwordInput = document.getElementById('password') as HTMLInputElement;
const errorMessage = document.getElementById('errorMessage') as HTMLDivElement;

const FAKE_STORE_API_URL = 'https://fakestoreapi.com/auth/login';

loginForm.addEventListener('submit', async (event: Event) => {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    displayError('Todos os campos são obrigatórios.');
    return;
  }

  try {
    const token = await authenticateUser(username, password);
    if (token) {
      sessionStorage.setItem('authToken', token);
      window.location.pathname = '/src/ListagemDeProdutos/listagemProdutos.html'; 
    }
  } catch (error) {
    displayError('Senha ou Usuário inválidos. Tente novamente.');
  }
});

async function authenticateUser(username: string, password: string): Promise<string | null> {
  const response = await fetch(FAKE_STORE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username, 
      password: password, 
    }),
  });

  if (response.ok) {
    const data = await response.json();
    return data.token; 
  } else {
    throw new Error('Falha na autenticação do usuário');
  }
}

function displayError(message: string) {
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
}

usernameInput.addEventListener('input', clearError);
passwordInput.addEventListener('input', clearError);

function clearError() {
  errorMessage.style.display = 'none';
}
