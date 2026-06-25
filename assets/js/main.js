/* ==========================================================================
   MAIN.JS - Global Functionality, Interactive Systems, & E-commerce Simulation
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Header Scroll Shrink
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Off-canvas Drawers (Cart Drawer & Mobile Nav Drawer)
    setupDrawers();

    // 3. Persistent LocalStorage Cart System
    initCartSystem();

    // 4. Page Specific Custom Logic
    runPageSpecificLogic();

    // 5. Password Visibility Toggles
    setupPasswordToggles();

    // 6. Scroll-To-Top Button & Progress Indicator
    initScrollToTop();

    // 7. FAQ Accordion Toggle System
    initFAQAccordion();
});

/* ==========================================================================
   DRAWER SYSTEM (Cart / Mobile Menu)
   ========================================================================== */
function setupDrawers() {
    const drawerOverlays = document.querySelectorAll('.drawer-overlay');
    const drawers = document.querySelectorAll('.drawer');
    const closeButtons = document.querySelectorAll('.drawer-close');

    const toggleScroll = (disable) => {
        if (disable) {
            document.body.classList.add('drawer-open');
        } else {
            document.body.classList.remove('drawer-open');
        }
    };

    // Close drawers on click overlay
    drawerOverlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            drawers.forEach(d => d.classList.remove('open'));
            overlay.classList.remove('open');
            toggleScroll(false);
        });
    });

    // Close drawers on click close btn
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            drawers.forEach(d => d.classList.remove('open'));
            drawerOverlays.forEach(o => o.classList.remove('open'));
            toggleScroll(false);
        });
    });

    // Trigger open cart drawer button
    const cartToggleBtns = document.querySelectorAll('.cart-toggle-btn');

    cartToggleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'cart.html';
        });
    });

    // Trigger open mobile menu
    const mobileMenuBtn = document.querySelector('.mobile-toggle');
    const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
    const mobileOverlay = document.getElementById('mobile-nav-overlay');

    if (mobileNavDrawer && mobileOverlay && mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileNavDrawer.classList.add('open');
            mobileOverlay.classList.add('open');
            toggleScroll(true);
        });
    }

    // Trigger open mobile filter drawer
    const filterToggleBtn = document.getElementById('filter-toggle-btn');
    const filterDrawer = document.getElementById('filter-drawer');
    const filterOverlay = document.getElementById('filter-drawer-overlay');

    if (filterDrawer && filterOverlay && filterToggleBtn) {
        filterToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            filterDrawer.classList.add('open');
            filterOverlay.classList.add('open');
            toggleScroll(true);
        });
    }

    // Mobile navigation dropdowns
    const mobileDropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');
    mobileDropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const parent = toggle.closest('.mobile-dropdown');
            if (parent) {
                parent.classList.toggle('open');
            }
        });
    });

    // Auto-expand mobile dropdowns containing active items
    const activeSubmenu = document.querySelector('.mobile-dropdown-menu .text-primary');
    if (activeSubmenu) {
        const parentDropdown = activeSubmenu.closest('.mobile-dropdown');
        if (parentDropdown) {
            parentDropdown.classList.add('open');
        }
    }
}

/* ==========================================================================
   PERSISTENT SHOPPING CART SYSTEM
   ========================================================================== */
let cart = [];

function initCartSystem() {
    // Load existing cart from local storage
    const storedCart = localStorage.getItem('gourmet_popcorn_cart');
    if (storedCart) {
        try {
            cart = JSON.parse(storedCart);
        } catch (e) {
            cart = [];
        }
    }

    // Render cart indicators and item counts
    updateCartDOM();

    // Hook up dynamic Event Delegation for "Add to Cart" across all elements
    document.addEventListener('click', (e) => {
        const addToCartBtn = e.target.closest('.add-to-cart-btn');
        if (addToCartBtn) {
            e.preventDefault();

            // Gather product details from data attributes
            const id = addToCartBtn.getAttribute('data-id') || 'product-' + Date.now();
            const name = addToCartBtn.getAttribute('data-name') || 'Gourmet Popcorn';
            const price = parseFloat(addToCartBtn.getAttribute('data-price') || '15.00');
            const img = addToCartBtn.getAttribute('data-img') || 'assets/images/products/popcorn-caramel.jpg';
            const size = addToCartBtn.getAttribute('data-size') || '1 Gallon';
            const flavor = addToCartBtn.getAttribute('data-flavor') || 'Signature Caramel';

            let qty = 1;
            const quantityInput = document.getElementById('product-qty-input');
            if (quantityInput) {
                qty = parseInt(quantityInput.value) || 1;
            }

            addToCart(id, name, price, img, size, flavor, qty, addToCartBtn);
        }

        // Card-based Add to Cart button click
        const cardAddBtn = e.target.closest('.card-add-btn');
        if (cardAddBtn) {
            e.preventDefault();
            const container = cardAddBtn.closest('.card-action-container');
            if (container) {
                const id = container.getAttribute('data-id');
                const name = container.getAttribute('data-name');
                const price = parseFloat(container.getAttribute('data-price') || '15.00');
                const img = container.getAttribute('data-img');
                const size = container.getAttribute('data-size') || '1 Gallon';
                const flavor = container.getAttribute('data-flavor') || 'Signature Caramel';

                addToCart(id, name, price, img, size, flavor, 1, cardAddBtn);
            }
        }

        // Card-based Plus button click
        const cardQtyPlus = e.target.closest('.card-qty-plus');
        if (cardQtyPlus) {
            e.preventDefault();
            const container = cardQtyPlus.closest('.card-action-container');
            if (container) {
                const id = container.getAttribute('data-id');
                const size = container.getAttribute('data-size') || '1 Gallon';
                const flavor = container.getAttribute('data-flavor') || 'Signature Caramel';
                const existingItem = cart.find(item => item.id === id && item.size === size && item.flavor === flavor) || cart.find(item => item.id === id);
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    const name = container.getAttribute('data-name');
                    const price = parseFloat(container.getAttribute('data-price') || '15.00');
                    const img = container.getAttribute('data-img');
                    cart.push({ id, name, price, img, size, flavor, quantity: 1 });
                }
                saveCart();
                updateCartDOM();
            }
        }

        // Card-based Minus button click
        const cardQtyMinus = e.target.closest('.card-qty-minus');
        if (cardQtyMinus) {
            e.preventDefault();
            const container = cardQtyMinus.closest('.card-action-container');
            if (container) {
                const id = container.getAttribute('data-id');
                const size = container.getAttribute('data-size') || '1 Gallon';
                const flavor = container.getAttribute('data-flavor') || 'Signature Caramel';
                const existingItem = cart.find(item => item.id === id && item.size === size && item.flavor === flavor) || cart.find(item => item.id === id);
                if (existingItem) {
                    if (existingItem.quantity > 1) {
                        existingItem.quantity -= 1;
                    } else {
                        const index = cart.indexOf(existingItem);
                        cart.splice(index, 1);
                    }
                    saveCart();
                    updateCartDOM();
                }
            }
        }

        // Card-based Remove button click
        const cardQtyRemove = e.target.closest('.card-qty-remove');
        if (cardQtyRemove) {
            e.preventDefault();
            const container = cardQtyRemove.closest('.card-action-container');
            if (container) {
                const id = container.getAttribute('data-id');
                cart = cart.filter(item => item.id !== id);
                saveCart();
                updateCartDOM();
            }
        }

        // Quantity changes in drawers / page tables
        const qtyMinusBtn = e.target.closest('.qty-minus');
        const qtyPlusBtn = e.target.closest('.qty-plus');

        if (qtyMinusBtn) {
            adjustQty(qtyMinusBtn, -1);
        }
        if (qtyPlusBtn) {
            adjustQty(qtyPlusBtn, 1);
        }

        // Remove item button click
        const removeBtn = e.target.closest('.remove-cart-item');
        if (removeBtn) {
            const index = parseInt(removeBtn.getAttribute('data-index'));
            removeCartItem(index);
        }
    });

    // Update quantities when typed in
    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('quantity-input')) {
            const index = parseInt(e.target.getAttribute('data-index'));
            const val = parseInt(e.target.value) || 1;
            if (!isNaN(index) && index >= 0 && index < cart.length) {
                cart[index].quantity = Math.max(1, val);
                saveCart();
                updateCartDOM();
            }
        }
    });
}

function addToCart(id, name, price, img, size, flavor, qty = 1, triggerBtn = null) {
    // Check if item already exists with matching size & flavor
    const existingIndex = cart.findIndex(item => item.id === id && item.size === size && item.flavor === flavor);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += qty;
    } else {
        cart.push({ id, name, price, img, size, flavor, quantity: qty });
    }

    saveCart();
    updateCartDOM();

    // Trigger visual floating addition animation
    if (triggerBtn) {
        animateFlyingKernel(triggerBtn);
    }

    // Show success popup notification instead of opening drawer
    showPopupNotification('Added to Basket', `${name} has been added to your gifting basket.`);
}

function adjustQty(btn, change) {
    const input = btn.parentNode.querySelector('.quantity-input');
    if (input) {
        let val = parseInt(input.value) || 1;
        val = Math.max(1, val + change);
        input.value = val;

        const index = parseInt(input.getAttribute('data-index'));
        if (!isNaN(index) && index >= 0 && index < cart.length) {
            cart[index].quantity = val;
            saveCart();
            updateCartDOM();
        }
    }
}

function removeCartItem(index) {
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        saveCart();
        updateCartDOM();
    }
}

function saveCart() {
    localStorage.setItem('gourmet_popcorn_cart', JSON.stringify(cart));
}

function updateCartDOM() {
    // Update header counts
    const cartCountBadges = document.querySelectorAll('.badge-count');
    const totalQty = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartCountBadges.forEach(b => {
        b.textContent = totalQty;
        b.style.display = totalQty > 0 ? 'block' : 'none';
    });

    // Render Drawer Content
    const drawerListContainer = document.querySelector('.drawer-cart-list');
    const drawerSubtotal = document.getElementById('drawer-subtotal-price');

    if (drawerListContainer) {
        if (cart.length === 0) {
            drawerListContainer.innerHTML = `
                <div class="text-center py-5">
                    <i class="fa-solid fa-basket-shopping text-muted mb-3" style="font-size: 3rem;"></i>
                    <p class="text-muted">Your cart is empty.</p>
                    <a href="shop.html" class="btn-premium btn-sm mt-3">Shop Popcorn</a>
                </div>
            `;
            if (drawerSubtotal) drawerSubtotal.textContent = '$0.00';
        } else {
            let html = '';
            let subtotal = 0;

            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;

                html += `
                    <div class="cart-product mb-3 pb-3 border-bottom d-flex align-items-center justify-content-between">
                        <div class="d-flex align-items-center gap-3">
                            <img src="${item.img}" alt="${item.name}" class="cart-product-img" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                            <div>
                                <h6 class="mb-0 text-truncate" style="max-width: 160px; font-family: var(--font-body); font-size: 0.95rem; font-weight: 600;">${item.name}</h6>
                                <small class="text-muted d-block" style="font-size: 0.75rem;">${item.flavor} (${item.size})</small>
                                <span class="fw-bold text-primary" style="font-size: 0.9rem;">$${item.price.toFixed(2)}</span>
                            </div>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                            <div class="quantity-control" style="width: 80px; height: 30px;">
                                <button type="button" class="quantity-btn qty-minus" style="width: 25px; height: 28px;">-</button>
                                <input type="text" class="quantity-input" data-index="${index}" value="${item.quantity}" style="width: 30px; height: 28px;" readonly>
                                <button type="button" class="quantity-btn qty-plus" style="width: 25px; height: 28px;">+</button>
                            </div>
                            <button type="button" class="remove-cart-item btn-link text-danger border-0 bg-transparent" data-index="${index}">
                                <i class="fa-regular fa-trash-can"></i>
                            </button>
                        </div>
                    </div>
                `;
            });

            drawerListContainer.innerHTML = html;
            if (drawerSubtotal) drawerSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        }
    }

    // Sync elements on the checkout page or full cart page
    syncFullCartPage();
    syncCheckoutPage();
    syncShopCards();
}

function syncFullCartPage() {
    const cartTableBody = document.getElementById('cart-table-body');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTotal = document.getElementById('cart-total');
    const cartWrapper = document.getElementById('full-cart-wrapper');
    const cartEmpty = document.getElementById('empty-cart-message');

    if (cartTableBody) {
        if (cart.length === 0) {
            if (cartWrapper) cartWrapper.style.display = 'none';
            if (cartEmpty) cartEmpty.style.display = 'block';
        } else {
            if (cartWrapper) cartWrapper.style.display = 'block';
            if (cartEmpty) cartEmpty.style.display = 'none';

            let html = '';
            let subtotal = 0;

            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;

                html += `
                    <tr>
                        <td data-label="Product">
                            <div class="cart-product">
                                <img src="${item.img}" alt="${item.name}" class="cart-product-img">
                                <div>
                                    <h5 class="mb-1" style="font-size: 1.1rem;">${item.name}</h5>
                                    <span class="text-muted d-block" style="font-size: 0.85rem;">Flavor: ${item.flavor} | Size: ${item.size}</span>
                                </div>
                            </div>
                        </td>
                        <td data-label="Price"><span class="fw-bold">$${item.price.toFixed(2)}</span></td>
                        <td data-label="Quantity">
                            <div class="quantity-control">
                                <button class="quantity-btn qty-minus">-</button>
                                <input type="text" class="quantity-input" data-index="${index}" value="${item.quantity}" readonly>
                                <button class="quantity-btn qty-plus">+</button>
                            </div>
                        </td>
                        <td data-label="Total"><span class="fw-bold text-primary">$${itemTotal.toFixed(2)}</span></td>
                        <td data-label="Remove">
                            <button class="remove-cart-item" data-index="${index}">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });

            cartTableBody.innerHTML = html;
            if (cartSubtotal) cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
            
            const quickSubtotal = document.getElementById('quick-subtotal-price');
            if (quickSubtotal) {
                quickSubtotal.textContent = `$${subtotal.toFixed(2)}`;
            }

            // Adding mock tax & shipping to compute total
            const shipping = 5.99;
            const total = subtotal + shipping;
            if (cartTotal) cartTotal.textContent = `$${total.toFixed(2)}`;
        }
    }
}

function syncCheckoutPage() {
    const checkoutSummaryList = document.getElementById('checkout-summary-list');
    const checkoutSubtotal = document.getElementById('checkout-subtotal');
    const checkoutTotal = document.getElementById('checkout-total');

    if (checkoutSummaryList) {
        if (cart.length === 0) {
            checkoutSummaryList.innerHTML = `<li class="list-group-item text-center text-muted">No items in your cart.</li>`;
            if (checkoutSubtotal) checkoutSubtotal.textContent = '$0.00';
            if (checkoutTotal) checkoutTotal.textContent = '$0.00';
        } else {
            let html = '';
            let subtotal = 0;

            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;

                html += `
                    <div class="summary-row mb-2">
                        <span>${item.name} <strong class="text-muted">x${item.quantity}</strong></span>
                        <span>$${itemTotal.toFixed(2)}</span>
                    </div>
                `;
            });

            checkoutSummaryList.innerHTML = html;
            if (checkoutSubtotal) checkoutSubtotal.textContent = `$${subtotal.toFixed(2)}`;

            const shipping = 5.99;
            const total = subtotal + shipping;
            if (checkoutTotal) checkoutTotal.textContent = `$${total.toFixed(2)}`;
        }
    }
}

function syncShopCards() {
    const cardContainers = document.querySelectorAll('.card-action-container');
    cardContainers.forEach(container => {
        const id = container.getAttribute('data-id');
        if (!id) return;

        // Find matching items in the cart
        const matchingItems = cart.filter(item => item.id === id);
        const qty = matchingItems.reduce((acc, item) => acc + item.quantity, 0);

        const addBtn = container.querySelector('.card-add-btn');
        const qtyControl = container.querySelector('.card-qty-control');
        const qtyValue = container.querySelector('.card-qty-value');

        if (qty > 0) {
            if (addBtn) addBtn.classList.add('d-none');
            if (qtyControl) {
                qtyControl.classList.remove('d-none');
                qtyControl.classList.add('d-flex');
            }
            if (qtyValue) qtyValue.textContent = qty;
        } else {
            if (addBtn) addBtn.classList.remove('d-none');
            if (qtyControl) {
                qtyControl.classList.add('d-none');
                qtyControl.classList.remove('d-flex');
            }
        }
    });
}

/* ==========================================================================
   FLYING KERNEL ANIMATION
   ========================================================================== */
function animateFlyingKernel(button) {
    const btnRect = button.getBoundingClientRect();
    let cartBtn = document.querySelector('.cart-toggle-btn');
    const cartBtns = document.querySelectorAll('.cart-toggle-btn');
    if (cartBtns.length > 1) {
        cartBtn = Array.from(cartBtns).find(btn => btn.getBoundingClientRect().width > 0) || cartBtn;
    }
    if (!cartBtn) return;

    const cartRect = cartBtn.getBoundingClientRect();

    // Create flying particle
    const kernel = document.createElement('div');
    kernel.className = 'flying-kernel';
    document.body.appendChild(kernel);

    // Initial position matching the button click spot
    kernel.style.left = `${btnRect.left + btnRect.width / 2 - 7}px`;
    kernel.style.top = `${btnRect.top + window.scrollY}px`;

    // Dynamic coordinates for keyframe movement
    const destX = cartRect.left - btnRect.left;
    const destY = (cartRect.top + window.scrollY) - (btnRect.top + window.scrollY);
    const midX = destX / 2;
    const midY = destY - 100; // Arcing path

    kernel.style.setProperty('--dest-x', `${destX}px`);
    kernel.style.setProperty('--dest-y', `${destY}px`);
    kernel.style.setProperty('--mid-x', `${midX}px`);
    kernel.style.setProperty('--mid-y', `${midY}px`);

    // Clean up
    kernel.addEventListener('animationend', () => {
        kernel.remove();
        // Trigger mini bounce on cart icon
        cartBtn.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartBtn.style.transform = 'scale(1)';
        }, 150);
    });
}

/* ==========================================================================
   PAGE-SPECIFIC CUSTOM LOGIC
   ========================================================================== */
function runPageSpecificLogic() {
    const bodyId = document.body.id;

    // A. GIFT TIN CUSTOMIZER (gift-tins.html)
    if (bodyId === 'gift-tins-page') {
        initGiftTinBuilder();
    }

    // B. BULK ORDER CALCULATOR (bulk-orders.html)
    if (bodyId === 'bulk-orders-page') {
        initBulkOrderCalculator();
    }

    // C. CORPORATE GIFTING QUOTE CALCULATOR (corporate-gifting.html)
    if (bodyId === 'corporate-gifting-page') {
        initCorporateCalculator();
    }

    // D. FORM SIMULATIONS (contact, checkout, login, signup)
    initFormSimulations();
}

/* A. GIFT TIN BUILDER INTERACTIVE UI */
function initGiftTinBuilder() {
    const builderTabs = document.querySelectorAll('.builder-tab-btn');
    const tabs = document.querySelectorAll('.builder-tab');
    const tinGraphic = document.querySelector('.tin-graphic');
    const tinPartition = document.querySelector('.tin-partition');
    const tinSlotsContainer = document.querySelector('.tin-slots-container');
    const addToCartFromBuilderBtn = document.getElementById('add-builder-to-cart');

    let currentConfig = {
        size: '1-way', // 1-way, 2-way, 3-way
        flavor1: 'Caramel Popcorn',
        flavor2: 'None',
        flavor3: 'None',
        ribbon: 'Standard Red Ribbon',
        price: 24.99
    };

    // Tab Switch
    builderTabs.forEach(btn => {
        btn.addEventListener('click', () => {
            builderTabs.forEach(t => t.classList.remove('active'));
            tabs.forEach(tab => tab.classList.remove('active'));

            btn.classList.add('active');
            const targetTab = document.getElementById(btn.getAttribute('data-target'));
            if (targetTab) targetTab.classList.add('active');
        });
    });

    // Step 1: Tin Design / Size Options
    const sizeCards = document.querySelectorAll('.builder-size-card');
    sizeCards.forEach(card => {
        card.addEventListener('click', () => {
            sizeCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');

            const size = card.getAttribute('data-size');
            currentConfig.size = size;

            // Adjust partition visualization classes
            tinPartition.className = 'tin-partition';
            if (size === '2-way') {
                tinPartition.classList.add('divided-2');
                currentConfig.price = 32.99;
            } else if (size === '3-way') {
                tinPartition.classList.add('divided-3');
                currentConfig.price = 39.99;
            } else {
                currentConfig.price = 24.99;
            }

            updateTinSlotsDOM();
            updateBuilderPrice();
        });
    });

    // Step 2: Selecting Flavors
    document.addEventListener('click', (e) => {
        const flavorCard = e.target.closest('.builder-flavor-card');
        if (flavorCard) {
            const slot = flavorCard.getAttribute('data-slot') || '1';
            const flavor = flavorCard.getAttribute('data-flavor');

            const parentTab = flavorCard.closest('.builder-tab');
            parentTab.querySelectorAll('.builder-flavor-card').forEach(c => c.classList.remove('selected'));
            flavorCard.classList.add('selected');

            currentConfig[`flavor${slot}`] = flavor;
            updateTinSlotsDOM();
        }
    });

    // Step 3: Ribbon Selection
    const ribbonCards = document.querySelectorAll('.builder-ribbon-card');
    ribbonCards.forEach(card => {
        card.addEventListener('click', () => {
            ribbonCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            currentConfig.ribbon = card.getAttribute('data-ribbon');
        });
    });

    function updateTinSlotsDOM() {
        if (!tinSlotsContainer) return;

        let html = '';
        if (currentConfig.size === '1-way') {
            html = `<div class="tin-slot" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                        <span class="tin-slot-label">${currentConfig.flavor1}</span>
                    </div>`;
        } else if (currentConfig.size === '2-way') {
            html = `
                <div class="tin-slot" style="top: 25%; left: 15%; width: 35%; height: 50%;">
                    <span class="tin-slot-label" style="font-size: 0.8rem;">${currentConfig.flavor1}</span>
                </div>
                <div class="tin-slot" style="top: 25%; right: 15%; width: 35%; height: 50%;">
                    <span class="tin-slot-label" style="font-size: 0.8rem;">${currentConfig.flavor2 === 'None' ? 'Select Flavor 2' : currentConfig.flavor2}</span>
                </div>
            `;
        } else if (currentConfig.size === '3-way') {
            html = `
                <div class="tin-slot" style="top: 15%; left: 25%; width: 50%; height: 35%;">
                    <span class="tin-slot-label" style="font-size: 0.75rem;">${currentConfig.flavor1}</span>
                </div>
                <div class="tin-slot" style="bottom: 15%; left: 10%; width: 40%; height: 35%;">
                    <span class="tin-slot-label" style="font-size: 0.75rem;">${currentConfig.flavor2 === 'None' ? 'Select Flavor 2' : currentConfig.flavor2}</span>
                </div>
                <div class="tin-slot" style="bottom: 15%; right: 10%; width: 40%; height: 35%;">
                    <span class="tin-slot-label" style="font-size: 0.75rem;">${currentConfig.flavor3 === 'None' ? 'Select Flavor 3' : currentConfig.flavor3}</span>
                </div>
            `;
        }

        tinSlotsContainer.innerHTML = html;
    }

    function updateBuilderPrice() {
        const priceLabel = document.getElementById('builder-calculated-price');
        if (priceLabel) {
            priceLabel.textContent = `$${currentConfig.price.toFixed(2)}`;
        }
    }

    if (addToCartFromBuilderBtn) {
        addToCartFromBuilderBtn.addEventListener('click', (e) => {
            e.preventDefault();

            // Check flavor parameters
            if (currentConfig.size === '2-way' && currentConfig.flavor2 === 'None') {
                alert('Please select Flavor 2 in Step 2.');
                return;
            }
            if (currentConfig.size === '3-way' && (currentConfig.flavor2 === 'None' || currentConfig.flavor3 === 'None')) {
                alert('Please select all 3 flavors in Step 2.');
                return;
            }

            const tinName = `Custom ${currentConfig.size.toUpperCase()} Gourmet Tin`;
            const customFlavors = [currentConfig.flavor1, currentConfig.flavor2, currentConfig.flavor3].filter(f => f !== 'None').join(' + ');

            addToCart(
                'custom-tin-' + Date.now(),
                tinName,
                currentConfig.price,
                'assets/images/gifts/tin-builder-default.jpg',
                currentConfig.size.replace('-', ' '),
                `${customFlavors} (Ribbon: ${currentConfig.ribbon})`,
                1,
                addToCartFromBuilderBtn
            );
        });
    }

    // Initial setup trigger
    updateTinSlotsDOM();
    updateBuilderPrice();
}

/* B. BULK ORDER VOLUME CALCULATOR */
function initBulkOrderCalculator() {
    const qtySlider = document.getElementById('bulk-qty-slider');
    const qtyVal = document.getElementById('bulk-qty-val');
    const unitPriceVal = document.getElementById('bulk-unit-price');
    const totalPriceVal = document.getElementById('bulk-total-price');
    const savingsVal = document.getElementById('bulk-savings-val');

    if (qtySlider) {
        qtySlider.addEventListener('input', () => {
            const qty = parseInt(qtySlider.value);
            qtyVal.textContent = qty;

            let unitPrice = 24.99;
            let discount = 0;

            if (qty >= 200) {
                unitPrice = 17.49; // 30% discount
                discount = 0.30;
            } else if (qty >= 100) {
                unitPrice = 19.99; // 20% discount
                discount = 0.20;
            } else if (qty >= 50) {
                unitPrice = 21.24; // 15% discount
                discount = 0.15;
            } else if (qty >= 20) {
                unitPrice = 22.49; // 10% discount
                discount = 0.10;
            }

            const standardTotal = 24.99 * qty;
            const currentTotal = unitPrice * qty;
            const savings = standardTotal - currentTotal;

            unitPriceVal.textContent = `$${unitPrice.toFixed(2)}`;
            totalPriceVal.textContent = `$${currentTotal.toFixed(2)}`;
            savingsVal.textContent = `$${savings.toFixed(2)}`;
        });
    }
}

/* C. CORPORATE CALCULATOR */
function initCorporateCalculator() {
    const qtySlider = document.getElementById('corp-qty-slider');
    const qtyVal = document.getElementById('corp-qty-val');
    const customLidCheck = document.getElementById('custom-lid-check');
    const giftCardCheck = document.getElementById('gift-card-check');
    const estimatedQuote = document.getElementById('estimated-quote-price');

    function calculateCorpQuote() {
        if (!qtySlider || !estimatedQuote) return;

        const qty = parseInt(qtySlider.value);
        if (qtyVal) qtyVal.textContent = qty;

        let baseBoxCost = 29.99;

        // Volume pricing rules
        if (qty >= 500) baseBoxCost = 19.99;
        else if (qty >= 100) baseBoxCost = 22.99;
        else if (qty >= 50) baseBoxCost = 25.99;

        if (customLidCheck && customLidCheck.checked) {
            baseBoxCost += 1.50; // Custom branding setup fee per lid
        }
        if (giftCardCheck && giftCardCheck.checked) {
            baseBoxCost += 0.50; // Custom printing card
        }

        const totalCost = baseBoxCost * qty;
        estimatedQuote.textContent = `$${totalCost.toFixed(2)}`;
    }

    if (qtySlider) {
        qtySlider.addEventListener('input', calculateCorpQuote);
    }
    if (customLidCheck) {
        customLidCheck.addEventListener('change', calculateCorpQuote);
    }
    if (giftCardCheck) {
        giftCardCheck.addEventListener('change', calculateCorpQuote);
    }

    calculateCorpQuote();
}

/* D. GENERAL FORM SIMULATIONS */
function initFormSimulations() {
    // Contact Form Success Simulation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showPopupNotification('Message Sent!', 'Thank you. Our gifting specialist will contact you shortly.');
            contactForm.reset();
        });
    }

    // Checkout Billing Form simulation
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Empty local cart
            cart = [];
            saveCart();
            updateCartDOM();

            showPopupNotification('Order Placed Successfully!', 'Your order has been recorded. Redirecting to confirmation...');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        });
    }

    // Login Form simulation
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showPopupNotification('Success', 'Welcome back! Login simulated successfully.');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        });
    }

    // Signup Form simulation
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showPopupNotification('Welcome!', 'Your gourmet account has been created.');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        });
    }

    // Bulk Order Inquiry Form
    const bulkForm = document.getElementById('bulk-inquiry-form');
    if (bulkForm) {
        bulkForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showPopupNotification('Inquiry Submitted!', 'Our bulk coordinator will email your formal quote custom pricing sheet.');
            bulkForm.reset();
        });
    }
}

/* POPUP NOTIFICATION MODAL SIMULATOR */
function showPopupNotification(title, message) {
    // Create element
    const alertBox = document.createElement('div');
    alertBox.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background-color: var(--surface);
        border: 2px solid var(--primary);
        border-radius: 12px;
        padding: 1.5rem 2rem;
        box-shadow: 0 15px 35px rgba(0,0,0,0.15);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        max-width: 350px;
    `;

    alertBox.innerHTML = `
        <div class="d-flex align-items-center gap-2">
            <i class="fa-solid fa-circle-check text-primary" style="font-size: 1.5rem;"></i>
            <h5 class="mb-0 text-primary" style="font-size: 1.1rem; font-family: var(--font-body);">${title}</h5>
        </div>
        <p class="mb-0 text-muted" style="font-size: 0.9rem; line-height: 1.4;">${message}</p>
    `;

    document.body.appendChild(alertBox);

    // Animate in
    setTimeout(() => {
        alertBox.style.transform = 'translateY(0)';
        alertBox.style.opacity = '1';
    }, 100);

    // Animate out after 4 seconds
    setTimeout(() => {
        alertBox.style.transform = 'translateY(50px)';
        alertBox.style.opacity = '0';
        setTimeout(() => {
            alertBox.remove();
        }, 400);
    }, 4000);
}

/* ==========================================================================
   PASSWORD VISIBILITY TOGGLING
   ========================================================================== */
function setupPasswordToggles() {
    const passwordToggles = document.querySelectorAll('.password-toggle-btn');
    passwordToggles.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const container = btn.closest('.password-input-container');
            const input = container.querySelector('input');
            const icon = btn.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

/* ==========================================================================
   SCROLL-TO-TOP SYSTEM (Dynamically Injected)
   ========================================================================== */
function initScrollToTop() {
    // 1. Create and inject the scroll-to-top button
    const btn = document.createElement('button');
    btn.id = 'scroll-to-top';
    btn.className = 'scroll-to-top-btn';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.setAttribute('type', 'button');
    
    btn.innerHTML = `
        <svg class="progress-ring" width="48" height="48">
            <circle class="progress-ring__track" stroke-width="2" fill="transparent" r="22" cx="24" cy="24"/>
            <circle class="progress-ring__circle" stroke-width="3" fill="transparent" r="22" cx="24" cy="24"/>
        </svg>
        <i class="fa-solid fa-chevron-up"></i>
    `;
    
    document.body.appendChild(btn);
    
    const circle = btn.querySelector('.progress-ring__circle');
    const radius = 22;
    const circumference = 2 * Math.PI * radius;
    
    // Set initial dasharray and dashoffset
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;
    
    // 2. Handle scroll visibility and progress filling
    const updateProgress = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight;
        const winHeight = window.innerHeight;
        const totalScrollable = docHeight - winHeight;
        
        // Show/hide button based on scroll threshold (300px)
        if (scrollTop > 300) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
        
        // Update circle fill percent
        if (totalScrollable > 0) {
            const scrollPercent = (scrollTop / totalScrollable) * 100;
            const offset = circumference - (scrollPercent / 100) * circumference;
            circle.style.strokeDashoffset = offset;
        } else {
            circle.style.strokeDashoffset = circumference;
        }
    };
    
    // 3. Scroll to top action
    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Add scroll event listener with throttle/requestAnimationFrame for performance
    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                updateProgress();
                isScrolling = false;
            });
            isScrolling = true;
        }
    });
    
    // Initial call to set state
    updateProgress();
}

/* ==========================================================================
   FAQ ACCORDION TOGGLE SYSTEM
   ========================================================================== */
function initFAQAccordion() {
    const faqTriggers = document.querySelectorAll('.faq-trigger');
    faqTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.closest('.faq-item');
            const content = item.querySelector('.faq-content');
            
            // Check if already active
            const isActive = item.classList.contains('active');
            
            // Close all items
            document.querySelectorAll('.faq-item').forEach(el => {
                el.classList.remove('active');
                el.querySelector('.faq-content').style.maxHeight = null;
                el.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
                trigger.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

