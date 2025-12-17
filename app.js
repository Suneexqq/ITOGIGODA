// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand(); // Развернуть приложение на весь экран
tg.ready();

// Элементы DOM
const generateBtn = document.getElementById('generate-btn');
const shareBtn = document.getElementById('share-btn');
const resultsSection = document.getElementById('results');
const funFactElement = document.getElementById('fun-fact');

// Данные для генерации
const funFacts = [
    "Вы отправляли сообщения быстрее, чем 95% пользователей!",
    "Ваше самое активное время — 2 часа ночи. Вы — сова!",
    "Вы могли бы написать небольшую книгу из всех ваших сообщений.",
    "За это время можно было посмотреть 50 сезонов сериалов!",
    "Ваша клавиатура точно заслужила отдых."
];

const topChats = ["Семейный чат", "Лучший друг", "Рабочая группа", "Коллектив котов", "Чат класса"];
const popularEmojis = ["😂", "❤️", "🔥", "👀", "😭", "😍", "🤔", "👍", "🎉", "😊"];

// Функции генерации случайных данных
function generateRandomTime() {
    const days = Math.floor(Math.random() * 30) + 1;
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    return `${days} дн. ${hours} час. ${minutes} мин.`;
}

function generateRandomMessages() {
    const messages = Math.floor(Math.random() * 50000) + 1000;
    return messages.toLocaleString('ru-RU');
}

function generateRandomReactions() {
    const reactions = Math.floor(Math.random() * 10000) + 500;
    return reactions.toLocaleString('ru-RU');
}

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Обновление статистики на странице
function updateStats() {
    document.getElementById('time-spent').textContent = generateRandomTime();
    document.getElementById('messages-sent').textContent = generateRandomMessages();
    document.getElementById('reactions-given').textContent = generateRandomReactions();
    document.getElementById('top-emoji').textContent = getRandomItem(popularEmojis);
    document.getElementById('top-chat').textContent = getRandomItem(topChats);
    funFactElement.textContent = getRandomItem(funFacts);
}

// Показать результаты
generateBtn.addEventListener('click', () => {
    updateStats();
    resultsSection.classList.remove('hidden');
    shareBtn.classList.remove('hidden');
    generateBtn.textContent = "Сгенерировать заново";
    tg.HapticFeedback.impactOccurred('medium'); // Вибрация (если поддерживается)
});

// Поделиться результатами (упрощенно)
shareBtn.addEventListener('click', () => {
    const shareText = `Мои итоги года в Telegram:\n⏱ Время: ${document.getElementById('time-spent').textContent}\n✉️ Сообщения: ${document.getElementById('messages-sent').textContent}\n❤️ Реакции: ${document.getElementById('reactions-given').textContent}\n\n${funFactElement.textContent}`;
    
    // Копирование в буфер обмена
    navigator.clipboard.writeText(shareText).then(() => {
        alert("Результаты скопированы! Теперь вы можете вставить их в любой чат.");
        tg.HapticFeedback.notificationOccurred('success');
    });
});

// Можно также использовать Telegram-специфичный метод шеринга, когда он станет доступен
// tg.share(shareText);