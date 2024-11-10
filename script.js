let currentImageIndex = 1;
let totalImages = 15;
let num1 = 1; // Начальное значение первого множителя
let num2 = 1; // Начальное значение второго множителя

// Массив с названиями и расширениями файлов
const personFiles = [
  "1.mpeg",
  "2.aac",
  "3.aac",
  "4.aac",
  "5.aac",
  "6.mpeg",
  "7.aac",
  "8.aac",
  "9.aac",
  "10.aac",
  "11.aac",
  "12.aac",
  "13.aac",
  "14.aac",
  "15.aac",
];

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
      hiddenCards[0].classList.add("hidden"); // Убираем следующую карточку
    }

    if (hiddenCards.length === 1) {
      setTimeout(() => {
        playLevelPassedSound(); // Воспроизводим звук "level passed"
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
  const questionText = `${num1} * ${num2}`;
  const correctAnswer = num1 * num2;

  document.getElementById("question").textContent = `Вопрос: ${questionText}`;
  generateAnswerOptions(correctAnswer);

  // Переход к следующему вопросу в порядке умножения
  num2++;
  if (num2 > 10) {
    // После 1*10 -> 2*1, 2*2, ..., 10*10
    num2 = 1;
    num1++;
    if (num1 > 10) {
      num1 = 1; // Сбрасываем к началу после 10*10
    }
  }
}

function generateAnswerOptions(correctAnswer) {
  const answerOptions = [];
  answerOptions.push(correctAnswer);

  while (answerOptions.length < 4) {
    const wrongAnswer = Math.floor(Math.random() * 101); // Ответы в диапазоне от 0 до 100
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

  const backgroundMusic = document.getElementById("background-music");
  backgroundMusic.volume = 0.1; // Уменьшаем громкость фона для этапного звука

  // Воспроизводим звук текущего этапа
  const stageSound = new Audio(
    `musics/person/${personFiles[currentImageIndex - 2]}`
  );
  console.log(stageSound);
  console.log(currentImageIndex - 2);

  stageSound.play();

  stageSound.onended = () => {
    backgroundMusic.volume = 1; // Восстанавливаем громкость фоновой музыки

    // После окончания звука этапа обновляем фон и карточки
    document.querySelector(
      ".game-board"
    ).style.backgroundImage = `url('images/person/${currentImageIndex}.jpeg')`;

    // Сбрасываем карточки для нового уровня
    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
      card.classList.remove("hidden");
    });

    generateQuestion(); // Создаем новый вопрос для нового уровня
  };
}

function playLevelPassedSound() {
  const backgroundMusic = document.getElementById("background-music");
  const levelPassedSound = new Audio("musics/level passed.mp3");

  backgroundMusic.volume = 0.3; // Понижаем громкость фоновой музыки
  levelPassedSound.play();

  levelPassedSound.onended = () => {
    backgroundMusic.volume = 1; // Восстанавливаем громкость фоновой музыки после завершения звука
    nextLevel(); // Переход на следующий уровень после завершения звука "level passed"
  };
}

// Инициализация первого вопроса
generateQuestion();
