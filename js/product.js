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

  // Get product ID from URL
  const urlParams = new URLSearchParams(window.location.search)
  const productId = urlParams.get("id") || "1" // Default to first product if no ID provided

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
        details: [
          "Clinically validated for menstrual pain relief",
          "Made with natural ingredients",
          "Easy to use with applicator",
          "Fast-acting formula",
          "30-day supply",
        ],
      },
      {
        id: "2",
        name: "PrinkWellness 3-Pack",
        description:
          "Save with our 3-pack bundle. Perfect for monthly use, this pack provides you with enough suppositories for consistent relief.",
        price: 2499,
        image: "./images/product-image-2.jpeg",
        details: [
          "3-month supply at a discounted price",
          "Clinically validated for menstrual pain relief",
          "Made with natural ingredients",
          "Easy to use with applicator",
          "Fast-acting formula",
        ],
      },
    ]

    // Save default products to localStorage
    localStorage.setItem("prinkwellness-products", JSON.stringify(products))
  }

  // Find the selected product
  const product = products.find((p) => p.id === productId) || products[0]

  // Render product details
  function renderProductDetails() {
    // Update page title
    document.title = `${product.name} - PrinkWellness`

    // Update product image
    const productImage = document.getElementById("productImage")
    if (productImage) {
      // Ensure image path is correct
      let imagePath = product.image
      if (imagePath && !imagePath.startsWith("./") && !imagePath.startsWith("/")) {
        imagePath = `./${imagePath}`
      }
      productImage.src = imagePath
      productImage.alt = product.name
    }

    // Update product name
    const productName = document.getElementById("productName")
    if (productName) {
      productName.textContent = product.name
    }

    // Update product description
    const productDescription = document.getElementById("productDescription")
    if (productDescription) {
      productDescription.textContent = product.description
    }

    // Update product price
    const productPrice = document.getElementById("productPrice")
    if (productPrice) {
      productPrice.textContent = `₹${product.price.toLocaleString()}`
    }

    // Update product details
    const productDetailsList = document.getElementById("productDetails")
    if (productDetailsList && product.details) {
      productDetailsList.innerHTML = ""
      product.details.forEach((detail) => {
        const li = document.createElement("li")
        li.textContent = detail
        productDetailsList.appendChild(li)
      })
    }
  }

  // Add to cart function
  function addToCart() {
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

  // Buy now function
  function buyNow() {
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

    // Show message
    showMessage("Redirecting to checkout...")

    // Redirect to checkout
    setTimeout(() => {
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

  // Add event listeners
  const addToCartBtn = document.getElementById("addToCartBtn")
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", addToCart)
  }

  const buyNowBtn = document.getElementById("buyNowBtn")
  if (buyNowBtn) {
    buyNowBtn.addEventListener("click", buyNow)
  }

  // Initialize
  renderProductDetails()
  updateCartCount()
})
