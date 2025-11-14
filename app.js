// Эффект печатной машинки
document.addEventListener('DOMContentLoaded', function () {
	const container = document.querySelector('.typewriter-container');

	if (container) {
		// Массив строк кода
		const codeLines = [
			'function solution() {',
			'  return [',
			'    "Веб-разработка",',
			'    "Мобильные приложения",',
			'    "UI-UX дизайн"',
			'    "Telegram-боты"',
			'  ].join ("\\n");',
			'}',
			'',
			'// Всё для вас!',
			'// Код. Дизайн. Результат.'
		];

		let currentLineIndex = 0;
		let currentCharIndex = 0;
		let currentLineElement = null;

		// Создаем элемент для курсора
		const cursor = document.createElement('span');
		cursor.className = 'typewriter-cursor';
		cursor.textContent = '|';

		// Функция для создания новой строки
		function createNewLine() {
			currentLineElement = document.createElement('div');
			currentLineElement.className = 'code-line';
			container.appendChild(currentLineElement);
			currentLineElement.appendChild(cursor);
		}

		// Функция для печати следующего символа
		function typeNextCharacter() {
			if (currentLineIndex < codeLines.length) {
				const currentLine = codeLines[currentLineIndex];

				if (currentCharIndex === 0) {
					createNewLine();
				}

				if (currentCharIndex < currentLine.length) {
					// Добавляем символ перед курсором
					const char = currentLine[currentCharIndex];
					const textNode = document.createTextNode(char);
					currentLineElement.insertBefore(textNode, cursor);
					currentCharIndex++;

					// Задержка между символами
					setTimeout(typeNextCharacter, 50);
				} else {
					// Переходим к следующей строке
					currentLineIndex++;
					currentCharIndex = 0;

					// Задержка между строками
					setTimeout(typeNextCharacter, 100);
				}
			} else {
				// Анимация завершена - оставляем курсор мигать
				cursor.style.animation = 'blink-cursor 1s step-end infinite';
			}
		}

		// Начинаем анимацию сразу
		typeNextCharacter();
	}
});

// FAQ accordion: плавное открытие/закрытие, один открыт
document.addEventListener('DOMContentLoaded', function () {
	const items = Array.from(document.querySelectorAll('.faq__questions-element'));
	if (!items.length) return;

	function closeAll(except) {
		items.forEach(el => {
			if (el !== except) {
				el.classList.remove('open');
				el.setAttribute('aria-expanded', 'false');
			}
		});
	}

	items.forEach(el => {
		el.setAttribute('role', 'button');
		el.setAttribute('tabindex', '0');
		el.setAttribute('aria-expanded', 'false');

		const toggle = () => {
			const isOpen = el.classList.contains('open');
			closeAll(el);
			if (!isOpen) {
				el.classList.add('open');
				el.setAttribute('aria-expanded', 'true');
			} else {
				el.classList.remove('open');
				el.setAttribute('aria-expanded', 'false');
			}
		};

		el.addEventListener('click', (e) => {
			// Кликаем по блоку — переключаем
			toggle();
		});

		el.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				toggle();
			}
		});
	});
});

// Эффект параллакса для элементов (оптимизирован: рендерим только при движении мыши)
document.addEventListener('DOMContentLoaded', function () {
	const parallaxElements = document.querySelectorAll('.parallax-element');

	if (parallaxElements.length === 0) return;

	let rafId = null;

	// Отслеживаем движение мыши и рендерим только при движении
	document.addEventListener('mousemove', (e) => {
		// Получаем размеры окна
		const ww = window.innerWidth;
		const wh = window.innerHeight;

		// Вычисляем позицию мыши относительно центра экрана (от -1 до 1)
		const x = ((e.clientX - ww / 2) / (ww / 2)) * 50;
		const y = ((e.clientY - wh / 2) / (wh / 2)) * 50;

		// Отменяем предыдущий кадр, если он есть
		if (rafId) cancelAnimationFrame(rafId);

		// Рендерим только один кадр при движении мыши
		rafId = requestAnimationFrame(() => {
			parallaxElements.forEach(el => {
				el.style.transform = `translate(${x}px, ${y}px)`;
			});
			rafId = null;
		});
	}, { passive: true });
});

// Скрытие/показ header при скролле (оптимизировано с RAF)
document.addEventListener('DOMContentLoaded', function () {
	const header = document.querySelector('header');
	if (!header) return;
	
	let lastScrollTop = 0;
	let rafId = null;
	const scrollThreshold = 5;

	function handleScroll() {
		// Отменяем предыдущий RAF, если есть
		if (rafId) cancelAnimationFrame(rafId);

		// Используем RAF для плавной обработки скролла
		rafId = requestAnimationFrame(() => {
			const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
			const scrollDelta = currentScrollTop - lastScrollTop;

			// Проверяем направление скролла только если прокрутили достаточно
			if (Math.abs(scrollDelta) > scrollThreshold) {
				if (scrollDelta > 0 && currentScrollTop > 100) {
					// Скролл вниз и мы не в самом верху страницы - скрываем header
					header.classList.add('hide');
				} else if (scrollDelta < 0 || currentScrollTop <= 100) {
					// Скролл вверх или находимся в верхней части страницы - показываем header
					header.classList.remove('hide');
				}

				lastScrollTop = currentScrollTop;
			}

			rafId = null;
		});
	}

	window.addEventListener('scroll', handleScroll, { passive: true });
});

// Drag and drop for portfolio slider
document.addEventListener('DOMContentLoaded', function () {
	const slider = document.querySelector('.portfolio__cards');
	if (slider) {
		let isDown = false;
		let startX;
		let scrollLeft;

		slider.addEventListener('mousedown', (e) => {
			isDown = true;
			slider.classList.add('active');
			startX = e.pageX - slider.offsetLeft;
			scrollLeft = slider.scrollLeft;
		});

		slider.addEventListener('mouseleave', () => {
			isDown = false;
			slider.classList.remove('active');
		});

		slider.addEventListener('mouseup', () => {
			isDown = false;
			slider.classList.remove('active');
		});

		slider.addEventListener('mousemove', (e) => {
			if (!isDown) return;
			e.preventDefault();
			const x = e.pageX - slider.offsetLeft;
			const walk = (x - startX) * 1; // Множитель для скорости прокрутки
			slider.scrollLeft = scrollLeft - walk;
		});
	}
});

// Валидация формы контактов и маска телефона
document.addEventListener('DOMContentLoaded', function () {
	const form = document.getElementById('contactsForm');
	const nameInput = document.getElementById('contactName');
	const phoneInput = document.getElementById('contactPhone');

	if (!form || !nameInput || !phoneInput) return;

	// Маска для телефона (русский формат +7)
	phoneInput.addEventListener('input', function (e) {
		let value = e.target.value.replace(/\D/g, ''); // Убираем все не цифры

		// Если начинается с 8, заменяем на 7
		if (value.startsWith('8')) {
			value = '7' + value.substring(1);
		}
		// Если начинается с 7, оставляем как есть
		// Если не начинается с 7 или 8, добавляем 7 в начало
		if (value.length > 0 && !value.startsWith('7')) {
			value = '7' + value;
		}

		// Ограничиваем длину до 11 цифр (7 + 10 цифр)
		if (value.length > 11) {
			value = value.substring(0, 11);
		}

		// Форматируем: +7 (XXX) XXX-XX-XX
		let formatted = '+7';
		if (value.length > 1) {
			const digits = value.substring(1); // Берем цифры после 7
			if (digits.length > 0) {
				formatted += ' (' + digits.substring(0, 3);
			}
			if (digits.length > 3) {
				formatted += ') ' + digits.substring(3, 6);
			}
			if (digits.length > 6) {
				formatted += '-' + digits.substring(6, 8);
			}
			if (digits.length > 8) {
				formatted += '-' + digits.substring(8, 10);
			}
		}

		e.target.value = formatted;
		
		// Убираем ошибку при вводе
		if (e.target.classList.contains('error') && value.length === 11) {
			validateField(e.target);
		}
	});

	// Обработка клавиш Backspace и Delete
	phoneInput.addEventListener('keydown', function (e) {
		if (e.key === 'Backspace' && phoneInput.value.length <= 4) {
			e.preventDefault();
			phoneInput.value = '';
		}
	});

	// Функция валидации поля
	function validateField(field) {
		const value = field.value.trim();
		let isValid = true;

		if (field === nameInput) {
			// Валидация имени: минимум 2 символа
			if (value.length < 2) {
				isValid = false;
			}
		} else if (field === phoneInput) {
			// Валидация телефона: должен быть полный формат +7 (XXX) XXX-XX-XX
			const phoneDigits = value.replace(/\D/g, '');
			if (phoneDigits.length !== 11 || !phoneDigits.startsWith('7')) {
				isValid = false;
			}
		}

		if (isValid) {
			field.classList.remove('error');
		} else {
			field.classList.add('error');
		}

		return isValid;
	}

	// Валидация при потере фокуса
	nameInput.addEventListener('blur', function () {
		validateField(nameInput);
	});

	phoneInput.addEventListener('blur', function () {
		validateField(phoneInput);
	});

	// Валидация при отправке формы
	form.addEventListener('submit', function (e) {
		e.preventDefault();

		const isNameValid = validateField(nameInput);
		const isPhoneValid = validateField(phoneInput);

		if (isNameValid && isPhoneValid) {
			// Форма валидна - можно отправить
			console.log('Form is valid:', {
				name: nameInput.value,
				phone: phoneInput.value
			});
			// Здесь можно добавить отправку формы
			// form.submit();
		} else {
			// Показываем ошибки
			if (!isNameValid) {
				nameInput.classList.add('error');
			}
			if (!isPhoneValid) {
				phoneInput.classList.add('error');
			}
		}
	});
});

// Бургер-меню: открытие/закрытие, анимация бургера в крестик, блокировка скролла
document.addEventListener('DOMContentLoaded', function () {
	const burger = document.querySelector('.header__burger');
	const burgerMenu = document.querySelector('.burger__menu');
	const header = document.querySelector('header');
	const burgerLines = document.querySelectorAll('.header__burger-line');
	const menuLinks = document.querySelectorAll('.burger__menu .header__menu-link');
	
	if (!burger || !burgerMenu || !header) return;
	
	let isMenuOpen = false;
	
	// Функция для открытия меню
	function openMenu() {
		isMenuOpen = true;
		header.classList.add('menu-open');
		burger.classList.add('active');
		burgerMenu.style.display = 'flex';
		document.body.classList.add('no-scroll');
		
		// Небольшая задержка для запуска анимации
		setTimeout(() => {
			burgerMenu.classList.add('active');
		}, 10);
	}
	
	// Функция для закрытия меню
	function closeMenu() {
		isMenuOpen = false;
		header.classList.remove('menu-open');
		burger.classList.remove('active');
		burgerMenu.classList.remove('active');
		document.body.classList.remove('no-scroll');
		
		// Ждем завершения анимации перед скрытием
		setTimeout(() => {
			burgerMenu.style.display = 'none';
		}, 300);
	}
	
	// Обработчик клика на бургер
	burger.addEventListener('click', function (e) {
		e.stopPropagation();
		if (isMenuOpen) {
			closeMenu();
		} else {
			openMenu();
		}
	});
	
	// Обработчик клика на ссылки меню
	menuLinks.forEach(link => {
		link.addEventListener('click', function (e) {
			const href = this.getAttribute('href');
			
			// Если это якорная ссылка (начинается с #)
			if (href && href.startsWith('#') && href !== '#!') {
				e.preventDefault();
				closeMenu();
				
				// Плавная прокрутка к секции
				setTimeout(() => {
					const targetId = href.substring(1);
					const targetElement = document.getElementById(targetId);
					
					if (targetElement) {
						const headerHeight = header.offsetHeight;
						const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
						
						window.scrollTo({
							top: targetPosition,
							behavior: 'smooth'
						});
					}
				}, 300);
			} else {
				// Для других ссылок просто закрываем меню
				closeMenu();
			}
		});
	});
	
	// Закрытие меню при клике вне его области
	document.addEventListener('click', function (e) {
		if (isMenuOpen && !burgerMenu.contains(e.target) && !burger.contains(e.target)) {
			closeMenu();
		}
	});
	
	// Закрытие меню при нажатии Escape
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape' && isMenuOpen) {
			closeMenu();
		}
	});
});

// Desktop menu smooth scroll
document.addEventListener('DOMContentLoaded', function () {
  const desktopLinks = document.querySelectorAll('.menu .header__menu-link');
  
  desktopLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      if (href && href.startsWith('#') && href !== '#!') {
        e.preventDefault();
        
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const header = document.querySelector('header');
          const headerHeight = header ? header.offsetHeight : 0;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
});
