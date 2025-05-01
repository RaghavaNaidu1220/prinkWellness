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
          "Contains 2 suppositories (2.4g each)",
          "100mg strength",
          "Made with Vijaya, peppermint oil, cocoa butter, and beeswax",
          "Clinically validated for menstrual pain relief",
          "Fast-acting, targeted relief",
          "100% natural ingredients",
        ],
        instructions:
          "Store in a cool, dry place. For best results, refrigerate before use. Follow the included instructions for proper insertion and use.",
      },
      {
        id: "2",
        name: "PrinkWellness 3-Pack",
        description:
          "Save with our 3-pack bundle. Perfect for monthly use, this pack provides you with enough suppositories for consistent relief throughout your cycle.",
        price: 2499,
        image: "./images/product-image-2.jpeg",
        details: [
          "Contains 6 suppositories (2.4g each)",
          "100mg strength",
          "Made with Vijaya, peppermint oil, cocoa butter, and beeswax",
          "Clinically validated for menstrual pain relief",
          "Fast-acting, targeted relief",
          "100% natural ingredients",
          "Save 15% compared to buying individually",
        ],
        instructions:
          "Store in a cool, dry place. For best results, refrigerate before use. Follow the included instructions for proper insertion and use.",
      },
    ]

    // Save default products to localStorage
    localStorage.setItem("prinkwellness-products", JSON.stringify(products))
  }

  // Find the selected product
  const product = products.find((p) => p.id === productId)

  // Show product not found message if product doesn't exist
  if (!product) {
    document.getElementById("productNotFound").style.display = "block"
    document.getElementById("productDetail").style.display = "none"
    return
  }

  // Render product details
  function renderProductDetails() {
    console.log("Rendering product details for:", product)

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

    // Update product instructions
    const productInstructions = document.getElementById("productInstructions")
    if (productInstructions && product.instructions) {
      productInstructions.textContent = product.instructions
    }

    // Add animations
    document.querySelector(".product-image-container").classList.add("animate-slide-in-left")
    document.querySelector(".product-info-container").classList.add("animate-slide-in-right")
  }

  // Quantity controls
  let quantity = 1
  const quantityValue = document.getElementById("quantityValue")
  const decreaseBtn = document.getElementById("decreaseQuantity")
  const increaseBtn = document.getElementById("increaseQuantity")

  if (decreaseBtn && increaseBtn && quantityValue) {
    decreaseBtn.addEventListener("click", () => {
      if (quantity > 1) {
        quantity--
        quantityValue.textContent = quantity
      }
    })

    increaseBtn.addEventListener("click", () => {
      quantity++
      quantityValue.textContent = quantity
    })
  }

  // Add to cart function
  function addToCart() {
    // Get existing cart
    const cart = JSON.parse(localStorage.getItem("prinkwellness-cart") || "[]")

    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex((item) => item.id === product.id)

    if (existingProductIndex > -1) {
      // Increase quantity if product already in cart
      cart[existingProductIndex].quantity += quantity
    } else {
      // Add new product to cart
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
      })
    }

    // Save to localStorage
    localStorage.setItem("prinkwellness-cart", JSON.stringify(cart))

    // Update cart count
    updateCartCount()

    // Show added to cart message
    const addedMessage = document.getElementById("addedToCartMessage")
    if (addedMessage) {
      addedMessage.classList.add("show")
      setTimeout(() => {
        addedMessage.classList.remove("show")
      }, 3000)
    }
  }

  // Buy now function
  function buyNow() {
    // Create buy now item
    const buyNowItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
    }

    // Store in the regular cart but clear it first
    localStorage.setItem("prinkwellness-cart", JSON.stringify([buyNowItem]))

    // Redirect to checkout
    window.location.href = "./checkout.html"
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

  // Handle cart button clicks
  const cartBtn = document.getElementById("cartBtn")
  const mobileCartBtn = document.getElementById("mobileCartBtn")

  if (cartBtn) {
    cartBtn.addEventListener("click", () => {
      window.location.href = "./cart.html"
    })
  }

  if (mobileCartBtn) {
    mobileCartBtn.addEventListener("click", () => {
      window.location.href = "./cart.html"
    })
  }

  // Initialize
  renderProductDetails()
  updateCartCount()
})
