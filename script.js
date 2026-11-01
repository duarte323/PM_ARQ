// Controlo centralizado do bloqueio de scroll no body
const fullscreenMenu = document.getElementById('fullscreen-menu');
const projectModal = document.getElementById('project-modal');

function syncBodyScrollLock() {
    const isMenuOpen = fullscreenMenu.classList.contains('open');
    const isModalOpen = projectModal.classList.contains('open');
    document.body.style.overflow = (isMenuOpen || isModalOpen) ? 'hidden' : '';
}

// 1. Cursor Personalizado Suave (Apenas em dispositivos com rato)
const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');
const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

if (!isTouchDevice && cursorDot && cursorOutline) {
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 350, fill: 'forwards' });
    });
}

// 2. Menu Fullscreen Overlay
const menuToggle = document.getElementById('menu-toggle');
const menuItems = document.querySelectorAll('.menu-item');

menuToggle.addEventListener('click', () => {
    const isOpen = fullscreenMenu.classList.toggle('open');
    menuToggle.classList.toggle('active', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen);
    fullscreenMenu.setAttribute('aria-hidden', !isOpen);
    syncBodyScrollLock();
});

menuItems.forEach(item => {
    item.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        fullscreenMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        fullscreenMenu.setAttribute('aria-hidden', 'true');
        syncBodyScrollLock();
    });
});

// 3. Animação de Scroll Reveal + Contadores Numéricos
const revealElements = document.querySelectorAll('.reveal');
const statNumbers = document.querySelectorAll('.stat-number');
let countersStarted = false;

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            if (entry.target.classList.contains('stats-grid') && !countersStarted) {
                startCounters();
                countersStarted = true;
            }
        }
    });
}, { threshold: 0.12 });

revealElements.forEach(el => revealObserver.observe(el));

function startCounters() {
    statNumbers.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 1600;
        const stepTime = 20;
        const steps = duration / stepTime;
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.innerText = target;
                clearInterval(timer);
            } else {
                counter.innerText = Math.floor(current);
            }
        }, stepTime);
    });
}

// 4. Acordeão FAQ
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        faqItems.forEach(other => {
            other.classList.remove('active');
            other.querySelector('.faq-answer').style.maxHeight = null;
        });

        if (!isOpen) {
            item.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + 'px';
        }
    });
});

// 5. Submissão simulada do formulário
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Mensagem enviada com sucesso! Entraremos em contacto brevemente.');
    contactForm.reset();
});

// 6. Dados e Galeria Modal dos Projetos
const projectsData = {
    'aa-brito': {
        title: 'AA Brito',
        category: 'Residencial',
        location: 'Brito, Guimarães',
        type: 'Moradia Unifamiliar',
        status: 'Projeto & Obra',
        description: [
            'Projeto residencial desenhado para privilegiar a relação contínua entre as áreas sociais interiores e os espaços exteriores de lazer, tirando partido da exposição solar e da topografia do terreno.',
            'A volumetria aposta em linhas depuradas, vãos amplos e materiais intemporais que garantem conforto térmico, privacidade e uma forte integração paisagística.'
        ],
        images: [
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
            'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=85',
            'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85',
            'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85'
        ]
    },
    'alex-porto': {
        title: 'Alex Porto',
        category: 'Habitação',
        location: 'Porto, Portugal',
        type: 'Reabilitação / Habitação',
        status: 'Concluído',
        description: [
            'Intervenção arquitetónica focada na reorganização espacial e na valorização da luz natural num contexto urbano consolidado da cidade do Porto.',
            'O projeto articula zonas de convívio amplas com recantos de lazer pensados ao detalhe, recorrendo a madeira natural, pedra e iluminação indireta para criar uma atmosfera acolhedora e contemporânea.'
        ],
        images: [
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85',
            'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=85',
            'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85',
            'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85'
        ]
    },
    'propiso-canidelo': {
        title: 'Propiso Canidelo',
        category: 'Residencial',
        location: 'Canidelo, Vila Nova de Gaia',
        type: 'Habitação Coletiva',
        status: 'Em Desenvolvimento',
        description: [
            'Proposta arquitetónica localizada em Canidelo que equilibra rigor construtivo, eficiência funcional e uma imagem contemporânea marcante.',
            'Cada fração foi projetada para otimizar as vistas, a ventilação transversal e a fluidez entre salas e varandas generosas.'
        ],
        images: [
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
            'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=85',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
            'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1200&q=85'
        ]
    },
    'canidelo': {
        title: 'Canidelo',
        category: 'Moradia',
        location: 'Canidelo, Vila Nova de Gaia',
        type: 'Moradia Contemporânea',
        status: 'Concluído',
        description: [
            'Moradia unifamiliar em Vila Nova de Gaia onde o betão aparente, os planos envidraçados e o espelho de água da piscina exterior definem a identidade visual do conjunto.',
            'A distribuição interior separa de forma clara o piso social do piso privado, criando percursos fluidos e espaços dedicados ao descanso e lazer familiar.'
        ],
        images: [
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85',
            'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=85',
            'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=85',
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85'
        ]
    }
};

const modalBackdrop = document.getElementById('modal-backdrop');
const modalClose = document.getElementById('modal-close');
const modalImg = document.getElementById('modal-img');
const modalSwipeArea = document.getElementById('modal-swipe-area');
const galleryCounter = document.getElementById('gallery-counter');
const modalThumbnails = document.getElementById('modal-thumbnails');
const modalCategory = document.getElementById('modal-category');
const modalTitle = document.getElementById('modal-title');
const modalLocation = document.getElementById('modal-location');
const modalType = document.getElementById('modal-type');
const modalStatus = document.getElementById('modal-status');
const modalDescription = document.getElementById('modal-description');
const modalCta = document.getElementById('modal-cta');
const prevBtn = document.getElementById('gallery-prev');
const nextBtn = document.getElementById('gallery-next');

let currentImages = [];
let currentImageIndex = 0;

function updateGalleryImage(index) {
    currentImageIndex = (index + currentImages.length) % currentImages.length;
    modalImg.style.opacity = '0';

    setTimeout(() => {
        modalImg.src = currentImages[currentImageIndex];
        modalImg.style.opacity = '1';
    }, 140);

    galleryCounter.textContent = `${currentImageIndex + 1} / ${currentImages.length}`;

    document.querySelectorAll('.thumb-item').forEach((thumb, idx) => {
        thumb.classList.toggle('active', idx === currentImageIndex);
    });
}

function openProjectModal(projectId) {
    const data = projectsData[projectId];
    if (!data) return;

    currentImages = data.images;
    currentImageIndex = 0;

    modalCategory.textContent = data.category;
    modalTitle.textContent = data.title;
    modalLocation.textContent = data.location;
    modalType.textContent = data.type;
    modalStatus.textContent = data.status;

    modalDescription.innerHTML = data.description
        .map(paragraph => `<p>${paragraph}</p>`)
        .join('');

    modalThumbnails.innerHTML = currentImages
        .map((imgUrl, idx) => `
            <div class="thumb-item ${idx === 0 ? 'active' : ''}" data-index="${idx}">
                <img src="${imgUrl}" alt="${data.title} miniatura ${idx + 1}">
            </div>
        `)
        .join('');

    modalThumbnails.querySelectorAll('.thumb-item').forEach(thumb => {
        thumb.addEventListener('click', () => {
            updateGalleryImage(Number(thumb.dataset.index));
        });
    });

    modalImg.src = currentImages[0];
    galleryCounter.textContent = `1 / ${currentImages.length}`;
    projectModal.classList.add('open');
    projectModal.setAttribute('aria-hidden', 'false');
    syncBodyScrollLock();
}

function closeProjectModal() {
    projectModal.classList.remove('open');
    projectModal.setAttribute('aria-hidden', 'true');
    syncBodyScrollLock();
}

document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
        openProjectModal(card.dataset.project);
    });
});

prevBtn.addEventListener('click', () => updateGalleryImage(currentImageIndex - 1));
nextBtn.addEventListener('click', () => updateGalleryImage(currentImageIndex + 1));

// Suporte a Swipe Tátil (Telemóvel) na Galeria do Modal
let touchStartX = 0;
let touchEndX = 0;

modalSwipeArea.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

modalSwipeArea.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const swipeDistance = touchEndX - touchStartX;
    if (Math.abs(swipeDistance) > 45) {
        if (swipeDistance < 0) {
            updateGalleryImage(currentImageIndex + 1);
        } else {
            updateGalleryImage(currentImageIndex - 1);
        }
    }
}, { passive: true });

modalClose.addEventListener('click', closeProjectModal);
modalBackdrop.addEventListener('click', closeProjectModal);
modalCta.addEventListener('click', closeProjectModal);

window.addEventListener('keydown', (e) => {
    if (!projectModal.classList.contains('open')) return;
    if (e.key === 'Escape') closeProjectModal();
    if (e.key === 'ArrowLeft') updateGalleryImage(currentImageIndex - 1);
    if (e.key === 'ArrowRight') updateGalleryImage(currentImageIndex + 1);
});

// 7. Filtro de Projetos por Categoria com Animação
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const selectedFilter = button.getAttribute('data-filter');

        projectCards.forEach(card => {
            card.classList.add('filter-shrinking');
        });

        setTimeout(() => {
            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');
                const matches = selectedFilter === 'all' || categories.includes(selectedFilter);

                if (matches) {
                    card.classList.remove('filter-hidden');
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            card.classList.remove('filter-shrinking');
                        });
                    });
                } else {
                    card.classList.add('filter-hidden');
                }
            });
        }, 280);
    });
});