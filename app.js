// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();
tg.MainButton.hide();

// Состояние приложения
let currentSlide = 1;
const totalSlides = 8;
let userData = {};

// Элементы DOM
const progressFill = document.getElementById('progress-fill');
const backBtn = document.getElementById('back-btn');
const nextBtn = document.getElementById('next-btn');
const shareFinalBtn = document.getElementById('share-final-btn');
const shareModal = document.getElementById('share-modal');
const slideDots = document.getElementById('slide-dots');
const currentSlideEl = document.getElementById('current-slide');
const totalSlidesEl = document.getElementById('total-slides');
const preloader = document.getElementById('preloader');

// Функция для генерации случайных чисел в диапазоне
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Функция для генерации случайных чисел с плавающей точкой
function getRandomFloat(min, max, decimals = 1) {
    const rand = Math.random() * (max - min) + min;
    return parseFloat(rand.toFixed(decimals));
}

// Функция для форматирования времени (часы:минуты)
function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return `${hours}:${mins.toString().padStart(2, '0')}`;
}

// Функция для определения статуса пользователя с разными титулами
function getUserStatus(data) {
    const messagesPerDay = data.messagesCount / data.daysSinceJoin;
    const voicePerDay = data.voiceCount / data.daysSinceJoin;
    const storiesPerDay = data.storiesViewed / data.daysSinceJoin;
    
    // Определение типа пользователя по активности
    if (data.voiceCount > 300 && data.voiceHours > 5) {
        return "Король голосовых";
    }
    
    if (data.messagesCount > 5000 && messagesPerDay > 10) {
        return "Мастер общения";
    }
    
    if (data.storiesViewed > 500 && storiesPerDay > 2) {
        return "Завсегдатай историй";
    }
    
    if (data.publicChats > 30) {
        return "Душа компании";
    }
    
    if (data.isPremium && data.messagesCount > 3000) {
        return "Премиум-легенда";
    }
    
    if (data.messagesCount > 1500) {
        return "Активный пользователь";
    }
    
    if (data.voiceCount > 30) {
        return "Любитель голосовых";
    }
    
    if (data.storiesViewed > 200) {
        return "Любитель историй";
    }
    
    if (data.daysSinceJoin > 300) {
        return "Ветеран Telegram";
    }
    
    // По умолчанию
    const statuses = ["Новичок", "Начинающий", "Любознательный", "Наблюдатель", "Спокойный пользователь"];
    return statuses[Math.floor(Math.random() * statuses.length)];
}

// Генерация данных пользователя с изменёнными диапазонами
function generateUserData() {
    // Слайд 1: дни в Telegram (ОТ 30 ДО 500 дней - меньше)
    const daysSinceJoin = getRandomInt(30, 500);
    
    // Слайд 2: Premium статус (30% шанс)
    const isPremium = Math.random() > 0.7;
    
    // Слайд 3: публичные чаты (от 1 до 50)
    const publicChats = getRandomInt(1, 50);
    
    // Слайд 4: сообщения (от 70,000 до 200,000)
    const messagesCount = getRandomInt(70000, 200000);
    const avgMessageLength = getRandomInt(15, 80);
    
    // Слайд 5: истории (ОТ 150 ДО 500)
    const storiesViewed = getRandomInt(150, 500);
    const storiesTime = getRandomFloat(2, 15, 1); // от 2 до 15 часов
    
    // Слайд 6: голосовые сообщения (от 7 до 10 часов)
    const voiceMinutes = getRandomInt(420, 600); // 7-10 часов в минутах
    const voiceCount = getRandomInt(50, 300);
    const longestVoice = getRandomInt(5, 15); // от 5 до 15 минут
    const avgVoiceMinutes = voiceMinutes / voiceCount;
    
    // Слайд 7: удаленные сообщения (от 1,000 до 30,000)
    const deletedMessages = getRandomInt(1000, 30000);
    const deletedQuick = Math.floor(deletedMessages * getRandomFloat(0.2, 0.4));
    const deletedMinute = Math.floor(deletedMessages * getRandomFloat(0.3, 0.5));
    const deletedDay = deletedMessages - deletedQuick - deletedMinute;
    
    // Слайд 8: статус пользователя (разные титулы)
    const userStatus = getUserStatus({
        daysSinceJoin: daysSinceJoin,
        isPremium: isPremium,
        publicChats: publicChats,
        messagesCount: messagesCount,
        storiesViewed: storiesViewed,
        voiceCount: voiceCount,
        voiceHours: voiceMinutes / 60
    });
    
    userData = {
        daysSinceJoin: daysSinceJoin,
        isPremium: isPremium,
        premiumPercent: isPremium ? getRandomInt(1, 10) : 0,
        publicChats: publicChats,
        messagesCount: messagesCount,
        avgMessageLength: avgMessageLength,
        storiesViewed: storiesViewed,
        storiesTime: storiesTime.toFixed(1),
        voiceHours: formatTime(voiceMinutes),
        voiceCount: voiceCount,
        longestVoice: longestVoice,
        avgVoice: avgVoiceMinutes.toFixed(1),
        deletedMessages: deletedMessages,
        deletedQuick: deletedQuick,
        deletedMinute: deletedMinute,
        deletedDay: deletedDay,
        deletedPercent: Math.floor((deletedMessages / messagesCount) * 100) || 0,
        userStatus: userStatus
    };
    
    // Обновляем UI с данными
    updateDataUI();
}

// Обновление UI с данными
function updateDataUI() {
    // Слайд 1
    document.getElementById('days-joined').textContent = userData.daysSinceJoin.toLocaleString();
    
    // Слайд 2
    document.getElementById('premium-status').textContent = userData.isPremium ? 'Premium пользователь' : 'Обычный пользователь';
    
    // Слайд 3
    document.getElementById('public-chats').textContent = userData.publicChats.toLocaleString();
    document.getElementById('chats-count').textContent = userData.publicChats;
    
    // Слайд 4
    document.getElementById('messages-count').textContent = userData.messagesCount.toLocaleString();
    document.getElementById('avg-message-length').textContent = userData.avgMessageLength + ' символов';
    
    // Слайд 5
    document.getElementById('stories-viewed').textContent = userData.storiesViewed.toLocaleString();
    document.getElementById('stories-time').textContent = userData.storiesTime;
    
    // Слайд 6
    document.getElementById('voice-time').textContent = userData.voiceHours;
    document.getElementById('voice-count').textContent = userData.voiceCount.toLocaleString();
    document.getElementById('longest-voice').textContent = userData.longestVoice + ' мин';
    document.getElementById('avg-voice').textContent = userData.avgVoice + ' мин';
    
    // Слайд 7
    document.getElementById('deleted-messages').textContent = userData.deletedMessages.toLocaleString();
    document.getElementById('deleted-quick').textContent = userData.deletedQuick.toLocaleString();
    document.getElementById('deleted-minute').textContent = userData.deletedMinute.toLocaleString();
    document.getElementById('deleted-day').textContent = userData.deletedDay.toLocaleString();
    
    // Слайд 8
    document.getElementById('final-days').textContent = userData.daysSinceJoin.toLocaleString();
    document.getElementById('final-messages').textContent = userData.messagesCount.toLocaleString();
    document.getElementById('final-voice').textContent = userData.voiceHours;
    document.getElementById('final-stories').textContent = userData.storiesViewed.toLocaleString();
    document.getElementById('user-status').textContent = userData.userStatus;
    
    // Для шеринга
    document.getElementById('share-days').textContent = userData.daysSinceJoin.toLocaleString();
    document.getElementById('share-messages').textContent = userData.messagesCount.toLocaleString();
    document.getElementById('share-stories').textContent = userData.storiesViewed.toLocaleString();
    document.getElementById('share-status').textContent = userData.userStatus;
}

// Создание снегопада
function createSnowfall() {
    const snowContainer = document.createElement('div');
    snowContainer.className = 'snowfall-container';
    document.body.appendChild(snowContainer);
    
    // Создаем снежинки
    for (let i = 0; i < 150; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        
        // Случайные параметры для снежинок
        const size = Math.random() * 5 + 2;
        const startLeft = Math.random() * 100;
        const animationDuration = Math.random() * 10 + 5;
        const animationDelay = Math.random() * 5;
        const opacity = Math.random() * 0.6 + 0.3;
        
        snowflake.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${startLeft}vw;
            animation-duration: ${animationDuration}s;
            animation-delay: ${animationDelay}s;
            opacity: ${opacity};
            background: ${Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.8)' : 'rgba(200, 230, 255, 0.6)'};
        `;
        
        snowContainer.appendChild(snowflake);
    }
}

// Создание индикаторов слайдов
function createSlideIndicators() {
    slideDots.innerHTML = '';
    for (let i = 1; i <= totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = `tg-slide-dot ${i === 1 ? 'active' : ''}`;
        dot.dataset.slide = i;
        slideDots.appendChild(dot);
    }
    totalSlidesEl.textContent = totalSlides;
}

// Переход к слайду
function goToSlide(slideNumber) {
    // Валидация
    if (slideNumber < 1 || slideNumber > totalSlides) return;
    
    // Анимация перехода
    const currentSlideElement = document.getElementById(`slide${currentSlide}`);
    const nextSlideElement = document.getElementById(`slide${slideNumber}`);
    
    currentSlideElement.classList.remove('active');
    nextSlideElement.classList.add('active');
    
    // Обновление текущего слайда
    currentSlide = slideNumber;
    
    // Обновление UI
    updateNavigation();
    updateProgress();
    updateSlideIndicators();
    
    // Вибрация (если поддерживается)
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
}

// Обновление навигации
function updateNavigation() {
    // Обновляем кнопки
    backBtn.classList.toggle('hidden', currentSlide === 1);
    
    if (currentSlide === totalSlides) {
        nextBtn.classList.add('hidden');
        shareFinalBtn.classList.remove('hidden');
    } else {
        nextBtn.classList.remove('hidden');
        shareFinalBtn.classList.add('hidden');
    }
    
    // Обновляем счётчик
    currentSlideEl.textContent = currentSlide;
}

// Обновление прогресс-бара
function updateProgress() {
    const progress = ((currentSlide - 1) / (totalSlides - 1)) * 100;
    progressFill.style.width = `${progress}%`;
}

// Обновление индикаторов
function updateSlideIndicators() {
    const dots = document.querySelectorAll('.tg-slide-dot');
    dots.forEach((dot, index) => {
        if (index + 1 === currentSlide) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Копирование текста в буфер обмена
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        // Fallback для старых браузеров
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        return success;
    }
}

// Генерация текста для шеринга
function generateShareText() {
    return `🎄 Мои итоги 2025 в Telegram! 🎄

📅 В Telegram уже: ${userData.daysSinceJoin.toLocaleString()} дней
💬 Отправлено сообщений: ${userData.messagesCount.toLocaleString()}
📸 Просмотрено историй: ${userData.storiesViewed.toLocaleString()}
🎙️ Голосовых сообщений: ${userData.voiceHours} часов
🗑️ Удалено сообщений: ${userData.deletedMessages.toLocaleString()}

🏆 Мой статус: ${userData.userStatus}

🎁 Выложи в историю итоги и получи ёлочку в подарок!

#TelegramИтоги2025 #МоиИтоги #НовогоднийПодарок`;
}

// Создание картинки для шеринга
async function createShareImage() {
    const shareCard = document.querySelector('.tg-share-card');
    
    try {
        const canvas = await html2canvas(shareCard, {
            backgroundColor: null,
            scale: 2,
            useCORS: true
        });
        
        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/png');
        });
    } catch (error) {
        console.error('Ошибка создания картинки:', error);
        return null;
    }
}

// Функция для копирования картинки
async function copyImageToClipboard() {
    const blob = await createShareImage();
    
    if (blob) {
        try {
            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ]);
            return { success: true, downloaded: false };
        } catch (err) {
            // Fallback: скачивание картинки
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'telegram-2025-results.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            return { success: true, downloaded: true };
        }
    }
    return { success: false };
}

// Показать модальное окно шеринга
function showShareModal() {
    shareModal.classList.remove('hidden');
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('medium');
    }
}

// Скрыть модальное окно
function hideShareModal() {
    shareModal.classList.add('hidden');
}

// Инициализация приложения
function initApp() {
    // Создаем снегопад
    createSnowfall();
    
    // Скрываем прелоадер через 1 секунду
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 1000);
    
    // Генерируем случайные данные
    generateUserData();
    
    // Создаём индикаторы
    createSlideIndicators();
    
    // Настраиваем навигацию
    updateNavigation();
    updateProgress();
    
    // Обработчики событий
    backBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
    shareFinalBtn.addEventListener('click', showShareModal);
    
    // Кнопки в модальном окне шеринга
    document.getElementById('copy-text-btn').addEventListener('click', async () => {
        const text = generateShareText();
        const success = await copyToClipboard(text);
        
        if (success) {
            const btn = document.getElementById('copy-text-btn');
            btn.innerHTML = '<i class="fas fa-check"></i> Скопировано!';
            if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
            
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-copy"></i> Скопировать текст';
            }, 2000);
        }
    });
    
    document.getElementById('copy-image-btn').addEventListener('click', async () => {
        const btn = document.getElementById('copy-image-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Создаём картинку...';
        
        const imageResult = await copyImageToClipboard();
        
        if (imageResult.success) {
            btn.innerHTML = '<i class="fas fa-check"></i> Картинка скопирована!';
            if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
            
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-image"></i> Скопировать картинку';
            }, 2000);
        } else {
            btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Ошибка';
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-image"></i> Скопировать картинку';
            }, 2000);
        }
    });
    
    document.getElementById('share-telegram-btn').addEventListener('click', () => {
        const text = generateShareText();
        const url = `https://t.me/share/url?url=${encodeURIComponent('https://t.me/ResultsYears_robot')}&text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
        hideShareModal();
    });
    
    // Кнопка "Выложить в историю и получить ёлочку"
    document.getElementById('share-story-btn').addEventListener('click', () => {
        hideShareModal(); // Скрываем модальное окно шеринга
        document.getElementById('task-modal').classList.remove('hidden'); // Показываем окно с заданием
    });
    
    // Кнопки в модальном окне с заданием
    document.getElementById('copy-for-story-btn').addEventListener('click', async () => {
        const btn = document.getElementById('copy-for-story-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Копируем...';
        btn.disabled = true;

        try {
            // Копируем текст
            const text = generateShareText();
            await copyToClipboard(text);
            
            // Копируем картинку
            const imageResult = await copyImageToClipboard();
            
            if (tg.HapticFeedback) {
                tg.HapticFeedback.notificationOccurred('success');
            }
            
            if (tg.showAlert) {
                let message = '✅ Готово! Текст и картинка скопированы!\n\nТеперь открой Telegram, создай историю и вставь картинку. Добавь скопированный текст и нажми "Выложить".';
                if (imageResult.downloaded) {
                    message = '✅ Готово! Текст скопирован в буфер обмена, а картинка скачана в галерею!\n\nТеперь открой Telegram, создай историю, выбери скачанную картинку и добавь скопированный текст. Затем нажми "Выложить".';
                }
                tg.showAlert(message);
            }
            
            // Обновляем текст кнопки на 3 секунды
            btn.innerHTML = '<i class="fas fa-check"></i> Скопировано!';
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }, 3000);
            
        } catch (error) {
            console.error('Ошибка при копировании:', error);
            if (tg.showAlert) {
                tg.showAlert('Ошибка при копировании. Попробуйте еще раз.');
            }
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    });
    
    document.getElementById('open-telegram-btn').addEventListener('click', () => {
        // Открываем Telegram
        window.open('tg://', '_blank');
        
        if (tg.showAlert) {
            tg.showAlert('Telegram открывается! Создайте новую историю, выберите картинку и добавьте текст. После публикации вернитесь сюда и нажмите "Я выложил(а) историю"');
        }
    });
    
    document.getElementById('task-done-btn').addEventListener('click', () => {
        document.getElementById('task-modal').classList.add('hidden');
        document.getElementById('moderation-modal').classList.remove('hidden');
        
        if (tg.showAlert) {
            tg.showAlert('🎄 Супер! Мы проверяем вашу историю. После модерации вы получите ёлочку в подарок!');
        }
        
        if (tg.HapticFeedback) {
            tg.HapticFeedback.notificationOccurred('success');
        }
    });
    
    // Кнопка закрытия окна с заданием
    document.getElementById('task-close-btn').addEventListener('click', () => {
        document.getElementById('task-modal').classList.add('hidden');
    });
    
    // Закрытие окна с заданием по клику на фон
    document.getElementById('task-modal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('task-modal')) {
            document.getElementById('task-modal').classList.add('hidden');
        }
    });
    
    // Кнопка подписки на канал в окне модерации
    document.getElementById('subscribe-channel-btn').addEventListener('click', () => {
        // Открываем канал в Telegram (замените на ваш канал)
        const channelUrl = 'https://t.me/telegram';
        window.open(channelUrl, '_blank');
        
        if (tg.showAlert) {
            tg.showAlert('Спасибо за подписку! 🎄\n\nВаша модерация будет ускорена. Проверьте статус через несколько часов.');
        }
        
        // Закрываем модальное окно через 3 секунды
        setTimeout(() => {
            document.getElementById('moderation-modal').classList.add('hidden');
        }, 3000);
    });
    
    // Кнопка проверки статуса модерации
    document.getElementById('check-moderation-btn').addEventListener('click', () => {
        // Рандомный статус модерации
        const statuses = [
            '⏳ Модерация еще в процессе...',
            '🔍 Ваша история проверяется...',
            '📝 Почти готово! Осталось немного...',
            '🎄 Подарок уже в пути!'
        ];
        
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        if (tg.showAlert) {
            tg.showAlert(`${randomStatus}\n\nПроверьте через час или подпишитесь на канал для ускорения.`);
        }
    });
    
    // Кнопка закрытия окна модерации
    document.getElementById('moderation-close-btn').addEventListener('click', () => {
        document.getElementById('moderation-modal').classList.add('hidden');
    });
    
    // Закрытие модального окна модерации по клику на фон
    document.getElementById('moderation-modal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('moderation-modal')) {
            document.getElementById('moderation-modal').classList.add('hidden');
        }
    });
    
    // Закрытие модального окна шеринга
    document.querySelector('.tg-modal-close').addEventListener('click', hideShareModal);
    shareModal.addEventListener('click', (e) => {
        if (e.target === shareModal) {
            hideShareModal();
        }
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (!shareModal.classList.contains('hidden')) {
                hideShareModal();
            }
            if (!document.getElementById('task-modal').classList.contains('hidden')) {
                document.getElementById('task-modal').classList.add('hidden');
            }
            if (!document.getElementById('moderation-modal').classList.contains('hidden')) {
                document.getElementById('moderation-modal').classList.add('hidden');
            }
        }
    });
    
    // Swipe жесты для мобильных
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe влево = следующий слайд
                if (currentSlide < totalSlides) {
                    goToSlide(currentSlide + 1);
                }
            } else {
                // Swipe вправо = предыдущий слайд
                if (currentSlide > 1) {
                    goToSlide(currentSlide - 1);
                }
            }
        }
    }
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', initApp);
