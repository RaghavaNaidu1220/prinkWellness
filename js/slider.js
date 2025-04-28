document.addEventListener("DOMContentLoaded", () => {
    // Hero Slider Functionality
    const slider = document.getElementById("heroSlider")
    const slides = slider.querySelectorAll(".slide")
    const dots = document.querySelectorAll(".slider-dot")
    const prevBtn = document.getElementById("sliderPrev")
    const nextBtn = document.getElementById("sliderNext")
  
    let currentSlide = 0
    const slideCount = slides.length
    let slideInterval
  
    // Initialize the slider
    function initSlider() {
      // Set up automatic sliding
      startSlideShow()
  
      // Add event listeners for navigation
      if (prevBtn) {
        prevBtn.addEventListener("click", () => {
          goToSlide(currentSlide - 1)
          resetSlideShow()
        })
      }
  
      if (nextBtn) {
        nextBtn.addEventListener("click", () => {
          goToSlide(currentSlide + 1)
          resetSlideShow()
        })
      }
  
      // Add event listeners for dots
      dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
          goToSlide(index)
          resetSlideShow()
        })
      })
  
      // Add swipe functionality for mobile
      addSwipeSupport()
    }
  
    // Go to specific slide
    function goToSlide(index) {
      // Handle index bounds
      if (index < 0) {
        index = slideCount - 1
      } else if (index >= slideCount) {
        index = 0
      }
  
      // Remove active class from current slide and dot
      slides[currentSlide].classList.remove("active")
      if (dots[currentSlide]) {
        dots[currentSlide].classList.remove("active")
      }
  
      // Update current slide index
      currentSlide = index
  
      // Add active class to new slide and dot
      slides[currentSlide].classList.add("active")
      if (dots[currentSlide]) {
        dots[currentSlide].classList.add("active")
      }
    }
  
    // Start automatic slideshow
    function startSlideShow() {
      slideInterval = setInterval(() => {
        goToSlide(currentSlide + 1)
      }, 5000) // Change slide every 5 seconds
    }
  
    // Reset slideshow timer
    function resetSlideShow() {
      clearInterval(slideInterval)
      startSlideShow()
    }
  
    // Add swipe support for mobile devices
    function addSwipeSupport() {
      let touchStartX = 0
      let touchEndX = 0
  
      slider.addEventListener(
        "touchstart",
        (e) => {
          touchStartX = e.changedTouches[0].screenX
        },
        { passive: true },
      )
  
      slider.addEventListener(
        "touchend",
        (e) => {
          touchEndX = e.changedTouches[0].screenX
          handleSwipe()
        },
        { passive: true },
      )
  
      function handleSwipe() {
        const swipeThreshold = 50 // Minimum distance for a swipe
  
        // Left swipe (next slide)
        if (touchEndX < touchStartX - swipeThreshold) {
          goToSlide(currentSlide + 1)
          resetSlideShow()
        }
  
        // Right swipe (previous slide)
        if (touchEndX > touchStartX + swipeThreshold) {
          goToSlide(currentSlide - 1)
          resetSlideShow()
        }
      }
    }
  
    // Initialize the slider if it exists on the page
    if (slider && slides.length > 0) {
      initSlider()
    }
  
    // Add premium animation effects to slider elements
    const sliderElements = document.querySelectorAll(".slide-title, .slide-description, .slide-actions, .slide-image")
    sliderElements.forEach((element) => {
      if (element) {
        element.classList.add("premium-animation")
      }
    })
  })
  