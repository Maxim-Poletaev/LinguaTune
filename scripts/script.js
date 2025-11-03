
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
const songCardsContainer = resultsSection.querySelector('.song-cards') || resultsSection;

// Функция для получения выбранных уровней
function getSelectedLevels() {
    const selectedLevels = [];
    levelCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            // Получаем уровень из id чекбокса (убираем префикс "level-")
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
            // Получаем имя исполнителя из id чекбокса (убираем префикс "artist-")
            const artist = checkbox.id.replace('artist-', '');
            // Заменяем дефисы на пробелы и делаем первую букву заглавной
            const formattedArtist = artist.split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            selectedArtists.push(formattedArtist);
        }
    });
    return selectedArtists;
}

// Функция для проверки соответствия песни фильтрам
function songMatchesFilters(song, selectedLevels, selectedArtists) {
    // Если не выбраны ни уровни, ни исполнители - показываем все песни
    if (selectedLevels.length === 0 && selectedArtists.length === 0) {
        return true;
    }
    
    // Проверяем уровень
    const levelMatch = selectedLevels.length === 0 || selectedLevels.includes(song.level);
    
    // Проверяем исполнителя (приводим к нижнему регистру для сравнения)
    const artistMatch = selectedArtists.length === 0 || 
        selectedArtists.some(artist => 
            song.artist.toLowerCase().includes(artist.toLowerCase())
        );
    
    return levelMatch && artistMatch;
}


function displaySongs(songsToShow) {
    let songCardsContainer = resultsSection.querySelector('.song-cards');
    if (!songCardsContainer) {
        songCardsContainer = document.createElement('div');
        songCardsContainer.className = 'song-cards';
        const oldCards = resultsSection.querySelectorAll('.song-card');
        oldCards.forEach(card => card.remove());
        resultsSection.appendChild(songCardsContainer);
    } else {
        songCardsContainer.innerHTML = '';
    }
    
    if (songsToShow.length === 0) {
        songCardsContainer.innerHTML = '<p class="no-results">По вашему запросу ничего не найдено</p>';
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
        songCardsContainer.appendChild(songCard);
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

function addExerciseButtonListeners() {
    document.querySelectorAll('.exercises-button').forEach(button => {
        button.addEventListener('click', function() {
            const songTitle = this.parentElement.querySelector('.song-title').textContent;
            const songArtist = this.parentElement.querySelector('.song-artist').textContent;

        });
    });
}


function initializePage() {

    displaySongs(songs);
    

    applyButton.addEventListener('click', applyFilters);
    
 
    levelCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    
    artistCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', initializePage);

// Добавляем CSS для сообщения "нет результатов"
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
`;
document.head.appendChild(style);
