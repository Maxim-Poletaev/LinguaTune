// Данные песен
const songs = [
    { 
        title: "Money, Money, Money", 
        artist: "ABBA", 
        level: "beginner",
        page: "songs/money-money-money.html"
    },
    { 
        title: "Don't Speak", 
        artist: "No Doubt", 
        level: "beginner",
        page: "songs/dont-speak.html"
    },
    { 
        title: "My heart will go on", 
        artist: "Celine Dion", 
        level: "elementary",
        page: "songs/my-heart-will-go-on.html"
    },
    { 
        title: "Perfect", 
        artist: "Ed Sheeran", 
        level: "elementary",
        page: "songs/perfect.html"
    },
    { 
        title: "Diamonds", 
        artist: "Rihanna", 
        level: "intermediate",
        page: "songs/diamonds.html"
    },
    { 
        title: "Roar", 
        artist: "Katy Perry", 
        level: "intermediate",
        page: "songs/roar.html"
    },
    { 
        title: "Demons", 
        artist: "Imagine Dragons", 
        level: "upperintermediate",
        page: "songs/demons.html"
    },
    { 
        title: "Rewrite The Stars", 
        artist: "Zac Efron, Zendaya", 
        level: "upperintermediate",
        page: "songs/rewrite-the-stars.html"
    }
];

// Элементы DOM
const levelCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="level-"]');
const artistCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="artist-"]');
const applyButton = document.querySelector('.apply-button');
const resultsSection = document.querySelector('.results-section');

// Создаем карту соответствия ID чекбоксов и реальных имен исполнителей
const artistIdToNameMap = {
    'abba': 'ABBA',
    'doubt': 'No Doubt',
    'celine': 'Celine Dion',
    'ed': 'Ed Sheeran',
    'rihanna': 'Rihanna',
    'katy': 'Katy Perry',
    'im': 'Imagine Dragons',
    'zac': 'Zac Efron, Zendaya'
};

// Карта соответствия ID уровней и их названий
const levelIdToNameMap = {
    'beginner': 'Beginner',
    'elementary': 'Elementary',
    'intermediate': 'Intermediate',
    'upperintermediate': 'Upper Intermediate'
};

// Функция для получения выбранных уровней
function getSelectedLevels() {
    const selectedLevels = [];
    levelCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            const level = checkbox.id.replace('level-', '');
            selectedLevels.push(level);
        }
    });
    return selectedLevels;
}

// Функция для получения выбранных исполнителей
function getSelectedArtists() {
    const selectedArtists = [];
    artistCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            const artistId = checkbox.id.replace('artist-', '');
            const artistName = artistIdToNameMap[artistId];
            if (artistName) {
                selectedArtists.push(artistName);
            }
        }
    });
    return selectedArtists;
}

// Функция для получения всех исполнителей по выбранным уровням
function getArtistsByLevels(selectedLevels) {
    const artists = new Set();
    
    if (selectedLevels.length === 0) {
        // Если уровни не выбраны, показываем всех исполнителей
        songs.forEach(song => {
            artists.add(song.artist);
        });
    } else {
        // Если уровни выбраны, показываем только исполнителей с песнями этих уровней
        songs.forEach(song => {
            if (selectedLevels.includes(song.level)) {
                artists.add(song.artist);
            }
        });
    }
    
    return Array.from(artists);
}

// Функция для получения всех уровней по выбранным исполнителям
function getLevelsByArtists(selectedArtists) {
    const levels = new Set();
    
    if (selectedArtists.length === 0) {
        // Если исполнители не выбраны, показываем все уровни
        songs.forEach(song => {
            levels.add(song.level);
        });
    } else {
        // Если исполнители выбраны, показываем только уровни с песнями этих исполнителей
        songs.forEach(song => {
            if (selectedArtists.includes(song.artist)) {
                levels.add(song.level);
            }
        });
    }
    
    return Array.from(levels);
}

// Функция для обновления видимости чекбоксов исполнителей
function updateArtistVisibility(selectedLevels) {
    const availableArtists = getArtistsByLevels(selectedLevels);
    
    artistCheckboxes.forEach(checkbox => {
        const artistId = checkbox.id.replace('artist-', '');
        const artistName = artistIdToNameMap[artistId];
        
        if (!artistName) return;
        
        // Проверяем, есть ли исполнитель в списке доступных
        const isAvailable = availableArtists.includes(artistName);
        
        // Находим родительский элемент для управления видимостью
        const filterOption = checkbox.closest('.filter-option');
        
        if (filterOption) {
            if (isAvailable) {
                // Показываем исполнителя
                filterOption.style.display = 'block';
                filterOption.style.opacity = '1';
            } else {
                // Скрываем исполнителя и снимаем выделение если было
                filterOption.style.display = 'none';
                checkbox.checked = false;
            }
        }
    });
}

// Функция для обновления видимости чекбоксов уровней
function updateLevelVisibility(selectedArtists) {
    const availableLevels = getLevelsByArtists(selectedArtists);
    
    levelCheckboxes.forEach(checkbox => {
        const levelId = checkbox.id.replace('level-', '');
        
        // Проверяем, есть ли уровень в списке доступных
        const isAvailable = availableLevels.includes(levelId);
        
        // Находим родительский элемент для управления видимостью
        const filterOption = checkbox.closest('.filter-option');
        
        if (filterOption) {
            if (isAvailable) {
                // Показываем уровень
                filterOption.style.display = 'block';
                filterOption.style.opacity = '1';
            } else {
                // Скрываем уровень и снимаем выделение если было
                filterOption.style.display = 'none';
                checkbox.checked = false;
            }
        }
    });
}

// Функция для проверки соответствия песни фильтрам
function songMatchesFilters(song, selectedLevels, selectedArtists) {
    if (selectedLevels.length === 0 && selectedArtists.length === 0) {
        return true;
    }
    
    const levelMatch = selectedLevels.length === 0 || selectedLevels.includes(song.level);
    const artistMatch = selectedArtists.length === 0 || 
        selectedArtists.some(artist => song.artist === artist);
    
    return levelMatch && artistMatch;
}

function displaySongs(songsToShow) {
    // Удаляем существующие карточки песен
    const existingCards = resultsSection.querySelectorAll('.song-card');
    existingCards.forEach(card => card.remove());
    
    // Удаляем сообщение "нет результатов", если оно есть
    const noResults = resultsSection.querySelector('.no-results');
    if (noResults) {
        noResults.remove();
    }
    
    if (songsToShow.length === 0) {
        resultsSection.innerHTML += '<p class="no-results">По вашему запросу ничего не найдено</p>';
        return;
    }
    
    songsToShow.forEach(song => {
        const songCard = document.createElement('div');
        songCard.className = 'song-card';
        songCard.innerHTML = `
            <h3 class="song-title">${song.title}</h3>
            <p class="song-artist">Исполнитель: ${song.artist}</p>
            <a href="${song.page}" class="exercises-button">Перейти к упражнениям</a>
        `;
        resultsSection.appendChild(songCard);
    });
}

function applyFilters() {
    const selectedLevels = getSelectedLevels();
    const selectedArtists = getSelectedArtists();
    
    const filteredSongs = songs.filter(song => 
        songMatchesFilters(song, selectedLevels, selectedArtists)
    );
    
    displaySongs(filteredSongs);
}

// Функция для обновления всех фильтров
function updateAllFilters() {
    const selectedLevels = getSelectedLevels();
    const selectedArtists = getSelectedArtists();
    
    updateArtistVisibility(selectedLevels);
    updateLevelVisibility(selectedArtists);
}

function initializePage() {
    // Удаляем статические карточки песен из HTML и заменяем их на динамические
    const staticCards = resultsSection.querySelectorAll('.song-card');
    staticCards.forEach(card => card.remove());
    
    // Добавляем обработчики событий для чекбоксов уровней
    levelCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateAllFilters();
        });
    });

    // Добавляем обработчики событий для чекбоксов исполнителей
    artistCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateAllFilters();
        });
    });

    // Инициализируем видимость при загрузке
    updateAllFilters();
    
    // Показываем все песни при загрузке
    displaySongs(songs);
    
    applyButton.addEventListener('click', applyFilters);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', initializePage);

// Добавляем CSS для сообщения "нет результатов" и скрытых элементов
const style = document.createElement('style');
style.textContent = `
    .no-results {
        text-align: center;
        color: #666;
        font-size: 1.2rem;
        padding: 40px;
        background: #f8f9fa;
        border-radius: 10px;
        margin: 20px 0;
    }
    
    .song-cards {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
    
    .filter-option {
        transition: opacity 0.3s ease;
    }
    
    .exercises-button {
        display: inline-block;
        padding: 10px 20px;
        background-color: #007bff;
        color: white;
        text-decoration: none;
        border-radius: 5px;
        border: none;
        cursor: pointer;
        font-size: 1rem;
        margin-top: 10px;
    }
    
    .exercises-button:hover {
        background-color: #0056b3;
    }
`;
document.head.appendChild(style);