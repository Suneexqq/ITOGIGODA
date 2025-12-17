// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();
tg.MainButton.hide();

// Состояние приложения
let currentSlide = 1;
const totalSlides = 8;
let userData = {};
let isPremium = Math.random() > 0.7; // 30% шанс быть Premium
let gifsLoaded = 0;
const totalGifs = 8;

// Элементы DOM
const progressFill = document.getElementById('progress-fill');
const backBtn = document.getElementById('back-btn');
const nextBtn = document.getElementById('next-btn');
const shareFinalBtn = document.getElementById('share-final-btn');
const shareModal = document.getElementById('share-modal');
const slideDots = document.getElementById('slide-dots');
const currentSlideEl = document.getElementById('current-slide');
const totalSlidesEl = document.getElementById('total-slides');
const preloader = document.querySelector('.tg-preloader');

// Массив GIF (можно заменить на ваши локальные GIF)
const gifUrls = [
    'https://tenor.com/ru/view/hi-hello-pepe-plush-pepe-ice-gif-15252032868912441634', // slide1 - звезда
    'https://tenor.com/ru/view/utya-utya-duck-telegram-duck-gif-14505757111885760769', // slide2 - premium
    'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif', // slide3 - чаты
    'https://media.giphy.com/media/26n6WywJyh39n1pBu/giphy.gif', // slide4 - сообщения
    'https://media.giphy.com/media/l0HU7Vt4qgdEwFgmA/giphy.gif', // slide5 - истории
    'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif', // slide6 - голосовые
    'https://media.giphy.com/media/l0MYAsiP1HcZPvzEQ/giphy.gif', // slide7 - удаленные
    'https://media.giphy.com/media/26tkhwX6Vnhl8QcC4/giphy.gif'  // slide8 - итог
];

// Альтернативные локальные пути (если GIF лежат в папке gifs/)
const localGifPaths = [
    'gifs/slide1.gif',
    'gifs/slide2.gif', 
    'gifs/slide3.gif',
    'gifs/slide4.gif',
    'gifs/slide5.gif',
    'gifs/slide6.gif',
    'gifs/slide7.gif',
    'gifs/slide8.gif'
];

// Генерация данных пользователя
function generateUserData() {
    userData = {
        daysSinceJoin: 1948,
        isPremium: isPremium,
        premiumPercent: isPremium ? 5 : 0,
        publicChats: 25,
        messagesCount: 4928,
        avgMessageLength: 32,
        storiesViewed: 2266,
        uniqueUsers: 125,
        storiesDay: 'Пятница',
        storiesTime: '9.5',
        voiceHours: '5:29',
        voiceCount: 148,
        longestVoice: 7,
        avgVoice: '2.2',
        deletedMessages: 2805,
        deletedQuick: 824,
        deletedMinute: 1105,
        deletedDay: 876,
        deletedPercent: 15,
        userStatus: 'Легенда чатов'
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

// Предзагрузка GIF
function preloadGifs() {
    preloader.classList.remove('hidden');
    
    gifUrls.forEach((url, index) => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
            gifsLoaded++;
            updatePreloaderProgress();
            
            // Обновляем src у соответствующих img элементов
            const gifElement = document.getElementById(`gif-slide${index + 1}`);
            if (gifElement) {
                gifElement.src = url;
            }
            
            // Если все GIF загружены, скрываем прелоадер
            if (gifsLoaded === totalGifs) {
                setTimeout(() => {
                    preloader.classList.add('hidden');
                }, 500);
            }
        };
        
        img.onerror = () => {
            // Если GIF не загрузился, пробуем локальный путь
            console.warn(`Не удалось загрузить GIF ${index + 1}, пробуем локальный путь`);
            gifsLoaded++;
            updatePreloaderProgress();
            
            // Пробуем загрузить локальную версию
            try {
                const localImg = new Image();
                localImg.src = localGifPaths[index];
                localImg.onload = () => {
                    const gifElement = document.getElementById(`gif-slide${index + 1}`);
                    if (gifElement) {
                        gifElement.src = localGifPaths[index];
                    }
                };
            } catch (e) {
                console.error(`Не удалось загрузить GIF для слайда ${index + 1}`);
            }
            
            if (gifsLoaded === totalGifs) {
                setTimeout(() => {
                    preloader.classList.add('hidden');
                }, 500);
            }
        };
    });
}

// Обновление прогресса загрузки
function updatePreloaderProgress() {
    const progress = Math.round((gifsLoaded / totalGifs) * 100);
    const preloaderText = document.querySelector('.tg-preloader p');
    if (preloaderText) {
        preloaderText.textContent = `Загружаем анимации... ${progress}%`;
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
    const currentSlideEl = document.getElementById(`slide${currentSlide}`);
    const nextSlideEl = document.getElementById(`slide${slideNumber}`);
    
    currentSlideEl.classList.remove('active');
    nextSlideEl.classList.add('active');
    
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
    
    // Предзагрузка следующего GIF, если нужно
    if (slideNumber < totalSlides) {
        preloadNextGif(slideNumber + 1);
    }
}

// Предзагрузка следующего GIF
function preloadNextGif(nextSlide) {
    if (nextSlide <= totalGifs) {
        const nextGif = new Image();
        nextGif.src = gifUrls[nextSlide - 1];
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
    return `🌟 Мои итоги 2024 в Telegram! 🌟

📅 В Telegram уже: ${userData.daysSinceJoin.toLocaleString()} дней
💬 Отправлено сообщений: ${userData.messagesCount.toLocaleString()}
📸 Просмотрено историй: ${userData.storiesViewed.toLocaleString()}
🎙️ Голосовых сообщений: ${userData.voiceHours} часов
🗑️ Удалено сообщений: ${userData.deletedMessages.toLocaleString()}

🏆 Мой статус: ${userData.userStatus}

#TelegramИтоги2024 #МоиИтоги`;
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
    // Показываем прелоадер
    preloader.classList.remove('hidden');
    
    // Предзагружаем GIF
    preloadGifs();
    
    // Генерируем данные
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
    
    // Кнопки в модальном окне
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
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Создаём картинку...';
        
        const blob = await createShareImage();
        
        if (blob) {
            try {
                await navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob })
                ]);
                
                btn.innerHTML = '<i class="fas fa-check"></i> Картинка скопирована!';
                if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
                
                setTimeout(() => {
                    btn.innerHTML = '<i class="fas fa-image"></i> Скопировать картинку';
                    hideShareModal();
                }, 2000);
            } catch (err) {
                // Fallback: скачивание картинки
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'telegram-2024-results.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                btn.innerHTML = '<i class="fas fa-download"></i> Скачано!';
                setTimeout(() => {
                    btn.innerHTML = '<i class="fas fa-image"></i> Скопировать картинку';
                }, 2000);
            }
        } else {
            btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Ошибка';
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-image"></i> Скопировать картинку';
            }, 2000);
        }
    });
    
    document.getElementById('share-telegram-btn').addEventListener('click', () => {
        const text = generateShareText();
        const url = `https://t.me/share/url?url=${encodeURIComponent('https://t.me')}&text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
        hideShareModal();
    });
    
    // Закрытие модального окна
    document.querySelector('.tg-modal-close').addEventListener('click', hideShareModal);
    shareModal.addEventListener('click', (e) => {
        if (e.target === shareModal) {
            hideShareModal();
        }
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !shareModal.classList.contains('hidden')) {
            hideShareModal();
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