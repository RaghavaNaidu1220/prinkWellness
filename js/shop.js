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

  // Products data
  const products = [
    {
      id: "1",
      name: "PrinkWellness Vaginal Suppository",
      description:
        "Our clinically validated vaginal suppository is designed to provide direct, localized relief from menstrual cramps.",
      price: 999,
      images: [
        "./public/images/product-image-1.png",
        "./public/images/product-image-2.jpeg",
        "./public/images/product-image-3.png",
      ],
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
      reviews: [
        {
          name: "Priya S.",
          rating: 5,
          date: "2023-10-15",
          text: "This product changed my life! I've suffered from severe menstrual cramps for years, and nothing seemed to help. These suppositories provided relief within 20 minutes. I'm so grateful!",
        },
        {
          name: "Anjali M.",
          rating: 4,
          date: "2023-09-22",
          text: "Very effective for pain relief. I was skeptical at first, but I'm impressed with how quickly it works. The only reason for 4 stars instead of 5 is that I wish it lasted a bit longer.",
        },
        {
          name: "Deepika R.",
          rating: 5,
          date: "2023-11-03",
          text: "Finally something that actually works! No side effects and quick relief. I've recommended it to all my friends who suffer from period pain.",
        },
      ],
    },
    {
      id: "2",
      name: "PrinkWellness 3-Pack",
      description:
        "Save with our 3-pack bundle. Perfect for monthly use, this pack provides you with enough suppositories for consistent relief throughout your cycle.",
      price: 2499,
      images: [
        "./public/images/product-image-2.jpeg",
        "./public/images/product-image-3.png",
        "./public/images/product-image-1.png",
      ],
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
      reviews: [
        {
          name: "Meera K.",
          rating: 5,
          date: "2023-10-28",
          text: "The 3-pack is perfect for me. Great value and I love having enough for my entire cycle. The relief is amazing and consistent.",
        },
        {
          name: "Shalini T.",
          rating: 5,
          date: "2023-11-15",
          text: "Worth every rupee! I've tried everything from painkillers to heating pads, but nothing works as well as these suppositories. The 3-pack is convenient and saves money.",
        },
      ],
    },
    {
      id: "3",
      name: "PrinkWellness Monthly Subscription",
      description:
        "Never run out of relief with our monthly subscription. Get a fresh pack delivered to your doorstep every month at a special price.",
      price: 899,
      images: [
        "./public/images/product-image-3.png",
        "./public/images/product-image-2.jpeg",
        "./public/images/product-image-1.png",
      ],
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
      reviews: [],
    },
  ]

  // Save products to localStorage for persistence
  localStorage.setItem("prinkwellness-products", JSON.stringify(products))

  // Variables for product detail section
  const productsSection = document.getElementById("productsSection")
  const productDetailSection = document.getElementById("productDetailSection")
  const backToProductsBtn = document.getElementById("backToProducts")
  let currentProduct = null
  let currentQuantity = 1
  let currentImageIndex = 0

  // Render products in grid
  function renderProducts() {
    const productsGrid = document.getElementById("productsGrid")
    if (!productsGrid) return

    // Clear container
    productsGrid.innerHTML = ""

    // Render each product
    products.forEach((product) => {
      // Ensure image path is correct
      let imagePath = product.images ? product.images[0] : product.image
      if (imagePath && !imagePath.startsWith("./") && !imagePath.startsWith("/")) {
        imagePath = `./${imagePath}`
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
        <img src="${imagePath}" alt="${product.name}" class="product-img clickable-image" data-product-id="${product.id}">
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
        const productId = e.target.dataset.productId
        if (productId) {
          showProductDetail(productId)
        } else {
          const productCard = e.target.closest(".product-card")
          if (productCard) {
            const cardProductId = productCard.dataset.productId
            showProductDetail(cardProductId)
          }
        }
      })
    })

    // Make entire product card clickable
    document.querySelectorAll(".product-card").forEach((card) => {
  card.addEventListener("click", (e) => {
    const productId = card.dataset.productId;
    if (productId === "3") return; // Disable interaction for product 3
    if (!e.target.closest(".product-button")) {
      showProductDetail(productId);
    }
  });
});

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
    currentImageIndex = 0

    // Set product details
    const detailProductImage = document.getElementById("detailProductImage")
    const detailProductName = document.getElementById("detailProductName")
    const detailProductPrice = document.getElementById("detailProductPrice")
    const detailProductDescription = document.getElementById("detailProductDescription")
    const detailQuantityValue = document.getElementById("detailQuantityValue")
    const comingSoonBadge = document.getElementById("detailComingSoonBadge")

    // Set main product image
    if (detailProductImage) {
      const imagePath = product.images ? product.images[0] : product.image
      detailProductImage.src = imagePath
      detailProductImage.alt = product.name
    }

    if (detailProductName) detailProductName.textContent = product.name
    if (detailProductPrice) detailProductPrice.textContent = `₹${product.price.toLocaleString()}`
    if (detailProductDescription) detailProductDescription.textContent = product.description
    if (detailQuantityValue) detailQuantityValue.textContent = currentQuantity

    // Handle coming soon badge visibility
    if (comingSoonBadge) {
      comingSoonBadge.style.display = product.comingSoon ? "block" : "none"
    }

    // Set product features
    const featuresList = document.getElementById("detailProductFeatures")
    if (featuresList) {
      featuresList.innerHTML = ""
      product.details.forEach((detail) => {
        const li = document.createElement("li")
        li.textContent = detail
        featuresList.appendChild(li)
      })
    }

    // Set how to use instructions
    const howToUseContent = document.getElementById("howToUseContent")
    if (howToUseContent) {
      const instructionsText = document.getElementById("detailHowToUse")
      if (instructionsText) {
        instructionsText.innerHTML = `
          <strong>How to Use PrinkWellness Vaginal Suppositories:</strong>
          <ol class="how-to-use-steps">
            <li>Wash your hands thoroughly with soap and water.</li>
            <li>Remove the suppository from its packaging.</li>
            <li>Lie on your back with knees bent or stand with one leg raised.</li>
            <li>Gently insert the suppository into the vagina, pushing it as far as it will comfortably go.</li>
            <li>Remain in position for 5-10 minutes to allow the suppository to begin melting.</li>
            <li>Use a panty liner if desired, as some discharge is normal as the suppository melts.</li>
            <li>For best results, use at the first sign of menstrual discomfort.</li>
            <li>Relief typically begins within 15-30 minutes and lasts for 4-6 hours.</li>
            <li>May be used up to 3 times daily during menstruation.</li>
          </ol>
          <p class="usage-note"><strong>Note:</strong> Store in a cool, dry place. If suppository becomes too soft, refrigerate for 15-20 minutes before use.</p>
        `
      }
    }

    // Initialize image slider if product has multiple images
    initializeImageSlider(product)

    // Render product reviews
    renderProductReviews(product)

    // Handle coming soon products
    const addToCartBtn = document.getElementById("detailAddToCartBtn")
    const buyNowBtn = document.getElementById("detailBuyNowBtn")

    if (product.comingSoon) {
      if (addToCartBtn) addToCartBtn.style.display = "none"
      if (buyNowBtn) buyNowBtn.style.display = "none"
    } else {
      if (addToCartBtn) addToCartBtn.style.display = "block"
      if (buyNowBtn) buyNowBtn.style.display = "block"
    }

    // Hide products section and show detail section
    if (productsSection) productsSection.style.display = "none"
    if (productDetailSection) productDetailSection.style.display = "block"

    // Initialize dropdowns
    initializeDropdowns()

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Initialize image slider
  function initializeImageSlider(product) {
    const sliderDots = document.getElementById("sliderDots")
    const sliderPrev = document.getElementById("sliderPrev")
    const sliderNext = document.getElementById("sliderNext")
    const detailProductImage = document.getElementById("detailProductImage")

    // If no slider elements or product has no images, return
    if (!sliderDots || !sliderPrev || !sliderNext || !detailProductImage) return
    if (!product.images || product.images.length <= 1) {
      sliderDots.parentElement.style.display = "none"
      return
    }

    // Show slider controls
    sliderDots.parentElement.style.display = "flex"

    // Create dots for each image
    sliderDots.innerHTML = ""
    product.images.forEach((_, index) => {
      const dot = document.createElement("div")
      dot.className = `slider-dot ${index === 0 ? "active" : ""}`
      dot.dataset.index = index
      dot.addEventListener("click", () => {
        changeSlide(index)
      })
      sliderDots.appendChild(dot)
    })

    // Add event listeners to prev/next buttons
    sliderPrev.addEventListener("click", () => {
      changeSlide(currentImageIndex - 1)
    })

    sliderNext.addEventListener("click", () => {
      changeSlide(currentImageIndex + 1)
    })

    // Function to change slide
    function changeSlide(index) {
      // Handle index bounds
      if (index < 0) index = product.images.length - 1
      if (index >= product.images.length) index = 0

      // Update current index
      currentImageIndex = index

      // Update image
      detailProductImage.src = product.images[index]

      // Update dots
      const dots = sliderDots.querySelectorAll(".slider-dot")
      dots.forEach((dot, i) => {
        if (i === index) {
          dot.classList.add("active")
        } else {
          dot.classList.remove("active")
        }
      })
    }
  }

  // Render product reviews
  function renderProductReviews(product) {
    const reviewsContainer = document.getElementById("productReviewsContainer")
    if (!reviewsContainer) return

    // Clear previous reviews
    reviewsContainer.innerHTML = ""

    // Create reviews header
    const reviewsHeader = document.createElement("div")
    reviewsHeader.className = "reviews-header"
    reviewsHeader.innerHTML = `
      <h2 class="section-title">Customer Reviews</h2>
      <div class="overall-rating">
        <div class="rating-stars">
          ${generateStarRating(getAverageRating(product.reviews))}
        </div>
        <span class="rating-count">${product.reviews.length} ${product.reviews.length === 1 ? "review" : "reviews"}</span>
      </div>
    `
    reviewsContainer.appendChild(reviewsHeader)

    // If no reviews, show message
    if (!product.reviews || product.reviews.length === 0) {
      const noReviews = document.createElement("div")
      noReviews.className = "no-reviews"
      noReviews.textContent = product.comingSoon
        ? "This product is coming soon and has no reviews yet."
        : "This product has no reviews yet. Be the first to review!"
      reviewsContainer.appendChild(noReviews)
      return
    }

    // Create reviews list
    const reviewsList = document.createElement("div")
    reviewsList.className = "reviews-list"

    // Add each review
    product.reviews.forEach((review) => {
      const reviewItem = document.createElement("div")
      reviewItem.className = "review-item"
      reviewItem.innerHTML = `
        <div class="review-header">
          <div class="reviewer-info">
            <h4 class="reviewer-name">${review.name}</h4>
            <span class="review-date">${formatDate(review.date)}</span>
          </div>
          <div class="review-rating">
            ${generateStarRating(review.rating)}
          </div>
        </div>
        <div class="review-content">
          <p>${review.text}</p>
        </div>
      `
      reviewsList.appendChild(reviewItem)
    })

    reviewsContainer.appendChild(reviewsList)

    // Add review form if product is not coming soon
    if (!product.comingSoon) {
      const reviewForm = document.createElement("div")
      reviewForm.className = "review-form-container"
      reviewForm.innerHTML = `
        <h3>Write a Review</h3>
        <form id="productReviewForm" class="review-form">
          <div class="form-group">
            <label for="reviewName">Your Name</label>
            <input type="text" id="reviewName" name="reviewName" required>
          </div>
          <div class="form-group">
            <label for="reviewEmail">Your Email</label>
            <input type="email" id="reviewEmail" name="reviewEmail" required>
          </div>
          <div class="form-group">
            <label>Rating</label>
            <div class="rating-input">
              <input type="radio" id="star5" name="rating" value="5" required>
              <label for="star5">★</label>
              <input type="radio" id="star4" name="rating" value="4">
              <label for="star4">★</label>
              <input type="radio" id="star3" name="rating" value="3">
              <label for="star3">★</label>
              <input type="radio" id="star2" name="rating" value="2">
              <label for="star2">★</label>
              <input type="radio" id="star1" name="rating" value="1">
              <label for="star1">★</label>
            </div>
          </div>
          <div class="form-group">
            <label for="reviewText">Your Review</label>
            <textarea id="reviewText" name="reviewText" rows="4" required></textarea>
          </div>
          <button type="submit" class="submit-review-btn">Submit Review</button>
        </form>
      `
      reviewsContainer.appendChild(reviewForm)

      // Add event listener to review form
      setTimeout(() => {
        const form = document.getElementById("productReviewForm")
        if (form) {
          form.addEventListener("submit", (e) => {
            e.preventDefault()
            submitProductReview(product.id)
          })
        }
      }, 100)
    }
  }

  // Submit product review
  function submitProductReview(productId) {
    const nameInput = document.getElementById("reviewName")
    const emailInput = document.getElementById("reviewEmail")
    const ratingInput = document.querySelector('input[name="rating"]:checked')
    const textInput = document.getElementById("reviewText")

    if (!nameInput || !emailInput || !ratingInput || !textInput) return

    const newReview = {
      name: nameInput.value,
      rating: Number.parseInt(ratingInput.value),
      date: new Date().toISOString().split("T")[0],
      text: textInput.value,
    }

    // Find the product and add the review
    const productIndex = products.findIndex((p) => p.id === productId)
    if (productIndex === -1) return

    if (!products[productIndex].reviews) {
      products[productIndex].reviews = []
    }

    products[productIndex].reviews.push(newReview)

    // Save to localStorage
    localStorage.setItem("prinkwellness-products", JSON.stringify(products))

    // Re-render reviews
    renderProductReviews(products[productIndex])

    // Show success message
    showMessage("Thank you for your review!")

    // Clear form
    nameInput.value = ""
    emailInput.value = ""
    textInput.value = ""
    document.querySelectorAll('input[name="rating"]').forEach((input) => {
      input.checked = false
    })
  }

  // Helper function to generate star rating HTML
  function generateStarRating(rating) {
    const fullStars = Math.floor(rating)
    const halfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)

    let starsHTML = ""

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      starsHTML += '<span class="star full">★</span>'
    }

    // Half star
    if (halfStar) {
      starsHTML += '<span class="star half">★</span>'
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      starsHTML += '<span class="star empty">☆</span>'
    }

    return starsHTML
  }

  // Helper function to get average rating
  function getAverageRating(reviews) {
    if (!reviews || reviews.length === 0) return 0

    const sum = reviews.reduce((total, review) => total + review.rating, 0)
    return (sum / reviews.length).toFixed(1)
  }

  // Helper function to format date
  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-IN", options)
  }

  // Initialize dropdown functionality
  function initializeDropdowns() {
    const howToUseHeader = document.getElementById("howToUseHeader")
    const howToUseContent = document.getElementById("howToUseContent")

    if (howToUseHeader && howToUseContent) {
      // Remove existing event listeners by cloning and replacing
      const newHeader = howToUseHeader.cloneNode(true)
      howToUseHeader.parentNode.replaceChild(newHeader, howToUseHeader)

      // Set initial state
      howToUseContent.style.maxHeight = "0"

      // Add new event listener
      newHeader.addEventListener("click", () => {
        newHeader.classList.toggle("active")
        if (howToUseContent.classList.toggle("active")) {
          howToUseContent.style.maxHeight = howToUseContent.scrollHeight + "px"
        } else {
          howToUseContent.style.maxHeight = "0"
        }
      })
    }
  }

  // Back to products button
  if (backToProductsBtn) {
    backToProductsBtn.addEventListener("click", () => {
      if (productDetailSection) productDetailSection.style.display = "none"
      if (productsSection) productsSection.style.display = "block"
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
        if (detailAddedToCartMessage) {
          detailAddedToCartMessage.classList.add("show")
          setTimeout(() => {
            detailAddedToCartMessage.classList.remove("show")
          }, 3000)
        }
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
        image: product.images ? product.images[0] : product.image,
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
    // Create buy now item
    const buyNowItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images ? product.images[0] : product.image,
      quantity: quantity,
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

  // Initialize
  renderProducts()
  updateCartCount()
})
