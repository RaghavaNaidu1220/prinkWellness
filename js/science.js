document.addEventListener("DOMContentLoaded", () => {
    // Set current year in footer
    document.getElementById("currentYear").textContent = new Date().getFullYear()
  
    // Mobile menu functionality
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
  
    // FAQ accordion functionality
    const faqItems = document.querySelectorAll(".faq-item")
  
    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question")
  
      question.addEventListener("click", () => {
        const isActive = item.classList.contains("active")
  
        // Close all FAQ items
        faqItems.forEach((faqItem) => {
          faqItem.classList.remove("active")
        })
  
        // If the clicked item wasn't active, make it active
        if (!isActive) {
          item.classList.add("active")
        }
      })
    })
  
    // Scroll animation
    const animateElements = document.querySelectorAll(".animate-on-scroll")
  
    function checkScroll() {
      animateElements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top
        const windowHeight = window.innerHeight
  
        if (elementTop < windowHeight * 0.85) {
          element.classList.add("active")
        }
      })
    }
  
    // Initial check
    checkScroll()
  
    // Check on scroll
    window.addEventListener("scroll", checkScroll)
  })
  