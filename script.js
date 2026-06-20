/* =========================================================
   NOVA STORE — Script
   ========================================================= */

// CHANGE WHATSAPP NUMBER HERE (international format, no + or spaces)
const WHATSAPP_NUMBER = "15551234567";

let cart = [];

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initHamburger();
  initScrollReveal();
  initFAQ();
  initAddToCart();
  initCartUI();
  document.getElementById('year').textContent = new Date().getFullYear();
});

/* ---------- Sticky Nav active link close on click (mobile) ---------- */
function initNav(){
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById('navLinks').classList.remove('active');
    });
  });
}

/* ---------- Hamburger Menu ---------- */
function initHamburger(){
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

/* ---------- Scroll Reveal Animation ---------- */
function initScrollReveal(){
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(el => observer.observe(el));
}

/* ---------- FAQ Accordion ---------- */
function initFAQ(){
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if(!isActive){
        item.classList.add('active');
      }
    });
  });
}

/* ---------- Add to Cart ---------- */
function initAddToCart(){
  const buttons = document.querySelectorAll('.add-cart-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.product-card');
      const id = card.dataset.id;
      const name = card.dataset.name;
      const price = parseFloat(card.dataset.price);

      const existing = cart.find(item => item.id === id);
      if(existing){
        existing.qty += 1;
      } else {
        cart.push({ id, name, price, qty: 1 });
      }

      updateCartUI();
      showToast(`${name} added to cart`);
    });
  });
}

/* ---------- Cart UI ---------- */
function initCartUI(){
  const cartBtn = document.getElementById('cartBtn');
  const cartSidebar = document.getElementById('cartSidebar');
  const cartOverlay = document.getElementById('cartOverlay');
  const closeCart = document.getElementById('closeCart');
  const checkoutBtn = document.getElementById('checkoutBtn');

  cartBtn.addEventListener('click', () => {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
  });

  const close = () => {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
  };

  closeCart.addEventListener('click', close);
  cartOverlay.addEventListener('click', close);

  checkoutBtn.addEventListener('click', checkoutViaWhatsApp);
}

function updateCartUI(){
  const cartItems = document.getElementById('cartItems');
  const cartCount = document.getElementById('cartCount');
  const cartTotal = document.getElementById('cartTotal');
  const cartEmpty = document.getElementById('cartEmpty');

  cartItems.innerHTML = '';

  if(cart.length === 0){
    cartItems.innerHTML = '<p class="cart-empty" id="cartEmpty">Your cart is empty.</p>';
    cartCount.textContent = '0';
    cartTotal.textContent = '$0.00';
    return;
  }

  let total = 0;
  let totalQty = 0;

  cart.forEach(item => {
    total += item.price * item.qty;
    totalQty += item.qty;

    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.innerHTML = `
      <div class="cart-item-img"></div>
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <span class="item-price">$${item.price.toFixed(2)} x ${item.qty}</span>
        <div class="qty-control">
          <button class="decrease" data-id="${item.id}">-</button>
          <span>${item.qty}</span>
          <button class="increase" data-id="${item.id}">+</button>
        </div>
        <div class="remove-item" data-id="${item.id}">Remove</div>
      </div>
    `;
    cartItems.appendChild(itemEl);
  });

  cartCount.textContent = totalQty;
  cartTotal.textContent = `$${total.toFixed(2)}`;

  // Attach quantity & remove listeners
  cartItems.querySelectorAll('.increase').forEach(btn => {
    btn.addEventListener('click', () => changeQty(btn.dataset.id, 1));
  });
  cartItems.querySelectorAll('.decrease').forEach(btn => {
    btn.addEventListener('click', () => changeQty(btn.dataset.id, -1));
  });
  cartItems.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', () => removeItem(btn.dataset.id));
  });
}

function changeQty(id, delta){
  const item = cart.find(i => i.id === id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0){
    cart = cart.filter(i => i.id !== id);
  }
  updateCartUI();
}

function removeItem(id){
  cart = cart.filter(i => i.id !== id);
  updateCartUI();
}

/* ---------- WhatsApp Checkout ---------- */
function checkoutViaWhatsApp(){
  if(cart.length === 0){
    showToast('Your cart is empty');
    return;
  }

  let message = "Hello NOVA STORE! I'd like to place an order:%0A%0A";
  let total = 0;

  cart.forEach(item => {
    const lineTotal = item.price * item.qty;
    total += lineTotal;
    message += `• ${item.name} — Qty: ${item.qty} — $${item.price.toFixed(2)} each = $${lineTotal.toFixed(2)}%0A`;
  });

  message += `%0AOrder Total: $${total.toFixed(2)}`;

  // CHANGE WHATSAPP NUMBER HERE
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  window.open(url, '_blank');
}

/* ---------- Toast Notification ---------- */
let toastTimeout;
function showToast(msg){
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

/* ---------- Navbar shadow on scroll ---------- */
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if(window.scrollY > 10){
    navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
  } else {
    navbar.style.boxShadow = 'none';
  }
});
