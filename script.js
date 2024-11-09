let currentImageIndex = 1;
let totalImages = 15;

document.addEventListener(
  "click",
  () => {
    const backgroundMusic = document.getElementById("background-music");
    if (backgroundMusic.paused) {
      backgroundMusic.play();
    }
  },
  { once: true }
); // Запуск музыки один раз при первом клике

function checkAnswer(selectedAnswer, correctAnswer) {
  const question = document.getElementById("question");
  const backgroundMusic = document.getElementById("background-music");
  const correctSound = document.getElementById("correct-sound");
  const wrongSound = document.getElementById("wrong-sound");

  if (selectedAnswer === correctAnswer) {
    backgroundMusic.volume = 0.3; // Понижаем громкость фоновой музыки
    correctSound.play();

    correctSound.onended = () => {
      backgroundMusic.volume = 1; // Восстанавливаем громкость фоновой музыки
    };

    const hiddenCards = document.querySelectorAll(".card:not(.hidden)");
    if (hiddenCards.length > 0) {
      hiddenCards[0].classList.add("hidden"); // Открываем следующую карточку
    }

    if (hiddenCards.length === 1) {
      setTimeout(() => {
        playLevelPassedSound(); // Воспроизводим звук "level passed"
        nextLevel();
      }, 500);
    } else {
      generateQuestion();
    }
  } else {
    backgroundMusic.volume = 0.3; // Понижаем громкость фоновой музыки
    wrongSound.play();

    wrongSound.onended = () => {
      backgroundMusic.volume = 1; // Восстанавливаем громкость фоновой музыки
    };
  }
}

function generateQuestion() {
  let num1, num2, isAddition, correctAnswer, questionText;

  // Генерируем вопрос до тех пор, пока результат вычитания не станет положительным
  do {
    num1 = Math.floor(Math.random() * 11);
    num2 = Math.floor(Math.random() * 11);
    isAddition = Math.random() > 0.5;

    // Определяем текст вопроса и правильный ответ
    if (isAddition) {
      questionText = `${num1} + ${num2}`;
      correctAnswer = num1 + num2;
    } else {
      // Проверка, чтобы результат не был отрицательным
      if (num1 >= num2) {
        questionText = `${num1} - ${num2}`;
        correctAnswer = num1 - num2;
      } else {
        questionText = `${num2} - ${num1}`;
        correctAnswer = num2 - num1;
      }
    }
  } while (correctAnswer < 0); // Убедимся, что ответ не меньше 0

  document.getElementById("question").textContent = `Вопрос: ${questionText}`;
  generateAnswerOptions(correctAnswer);
}

function generateAnswerOptions(correctAnswer) {
  const answerOptions = [];
  answerOptions.push(correctAnswer);

  while (answerOptions.length < 4) {
    const wrongAnswer = Math.floor(Math.random() * 21) - 10;
    if (!answerOptions.includes(wrongAnswer)) {
      answerOptions.push(wrongAnswer);
    }
  }

  // Перемешиваем варианты ответов
  answerOptions.sort(() => Math.random() - 0.5);

  const answerOptionsContainer = document.getElementById("answer-options");
  answerOptionsContainer.innerHTML = ""; // Очистить предыдущие варианты

  answerOptions.forEach((option) => {
    const button = document.createElement("button");
    button.classList.add("btn", "btn-primary", "m-1");
    button.textContent = option;
    button.onclick = () => checkAnswer(option, correctAnswer);
    answerOptionsContainer.appendChild(button);
  });
}

function nextLevel() {
  currentImageIndex++;
  if (currentImageIndex > totalImages) {
    alert("Игра завершена!");
    return;
  }

  // Обновляем фон и карточки
  document.querySelector(
    ".game-board"
  ).style.backgroundImage = `url('images/person/${currentImageIndex}.jpeg')`;

  // Сбрасываем карточки для нового уровня
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.classList.remove("hidden");
  });

  generateQuestion(); // Создаем новый вопрос для нового уровня
}

function playLevelPassedSound() {
  const backgroundMusic = document.getElementById("background-music");
  const levelPassedSound = new Audio("musics/level passed.mp3");

  backgroundMusic.volume = 0.3; // Понижаем громкость фоновой музыки
  levelPassedSound.play();

  levelPassedSound.onended = () => {
    backgroundMusic.volume = 1; // Восстанавливаем громкость фоновой музыки после завершения звука
  };
}

// Инициализация первого вопроса
generateQuestion();
