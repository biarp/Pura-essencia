// script.js (Front-End com "Banco de Dados" Simulado)

document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.querySelector('.product-grid');
    const addProductForm = document.getElementById('add-product-form');
    const cartCountSpan = document.querySelector('.cart-count');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartTotalSpan = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const paymentForm = document.getElementById('payment-form');
    const navLinks = document.querySelectorAll('.nav-link');
    const pageSections = document.querySelectorAll('.page-section');

    // Novas referências para os elementos na página de pagamento
    const paymentCartItemsList = document.getElementById('payment-cart-items-list');
    const paymentCartTotalSpan = document.getElementById('payment-cart-total');

    // NOVA REFERÊNCIA PARA O FORMULÁRIO DE CADASTRO
    const registrationForm = document.getElementById('registration-form');

    // Simulação do "banco de dados" com um array de produtos
    let products = [
        { id: 1, name: "Scarpin Clássico Elegance", price: 199.90, image: "https://images.unsplash.com/photo-1596541223942-e1d533b70868?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        { id: 2, name: "Sandália Verão Glam", price: 179.90, image: "https://images.unsplash.com/photo-1589182479047-926c11d04407?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MpxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        { id: 3, name: "Bota Urbana Chic", price: 289.00, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        { id: 4, name: "Tênis Lifestyle Confort", price: 129.50, image: "https://images.unsplash.com/photo-1549298828-522d0d08b072?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        { id: 5, name: "Sapatilha Delicadeza Diária", price: 99.00, image: "https://images.unsplash.com/photo-1560769629-9fa900bc324a?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        { id: 6, name: "Oxford Elegance Caballero", price: 249.90, image: "https://images.unsplash.com/photo-1527063684-2ce683832152?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        { id: 7, name: "Mule Charme Leve", price: 145.00, image: "https://images.unsplash.com/photo-1615392095689-d900662d5563?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }
    ];

    let nextId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    let cartItems = [];

    // --- Funções de Navegação entre Páginas ---
    function showPage(pageId) {
        pageSections.forEach(section => {
            section.classList.remove('active');
        });
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === pageId) {
                link.classList.add('active');
            }
        });

        if (pageId === 'produtos') {
            renderProducts();
        }
        if (pageId === 'carrinho') {
            renderCart();
        }
        if (pageId === 'pagamento') {
            renderPaymentCart();
        }
        // NÃO PRECISA DE LÓGICA ESPECÍFICA PARA 'cadastro' AQUI, APENAS EXIBIR A SEÇÃO
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const pageId = event.target.dataset.page;
            showPage(pageId);
        });
    });

    // --- Funções de Produtos ---
    function renderProducts() {
        productGrid.innerHTML = '';

        if (products.length === 0) {
            productGrid.innerHTML = '<p>Nenhum produto cadastrado ainda. Adicione um!</p>';
            return;
        }

        products.forEach(product => {
            const productItem = document.createElement('div');
            productItem.classList.add('product-item');
            productItem.dataset.id = product.id;

            productItem.innerHTML = `
                <img src="${product.image || 'https://via.placeholder.com/300x200?text=Sem+Imagem'}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">R$ ${product.price.toFixed(2).replace('.', ',')}</p>
                <button class="add-to-cart" data-product-id="${product.id}">Adicionar ao Carrinho</button>
                <button class="delete-product" data-product-id="${product.id}">Excluir</button>
            `;
            productGrid.appendChild(productItem);
        });

        document.querySelectorAll('.delete-product').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = parseInt(event.target.dataset.productId);
                if (confirm('Tem certeza que deseja excluir este produto?')) {
                    deleteProduct(productId);
                }
            });
        });

        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = parseInt(event.target.dataset.productId);
                const productToAdd = products.find(p => p.id === productId);
                if (productToAdd) {
                    addToCart(productToAdd);
                }
            });
        });
    }

    if (addProductForm) {
        addProductForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const name = document.getElementById('new-product-name').value.trim();
            const price = parseFloat(document.getElementById('new-product-price').value);
            const image = document.getElementById('new-product-image').value.trim();

            if (!name || isNaN(price) || price <= 0) {
                alert('Por favor, preencha o nome e um preço válido para o produto.');
                return;
            }

            const newProduct = {
                id: nextId++,
                name,
                price,
                image: image || 'https://via.placeholder.com/300x200?text=Sem+Imagem'
            };

            products.push(newProduct);
            alert(`Produto "${newProduct.name}" adicionado com sucesso!`);
            addProductForm.reset();
            showPage('produtos');
        });
    }

    function deleteProduct(idToDelete) {
        const initialLength = products.length;
        products = products.filter(product => product.id !== idToDelete);

        if (products.length < initialLength) {
            cartItems = cartItems.filter(item => item.id !== idToDelete);
            updateCartCount();
            alert('Produto excluído com sucesso!');
            renderProducts();
        } else {
            alert('Erro ao excluir produto: Produto não encontrado.');
        }
    }

    // --- Funções do Carrinho ---

    function addToCart(product) {
        const existingItem = cartItems.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cartItems.push({ ...product, quantity: 1 });
        }
        updateCartCount();
        alert(`"${product.name}" adicionado ao carrinho!`);
    }

    function removeFromCart(productId) {
        cartItems = cartItems.filter(item => item.id !== productId);
        updateCartCount();
        renderCart();
    }

    function updateCartCount() {
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartCountSpan.textContent = totalItems;
    }

    function renderCart() {
        cartItemsList.innerHTML = '';

        if (cartItems.length === 0) {
            cartItemsList.innerHTML = '<p>Seu carrinho está vazio.</p>';
            cartTotalSpan.textContent = 'R$ 0,00';
            checkoutBtn.disabled = true;
            return;
        }

        let total = 0;
        cartItems.forEach(item => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-item');
            cartItemDiv.innerHTML = `
                <img src="${item.image || 'https://via.placeholder.com/80x80?text=Sem+Imagem'}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>Quantidade: ${item.quantity}</p>
                </div>
                <p class="cart-item-price">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                <button class="remove-from-cart" data-product-id="${item.id}">Remover</button>
            `;
            cartItemsList.appendChild(cartItemDiv);
            total += item.price * item.quantity;
        });

        cartTotalSpan.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        checkoutBtn.disabled = false;
    }

    function renderPaymentCart() {
        paymentCartItemsList.innerHTML = '';

        if (cartItems.length === 0) {
            paymentCartItemsList.innerHTML = '<p>Seu carrinho está vazio.</p>';
            paymentCartTotalSpan.textContent = 'R$ 0,00';
            return;
        }

        let total = 0;
        cartItems.forEach(item => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-item');
            cartItemDiv.innerHTML = `
                <img src="${item.image || 'https://via.placeholder.com/80x80?text=Sem+Imagem'}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>Quantidade: ${item.quantity}</p>
                </div>
                <p class="cart-item-price">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
            `;
            paymentCartItemsList.appendChild(cartItemDiv);
            total += item.price * item.quantity;
        });

        paymentCartTotalSpan.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cartItems.length > 0) {
                showPage('pagamento');
            } else {
                alert('Seu carrinho está vazio. Adicione produtos antes de finalizar a compra.');
            }
        });
    }

    cartItemsList.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-from-cart')) {
            const productId = parseInt(event.target.dataset.productId);
            removeFromCart(productId);
        }
    });

    // --- Funções de Pagamento (SIMULADO) ---

    if (paymentForm) {
        paymentForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const cardNumber = document.getElementById('card-number').value.trim();
            const expiryDate = document.getElementById('expiry-date').value.trim();
            const cvv = document.getElementById('cvv').value.trim();
            const cardName = document.getElementById('card-name').value.trim();

            if (!cardNumber || !expiryDate || !cvv || !cardName) {
                alert('Por favor, preencha todos os campos do cartão.');
                return;
            }

            if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
                alert('Número do cartão inválido. Deve ter 16 dígitos.');
                return;
            }
            if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
                alert('Data de validade inválida. Use o formato MM/AA.');
                return;
            }
            if (!/^\d{3,4}$/.test(cvv)) {
                alert('CVV inválido. Deve ter 3 ou 4 dígitos.');
                return;
            }

            alert('Pagamento processado com SUCESSO (SIMULADO)! Obrigado pela sua compra.');

            cartItems = [];
            updateCartCount();
            paymentForm.reset();
            showPage('home');
        });
    }

    // --- NOVA LÓGICA PARA O FORMULÁRIO DE CADASTRO ---
    if (registrationForm) {
        registrationForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Impede o envio padrão do formulário

            const name = document.getElementById('reg-name').value.trim();
            const email = document.getElementById('reg-email').value.trim();
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm-password').value;

            if (!name || !email || !password || !confirmPassword) {
                alert('Por favor, preencha todos os campos do cadastro.');
                return;
            }

            if (password.length < 6) {
                alert('A senha deve ter pelo menos 6 caracteres.');
                return;
            }

            if (password !== confirmPassword) {
                alert('As senhas não coincidem. Por favor, verifique.');
                return;
            }

            // Simulação de cadastro bem-sucedido
            alert(`Cadastro realizado com sucesso, ${name}! Bem-vindo(a) à Pura Essência Calçados.`);
            registrationForm.reset(); // Limpa o formulário
            showPage('home'); // Redireciona para a página inicial após o cadastro
        });
    }

    // --- Inicialização ---

    showPage('home');
    updateCartCount();
});