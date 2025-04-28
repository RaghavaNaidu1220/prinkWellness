document.addEventListener("DOMContentLoaded", () => {
  // Set current year in footer
  const currentYearElement = document.getElementById("currentYear")
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear()
  }

  // Fix image paths if needed
  const allImages = document.querySelectorAll("img")
  allImages.forEach((img) => {
    if (img.src.includes("./public/images/")) {
      img.src = img.src.replace("./public/images/", "./images/")
    }
  })

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

  // Cart button click
  const cartButtons = document.querySelectorAll("#cartBtn, #mobileCartBtn")
  cartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      window.location.href = "cart.html"
    })
  })

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

  // Initialize cart count
  updateCartCount()

  // Add a function to handle adding products to cart
  function addToCart(product) {
    // Get existing cart from localStorage
    const cart = JSON.parse(localStorage.getItem("prinkwellness-cart")) || []

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
    localStorage.setItem("prinkwellness-cart", JSON.stringify(cart))

    // Update cart count display
    updateCartCount()
  }

  // Buy Now buttons functionality - FIXED with absolute paths
  const buyNowButtons = document.querySelectorAll(".buy-now-btn")
  if (buyNowButtons.length > 0) {
    buyNowButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault()
        console.log("Buy Now button clicked")

        // Get product information from parent card
        const productCard = this.closest(".product-card")
        if (!productCard) {
          console.error("Product card not found")
          return
        }

        const productId = productCard.dataset.productId || "1"
        const productName = productCard.querySelector(".product-title")?.textContent || "PrinkWellness Product"
        const productPriceText = productCard.querySelector(".product-price")?.textContent || "₹999"
        const productPrice = Number.parseFloat(productPriceText.replace(/[₹,]/g, ""))
        const productImage = productCard.querySelector("img")?.src || "/images/product-image-1.png"

        console.log("Product details:", { productId, productName, productPrice, productImage })

        // Create buy now cart item
        const buyNowItem = {
          id: productId,
          name: productName,
          price: productPrice,
          image: productImage,
          quantity: 1,
        }

        // Store in a separate buy-now cart
        localStorage.setItem("prinkwellness-buynow", JSON.stringify([buyNowItem]))
        console.log("Saved to buy-now cart:", buyNowItem)

        // Add button press animation
        this.classList.add("button-pressed")

        // Create and show confirmation message
        const confirmation = document.createElement("div")
        confirmation.className = "buy-now-confirmation"
        confirmation.innerHTML = `
      <div class="confirmation-content">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <p>Product added! Redirecting to checkout...</p>
      </div>
    `
        document.body.appendChild(confirmation)

        // Show confirmation
        setTimeout(() => {
          confirmation.classList.add("show")
        }, 100)

        // Redirect to checkout after delay - FIXED: using absolute path
        setTimeout(() => {
          console.log("Redirecting to checkout.html")
          window.location.href = "/checkout.html"
        }, 1500)
      })
    })
  }

  // Animation on scroll
  const animatedElements = document.querySelectorAll(
    ".animate-fade-in, .animate-slide-up, .animate-slide-in-right, .animate-slide-in-left",
  )

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animationPlayState = "running"
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 },
    )

    animatedElements.forEach((element) => {
      element.style.animationPlayState = "paused"
      observer.observe(element)
    })
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    animatedElements.forEach((element) => {
      element.style.animationPlayState = "running"
    })
  }

  // Initialize animations
  const animateElements = document.querySelectorAll(".animate-on-scroll")

  function checkScroll() {
    animateElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top
      const windowHeight = window.innerHeight

      if (elementTop < windowHeight * 0.85) {
        // Add delay if specified
        const delay = element.dataset.delay || 0
        setTimeout(() => {
          element.classList.add("visible")
        }, delay)
      }
    })
  }

  // Check elements on load
  checkScroll()

  // Check elements on scroll with throttling
  let scrollTimeout
  window.addEventListener("scroll", () => {
    if (!scrollTimeout) {
      scrollTimeout = setTimeout(() => {
        checkScroll()
        scrollTimeout = null
      }, 20)
    }
  })

  // Add ripple effect to all buttons
  const allButtons = document.querySelectorAll(
    "button, .primary-button, .secondary-button, .product-button, .buy-now-btn",
  )

  allButtons.forEach((button) => {
    if (!button) return

    button.addEventListener("click", function (e) {
      const rect = this.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const ripple = document.createElement("span")
      ripple.className = "ripple"
      ripple.style.left = `${x}px`
      ripple.style.top = `${y}px`

      this.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, 600)
    })

    // Add hover effect
    button.addEventListener("mouseenter", function () {
      this.classList.add("btn-hover")
    })

    button.addEventListener("mouseleave", function () {
      this.classList.remove("btn-hover")
    })
  })

  // Add premium hover effects to all cards and image containers
  const cards = document.querySelectorAll(".product-card, .review-card, .feature-card, .testimonial-card")
  cards.forEach((card) => {
    if (!card) return
    card.classList.add("premium-hover")
  })

  const imageContainers = document.querySelectorAll(".product-image, .product-image-container")
  imageContainers.forEach((container) => {
    if (!container) return
    container.classList.add("image-hover-effect")
  })

  // Newsletter form submission
  const newsletterForm = document.querySelector(".newsletter-form")
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault()

      const emailInput = this.querySelector('input[type="email"]')
      const email = emailInput.value

      if (!email) return

      // Show loading state
      const submitBtn = this.querySelector('button[type="submit"]')
      const originalText = submitBtn.textContent
      submitBtn.innerHTML = '<span class="loading-spinner"></span> Subscribing...'
      submitBtn.disabled = true

      // Simulate form submission
      setTimeout(() => {
        // Show success message
        const successMessage = document.createElement("div")
        successMessage.className = "newsletter-success"
        successMessage.innerHTML = `
          <div class="success-content">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <p>Thank you for subscribing!</p>
          </div>
        `

        // Replace form with success message
        newsletterForm.parentNode.replaceChild(successMessage, newsletterForm)
      }, 1500)
    })
  }

  // Debug function to log cart contents
  function debugCart() {
    const cart = JSON.parse(localStorage.getItem("prinkwellness-cart") || "[]")
    console.log("Current cart contents:", cart)

    const buyNowCart = JSON.parse(localStorage.getItem("prinkwellness-buynow") || "[]")
    console.log("Buy Now cart contents:", buyNowCart)
  }

  // Call debug function
  debugCart()
})
