/* 3. Carrinho / Checkout
Funcionalidades:

Exibição dos produtos adicionados ao carrinho com detalhes como nome, preço, imagem e quantidade.
Cálculo automático do total da compra.
Processo de checkout que simula a finalização da compra.
Regras:

Acesso à página de checkout somente para usuários autenticados.
Garantir que o carrinho reflete o usuário atual logado. */

interface ICarrinhoUser {
  id: number;
  date: string;
  products: IProduct[];
}

interface IProduct {
  productId: number;
  quantity: number;
}

function decodeJWT(token: string): any {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

// Pega o carrinho do usuário logado
async function getUserCarts() {
  const token = sessionStorage.getItem("authToken");
  const userId = token ? decodeJWT(token).sub : null;

  const response = await fetch(`https://fakestoreapi.com/carts/user/${userId}`);
  const carrinho = await response.json();
  // Armazeno o carrinho do usuário na session storage
  sessionStorage.setItem(`carrinho_${userId}`, JSON.stringify(carrinho));
}

// Preciso pegar o produto que está no carrinho do usuário para montar a lista
async function getASingleProduct(productId: number) {
  const response = await fetch(`https://fakestoreapi.com/products/${productId}`
  );
  const produto = await response.json();
  return produto;
}

// Função para atualizar a interface após a remoção de um produto
async function updateCarrinho() {
  const token = sessionStorage.getItem("authToken");
  const userId = token ? decodeJWT(token).sub : null;
  const carrinhoContainer = document.getElementById("carrinho") as HTMLElement;

  if (userId) {
    const carrinhoString = sessionStorage.getItem(`carrinho_${userId}`);
    if (carrinhoString) {
      const carrinho: ICarrinhoUser = JSON.parse(carrinhoString)[0];
      const produtosDoCarrinho = carrinho.products;

      // Limpa a interface do carrinho
      carrinhoContainer!.innerHTML = "";

      let subtotal = 0;

      // Criar um contêiner para produtos e resumo
      const mainDiv = document.createElement("div");
      mainDiv.className = "main-container"; // Classe para estilização
      const produtosDiv = document.createElement("div");
      produtosDiv.className = "produtos"; // Classe para produtos
      const resumoDiv = document.createElement("div");
      resumoDiv.className = "resumo"; // Classe para resumo

      // Criar um array de promessas para cada produto
      const promessas = produtosDoCarrinho.map((product) => {
        return getASingleProduct(product.productId).then((produto) => {
          subtotal += produto.price * product.quantity; // Cálculo do subtotal
          const carrinhoDiv = document.createElement("div");
          carrinhoDiv.innerHTML = ` 
            <div class="box">
              <div class="box_1">
                <div class="product">
                  <img class="product_img" src="${produto.image}" alt="" />
                  <div class="product_descricao">
                    <div class="product_title">
                      <p>${produto.title}</p>
                    <div class="remove" data-product-id="${product.productId}">
                        <img class="lixeira" src="/src/img/lixeira.png" alt="" />
                      </div>
                    </div>
                    <div class="product_subtitle">
                      <p>${produto.description}</p>
                      <p>Entregue por: <span>DevIt</span></p>
                      <p>Cor: <span>Preto</span></p>
                    </div>
                  </div>
                </div>
                <div class="line"></div>
                <div class="product_information">
                  <div class="product_amount">
                    <p>Quantidade:</p>
                    <img
                      class="menos_img"
                      src="/src/img/icons8-menos-30.png"
                      alt=""
                    />
                    <p>${product.quantity}</p>
                    <img class="menos_img" src="/src/img/icons8-mais-48.png" alt="" />
                  </div>
                  <div class="product_price">
                    <p>R$ ${produto.price}</p>
                  </div>
                </div>
              </div>
            </div>`;
          produtosDiv.appendChild(carrinhoDiv);
        });
      });

      // Aguardar todas as promises serem resolvidas
      await Promise.all(promessas);

      // Adicionar o resumo da compra
      resumoDiv.innerHTML = `
        <div class="box">
          <h2>Resumo da compra</h2>
          <div class="summary_one">
            <p>Subtotal (${produtosDoCarrinho.reduce((sum, p) => sum + p.quantity, 0)} item${produtosDoCarrinho.reduce((sum, p) => sum + p.quantity, 0) > 1 ? 's' : ''})</p>
            <p>R$ ${subtotal.toFixed(2)}</p>
          </div>
          <div class="summary_one">
            <p>Valor total:</p>
            <p>R$ ${subtotal.toFixed(2)} no Pix</p>
          </div>
          <button id="button-finaliza">Finalizar</button>
          <button id="button-redireciona">Escolher mais produtos</button>
        </div>`;

      // Adicionar produtos e resumo ao contêiner principal
      mainDiv.appendChild(produtosDiv);
      mainDiv.appendChild(resumoDiv);
      carrinhoContainer.appendChild(mainDiv);
    } else {
      console.warn("Carrinho vazio ou não encontrado.");
    }
  }
}

// Função para remover produto do carrinho
async function removeProductFromCart(productId: number) {
  const token = sessionStorage.getItem("authToken");
  const userId = token ? decodeJWT(token).sub : null;

  if (userId) {
    const carrinhoString = sessionStorage.getItem(`carrinho_${userId}`);
    if (carrinhoString) {
      const carrinho: ICarrinhoUser = JSON.parse(carrinhoString)[0];
      // Filtra os produtos para remover o produto selecionado
      carrinho.products = carrinho.products.filter(
        (product) => product.productId !== productId
      );
      // Atualiza a sessionStorage
      sessionStorage.setItem(`carrinho_${userId}`, JSON.stringify([carrinho]));
      // Atualiza a interface do carrinho
      await updateCarrinho();
    }
  }
}

// Função para listar o carrinho
async function listaCarrinho() {
  await getUserCarts();
  await updateCarrinho(); 
}

// Adiciona o event listener para as lixeiras
document.addEventListener("click", (event) => {
  if ((event.target as HTMLElement).classList.contains("lixeira")) {
    const productId = Number(
      (event.target as HTMLElement)
        .closest(".remove")
        ?.getAttribute("data-product-id")
    );
    if (productId) {
      removeProductFromCart(productId);
    }
  }
});

// Inicializa a lista do carrinho
await listaCarrinho();

const buttonRedireciona = document.getElementById(
  "button-redireciona"
) as HTMLButtonElement;
buttonRedireciona.addEventListener("click", () => {
  window.location.href = "/listagemProdutos.ts";
});