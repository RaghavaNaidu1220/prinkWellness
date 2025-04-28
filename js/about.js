document.addEventListener("DOMContentLoaded", () => {
    // Set current year in footer
    document.getElementById("currentYear").textContent = new Date().getFullYear()
  
    // Mobile menu toggle
    const menuBtn = document.getElementById("menuBtn")
    const mobileMenu = document.getElementById("mobileMenu")
    const closeMenu = document.getElementById("closeMenu")
  
    if (menuBtn && mobileMenu && closeMenu) {
      menuBtn.addEventListener("click", () => {
        mobileMenu.classList.add("open")
      })
  
      closeMenu.addEventListener("click", () => {
        mobileMenu.classList.remove("open")
      })
    }
  
    // Scroll animations
    const animateElements = document.querySelectorAll(".animate-on-scroll")
  
    function checkScroll() {
      animateElements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top
        const windowHeight = window.innerHeight
  
        if (elementTop < windowHeight * 0.8) {
          element.classList.add("visible")
  
          // Add delay if specified
          const delay = element.getAttribute("data-delay")
          if (delay) {
            element.style.transitionDelay = `${delay}ms`
          }
        }
      })
    }
  
    // Check on initial load
    checkScroll()
  
    // Check on scroll
    window.addEventListener("scroll", checkScroll)
  })
  