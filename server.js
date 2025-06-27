// backend/server.js

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Permite requisições de diferentes origens (necessário para o frontend)
app.use(express.json()); // Habilita o Express a parsear JSON do corpo das requisições

const PRODUCTS_FILE = path.join(__dirname, 'data', 'products.json');

// Função para ler os produtos do arquivo JSON
function readProducts() {
    if (!fs.existsSync(PRODUCTS_FILE)) {
        // Se o arquivo não existir, cria um vazio
        fs.writeFileSync(PRODUCTS_FILE, '[]', 'utf8');
    }
    const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
    return JSON.parse(data);
}

// Função para escrever os produtos no arquivo JSON
function writeProducts(products) {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf8');
}

// --- Rotas da API ---

// Rota para obter todos os produtos
app.get('/api/products', (req, res) => {
    try {
        const products = readProducts();
        res.json(products);
    } catch (error) {
        console.error('Erro ao ler produtos:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao obter produtos.' });
    }
});

// Rota para adicionar um novo produto
app.post('/api/products', (req, res) => {
    const newProduct = req.body;

    if (!newProduct.name || !newProduct.price || newProduct.price <= 0) {
        return res.status(400).json({ message: 'Nome e preço do produto são obrigatórios e o preço deve ser maior que zero.' });
    }

    try {
        const products = readProducts();
        // Gera um novo ID simples (em um DB real, o DB faria isso)
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        
        const productToAdd = {
            id: newId,
            name: newProduct.name,
            price: parseFloat(newProduct.price),
            image: newProduct.image || 'https://via.placeholder.com/300x200?text=Sem+Imagem' // Imagem padrão
        };
        
        products.push(productToAdd);
        writeProducts(products);
        res.status(201).json(productToAdd); // Retorna o produto adicionado com o ID
    } catch (error) {
        console.error('Erro ao adicionar produto:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao adicionar produto.' });
    }
});

// Rota para excluir um produto
app.delete('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);

    try {
        let products = readProducts();
        const initialLength = products.length;
        products = products.filter(p => p.id !== productId);

        if (products.length < initialLength) {
            writeProducts(products);
            res.status(200).json({ message: 'Produto excluído com sucesso.' });
        } else {
            res.status(404).json({ message: 'Produto não encontrado.' });
        }
    } catch (error) {
        console.error('Erro ao excluir produto:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao excluir produto.' });
    }
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse o frontend em http://localhost:5500 (ou a porta do seu Live Server)`);
});
