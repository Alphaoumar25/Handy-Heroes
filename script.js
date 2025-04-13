// Sélection des éléments DOM
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');
const contactForm = document.getElementById('contactForm');
const mapContainer = document.getElementById('map-container');
const googleMap = document.getElementById('google-map');
const geolocationStatus = document.getElementById('geolocation-status');

// Fonction pour gérer la géolocalisation
function initGeolocation() {
    if (mapContainer && geolocationStatus) {
        if ("geolocation" in navigator) {
            // Créer un message de statut
            const statusMessage = document.createElement('div');
            statusMessage.className = 'geolocation-message';
            statusMessage.textContent = 'Recherche de votre position...';
            geolocationStatus.appendChild(statusMessage);

            // Demander la position
            navigator.geolocation.getCurrentPosition(
                // Succès
                function(position) {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    
                    // Mettre à jour l'iframe avec la nouvelle position
                    if (googleMap) {
                        googleMap.src = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10000!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM4!5e0!3m2!1sfr!2sca!4v1709168433099!5m2!1sfr!2sca`;
                    }

                    // Mettre à jour le message
                    statusMessage.textContent = 'Carte centrée sur votre position';
                    statusMessage.style.color = 'green';
                    
                    // Faire disparaître le message après 3 secondes
                    setTimeout(() => {
                        statusMessage.style.display = 'none';
                    }, 3000);
                },
                // Erreur
                function(error) {
                    let errorMessage = 'Impossible de récupérer votre position. ';
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage += 'Vous avez refusé la géolocalisation.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage += 'Position non disponible.';
                            break;
                        case error.TIMEOUT:
                            errorMessage += 'Délai d\'attente dépassé.';
                            break;
                        default:
                            errorMessage += 'Erreur inconnue.';
                    }
                    statusMessage.textContent = errorMessage;
                    statusMessage.style.color = 'red';
                }
            );
        } else {
            geolocationStatus.textContent = 'La géolocalisation n\'est pas supportée par votre navigateur.';
        }
    }
}

// Gestion du menu burger
burger.addEventListener('click', () => {
    // Toggle Navigation
    nav.classList.toggle('nav-active');

    // Animation des liens
    navLinks.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });

    // Animation du burger
    burger.classList.toggle('toggle');
});

// Fermer le menu mobile lors du clic sur un lien
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('nav-active');
        burger.classList.remove('toggle');
    });
});

// Animation du scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Animation des cartes de services au scroll
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .service-card, .pricing-card').forEach(card => {
    observer.observe(card);
});

// Gestion de l'upload de fichiers
const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('files');
const filePreview = document.getElementById('filePreview');

if (uploadZone && fileInput && filePreview) {
    // Gestion du drag & drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadZone.addEventListener(eventName, unhighlight, false);
    });

    uploadZone.addEventListener('drop', handleDrop, false);
    fileInput.addEventListener('change', handleFiles, false);
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight(e) {
    uploadZone.classList.add('dragover');
}

function unhighlight(e) {
    uploadZone.classList.remove('dragover');
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles({ target: { files: files } });
}

function handleFiles(e) {
    const files = [...e.target.files];
    files.forEach(previewFile);
}

function previewFile(file) {
    // Vérification de la taille du fichier (50MB max)
    if (file.size > 50 * 1024 * 1024) {
        alert('Le fichier est trop volumineux. La taille maximum est de 50MB.');
        return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function() {
        const preview = document.createElement('div');
        preview.className = 'preview-item';
        
        if (file.type.startsWith('image/')) {
            preview.innerHTML = `
                <img src="${reader.result}" alt="Aperçu">
                <button class="remove-file" onclick="removeFile(this)">×</button>
            `;
        } else if (file.type.startsWith('video/')) {
            preview.innerHTML = `
                <video src="${reader.result}" controls></video>
                <button class="remove-file" onclick="removeFile(this)">×</button>
            `;
        }
        
        filePreview.appendChild(preview);
    }
}

function removeFile(element) {
    element.parentElement.remove();
}

// Mise à jour de la gestion du formulaire de contact
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Récupération des données du formulaire
        const formData = new FormData(this);
        
        // Simulation d'envoi de données (à remplacer par votre backend)
        console.log('Données du formulaire:', Object.fromEntries(formData));

        // Afficher un message de confirmation
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <h3>Demande envoyée avec succès !</h3>
            <p>Nos professionnels examineront votre demande et vous enverront leurs devis rapidement.</p>
            <p>Vous recevrez une notification par email dès qu'un devis sera disponible.</p>
        `;
        
        // Remplacer le formulaire par le message de succès
        this.innerHTML = '';
        this.appendChild(successMessage);

        // Redirection vers la page d'accueil après 5 secondes
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 5000);
    });
}

// Animation des prix au survol
document.querySelectorAll('.pricing-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = card.classList.contains('featured') ? 'scale(1.05)' : 'translateY(0)';
    });
});

// Validation du numéro de téléphone
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 10) value = value.slice(0, 10);
        e.target.value = value;
    });
}

// Initialiser la géolocalisation si on est sur la page de contact
if (document.querySelector('.contact-page')) {
    initGeolocation();
} 