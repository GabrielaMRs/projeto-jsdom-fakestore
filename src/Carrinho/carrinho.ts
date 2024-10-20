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
//pega o carrinho do usuário logado
async function getUserCarts() {
  const token = sessionStorage.getItem("authToken");
  const userId = token ? decodeJWT(token).sub : null;

  const response = await fetch(`https://fakestoreapi.com/carts/user/${userId}`);
  const carrinho = await response.json();
  //armazeno o carrinho do usuário na session storage
  sessionStorage.setItem(`carrinho_${userId}`, JSON.stringify(carrinho));
}
//preciso pegar o produto que está no carrinho do usuário para montar a lista
async function getASingleProduct(productId: number) {
  const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
  const produto = await response.json();
  return produto;
}

async function listaCarrinho() {
  await getUserCarts(); // Aguardar a chamada para garantir que o carrinho seja carregado
  const token = sessionStorage.getItem("authToken");
  const userId = token ? decodeJWT(token).sub : null;

  if (!userId) {
    console.log("Usuário não autenticado.");
    return; // Retorna se não estiver autenticado
  }

  const carrinhoContainer = document.getElementById("carrinho");
  const carrinhoString = sessionStorage.getItem(`carrinho_${userId}`);

  if (carrinhoString) {
    const carrinho: ICarrinhoUser = JSON.parse(carrinhoString)[0];
    console.log(carrinho);
    const produtosDoCarrinho = carrinho.products;

    // criar um arra de promessas para cada produto
    const promessas = produtosDoCarrinho.map(product => {
      const idProduto = product.productId;
      return getASingleProduct(idProduto).then(produto => {
        const carrinhoDiv = document.createElement("div");
        console.log(produto)
        carrinhoDiv.innerHTML = `
      
      <div class="box">
        <div class="box_1">
          <div class="product">
            <img class="product_img" src="${produto.image}" alt="" />
            <div class="product_descricao">
              <div class="product_title">
                <p>${produto.title}</p>
                <img src="" alt="" />
              </div>
              <div class="product_subtitle">
                <div class="remove">
                  <p>${produto.description}</p>
                  <img class="lixeira" src="/src/img/lixeira.png" alt="" />
                </div>

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

              <div class="product_price_total">
                R$ ${(produto.price * product.quantity).toFixed(2)} no Pix
              </div>
              <!-- Total por produto -->
            </div>
          </div>
        </div>
        <div class="box_2">
          <h2>Resumo da compra</h2>
          <div class="summary_one">
            <p>
              Subtotal (${product.quantity} iten${product.quantity > 1 ? 's' :
              ''})
            </p>
            <p>R$ ${(produto.price * product.quantity).toFixed(2)}</p>
          </div>
          <div class="summary_one">
            <p>Valor total:</p>
            <p>R$ ${(produto.price * product.quantity).toFixed(2)} no Pix</p>
          </div>
          <button>Finalizar</button>
          <button>Escolher mais produtos</button>
        </div>
      </div>
        `;
        carrinhoContainer?.appendChild(carrinhoDiv);
      });
    });

    // aguarda todas as promises serem resolvidas
    await Promise.all(promessas);
  } else {
    console.warn("Carrinho vazio ou não encontrado.");
  }
}

listaCarrinho()

