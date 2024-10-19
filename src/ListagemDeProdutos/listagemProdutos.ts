/* 2. Listagem de Produtos
Funcionalidades:

Exibição de uma lista de produtos obtidos da Fake Store API.
Opção para filtrar e ordenar produtos.
Adicionar produtos ao carrinho com quantidade desejada.
Regras:

Apenas usuários logados podem adicionar produtos ao carrinho.
 */

async function listaProdutos() {
  const response = await fetch("https://fakestoreapi.com/products");
  const data = await response.json();
  return data;
}

listaProdutos().then((produtos) => {
  const produtosContainer = document.getElementById("produtos-container");

  //todo verificar a tipagem
  produtos.forEach(
    (produto: {
      title: any;
      image: any;
      price: any;
      description: any;
      id: number;
    }) => {
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

      const adicionarAoCarrinhoButton = document.getElementById(
        `button-${produto.id}`
      );

      adicionarAoCarrinhoButton?.addEventListener("click", () => {
        // todo: lógica para adicionar ao carrinho
        if (sessionStorage.getItem("token")) {
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

interface Produto {
  title: string;
  image: string;
  price: number;
  description: string;
  id: number;
  quantidade?: number; // Adicionando quantidade como opcional
}

function adicionarAoCarrinho(produto: Produto) {
  // Tenta obter o carrinho do sessionStorage e usa um array vazio se não existir
  let carrinho: Produto[] = JSON.parse(sessionStorage.getItem("carrinho") as string) || [];

  const produtoExistente = carrinho.find((item) => item.id === produto.id);
  
  if (produtoExistente) {
    produtoExistente.quantidade! += 1;
  } else {
    carrinho.push({ ...produto, quantidade: 1 }); 
  }

  sessionStorage.setItem("carrinho", JSON.stringify(carrinho));
  window.location.pathname = "/src/Carrinho/carrinho.html";
}