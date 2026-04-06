function ensureStorages(p) {
  if (p.storages && p.storages.length) return p;
  return {
    ...p,
    storages: [
      {
        gb: p.gb ?? null,
        price: p.price ?? 0,
        colors: [{ key: "default", name: "", hex: "#888888" }],
      },
    ],
    skuBase: p.skuBase || `PS-${p.id}`,
  };
}

const products = (typeof PHONE_PRODUCTS !== "undefined" ? PHONE_PRODUCTS : []).map(ensureStorages);

function storageLabelGb(gb) {
  if (gb == null || gb === "") return "";
  if (gb >= 1024) return `${gb / 1024}TB`;
  return `${gb}GB`;
}

function productMinPrice(p) {
  const st = p.storages;
  if (!st || !st.length) return 0;
  return Math.min(...st.map((s) => s.price));
}

function buildSku(p, storage, colorKey) {
  const base = p.skuBase || "SKU";
  const g = storage && storage.gb != null ? storage.gb : "STD";
  return `${base}-${g}-${String(colorKey).toUpperCase()}`;
}

function cartThumbFromPhoto(photo) {
  let img = photo || "images/default-phone.jpg";
  if (typeof img === "string" && img.startsWith("photo-")) {
    img = `https://images.unsplash.com/${img}?auto=format&fit=crop&w=300&q=80`;
  }
  return img;
}

function variantLabelText(storage, color) {
  const s = storageLabelGb(storage.gb);
  const n = (color && color.name) || "";
  if (s && n) return `${s} · ${n}`;
  if (s) return s;
  return n || "Phiên bản tiêu chuẩn";
}

function resolveVariantInner(p, storage, color) {
  const photo = color.photo || p.photo;
  return {
    storageGb: storage.gb,
    colorKey: color.key,
    price: storage.price,
    sku: buildSku(p, storage, color.key),
    label: variantLabelText(storage, color),
    thumb: cartThumbFromPhoto(photo),
    storage,
    color,
  };
}

function findVariant(p, gb, colorKey) {
  const storages = p.storages || [];
  const storage = storages.find((x) => x.gb === gb) || storages[0];
  const color = storage.colors.find((c) => c.key === colorKey) || storage.colors[0];
  return resolveVariantInner(p, storage, color);
}

function getDefaultVariantSelection(p) {
  const s0 = p.storages[0];
  return resolveVariantInner(p, s0, s0.colors[0]);
}

function makeLineId(productId, gb, colorKey) {
  const g = gb == null ? "x" : String(gb);
  return `${productId}:${g}:${colorKey}`;
}

function cartLineKey(c) {
  return c.lineId != null ? c.lineId : String(c.id);
}

function productHasVariantUI(p) {
  const st = p.storages || [];
  if (!st.length) return false;
  if (st.length > 1) return true;
  return st[0].colors.length > 1;
}

const formatPrice = (n) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(n);

const brandLabel = (b) =>
  ({ iphone: "iPhone", samsung: "Samsung", xiaomi: "Xiaomi" }[b] || b);

const prefersReducedMotion = () =>
  typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  
const FREE_SHIP_THRESHOLD = 2000000;
const SHIP_FEE = 30000;
const CART_SESSION_KEY = "phonestore_cart_session";


let cart = [];
let sessionUser = null;
let brandFilter = "all";
let searchQuery = "";
let heroRotateIndex = 0;
let statsAnimated = false;
let productGridAnimated = false;

const heroEyebrows = [
  "Ưu đãi tháng 4",
  "Flash sale cuối tuần",
  "Mở bán flagship mới",
];

const heroLeads = [
  "iPhone, Samsung, Xiaomi chính hãng, bảo hành 12 tháng. Đổi cũ lấy mới hỗ trợ tối đa.",
  "Giao nhanh 2–24h nội thành. Kiểm tra máy tại nhà trước khi nhận.",
  "Trả góp 0% qua thẻ tín dụng. Tư vấn gói phù hợp ngân sách của bạn.",
];

function productImageSet(p) {
  // Ưu tiên ảnh cục bộ, fallback về Unsplash nếu cần
  let main = p.photo || "images/default-phone.jpg";
  let hover = p.photoHover || null;

  // Nếu là ID Unsplash cũ (photo-xxx) thì chuyển sang URL đầy đủ
  if (typeof main === "string" && main.startsWith("photo-")) {
    main = `https://images.unsplash.com/${main}?auto=format&fit=crop&w=800&q=85`;
  }
  if (hover && typeof hover === "string" && hover.startsWith("photo-")) {
    hover = `https://images.unsplash.com/${hover}?auto=format&fit=crop&w=800&q=85`;
  }

  return { main, hover };
}

/** Ảnh trong /san-pham/*.html cần tiền tố ../ */
function pdpAsset(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path) || path.startsWith("//")) return path;
  const clean = path.replace(/^\.\//, "");
  if (clean.startsWith("../") || clean.startsWith("/")) return clean;
  return `../${clean}`;
}

function needsAssetParent() {
  try {
    const p = window.location.pathname.replace(/\\/g, "/");
    return /\/(san-pham|chinh-sach)\//i.test(p);
  } catch {
    return false;
  }
}

function cartItemImgSrc(stored) {
  if (!stored) return "";
  if (/^https?:\/\//i.test(stored) || stored.startsWith("//")) return stored;
  if (stored.startsWith("../") || stored.startsWith("/")) return stored;
  if (needsAssetParent()) return `../${stored.replace(/^\.\//, "")}`;
  return stored;
}

function cartThumbForProduct(p) {
  return cartThumbFromPhoto(p.photo);
}

function loadCart() {
  try {
    const raw = sessionStorage.getItem(CART_SESSION_KEY);
    cart = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(cart)) cart = [];
    cart = cart.map((c) => {
      if (c.lineId != null) return c;
      const pid = String(c.id);
      return {
        ...c,
        lineId: pid,
        productId: c.productId || pid,
        variantLabel: c.variantLabel || "",
      };
    });
  } catch {
    cart = [];
  }
}

function saveCart() {
  try {
    sessionStorage.setItem(CART_SESSION_KEY, JSON.stringify(cart));
  } catch {
  
  }
  updateCartUI();
}

function showToast(message) {
  const host = document.getElementById("toastHost");
  if (!host) return;
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = message;
  host.appendChild(el);
  const remove = () => {
    el.classList.add("is-out");
    setTimeout(() => el.remove(), 280);
  };
  setTimeout(remove, 3200);
}

function pulseBadge() {
  const badge = document.getElementById("cartBadge");
  if (!badge || prefersReducedMotion()) return;
  badge.classList.remove("is-pop");
  void badge.offsetWidth;
  badge.classList.add("is-pop");
  setTimeout(() => badge.classList.remove("is-pop"), 500);
}

function addToCart(productId, selection) {
  const p = products.find((x) => x.id === productId);
  if (!p) return;
  const v = selection
    ? findVariant(p, selection.storageGb, selection.colorKey)
    : getDefaultVariantSelection(p);
  const lineId = makeLineId(productId, v.storageGb, v.colorKey);
  const existing = cart.find((c) => cartLineKey(c) === lineId);
  if (existing) existing.qty += 1;
  else {
    cart.push({
      lineId,
      productId: p.id,
      name: p.name,
      variantLabel: v.label,
      price: v.price,
      sku: v.sku,
      image: v.thumb,
      qty: 1,
    });
  }
  saveCart();
  pulseBadge();
  showToast(`Đã thêm «${p.name}» (${v.label}) vào giỏ`);
}

function removeFromCart(lineId) {
  cart = cart.filter((c) => cartLineKey(c) !== lineId);
  saveCart();
}

function clearCart() {
  cart = [];
  saveCart();
  showToast("Đã xóa toàn bộ giỏ hàng");
}

function setCartQty(lineId, nextQty) {
  const q = Math.max(0, Math.min(99, Math.floor(Number(nextQty))));
  const line = cart.find((c) => cartLineKey(c) === lineId);
  if (!line) return;
  if (q <= 0) removeFromCart(lineId);
  else {
    line.qty = q;
    saveCart();
  }
}

function changeCartQty(lineId, delta) {
  const line = cart.find((c) => cartLineKey(c) === lineId);
  if (!line) return;
  setCartQty(lineId, line.qty + delta);
}

function cartCount() {
  return cart.reduce((s, c) => s + c.qty, 0);
}

function cartSubtotal() {
  return cart.reduce((s, c) => s + c.price * c.qty, 0);
}

function cartShipping(sub) {
  if (!cart.length) return 0;
  return sub >= FREE_SHIP_THRESHOLD ? 0 : SHIP_FEE;
}

function cartTotal() {
  const sub = cartSubtotal();
  return sub + cartShipping(sub);
}

function syncProductVisibility() {
  const q = searchQuery.trim().toLowerCase();
  document.querySelectorAll(".product-card").forEach((card) => {
    const b = card.dataset.brand;
    const slug = (card.dataset.search || "").toLowerCase();
    const brandOk = brandFilter === "all" || b === brandFilter;
    const searchOk = !q || slug.includes(q);
    card.classList.toggle("hidden", !(brandOk && searchOk));
  });
}

function renderProducts() {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = products
    .map((p) => {
      const { main, hover } = productImageSet(p);
      const hoverLayer = hover
        ? `<img class="product-card__img product-card__img--hover" src="${hover}" alt="" loading="lazy" decoding="async" width="800" height="600" aria-hidden="true" />`
        : "";
      return `
        <article class="product-card reveal-card${hover ? " has-hover-img" : ""}" data-brand="${p.brand}" data-search="${p.name.toLowerCase()}">
          <a class="product-card__media" href="san-pham/${p.slug}.html" aria-label="Xem ${p.name}">
            <img class="product-card__img product-card__img--main" src="${main}" alt="${p.name}" loading="lazy" decoding="async" width="800" height="600" />
            ${hoverLayer}
          </a>
          <div class="product-card__body">
            <p class="product-card__brand">${brandLabel(p.brand)}</p>
            <h3><a class="product-card__title-link" href="san-pham/${p.slug}.html">${p.name}</a></h3>
            <p class="product-card__price">${
              productHasVariantUI(p)
                ? `<span class="product-card__price-from">Chỉ từ</span> ${formatPrice(productMinPrice(p))}`
                : formatPrice(productMinPrice(p))
            }</p>
            <div class="product-card__actions">
              <a class="btn btn--ghost btn--sm" href="san-pham/${p.slug}.html">Chi tiết</a>
              <button type="button" class="btn btn--primary btn--sm add-cart" data-id="${p.id}">Thêm vào giỏ</button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  grid.querySelectorAll(".add-cart").forEach((btn) => {
    btn.addEventListener("click", () => addToCart(btn.dataset.id));
  });
  syncProductVisibility();
  setupProductGridReveal();
}

function applyFilter(filter) {
  brandFilter = filter;
  document.querySelectorAll(".filter-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.filter === filter);
  });
  syncProductVisibility();
  revealVisibleCardsQuick();
}

function revealVisibleCardsQuick() {
  if (prefersReducedMotion()) {
    document.querySelectorAll(".product-card:not(.hidden)").forEach((c) => c.classList.add("is-visible"));
    return;
  }
  document.querySelectorAll(".product-card:not(.hidden)").forEach((c) => {
    if (!c.classList.contains("is-visible")) c.classList.add("is-visible");
  });
}

function setupProductGridReveal() {
  const grid = document.getElementById("productGrid");
  if (!grid || productGridAnimated) return;

  const runStagger = () => {
    productGridAnimated = true;
    const cards = [...grid.querySelectorAll(".product-card:not(.hidden)")];
    if (prefersReducedMotion()) {
      cards.forEach((c) => c.classList.add("is-visible"));
      return;
    }
    cards.forEach((card, i) => {
      setTimeout(() => card.classList.add("is-visible"), i * 75);
    });
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        runStagger();
        io.disconnect();
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
  );
  io.observe(grid);
}

function bindCartListEvents() {
  const list = document.getElementById("cartList");
  if (!list.dataset.bound) {
    list.dataset.bound = "1";
    list.addEventListener("click", (e) => {
      const rm = e.target.closest(".cart-item__remove");
      if (rm) {
        removeFromCart(rm.dataset.lineId);
        return;
      }
      const minus = e.target.closest(".qty-btn--minus");
      const plus = e.target.closest(".qty-btn--plus");
      if (minus) changeCartQty(minus.dataset.lineId, -1);
      if (plus) changeCartQty(plus.dataset.lineId, 1);
    });
  }
}

function updateCartUI() {
  const badge = document.getElementById("cartBadge");
  const list = document.getElementById("cartList");
  const totalEl = document.getElementById("cartTotal");
  const subEl = document.getElementById("cartSubtotal");
  const shipEl = document.getElementById("cartShipFee");
  const shipHint = document.getElementById("cartShipHint");
  const drawerCount = document.getElementById("cartDrawerCount");
  const clearBtn = document.getElementById("cartClearBtn");

  const n = cartCount();
  const sub = cartSubtotal();
  const ship = cartShipping(sub);
  const grand = sub + ship;

  badge.textContent = n;
  badge.style.display = n ? "grid" : "none";

  if (drawerCount) drawerCount.textContent = n ? `(${n})` : "";

  if (clearBtn) {
    clearBtn.hidden = !cart.length;
  }

  if (!cart.length) {
    list.innerHTML = '<li class="cart-empty">Giỏ hàng đang trống.<br /><span class="cart-empty__hint">Thêm sản phẩm để xem phí ship &amp; tổng tiền.</span></li>';
    if (shipHint) shipHint.textContent = "";
  } else {
    list.innerHTML = cart
      .map((c) => {
        const line = c.price * c.qty;
        const thumbSrc = cartItemImgSrc(c.image);
        const lk = escapeHtml(cartLineKey(c));
        const vLabel = c.variantLabel ? `<p class="cart-item__variant">${escapeHtml(c.variantLabel)}</p>` : "";
        return `
      <li class="cart-item">
        <img src="${thumbSrc}" alt="" class="cart-item__thumb" width="72" height="72" loading="lazy" decoding="async" />
        <div class="cart-item__body">
          <h4 class="cart-item__title">${escapeHtml(c.name)}</h4>
          ${vLabel}
          <p class="cart-item__unit">${formatPrice(c.price)} / sản phẩm</p>
          <div class="cart-item__row">
            <div class="qty-stepper" role="group" aria-label="Số lượng">
              <button type="button" class="qty-btn qty-btn--minus" data-line-id="${lk}" aria-label="Giảm">−</button>
              <span class="qty-val">${c.qty}</span>
              <button type="button" class="qty-btn qty-btn--plus" data-line-id="${lk}" aria-label="Tăng">+</button>
            </div>
            <strong class="cart-item__line">${formatPrice(line)}</strong>
          </div>
        </div>
        <button type="button" class="cart-item__remove" data-line-id="${lk}" aria-label="Xóa khỏi giỏ">×</button>
      </li>
    `;
      })
      .join("");
    bindCartListEvents();

    if (shipHint) {
      if (ship === 0) {
        shipHint.textContent = `Đơn của bạn được miễn phí giao hàng (từ ${formatPrice(FREE_SHIP_THRESHOLD)}).`;
      } else {
        const need = FREE_SHIP_THRESHOLD - sub;
        shipHint.textContent = `Mua thêm ${formatPrice(need)} để được miễn phí ship.`;
      }
    }
  }

  if (subEl) subEl.textContent = formatPrice(sub);
  if (shipEl) shipEl.textContent = ship === 0 ? "Miễn phí" : formatPrice(ship);
  if (totalEl) totalEl.textContent = formatPrice(grand);
}

function syncBodyScrollLock() {
  const cartOpen = document.getElementById("cartDrawer")?.classList.contains("is-open");
  const authOpen =
    document.getElementById("loginModal")?.classList.contains("is-open") ||
    document.getElementById("registerModal")?.classList.contains("is-open");
  document.body.style.overflow = cartOpen || authOpen ? "hidden" : "";
}

function openCart() {
  document.getElementById("cartDrawer").classList.add("is-open");
  document.getElementById("cartDrawer").setAttribute("aria-hidden", "false");
  syncBodyScrollLock();
}

function closeCart() {
  document.getElementById("cartDrawer").classList.remove("is-open");
  document.getElementById("cartDrawer").setAttribute("aria-hidden", "true");
  syncBodyScrollLock();
}

function getSession() {
  return sessionUser;
}

function setSession(user) {
  sessionUser = user || null;
}

function updateAuthHeader() {
  const wrap = document.getElementById("authHeader");
  if (!wrap) return;
  const s = getSession();
  if (s) {
    wrap.innerHTML = `
      <span class="header__greet">Xin chào, <strong>${escapeHtml(s.name)}</strong></span>
      <button type="button" class="btn-text" id="logoutBtn">Đăng xuất</button>
    `;
  } else {
    wrap.innerHTML = `
      <div class="header__auth-btns">
        <button type="button" class="btn-text" id="loginOpenBtn">Đăng nhập</button>
        <button type="button" class="btn-text btn-text--secondary" id="registerOpenBtn">Đăng ký</button>
      </div>
    `;
  }
}

function escapeHtml(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

function initProductDetailPage() {
  const root = document.querySelector("[data-product-slug]");
  if (!root) return;
  const slug = root.dataset.productSlug;
  const p = products.find((x) => x.slug === slug);
  const mount = document.getElementById("pdpMount");
  if (!mount) return;
  if (!p) {
    mount.innerHTML = `<div class="container pdp-missing"><p>Không tìm thấy sản phẩm.</p><p><a href="../index.html">Về trang chủ</a></p></div>`;
    return;
  }

  const storages = p.storages || [];
  const showVariantPickers = productHasVariantUI(p);
  const v0 = getDefaultVariantSelection(p);

  document.title = `${p.name} | Rio Store`;
  const mainUrl = pdpAsset(p.photo);
  const hoverUrl = p.photoHover ? pdpAsset(p.photoHover) : null;
  const highlights = (p.highlights || []).map((t) => `<li>${escapeHtml(t)}</li>`).join("");

  const thumbs = [
    `<button type="button" class="pdp-thumb is-active" data-src="${mainUrl}" aria-label="Ảnh 1"><img src="${mainUrl}" alt="" width="80" height="80" loading="lazy" decoding="async" /></button>`,
  ];
  if (hoverUrl) {
    thumbs.push(
      `<button type="button" class="pdp-thumb" data-src="${hoverUrl}" aria-label="Ảnh 2"><img src="${hoverUrl}" alt="" width="80" height="80" loading="lazy" decoding="async" /></button>`
    );
  }

  const storageButtonsHtml = storages
    .map((s) => {
      const label = storageLabelGb(s.gb) || "Tiêu chuẩn";
      const active = s.gb === v0.storageGb ? " is-active" : "";
      return `<button type="button" class="pdp-storage-btn${active}" data-gb="${s.gb == null ? "" : s.gb}" aria-pressed="${s.gb === v0.storageGb}">${escapeHtml(label)}</button>`;
    })
    .join("");

  const colorsHtml = (storage) =>
    storage.colors
      .map((c) => {
        const active = c.key === v0.colorKey ? " is-active" : "";
        const hx = c.hex ? escapeHtml(c.hex) : "#888888";
        return `<button type="button" class="pdp-color-btn${active}" data-color="${escapeHtml(c.key)}" title="${escapeHtml(c.name)}" aria-pressed="${c.key === v0.colorKey}">
        <span class="pdp-color-swatch" style="--pdp-swatch:${hx}"></span>
        <span class="pdp-color-name">${escapeHtml(c.name)}</span>
      </button>`;
      })
      .join("");

  let related = products.filter((x) => x.id !== p.id && x.brand === p.brand).slice(0, 3);
  if (related.length === 0) related = products.filter((x) => x.id !== p.id).slice(0, 3);

  const relatedHtml = related
    .map((x) => {
      const img = pdpAsset(x.photo);
      const px = productHasVariantUI(x)
        ? `<span class="product-card__price-from">Chỉ từ</span> ${formatPrice(productMinPrice(x))}`
        : formatPrice(productMinPrice(x));
      return `<article class="product-card product-card--static product-card--compact">
        <a href="${x.slug}.html" class="product-card__media"><img src="${img}" alt="${escapeHtml(x.name)}" loading="lazy" width="400" height="300" /></a>
        <div class="product-card__body">
          <p class="product-card__brand">${brandLabel(x.brand)}</p>
          <h3><a class="product-card__title-link" href="${x.slug}.html">${escapeHtml(x.name)}</a></h3>
          <p class="product-card__price">${px}</p>
        </div>
      </article>`;
    })
    .join("");

  const variantBlockHtml = showVariantPickers
    ? `<div class="pdp-variants" id="pdpVariants">
        <div class="pdp-variant-block">
          <span class="pdp-variant-block__label">Dung lượng</span>
          <div class="pdp-variant-row pdp-storage-row" role="group" aria-label="Chọn dung lượng">${storageButtonsHtml}</div>
        </div>
        <div class="pdp-variant-block">
          <span class="pdp-variant-block__label">Màu sắc</span>
          <div class="pdp-variant-row pdp-color-row" id="pdpColorRow" role="list">${colorsHtml(v0.storage)}</div>
        </div>
      </div>`
    : "";

  mount.innerHTML = `
    <div class="container">
      <nav class="breadcrumb" aria-label="Danh mục">
        <a href="../index.html">Trang chủ</a>
        <span class="breadcrumb__sep" aria-hidden="true">/</span>
        <a href="../index.html#san-pham">Điện thoại</a>
        <span class="breadcrumb__sep" aria-hidden="true">/</span>
        <span class="breadcrumb__current">${escapeHtml(p.name)}</span>
      </nav>
      <div class="pdp-layout">
        <div class="pdp-gallery">
          <div class="pdp-gallery__main pdp-gallery__main--shine">
            <img id="pdpMainImg" class="pdp-main-photo" src="${mainUrl}" alt="${escapeHtml(p.name)}" width="900" height="675" decoding="async" />
          </div>
          <div class="pdp-gallery__thumbs" role="tablist">${thumbs.join("")}</div>
        </div>
        <div class="pdp-buy">
          <p class="pdp-buy__brand">${brandLabel(p.brand)} · Chính hãng</p>
          <h1 class="pdp-buy__title">${escapeHtml(p.name)}</h1>
          <p class="pdp-buy__config" id="pdpVariantLabel">${escapeHtml(v0.label)}</p>
          <p class="pdp-buy__sku">Mã: <strong id="pdpSku">${escapeHtml(v0.sku)}</strong></p>
          <p class="pdp-buy__price" id="pdpPrice">${formatPrice(v0.price)}</p>
          ${variantBlockHtml}
          <p class="pdp-buy__promo">Giao nhanh · Miễn phí ship đơn từ 2.000.000₫ · Trả góp 0% qua thẻ</p>
          <ul class="pdp-highlights">${highlights}</ul>
          <div class="pdp-trust">
            <span>Bảo hành 12 tháng</span>
            <span>Đổi trả trong 7 ngày</span>
            <span>Xuất VAT đầy đủ</span>
          </div>
          <div class="pdp-actions">
            <button type="button" class="btn btn--primary btn--lg" id="pdpAddCart">Thêm vào giỏ hàng</button>
            <a href="../index.html#san-pham" class="btn btn--ghost btn--lg">Tiếp tục mua sắm</a>
          </div>
        </div>
      </div>
      <section class="pdp-related" aria-labelledby="pdp-related-title">
        <h2 id="pdp-related-title" class="pdp-related__title">Có thể bạn cũng thích</h2>
        <div class="products products--related">${relatedHtml}</div>
      </section>
    </div>
  `;

  const mainImg = document.getElementById("pdpMainImg");
  mount.querySelectorAll(".pdp-thumb").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!mainImg) return;
      const nextSrc = btn.dataset.src;
      if (mainImg.getAttribute("src") === nextSrc) {
        mount.querySelectorAll(".pdp-thumb").forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        return;
      }
      const onLoaded = () => {
        mainImg.style.opacity = "";
        mainImg.style.transition = "";
      };
      if (!prefersReducedMotion()) {
        mainImg.style.transition = "opacity 0.2s ease";
        mainImg.style.opacity = "0.65";
        mainImg.addEventListener("load", onLoaded, { once: true });
      }
      mainImg.src = nextSrc;
      mount.querySelectorAll(".pdp-thumb").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      if (prefersReducedMotion()) onLoaded();
    });
  });

  let selGb = v0.storageGb;
  let selColorKey = v0.colorKey;

  function currentStorage() {
    return storages.find((s) => s.gb === selGb) || storages[0];
  }

  function paintVariant() {
    const s = currentStorage();
    const col = s.colors.find((c) => c.key === selColorKey) || s.colors[0];
    selColorKey = col.key;
    const v = resolveVariantInner(p, s, col);
     document.getElementById("pdpPrice").textContent = formatPrice(v.price);
  document.getElementById("pdpSku").textContent = v.sku;
  document.getElementById("pdpVariantLabel").textContent = v.label;

  // 👉 THÊM ĐOẠN NÀY
  if (mainImg) {
    const nextImg = col.img || p.photo;

    if (!prefersReducedMotion()) {
      mainImg.style.transition = "opacity 0.2s ease";
      mainImg.style.opacity = "0.6";
      mainImg.onload = () => {
        mainImg.style.opacity = "1";
      };
    }

    mainImg.src = pdpAsset(nextImg);
  }

    const priceEl = document.getElementById("pdpPrice");
    const skuEl = document.getElementById("pdpSku");
    const labelEl = document.getElementById("pdpVariantLabel");
    if (priceEl) priceEl.textContent = formatPrice(v.price);
    if (skuEl) skuEl.textContent = v.sku;
    if (labelEl) labelEl.textContent = v.label;

    mount.querySelectorAll(".pdp-storage-btn").forEach((b) => {
      const g = b.dataset.gb === "" ? null : Number(b.dataset.gb);
      const on = g === selGb || (Number.isNaN(g) && selGb == null);
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });

    const colorRow = document.getElementById("pdpColorRow");
    if (colorRow) {
      colorRow.innerHTML = colorsHtml(s);
      colorRow.querySelectorAll(".pdp-color-btn").forEach((b) => {
        b.addEventListener("click", () => {
          selColorKey = b.dataset.color;
          paintVariant();
        });
      });
    }
  }

  if (showVariantPickers) {
    mount.querySelectorAll(".pdp-storage-btn").forEach((b) => {
      b.addEventListener("click", () => {
        const raw = b.dataset.gb;
        selGb = raw === "" ? null : Number(raw);
        const ns = currentStorage();
        selColorKey = ns.colors[0].key;
        paintVariant();
      });
    });
    const colorRow = document.getElementById("pdpColorRow");
    if (colorRow) {
      colorRow.querySelectorAll(".pdp-color-btn").forEach((b) => {
        b.addEventListener("click", () => {
          selColorKey = b.dataset.color;
          paintVariant();
        });
      });
    }
  } else {
    const labelEl = document.getElementById("pdpVariantLabel");
    if (labelEl) labelEl.hidden = true;
  }

  document.getElementById("pdpAddCart")?.addEventListener("click", () => {
    addToCart(p.id, { storageGb: selGb, colorKey: selColorKey });
  });
}

function authModalOpen(id) {
  const m = document.getElementById(id);
  if (!m) return;
  m.classList.add("is-open");
  m.setAttribute("aria-hidden", "false");
  syncBodyScrollLock();
}

function authModalClose(id) {
  const m = document.getElementById(id);
  if (!m) return;
  m.classList.remove("is-open");
  m.setAttribute("aria-hidden", "true");
  if (id === "loginModal") document.getElementById("loginError")?.setAttribute("hidden", "");
  if (id === "registerModal") document.getElementById("registerError")?.setAttribute("hidden", "");
  syncBodyScrollLock();
}

function closeAllAuthModals() {
  ["loginModal", "registerModal"].forEach((id) => {
    const m = document.getElementById(id);
    if (!m) return;
    m.classList.remove("is-open");
    m.setAttribute("aria-hidden", "true");
  });
  document.getElementById("loginError")?.setAttribute("hidden", "");
  document.getElementById("registerError")?.setAttribute("hidden", "");
  syncBodyScrollLock();
}

function openLoginModal() {
  authModalClose("registerModal");
  authModalOpen("loginModal");
  document.querySelector("#formLogin input[name=email]")?.focus();
}

function openRegisterModal() {
  authModalClose("loginModal");
  authModalOpen("registerModal");
  document.querySelector("#formRegister input[name=name]")?.focus();
}

function initAuthModal() {
  document.querySelector(".header__inner")?.addEventListener("click", (e) => {
    if (e.target.closest("#loginOpenBtn")) {
      e.preventDefault();
      openLoginModal();
    }
    if (e.target.closest("#registerOpenBtn")) {
      e.preventDefault();
      openRegisterModal();
    }
    if (e.target.closest("#logoutBtn")) {
      e.preventDefault();
      setSession(null);
      updateAuthHeader();
      showToast("Đã đăng xuất");
    }
  });

  document.getElementById("loginOverlay")?.addEventListener("click", () => closeAllAuthModals());
  document.getElementById("loginClose")?.addEventListener("click", () => closeAllAuthModals());
  document.getElementById("registerOverlay")?.addEventListener("click", () => closeAllAuthModals());
  document.getElementById("registerClose")?.addEventListener("click", () => closeAllAuthModals());

  document.getElementById("loginToRegister")?.addEventListener("click", () => openRegisterModal());
  document.getElementById("registerToLogin")?.addEventListener("click", () => openLoginModal());

  document.getElementById("formLogin")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const email = String(fd.get("email") || "")
      .trim()
      .toLowerCase();
    const err = document.getElementById("loginError");
    if (!email) {
      err.textContent = "Vui lòng nhập email.";
      err.removeAttribute("hidden");
      return;
    }
    err.setAttribute("hidden", "");
    const shortName = email.split("@")[0] || "Bạn";
    setSession({ email, name: shortName });
    updateAuthHeader();
    closeAllAuthModals();
    showToast("Đã đăng nhập (chỉ giao diện — không lưu).");
    e.target.reset();
  });

  document.getElementById("formRegister")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "")
      .trim()
      .toLowerCase();
    const err = document.getElementById("registerError");
    if (!name || !email) {
      err.textContent = "Vui lòng điền đủ thông tin.";
      err.removeAttribute("hidden");
      return;
    }
    err.setAttribute("hidden", "");
    setSession({ email, name });
    updateAuthHeader();
    closeAllAuthModals();
    showToast("Đăng ký xong (chỉ giao diện — không lưu).");
    e.target.reset();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const authOpen =
      document.getElementById("loginModal")?.classList.contains("is-open") ||
      document.getElementById("registerModal")?.classList.contains("is-open");
    if (authOpen) closeAllAuthModals();
  });
}

function initHeroRotate() {
  const eyebrow = document.getElementById("heroEyebrow");
  const lead = document.getElementById("heroLead");
  if (!eyebrow || !lead || prefersReducedMotion()) return;

  const tick = () => {
    heroRotateIndex = (heroRotateIndex + 1) % heroLeads.length;
    lead.classList.add("is-fading");
    setTimeout(() => {
      eyebrow.textContent = heroEyebrows[heroRotateIndex];
      lead.textContent = heroLeads[heroRotateIndex];
      lead.classList.remove("is-fading");
    }, 320);
  };
  setInterval(tick, 5200);
}

function animateStatValue(el, target, duration) {
  const start = performance.now();
  const from = 0;
  const isPercent = el.dataset.stat === "percent";

  function frame(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - (1 - t) ** 2;
    const val = Math.round(from + (target - from) * eased);
    el.textContent = isPercent ? String(val) : val.toLocaleString("vi-VN");
    if (t < 1) requestAnimationFrame(frame);
    else el.textContent = isPercent ? String(target) : target.toLocaleString("vi-VN");
  }
  requestAnimationFrame(frame);
}

function initStatsCounter() {
  const block = document.querySelector(".hero-stats");
  if (!block) return;

  const run = () => {
    if (statsAnimated) return;
    statsAnimated = true;
    block.querySelectorAll(".hero-stats__num").forEach((el) => {
      const target = parseInt(el.dataset.target, 10);
      if (Number.isNaN(target)) return;
      if (prefersReducedMotion()) {
        el.textContent = target.toLocaleString("vi-VN");
        return;
      }
      animateStatValue(el, target, 1400);
    });
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          run();
          io.disconnect();
        }
      });
    },
    { threshold: 0.35 }
  );
  io.observe(block);
}

function initScrollReveal() {
  document.querySelectorAll("[data-reveal].reveal").forEach((el) => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -24px 0px" }
    );
    io.observe(el);
  });
}

function formatPromoClock() {
  const now = new Date();
  const t = now.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const d = now.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return `Hôm nay, ${d} — ${t}`;
}

function initPromoClock() {
  const el = document.getElementById("promoClock");
  if (!el) return;
  const tick = () => {
    el.textContent = formatPromoClock();
  };
  tick();
  setInterval(tick, 1000);
}

["phonestore_cart", "phonestore_users", "phonestore_session"].forEach((k) => {
  try {
    localStorage.removeItem(k);
  } catch {
    /* ignore */
  }
});

loadCart();

const isProductDetailPage = Boolean(document.querySelector("[data-product-slug]"));

if (document.getElementById("productGrid")) {
  renderProducts();
}
if (isProductDetailPage) {
  initProductDetailPage();
}

updateCartUI();

if (document.getElementById("heroEyebrow")) {
  initHeroRotate();
}
if (document.querySelector(".hero-stats")) {
  initStatsCounter();
}
if (!isProductDetailPage) {
  initScrollReveal();
}
if (document.getElementById("promoClock")) {
  initPromoClock();
}

updateAuthHeader();
initAuthModal();

document.getElementById("cartToggle")?.addEventListener("click", openCart);
document.getElementById("cartOverlay")?.addEventListener("click", closeCart);
document.getElementById("cartClose")?.addEventListener("click", closeCart);

document.getElementById("cartClearBtn")?.addEventListener("click", () => {
  if (cart.length && confirm("Xóa toàn bộ sản phẩm trong giỏ?")) clearCart();
});

document.getElementById("checkoutBtn")?.addEventListener("click", () => {
  if (!cart.length) return;
  const who = getSession()?.name;
  showToast(who ? `Cảm ơn ${who} ` : "Cảm ơn bạn đã đặt hàng!");
});

document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => applyFilter(btn.dataset.filter));
});

const searchInput = document.getElementById("productSearch");
if (searchInput) {
  searchInput.addEventListener("input", () => {
    searchQuery = searchInput.value;
    syncProductVisibility();
    revealVisibleCardsQuick();
  });
}

const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => nav.classList.toggle("is-open"));
  nav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => nav.classList.remove("is-open"));
  });
}


