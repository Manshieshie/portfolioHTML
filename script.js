// Variables globales
let currentSection = 0
let displayText = ""
let currentWordIndex = 0
let isTyping = true
let isDarkMode = true
const visibleSections = new Set([0])

// Palabras para el typewriter
const palabrasMotivadoras = ["CREATE", "INNOVATE", "DESIGN", "DEVELOP", "INSPIRE", "BUILD"]

// Elementos del DOM
const loadingScreen = document.getElementById("loading-screen")
const typewriterText = document.getElementById("typewriter-text")
const typewriterCursor = document.getElementById("typewriter-cursor")
const themeToggle = document.getElementById("theme-toggle")
const scrollIndicator = document.getElementById("scroll-indicator")
const currentSectionElement = document.getElementById("current-section")
const navItems = document.querySelectorAll(".nav-item")
const sections = document.querySelectorAll(".portfolio-section")

// Importación de Lucide
const lucide = window.lucide // Asumiendo que Lucide está disponible en el ámbito global

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar iconos de Lucide
  lucide.createIcons()

  // Animación de carga
  setTimeout(() => {
    loadingScreen.style.opacity = "0"
    setTimeout(() => {
      loadingScreen.style.display = "none"
      startTypewriter()
      setupScrollObserver()
    }, 500)
  }, 1200)

  // Event listeners
  setupEventListeners()
})

// Configurar event listeners
function setupEventListeners() {
  // Navegación
  navItems.forEach((item, index) => {
    item.addEventListener("click", () => scrollToSection(index))
  })

  // Cambio de tema
  themeToggle.addEventListener("click", toggleTheme)

  // Scroll del contenedor
  const portfolioContainer = document.querySelector(".portfolio-container")
  portfolioContainer.addEventListener("scroll", updateScrollIndicator)
}

// Typewriter effect
function startTypewriter() {
  function typewriterStep() {
    const currentWord = palabrasMotivadoras[currentWordIndex]

    if (isTyping) {
      if (displayText.length < currentWord.length) {
        displayText = currentWord.slice(0, displayText.length + 1)
        typewriterText.textContent = displayText
        setTimeout(typewriterStep, 150)
      } else {
        setTimeout(() => {
          isTyping = false
          typewriterStep()
        }, 2000)
      }
    } else {
      if (displayText.length > 0) {
        displayText = displayText.slice(0, -1)
        typewriterText.textContent = displayText
        setTimeout(typewriterStep, 100)
      } else {
        currentWordIndex = (currentWordIndex + 1) % palabrasMotivadoras.length
        isTyping = true
        typewriterStep()
      }
    }
  }

  typewriterStep()
}

// Configurar Intersection Observer
function setupScrollObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionIndex = Number.parseInt(entry.target.dataset.section)
          updateCurrentSection(sectionIndex)
          activateSection(sectionIndex)
        }
      })
    },
    {
      threshold: 0.4,
      rootMargin: "-10% 0px -10% 0px",
    },
  )

  sections.forEach((section) => {
    observer.observe(section)
  })
}

// Actualizar sección actual
function updateCurrentSection(index) {
  currentSection = index

  // Actualizar navegación
  navItems.forEach((item, i) => {
    item.classList.toggle("active", i === index)
  })

  // Actualizar contador
  currentSectionElement.textContent = String(index + 1).padStart(2, "0")

  // Mostrar/ocultar indicador de scroll
  scrollIndicator.style.display = index === 0 ? "block" : "none"
}

// Activar animaciones de sección
function activateSection(index) {
  visibleSections.add(index)
  const section = sections[index]
  section.classList.add("section-visible")
}

// Navegar a sección específica
function scrollToSection(index) {
  const section = sections[index]
  if (section) {
    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    })

    setTimeout(() => {
      updateCurrentSection(index)
      activateSection(index)
    }, 200)
  }
}

// Cambiar tema
function toggleTheme() {
  isDarkMode = !isDarkMode
  document.body.classList.toggle("light-theme", !isDarkMode)

  // Cambiar icono
  const icon = themeToggle.querySelector("i")
  icon.setAttribute("data-lucide", isDarkMode ? "sun" : "moon")
  lucide.createIcons()
}

// Actualizar indicador de scroll
function updateScrollIndicator() {
  // Esta función se puede usar para efectos adicionales durante el scroll
}

// Utilidades para animaciones suaves
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Optimización para dispositivos móviles
if (window.innerWidth <= 768) {
  // Reducir animaciones en móviles
  document.documentElement.style.setProperty("--animation-duration", "0.3s")
}

// Precargar imágenes
function preloadImages() {
  const images = ["images/profile-photo.jpeg"]

  images.forEach((src) => {
    const img = new Image()
    img.src = src
  })
}

// Llamar a precargar imágenes
preloadImages()
