document.addEventListener("DOMContentLoaded", () => {
    // Initialize mobile menu
    initMobileMenu()
  
    // Update cart count
    updateCartCount()
  
    // Load order details
    loadOrderDetails()
  
    // Set current year in footer
    document.getElementById("currentYear").textContent = new Date().getFullYear()
  })
  
  // Initialize mobile menu
  function initMobileMenu() {
    const menuBtn = document.getElementById("menuBtn")
    const closeMenu = document.getElementById("closeMenu")
    const mobileMenu = document.getElementById("mobileMenu")
    const mobileCartBtn = document.getElementById("mobileCartBtn")
  
    menuBtn.addEventListener("click", () => {
      mobileMenu.classList.add("open")
    })
  
    closeMenu.addEventListener("click", () => {
      mobileMenu.classList.remove("open")
    })
  
    mobileCartBtn.addEventListener("click", () => {
      window.location.href = "cart.html"
    })
  }
  
  // Update cart count
  function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || []
    const cartCount = document.getElementById("cartCount")
    const mobileCartCount = document.getElementById("mobileCartCount")
  
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)
  
    cartCount.textContent = totalItems
    mobileCartCount.textContent = totalItems
  }
  
  // Load order details
  function loadOrderDetails() {
    const orderDetails = JSON.parse(localStorage.getItem("orderDetails"))
  
    if (!orderDetails) {
      // Redirect to shop if no order details
      window.location.href = "shop.html"
      return
    }
  
    // Set confirmation items
    const confirmationItemsContainer = document.getElementById("confirmationItems")
    confirmationItemsContainer.innerHTML = ""
  
    orderDetails.items.forEach((item) => {
      const itemTotal = item.price * item.quantity
  
      const itemElement = document.createElement("div")
      itemElement.className = "checkout-item"
      itemElement.innerHTML = `
              <div class="checkout-item-image">
                  <img src="${item.image}" alt="${item.name}" class="checkout-item-img">
              </div>
              <div class="checkout-item-details">
                  <div class="checkout-item-name">${item.name}</div>
                  <div class="checkout-item-quantity">Quantity: ${item.quantity}</div>
              </div>
              <div class="checkout-item-price">₹${itemTotal}</div>
          `
  
      confirmationItemsContainer.appendChild(itemElement)
    })
  
    // Set shipping address
    const shippingAddressContainer = document.getElementById("shippingAddress")
    shippingAddressContainer.innerHTML = `
          <p>${orderDetails.shippingInfo.fullName}</p>
          <p>${orderDetails.shippingInfo.address}</p>
          <p>${orderDetails.shippingInfo.city}, ${orderDetails.shippingInfo.state} - ${orderDetails.shippingInfo.pincode}</p>
          <p>${orderDetails.shippingInfo.phone}</p>
          <p>${orderDetails.shippingInfo.email}</p>
      `
  
    // Set delivery date
    document.getElementById("deliveryDate").textContent = orderDetails.deliveryDate
  
    // Set confirmation totals
    document.getElementById("confirmationSubtotal").textContent = `₹${orderDetails.subtotal}`
    document.getElementById("confirmationTotal").textContent = `₹${orderDetails.total}`
  }
  