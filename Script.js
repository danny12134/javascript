// Variabile globale
let allImages = [];
let currentFilter = 'all';

// Funcție pentru încărcarea datelor JSON
async function loadImageData() {
    console.log('Încep încărcarea datelor JSON...');
    
    try {
        const response = await fetch('data/images.json');
        console.log('Răspuns de la fetch:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Date JSON încărcate cu succes:', data);
        allImages = data.images;
        
        // Afișează numărul de imagini
        document.getElementById('imageCount').textContent = allImages.length;
        console.log(`Număr imagini: ${allImages.length}`);
        
        // Verifică dacă imaginile există
        checkImagesExist();
        
        // Inițializează galeria
        renderGallery(allImages);
        setupEventListeners();
        
    } catch (error) {
        console.error('Eroare la încărcarea datelor:', error);
        document.getElementById('imageGallery').innerHTML = 
            `<div class="error">
                <p>⚠️ Eroare: ${error.message}</p>
                <p>Verifică dacă fișierul <strong>data/images.json</strong> există.</p>
            </div>`;
    }
}

// Verifică dacă imaginile există fizic
async function checkImagesExist() {
    console.log('Verific existența fișierelor imagini...');
    
    for (const image of allImages) {
        const imagePath = `images/${image.filename}`;
        try {
            const response = await fetch(imagePath, { method: 'HEAD' });
            console.log(`${image.filename}: ${response.ok ? 'EXISTĂ' : 'NU există'}`);
        } catch (err) {
            console.log(`${image.filename}: EROARE - ${err.message}`);
        }
    }
}

// Funcție pentru crearea cardului unei imagini
function createImageCard(imageData) {
    const imagePath = `images/${imageData.filename}`;
    console.log(`Creez card pentru: ${imagePath}`);
    
    const card = document.createElement('div');
    card.className = `image-card ${imageData.category}`;
    card.dataset.category = imageData.category;
    
    card.innerHTML = `
        <div class="category-tag">${imageData.category}</div>
        <img src="${imagePath}" 
             alt="${imageData.title}" 
             loading="lazy"
             id="img-${imageData.id}"
             onload="console.log('Imaginea ${imageData.filename} s-a încărcat')"
             onerror="handleImageError(${imageData.id}, '${imageData.filename}')">
        <div class="image-info">
            <h3>${imageData.title}</h3>
            <p>${imageData.description}</p>
            <div class="image-meta">
                <span>ID: ${imageData.id}</span>
                <span>${imageData.date}</span>
                <span class="file-info">${imageData.filename}</span>
            </div>
        </div>
    `;
    
    return card;
}

// Funcție pentru gestionarea erorilor de încărcare imagini
function handleImageError(imgId, filename) {
    console.error(`Eroare la încărcarea imaginii: ${filename}`);
    const imgElement = document.getElementById(`img-${imgId}`);
    if (imgElement) {
        imgElement.src = `https://via.placeholder.com/300x200/ffcccc/cc0000?text=Error:${filename}`;
        imgElement.alt = `Eroare: ${filename} nu a putut fi încărcată`;
    }
}

// Funcție pentru afișarea galeriei
function renderGallery(images) {
    const galleryContainer = document.getElementById('imageGallery');
    console.log(`Renderizez galeria cu ${images.length} imagini`);
    
    galleryContainer.innerHTML = '';
    
    if (!images || images.length === 0) {
        galleryContainer.innerHTML = `
            <div class="no-images">
                <p>Nicio imagine disponibilă pentru această categorie.</p>
            </div>
        `;
        return;
    }
    
    images.forEach(image => {
        const imageCard = createImageCard(image);
        galleryContainer.appendChild(imageCard);
    });
}

// Restul funcțiilor rămân la fel (filterImages, setupEventListeners)
function filterImages(category) {
    currentFilter = category;
    
    let filteredImages;
    if (category === 'all') {
        filteredImages = allImages;
    } else {
        filteredImages = allImages.filter(image => image.category === category);
    }
    
    document.querySelectorAll('.controls button').forEach(button => {
        button.classList.remove('active');
    });
    document.getElementById(`filter${category.charAt(0).toUpperCase() + category.slice(1)}`).classList.add('active');
    
    document.getElementById('imageCount').textContent = filteredImages.length;
    renderGallery(filteredImages);
}

function setupEventListeners() {
    document.getElementById('filterAll').addEventListener('click', () => filterImages('all'));
    document.getElementById('filterNature').addEventListener('click', () => filterImages('nature'));
    document.getElementById('filterUrban').addEventListener('click', () => filterImages('urban'));
    document.getElementById('filterPortraits').addEventListener('click', () => filterImages('portraits'));
    document.getElementById('filterArt').addEventListener('click', () => filterImages('art'));
    
    document.getElementById('currentYear').textContent = new Date().getFullYear();
}

// Inițializează
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM încărcat. Încep inițializarea...');
    document.getElementById('imageGallery').innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Se încarcă galeria...</p>
        </div>
    `;
    
    loadImageData();
});