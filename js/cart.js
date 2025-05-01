document.addEventListener("DOMContentLoaded", () => {
  // Set current year in footer
  const currentYearElement = document.getElementById("currentYear")
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear()
  }

  // Mobile menu toggle
  const menuBtn = document.getElementById("menuBtn")
  const closeMenu = document.getElementById("closeMenu")
  const mobileMenu = document.getElementById("mobileMenu")

  if (menuBtn && closeMenu && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      mobileMenu.classList.add("open")
      document.body.style.overflow = "hidden"
    })

    closeMenu.addEventListener("click", () => {
      mobileMenu.classList.remove("open")
      document.body.style.overflow = ""
    })
  }

  // Get cart items from localStorage
  let cartItems = JSON.parse(localStorage.getItem("prinkwellness-cart") || "[]")

  // DOM elements
  const cartItemsContainer = document.getElementById("cartItems")
  const cartItemCount = document.getElementById("cartItemCount")
  const cartSubtotal = document.getElementById("cartSubtotal")
  const cartShipping = document.getElementById("cartShipping")
  const cartTotal = document.getElementById("cartTotal")
  const cartDiscount = document.getElementById("cartDiscount")
  const discountRow = document.getElementById("discountRow")
  const emptyCart = document.getElementById("emptyCart")
  const cartContent = document.getElementById("cartContent")
  const checkoutBtn = document.getElementById("checkoutBtn")
  const promoCodeForm = document.getElementById("promoCodeForm")
  const promoCodeInput = document.getElementById("promoCodeInput")
  const shippingOptions = document.querySelectorAll(".shipping-option")

  // Toast notification system
  const toastContainer = document.createElement("div")
  toastContainer.id = "toast-container"
  document.body.appendChild(toastContainer)

  // Initialize cart
  function initCart() {
    if (!cartItems || cartItems.length === 0) {
      emptyCart.style.display = "block"
      cartContent.style.display = "none"

      // Update the empty cart content to match the new design
      emptyCart.innerHTML = `
        <div class="empty-cart-content">
          <div class="empty-cart-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any products to your cart yet. Explore our products and find something you'll love.</p>
          <a href="shop.html" class="primary-button">Shop Now</a>
        </div>
      `
    } else {
      emptyCart.style.display = "none"
      cartContent.style.display = "grid"
      renderCartItems()
      updateCartSummary()
    }
  }

  // Render cart items
  function renderCartItems() {
    cartItemsContainer.innerHTML = ""

    if (!cartItems || cartItems.length === 0) {
      const placeholder = document.createElement("div")
      placeholder.className = "cart-items-placeholder"
      placeholder.innerHTML = `
        <div class="empty-cart-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
        </div>
        <h3>Your cart is empty</h3>
        <p>Looks like you haven't added any products to your cart yet. Explore our products and find something you'll love.</p>
        <a href="shop.html" class="primary-button">Shop Now</a>
      `
      cartItemsContainer.appendChild(placeholder)
      return
    }

    cartItems.forEach((item, index) => {
      // Ensure image path is correct
      if (item.image && !item.image.startsWith("./") && !item.image.startsWith("/")) {
        item.image = './${item.image}'
      }
      
      const cartItem = document.createElement("div")
      cartItem.className = "cart-item"
      cartItem.dataset.id = item.id

      cartItem.innerHTML = `
        <div class="cart-item-image">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        </div>
        <div class="cart-item-details">
          <h3 class="cart-item-name">${item.name}</h3>
          <div class="cart-item-price">₹${item.price}</div>
          <div class="cart-item-actions">
            <button class="save-for-later-btn" data-id="${item.id}">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
              Save for later
            </button>
          </div>
        </div>
        <div class="cart-item-controls">
          <div class="cart-item-quantity">
            <button class="quantity-btn decrease" data-id="${item.id}">-</button>
            <span class="quantity-value">${item.quantity}</span>
            <button class="quantity-btn increase" data-id="${item.id}">+</button>
          </div>
          <button class="remove-item-btn" data-id="${item.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      `

      // Add with a staggered delay for animation
      setTimeout(() => {
        cartItemsContainer.appendChild(cartItem)
        cartItem.classList.add("item-visible")
      }, index * 100)
    })
  }

  // Update cart summary
  function updateCartSummary() {
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    const shipping = getSelectedShippingCost()
    const discount = getDiscount(subtotal)
    const total = subtotal + shipping - discount

    cartItemCount.textContent = `${cartItems.reduce((total, item) => total + item.quantity, 0)} item(s) in your cart`
    cartSubtotal.textContent = `₹${subtotal}`
    cartShipping.textContent = `₹${shipping}`
    cartTotal.textContent = `₹${total}`

    if (discount > 0) {
      discountRow.style.display = "flex"
      cartDiscount.textContent = `-₹${discount}`
    } else {
      discountRow.style.display = "none"
    }

    // Update cart count in header
    const cartCountElements = document.querySelectorAll(".cart-count")
    cartCountElements.forEach((el) => {
      el.textContent = cartItems.reduce((total, item) => total + item.quantity, 0)
    })
  }

  // Get selected shipping cost
  function getSelectedShippingCost() {
    const selectedOption = document.querySelector(".shipping-option.selected")
    return selectedOption ? Number.parseInt(selectedOption.dataset.cost) : 0
  }

  // Get discount amount
  function getDiscount(subtotal) {
    // Check if a promo code has been applied
    const appliedPromo = localStorage.getItem("appliedPromoCode")
    if (appliedPromo === "WELCOME10") {
      return Math.round(subtotal * 0.1) // 10% discount
    }
    return 0
  }

  // Event delegation for cart items
  cartItemsContainer.addEventListener("click", (e) => {
    const target = e.target

    // Increase quantity
    if (target.classList.contains("increase") || target.closest(".increase")) {
      const button = target.classList.contains("increase") ? target : target.closest(".increase")
      const id = button.dataset.id
      const item = cartItems.find((item) => item.id == id)
      if (item) {
        item.quantity++
        const quantityEl = button.parentElement.querySelector(".quantity-value")
        quantityEl.textContent = item.quantity
        quantityEl.classList.add("quantity-changed")
        setTimeout(() => quantityEl.classList.remove("quantity-changed"), 300)
        
        // Save updated cart to localStorage
        localStorage.setItem("prinkwellness-cart", JSON.stringify(cartItems))
        
        updateCartSummary()

        // Highlight the updated total
        cartTotal.parentElement.classList.add("highlight-animation")
        setTimeout(() => cartTotal.parentElement.classList.remove("highlight-animation"), 1500)
      }
    }

    // Decrease quantity
    if (target.classList.contains("decrease") || target.closest(".decrease")) {
      const button = target.classList.contains("decrease") ? target : target.closest(".decrease")
      const id = button.dataset.id
      const item = cartItems.find((item) => item.id == id)
      if (item && item.quantity > 1) {
        item.quantity--
        const quantityEl = button.parentElement.querySelector(".quantity-value")
        quantityEl.textContent = item.quantity
        quantityEl.classList.add("quantity-changed")
        setTimeout(() => quantityEl.classList.remove("quantity-changed"), 300)
        
        // Save updated cart to localStorage
        localStorage.setItem("prinkwellness-cart", JSON.stringify(cartItems))
        
        updateCartSummary()

        // Highlight the updated total
        cartTotal.parentElement.classList.add("highlight-animation")
        setTimeout(() => cartTotal.parentElement.classList.remove("highlight-animation"), 1500)
      } else if (item && item.quantity === 1) {
        // Shake animation if trying to go below 1
        const quantityEl = button.parentElement
        quantityEl.classList.add("shake-animation")
        setTimeout(() => quantityEl.classList.remove("shake-animation"), 500)
      }
    }

    // Remove item
    if (target.classList.contains("remove-item-btn") || target.closest(".remove-item-btn")) {
      const button = target.classList.contains("remove-item-btn") ? target : target.closest(".remove-item-btn")
      const id = button.dataset.id
      const itemIndex = cartItems.findIndex((item) => item.id == id)

      if (itemIndex !== -1) {
        const cartItem = button.closest(".cart-item")
        cartItem.classList.add("item-removing")

        // Show toast notification
        showToast("Item removed from cart", "success")

        setTimeout(() => {
          cartItems.splice(itemIndex, 1)
          cartItem.remove()
          
          // Save updated cart to localStorage
          localStorage.setItem("prinkwellness-cart", JSON.stringify(cartItems))
          
          updateCartSummary()

          if (cartItems.length === 0) {
            initCart() // Re-initialize to show empty cart message
          }
        }, 300)
      }
    }

    // Save for later
    if (target.classList.contains("save-for-later-btn") || target.closest(".save-for-later-btn")) {
      const button = target.classList.contains("save-for-later-btn") ? target : target.closest(".save-for-later-btn")
      button.classList.toggle("saved")

      if (button.classList.contains("saved")) {
        button.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
          Saved
        `
        showToast("Item saved for later", "success")
      } else {
        button.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2  stroke-linejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
          Save for later
        `
      }
    }
  })

  // Shipping option selection
  shippingOptions.forEach((option) => {
    option.addEventListener("click", function () {
      // Remove selected class from all options
      shippingOptions.forEach((opt) => opt.classList.remove("selected"))

      // Add selected class to clicked option
      this.classList.add("selected")

      // Update the radio button
      const radio = this.querySelector('input[type="radio"]')
      radio.checked = true

      // Update cart summary
      updateCartSummary()

      // Highlight the shipping and total rows
      cartShipping.parentElement.classList.add("highlight-animation")
      cartTotal.parentElement.classList.add("highlight-animation")
      setTimeout(() => {
        cartShipping.parentElement.classList.remove("highlight-animation")
        cartTotal.parentElement.classList.remove("highlight-animation")
      }, 1500)
    })
  })

  // Promo code form submission
  if (promoCodeForm) {
    promoCodeForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const promoCode = promoCodeInput.value.trim().toUpperCase()

      if (promoCode === "WELCOME10") {
        // Valid promo code
        localStorage.setItem("appliedPromoCode", promoCode)
        promoCodeInput.disabled = true
        promoCodeForm.querySelector("button").textContent = "Applied"
        promoCodeForm.querySelector("button").classList.add("applied")

        // Update cart summary
        updateCartSummary()

        // Show success toast
        showToast("Promo code applied successfully!", "success")
      } else {
        // Invalid promo code
        promoCodeInput.classList.add("error")
        setTimeout(() => promoCodeInput.classList.remove("error"), 500)

        // Show error toast
        showToast("Invalid promo code. Please try again.", "error")
      }
    })
  }

  // Checkout button click
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function (e) {
      if (cartItems.length === 0) {
        e.preventDefault()
        showToast("Your cart is empty. Add items before checkout.", "error")
        return
      }

      // Add loading state
      this.classList.add("loading")
      this.innerHTML = `
        <svg class="spinner" viewBox="0 0 50 50">
          <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
        </svg>
      `

      // Simulate processing (would be removed in production)
      setTimeout(() => {
        window.location.href = "checkout.html"
      }, 1000)
    })
  }

  // Toast notification function
  function showToast(message, type = "success") {
    const toast = document.createElement("div")
    toast.className = `toast ${type}`

    const icon =
      type === "success"
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>'

    toast.innerHTML = `
      <div class="toast-content">
        ${icon}
        <span>${message}</span>
      </div>
      <button class="toast-close">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `

    toastContainer.appendChild(toast)

    // Show toast with animation
    setTimeout(() => toast.classList.add("show"), 10)

    // Auto-hide after 3 seconds
    const hideTimeout = setTimeout(() => {
      hideToast(toast)
    }, 3000)

    // Close button functionality
    const closeBtn = toast.querySelector(".toast-close")
    closeBtn.addEventListener("click", () => {
      clearTimeout(hideTimeout)
      hideToast(toast)
    })
  }

  function hideToast(toast) {
    toast.classList.add("hide")
    toast.classList.remove("show")
    setTimeout(() => toast.remove(), 300)
  }

  // Initialize the cart
  initCart()
})

// Add this function to optimize the cart layout based on number of items
function optimizeCartLayout() {
  const cartItems = document.getElementById("cartItems")
  if (!cartItems) return
  
  const itemCount = cartItems.children.length

  // If there are multiple items, use a more compact layout
  if (itemCount > 1) {
    cartItems.classList.add("multi-item-cart")
  } else {
    cartItems.classList.remove("multi-item-cart")
  }

  // Add staggered animation for multiple items
  Array.from(cartItems.children).forEach((item, index) => {
    setTimeout(() => {
      item.classList.add("item-visible")
    }, 100 * index)
  })
}

// Call this function after rendering cart items
document.addEventListener("DOMContentLoaded", () => {
  // Your existing cart initialization code

  // Add this at the end of your cart rendering logic
  optimizeCartLayout()
})
