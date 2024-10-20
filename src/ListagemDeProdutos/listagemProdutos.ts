/* 2. Listagem de Produtos
Funcionalidades:

Exibição de uma lista de produtos obtidos da Fake Store API.
Opção para filtrar e ordenar produtos.
Adicionar produtos ao carrinho com quantidade desejada.
Regras:

Apenas usuários logados podem adicionar produtos ao carrinho.
 */

interface Produto {
  title: string;
  image: string;
  price: number;
  description: string;
  id: number;
  quantidade?: number; // Adicionando quantidade como opcional
}


const token = sessionStorage.getItem("authToken");

async function listaProdutos() {
  const response = await fetch("https://fakestoreapi.com/products");
  const data = await response.json();
  return data;
}

listaProdutos().then((produtos) => {
  const produtosContainer = document.getElementById("produtos");

  //todo verificar a tipagem
  produtos.forEach(
    (produto: {
      title: string;
      image: string;
      price: number;
      description: string;
      id: number;
    }) => {
      const produtoDiv = document.createElement("div");

      produtoDiv.innerHTML = `
      <h2>${produto.title}</h2>
      <img src="${produto.image}" alt="${produto.title}" />
      <p>Preço: $${produto.price}</p>
      <p>${produto.description}</p>
      <button id="button-${produto.id}">Adicionar ao carrinho</button>
    `;
      produtosContainer?.appendChild(produtoDiv);

      const adicionarAoCarrinhoButton = document.getElementById(
        `button-${produto.id}`
      );

      adicionarAoCarrinhoButton?.addEventListener("click", () => {
        console.log('carrinho adicionado')
        if (sessionStorage.getItem("authToken")) {
          console.log("Adicionado ao carrinho: " + produto.title);
          adicionarAoCarrinho(produto);
        } else {
          alert("Faça login para adicionar produtos ao carrinho.");
          window.location.pathname = "/src/Login/login.html";
        }
      });
    }
  );
});

function decodeJWT(token: string): any {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
}

async function getUserCarts(){
  const userId = token ? decodeJWT(token).id : null;

  //if (!userId) return; // Não deve adicionar se não estiver autenticado

  const carrinhoKey = `carrinho_${userId}`;

  const response = await fetch(`https://fakestoreapi.com/carts/user/${carrinhoKey}`);
  const carrinho = await response.json();
  sessionStorage.setItem(carrinhoKey, JSON.stringify(carrinho));
}

function adicionarAoCarrinho(produto: Produto) {
  getUserCarts()
  let carrinho: Produto[] = JSON.parse(sessionStorage.getItem("carrinhoKey") as string) || [];
  console.log(carrinho)
  const produtoExistente = carrinho.find((item) => item.id === produto.id);

  if (produtoExistente) {
    produtoExistente.quantidade! += 1; 
  } else {
    carrinho.push({ ...produto, quantidade: 1 }); 
  }

  window.location.pathname = "/src/Carrinho/carrinho.html";
}

const buttonLogin = document.getElementById("buttonLogin");

function updateToken() {
  return sessionStorage.getItem("authToken");
}

function updateButtonText() {
  const token = updateToken();
  if (buttonLogin) {
    buttonLogin.innerText = token ? "Sair" : "Login";
  }
}

if (buttonLogin) {
  updateButtonText();

  buttonLogin.addEventListener("click", () => {
    const token = updateToken();
    if (token) {
      sessionStorage.removeItem("authToken");
      updateButtonText();
    } else {
      window.location.pathname = "/src/Login/login.html";
    }
  });
} 

