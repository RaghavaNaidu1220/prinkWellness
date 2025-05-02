document.addEventListener("DOMContentLoaded", () => {
    // Remove About page from navigation
    const navLinks = document.querySelectorAll("nav a")
    navLinks.forEach((link) => {
      if (link.textContent.includes("About") || link.textContent.includes("about")) {
        link.parentElement.remove()
      }
    })
  
    // Remove empty space between nav and content
    const mainContent =
      document.querySelector("main") || document.querySelector(".container") || document.querySelector(".content")
    if (mainContent) {
      mainContent.style.marginTop = "0"
    }
  
    // Update ingredients section with images
    const ingredientsList = document.querySelectorAll(".ingredients-list li, .ingredient-item")
    if (ingredientsList.length > 0) {
      ingredientsList.forEach((item, index) => {
        const text = item.innerHTML
        const imgSrc =
          index === 0
            ? "/images/natural-ingredients.png"
            : index === 1
              ? "/images/clinically-tested.png"
              : "/images/fast-relief.png"
  
        item.innerHTML = `<img src="${imgSrc}" alt="Ingredient icon" class="ingredient-icon" /> ${text}`
      })
    }
  
    // Add emojis to How To Use section
    const howToUseSteps = document.querySelectorAll(".how-to-use-steps li, .how-to-use-item")
    if (howToUseSteps.length > 0) {
      howToUseSteps.forEach((step, index) => {
        const text = step.innerHTML
        const imgSrc = `/images/step${index + 1}.png`
  
        step.innerHTML = `<img src="${imgSrc}" alt="Step ${index + 1}" class="step-icon" /> ${text}`
      })
    }
  
    // Make Why PrinkWellness section more attractive
    const whySection = document.querySelector(".why-prinkwellness, .why-section")
    if (whySection) {
      // Get all the children
      const children = Array.from(whySection.children)
      const title = children.find((el) => el.tagName === "H2" || el.tagName === "H3")
      const paragraphs = children.filter((el) => el.tagName === "P")
  
      // Clear the section
      whySection.innerHTML = ""
  
      // Add the title back
      if (title) {
        whySection.appendChild(title)
      }
  
      // Create a new grid layout for the content
      const gridContainer = document.createElement("div")
      gridContainer.className = "why-grid"
  
      // Add the paragraphs to the grid
      paragraphs.forEach((p, index) => {
        const card = document.createElement("div")
        card.className = "why-card"
  
        const number = document.createElement("div")
        number.className = "why-number"
        number.textContent = (index + 1).toString()
  
        card.appendChild(number)
        card.appendChild(p.cloneNode(true))
  
        gridContainer.appendChild(card)
      })
  
      whySection.appendChild(gridContainer)
    }
  })
  