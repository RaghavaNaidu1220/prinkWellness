document.addEventListener("DOMContentLoaded", () => {
  // Set current year in footer
  document.getElementById("currentYear").textContent = new Date().getFullYear()

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

  // Update cart count
  function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem("prinkwellness-cart") || "[]")
    const count = cartItems.reduce((total, item) => total + item.quantity, 0)

    const cartCountElements = document.querySelectorAll("#cartCount, #mobileCartCount")
    cartCountElements.forEach((element) => {
      element.textContent = count
    })
  }

  // Update cart count on page load
  updateCartCount()

  // Cart button click handler
  const cartButtons = document.querySelectorAll("#cartBtn, #mobileCartBtn")
  cartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      window.location.href = "cart.html"
    })
  })

  // Rating selection with improved interaction
  const ratingBtns = document.querySelectorAll(".rating-btn")
  const ratingInput = document.getElementById("rating")

  // Initialize with 5 stars active
  ratingBtns.forEach((btn, index) => {
    if (index < 5) {
      btn.classList.add("active")
    }
  })

  ratingBtns.forEach((btn) => {
    btn.addEventListener("mouseenter", function () {
      const rating = this.dataset.rating

      // Update visual state on hover
      ratingBtns.forEach((b, index) => {
        if (index < rating) {
          b.classList.add("hover")
          b.querySelector(".star-icon").style.transform = "scale(1.1)"
        } else {
          b.classList.remove("hover")
          b.querySelector(".star-icon").style.transform = "scale(1)"
        }
      })
    })

    btn.addEventListener("mouseleave", () => {
      // Reset hover state
      ratingBtns.forEach((b) => {
        b.classList.remove("hover")
        b.querySelector(".star-icon").style.transform = "scale(1)"
      })
    })

    btn.addEventListener("click", function () {
      const rating = this.dataset.rating
      ratingInput.value = rating

      // Update active state with animation
      ratingBtns.forEach((b, index) => {
        if (index < rating) {
          b.classList.add("active")
          b.querySelector(".star-icon").style.transform = "scale(1.2)"
          setTimeout(() => {
            b.querySelector(".star-icon").style.transform = "scale(1)"
          }, 200)
        } else {
          b.classList.remove("active")
        }
      })
    })
  })

  // Fix star sizing in existing reviews
  const reviewStars = document.querySelectorAll(".review-rating .stars")
  reviewStars.forEach((starContainer) => {
    const stars = starContainer.querySelectorAll(".star-icon")
    stars.forEach((star) => {
      // Apply explicit dimensions and flex-shrink: 0
      star.style.width = "16px"
      star.style.height = "16px"
      star.style.flexShrink = "0"
      star.style.display = "inline-block"
    })
  })

  // Initialize scroll animations with improved timing
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

  // Initial check and scroll listener with performance optimizations
  checkScroll()

  let scrollTimeout
  window.addEventListener("scroll", () => {
    if (!scrollTimeout) {
      scrollTimeout = setTimeout(() => {
        checkScroll()
        scrollTimeout = null
      }, 20) // Optimized delay
    }
  })

  // "Buy Now" button functionality
  const buyNowButtons = document.querySelectorAll(".buy-now-btn")

  buyNowButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      event.preventDefault() // Prevent default link behavior

      const productId = this.dataset.productId // Assuming each button has a data-product-id attribute
      // For simplicity, directly add the product to the cart in localStorage
      // In a real application, you'd likely send an API request to update the cart on the server

      const cart = JSON.parse(localStorage.getItem("prinkwellness-cart") || "[]")
      const existingItem = cart.find((item) => item.id === productId)

      if (existingItem) {
        existingItem.quantity++
      } else {
        cart.push({ id: productId, quantity: 1 })
      }

      localStorage.setItem("prinkwellness-cart", JSON.stringify(cart))
      updateCartCount() // Update the cart count display

      // Provide visual feedback to the user
      alert("Product added to cart!") // Replace with a more elegant notification
    })
  })

  // Check all buttons for hover effects (example)
  const allButtons = document.querySelectorAll("button, .button, a.btn") // Select all button-like elements

  allButtons.forEach((button) => {
    button.addEventListener("mouseover", () => {
      button.classList.add("hovered") // Add a class on hover
    })

    button.addEventListener("mouseout", () => {
      button.classList.remove("hovered") // Remove the class on mouse out
    })
  })

  // Review form submission with enhanced feedback
  const reviewForm = document.getElementById("reviewForm")

  if (reviewForm) {
    reviewForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form values
      const name = document.getElementById("name").value
      const email = document.getElementById("email").value
      const rating = document.getElementById("rating").value
      const review = document.getElementById("review").value

      // Validate form
      let isValid = true
      const formInputs = [
        { el: document.getElementById("name"), value: name },
        { el: document.getElementById("email"), value: email },
        { el: document.getElementById("review"), value: review },
      ]

      formInputs.forEach((input) => {
        if (!input.value.trim()) {
          input.el.classList.add("error")
          isValid = false

          // Add shake animation
          input.el.classList.add("shake")
          setTimeout(() => {
            input.el.classList.remove("shake")
          }, 500)
        } else {
          input.el.classList.remove("error")
        }
      })

      if (!isValid) {
        return
      }

      // Show loading state
      const submitBtn = reviewForm.querySelector('button[type="submit"]')
      const originalText = submitBtn.textContent
      submitBtn.innerHTML = '<span class="loading-spinner"></span> Submitting...'
      submitBtn.disabled = true

      // Simulate submission (in a real app, this would be an API call)
      setTimeout(() => {
        // Create and add the new review to the page
        const reviewsGrid = document.querySelector(".reviews-grid")
        const newReviewCard = document.createElement("div")
        newReviewCard.className = "review-card"
        newReviewCard.style.opacity = "0"
        newReviewCard.style.transform = "translateY(20px)"

        const currentDate = new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })

        // Create star HTML based on rating
        let starsHTML = ""
        for (let i = 0; i < rating; i++) {
          starsHTML +=
            '<svg class="star-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>'
        }

        newReviewCard.innerHTML = `
          <div class="review-header">
            <div class="reviewer-info">
              <h3 class="reviewer-name">${name}</h3>
              <p class="review-date">${currentDate}</p>
            </div>
            <div class="review-rating">
              <div class="stars">
                ${starsHTML}
              </div>
            </div>
          </div>
          <div class="review-content">
            <p class="review-text">"${review}"</p>
          </div>
        `

        // Add to the beginning of the grid
        if (reviewsGrid.firstChild) {
          reviewsGrid.insertBefore(newReviewCard, reviewsGrid.firstChild)
        } else {
          reviewsGrid.appendChild(newReviewCard)
        }

        // Animate the new review card
        setTimeout(() => {
          newReviewCard.style.transition = "opacity 0.5s ease, transform 0.5s ease"
          newReviewCard.style.opacity = "1"
          newReviewCard.style.transform = "translateY(0)"
        }, 100)

        // Show success message
        const successMessage = document.createElement("div")
        successMessage.className = "success-message"
        successMessage.innerHTML = `
          <div class="success-content">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <p>Thank you for your review! It has been published.</p>
          </div>
        `

        // Add success message styles
        const style = document.createElement("style")
        style.textContent = `
          .success-message {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #4CAF50;
            color: white;
            padding: 1rem;
            border-radius: var(--radius);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            animation: slideIn 0.5s ease forwards, fadeOut 0.5s ease 4s forwards;
            display: flex;
            align-items: center;
          }
          .success-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; visibility: hidden; }
          }
        `
        document.head.appendChild(style)
        document.body.appendChild(successMessage)

        // Remove success message after 5 seconds
        setTimeout(() => {
          if (successMessage.parentNode) {
            document.body.removeChild(successMessage)
          }
        }, 5000)

        // Clear form
        reviewForm.reset()

        // Reset rating buttons
        ratingBtns.forEach((btn, index) => {
          if (index < 5) {
            btn.classList.add("active")
          } else {
            btn.classList.remove("active")
          }
        })
        ratingInput.value = "5"

        // Reset submit button
        submitBtn.innerHTML = originalText
        submitBtn.disabled = false

        // Scroll to the new review
        newReviewCard.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 1500)
    })

    // Add focus effects to form fields
    const formInputs = reviewForm.querySelectorAll("input, textarea")
    formInputs.forEach((input) => {
      input.addEventListener("focus", () => {
        input.parentElement.classList.add("focused")
      })

      input.addEventListener("blur", () => {
        if (!input.value) {
          input.parentElement.classList.remove("focused")
        }
      })
    })
  }
})
document.addEventListener("DOMContentLoaded", () => {
  // Initialize animations
  initAnimations()

  // Initialize rating buttons
  initRatingButtons()

  // Initialize review form
  initReviewForm()
})

function initAnimations() {
  // Animate elements when they come into view
  const animatedElements = document.querySelectorAll(".animate-on-scroll")

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0
          setTimeout(() => {
            entry.target.classList.add("visible")
          }, delay)
        }
      })
    },
    { threshold: 0.1 },
  )

  animatedElements.forEach((element) => {
    observer.observe(element)
  })
}

function initRatingButtons() {
  const ratingButtons = document.querySelectorAll(".rating-btn")
  const ratingInput = document.getElementById("rating")

  ratingButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const rating = this.dataset.rating
      ratingInput.value = rating

      // Update active state
      ratingButtons.forEach((btn) => {
        if (btn.dataset.rating <= rating) {
          btn.classList.add("active")
        } else {
          btn.classList.remove("active")
        }
      })
    })
  })

  // Set default rating
  const defaultRating = 5
  ratingButtons.forEach((btn) => {
    if (btn.dataset.rating <= defaultRating) {
      btn.classList.add("active")
    }
  })
}

function initReviewForm() {
  const reviewForm = document.getElementById("reviewForm")

  if (reviewForm) {
    reviewForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form data
      const name = document.getElementById("name").value
      const email = document.getElementById("email").value
      const rating = document.getElementById("rating").value
      const review = document.getElementById("review").value

      // In a real application, you would send this data to a server
      console.log("Review submitted:", { name, email, rating, review })

      // Show success message or redirect
      alert("Thank you for your review!")

      // Reset form
      reviewForm.reset()

      // Reset rating buttons
      const ratingButtons = document.querySelectorAll(".rating-btn")
      ratingButtons.forEach((btn) => {
        if (btn.dataset.rating <= 5) {
          btn.classList.add("active")
        } else {
          btn.classList.remove("active")
        }
      })
    })
  }
}

// Add ripple effect to buttons
document.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("primary-button") ||
    e.target.classList.contains("secondary-button") ||
    e.target.classList.contains("rating-btn")
  ) {
    const button = e.target
    const ripple = document.createElement("span")
    ripple.classList.add("ripple")

    const rect = button.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ripple.style.left = x + "px"
    ripple.style.top = y + "px"

    button.appendChild(ripple)

    setTimeout(() => {
      ripple.remove()
    }, 600)
  }
})
