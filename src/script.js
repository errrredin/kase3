// Данные с картинками
var pics = [
    {
        src: 'https://picsum.photos/seed/a1/800/600',
        name: 'Горы',
        about: 'Красота горных вершин'
    },
    {
        name: 'Море',
        about: 'Закат на побережье'
    },
    {
        src: 'https://picsum.photos/seed/c3/800/600',
        name: 'Город',
        about: 'Ночной мегаполис'
    },
    {
        src: 'https://picsum.photos/seed/d4/800/600',
        name: 'Лес',
        about: 'Осенняя аллея'
    },
    {
        src: 'https://picsum.photos/seed/e5/800/600',
        name: 'Цветы',
        about: 'Поле тюльпанов'
    }
];

// DOM штуки
var sliderLine = document.getElementById('sliderLine');
var leftBtn = document.getElementById('btnLeft');
var rightBtn = document.getElementById('btnRight');
var dotsBox = document.getElementById('dotsBox');
var currentSpan = document.getElementById('currentNum');
var totalSpan = document.getElementById('totalNum');
var titleEl = document.getElementById('imgTitle');
var descEl = document.getElementById('imgDesc');

var currentSlide = 0;
var totalSlides = pics.length;
var isAnimating = false;

// Функция отрисовки
function renderSlides() {
    sliderLine.innerHTML = '';

    for (var i = 0; i < pics.length; i++) {
        var slide = document.createElement('div');
        slide.className = 'slide-item';

        var img = document.createElement('img');
        img.src = pics[i].src;
        img.alt = pics[i].name;

        // Если картинка не грузится
        img.onerror = function(ev) {
            var parent = ev.target.parentNode;
            parent.innerHTML = '';
            var placeholder = document.createElement('div');
            placeholder.className = 'fake-img';
            placeholder.innerHTML = '🖼️<small>Картинка ' + (Array.from(parent.parentNode.children).indexOf(parent) + 1) + '</small>';
            parent.appendChild(placeholder);
        };

        slide.appendChild(img);
        sliderLine.appendChild(slide);
    }
}

// Точки
function renderDots() {
    dotsBox.innerHTML = '';
    for (var i = 0; i < totalSlides; i++) {
        var dot = document.createElement('div');
        dot.className = 'dot';
        if (i === currentSlide) {
            dot.classList.add('active-dot');
        }
        dot.dataset.idx = i;
        dotsBox.appendChild(dot);
    }
}

// Обновить все
function updateAll() {
    var offset = -currentSlide * 100;
    sliderLine.style.transform = 'translateX(' + offset + '%)';

    currentSpan.textContent = currentSlide + 1;
    totalSpan.textContent = totalSlides;

    titleEl.textContent = pics[currentSlide].name;
    descEl.textContent = pics[currentSlide].about;

    var allDots = dotsBox.querySelectorAll('.dot');
    for (var i = 0; i < allDots.length; i++) {
        allDots[i].classList.toggle('active-dot', i === currentSlide);
    }
}

// Переключение
function goToSlide(index) {
    if (isAnimating) return;
    if (index === currentSlide) return;

    isAnimating = true;
    currentSlide = index;
    updateAll();

    setTimeout(function() {
        isAnimating = false;
    }, 450);
}

// Вперед
function nextSlide() {
    var next = (currentSlide + 1) % totalSlides;
    goToSlide(next);
}

// Назад
function prevSlide() {
    var prev = (currentSlide - 1 + totalSlides) % totalSlides;
    goToSlide(prev);
}

// Инициализация
function initSlider() {
    renderSlides();
    renderDots();
    updateAll();

    // Кнопки
    leftBtn.addEventListener('click', prevSlide);
    rightBtn.addEventListener('click', nextSlide);

    // Клик по точкам
    dotsBox.addEventListener('click', function(e) {
        var target = e.target;
        if (target.classList.contains('dot')) {
            var idx = parseInt(target.dataset.idx);
            goToSlide(idx);
        }
    });

    // Клавиши
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            e.preventDefault();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            e.preventDefault();
        }
    });

    // Свайп
    var startX = 0;
    var endX = 0;
    var holder = document.getElementById('sliderHolder');

    holder.addEventListener('touchstart', function(e) {
        startX = e.touches[0].screenX;
    }, {passive: true});

    holder.addEventListener('touchend', function(e) {
        endX = e.changedTouches[0].screenX;
        var diff = startX - endX;
        if (Math.abs(diff) > 40) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }, {passive: true});

    // Ресайз
    var resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            updateAll();
        }, 150);
    });
}

// Запускаем когда все загрузилось
window.onload = function() {
    initSlider();
};