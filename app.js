// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand(); // Развернуть на весь экран
tg.ready();

// Элементы DOM
const generateBtn = document.getElementById('generate-btn');
const regenerateBtn = document.getElementById('regenerate-btn');
const shareBtn = document.getElementById('share-btn');
const copyBtn = document.getElementById('copy-btn');
const themeToggle = document.getElementById('theme-toggle');
const promoSection = document.getElementById('promo-section');
const resultsSection = document.getElementById('results-section');
const actionsSection = document.getElementById('actions-section');
const shareModal = document.getElementById('share-modal');
const modalClose = document.querySelector('.tg-modal-close');

// Данные для генерации
const funFacts = [
    "Вы отправляли сообщения быстрее, чем 95% пользователей Telegram!",
    "Ваше самое активное время — 2 часа ночи. Вы — настоящая сова!",
    "За это время можно было посмотреть 50 сезонов вашего любимого сериала.",
    "Ваша клавиатура точно заслужила месячный отпуск после такой активности.",
    "Если бы каждое ваше сообщение было книгой, у вас была бы целая библиотека.",
    "Вы могли бы облететь Землю 3 раза за время, проведенное в Telegram.",
    "Ваша активность могла бы зарядить смартфон на 500 лет!"
];

const topChats = [
    "Семейный чат 👨‍👩‍👧‍👦",
    "Лучший друг 💬",
    "Рабочая группа 💼",
    "Чат одногруппников 🎓",
    "Подружки 🛍️",
    "Игровой клан 🎮",
    "Соседи 🏘️"
];

const emojis = ["😂", "❤️", "🔥", "👍", "😍", "🎉", "🤔", "😭", "👀", "😊"];
const userRanks = ["Легенда Telegram", "Супер-активный", "Социальная бабочка", "Мастер чатов", "Король эмодзи", "Гуру переписки"];

// Тема приложения
let isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Настройка темы Telegram
function setupTelegramTheme() {
    // Используем тему из Telegram, если доступна
    if (tg.themeParams) {
        document.documentElement.style.setProperty('--tg-primary-color', tg.themeParams.button_color || '#3390ec');
        document.documentElement.style.setProperty('--tg-bg-color', tg.themeParams.bg_color || (isDarkMode ? '#0f0f0f' : '#ffffff'));
        document.documentElement.style.setProperty('--tg-text-color', tg.themeParams.text_color || (isDarkMode ? '#ffffff' : '#000000'));
    }
    
    // Обновляем иконку темы
    const themeIcon = themeToggle.querySelector('i');
    themeIcon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
}

// Функции генерации данных
function generateRandomTime() {
    const days = Math.floor(Math.random() * 60) + 5;
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    return `${days} дн. ${hours} ч. ${minutes} мин.`;
}

function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNumber(num) {
    return num.toLocaleString('ru-RU');
}

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Генерация всех данных
function generateStats() {
    // Показываем состояние загрузки
    generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Генерация...';
    generateBtn.classList.add('generating');
    
    // Имитация загрузки
    setTimeout(() => {
        // Обновляем статистику
        document.getElementById('time-spent').textContent = generateRandomTime();
        document.getElementById('messages-sent').textContent = formatNumber(generateRandomNumber(1000, 50000));
        document.getElementById('reactions-given').textContent = formatNumber(generateRandomNumber(500, 15000));
        document.getElementById('media-sent').textContent = formatNumber(generateRandomNumber(100, 5000));
        document.getElementById('top-emoji').textContent = getRandomItem(emojis);
        document.getElementById('top-chat').textContent = getRandomItem(topChats);
        document.getElementById('user-rank').textContent = getRandomItem(userRanks);
        
        // Обновляем забавный факт
        document.querySelector('.tg-fun-fact-text').textContent = getRandomItem(funFacts);
        
        // Обновляем кнопку
        generateBtn.innerHTML = '<i class="fas fa-check"></i> Отчёт готов!';
        generateBtn.classList.remove('generating');
        
        // Показываем результаты
        promoSection.classList.add('hidden');
        resultsSection.classList.remove('hidden');
        actionsSection.classList.remove('hidden');
        
        // Вибрация
        tg.HapticFeedback.impactOccurred('medium');
        
        // Через 2 секунды возвращаем нормальное состояние кнопки
        setTimeout(() => {
            generateBtn.innerHTML = '<i class="fas fa-redo"></i> Сгенерировать снова';
        }, 2000);
        
        // Готовим текст для шеринга
        prepareShareText();
    }, 1500);
}

// Подготовка текста для шеринга
function prepareShareText() {
    const shareText = `📊 Мои итоги года в Telegram:

⏱ Время в Telegram: ${document.getElementById('time-spent').textContent}
✉️ Отправлено сообщений: ${document.getElementById('messages-sent').textContent}
❤️ Реакций: ${document.getElementById('reactions-given').textContent}
📷 Медиафайлов: ${document.getElementById('media-sent').textContent}

${document.getElementById('user-rank').textContent}
Любимый эмодзи: ${document.getElementById('top-emoji').textContent}
Самый активный чат: ${document.getElementById('top-chat').textContent}

${document.querySelector('.tg-fun-fact-text').textContent}

#TelegramИтогиГода`;

    document.getElementById('share-text').textContent = shareText;
    return shareText;
}

// Показать модальное окно шеринга
function showShareModal() {
    shareModal.classList.remove('hidden');
    tg.HapticFeedback.impactOccurred('light');
}

// Скрыть модальное окно
function hideShareModal() {
    shareModal.classList.add('hidden');
}

// Копирование в буфер обмена
async function copyToClipboard() {
    const shareText = prepareShareText();
    
    try {
        await navigator.clipboard.writeText(shareText);
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Скопировано!';
        tg.HapticFeedback.notificationOccurred('success');
        
        setTimeout(() => {
            copyBtn.innerHTML = '<i class="fas fa-copy"></i> Скопировать текст';
            hideShareModal();
        }, 2000);
    } catch (err) {
        // Fallback для старых браузеров
        const textArea = document.createElement('textarea');
        textArea.value = shareText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Скопировано!';
        tg.HapticFeedback.notificationOccurred('success');
        
        setTimeout(() => {
            copyBtn.innerHTML = '<i class="fas fa-copy"></i> Скопировать текст';
            hideShareModal();
        }, 2000);
    }
}

// Переключение темы
function toggleTheme() {
    isDarkMode = !isDarkMode;
    const themeIcon = themeToggle.querySelector('i');
    
    if (isDarkMode) {
        document.documentElement.style.setProperty('--tg-bg-color', 'var(--tg-dark-bg-color)');
        document.documentElement.style.setProperty('--tg-text-color', 'var(--tg-dark-text-color)');
        themeIcon.className = 'fas fa-sun';
    } else {
        document.documentElement.style.setProperty('--tg-bg-color', '#ffffff');
        document.documentElement.style.setProperty('--tg-text-color', '#000000');
        themeIcon.className = 'fas fa-moon';
    }
    
    tg.HapticFeedback.impactOccurred('light');
}

// Навигация назад
function goBack() {
    if (!promoSection.classList.contains('hidden')) {
        // Если на промо-странице, закрываем приложение
        tg.close();
    } else {
        // Если на странице результатов, возвращаемся к промо
        promoSection.classList.remove('hidden');
        resultsSection.classList.add('hidden');
        actionsSection.classList.add('hidden');
        generateBtn.innerHTML = '<i class="fas fa-play-circle"></i> Сгенерировать отчёт';
    }
    tg.HapticFeedback.impactOccurred('light');
}

// Инициализация приложения
function initApp() {
    // Настраиваем тему
    setupTelegramTheme();
    
    // Обработчики событий
    generateBtn.addEventListener('click', generateStats);
    regenerateBtn.addEventListener('click', generateStats);
    shareBtn.addEventListener('click', showShareModal);
    copyBtn.addEventListener('click', copyToClipboard);
    themeToggle.addEventListener('click', toggleTheme);
    modalClose.addEventListener('click', hideShareModal);
    
    // Кнопка "Назад"
    document.querySelector('.tg-btn-back').addEventListener('click', goBack);
    
    // Закрытие модального окна по клику вне его
    shareModal.addEventListener('click', (e) => {
        if (e.target === shareModal) {
            hideShareModal();
        }
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideShareModal();
        }
    });
    
    // Инициализация основной кнопки Telegram
    tg.MainButton.setParams({
        text: 'ПОДЕЛИТЬСЯ РЕЗУЛЬТАТАМИ',
        color: tg.themeParams.button_color || '#3390ec',
        text_color: tg.themeParams.button_text_color || '#ffffff'
    });
    
    tg.MainButton.onClick(() => {
        showShareModal();
    });
}

// Запуск приложения при загрузке
document.addEventListener('DOMContentLoaded', initApp);

// Поддержка системной темы
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    isDarkMode = e.matches;
    setupTelegramTheme();
});