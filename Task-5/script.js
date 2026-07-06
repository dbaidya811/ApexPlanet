
const products = [
  {
    id: 1,
    name: "Wireless Noise-Cancelling Headphones",
    category: "Electronics",
    price: 89.99,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=200&fit=crop"
  },
  {
    id: 2,
    name: "Slim Fit Cotton T-Shirt",
    category: "Clothing",
    price: 24.99,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=200&fit=crop"
  },
  {
    id: 3,
    name: "Running Sneakers Pro",
    category: "Shoes",
    price: 119.99,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=200&fit=crop"
  },
  {
    id: 4,
    name: "Leather Minimalist Wallet",
    category: "Accessories",
    price: 34.99,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=200&fit=crop"
  },
  {
    id: 5,
    name: "4K Ultra HD Smart TV 43\"",
    category: "Electronics",
    price: 349.99,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=400&h=200&fit=crop"
  },
  {
    id: 6,
    name: "Classic Denim Jacket",
    category: "Clothing",
    price: 64.99,
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400&h=200&fit=crop"
  },
  {
    id: 7,
    name: "Casual Canvas Loafers",
    category: "Shoes",
    price: 49.99,
    rating: 4.1,
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=200&fit=crop"
  },
  {
    id: 8,
    name: "Stainless Steel Watch",
    category: "Accessories",
    price: 149.99,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=200&fit=crop"
  },
  {
    id: 9,
    name: "Bluetooth Mechanical Keyboard",
    category: "Electronics",
    price: 79.99,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=200&fit=crop"
  },
  {
    id: 10,
    name: "Floral Summer Dress",
    category: "Clothing",
    price: 39.99,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=200&fit=crop"
  }
];


let cart          = [];
let activeFilter  = 'all';
let activeSort    = 'default';


const productGrid   = document.getElementById('product-grid');
const resultCount   = document.getElementById('result-count');
const noResults     = document.getElementById('no-results');
const cartDrawer    = document.getElementById('cart-drawer');
const cartOverlay   = document.getElementById('cart-overlay');
const cartList      = document.getElementById('cart-list');
const cartEmpty     = document.getElementById('cart-empty');
const cartFooter    = document.getElementById('cart-footer');
const cartBadge     = document.getElementById('cart-badge');
const subtotalEl    = document.getElementById('subtotal');
const cartTotalEl   = document.getElementById('cart-total');
const shippingEl    = document.getElementById('shipping-cost');
const toastEl       = document.getElementById('toast');
const filterBtns    = document.querySelectorAll('.filter-btn');
const sortSelect    = document.getElementById('sort-select');


function getStars(rating) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5 ? '½' : '';
  const empty = 5 - full - (half ? 1 : 0);
  return '★'.repeat(full) + half + '☆'.repeat(empty);
}


function formatPrice(amount) {
  return `$${amount.toFixed(2)}`;
}

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add('show');
  setTimeout(() => toastEl.classList.remove('show'), 2500);
}

function bumpBadge() {
  cartBadge.classList.remove('bump');
  void cartBadge.offsetWidth;
  cartBadge.classList.add('bump');
  setTimeout(() => cartBadge.classList.remove('bump'), 300);
}


function getVisibleProducts() {
  let list = activeFilter === 'all'
    ? [...products]
    : products.filter(p => p.category === activeFilter);

  if (activeSort === 'price-asc')   list.sort((a, b) => a.price - b.price);
  if (activeSort === 'price-desc')  list.sort((a, b) => b.price - a.price);
  if (activeSort === 'rating-desc') list.sort((a, b) => b.rating - a.rating);

  return list;
}


function renderProducts() {
  const list = getVisibleProducts();

  resultCount.textContent = `Showing ${list.length} product${list.length !== 1 ? 's' : ''}`;

  if (list.length === 0) {
    productGrid.innerHTML = '';
    noResults.style.display = 'flex';
    return;
  }

  noResults.style.display = 'none';

  const html = list.map((p, index) => {
    const inCart = cart.some(item => item.id === p.id);
    return `
      <div class="product-card" style="animation-delay:${index * 0.05}s">
        <div class="product-img-wrap">
          <img
            src="${p.image}"
            alt="${p.name}"
            loading="lazy"
            width="400"
            height="200"
          />
          <span class="cat-chip">${p.category}</span>
        </div>
        <div class="product-body">
          <p class="product-name" title="${p.name}">${p.name}</p>
          <div class="product-meta">
            <span class="product-rating">
              <span class="stars">${getStars(p.rating)}</span> ${p.rating}
            </span>
            <span class="product-price">${formatPrice(p.price)}</span>
          </div>
          <div style="display:flex;gap:0.5rem;">
            <button
              class="add-to-cart-btn ${inCart ? 'in-cart' : ''}"
              data-id="${p.id}"
              style="flex:1"
            >
              ${inCart ? '✓ In Cart' : 'Add to Cart'}
            </button>
            <a href="product-detail.html?id=${p.id}" style="display:flex;align-items:center;padding:0 0.8rem;border:1.5px solid var(--border);border-radius:8px;font-size:0.8rem;font-weight:700;color:var(--accent);text-decoration:none;white-space:nowrap;transition:all 0.25s ease;" onmouseover="this.style.background='var(--accent-soft)'" onmouseout="this.style.background=''">View</a>
          </div>
        </div>
      </div>
    `;
  }).join('');

  productGrid.innerHTML = html;

  productGrid.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => addToCart(Number(btn.dataset.id)));
  });
}


function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCartUI();
  renderProducts();
  showToast(`🛒 "${product.name}" added to cart!`);
  bumpBadge();
}

function increaseQty(productId) {
  const item = cart.find(i => i.id === productId);
  if (item) item.qty += 1;
  updateCartUI();
}

function decreaseQty(productId) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  if (item.qty > 1) {
    item.qty -= 1;
  } else {
    removeFromCart(productId);
    return;
  }

  updateCartUI();
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  updateCartUI();
  renderProducts();
}

function clearCart() {
  cart = [];
  updateCartUI();
  renderProducts();
}


function updateCartUI() {
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
  const subtotal   = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping   = subtotal > 0 && subtotal < 50 ? 5.99 : 0;
  const total      = subtotal + shipping;

  cartBadge.textContent = totalItems;

  if (cart.length === 0) {
    cartEmpty.style.display  = 'flex';
    cartList.style.display   = 'none';
    cartFooter.style.display = 'none';
  } else {
    cartEmpty.style.display  = 'none';
    cartList.style.display   = 'flex';
    cartFooter.style.display = 'block';
  }

  subtotalEl.textContent  = formatPrice(subtotal);
  shippingEl.textContent  = shipping === 0 ? 'Free' : formatPrice(shipping);
  cartTotalEl.textContent = formatPrice(total);

  cartList.innerHTML = cart.map(item => `
    <li class="cart-item" data-id="${item.id}">
      <img
        class="cart-item-img"
        src="${item.image}"
        alt="${item.name}"
        loading="lazy"
        width="64"
        height="64"
      />
      <div class="cart-item-info">
        <p class="cart-item-name" title="${item.name}">${item.name}</p>
        <p class="cart-item-price">${formatPrice(item.price * item.qty)}</p>
      </div>
      <div class="cart-item-controls">
        <div class="qty-row">
          <button class="qty-btn" data-action="dec" data-id="${item.id}">−</button>
          <span class="qty-value">${item.qty}</span>
          <button class="qty-btn" data-action="inc" data-id="${item.id}">+</button>
        </div>
        <button class="remove-btn" data-id="${item.id}">Remove</button>
      </div>
    </li>
  `).join('');

  cartList.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      btn.dataset.action === 'inc' ? increaseQty(id) : decreaseQty(id);
    });
  });

  cartList.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(Number(btn.dataset.id)));
  });
}

function openCart() {
  cartDrawer.classList.add('open');
  cartOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartDrawer.classList.remove('open');
  cartOverlay.classList.remove('open');
  document.body.style.overflow = '';
}



document.getElementById('cart-toggle').addEventListener('click', openCart);
document.getElementById('cart-close').addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

document.getElementById('clear-cart-btn').addEventListener('click', clearCart);

document.getElementById('checkout-btn').addEventListener('click', () => {
  if (cart.length === 0) return;
  showToast('✅ Order placed! Thank you for shopping.');
  clearCart();
  closeCart();
});


filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.cat;
    renderProducts();
  });
});


sortSelect.addEventListener('change', () => {
  activeSort = sortSelect.value;
  renderProducts();
});


window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true }); 
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeCart();
});


renderProducts();
updateCartUI();
