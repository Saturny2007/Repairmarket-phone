// Récupérer les produits
fetch('/api/products')
    .then(response => response.json())
    .then(data => {
        const productContainer = document.getElementById('products');
        productContainer.innerHTML = ''; // Effacer le contenu précédent
        //${product.price}
        data.forEach(product => {
            productContainer.innerHTML += `
                <div class="card">
              <img src="${product.image}" alt="Produit" class="card-img">
              <h2 class="card-title">${product.name}</h2>
              <p class="card-description">Description du produit.</p>
              <button class="card-button" onclick="window.location.href='achat.html';">Acheter</button>
            </div>
            `;
        });
    })
    .catch(error => console.error('Erreur:', error));
console.log("lancement");
