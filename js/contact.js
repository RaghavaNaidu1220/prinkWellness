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

  // FAQ toggle functionality
  const faqItems = document.querySelectorAll(".faq-item")

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question")
    const answer = item.querySelector(".faq-answer")

    if (question && answer) {
      // Initially hide all answers
      answer.style.display = "none"

      question.addEventListener("click", () => {
        // Toggle active class
        item.classList.toggle("active")

        // Toggle answer visibility with animation
        if (item.classList.contains("active")) {
          answer.style.display = "block"
          answer.style.animation = "fadeIn 0.5s ease"
        } else {
          answer.style.animation = "fadeOut 0.5s ease"
          setTimeout(() => {
            answer.style.display = "none"
          }, 500)
        }

        // Close other FAQs
        faqItems.forEach((otherItem) => {
          if (otherItem !== item && otherItem.classList.contains("active")) {
            otherItem.classList.remove("active")
            const otherAnswer = otherItem.querySelector(".faq-answer")
            if (otherAnswer) {
              otherAnswer.style.animation = "fadeOut 0.5s ease"
              setTimeout(() => {
                otherAnswer.style.display = "none"
              }, 500)
            }
          }
        })
      })
    }
  })

  // Check if EmailJS is loaded
  function isEmailJSLoaded() {
    return typeof emailjs !== "undefined"
  }

  // Contact form submission with email functionality
  const contactForm = document.getElementById("contactForm")

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form values
      const name = document.getElementById("name").value
      const email = document.getElementById("email").value
      const subject = document.getElementById("subject").value
      const message = document.getElementById("message").value

      // Validate form
      let isValid = true
      const formInputs = [
        { el: document.getElementById("name"), value: name },
        { el: document.getElementById("email"), value: email },
        { el: document.getElementById("subject"), value: subject },
        { el: document.getElementById("message"), value: message },
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
      const submitBtn = contactForm.querySelector('button[type="submit"]')
      const originalText = submitBtn.textContent
      submitBtn.innerHTML = '<span class="loading-spinner"></span> Sending...'
      submitBtn.disabled = true

      // Check if EmailJS is available
      if (!isEmailJSLoaded()) {
        console.error("EmailJS is not loaded. Please check your EmailJS configuration.")
        showFormFeedback(
          "error",
          "Email service is not available. Please try again later or contact us directly at info@prinkwellness.com",
        )
        submitBtn.innerHTML = originalText
        submitBtn.disabled = false
        return
      }

      // Prepare email data
      const emailData = {
        to_name: "PrinkWellness Team",
        from_name: name,
        from_email: email,
        subject: subject,
        message: message,
      }

      console.log("Sending contact form email with data:", emailData)

      // Send email using EmailJS with your provided credentials
      try {
        emailjs
          .send("service_apvc4bd", "template_ehkghel", emailData)
          .then((response) => {
            console.log("Email sent successfully:", response)

            // Show success message
            showFormFeedback("success", "Thank you for your message! We'll get back to you soon.")

            // Clear form
            contactForm.reset()

            // Reset submit button
            submitBtn.innerHTML = originalText
            submitBtn.disabled = false

            // Add ripple effect to button
            const ripple = document.createElement("span")
            ripple.className = "ripple"
            ripple.style.left = "50%"
            ripple.style.top = "50%"
            submitBtn.appendChild(ripple)

            setTimeout(() => {
              if (ripple.parentNode === submitBtn) {
                submitBtn.removeChild(ripple)
              }
            }, 600)
          })
          .catch((error) => {
            console.error("Email sending failed:", error)

            // Show error message
            showFormFeedback(
              "error",
              "Sorry, there was a problem sending your message. Please try again later or email us directly at info@prinkwellness.com",
            )

            // Reset submit button
            submitBtn.innerHTML = originalText
            submitBtn.disabled = false
          })
      } catch (error) {
        console.error("EmailJS error:", error)
        showFormFeedback(
          "error",
          "Sorry, there was a problem sending your message. Please try again later or email us directly at info@prinkwellness.com",
        )
        submitBtn.innerHTML = originalText
        submitBtn.disabled = false
      }
    })

    // Add focus effects to form fields
    const formInputs = contactForm.querySelectorAll("input, textarea")
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

  // Function to show form feedback
  function showFormFeedback(type, message) {
    // Create feedback element if it doesn't exist
    let feedback = document.querySelector(".form-feedback")
    if (!feedback) {
      feedback = document.createElement("div")
      feedback.className = `form-feedback ${type}`
      document.body.appendChild(feedback)
    } else {
      feedback.className = `form-feedback ${type}`
    }

    // Set content and show
    feedback.innerHTML = `
      <div class="form-feedback-content">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          ${
            type === "success"
              ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>'
              : '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12" y2="16"></line>'
          }
        </svg>
        <p>${message}</p>
      </div>
    `

    // Show feedback
    setTimeout(() => {
      feedback.classList.add("show")
    }, 100)

    // Hide after delay
    setTimeout(() => {
      feedback.classList.remove("show")
    }, 5000)
  }

  // Initialize scroll animations
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
      }, 20)
    }
  })
})
