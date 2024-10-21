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
  quantidade: number;
}

const token = sessionStorage.getItem("authToken");

async function listaProdutos(category?: string) {
  const response = await fetch("https://fakestoreapi.com/products" + (category ? `/category/${category}` : ''));
  const data = await response.json();
  return data;
}

document.getElementById('filter-button')?.addEventListener('click', () => {
  const selectedCategory = (document.getElementById('category-select') as HTMLSelectElement).value;
  const selectedSort = (document.getElementById('sort-select') as HTMLSelectElement).value;
  listaProdutos(selectedCategory).then((produtos) => {
    const produtosOrdenados = ordenarProdutos(produtos, selectedSort);
    exibirProdutos(produtosOrdenados);
  });
});

function ordenarProdutos(produtos: Produto[], criterio: string) {
  switch (criterio) {
    case 'price-asc':
      return produtos.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return produtos.sort((a, b) => b.price - a.price);
    case 'title-asc':
      return produtos.sort((a, b) => a.title.localeCompare(b.title));
    case 'title-desc':
      return produtos.sort((a, b) => b.title.localeCompare(a.title));
    default:
      return produtos;
  }
}

async function limparFiltros(){
  const sortSelect = document.getElementById('sort-select') as HTMLSelectElement;
  const categoriaSelect = document.getElementById('category-select') as HTMLSelectElement;
  categoriaSelect.value = "Selecione a categoria";
  sortSelect.value = "Ordenar por";
  listaProdutos().then((produtos) => {
    exibirProdutos(produtos);
  });
}

document.getElementById('clear-button')?.addEventListener('click', () => limparFiltros()); 

function exibirProdutos(produtos: Produto[]) {
  const produtosContainer = document.getElementById("produtos-container");
  if(produtosContainer){produtosContainer.innerHTML = ''; }

  produtos.forEach(produto => {
      const produtoDiv = document.createElement("div");
      produtoDiv.classList.add("cartao-produto");
      produtoDiv.innerHTML = `
          <h2>${produto.title}</h2>
          <div class="foto-container">
              <img src="${produto.image}" alt="${produto.title}"/>
          </div>
          <div class="info-container">
              <p>${produto.description}</p>
              <div class="compra-container">
                  <p>Preço: $${produto.price}</p>
                  <button id="button-${produto.id}">Adicionar ao carrinho</button>
              </div>
          </div>
      `;
      produtosContainer?.appendChild(produtoDiv);

      const adicionarAoCarrinhoButton = document.getElementById(`button-${produto.id}`);
      adicionarAoCarrinhoButton?.addEventListener("click", () => {
          if (sessionStorage.getItem("authToken")) {
              adicionarAoCarrinho(produto);
          } else {
              alert("Faça login para adicionar produtos ao carrinho.");
              window.location.pathname = "/src/Login/login.html";
          }
      });
  });
}

listaProdutos().then((produtos) => {
  exibirProdutos(produtos);
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

const buttonLogin = document.getElementById("buttonLogin") as HTMLButtonElement;

function updateToken() {
  return sessionStorage.getItem("authToken");
}

function updateButtonText() {
  const token = updateToken();
  buttonLogin.innerText = token ? "Sair" : "Login";
}


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

const buttonCarrinho = document.getElementById('carrinho') as HTMLButtonElement;

buttonCarrinho.addEventListener("click", () => {
  if(token){
    window.location.pathname = "/src/Carrinho/carrinho.html";
  } else {
    alert("Faça login para ver o seu carrinho.");
    window.location.pathname = "/src/Login/login.html";
  }
})


const ordenarButton = document.getElementById('ordenar-button') as HTMLButtonElement;

ordenarButton.addEventListener('click', () => {
  fetch('https://fakestoreapi.com/carts?sort=desc')
    .then(res=>res.json())
    .then(json=>console.log(json))
})
