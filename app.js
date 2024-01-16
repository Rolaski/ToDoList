window.addEventListener('load', () => {
  const form = document.querySelector("#new-task-form");
  const input = document.querySelector("#new-task-input");
  const list_el = document.querySelector("#tasks");

  // Załaduj zadania z lokalnego magazynu podczas ładowania strony
  let storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // Funkcja do renderowania zadań
  const renderTasks = () => {
    list_el.innerHTML = '';

    storedTasks.forEach((taskText) => {
      const task_el = createTaskElement(taskText);
      list_el.appendChild(task_el);
    });
  };

  // Funkcja do obsługi dodawania nowego zadania
  const addNewTask = () => {
    const task = input.value;

    // Wyrażenie regularne do sprawdzenia, czy wprowadzone dane zawierają tylko dozwolone znaki
    const validCharactersRegex = /^[a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ.,\-/]+$/;

    if (task.trim() !== '' && validCharactersRegex.test(task)) {
      // Dodaj nowe zadanie do tablicy zadań
      storedTasks = [...storedTasks, task];
      localStorage.setItem('tasks', JSON.stringify(storedTasks));

      // Symuluj operację asynchroniczną (poczekaj 1 sekundę przed ponownym renderowaniem)
      setTimeout(() => {
        renderTasks(); // Ponowne renderowanie zadań
      }, 1000);

      input.value = '';
    } else if (task.trim() === '') {
      // Wyświetl alert, jeżeli pole jest puste
      alert('Task field cannot be empty!');
    } else {
      // Wyświetl alert w przypadku błędnych danych
      alert('Invalid characters in the task field!');
      input.value = ''; // Wyczyszczenie pola wpisywania zadania
    }
  };

  // Słuchacz zdarzeń dla formularza
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    addNewTask();
  });

  // Słuchacz zdarzeń dla klawisza Enter w polu tekstowym
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Zatrzymaj domyślne działanie klawisza Enter (np. przesyłanie formularza)
      addNewTask();
    }
  });

  // Funkcja do tworzenia elementu zadania
  const createTaskElement = (taskText) => {
    const task_el = document.createElement('div');
    task_el.classList.add('task');

    const task_content_el = document.createElement('div');
    task_content_el.classList.add('content');

    task_el.appendChild(task_content_el);

    const task_input_el = document.createElement('input');
    task_input_el.classList.add('text');
    task_input_el.type = 'text';
    task_input_el.value = taskText;
    task_input_el.setAttribute('readonly', 'readonly');

    task_content_el.appendChild(task_input_el);

    const task_actions_el = document.createElement('div');
    task_actions_el.classList.add('actions');

    const task_edit_el = document.createElement('button');
    task_edit_el.classList.add('edit');
    task_edit_el.innerText = 'EDIT';

    const task_delete_el = document.createElement('button');
    task_delete_el.classList.add('delete');
    task_delete_el.innerText = 'DELETE';

    task_actions_el.appendChild(task_edit_el);
    task_actions_el.appendChild(task_delete_el);

    task_el.appendChild(task_actions_el);

    // Słuchacze zdarzeń dla przycisków edytuj i usuń
    task_actions_el.addEventListener('click', (e) => {
      if (e.target.classList.contains('edit')) {
        editTask(task_input_el, taskText, task_edit_el);
      } else if (e.target.classList.contains('delete')) {
        deleteTask(task_el, taskText);
      }
    });

    return task_el;
  };

  // Funkcja do edycji zadania
  const editTask = (task_input_el, oldTaskText, task_edit_el) => {
    // Zmień atrybut readonly, aby umożliwić edycję
    task_input_el.removeAttribute('readonly');
    // Dodaj focus do pola tekstowego
    task_input_el.focus();

    // Zmień tekst przycisku na "Zapisz"
    task_edit_el.innerText = 'SAVE';

    // Przygotuj funkcję saveChanges do zapisywania zmian
    const saveChanges = () => {
      const newTaskText = task_input_el.value;

      if (newTaskText !== oldTaskText) {
        // Zaktualizuj tekst zadania w tablicy zadań
        storedTasks = storedTasks.map((task) => (task === oldTaskText ? newTaskText : task));
        localStorage.setItem('tasks', JSON.stringify(storedTasks));

        // Symuluj operację asynchroniczną (poczekaj 1 sekundę przed ponownym renderowaniem)
        setTimeout(() => {
          renderTasks(); // Ponowne renderowanie zadań
        }, 1000);
      }

      // Ustaw atrybut readonly po zakończeniu edycji
      task_input_el.setAttribute('readonly', 'readonly');

      // Zmień tekst przycisku z powrotem na "Edytuj"
      task_edit_el.innerText = 'EDIT';
    };

    // Dodaj nasłuchiwacz zdarzeń dla przycisku "Zapisz"
    task_edit_el.addEventListener('click', saveChanges);

    // Dodaj nasłuchiwacz zdarzeń dla klawisza Enter do zapisywania zmian
    const handleEnterKey = (e) => {
      if (e.key === 'Enter') {
        saveChanges();
      }
    };

    // Dodaj nasłuchiwacz zdarzeń dla klawisza Enter
    task_input_el.addEventListener('keypress', handleEnterKey);
  };

  // Funkcja do usuwania zadania
  const deleteTask = (task_el, taskText) => {
    // Usuń zadanie z tablicy zadań
    storedTasks = storedTasks.filter((task) => task !== taskText);
    localStorage.setItem('tasks', JSON.stringify(storedTasks));

    // Symuluj operację asynchroniczną (poczekaj 1 sekundę przed ponownym renderowaniem)
    setTimeout(() => {
      renderTasks(); // Ponowne renderowanie zadań
    }, 1000);
  };

  // Renderuj zadania podczas ładowania strony
  renderTasks();
});

document.addEventListener("DOMContentLoaded", function () {
  const prevButton = document.querySelector('.prev');
  const nextButton = document.querySelector('.next');
  const carousel = document.querySelector('.image-carousel');

  const images = [
    { src: "images/linkedin.png", link: "https://www.linkedin.com/in/jakub-jakubowski-54076123b/" },
    { src: "images/github.png", link: "https://github.com/Rolaski" },
    { src: "images/youtube.png", link: "https://www.youtube.com/channel/UC4not1DNbD0wDPWUoArL7HQ" }
  ];

  let currentIndex = 1; // Zdjęcie GitHub będzie widoczne na starcie

  updateCarousel();

  prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateCarousel('prev');
  });

  nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateCarousel('next');
  });

  function updateCarousel(direction) {
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    const a = document.createElement('a');

    img.src = images[currentIndex].src;
    img.alt = `Feature ${currentIndex + 1}`;
    
    // Dodaj odnośnik do strony internetowej
    a.href = images[currentIndex].link;
    a.target = "_blank";
    a.appendChild(img);

    figure.appendChild(a);
    figure.style.opacity = '0';

    if (direction === 'prev') {
      figure.style.transform = 'translateX(-100%)';
    } else {
      figure.style.transform = 'translateX(100%)';
    }

    carousel.innerHTML = '';
    carousel.appendChild(figure); // Dodaj nowe zdjęcie

    // Wywołaj reflow przed dodaniem klasy animacji
    void figure.offsetWidth;

    figure.style.opacity = '1';
    figure.style.transform = 'translateX(0)';

    // Dodaj obsługę zdarzeń dla powiększenia zdjęcia przy najechaniu myszką
    figure.addEventListener('mouseover', () => {
      img.style.transform = 'scale(1.1)';
    });

    figure.addEventListener('mouseout', () => {
      img.style.transform = 'scale(1)';
    });
  }
});
