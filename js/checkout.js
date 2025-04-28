document.addEventListener("DOMContentLoaded", () => {
  console.log("Checkout page loaded")

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

  // Get cart items from localStorage - FIXED: consistent localStorage key
  const cart = JSON.parse(localStorage.getItem("prinkwellness-cart") || "[]")
  console.log("Cart items loaded:", cart)

  // If cart is empty, show message and redirect
  if (cart.length === 0) {
    console.log("Cart is empty, showing empty cart message")

    // Create empty checkout message
    const checkoutContainer = document.querySelector(".checkout-container")
    const checkoutForms = document.querySelector(".checkout-forms")
    const checkoutProgress = document.querySelector(".checkout-progress")

    if (checkoutContainer) {
      const emptyCheckout = document.createElement("div")
      emptyCheckout.className = "empty-checkout"
      emptyCheckout.innerHTML = `
        <div class="empty-checkout-content">
          <div class="empty-checkout-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <h2>Your cart is empty</h2>
          <p>You need to add items to your cart before proceeding to checkout.</p>
          <a href="shop.html" class="primary-button">Shop Now</a>
        </div>
      `

      // Hide the checkout forms and progress
      if (checkoutForms) checkoutForms.style.display = "none"
      if (checkoutProgress) checkoutProgress.style.display = "none"

      // Insert the empty checkout message
      checkoutContainer.appendChild(emptyCheckout)
    }

    return
  }

  // Format price
  function formatPrice(price) {
    return `₹${price.toLocaleString()}`
  }

  // Calculate subtotal
  function calculateSubtotal() {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  // Update cart count
  function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0)

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

  // Render checkout items
  function renderCheckoutItems() {
    const checkoutItemsContainer = document.getElementById("checkoutItems")
    if (!checkoutItemsContainer) return

    // Clear container
    checkoutItemsContainer.innerHTML = ""

    if (cart.length === 0) {
      // Show empty cart message
      checkoutItemsContainer.innerHTML = `
        <div class="empty-checkout-message">
          <p>Your cart is empty. Please add items to your cart before checkout.</p>
          <a href="shop.html" class="primary-button">Continue Shopping</a>
        </div>
      `

      // Hide steps
      document.querySelectorAll(".checkout-steps .step").forEach((step) => {
        if (step.dataset.step !== "1") {
          step.style.display = "none"
        }
      })

      // Hide next button
      const nextButton = document.querySelector(".next-step[data-next='2']")
      if (nextButton) {
        nextButton.style.display = "none"
      }

      return
    }

    // Render each checkout item
    cart.forEach((item) => {
      // Ensure image path is correct
      if (item.image && !item.image.startsWith("./") && !item.image.startsWith("/")) {
        item.image = `./${item.image}`
      }

      const checkoutItem = document.createElement("div")
      checkoutItem.className = "checkout-item"
      checkoutItem.innerHTML = `
        <div class="item-image">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="item-details">
          <h3 class="item-name">${item.name}</h3>
          <p class="item-price">${formatPrice(item.price)} × ${item.quantity}</p>
        </div>
        <div class="item-total">${formatPrice(item.price * item.quantity)}</div>
      `
      checkoutItemsContainer.appendChild(checkoutItem)
    })
  }

  // Update summary
  function updateSummary() {
    const subtotal = calculateSubtotal()
    const shipping = subtotal > 0 ? 0 : 0 // Free shipping
    const total = subtotal + shipping

    // Update step 1 summary
    document.getElementById("subtotal").textContent = formatPrice(subtotal)
    document.getElementById("total").textContent = formatPrice(total)

    // Update step 4 summary if it exists
    const confirmationSubtotal = document.getElementById("confirmationSubtotal")
    const confirmationTotal = document.getElementById("confirmationTotal")

    if (confirmationSubtotal) {
      confirmationSubtotal.textContent = formatPrice(subtotal)
    }

    if (confirmationTotal) {
      confirmationTotal.textContent = formatPrice(total)
    }
  }

  // Form validation functions
  function validateShippingForm() {
    const shippingForm = document.getElementById("shippingForm")
    if (!shippingForm) return false

    const formElements = shippingForm.querySelectorAll("input[required]")
    let isValid = true

    formElements.forEach((input) => {
      if (!input.value.trim()) {
        input.classList.add("error")
        // Add error message if it doesn't exist
        if (!input.nextElementSibling || !input.nextElementSibling.classList.contains("error-message")) {
          const errorMessage = document.createElement("div")
          errorMessage.className = "error-message"
          errorMessage.textContent = "This field is required"
          input.insertAdjacentElement("afterend", errorMessage)
        }
        isValid = false
      } else {
        input.classList.remove("error")
        // Remove error message if it exists
        if (input.nextElementSibling && input.nextElementSibling.classList.contains("error-message")) {
          input.nextElementSibling.remove()
        }
      }
    })

    // Validate email format
    const emailInput = document.getElementById("email")
    if (emailInput && emailInput.value.trim()) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailPattern.test(emailInput.value)) {
        emailInput.classList.add("error")
        if (!emailInput.nextElementSibling || !emailInput.nextElementSibling.classList.contains("error-message")) {
          const errorMessage = document.createElement("div")
          errorMessage.className = "error-message"
          errorMessage.textContent = "Please enter a valid email address"
          emailInput.insertAdjacentElement("afterend", errorMessage)
        }
        isValid = false
      }
    }

    // Validate phone number format
    const phoneInput = document.getElementById("phone")
    if (phoneInput && phoneInput.value.trim()) {
      const phonePattern = /^\d{10}$/
      if (!phonePattern.test(phoneInput.value.replace(/\D/g, ""))) {
        phoneInput.classList.add("error")
        if (!phoneInput.nextElementSibling || !phoneInput.nextElementSibling.classList.contains("error-message")) {
          const errorMessage = document.createElement("div")
          errorMessage.className = "error-message"
          errorMessage.textContent = "Please enter a valid 10-digit phone number"
          phoneInput.insertAdjacentElement("afterend", errorMessage)
        }
        isValid = false
      }
    }

    // Validate pincode format
    const pincodeInput = document.getElementById("pincode")
    if (pincodeInput && pincodeInput.value.trim()) {
      const pincodePattern = /^\d{6}$/
      if (!pincodePattern.test(pincodeInput.value.replace(/\D/g, ""))) {
        pincodeInput.classList.add("error")
        if (!pincodeInput.nextElementSibling || !pincodeInput.nextElementSibling.classList.contains("error-message")) {
          const errorMessage = document.createElement("div")
          errorMessage.className = "error-message"
          errorMessage.textContent = "Please enter a valid 6-digit pincode"
          pincodeInput.insertAdjacentElement("afterend", errorMessage)
        }
        isValid = false
      }
    }

    return isValid
  }

  function validatePaymentForm() {
    const paymentForm = document.getElementById("paymentForm")
    if (!paymentForm) return false

    const formElements = paymentForm.querySelectorAll("input[required]")
    let isValid = true

    formElements.forEach((input) => {
      if (!input.value.trim()) {
        input.classList.add("error")
        // Add error message if it doesn't exist
        if (!input.nextElementSibling || !input.nextElementSibling.classList.contains("error-message")) {
          const errorMessage = document.createElement("div")
          errorMessage.className = "error-message"
          errorMessage.textContent = "This field is required"
          input.insertAdjacentElement("afterend", errorMessage)
        }
        isValid = false
      } else {
        input.classList.remove("error")
        // Remove error message if it exists
        if (input.nextElementSibling && input.nextElementSibling.classList.contains("error-message")) {
          input.nextElementSibling.remove()
        }
      }
    })

    // Validate card number format
    const cardNumberInput = document.getElementById("cardNumber")
    if (cardNumberInput && cardNumberInput.value.trim()) {
      // Remove spaces and check if it's 16 digits
      const cardNumber = cardNumberInput.value.replace(/\s/g, "")
      if (!/^\d{16}$/.test(cardNumber)) {
        cardNumberInput.classList.add("error")
        if (
          !cardNumberInput.nextElementSibling ||
          !cardNumberInput.nextElementSibling.classList.contains("error-message")
        ) {
          const errorMessage = document.createElement("div")
          errorMessage.className = "error-message"
          errorMessage.textContent = "Please enter a valid 16-digit card number"
          cardNumberInput.insertAdjacentElement("afterend", errorMessage)
        }
        isValid = false
      }
    }

    // Validate expiry date format (MM/YY)
    const expiryInput = document.getElementById("expiry")
    if (expiryInput && expiryInput.value.trim()) {
      const expiryPattern = /^(0[1-9]|1[0-2])\/([0-9]{2})$/
      if (!expiryPattern.test(expiryInput.value)) {
        expiryInput.classList.add("error")
        if (!expiryInput.nextElementSibling || !expiryInput.nextElementSibling.classList.contains("error-message")) {
          const errorMessage = document.createElement("div")
          errorMessage.className = "error-message"
          errorMessage.textContent = "Please enter a valid expiry date (MM/YY)"
          expiryInput.insertAdjacentElement("afterend", errorMessage)
        }
        isValid = false
      } else {
        // Check if the card is not expired
        const [month, year] = expiryInput.value.split("/")
        const expiryDate = new Date(2000 + Number.parseInt(year), Number.parseInt(month) - 1, 1)
        const today = new Date()
        if (expiryDate < today) {
          expiryInput.classList.add("error")
          if (!expiryInput.nextElementSibling || !expiryInput.nextElementSibling.classList.contains("error-message")) {
            const errorMessage = document.createElement("div")
            errorMessage.className = "error-message"
            errorMessage.textContent = "Card has expired"
            expiryInput.insertAdjacentElement("afterend", errorMessage)
          }
          isValid = false
        }
      }
    }

    // Validate CVV format (3 digits)
    const cvvInput = document.getElementById("cvv")
    if (cvvInput && cvvInput.value.trim()) {
      if (!/^\d{3}$/.test(cvvInput.value)) {
        cvvInput.classList.add("error")
        if (!cvvInput.nextElementSibling || !cvvInput.nextElementSibling.classList.contains("error-message")) {
          const errorMessage = document.createElement("div")
          errorMessage.className = "error-message"
          errorMessage.textContent = "Please enter a valid 3-digit CVV"
          cvvInput.insertAdjacentElement("afterend", errorMessage)
        }
        isValid = false
      }
    }

    return isValid
  }

  // Format card number with spaces
  const cardNumberInputFormatting = document.getElementById("cardNumber")
  if (cardNumberInputFormatting) {
    cardNumberInputFormatting.addEventListener("input", function (e) {
      // Remove all non-digits
      let value = this.value.replace(/\D/g, "")

      // Add a space after every 4 digits
      if (value.length > 0) {
        value = value.match(/.{1,4}/g).join(" ")
      }

      // Update the input value
      this.value = value
    })
  }

  // Format expiry date with slash
  const expiryInputFormatting = document.getElementById("expiry")
  if (expiryInputFormatting) {
    expiryInputFormatting.addEventListener("input", function (e) {
      // Remove all non-digits
      let value = this.value.replace(/\D/g, "")

      // Add a slash after the first 2 digits
      if (value.length > 2) {
        value = value.substring(0, 2) + "/" + value.substring(2, 4)
      }

      // Update the input value
      this.value = value
    })
  }

  // Checkout steps navigation
  const steps = document.querySelectorAll(".checkout-form")
  const stepIndicators = document.querySelectorAll(".progress-step")

  // Next step buttons
  document.querySelectorAll(".next-step").forEach((button) => {
    button.addEventListener("click", function () {
      const nextStepNumber = Number.parseInt(this.dataset.next)
      console.log("Moving to step:", nextStepNumber)

      // If moving to step 2, validate step 1
      if (nextStepNumber === 2) {
        if (cart.length === 0) {
          alert("Your cart is empty. Please add items to your cart before proceeding.")
          return
        }
      }

      // If moving to step 3, validate shipping form
      if (nextStepNumber === 3) {
        if (!validateShippingForm()) {
          alert("Please fill in all required fields correctly.")
          return
        }
      }

      // Hide all steps
      steps.forEach((step) => {
        step.classList.remove("active")
      })

      // Show the next step
      const nextStep = document.getElementById(`step${nextStepNumber}`)
      if (nextStep) {
        nextStep.classList.add("active")
        console.log("Activated step:", nextStepNumber)
      } else {
        console.error("Could not find step element:", `step${nextStepNumber}`)
      }

      // Update step indicators
      stepIndicators.forEach((indicator) => {
        indicator.classList.remove("active")
        if (Number.parseInt(indicator.dataset.step) === nextStepNumber) {
          indicator.classList.add("active")
        } else if (Number.parseInt(indicator.dataset.step) < nextStepNumber) {
          indicator.classList.add("completed")
        } else {
          indicator.classList.remove("completed")
        }
      })

      // Scroll to top
      window.scrollTo(0, 0)
    })
  })

  // Previous step buttons
  document.querySelectorAll(".prev-step").forEach((button) => {
    button.addEventListener("click", function () {
      const prevStepNumber = Number.parseInt(this.dataset.prev)

      // Hide all steps
      steps.forEach((step) => {
        step.classList.remove("active")
      })

      // Show the previous step
      document.getElementById(`step${prevStepNumber}`).classList.add("active")

      // Update step indicators
      stepIndicators.forEach((indicator) => {
        indicator.classList.remove("active")
        if (Number.parseInt(indicator.dataset.step) === prevStepNumber) {
          indicator.classList.add("active")
        } else if (Number.parseInt(indicator.dataset.step) < prevStepNumber) {
          indicator.classList.add("completed")
        } else {
          indicator.classList.remove("completed", "active")
        }
      })

      // Scroll to top
      window.scrollTo(0, 0)
    })
  })

  // Place order button
  const placeOrderBtn = document.getElementById("placeOrderBtn")
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener("click", function () {
      // Validate payment form
      if (!validatePaymentForm()) {
        alert("Please fill in all payment details correctly.")
        return
      }

      // Show loading state
      this.innerHTML = '<span class="loading-spinner"></span> Processing...'
      this.disabled = true

      // Add payment processing bar
      const paymentSection = document.querySelector("#step3 .checkout-section")
      if (paymentSection) {
        // Create payment processing element if it doesn't exist
        if (!document.querySelector(".payment-processing")) {
          const processingElement = document.createElement("div")
          processingElement.className = "payment-processing"
          processingElement.innerHTML = `
            <p>Processing your payment. Please do not refresh the page.</p>
            <div class="processing-bar">
              <div class="processing-progress"></div>
            </div>
            <p class="processing-text">Verifying payment information...</p>
          `
          paymentSection.appendChild(processingElement)
        }

        // Animate the progress bar
        const progressBar = document.querySelector(".processing-progress")
        const processingText = document.querySelector(".processing-text")

        if (progressBar && processingText) {
          // Start progress animation
          setTimeout(() => {
            progressBar.style.width = "30%"
            processingText.textContent = "Verifying payment information..."
          }, 300)

          setTimeout(() => {
            progressBar.style.width = "60%"
            processingText.textContent = "Processing transaction..."
          }, 1000)

          setTimeout(() => {
            progressBar.style.width = "100%"
            processingText.textContent = "Payment successful! Redirecting..."
          }, 1800)
        }
      }

      // Simulate payment processing
      setTimeout(() => {
        // Move to confirmation step
        steps.forEach((step) => {
          step.classList.remove("active")
        })

        document.getElementById("step4").classList.add("active")

        // Update step indicators
        stepIndicators.forEach((indicator) => {
          indicator.classList.remove("active")
          if (Number.parseInt(indicator.dataset.step) === 4) {
            indicator.classList.add("active")
          } else {
            indicator.classList.add("completed")
          }
        })

        // Populate confirmation details
        renderConfirmationItems()
        populateShippingAddress()
        setEstimatedDelivery()

        // Clear cart after successful order
        localStorage.removeItem("prinkwellness-cart")

        // Scroll to top
        window.scrollTo(0, 0)
      }, 2500)
    })
  }

  // Render confirmation items
  function renderConfirmationItems() {
    const confirmationItemsContainer = document.getElementById("confirmationItems")
    if (!confirmationItemsContainer) return

    // Clear container
    confirmationItemsContainer.innerHTML = ""

    // Render each item
    cart.forEach((item) => {
      const confirmationItem = document.createElement("div")
      confirmationItem.className = "confirmation-item"
      confirmationItem.innerHTML = `
        <div class="item-name">${item.name} × ${item.quantity}</div>
        <div class="item-price">${formatPrice(item.price * item.quantity)}</div>
      `
      confirmationItemsContainer.appendChild(confirmationItem)
    })
  }

  // Populate shipping address in confirmation
  function populateShippingAddress() {
    const shippingAddressContainer = document.getElementById("shippingAddress")
    if (!shippingAddressContainer) return

    const fullName = document.getElementById("fullName").value
    const address = document.getElementById("address").value
    const city = document.getElementById("city").value
    const state = document.getElementById("state").value
    const pincode = document.getElementById("pincode").value
    const phone = document.getElementById("phone").value
    const email = document.getElementById("email").value

    shippingAddressContainer.innerHTML = `
      <p>${fullName}</p>
      <p>${address}</p>
      <p>${city}, ${state} ${pincode}</p>
      <p>Phone: ${phone}</p>
      <p>Email: ${email}</p>
    `
  }

  // Set estimated delivery date
  function setEstimatedDelivery() {
    const deliveryDateElement = document.getElementById("deliveryDate")
    if (!deliveryDateElement) return

    // Calculate delivery date (5-7 days from now)
    const today = new Date()
    const minDelivery = new Date(today)
    minDelivery.setDate(today.getDate() + 5)

    const maxDelivery = new Date(today)
    maxDelivery.setDate(today.getDate() + 7)

    // Format dates
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    const minDeliveryStr = minDelivery.toLocaleDateString("en-IN", options)
    const maxDeliveryStr = maxDelivery.toLocaleDateString("en-IN", options)

    deliveryDateElement.textContent = `${minDeliveryStr} - ${maxDeliveryStr}`
  }

  // Add input event listeners for real-time validation
  const shippingInputs = document.querySelectorAll("#shippingForm input[required]")
  shippingInputs.forEach((input) => {
    input.addEventListener("blur", function () {
      if (!this.value.trim()) {
        this.classList.add("error")
        // Add error message if it doesn't exist
        if (!this.nextElementSibling || !this.nextElementSibling.classList.contains("error-message")) {
          const errorMessage = document.createElement("div")
          errorMessage.className = "error-message"
          errorMessage.textContent = "This field is required"
          this.insertAdjacentElement("afterend", errorMessage)
        }
      } else {
        this.classList.remove("error")
        // Remove error message if it exists
        if (this.nextElementSibling && this.nextElementSibling.classList.contains("error-message")) {
          this.nextElementSibling.remove()
        }
      }
    })
  })

  // Initialize
  renderCheckoutItems()
  updateSummary()
  updateCartCount()

  // Debug function to check DOM elements
  function debugCheckElements() {
    console.log("Checking critical elements:")

    // Check step containers
    for (let i = 1; i <= 4; i++) {
      const step = document.getElementById(`step${i}`)
      console.log(`Step ${i} element:`, step ? "Found" : "MISSING")
    }

    // Check step indicators
    const indicators = document.querySelectorAll(".checkout-steps .checkout-step")
    console.log("Step indicators found:", indicators.length)

    // Check buttons
    const nextButtons = document.querySelectorAll(".next-step")
    console.log("Next step buttons found:", nextButtons.length)

    // Check forms
    const shippingForm = document.getElementById("shippingForm")
    const paymentForm = document.getElementById("paymentForm")
    console.log("Shipping form:", shippingForm ? "Found" : "MISSING")
    console.log("Payment form:", paymentForm ? "Found" : "MISSING")
  }

  // Call debug function after DOM is loaded
  debugCheckElements()
})
