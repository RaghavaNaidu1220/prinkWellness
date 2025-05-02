// Animation functionality for premium interactive effects

document.addEventListener("DOMContentLoaded", () => {
  // Add animation classes to elements
  addAnimationClasses()

  // Initialize scroll reveal animations
  initScrollReveal()

  // Add premium hover effects
  addPremiumEffects()

  // Check all buttons and add premium effects
  enhanceButtons()

  // Add back-to-top button functionality
  initBackToTop()
})

// Add animation classes to key elements
function addAnimationClasses() {
  // Hero section fade in
  const heroElements = document.querySelectorAll(".hero-section, .hero-content, .hero-image")
  heroElements.forEach((el, index) => {
    if (el) {
      el.classList.add("fade-in")
      el.style.animationDelay = `${index * 0.2}s`
    }
  })

  // Product images slide in
  const productImages = document.querySelectorAll(".product-image, .product-card img")
  productImages.forEach((el, index) => {
    if (el) {
      el.classList.add("slide-in")
      el.style.animationDelay = `${0.3 + index * 0.15}s`
    }
  })

  // Add pulse to CTA buttons
  const ctaButtons = document.querySelectorAll(".primary-button, .buy-now-btn")
  ctaButtons.forEach((btn) => {
    if (btn) {
      btn.classList.add("pulse-button")
    }
  })
}

// Initialize scroll reveal animations
function initScrollReveal() {
  // Add reveal class to sections
  const sections = document.querySelectorAll("section, .feature, .testimonial, .product-card")
  sections.forEach((section) => {
    if (section) {
      section.classList.add("reveal")
    }
  })

  // Check if element is in viewport and add active class
  function checkReveal() {
    const reveals = document.querySelectorAll(".reveal")
    const windowHeight = window.innerHeight

    reveals.forEach((reveal) => {
      if (!reveal) return

      const revealTop = reveal.getBoundingClientRect().top
      const revealPoint = 150

      if (revealTop < windowHeight - revealPoint) {
        reveal.classList.add("active")
      }
    })
  }

  // Initial check
  checkReveal()

  // Check on scroll with throttling for better performance
  let scrollTimeout
  window.addEventListener("scroll", () => {
    if (!scrollTimeout) {
      scrollTimeout = setTimeout(() => {
        checkReveal()
        scrollTimeout = null
      }, 20)
    }
  })
}

// Add premium hover effects
function addPremiumEffects() {
  // Add premium hover effect to cards
  const cards = document.querySelectorAll(".card, .product-card, .feature-card, .review-card")
  cards.forEach((card) => {
    if (card) {
      card.classList.add("premium-hover")
    }
  })

  // Add image hover zoom effect
  const imageContainers = document.querySelectorAll(".product-image-container, .feature-image")
  imageContainers.forEach((container) => {
    if (container) {
      container.classList.add("img-hover-zoom")
    }
  })
}

// Enhance buttons with premium effects
function enhanceButtons() {
  const buttons = document.querySelectorAll("button, .button, .btn, .primary-button, .secondary-button, .buy-now-btn")
  buttons.forEach((button) => {
    if (!button) return

    // Skip if already enhanced
    if (button.classList.contains("btn-premium")) return

    // Add premium class
    button.classList.add("btn-premium")

    // Ensure click functionality
    if (!button.hasAttribute("data-enhanced")) {
      button.setAttribute("data-enhanced", "true")

      // Add click effect
      button.addEventListener("click", (e) => {
        // Create ripple effect
        const ripple = document.createElement("span")
        ripple.className = "ripple"

        // Get button dimensions
        const buttonRect = button.getBoundingClientRect()
        const size = Math.max(buttonRect.width, buttonRect.height)

        // Calculate position
        const x = e.clientX - buttonRect.left
        const y = e.clientY - buttonRect.top

        // Set ripple styles
        ripple.style.width = ripple.style.height = `${size}px`
        ripple.style.left = `${x}px`
        ripple.style.top = `${y}px`

        // Add to button
        button.appendChild(ripple)

        // Remove ripple after animation
        setTimeout(() => {
          if (ripple.parentNode === button) {
            button.removeChild(ripple)
          }
        }, 600)
      })
    }

    // Add hover effects
    button.addEventListener("mouseenter", () => {
      button.classList.add("button-hover")
    })

    button.addEventListener("mouseleave", () => {
      button.classList.remove("button-hover")
    })
  })
}

// Buy Now button functionality
document.addEventListener("DOMContentLoaded", () => {
  const buyNowButtons = document.querySelectorAll(".buy-now-btn")

  buyNowButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault()

      // Get product information
      const productContainer = this.closest(".product-container") || this.closest(".product-card")
      let productId, productName, productPrice, productImage

      if (productContainer) {
        productId = productContainer.dataset.productId || "1"
        productName = productContainer.querySelector(".product-title")?.textContent || "Prink Wellness Product"
        productPrice = productContainer.querySelector(".product-price")?.textContent || "29.99"
        productImage = productContainer.querySelector("img")?.src || "./images/product-image-1.png"
      } else {
        // Default values if container not found
        productId = "1"
        productName = "Prink Wellness Product"
        productPrice = "29.99"
        productImage = "./images/product-image-1.png"
      }

      // Create product object
      const product = {
        id: productId,
        name: productName,
        price: Number.parseFloat(productPrice.replace("$", "")),
        image: productImage,
        quantity: 1,
      }

      // Add to cart
      addToCart(product)

      // Show confirmation
      showAddedToCartConfirmation(product.name)

      // Redirect to cart page after a short delay
      setTimeout(() => {
        window.location.href = "./cart.html"
      }, 1500)
    })
  })

  // Function to add product to cart
  function addToCart(product) {
    // Get existing cart from localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || []

    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex((item) => item.id === product.id)

    if (existingProductIndex > -1) {
      // Increase quantity if product already in cart
      cart[existingProductIndex].quantity += 1
    } else {
      // Add new product to cart
      cart.push(product)
    }

    // Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart))

    // Update cart count display if it exists
    updateCartCount()
  }

  // Function to update cart count display
  function updateCartCount() {
    const cartCountElement = document.querySelector(".cart-count")
    if (cartCountElement) {
      const cart = JSON.parse(localStorage.getItem("cart")) || []
      const totalItems = cart.reduce((total, item) => total + item.quantity, 0)
      cartCountElement.textContent = totalItems

      // Show the count if there are items
      if (totalItems > 0) {
        cartCountElement.style.display = "flex"
      } else {
        cartCountElement.style.display = "none"
      }
    }
  }

  // Function to show added to cart confirmation
  function showAddedToCartConfirmation(productName) {
    // Create confirmation element if it doesn't exist
    let confirmation = document.querySelector(".cart-confirmation")
    if (!confirmation) {
      confirmation = document.createElement("div")
      confirmation.className = "cart-confirmation"
      document.body.appendChild(confirmation)
    }

    // Set content and show
    confirmation.innerHTML = `
      <div class="cart-confirmation-content">
        <i class="fas fa-check-circle"></i>
        <p>${productName} added to cart!</p>
        <p class="cart-confirmation-redirect">Redirecting to cart...</p>
      </div>
    `

    confirmation.style.display = "flex"

    // Hide after delay
    setTimeout(() => {
      confirmation.style.display = "none"
    }, 3000)
  }

  // Initialize cart count on page load
  updateCartCount()
})

// Check all buttons for functionality
document.addEventListener("DOMContentLoaded", () => {
  // Check Buy Now buttons
  const buyNowButtons = document.querySelectorAll(".buy-now-btn, #buyNowBtn")
  buyNowButtons.forEach((button) => {
    if (!button) return

    // Add click animation
    button.addEventListener("click", function () {
      this.classList.add("button-pressed")
      setTimeout(() => {
        this.classList.remove("button-pressed")
      }, 200)
    })
  })

  // Check Add to Cart buttons
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn, #addToCartBtn")
  addToCartButtons.forEach((button) => {
    if (!button) return

    // Add click animation
    button.addEventListener("click", function () {
      this.classList.add("button-pressed")
      setTimeout(() => {
        this.classList.remove("button-pressed")
      }, 200)

      // Add cart icon animation
      const cartIcons = document.querySelectorAll(".cart-icon")
      cartIcons.forEach((icon) => {
        if (icon) {
          icon.classList.add("pulse-animation")
          setTimeout(() => {
            icon.classList.remove("pulse-animation")
          }, 1000)
        }
      })
    })
  })

  // Add hover effects to all interactive elements
  const interactiveElements = document.querySelectorAll("a, button, .card, .product-card")
  interactiveElements.forEach((element) => {
    if (!element) return

    element.addEventListener("mouseenter", function () {
      this.style.transition = "all 0.3s ease"
    })
  })
})

// Initialize back-to-top button
function initBackToTop() {
  // Create back-to-top button if it doesn't exist
  let backToTopButton = document.querySelector(".back-to-top")

  if (!backToTopButton) {
    backToTopButton = document.createElement("button")
    backToTopButton.className = "back-to-top"
    backToTopButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    `
    document.body.appendChild(backToTopButton)

    // Add click event
    backToTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })
  }

  // Show/hide button based on scroll position
  function toggleBackToTopButton() {
    if (window.scrollY > 300) {
      backToTopButton.classList.add("visible")
    } else {
      backToTopButton.classList.remove("visible")
    }
  }

  // Initial check
  toggleBackToTopButton()

  // Check on scroll
  window.addEventListener("scroll", toggleBackToTopButton)
}

// Reveal animations for Why PrinkWellness section
document.addEventListener("DOMContentLoaded", () => {
  // Function to check if element is in viewport
  function isInViewport(element) {
    const rect = element.getBoundingClientRect()
    return rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 && rect.bottom >= 0
  }

  // Function to handle reveal animations
  function handleRevealAnimations() {
    // Reveal text elements
    document.querySelectorAll(".reveal-text").forEach((element) => {
      if (isInViewport(element)) {
        element.classList.add("active")
      }
    })

    // Reveal items with delay
    document.querySelectorAll(".reveal-item").forEach((element) => {
      if (isInViewport(element)) {
        const delay = element.getAttribute("data-delay") || 0
        setTimeout(() => {
          element.classList.add("active")
        }, delay)
      }
    })
  }

  // Run on page load
  handleRevealAnimations()

  // Run on scroll
  window.addEventListener("scroll", handleRevealAnimations)
})
