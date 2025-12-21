// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();
tg.MainButton.hide();

// Состояние приложения
let currentSlide = 1;
const totalSlides = 8;
let userData = {};
let storyCreated = false;
let giftClaimed = false;

// Элементы DOM
const progressFill = document.getElementById('progress-fill');
const backBtn = document.getElementById('back-btn');
const nextBtn = document.getElementById('next-btn');
const shareFinalBtn = document.getElementById('share-final-btn');
const shareModal = document.getElementById('share-modal');
const storyModal = document.getElementById('story-modal');
const giftModal = document.getElementById('gift-modal');
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
    
    const statuses = ["Новичок", "Начинающий", "Любознательный", "Наблюдатель", "Спокойный пользователь"];
    return statuses[Math.floor(Math.random() * statuses.length)];
}

// Генерация уникального ID истории
function generateStoryId() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
    let id = "STORY-";
    
    for (let i = 0; i < 8; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return id;
}

// Генерация промокода для подарка
function generateGiftCode() {
    const prefix = "TG-XMAS-2025";
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    
    for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return `${prefix}-${code}`;
}

// Генерация данных пользователя
function generateUserData() {
    const daysSinceJoin = getRandomInt(30, 500);
    const isPremium = Math.random() > 0.7;
    const publicChats = getRandomInt(1, 50);
    const messagesCount = getRandomInt(70000, 200000);
    const avgMessageLength = getRandomInt(15, 80);
    const storiesViewed = getRandomInt(150, 500);
    const storiesTime = getRandomFloat(2, 15, 1);
    const voiceMinutes = getRandomInt(420, 600);
    const voiceCount = getRandomInt(50, 300);
    const longestVoice = getRandomInt(5, 15);
    const avgVoiceMinutes = voiceMinutes / voiceCount;
    const deletedMessages = getRandomInt(1000, 30000);
    const deletedQuick = Math.floor(deletedMessages * getRandomFloat(0.2, 0.4));
    const deletedMinute = Math.floor(deletedMessages * getRandomFloat(0.3, 0.5));
    const deletedDay = deletedMessages - deletedQuick - deletedMinute;
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
        userStatus: userStatus,
        storyId: generateStoryId(),
        giftCode: generateGiftCode(),
        storyStatus: "pending", // pending, approved, rejected
        storyCreatedAt: new Date().toISOString()
    };
    
    updateDataUI();
}

// Обновление UI с данными
function updateDataUI() {
    document.getElementById('days-joined').textContent = userData.daysSinceJoin.toLocaleString();
    document.getElementById('premium-status').textContent = userData.isPremium ? 'Premium пользователь' : 'Обычный пользователь';
    document.getElementById('public-chats').textContent = userData.publicChats.toLocaleString();
    document.getElementById('chats-count').textContent = userData.publicChats;
    document.getElementById('messages-count').textContent = userData.messagesCount.toLocaleString();
    document.getElementById('avg-message-length').textContent = userData.avgMessageLength + ' символов';
    document.getElementById('stories-viewed').textContent = userData.storiesViewed.toLocaleString();
    document.getElementById('stories-time').textContent = userData.storiesTime;
    document.getElementById('voice-time').textContent = userData.voiceHours;
    document.getElementById('voice-count').textContent = userData.voiceCount.toLocaleString();
    document.getElementById('longest-voice').textContent = userData.longestVoice + ' мин';
    document.getElementById('avg-voice').textContent = userData.avgVoice + ' мин';
    document.getElementById('deleted-messages').textContent = userData.deletedMessages.toLocaleString();
    document.getElementById('deleted-quick').textContent = userData.deletedQuick.toLocaleString();
    document.getElementById('deleted-minute').textContent = userData.deletedMinute.toLocaleString();
    document.getElementById('deleted-day').textContent = userData.deletedDay.toLocaleString();
    document.getElementById('final-days').textContent = userData.daysSinceJoin.toLocaleString();
    document.getElementById('final-messages').textContent = userData.messagesCount.toLocaleString();
    document.getElementById('final-voice').textContent = userData.voiceHours;
    document.getElementById('final-stories').textContent = userData.storiesViewed.toLocaleString();
    document.getElementById('user-status').textContent = userData.userStatus;
    document.getElementById('share-days').textContent = userData.daysSinceJoin.toLocaleString();
    document.getElementById('share-messages').textContent = userData.messagesCount.toLocaleString();
    document.getElementById('share-stories').textContent = userData.storiesViewed.toLocaleString();
    document.getElementById('share-status').textContent = userData.userStatus;
    document.getElementById('gift-code').textContent = userData.giftCode;
}

// Создание снегопада
function createSnowfall() {
    const snowContainer = document.createElement('div');
    snowContainer.className = 'snowfall-container';
    document.body.appendChild(snowContainer);
    
    for (let i = 0; i < 100; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        
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
    if (slideNumber < 1 || slideNumber > totalSlides) return;
    
    const currentSlideElement = document.getElementById(`slide${currentSlide}`);
    const nextSlideElement = document.getElementById(`slide${slideNumber}`);
    
    currentSlideElement.classList.remove('active');
    nextSlideElement.classList.add('active');
    
    currentSlide = slideNumber;
    
    updateNavigation();
    updateProgress();
    updateSlideIndicators();
    
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
}

// Обновление навигации
function updateNavigation() {
    backBtn.classList.toggle('hidden', currentSlide === 1);
    
    if (currentSlide === totalSlides) {
        nextBtn.classList.add('hidden');
        shareFinalBtn.classList.remove('hidden');
    } else {
        nextBtn.classList.remove('hidden');
        shareFinalBtn.classList.add('hidden');
    }
    
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
    return `🌟 Мои итоги 2025 в Telegram! 🌟

📅 В Telegram уже: ${userData.daysSinceJoin.toLocaleString()} дней
💬 Отправлено сообщений: ${userData.messagesCount.toLocaleString()}
📸 Просмотрено историй: ${userData.storiesViewed.toLocaleString()}
🎙️ Голосовых сообщений: ${userData.voiceHours} часов
🗑️ Удалено сообщений: ${userData.deletedMessages.toLocaleString()}

🏆 Мой статус: ${userData.userStatus}

#TelegramИтоги2025 #МоиИтоги`;
}

// Создание картинки для историй
async function createStoryImage() {
    // Создаем специальный контейнер для истории
    const storyContainer = document.createElement('div');
    storyContainer.className = 'tg-story-container';
    storyContainer.style.cssText = `
        width: 1080px;
        height: 1920px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        font-family: 'Inter', sans-serif;
        position: relative;
        overflow: hidden;
        padding: 80px 60px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
    `;
    
    // Добавляем контент истории
    storyContainer.innerHTML = `
        <div style="text-align: center; margin-bottom: 40px;">
            <div style="font-size: 72px; font-weight: 800; margin-bottom: 20px;">🎄</div>
            <h1 style="font-size: 48px; font-weight: 800; margin-bottom: 20px; line-height: 1.2;">
                Мои итоги 2025<br>в Telegram!
            </h1>
            <p style="font-size: 32px; opacity: 0.9; margin-bottom: 40px;">
                ${userData.userStatus}
            </p>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; width: 100%; margin-bottom: 60px;">
            <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 30px; text-align: center; backdrop-filter: blur(10px);">
                <div style="font-size: 56px; font-weight: 800; margin-bottom: 10px;">${userData.daysSinceJoin.toLocaleString()}</div>
                <div style="font-size: 24px;">дней в Telegram</div>
            </div>
            <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 30px; text-align: center; backdrop-filter: blur(10px);">
                <div style="font-size: 56px; font-weight: 800; margin-bottom: 10px;">${userData.messagesCount.toLocaleString()}</div>
                <div style="font-size: 24px;">сообщений</div>
            </div>
            <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 30px; text-align: center; backdrop-filter: blur(10px);">
                <div style="font-size: 56px; font-weight: 800; margin-bottom: 10px;">${userData.storiesViewed.toLocaleString()}</div>
                <div style="font-size: 24px;">историй</div>
            </div>
            <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 30px; text-align: center; backdrop-filter: blur(10px);">
                <div style="font-size: 56px; font-weight: 800; margin-bottom: 10px;">${userData.voiceHours}</div>
                <div style="font-size: 24px;">часов голосовых</div>
            </div>
        </div>
        
        <div style="text-align: center;">
            <div style="background: rgba(255,255,255,0.15); padding: 20px 40px; border-radius: 50px; display: inline-block; margin-bottom: 30px;">
                <span style="font-size: 24px;">ID: ${userData.storyId}</span>
            </div>
            <p style="font-size: 28px; margin-bottom: 20px; opacity: 0.9;">
                Подведи и ты свои итоги!
            </p>
            <div style="font-size: 36px; font-weight: 800;">
                #TelegramИтоги2025
            </div>
        </div>
        
        <div style="position: absolute; bottom: 40px; right: 40px; font-size: 24px; opacity: 0.7;">
            @ResultsYears_robot
        </div>
    `;
    
    document.body.appendChild(storyContainer);
    
    try {
        const canvas = await html2canvas(storyContainer, {
            backgroundColor: null,
            scale: 1,
            useCORS: true,
            width: 1080,
            height: 1920
        });
        
        document.body.removeChild(storyContainer);
        
        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/png', 0.95);
        });
    } catch (error) {
        console.error('Ошибка создания картинки для истории:', error);
        document.body.removeChild(storyContainer);
        return null;
    }
}

// Создание истории в Telegram
async function createTelegramStory() {
    const btn = document.getElementById('create-story-btn');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Создаём историю...';
    btn.disabled = true;
    
    try {
        // Создаем изображение для истории
        const blob = await createStoryImage();
        
        if (!blob) {
            throw new Error('Не удалось создать изображение для истории');
        }
        
        // Симулируем создание истории
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Сохраняем статус
        storyCreated = true;
        localStorage.setItem('telegram2025_storyCreated', 'true');
        localStorage.setItem('telegram2025_storyId', userData.storyId);
        localStorage.setItem('telegram2025_storyStatus', 'pending');
        localStorage.setItem('telegram2025_storyCreatedAt', new Date().toISOString());
        
        // Показываем модальное окно
        hideShareModal();
        showStoryModal();
        
        // Вибрация
        if (tg.HapticFeedback) {
            tg.HapticFeedback.notificationOccurred('success');
        }
        
        // Симулируем отправку на модерацию
        simulateModeration();
        
    } catch (error) {
        console.error('Ошибка создания истории:', error);
        
        btn.innerHTML = originalText;
        btn.disabled = false;
        
        if (tg.showAlert) {
            tg.showAlert('Ошибка при создании истории. Попробуйте еще раз.');
        }
    }
}

// Симуляция процесса модерации
function simulateModeration() {
    // Через 5-10 секунд "проверяем" статус подписчика
    setTimeout(() => {
        checkSubscriptionStatus();
    }, getRandomInt(5000, 10000));
}

// Проверка статуса подписки на канал
async function checkSubscriptionStatus() {
    // Здесь должна быть реальная проверка подписки через Telegram API
    // В демо-версии симулируем проверку
    
    const isSubscribed = Math.random() > 0.3; // 70% шанс что подписан
    
    if (isSubscribed) {
        // Если подписан - быстрая модерация
        setTimeout(() => {
            approveStory();
        }, getRandomInt(2000, 5000));
    } else {
        // Если не подписан - обычная модерация
        setTimeout(() => {
            approveStory();
        }, getRandomInt(30000, 60000)); // 30-60 секунд
    }
}

// Одобрение истории
function approveStory() {
    userData.storyStatus = "approved";
    localStorage.setItem('telegram2025_storyStatus', 'approved');
    localStorage.setItem('telegram2025_giftCode', userData.giftCode);
    giftClaimed = true;
    localStorage.setItem('telegram2025_giftClaimed', 'true');
    
    // Если модальное окно истории открыто - закрываем и показываем подарок
    if (!storyModal.classList.contains('hidden')) {
        hideStoryModal();
        setTimeout(() => {
            showGiftModal();
        }, 500);
    }
    
    // Уведомление
    if (tg.showAlert) {
        tg.showAlert('🎉 Поздравляем! Твоя история прошла модерацию!');
    }
}

// Показать модальное окно истории
function showStoryModal() {
    storyModal.classList.remove('hidden');
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('medium');
    }
}

// Скрыть модальное окно истории
function hideStoryModal() {
    storyModal.classList.add('hidden');
}

// Показать модальное окно подарка
function showGiftModal() {
    giftModal.classList.remove('hidden');
    
    const tree = document.getElementById('gift-tree');
    tree.style.animation = 'tree-glow 2s infinite alternate';
    
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('heavy');
    }
}

// Скрыть модальное окно подарка
function hideGiftModal() {
    giftModal.classList.add('hidden');
}

// Показать модальное окно шеринга
function showShareModal() {
    shareModal.classList.remove('hidden');
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('medium');
    }
}

// Скрыть модальное окно шеринга
function hideShareModal() {
    shareModal.classList.add('hidden');
}

// Проверка статуса истории
function checkStoryStatus() {
    const btn = document.getElementById('check-status-btn');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Проверяем...';
    btn.disabled = true;
    
    // Симулируем проверку статуса
    setTimeout(() => {
        const savedStatus = localStorage.getItem('telegram2025_storyStatus');
        
        if (savedStatus === 'approved') {
            hideStoryModal();
            setTimeout(() => {
                showGiftModal();
            }, 500);
        } else {
            if (tg.showAlert) {
                tg.showAlert('История все еще на модерации. Обычно это занимает до 24 часов. Подпишись на канал для ускорения!');
            }
        }
        
        btn.innerHTML = originalText;
        btn.disabled = false;
    }, 1500);
}

// Проверка сохраненного статуса
function checkSavedStatus() {
    const storyCreated = localStorage.getItem('telegram2025_storyCreated');
    const storyStatus = localStorage.getItem('telegram2025_storyStatus');
    const giftClaimed = localStorage.getItem('telegram2025_giftClaimed');
    const savedCode = localStorage.getItem('telegram2025_giftCode');
    
    if (storyCreated === 'true') {
        storyCreated = true;
        userData.storyId = localStorage.getItem('telegram2025_storyId') || generateStoryId();
    }
    
    if (storyStatus === 'approved') {
        userData.storyStatus = 'approved';
    }
    
    if (giftClaimed === 'true' && savedCode) {
        giftClaimed = true;
        userData.giftCode = savedCode;
        document.getElementById('gift-code').textContent = savedCode;
    }
}

// Инициализация приложения
function initApp() {
    // Проверяем сохраненный статус
    checkSavedStatus();
    
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
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Создаём картинку...';
        
        const blob = await createStoryImage();
        
        if (blob) {
            try {
                await navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob })
                ]);
                
                btn.innerHTML = '<i class="fas fa-check"></i> Картинка скопирована!';
                if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
                
                setTimeout(() => {
                    btn.innerHTML = '<i class="fas fa-image"></i> Скопировать картинку';
                }, 2000);
            } catch (err) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'telegram-story-2025.png';
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
        const url = `https://t.me/share/url?url=${encodeURIComponent('https://t.me/ResultsYears_robot')}&text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
        hideShareModal();
    });
    
    // Кнопка создания истории
    document.getElementById('create-story-btn').addEventListener('click', async () => {
        // Если история уже создана и одобрена, показываем подарок
        if (userData.storyStatus === 'approved') {
            showGiftModal();
            return;
        }
        
        // Если история уже создана, но на модерации, показываем статус
        if (storyCreated) {
            showStoryModal();
            return;
        }
        
        // Создаем новую историю
        await createTelegramStory();
    });
    
    // Кнопки в модальном окне истории
    document.getElementById('subscribe-channel-btn').addEventListener('click', () => {
        const channelUrl = 'https://t.me/Telegram_News_RU';
        if (tg.openLink) {
            tg.openLink(channelUrl);
        } else {
            window.open(channelUrl, '_blank');
        }
    });
    
    document.getElementById('check-status-btn').addEventListener('click', checkStoryStatus);
    
    // Кнопки в модальном окне подарка
    document.getElementById('copy-gift-code').addEventListener('click', async () => {
        const code = userData.giftCode;
        const success = await copyToClipboard(code);
        
        if (success) {
            const btn = document.getElementById('copy-gift-code');
            btn.innerHTML = '<i class="fas fa-check"></i> Скопирован!';
            if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
            
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-copy"></i> Скопировать';
            }, 2000);
        }
    });
    
    document.getElementById('share-gift-btn').addEventListener('click', () => {
        const text = `🎄 Я получил(а) новогоднюю ёлочку за публикацию итогов 2025 в Telegram!\n\nПрисоединяйся и получи свой подарок! 🎁\n\n@ResultsYears_robot\n#TelegramИтоги2025 #НовогоднийПодарок`;
        const url = `https://t.me/share/url?url=${encodeURIComponent('https://t.me/ResultsYears_robot')}&text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    });
    
    // Закрытие модальных окон
    document.querySelector('.tg-modal-close').addEventListener('click', hideShareModal);
    document.querySelector('.tg-story-close').addEventListener('click', hideStoryModal);
    document.querySelector('.tg-gift-close').addEventListener('click', hideGiftModal);
    
    shareModal.addEventListener('click', (e) => {
        if (e.target === shareModal) {
            hideShareModal();
        }
    });
    
    storyModal.addEventListener('click', (e) => {
        if (e.target === storyModal) {
            hideStoryModal();
        }
    });
    
    giftModal.addEventListener('click', (e) => {
        if (e.target === giftModal) {
            hideGiftModal();
        }
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (!shareModal.classList.contains('hidden')) hideShareModal();
            if (!storyModal.classList.contains('hidden')) hideStoryModal();
            if (!giftModal.classList.contains('hidden')) hideGiftModal();
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
                if (currentSlide < totalSlides) {
                    goToSlide(currentSlide + 1);
                }
            } else {
                if (currentSlide > 1) {
                    goToSlide(currentSlide - 1);
                }
            }
        }
    }
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', initApp);
