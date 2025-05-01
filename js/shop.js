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
          image: "./public/images/product-image-1.png",
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
          available: true,
        },
        {
          id: "2",
          name: "PrinkWellness 3-Pack",
          description:
            "Save with our 3-pack bundle. Perfect for monthly use, this pack provides you with enough suppositories for consistent relief.",
          price: 2499,
          image: "./public/images/product-image-2.jpeg",
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
          available: true,
        },
        {
          id: "3",
          name: "PrinkWellness Monthly Subscription",
          description:
            "Never run out of relief with our monthly subscription. Get a fresh pack delivered to your doorstep every month at a special price.",
          price: 899,
          image: "./public/images/product-image-3.png",
          details: [
            "Monthly delivery of 2 suppositories (2.4g each)",
            "100mg strength",
            "Made with Vijaya, peppermint oil, cocoa butter, and beeswax",
            "Clinically validated for menstrual pain relief",
            "Fast-acting, targeted relief",
            "100% natural ingredients",
            "Save 10% compared to buying individually",
            "Cancel anytime",
          ],
          instructions:
            "Store in a cool, dry place. For best results, refrigerate before use. Follow the included instructions for proper insertion and use.",
          available: false,
          comingSoon: true,
        },
      ]

      // Save default products to localStorage
      localStorage.setItem("prinkwellness-products", JSON.stringify(products))
    }

    // Variables for product detail section
    const productsSection = document.getElementById("productsSection")
    const productDetailSection = document.getElementById("productDetailSection")
    const backToProductsBtn = document.getElementById("backToProducts")
    let currentProduct = null
    let currentQuantity = 1

    // Render products in grid
    function renderProducts() {
      const productsGrid = document.getElementById("productsGrid")
      if (!productsGrid) return

      // Clear container
      productsGrid.innerHTML = ""

      // Render each product
      products.forEach((product) => {
        // Ensure image path is correct
        if (product.image && !product.image.startsWith("./public/")) {
          product.image = `./public/images/${product.image.split("/").pop()}`
        }

        const productCard = document.createElement("div")
        productCard.className = "product-card animate-on-scroll"
        productCard.dataset.productId = product.id
        productCard.dataset.delay = Math.random() * 300 // Add a random delay for staggered animation

        let productFooter = ""
        if (product.comingSoon) {
          productFooter = `
            <div class="product-footer">
              <div class="coming-soon-badge">Coming Soon</div>
              <button class="product-button view-product-btn" data-product-id="${product.id}">View Details</button>
            </div>
          `
        } else {
          productFooter = `
            <div class="product-footer">
              <button class="product-button view-product-btn" data-product-id="${product.id}">View Product</button>
            </div>
          `
        }

        productCard.innerHTML = `
          <div class="product-image">
            <img src="${product.image}" alt="${product.name}" class="product-img">
          </div>
          <div class="product-content">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <p class="product-price">₹${product.price.toLocaleString()}</p>
          </div>
          ${productFooter}
        `
        productsGrid.appendChild(productCard)
      })

      // Add event listeners to view product buttons
      document.querySelectorAll(".view-product-btn").forEach((button) => {
        button.addEventListener("click", (e) => {
          const productId = e.target.dataset.productId
          showProductDetail(productId)
        })
      })

      // Add event listeners to product images
      document.querySelectorAll(".product-img").forEach((img) => {
        img.addEventListener("click", (e) => {
          const productCard = e.target.closest(".product-card")
          if (productCard) {
            const productId = productCard.dataset.productId
            showProductDetail(productId)
          }
        })
      })

      // Initialize animations
      animateProductCards()
    }

    // Show product detail
    function showProductDetail(productId) {
      // Find the product
      const product = products.find((p) => p.id === productId)
      if (!product) return

      // Store current product
      currentProduct = product
      currentQuantity = 1

      // Set product details
      document.getElementById("detailProductImage").src = product.image
      document.getElementById("detailProductImage").alt = product.name
      document.getElementById("detailProductName").textContent = product.name
      document.getElementById("detailProductPrice").textContent = `₹${product.price.toLocaleString()}`
      document.getElementById("detailProductDescription").textContent = product.description
      document.getElementById("detailQuantityValue").textContent = currentQuantity

      // Set product features
      const featuresList = document.getElementById("detailProductFeatures")
      featuresList.innerHTML = ""
      product.details.forEach((detail) => {
        const li = document.createElement("li")
        li.textContent = detail
        featuresList.appendChild(li)
      })

      // Set how to use instructions with dropdown functionality
      const howToUseContainer = document.getElementById("detailHowToUseContainer")
      if (howToUseContainer) {
        howToUseContainer.innerHTML = `
          <div id="howToUseHeader" class="dropdown-header">
            <h3>How to Use</h3>
            <span class="dropdown-arrow">▼</span>
          </div>
          <div id="howToUseContent" class="dropdown-content">
            <p>${product.instructions || "Instructions not available."}</p>
          </div>
        `
      }

      // Handle coming soon products
      const addToCartBtn = document.getElementById("detailAddToCartBtn")
      const buyNowBtn = document.getElementById("detailBuyNowBtn")
      const comingSoonBadge = document.getElementById("detailComingSoonBadge")

      if (product.comingSoon) {
        if (addToCartBtn) addToCartBtn.style.display = "none"
        if (buyNowBtn) buyNowBtn.style.display = "none"
        if (comingSoonBadge) comingSoonBadge.style.display = "block"
      } else {
        if (addToCartBtn) addToCartBtn.style.display = "block"
        if (buyNowBtn) buyNowBtn.style.display = "block"
        if (comingSoonBadge) comingSoonBadge.style.display = "none"
      }

      // Hide products section and show detail section
      productsSection.style.display = "none"
      productDetailSection.style.display = "block" // Make sure this is set to "block"

      // Initialize dropdowns
      initializeDropdowns()

      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" })
    }

    // Initialize dropdown functionality
    function initializeDropdowns() {
      const howToUseHeader = document.getElementById("howToUseHeader")
      const howToUseContent = document.getElementById("howToUseContent")

      if (howToUseHeader && howToUseContent) {
        howToUseHeader.addEventListener("click", () => {
          howToUseHeader.classList.toggle("active")
          howToUseContent.classList.toggle("active")
        })
      }
    }

    // Back to products button
    if (backToProductsBtn) {
      backToProductsBtn.addEventListener("click", () => {
        productDetailSection.style.display = "none"
        productsSection.style.display = "block"
      })
    }

    // Quantity controls for detail page
    const detailDecreaseBtn = document.getElementById("detailDecreaseQuantity")
    const detailIncreaseBtn = document.getElementById("detailIncreaseQuantity")
    const detailQuantityValue = document.getElementById("detailQuantityValue")

    if (detailDecreaseBtn && detailIncreaseBtn && detailQuantityValue) {
      detailDecreaseBtn.addEventListener("click", () => {
        if (currentQuantity > 1) {
          currentQuantity--
          detailQuantityValue.textContent = currentQuantity
        }
      })

      detailIncreaseBtn.addEventListener("click", () => {
        currentQuantity++
        detailQuantityValue.textContent = currentQuantity
      })
    }

    // Buy now and add to cart buttons for detail page
    const detailBuyNowBtn = document.getElementById("detailBuyNowBtn")
    const detailAddToCartBtn = document.getElementById("detailAddToCartBtn")
    const detailAddedToCartMessage = document.getElementById("detailAddedToCartMessage")

    if (detailBuyNowBtn) {
      detailBuyNowBtn.addEventListener("click", () => {
        if (currentProduct && !currentProduct.comingSoon) {
          buyNow(currentProduct, currentQuantity)
        }
      })
    }

    if (detailAddToCartBtn) {
      detailAddToCartBtn.addEventListener("click", () => {
        if (currentProduct && !currentProduct.comingSoon) {
          addToCart(currentProduct, currentQuantity)
          detailAddedToCartMessage.classList.add("show")
          setTimeout(() => {
            detailAddedToCartMessage.classList.remove("show")
          }, 3000)
        }
      })
    }

    // Add animation to product cards
    function animateProductCards() {
      const productCards = document.querySelectorAll(".animate-on-scroll")

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(
                () => {
                  entry.target.classList.add("visible")
                },
                Number.parseInt(entry.target.dataset.delay || 0),
              )
              observer.unobserve(entry.target)
            }
          })
        },
        {
          threshold: 0.1,
        },
      )

      productCards.forEach((card) => {
        observer.observe(card)
      })
    }

    // Add to cart function
    function addToCart(product, quantity = 1) {
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
      showMessage("Product added to cart!")
    }

    // Buy now function
    function buyNow(product, quantity = 1) {
      console.log("Buy Now clicked for product:", product)

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
      console.log("Saved to cart for buy now:", buyNowItem)

      // Show message
      showMessage("Redirecting to checkout...")

      // Redirect to checkout
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

    // Find the function that creates product cards and update it to make images clickable
    function createProductCard(product) {
      const card = document.createElement("div")
      card.className = "product-card animate-on-scroll"
      card.dataset.id = product.id

      card.innerHTML = `
        <div class="product-image">
          <a href="javascript:void(0);" onclick="showProductDetail(${product.id})">
            <img src="${product.image}" alt="${product.name}" class="product-img">
          </a>
        </div>
        <div class="product-content">
          <h3 class="product-title">${product.name}</h3>
          <p class="product-description">${product.shortDescription}</p>
          ${product.comingSoon ? '<span class="coming-soon-badge">Coming Soon</span>' : ""}
        </div>
        <div class="product-footer">
          <p class="product-price">₹${product.price}</p>
          ${
            product.comingSoon
              ? '<button class="product-button disabled">Coming Soon</button>'
              : '<button class="product-button" onclick="showProductDetail(' + product.id + ')">View Product</button>'
          }
        </div>
      `

      return card
    }

    // Initialize
    renderProducts()
    updateCartCount()
  })
