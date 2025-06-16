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
const themeToggle = document.getElementById("theme-toggle")
const scrollIndicator = document.getElementById("scroll-indicator")
const currentSectionElement = document.getElementById("current-section")
const navItems = document.querySelectorAll(".nav-item")
const sections = document.querySelectorAll(".portfolio-section")

// Importación de Lucide
const lucide = window.lucide

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
      initProjectsCarousel()
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

// Typewriter effect mejorado para evitar glitches
function startTypewriter() {
  function typewriterStep() {
    const currentWord = palabrasMotivadoras[currentWordIndex]

    if (isTyping) {
      if (displayText.length < currentWord.length) {
        displayText = currentWord.slice(0, displayText.length + 1)
        // Usar requestAnimationFrame para renderizado suave
        requestAnimationFrame(() => {
          if (typewriterText) {
            typewriterText.textContent = displayText
          }
        })
        setTimeout(typewriterStep, 120) // Velocidad más consistente
      } else {
        setTimeout(() => {
          isTyping = false
          typewriterStep()
        }, 2000)
      }
    } else {
      if (displayText.length > 0) {
        displayText = displayText.slice(0, -1)
        // Usar requestAnimationFrame para renderizado suave
        requestAnimationFrame(() => {
          if (typewriterText) {
            typewriterText.textContent = displayText
          }
        })
        setTimeout(typewriterStep, 80) // Velocidad más rápida para borrar
      } else {
        currentWordIndex = (currentWordIndex + 1) % palabrasMotivadoras.length
        isTyping = true
        // Pequeña pausa antes de empezar la siguiente palabra
        setTimeout(typewriterStep, 300)
      }
    }
  }

  // Inicializar con la primera palabra vacía
  if (typewriterText) {
    typewriterText.textContent = ""
    typewriterStep()
  }
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

// CAROUSEL VISUALMENTE CIRCULAR CON CLONES
function initProjectsCarousel() {
  const carousel = document.getElementById("projects-carousel")
  const prevBtn = document.getElementById("carousel-prev")
  const nextBtn = document.getElementById("carousel-next")
  const paginationContainer = document.getElementById("carousel-pagination")

  // Obtener proyectos originales
  const originalProjects = Array.from(carousel.querySelectorAll(".carousel-item"))
  const totalProjects = originalProjects.length

  let allItems = []
  let currentIndex = 0
  let isTransitioning = false

  // Crear carousel infinito con clones
  function createInfiniteCarousel() {
    // Limpiar carousel
    carousel.innerHTML = ""
    allItems = []

    // Crear clones del final para el principio
    const endClones = originalProjects.slice(-2).map((item) => {
      const clone = item.cloneNode(true)
      clone.classList.add("clone")
      return clone
    })

    // Crear clones del principio para el final
    const startClones = originalProjects.slice(0, 2).map((item) => {
      const clone = item.cloneNode(true)
      clone.classList.add("clone")
      return clone
    })

    // Construir array completo: clones del final + originales + clones del principio
    allItems = [...endClones, ...originalProjects, ...startClones]

    // Agregar todos los elementos al DOM
    allItems.forEach((item) => carousel.appendChild(item))

    // Empezar en el primer elemento real (después de los clones del final)
    currentIndex = endClones.length
  }

  // Crear pagination dots
  function createPagination() {
    paginationContainer.innerHTML = ""
    for (let i = 0; i < totalProjects; i++) {
      const dot = document.createElement("div")
      dot.classList.add("pagination-dot")
      if (i === 0) dot.classList.add("active")

      dot.addEventListener("click", () => {
        if (isTransitioning) return
        // Convertir índice de dot a índice real del carousel
        currentIndex = i + 2 // +2 porque hay 2 clones al principio
        updateCarousel(true)
      })

      paginationContainer.appendChild(dot)
    }
  }

  // Actualizar pagination
  function updatePagination() {
    const dots = paginationContainer.querySelectorAll(".pagination-dot")
    // Calcular el índice real del proyecto activo
    const realIndex = getRealIndex()
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === realIndex)
    })
  }

  // Obtener índice real (sin contar clones)
  function getRealIndex() {
    const clonesAtStart = 2
    if (currentIndex < clonesAtStart) {
      return totalProjects + currentIndex - clonesAtStart
    } else if (currentIndex >= clonesAtStart + totalProjects) {
      return currentIndex - clonesAtStart - totalProjects
    } else {
      return currentIndex - clonesAtStart
    }
  }

  // Actualizar carousel
  function updateCarousel(smooth = true) {
    if (isTransitioning && smooth) return

    // Limpiar todas las clases
    allItems.forEach((item) => {
      item.classList.remove("active", "adjacent")
    })

    // Establecer elemento activo
    allItems[currentIndex].classList.add("active")

    // Establecer elementos adyacentes (solo en desktop)
    if (window.innerWidth >= 768) {
      const prevIndex = currentIndex - 1
      const nextIndex = currentIndex + 1

      if (allItems[prevIndex]) allItems[prevIndex].classList.add("adjacent")
      if (allItems[nextIndex]) allItems[nextIndex].classList.add("adjacent")
    }

    // Calcular transformación para centrar
    const containerWidth = carousel.parentElement.offsetWidth
    const activeItem = allItems[currentIndex]
    const itemWidth = activeItem.offsetWidth
    const itemLeft = activeItem.offsetLeft

    // Centrar el elemento activo
    const offset = containerWidth / 2 - (itemLeft + itemWidth / 2)

    // Aplicar transición
    if (smooth) {
      carousel.style.transition = "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
      isTransitioning = true
    } else {
      carousel.style.transition = "none"
    }

    carousel.style.transform = `translateX(${offset}px)`

    // Actualizar pagination
    updatePagination()

    // Manejar salto a elementos reales después de la transición
    if (smooth) {
      setTimeout(() => {
        handleInfiniteLoop()
        isTransitioning = false
      }, 600)
    }
  }

  // Manejar el bucle infinito
  function handleInfiniteLoop() {
    const clonesAtStart = 2
    const clonesAtEnd = 2

    // Si estamos en los clones del final, saltar al principio real
    if (currentIndex >= allItems.length - clonesAtEnd) {
      currentIndex = clonesAtStart + (currentIndex - (allItems.length - clonesAtEnd))
      updateCarousel(false)
    }
    // Si estamos en los clones del principio, saltar al final real
    else if (currentIndex < clonesAtStart) {
      currentIndex = allItems.length - clonesAtEnd - (clonesAtStart - currentIndex)
      updateCarousel(false)
    }
  }

  // Navegación
  function goToNext() {
    if (isTransitioning) return
    currentIndex++
    updateCarousel(true)
  }

  function goToPrev() {
    if (isTransitioning) return
    currentIndex--
    updateCarousel(true)
  }

  // Event listeners
  nextBtn.addEventListener("click", goToNext)
  prevBtn.addEventListener("click", goToPrev)

  // Touch/swipe support
  let touchStartX = 0
  let touchEndX = 0

  carousel.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX
  })

  carousel.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX
    const diff = touchStartX - touchEndX

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext() // Swipe left
      } else {
        goToPrev() // Swipe right
      }
    }
  })

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (currentSection === 1) {
      // Solo en la sección de proyectos
      if (e.key === "ArrowLeft") {
        goToPrev()
      } else if (e.key === "ArrowRight") {
        goToNext()
      }
    }
  })

  // Resize handler
  window.addEventListener(
    "resize",
    debounce(() => {
      updateCarousel(false)
    }, 250),
  )

  // Inicializar
  createInfiniteCarousel()
  createPagination()
  // Pequeño delay para asegurar que el DOM esté renderizado
  setTimeout(() => {
    updateCarousel(false)
  }, 100)
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