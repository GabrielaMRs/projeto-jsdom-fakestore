/* 2. Listagem de Produtos
Funcionalidades:

Exibição de uma lista de produtos obtidos da Fake Store API.
Opção para filtrar e ordenar produtos.
Adicionar produtos ao carrinho com quantidade desejada.
Regras:

Apenas usuários logados podem adicionar produtos ao carrinho.
 */
async function listaProdutos(){
  const response = await fetch('https://fakestoreapi.com/products');
  const data = await response.json();
  return data;
}

listaProdutos().then(produtos => {
  const produtosContainer = document.getElementById('produtos');
  
  produtos.forEach((produto: { title: any; image: any; price: any; description: any; }) => {
    const produtoDiv = document.createElement('div');
    produtoDiv.className = 'produto';
    
    produtoDiv.innerHTML = `
      <h2>${produto.title}</h2>
      <img src="${produto.image}" alt="${produto.title}" />
      <p>Preço: $${produto.price}</p>
      <p>${produto.description}</p>
      <button>Adicionar ao carrinho</button>
    `;
    
    const adicionarAoCarrinhoButton = produtoDiv.querySelector('button');
    adicionarAoCarrinhoButton?.addEventListener('click', () => {
      // Implementar a função de adicionar ao carrinho aqui
      console.log(`Adicionado ao carrinho: ${produto.title}`);
    });
    
    produtosContainer?.appendChild(produtoDiv);
  });
});

