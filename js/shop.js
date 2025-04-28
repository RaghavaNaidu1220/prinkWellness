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

  // Get products from localStorage or use default products if not available
  let products = JSON.parse(localStorage.getItem("prinkwellness-products") || "[]")

  // If products array is empty, use default products
  if (!products || products.length === 0) {
    products = [
      {
        id: "1",
        name: "PrinkWellness Vaginal Suppository",
        description:
          "Our clinically validated vaginal suppository is designed to provide direct, localized relief from menstrual cramps.",
        price: 999,
        image: "./images/product-image-1.png",
      },
      {
        id: "2",
        name: "PrinkWellness 3-Pack",
        description:
          "Save with our 3-pack bundle. Perfect for monthly use, this pack provides you with enough suppositories for consistent relief.",
        price: 2499,
        image: "./images/product-image-2.jpeg",
      },
    ]

    // Save default products to localStorage
    localStorage.setItem("prinkwellness-products", JSON.stringify(products))
  }

  // Render products
  function renderProducts() {
    const productsContainer = document.getElementById("productsContainer")
    if (!productsContainer) return

    // Clear container
    productsContainer.innerHTML = ""

    // Render each product
    products.forEach((product) => {
      // Ensure image path is correct
      if (product.image && !product.image.startsWith("./") && !product.image.startsWith("/")) {
        product.image = './${product.image}'
      }

      const productCard = document.createElement("div")
      productCard.className = "product-card"
      productCard.dataset.productId = product.id
      productCard.innerHTML = `
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}" class="product-img">
        </div>
        <div class="product-info">
          <h3 class="product-title">${product.name}</h3>
          <p class="product-description">${product.description}</p>
          <p class="product-price">₹${product.price.toLocaleString()}</p>
          <div class="product-actions">
            <button class="add-to-cart-btn">Add to Cart</button>
            <button class="buy-now-btn">Buy Now</button>
          </div>
        </div>
      `
      productsContainer.appendChild(productCard)
    })

    // Add event listeners to buttons
    document.querySelectorAll(".add-to-cart-btn").forEach((button, index) => {
      button.addEventListener("click", () => {
        addToCart(products[index])
      })
    })

    document.querySelectorAll(".buy-now-btn").forEach((button, index) => {
      button.addEventListener("click", () => {
        buyNow(products[index])
      })
    })
  }

  // Add to cart function
  function addToCart(product) {
    // Get existing cart
    const cart = JSON.parse(localStorage.getItem("prinkwellness-cart") || "[]")

    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex((item) => item.id === product.id)

    if (existingProductIndex > -1) {
      // Increase quantity if product already in cart
      cart[existingProductIndex].quantity += 1
    } else {
      // Add new product to cart
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      })
    }

    // Save to localStorage
    localStorage.setItem("prinkwellness-cart", JSON.stringify(cart))

    // Update cart count
    updateCartCount()

    // Show added to cart message
    showMessage("Product added to cart!")
  }

  // Buy now function - FIXED with consistent localStorage key
  function buyNow(product) {
    console.log("Buy Now clicked for product:", product)

    // Create buy now item
    const buyNowItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    }

    // Store in the regular cart but clear it first
    localStorage.setItem("prinkwellness-cart", JSON.stringify([buyNowItem]))
    console.log("Saved to cart for buy now:", buyNowItem)

    // Show message
    showMessage("Redirecting to checkout...")

    // Redirect to checkout - ensure the path is correct
    setTimeout(() => {
      console.log("Redirecting to checkout.html")
      window.location.href = "./checkout.html"
    }, 1000)
  }

  // Show message function
  function showMessage(message) {
    const messageElement = document.createElement("div")
    messageElement.className = "message"
    messageElement.textContent = message
    document.body.appendChild(messageElement)

    // Show message
    setTimeout(() => {
      messageElement.classList.add("show")
    }, 100)

    // Hide message after 3 seconds
    setTimeout(() => {
      messageElement.classList.remove("show")
      setTimeout(() => {
        document.body.removeChild(messageElement)
      }, 300)
    }, 3000)
  }

  // Update cart count
  function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem("prinkwellness-cart") || "[]")
    const count = cartItems.reduce((total, item) => total + item.quantity, 0)

    const cartCountElements = document.querySelectorAll("#cartCount, #mobileCartCount")
    cartCountElements.forEach((element) => {
      if (element) {
        element.textContent = count
        // Show the count if there are items
        if (count > 0) {
          element.style.display = "flex"
        } else {
          element.style.display = "none"
        }
      }
    })
  }

  // Initialize
  renderProducts()
  updateCartCount()
})
