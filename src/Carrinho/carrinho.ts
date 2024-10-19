/* 3. Carrinho / Checkout
Funcionalidades:

Exibição dos produtos adicionados ao carrinho com detalhes como nome, preço, imagem e quantidade.
Cálculo automático do total da compra.
Processo de checkout que simula a finalização da compra.
Regras:

Acesso à página de checkout somente para usuários autenticados.
Garantir que o carrinho reflete o usuário atual logado. */

interface Produto {
  title: string;
  image: string;
  price: number;
  description: string;
  id: number;
  quantidade?: number; // Adicionando quantidade como opcional
}

function listaCarrinho() {
  const carrinhoString = sessionStorage.getItem("carrinho");
  const carrinhoContainer = document.getElementById("carrinho");

  if (carrinhoString) {
    const carrinho: Produto[] = JSON.parse(carrinhoString);
    carrinho.forEach((produto: Produto) => {

      const carrinhoDiv = document.createElement("div");
      carrinhoDiv.innerHTML = `
          <div class="box_1">
          <div class="product">
            <img class="product_img" src="${produto.image}" alt="">
            <div class="product_descricao">
              <div class="product_title">
                <p>${produto.title}</p>
                <img src="" alt="">
              </div>
              <div class="product_subtitle">
                <p>Vendido por: <span>DevIt</span></p>
                <p>Entregue por: <span>DevIt</span></p>
                <p>Cor: <span>Preto</span></p>
              </div>
            </div>
          </div>
          <div class="line"></div>
          <div class="product_information">
            <div class="product_amount">
              <p>Quantidade:</p>
              <img src="./src/img/icons8-menos-30.png" alt="">
              <p>${produto.quantidade}</p>
              <img src="./src/img/icons8-mais-48.png" alt="">
            </div>
            <div class="product_price">
              <p>R$ ${produto.price}</p>
              <p class="product_discount">-5% OFF</p>
            </div>
            <div class="product_price_total">R$ 715,34 no Pix</div>
          </div>
          <div class="product_adress">
            <p>Consultar frete e prazo de entrega</p>
            <div class="input_adress">
              <input type="text" placeholder="CEP">
              <button>Consultar</button>
            </div>
          </div>
        </div>
        <div class="box_2">
          <h1>Resumo da compra</h1>
          <div class="summary_one">
            <p>Subtotal (1 item)</p>
            <p>R$ 752,99</p>
          </div>
          <div class="summary_one">
            <p>Cupom de desconto:</p>
            <p>Adicionar</p>
          </div>
          <div class="summary_one">
            <p>Valor total:</p>
            <p>R$ 715,34 no Pix</p>
          </div>
          <button>Finalizar</button>
          <button>Escolher mais produtos</button>
        </div>
        `;
        carrinhoContainer?.appendChild(carrinhoDiv);
    });

    console.log(carrinho);
    return carrinho;
  } else {
    return [];
  }
}

listaCarrinho();
