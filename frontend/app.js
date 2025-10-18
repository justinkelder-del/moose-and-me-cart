// Basic cart + catalog logic (localStorage cart, server-backed checkout)
const fmt = new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'});

const CART_KEY = 'mm_cart_v1';
function getCart(){ try { return JSON.parse(localStorage.getItem(CART_KEY))||[] } catch { return [] } }
function setCart(items){ localStorage.setItem(CART_KEY, JSON.stringify(items)); updateCartCount(); }

function updateCartCount(){
  const el = document.getElementById('cartCount');
  if (el) el.textContent = String(getCart().reduce((sum,i)=>sum+Number(i.quantity||1),0));
}
updateCartCount();

async function loadCatalog(){
  const res = await fetch('/api/catalog');
  const data = await res.json();
  return data.items || [];
}

function addToCart(item){
  const cart = getCart();
  const found = cart.find(i => i.variationId === item.variationId);
  if(found){ found.quantity += 1; } else { cart.push({...item, quantity:1}); }
  setCart(cart);
  alert('Added to cart!');
}

function renderGrid(items){
  const grid = document.getElementById('grid');
  if (!grid) return;
  grid.innerHTML = '';
  items.forEach(it => {
    const price = it.priceMoney ? fmt.format(it.priceMoney.amount/100) : '';
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img class="card-media" src="${it.imageUrl || './placeholder.jpg'}" alt="${it.name || 'Product'}" />
      <div class="card-body">
        <h3 class="card-title">${it.name||''}</h3>
        <div class="card-price">${price}</div>
        <button class="btn btn-accent">Add to Cart</button>
      </div>
    `;
    card.querySelector('button').addEventListener('click', ()=> addToCart(it));
    grid.appendChild(card);
  });
}

async function bootIndex(){
  if (!document.getElementById('grid')) return;
  const items = await loadCatalog();
  renderGrid(items);
}

function renderCart(){
  const list = document.getElementById('cartList');
  const totalEl = document.getElementById('cartTotal');
  if (!list || !totalEl) return;
  const cart = getCart();
  list.innerHTML = '';
  let total = 0;
  cart.forEach((it, idx) => {
    const price = it.priceMoney ? it.priceMoney.amount/100 : 0;
    const subtotal = price * (it.quantity||1);
    total += subtotal;
    const row = document.createElement('div'); row.className = 'cart-item';
    row.innerHTML = `
      <div><strong>${it.name||'Item'}</strong><div class="muted">${fmt.format(price)} each</div></div>
      <div class="qty">
        <label class="sr-only" for="q_${idx}">Quantity</label>
        <input id="q_${idx}" type="number" min="1" value="${it.quantity||1}" />
      </div>
      <div>
        <div>${fmt.format(subtotal)}</div>
        <a href="#" data-remove="${idx}">Remove</a>
      </div>
    `;
    row.querySelector('input').addEventListener('change', (e)=>{
      const val = Math.max(1, parseInt(e.target.value||'1',10));
      const cart2 = getCart(); cart2[idx].quantity = val; setCart(cart2); renderCart();
    });
    row.querySelector('[data-remove]').addEventListener('click', (e)=>{
      e.preventDefault();
      const cart2 = getCart(); cart2.splice(idx,1); setCart(cart2); renderCart();
    });
    list.appendChild(row);
  });
  totalEl.textContent = fmt.format(total);
}

async function checkout(){
  const items = getCart().map(it => ({
    variationId: it.variationId,
    name: it.name,
    quantity: it.quantity
  }));
  const res = await fetch('/api/checkout', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ items, redirectUrl: window.location.origin + '/thank-you.html' })
  });
  const data = await res.json();
  if (data.checkoutUrl) {
    window.location.href = data.checkoutUrl;
  } else {
    alert('Checkout failed: ' + (data.error||'Unknown error'));
  }
}

async function bootCart(){
  if (!document.getElementById('cartList')) return;
  renderCart();
  const btn = document.getElementById('checkoutBtn');
  btn.addEventListener('click', checkout);
}

document.addEventListener('DOMContentLoaded', ()=>{
  bootIndex();
  bootCart();
});
