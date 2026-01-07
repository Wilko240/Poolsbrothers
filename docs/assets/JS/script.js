/* ============================================
   ANNÉE DYNAMIQUE DANS LE FOOTER
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});

/* ============================================
   NAVIGATION ACTIVE
   ============================================ */
(function setActiveNavigation() {
  const currentPath = location.pathname.split('/').pop().toLowerCase();
  
  const urlToNavMap = {
    'index.html': 'home',
    '': 'home',
    'produits.html': 'products',
    'contact.html': 'contact',
    'mentions.html': 'legal',
    'privacy.html': 'legal'
  };
  
  const navKey = urlToNavMap[currentPath] ?? 'home';
  
  document.querySelectorAll(`[data-link="${navKey}"]`).forEach(link => {
    link.classList.add('active');
  });
})();


// ============================================
// CONFIGURATION EMAILJS
// ============================================

// Remplacez ces valeurs par les vôtres
const EMAILJS_PUBLIC_KEY = "xxx";  // Ex: qA1bC2dE3fG4hI5jK
const EMAILJS_SERVICE_ID = "xxx";    // Ex: service_abc123
const EMAILJS_TEMPLATE_ID = "xxx";  // Ex: template_xyz789

// Initialiser EmailJS
(function() {
  emailjs.init(EMAILJS_PUBLIC_KEY);
})();

// ============================================
// GESTION DU FORMULAIRE
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      const formStatus = document.getElementById('formStatus');
      const submitBtn = this.querySelector('button[type="submit"]');
      const consentCheckbox = document.getElementById('consent');
      
      // Vérifier le consentement
      if (!consentCheckbox.checked) {
        formStatus.textContent = '⚠️ Vous devez accepter d\'être recontacté.';
        formStatus.style.color = '#f59e0b';
        return;
      }
      
      // Désactiver le bouton
      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi en cours...';
      formStatus.textContent = '';
      
      // Récupérer les données du formulaire
      const templateParams = {
        from_name: document.getElementById('name').value,
        from_email: document.getElementById('email').value,
        topic: document.getElementById('topic').value,
        message: document.getElementById('message').value,
        to_email: 'poolsbrothers@gmail.com' // Changez par votre email
      };
      
      // Envoyer l'email via EmailJS
      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(function(response) {
          console.log('✅ Email envoyé !', response.status, response.text);
          formStatus.textContent = '✅ Votre message a été envoyé avec succès ! Nous vous recontacterons rapidement.';
          formStatus.style.color = '#10b981';
          contactForm.reset();
        })
        .catch(function(error) {
          console.error('❌ Erreur:', error);
          formStatus.textContent = '❌ Une erreur est survenue. Veuillez réessayer ou nous contacter directement.';
          formStatus.style.color = '#ef4444';
        })
        .finally(function() {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Envoyer';
        });
    });
  }
});

/* ============================================
   TOAST NOTIFICATIONS MODERNES
   ============================================ */
function showToast(message, type = 'info', title = '') {
  // Créer le conteneur s'il n'existe pas
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  // Icônes selon le type
  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ'
  };

  // Créer le toast
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <div class="toast-content">
      ${title ? `<div class="toast-title">${title}</div>` : ''}
      <div class="toast-message">${message}</div>
    </div>
  `;

  container.appendChild(toast);

  // Supprimer après 3 secondes
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

/* ============================================
   PANIER D'ACHAT (VERSION LOCALSTORAGE)
   ============================================ */
function loadCart() {
  try {
    const saved = localStorage.getItem('poolsbrothers_cart');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error('Erreur chargement panier:', e);
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem('poolsbrothers_cart', JSON.stringify(cart));
  } catch (e) {
    console.error('Erreur sauvegarde panier:', e);
  }
}

let cartItems = loadCart();

function addToCart(productName) {
  const newItem = {
    name: productName,
    timestamp: Date.now(),
    id: Math.random().toString(36).substr(2, 9)
  };

  cartItems.push(newItem);
  saveCart(cartItems);

  showToast(
    `Panier: ${cartItems.length} article(s)`,
    'success',
    `"${productName}" ajouté`
  );

  console.log('Panier actuel:', cartItems);
}

function getCart() {
  return cartItems;
}

function clearCart() {
  cartItems = [];
  saveCart(cartItems);
  showToast('Panier vidé', 'info');
}

/* ============================================
   EFFET SHADOW SUR LE HEADER AU SCROLL
   ============================================ */
(function initHeaderShadow() {
  const header = document.getElementById('siteHeader');
  
  if (!header) return;
  
  const handleScroll = () => {
    const isScrolled = window.scrollY > 10;
    header.classList.toggle('scrolled', isScrolled);
  };
  
  handleScroll();
  
  window.addEventListener('scroll', handleScroll, { passive: true });
})();

/* ============================================
   WIDGET MÉTÉO 
   ============================================ */
(function() {
  const widget = document.getElementById('weather-widget-mobile');
  if (!widget) return;

  const elTemp = document.getElementById('mobile-temp');
  const elHum  = document.getElementById('mobile-humidity');
  const elWater= document.getElementById('mobile-water');
  const elWind = document.getElementById('mobile-wind');

  async function fetchWeather() {
    const lat = 43.6942; // Seignosse
    const lon = -1.3944;
    
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=Europe/Paris`,
        { cache: 'no-store' }
      );
      if (!res.ok) throw new Error('Erreur réseau');
      const data = await res.json();

      const month = new Date().getMonth();
      const waterTemps = {0:12,1:11,2:12,3:13,4:15,5:17,6:19,7:21,8:21,9:19,10:16,11:13};
      const waterTemp = waterTemps[month] || 15;

      const temp      = Math.round(data.current.temperature_2m);
      const humidity  = Math.round(data.current.relative_humidity_2m);
      const windSpeed = Math.round(data.current.wind_speed_10m);

      // Mise à jour des spans existants
      if (elTemp)  elTemp.textContent  = temp + '°';
      if (elHum)   elHum.textContent   = humidity + '%';
      if (elWater) elWater.textContent = waterTemp + '°';
      if (elWind)  elWind.textContent  = windSpeed + ' km/h';

    } catch (err) {
      console.error('Erreur météo mobile:', err);
      // Option: afficher un petit état d’erreur, sans casser la barre
      widget.setAttribute('data-error', 'true');
    }
  }

  fetchWeather();
  setInterval(fetchWeather, 30 * 60 * 1000);
})();

/* ============================================
   MENU BURGER MOBILE
   ============================================ */
(function initBurgerMenu() {
  const burgerButton = document.querySelector('.menu-toggle');
  const navigation = document.getElementById('primary-nav');
  
  if (!burgerButton || !navigation) return;
  
  const setMenuState = (isOpen) => {
    burgerButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    navigation.classList.toggle('open', isOpen);
  };
  
  burgerButton.addEventListener('click', () => {
    const currentState = burgerButton.getAttribute('aria-expanded');
    const newState = currentState !== 'true';
    setMenuState(newState);
  });
  
  navigation.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      setMenuState(false);
    });
  });
})();

/* ============================================
   DONNÉES PRODUITS (MOCK)
   ============================================ */
const FAKE_PRODUCTS = [
  {
    id: 1,
    name: 'Pompe 1 HP – FlowMax',
    price: 799,
    currency: '€',
    category: 'pompes',
    label: 'Pompe 1 HP'
  },
  {
    id: 2,
    name: 'Filtre à sable 500 mm',
    price: 1099,
    currency: '€',
    category: 'filtres',
    label: 'Filtre 500 mm'
  },
  {
    id: 3,
    name: 'Robot électrique – CleanPro',
    price: 2499,
    currency: '€',
    category: 'robots',
    label: 'Robot CleanPro'
  },
  {
    id: 4,
    name: 'Kit traitement chlore – 10 kg',
    price: 299,
    currency: '€',
    category: 'traitement',
    label: 'Kit chlore 10 kg'
  },
  {
    id: 5,
    name: 'Électrolyseur au sel – SaltPro',
    price: 3299,
    currency: '€',
    category: 'traitement',
    label: 'Electrolyseur'
  },
  {
    id: 6,
    name: 'Pompe à vitesse variable – EcoFlow',
    price: 1899,
    currency: '€',
    category: 'pompes',
    label: 'Pompe VS'
  }
];


// FAQ Accordion
document.addEventListener('DOMContentLoaded', function() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      // Toggle active class on question
      this.classList.toggle('active');
      
      // Toggle active class on answer
      const answer = this.nextElementSibling;
      answer.classList.toggle('active');
      
      // Close other open FAQs (optional - pour n'avoir qu'une seule réponse ouverte à la fois)
      faqQuestions.forEach(otherQuestion => {
        if (otherQuestion !== this && otherQuestion.classList.contains('active')) {
          otherQuestion.classList.remove('active');
          otherQuestion.nextElementSibling.classList.remove('active');
        }
      });
    });
  });
});

/* ============================================
   AFFICHAGE ET FILTRAGE DES PRODUITS
   ============================================ */
(function initProductGrid() {
  const productGrid = document.getElementById('grid');
  
  if (!productGrid) return;
  
  const searchInput = document.getElementById('search');
  const categorySelect = document.getElementById('category');
  const resetButton = document.getElementById('reset');
  
  const renderProducts = () => {
    const searchQuery = (searchInput?.value || '').toLowerCase().trim();
    const selectedCategory = (categorySelect?.value || '').toLowerCase();
    
    const filteredProducts = FAKE_PRODUCTS.filter(product => {
      const matchesSearch = !searchQuery || 
        product.name.toLowerCase().includes(searchQuery);
      
      const matchesCategory = !selectedCategory || 
        product.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
    
    if (filteredProducts.length > 0) {
      productGrid.innerHTML = filteredProducts.map(product => `
        <article class="card product" id="${product.label.toLowerCase().replace(/\s+/g, '-')}">
          <div class="img-box">
            <span class="img-label">${product.label}</span>
          </div>
          <h4>${product.name}</h4>
          <div class="price">${product.price.toLocaleString('fr-FR')} ${product.currency || '€'}</div>
          <p class="mb-2">Produit de qualité professionnelle.</p>
          <div class="actions">
            <button class="btn btn-outline" onclick="addToCart('${product.name.replace(/'/g, "\\'")}')">
              Ajouter
            </button>
            <a href="./contact.html#devis" class="btn btn-primary">
              Demander un devis
            </a>
          </div>
        </article>
      `).join('');
    } else {
      productGrid.innerHTML = `
        <p class="center" style="grid-column: 1/-1; color: var(--muted); padding: 2rem;">
          Aucun produit trouvé. Essayez d'autres critères de recherche.
        </p>
      `;
    }
  };
  
  renderProducts();
  
  searchInput?.addEventListener('input', renderProducts);
  categorySelect?.addEventListener('change', renderProducts);
  
  resetButton?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    if (categorySelect) categorySelect.value = '';
    renderProducts();
  });
})();

/* ============================================
   DONNÉES AVIS CLIENTS (MOCK)
   ============================================ */
const REVIEWS = [
  {
    stars: 5,
    text: "Service nickel, installation rapide et conseils pro. Ma pompe VS change la donne.",
    author: "Ahmed K."
  },
  {
    stars: 5,
    text: "Robot CleanPro top — bassin impeccable en 2h. Livraison rapide à Seignosse.",
    author: "Sophie L."
  },
  {
    stars: 4,
    text: "Contrat d'entretien efficace, eau claire toute l'année. Réponse en 24h.",
    author: "Mohammed A."
  },
  {
    stars: 5,
    text: "Bon rapport qualité/prix sur le filtre 500 mm. Mise en service sans accroc.",
    author: "David P."
  },
  {
    stars: 5,
    text: "Très pro, équipe disponible. Je recommande pour villas/jardins.",
    author: "Fatima R."
  }
];

/* ============================================
   AFFICHAGE DES AVIS CLIENTS
   ============================================ */
(function initReviewsDisplay() {
  const reviewsGrid = document.getElementById('reviews-grid');
  const reviewsCountElement = document.getElementById('reviews-count');
  const reviewsAverageElement = document.getElementById('reviews-avg');
  
  if (!reviewsGrid) return;
  
  const totalStars = REVIEWS.reduce((sum, review) => sum + review.stars, 0);
  const averageRating = (totalStars / REVIEWS.length).toFixed(1);
  
  if (reviewsCountElement) {
    reviewsCountElement.textContent = REVIEWS.length;
  }
  if (reviewsAverageElement) {
    reviewsAverageElement.textContent = `${averageRating}/5`;
  }
  
  const generateStarRow = (rating) => {
    const fullStars = '★'.repeat(rating);
    const emptyStars = '☆'.repeat(5 - rating);
    return fullStars + emptyStars;
  };
  
  reviewsGrid.innerHTML = REVIEWS.map(review => `
    <article class="card review">
      <div class="stars" aria-label="Note ${review.stars} sur 5">
        ${generateStarRow(review.stars)}
      </div>
      <p class="text">${review.text}</p>
      <p class="author">— ${review.author}</p>
    </article>
  `).join('');
})();

/* ============================================
   SYSTÈME D'INTERNATIONALISATION (i18n)
   ============================================ */
/**
 * Gestion de la langue courante
 * Ordre de priorité :
 * 1. Langue sauvegardée dans localStorage
 * 2. Langue de l'attribut lang du HTML
 * 3. Français par défaut
 */
let currentLanguage = localStorage.getItem('lang') || 
                      (document.documentElement.lang || 'fr');

/**
 * Dictionnaire complet de traductions
 * Structure: I18N[langue][section][clé]
 * Langues supportées : fr (français), ar (arabe), en (anglais)
 * 
 * Organisation :
 * - meta : métadonnées SEO (title, description)
 * - nav : navigation et menus
 * - hero : section héro de la page d'accueil
 * - badge : badges et étiquettes
 * - usp : arguments de vente (Unique Selling Points)
 * - catalog : catalogue produits
 * - services : descriptions des services
 * - reviews : avis clients
 * - footer : pied de page
 * - legal : mentions légales
 * - contact : formulaire de contact
 * - products : page produits
 * - cookies : bannière de consentement
 * - cta : boutons d'action (Call To Action)
 */
const I18N = {
  // ========== FRANÇAIS ==========
  fr: {
    meta: {
      title: "Pool's Brothers – Produits & Services pour piscines",
      desc: "Pool's Brothers : spécialiste des produits de piscine à Seignosse. Pompes, filtres, robots, traitement de l'eau, installation et entretien.",
      products_title: "Pool's Brothers – Catalogue Produits",
      products_desc: "Pompes, filtres, robots, traitement et accessoires.",
      contact_title: "Pool's Brothers – Contact & Devis",
      contact_desc: "Contactez Pool's Brothers pour un devis."
    },
    nav: {
      home: "Accueil",
      products: "Produits",
      contact: "Contact",
      services: "Services",
      reviews: "Avis",
      open_menu: "Ouvrir le menu",
      home_aria: "Pool's Brothers Accueil",
      lang_label: "Langue",
      lang_aria: "Changer de langue",
      primary: "Navigation principale"
    },
    hero: {
      title: "Tout pour une piscine propre — produits, équipements et entretien",
      lead: "Pompes, filtres, robots, traitement de l'eau, accessoires… Livraison rapide et conseils d'experts. Basé à Seignosse, nous accompagnons particuliers et pros."
    },
    badge: {
      new: "Seignosse & alentours"
    },
    usp: {
      title: "Pourquoi nous choisir ?",
      sub: "Un service fiable, des produits testés et le support d'une équipe locale.",
      fast_shipping: "Livraison rapide",
      fast_shipping_desc: "Stock local et expédition en 24–48h sur la plupart des références.",
      quality: "Qualité certifiée",
      quality_desc: "Marques reconnues, garanties constructeurs, support technique.",
      experts: "Conseils d'experts",
      experts_desc: "Diagnostic, dimensionnement et entretien adaptés à votre bassin."
    },
    catalog: {
      title: "Best‑sellers",
      sub: "Un aperçu de notre sélection — découvrez l'ensemble du catalogue."
    },
    services: {
      title: "Services",
      sub: "Installation, maintenance, dépannage et mise en route saisonnière.",
      contract: "Contrat d'entretien",
      contract_desc: "Visites planifiées, tests de l'eau, ajustements chimiques, rapport PDF.",
      freq: "Hebdomadaire / bi‑hebdomadaire",
      includes: "Traitements inclus (forfaits)",
      price: "À partir de 299 € / mois",
      install: "Installation & mise en service",
      install_desc: "Pompes, filtres, électrolyseurs, robots, automatismes.",
      quote_24h: "Devis sous 24 h",
      warranty: "Garantie main‑d'œuvre 12 mois",
      area: "Déplacement Seignosse & Landes"
    },
    reviews: {
      title: "Avis clients",
      sub: "La satisfaction de nos clients est notre meilleure carte de visite.",
      based_on: "basé sur",
      reviews: "avis",
      avg_aria: "Note moyenne 4,8 sur 5"
    },
    footer: {
      desc: "Produits, équipements et services d'entretien à Seignosse.",
      rights: "Tous droits réservés.",
      links: "Liens",
      legal: "Légal"
    },
    legal: {
      mentions: "Mentions légales",
      privacy: "Politique de confidentialité"
    },
    contact: {
      heading: "Contact & devis",
      sub: "Dites‑nous votre besoin : type de bassin, volume, équipement actuel, problème constaté…",
      name: "Nom complet",
      name_ph: "Votre nom",
      email: "E‑mail",
      email_ph: "vous@exemple.com",
      topic: "Sujet",
      topic_quote: "Demande de devis",
      topic_question: "Question produit",
      topic_service: "Service & entretien",
      topic_other: "Autre",
      message: "Message",
      message_ph: "Expliquez votre besoin…",
      consent: "J'accepte d'être recontacté par Pool's Brothers.",
      privacy_hint: "Nous ne partagerons jamais votre e‑mail.",
      coords: "Coordonnées",
      showroom: "Showroom :",
      phone: "Tél :",
      hours: "Horaires :",
      follow: "Suivez‑nous :"
    },
    products: {
      heading: "Catalogue produits",
      sub: "Sélection de produits pour l'équipement et l'entretien de votre piscine.",
      search_ph: "Rechercher (pompe, filtre, robot…)",
      reset: "Réinitialiser",
      cat_all: "Toutes catégories",
      cat_pumps: "Pompes",
      cat_filters: "Filtres",
      cat_robots: "Robots",
      cat_treatment: "Traitement"
    },
    cookies: {
      text: "Nous utilisons des cookies techniques pour assurer le bon fonctionnement du site. En poursuivant votre navigation, vous acceptez notre politique.",
      learn_more: "En savoir plus",
      accept: "Accepter",
      banner_aria: "Bannière de consentement"
    },
    cta: {
      view_products: "Voir les produits",
      contact_us: "Nous contacter",
      quote: "Demander un devis",
      add: "Ajouter",
      details: "Détails",
      send: "Envoyer"
    }
  },

  // ========== ARABE ==========
  ar: {
    meta: {
      title: "Pool Brothers – منتجات وخدمات حمامات السباحة",
      desc: "Pool Brothers: متخصصون في منتجات حمامات السباحة في Seignosse. مضخات، فلاتر، روبوتات، معالجة المياه، التركيب والصيانة.",
      products_title: "Pool Brothers – كتالوج المنتجات",
      products_desc: "مضخات، فلاتر، روبوتات، معالجة وإكسسوارات.",
      contact_title: "Pool Brothers – التواصل وطلب عرض سعر",
      contact_desc: "اتصل بـ Pool Brothers للحصول على عرض سعر."
    },
    nav: {
      home: "الرئيسية",
      products: "المنتجات",
      contact: "اتصل بنا",
      services: "الخدمات",
      reviews: "التقييمات",
      open_menu: "فتح القائمة",
      home_aria: "Pool Shop الصفحة الرئيسية",
      lang_label: "اللغة",
      lang_aria: "تغيير اللغة",
      primary: "القائمة الرئيسية"
    },
    hero: {
      title: "كل ما تحتاجه لحمام سباحة <em>مثالي</em> — منتجات ومعدات وصيانة",
      lead: "مضخات، فلاتر، روبوتات، معالجة المياه، إكسسوارات... توصيل سريع ونصائح الخبراء. مقرنا في Seignosse، نخدم الأفراد والمحترفين."
    },
    badge: {
      new: "جديد • الشتاء"
    },
    usp: {
      title: "لماذا تختارنا؟",
      sub: "خدمة موثوقة، منتجات مختبرة ودعم من فريق محلي.",
      fast_shipping: "توصيل سريع",
      fast_shipping_desc: "مخزون محلي وشحن في 24-48 ساعة لمعظم المنتجات.",
      quality: "جودة معتمدة",
      quality_desc: "علامات تجارية معروفة، ضمانات الشركات المصنعة، دعم فني.",
      experts: "نصائح الخبراء",
      experts_desc: "تشخيص، قياس وصيانة مناسبة لحمام السباحة الخاص بك."
    },
    catalog: {
      title: "الأكثر مبيعاً",
      sub: "نظرة على مجموعتنا — اكتشف الكتالوج الكامل."
    },
    services: {
      title: "الخدمات",
      sub: "التركيب، الصيانة، الإصلاح والتشغيل الموسمي.",
      contract: "عقد صيانة",
      contract_desc: "زيارات مجدولة، اختبارات المياه، تعديلات كيميائية، تقرير PDF.",
      freq: "أسبوعي / نصف أسبوعي",
      includes: "المعالجات مشمولة (الباقات)",
      price: "ابتداءً من 299 € / شهر",
      install: "التركيب والتشغيل",
      install_desc: "مضخات، فلاتر، محللات كهربائية، روبوتات، أنظمة آلية.",
      quote_24h: "عرض سعر خلال 24 ساعة",
      warranty: "ضمان العمل 12 شهراً",
      area: "التنقل في Seignosse et Landes"
    },
    reviews: {
      title: "تقييمات العملاء",
      sub: "رضا عملائنا هو أفضل بطاقة عمل لنا.",
      based_on: "بناءً على",
      reviews: "تقييم",
      avg_aria: "التقييم المتوسط 4.8 من 5"
    },
    footer: {
      desc: "منتجات ومعدات وخدمات صيانة في Seignosse.",
      rights: "جميع الحقوق محفوظة.",
      links: "روابط",
      legal: "قانوني"
    },
    legal: {
      mentions: "الإشعارات القانونية",
      privacy: "سياسة الخصوصية"
    },
    contact: {
      heading: "التواصل وطلب عرض سعر",
      sub: "أخبرنا باحتياجك: نوع الحمام، الحجم، المعدات الحالية، المشكلة الملاحظة...",
      name: "الاسم الكامل",
      name_ph: "اسمك",
      email: "البريد الإلكتروني",
      email_ph: "you@example.com",
      topic: "الموضوع",
      topic_quote: "طلب عرض سعر",
      topic_question: "سؤال عن المنتج",
      topic_service: "الخدمة والصيانة",
      topic_other: "أخرى",
      message: "الرسالة",
      message_ph: "اشرح احتياجك...",
      consent: "أوافق على أن يتم الاتصال بي من قبل Pool Shop.",
      privacy_hint: "لن نشارك بريدك الإلكتروني أبداً.",
      coords: "معلومات الاتصال",
      showroom: "صالة العرض:",
      phone: "الهاتف:",
      hours: "ساعات العمل:",
      follow: "تابعنا:"
    },
    products: {
      heading: "كتالوج المنتجات",
      sub: "مجموعة مختارة من المنتجات لتجهيز وصيانة حمام السباحة الخاص بك.",
      search_ph: "البحث (مضخة، فلتر، روبوت...)",
      reset: "إعادة تعيين",
      cat_all: "جميع الفئات",
      cat_pumps: "مضخات",
      cat_filters: "فلاتر",
      cat_robots: "روبوتات",
      cat_treatment: "معالجة"
    },
    cookies: {
      text: "نستخدم ملفات تعريف الارتباط الفنية لضمان الأداء السليم للموقع. من خلال متابعة التصفح، فإنك توافق على سياستنا.",
      learn_more: "معرفة المزيد",
      accept: "قبول",
      banner_aria: "شعار الموافقة"
    },
    cta: {
      view_products: "عرض المنتجات",
      contact_us: "اتصل بنا",
      quote: "طلب عرض سعر",
      add: "إضافة",
      details: "التفاصيل",
      send: "إرسال"
    }
  },

  // ========== ANGLAIS ==========
  en: {
    meta: {
      title: "Pool's Brothers – Pool Products & Services",
      desc: "Pool's Brothers: pool products specialist in Seignosse, France. Pumps, filters, robots, water treatment, installation and maintenance.",
      products_title: "Pool's Brothers – Product Catalog",
      products_desc: "Pumps, filters, robots, treatment and accessories.",
      contact_title: "Pool's Brothers – Contact & Quote",
      contact_desc: "Contact Pool's Brothers for a quote."
    },
    nav: {
      home: "Home",
      products: "Products",
      contact: "Contact",
      services: "Services",
      reviews: "Reviews",
      open_menu: "Open menu",
      home_aria: "Pool Shop Home",
      lang_label: "Language",
      lang_aria: "Change language",
      primary: "Main navigation"
    },
    hero: {
      title: "Everything for a <em>pristine</em> pool — products, equipment and maintenance",
      lead: "Pumps, filters, robots, water treatment, accessories... Fast delivery and expert advice. Based in Seignosse, we serve individuals and professionals."
    },
    badge: {
      new: "Seignosse - neighboors"
    },
    usp: {
      title: "Why choose us?",
      sub: "Reliable service, tested products and support from a local team.",
      fast_shipping: "Fast delivery",
      fast_shipping_desc: "Local stock and 24-48h shipping on most items.",
      quality: "Certified quality",
      quality_desc: "Recognized brands, manufacturer warranties, technical support.",
      experts: "Expert advice",
      experts_desc: "Diagnosis, sizing and maintenance tailored to your pool."
    },
    catalog: {
      title: "Best-sellers",
      sub: "A preview of our selection — discover the full catalog."
    },
    services: {
      title: "Services",
      sub: "Installation, maintenance, repair and seasonal start-up.",
      contract: "Maintenance contract",
      contract_desc: "Scheduled visits, water tests, chemical adjustments, PDF report.",
      freq: "Weekly / bi-weekly",
      includes: "Treatments included (packages)",
      price: "From 299 € / month",
      install: "Installation & commissioning",
      install_desc: "Pumps, filters, salt chlorinators, robots, automation.",
      quote_24h: "Quote within 24 hours",
      warranty: "12-month labor warranty",
      area: "Service in Seignosse & Landes area"
    },
    reviews: {
      title: "Customer reviews",
      sub: "Our customers' satisfaction is our best calling card.",
      based_on: "based on",
      reviews: "reviews",
      avg_aria: "Average rating 4.8 out of 5"
    },
    footer: {
      desc: "Products, equipment and maintenance services in Seignosse.",
      rights: "All rights reserved.",
      links: "Links",
      legal: "Legal"
    },
    legal: {
      mentions: "Legal notices",
      privacy: "Privacy policy"
    },
    contact: {
      heading: "Contact & quote",
      sub: "Tell us your need: pool type, volume, current equipment, observed problem...",
      name: "Full name",
      name_ph: "Your name",
      email: "Email",
      email_ph: "you@example.com",
      topic: "Subject",
      topic_quote: "Quote request",
      topic_question: "Product question",
      topic_service: "Service & maintenance",
      topic_other: "Other",
      message: "Message",
      message_ph: "Explain your need...",
      consent: "I agree to be contacted by Pool Shop.",
      privacy_hint: "We will never share your email.",
      coords: "Contact information",
      showroom: "Showroom:",
      phone: "Phone:",
      hours: "Hours:",
      follow: "Follow us:"
    },
    products: {
      heading: "Product catalog",
      sub: "Selection of products for equipping and maintaining your pool.",
      search_ph: "Search (pump, filter, robot...)",
      reset: "Reset",
      cat_all: "All categories",
      cat_pumps: "Pumps",
      cat_filters: "Filters",
      cat_robots: "Robots",
      cat_treatment: "Treatment"
    },
    cookies: {
      text: "We use technical cookies to ensure the proper functioning of the site. By continuing to browse, you accept our policy.",
      learn_more: "Learn more",
      accept: "Accept",
      banner_aria: "Consent banner"
    },
    cta: {
      view_products: "View products",
      contact_us: "Contact us",
      quote: "Request a quote",
      add: "Add",
      details: "Details",
      send: "Send"
    }
  },

  // ========== Espanol ==========
  es: {
    meta: {
      title: "Pool's Brothers – Productos y servicios para piscinas",
      desc: "Pool's Brothers: especialista en productos para piscinas en Seignosse, Francia. Bombas, filtros, robots, tratamiento del agua, instalación y mantenimiento.",
      products_title: "Pool's Brothers – Catálogo de productos",
      products_desc: "Bombas, filtros, robots, tratamiento y accesorios.",
      contact_title: "Pool's Brothers – Contacto y presupuesto",
      contact_desc: "Contacte con Pool's Brothers para solicitar un presupuesto."
    },
    nav: {
      home: "Inicio",
      products: "Productos",
      contact: "Contacto",
      services: "Servicios",
      reviews: "Opiniones",
      open_menu: "Abrir menú",
      home_aria: "Inicio de Pool Shop",
      lang_label: "Idioma",
      lang_aria: "Cambiar idioma",
      primary: "Navegación principal"
    },
    hero: {
      title: "Todo para una piscina impecable — productos, equipamiento y mantenimiento",
      lead: "Bombas, filtros, robots, tratamiento del agua, accesorios... Entrega rápida y asesoramiento experto. Con sede en Seignosse, atendemos a particulares y profesionales."
    },
    badge: {
      new: "Seignosse - vecinos"
    },
    usp: {
      title: "¿Por qué elegirnos?",
      sub: "Servicio fiable, productos probados y soporte de un equipo local.",
      fast_shipping: "Entrega rápida",
      fast_shipping_desc: "Stock local y envío en 24–48 h en la mayoría de los artículos.",
      quality: "Calidad certificada",
      quality_desc: "Marcas reconocidas, garantías del fabricante y soporte técnico.",
      experts: "Asesoramiento experto",
      experts_desc: "Diagnóstico, dimensionamiento y mantenimiento adaptados a su piscina."
    },
    catalog: {
      title: "Más vendidos",
      sub: "Un adelanto de nuestra selección — descubra el catálogo completo."
    },
    services: {
      title: "Servicios",
      sub: "Instalación, mantenimiento, reparación y puesta en marcha de temporada.",
      contract: "Contrato de mantenimiento",
      contract_desc: "Visitas programadas, análisis del agua, ajustes químicos, informe en PDF.",
      freq: "Semanal / quincenal",
      includes: "Tratamientos incluidos (paquetes)",
      price: "Desde 299 € / mes",
      install: "Instalación y puesta en marcha",
      install_desc: "Bombas, filtros, cloradores salinos, robots, automatización.",
      quote_24h: "Presupuesto en 24 horas",
      warranty: "Garantía de mano de obra de 12 meses",
      area: "Servicio en Seignosse y Landes"
    },
    reviews: {
      title: "Opiniones de clientes",
      sub: "La satisfacción de nuestros clientes es nuestra mejor carta de presentación.",
      based_on: "basado en",
      reviews: "reseñas",
      avg_aria: "Valoración media 4,8 sobre 5"
    },
    footer: {
      desc: "Productos, equipamiento y servicios de mantenimiento en Seignosse.",
      rights: "Todos los derechos reservados.",
      links: "Enlaces",
      legal: "Legal"
    },
    legal: {
      mentions: "Aviso legal",
      privacy: "Política de privacidad"
    },
    contact: {
      heading: "Contacto y presupuesto",
      sub: "Cuéntenos su necesidad: tipo de piscina, volumen, equipamiento actual, problema observado...",
      name: "Nombre completo",
      name_ph: "Su nombre",
      email: "Correo electrónico",
      email_ph: "usted@ejemplo.com",
      topic: "Asunto",
      topic_quote: "Solicitud de presupuesto",
      topic_question: "Consulta sobre producto",
      topic_service: "Servicio y mantenimiento",
      topic_other: "Otro",
      message: "Mensaje",
      message_ph: "Explique su necesidad...",
      consent: "Acepto ser contactado por Pool Shop.",
      privacy_hint: "Nunca compartiremos su correo electrónico.",
      coords: "Datos de contacto",
      showroom: "Showroom:",
      phone: "Teléfono:",
      hours: "Horario:",
      follow: "Síganos:"
    },
    products: {
      heading: "Catálogo de productos",
      sub: "Selección de productos para equipar y mantener su piscina.",
      search_ph: "Buscar (bomba, filtro, robot...)",
      reset: "Restablecer",
      cat_all: "Todas las categorías",
      cat_pumps: "Bombas",
      cat_filters: "Filtros",
      cat_robots: "Robots",
      cat_treatment: "Tratamiento"
    },
    cookies: {
      text: "Usamos cookies técnicas para garantizar el correcto funcionamiento del sitio. Al continuar navegando, acepta nuestra política.",
      learn_more: "Más información",
      accept: "Aceptar",
      banner_aria: "Banner de consentimiento"
    },
    cta: {
      view_products: "Ver productos",
      contact_us: "Contáctenos",
      quote: "Solicitar presupuesto",
      add: "Añadir",
      details: "Detalles",
      send: "Enviar"
    }
  }
};

/* ============================================
   APPLICATION DES TRADUCTIONS
   ============================================ */
/**
 * Applique les traductions à toute la page
 * Utilise des attributs data-i18n pour identifier les éléments à traduire
 * 
 * Fonctionnalités :
 * - Change la langue de tout le site
 * - Gère le texte RTL (right-to-left) pour l'arabe
 * - Traduit les éléments via data-i18n
 * - Traduit les attributs (aria-label, placeholder, title, etc.)
 * - Met à jour les métadonnées SEO (title et description)
 * - Sauvegarde la préférence dans localStorage
 * 
 * @param {string} languageCode - Code de langue (fr, ar, en)
 */
function applyI18n(languageCode) {
  currentLanguage = languageCode;
  localStorage.setItem('lang', languageCode);
  document.documentElement.lang = languageCode;
  document.documentElement.dir = (languageCode === 'ar') ? 'rtl' : 'ltr';

  const translations = I18N[languageCode];
  
  if (!translations) {
    console.warn(`Langue "${languageCode}" non disponible.`);
    return;
  }

  document.querySelectorAll('[data-i18n]').forEach(element => {
    const translationKey = element.getAttribute('data-i18n');
    
    const translatedValue = translationKey.split('.').reduce((obj, key) => {
      return obj && obj[key];
    }, translations);
    
    if (translatedValue) {
      element.innerHTML = translatedValue;
    }
  });

  document.querySelectorAll('[data-i18n-attr]').forEach(element => {
    const attributeConfig = element.getAttribute('data-i18n-attr');
    
    attributeConfig.split('|').forEach(pair => {
      const [attributeName, translationPath] = pair.split(':').map(s => s.trim());
      
      const translatedValue = translationPath.split('.').reduce((obj, key) => {
        return obj && obj[key];
      }, translations);
      
      if (attributeName && translatedValue) {
        element.setAttribute(attributeName, translatedValue);
      }
    });
  });

  const titleElement = document.querySelector('title[data-i18n="meta.title"]');
  if (titleElement && translations.meta?.title) {
    titleElement.textContent = translations.meta.title;
  }
  
  const descriptionElement = document.querySelector('meta[name="description"][data-i18n="meta.desc"]');
  if (descriptionElement && translations.meta?.desc) {
    descriptionElement.setAttribute('content', translations.meta.desc);
  }
  
  console.log(`Langue appliquée: ${languageCode}`);
}

applyI18n(currentLanguage);

/* ============================================
   SÉLECTEUR DE LANGUE
   ============================================ */
(function initLanguageSwitcher() {
  const languageSelect = document.getElementById('lang');
  
  if (!languageSelect) return;
  
  languageSelect.value = currentLanguage;
  
  languageSelect.addEventListener('change', (event) => {
    const selectedLanguage = event.target.value;
    applyI18n(selectedLanguage);
  });
})();

/* ============================================
   BANNIÈRE COOKIES
   ============================================ */
(function initCookieBanner() {
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptButton = document.getElementById('cookie-accept');
  
  if (!cookieBanner || !acceptButton) return;
  
  const hasConsent = localStorage.getItem('cookieConsent');
  
  if (hasConsent !== 'yes') {
    cookieBanner.style.display = 'block';
    
    setTimeout(() => {
      cookieBanner.classList.add('visible');
    }, 100);
  }
  
  acceptButton.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'yes');
    
    cookieBanner.classList.add('hiding');
    
    setTimeout(() => {
      cookieBanner.style.display = 'none';
      cookieBanner.classList.remove('hiding', 'visible');
    }, 300);
    
    console.log('Consentement cookies enregistré');
  });
})();

/* ============================================
   UTILITAIRES
   ============================================ */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function formatPrice(amount, currency = 'AED', locale = 'en-US') {
  return `${currency} ${amount.toLocaleString(locale)}`;
}

/* ============================================
   BOUTONS SOCIAUX FLOTTANTS
   ============================================ */
(function initSocialButtons() {
  // Ne pas créer si déjà présent (page contact)
  if (document.querySelector('.social-fab')) return;

  const socialFab = document.createElement('div');
  socialFab.className = 'social-fab';
  socialFab.innerHTML = `
    <!-- WhatsApp -->
    <a href="https://wa.me/33XXXXXXXXX?text=Bonjour%20Pool%27s%20Brothers,%20je%20souhaite%20obtenir%20des%20informations."
      class="fab fab-whatsapp"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactez-nous sur WhatsApp">
      <svg viewBox="0 0 32 32" fill="currentColor">
        <path d="M16 0c-8.837 0-16 7.163-16 16 0 2.825 0.737 5.607 2.137 8.048l-2.137 7.952 7.933-2.127c2.42 1.37 5.173 2.127 8.067 2.127 8.837 0 16-7.163 16-16s-7.163-16-16-16zM16 29.467c-2.482 0-4.908-0.646-7.07-1.87l-0.507-0.292-5.203 1.393 1.393-5.203-0.292-0.507c-1.224-2.162-1.87-4.588-1.87-7.07 0-7.72 6.28-14 14-14s14 6.28 14 14-6.28 14-14 14zM21.305 18.305c-0.288-0.144-1.701-0.839-1.965-0.936-0.264-0.097-0.456-0.144-0.648 0.144s-0.744 0.936-0.912 1.128c-0.168 0.192-0.336 0.216-0.624 0.072s-1.213-0.447-2.31-1.426c-0.854-0.762-1.43-1.704-1.598-1.992s-0.018-0.443 0.126-0.587c0.129-0.129 0.288-0.336 0.432-0.504s0.192-0.288 0.288-0.48c0.096-0.192 0.048-0.36-0.024-0.504s-0.648-1.562-0.888-2.139c-0.234-0.562-0.472-0.486-0.648-0.495-0.168-0.008-0.36-0.010-0.552-0.010s-0.504 0.072-0.768 0.36c-0.264 0.288-1.008 0.984-1.008 2.4s1.032 2.784 1.176 2.976c0.144 0.192 2.034 3.102 4.929 4.35 0.688 0.296 1.225 0.473 1.644 0.605 0.691 0.220 1.320 0.189 1.817 0.115 0.554-0.083 1.701-0.696 1.941-1.368s0.240-1.248 0.168-1.368c-0.072-0.12-0.264-0.192-0.552-0.336z"/>
      </svg>
    </a>

    <!-- Instagram -->
    <a href="https://www.instagram.com/poolsbrothers"
      class="fab fab-instagram"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Suivez-nous sur Instagram">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    </a>

    <!-- Facebook -->
    <a href="https://www.facebook.com/poolsbrothers"
      class="fab fab-facebook"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Suivez-nous sur Facebook">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    </a>
  `;

  document.body.appendChild(socialFab);
})();

/* ============================================
   ANIMATION COMPTEURS STATISTIQUES
   ============================================ */
(function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000; // 2 secondes
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        element.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    };

    updateCounter();
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach(stat => animateCounter(stat));
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    observer.observe(statsSection);
  }
})();

/* ============================================
   BOUTON SCROLL TO TOP
   ============================================ */
(function initScrollToTop() {
  // Créer le bouton
  const scrollBtn = document.createElement('button');
  scrollBtn.id = 'scroll-to-top';
  scrollBtn.innerHTML = '↑';
  scrollBtn.setAttribute('aria-label', 'Retour en haut');
  scrollBtn.setAttribute('title', 'Retour en haut');
  document.body.appendChild(scrollBtn);

  // Afficher/masquer selon le scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollBtn.classList.add('show');
    } else {
      scrollBtn.classList.remove('show');
    }
  }, { passive: true });

  // Scroll smooth au clic
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
})();

/* ============================================
   MODE SOMBRE - TOGGLE
   ============================================ */
(function initDarkMode() {
  // Détecter la préférence système
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  // Récupérer le thème sauvegardé ou utiliser la préférence système
  const getSavedTheme = () => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return prefersDark.matches ? 'dark' : 'light';
  };

  // Appliquer le thème
  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    // Mettre à jour les icônes
    const lightIcon = document.querySelector('.theme-icon-light');
    const darkIcon = document.querySelector('.theme-icon-dark');

    if (lightIcon && darkIcon) {
      if (theme === 'dark') {
        lightIcon.classList.remove('active');
        darkIcon.classList.add('active');
      } else {
        lightIcon.classList.add('active');
        darkIcon.classList.remove('active');
      }
    }
  };

  // Créer le toggle dans le header
  const createToggle = () => {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    const toggle = document.createElement('div');
    toggle.className = 'theme-toggle';
    toggle.setAttribute('role', 'button');
    toggle.setAttribute('aria-label', 'Basculer le mode sombre');
    toggle.setAttribute('tabindex', '0');
    toggle.innerHTML = `
      <div class="theme-icon theme-icon-light">☀️</div>
      <div class="theme-icon theme-icon-dark">🌙</div>
    `;

    // Insérer après le sélecteur de langue
    const langSwitch = nav.querySelector('.lang-switch');
    if (langSwitch) {
      langSwitch.parentNode.insertBefore(toggle, langSwitch.nextSibling);
    } else {
      nav.appendChild(toggle);
    }

    // Gérer le clic
    toggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });

    // Gérer l'appui sur Entrée pour l'accessibilité
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle.click();
      }
    });
  };

  // Initialiser
  const initialTheme = getSavedTheme();
  applyTheme(initialTheme);
  createToggle();

  // Écouter les changements de préférence système
  prefersDark.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
})();

/* ============================================
   INITIALISATION FINALE
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  console.log("Pool's Brothers - Application initialisée");
  console.log(`Langue courante: ${currentLanguage}`);
  console.log(`Produits disponibles: ${FAKE_PRODUCTS.length}`);
  console.log(`Avis clients: ${REVIEWS.length}`);
});
