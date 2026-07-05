const products = [
  {
    id: 1,
    name: "Wireless Noise-Cancelling Headphones",
    category: "Electronics",
    price: 89.99,
    rating: 4.7,
    image: "https://i.pinimg.com/736x/f8/85/a1/f885a132401d4354c70bcbc112925b7e.jpg"
  },
  {
    id: 2,
    name: "Slim Fit Cotton T-Shirt",
    category: "Clothing",
    price: 24.99,
    rating: 4.3,
    image: "https://i.pinimg.com/736x/68/04/56/680456ede0285d53d6abdf0264b9a733.jpg"
  },
  {
    id: 3,
    name: "Running Sneakers Pro",
    category: "Shoes",
    price: 119.99,
    rating: 4.8,
    image: "https://i.pinimg.com/736x/10/f7/35/10f735af47b0504abd9af5bf90cb1a43.jpg"
  },
  {
    id: 4,
    name: "Leather Minimalist Wallet",
    category: "Accessories",
    price: 34.99,
    rating: 4.5,
    image: "https://i.pinimg.com/736x/0f/98/bf/0f98bfd7fea7a0d7ca84bb90839a245c.jpg"
  },
  {
    id: 5,
    name: "4K Ultra HD Smart TV 43\"",
    category: "Electronics",
    price: 349.99,
    rating: 4.6,
    image: "https://i.pinimg.com/736x/83/d4/29/83d4295b439c0a2e3a262ee99aedd25a.jpg"
  },
  {
    id: 6,
    name: "Classic Denim Jacket",
    category: "Clothing",
    price: 64.99,
    rating: 4.2,
    image: "https://i.pinimg.com/736x/58/1a/3a/581a3a91620e0d5a1d83ada3c049796f.jpg"
  },
  {
    id: 7,
    name: "Casual Canvas Loafers",
    category: "Shoes",
    price: 49.99,
    rating: 4.1,
    image: "https://i.pinimg.com/1200x/9e/f9/76/9ef9768a97cd09c7ed5818ba94660688.jpg"
  },
  {
    id: 8,
    name: "Stainless Steel Watch",
    category: "Accessories",
    price: 149.99,
    rating: 4.9,
    image: "https://i.pinimg.com/vwebpf/1200x/43/f5/c3/43f5c338416e8f0f5cf5a34cd9b1b5d8.webp"
  },
  {
    id: 9,
    name: "Bluetooth Mechanical Keyboard",
    category: "Electronics",
    price: 79.99,
    rating: 4.4,
    image: "https://i.pinimg.com/1200x/2d/03/ff/2d03ff30f0aa0d0e29decd14d892d6fe.jpg"
  },
  {
    id: 10,
    name: "Floral Summer Dress",
    category: "Clothing",
    price: 39.99,
    rating: 4.6,
    image: "https://i.pinimg.com/736x/3f/48/8f/3f488f13299827c40df48e2ac6ff956a.jpg"
  }
];

const grid          = document.getElementById('product-grid');
const resultCount   = document.getElementById('result-count');
const emptyState    = document.getElementById('empty-state');
const sortSelect    = document.getElementById('sort-select');
const categoryBtns  = document.querySelectorAll('.cat-btn');
const resetBtn      = document.getElementById('reset-btn');

let activeCategory  = 'all';
let activePriceRange = 'all';
let activeMinRating  = 0;
let activeSort       = 'default';

function getStars(rating) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

function filterProducts() {
  return products.filter(p => {
    const catMatch = activeCategory === 'all' || p.category === activeCategory;

    let priceMatch = true;
    if (activePriceRange === '0-50')    priceMatch = p.price < 50;
    if (activePriceRange === '50-100')  priceMatch = p.price >= 50 && p.price <= 100;
    if (activePriceRange === '100-999') priceMatch = p.price > 100;

    const ratingMatch = p.rating >= activeMinRating;

    return catMatch && priceMatch && ratingMatch;
  });
}

function sortProducts(list) {
  const sorted = [...list];
  if (activeSort === 'price-asc')    sorted.sort((a, b) => a.price - b.price);
  if (activeSort === 'price-desc')   sorted.sort((a, b) => b.price - a.price);
  if (activeSort === 'rating-desc')  sorted.sort((a, b) => b.rating - a.rating);
  if (activeSort === 'name-asc')     sorted.sort((a, b) => a.name.localeCompare(b.name));
  return sorted;
}

function renderProducts() {
  const filtered = filterProducts();
  const sorted   = sortProducts(filtered);

  grid.innerHTML = '';
  resultCount.textContent = `Showing ${sorted.length} product${sorted.length !== 1 ? 's' : ''}`;

  if (sorted.length === 0) {
    emptyState.style.display = 'flex';
    return;
  }

  emptyState.style.display = 'none';

  sorted.forEach(p => {
    const card = document.createElement('div');
    card.classList.add('product-card');
    card.innerHTML = `
      <div class="product-img">
        <img src="${p.image}" alt="${p.name}" loading="lazy" />
        <span class="category-chip">${p.category}</span>
      </div>
      <div class="product-body">
        <p class="product-name" title="${p.name}">${p.name}</p>
        <div class="product-meta">
          <span class="product-rating">
            <span class="stars">${getStars(p.rating)}</span>
            ${p.rating}
          </span>
          <span class="product-price">$${p.price.toFixed(2)}</span>
        </div>
        <button class="add-btn" data-id="${p.id}">Add to Cart</button>
      </div>
    `;
    grid.appendChild(card);
  });

  grid.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.textContent = '✅ Added!';
      btn.classList.add('added');
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Add to Cart';
        btn.classList.remove('added');
        btn.disabled = false;
      }, 2000);
    });
  });
}

categoryBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    categoryBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeCategory = btn.dataset.category;
    renderProducts();
  });
});

document.querySelectorAll('input[name="price"]').forEach(radio => {
  radio.addEventListener('change', () => {
    activePriceRange = radio.value;
    renderProducts();
  });
});

document.querySelectorAll('input[name="rating"]').forEach(radio => {
  radio.addEventListener('change', () => {
    activeMinRating = parseFloat(radio.value);
    renderProducts();
  });
});

sortSelect.addEventListener('change', () => {
  activeSort = sortSelect.value;
  renderProducts();
});

resetBtn.addEventListener('click', () => {
  activeCategory   = 'all';
  activePriceRange = 'all';
  activeMinRating  = 0;
  activeSort       = 'default';

  categoryBtns.forEach(b => b.classList.remove('active'));
  document.querySelector('[data-category="all"]').classList.add('active');
  document.querySelector('input[name="price"][value="all"]').checked = true;
  document.querySelector('input[name="rating"][value="0"]').checked = true;
  sortSelect.value = 'default';

  renderProducts();
});

renderProducts();
