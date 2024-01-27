/**
 * Klasa TaskManager zarządza zadaniami.
 * @class
 */
class TaskManager {
  /**
   * Konstruktor klasy TaskManager.
   * Inicjalizuje listę zadań na podstawie danych z local storage i renderuje zadania.
   * @constructor
   */
  constructor() {
    /**
     * Lista przechowująca zadania.
     * @type {string[]}
     */
    this.storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    this.renderTasks();
  }

  /**
   * Metoda renderująca zadania na stronie.
   * @method
   */
  renderTasks() {
    const listEl = document.querySelector("#tasks");
    listEl.innerHTML = '';

    this.storedTasks.forEach((taskText) => {
      const taskEl = this.createTaskElement(taskText);
      listEl.appendChild(taskEl);
    });
  }

  /**
   * Metoda dodająca nowe zadanie.
   * @method
   * @param {HTMLInputElement} taskInput - Pole wejściowe zawierające treść nowego zadania.
   */
  addNewTask(taskInput) {
    const task = taskInput.value;

    const validCharactersRegex = /^[a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ.,\-/\s]+$/;

    if (task.trim() !== '' && validCharactersRegex.test(task)) {
      this.storedTasks = [...this.storedTasks, task];
      localStorage.setItem('tasks', JSON.stringify(this.storedTasks));

      this.renderTasks();

      setTimeout(() => {
        this.renderTasks();
      }, 1000);

      taskInput.value = '';
    } else if (task.trim() === '') {
      alert('Task field cannot be empty!');
    } else {
      alert('Invalid characters in the task field!');
      taskInput.value = '';
    }
  }

  /**
   * Metoda tworząca element zadania.
   * @method
   * @param {string} taskText - Treść zadania.
   * @returns {HTMLDivElement} - Element zadania.
   */
  createTaskElement(taskText) 
  {
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
          this.editTask(task_input_el, taskText, task_edit_el);
        } else if (e.target.classList.contains('delete')) {
          this.deleteTask(task_el, taskText);
        }
      });
  
      return task_el;
  }

  /**
   * Metoda do edycji zadania.
   * @method
   * @param {HTMLInputElement} task_input_el - Pole wejściowe z treścią zadania.
   * @param {string} oldTaskText - Poprzednia treść zadania.
   * @param {HTMLButtonElement} task_edit_el - Przycisk edycji zadania.
   */
  editTask(task_input_el, oldTaskText, task_edit_el) {
      task_input_el.removeAttribute('readonly');    // Zmień atrybut readonly, aby umożliwić edycję
      task_input_el.focus();    // Dodaj focus do pola tekstowego
      task_edit_el.innerText = 'SAVE';    // Zmień tekst przycisku na "Zapisz"
  
      // Przygotowanie funkcji do zapisywania zmian
      const validCharactersRegex = /^[a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ.,\-/\s]+$/;
      const saveChanges = () => {
        const newTaskText = task_input_el.value;
  
        // Sprawdź, czy nowy tekst spełnia kryteria walidacji
        if (newTaskText.trim() !== '' && validCharactersRegex.test(newTaskText)) {
          // Zaktualizuj tekst zadania w tablicy zadań
          this.storedTasks = this.storedTasks.map((task) => (task === oldTaskText ? newTaskText : task));
          localStorage.setItem('tasks', JSON.stringify(this.storedTasks));
          // Symuluj operację asynchroniczną (poczekaj 1 sekundę przed ponownym renderowaniem)
          setTimeout(() => {
            this.renderTasks();
          }, 1000);
        } else if (newTaskText.trim() === '') {
          // Wyświetl alert, jeżeli pole jest puste
          alert('Task field cannot be empty!');
        } else {
          // Wyświetl alert w przypadku błędnych danych
          alert('Invalid characters in the task field!');
          // Przywróć poprzedni tekst zadania
          task_input_el.value = oldTaskText;
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
  }

  /**
   * Metoda do usuwania zadania.
   * @method
   * @param {HTMLDivElement} taskEl - Element zadania.
   * @param {string} taskText - Treść zadania.
   */
  deleteTask(taskEl, taskText) 
  {
      // Usuń zadanie z tablicy zadań
      this.storedTasks = this.storedTasks.filter((task) => task !== taskText);
      localStorage.setItem('tasks', JSON.stringify(this.storedTasks));
    
      // Symuluj operację asynchroniczną (poczekaj 1 sekundę przed ponownym renderowaniem)
      setTimeout(() => 
      {
          this.renderTasks(); // Ponowne renderowanie zadań
      }, 1000);
  }
}

// Inicjalizacja zarządzania zadaniami po załadowaniu strony
window.addEventListener('load', () => {
  const form = document.querySelector("#new-task-form");
  const input = document.querySelector("#new-task-input");

  /**
   * Instancja klasy TaskManager.
   * @type {TaskManager}
   */
  const taskManager = new TaskManager();

  // Obsługa zdarzenia submit formularza
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    taskManager.addNewTask(input);
  });

  // Obsługa zdarzenia klawisza Enter w polu do wprowadzania zadania
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      taskManager.addNewTask(input);
    }
  });
});

document.addEventListener("DOMContentLoaded", function () 
{
  const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');
const carousel = document.querySelector('.image-carousel');

const images = 
[
  /**
   * Obiekt reprezentujący obraz w karuzeli.
   * @typedef {Object} ImageObject
   * @property {string} src - Ścieżka do obrazu.
   * @property {string} link - Adres URL, do którego prowadzi obraz po kliknięciu.
   */

  /**
   * Tablica obiektów reprezentujących obrazy w karuzeli.
   * @type {ImageObject[]}
   */
  { src: "images/linkedin.png", link: "https://www.linkedin.com/in/jakub-jakubowski-54076123b/" },
  { src: "images/github.png", link: "https://github.com/Rolaski" },
  { src: "images/youtube.png", link: "https://www.youtube.com/channel/UC4not1DNbD0wDPWUoArL7HQ" }
];

let currentIndex = 1; // Zdjęcie GitHub będzie widoczne na dziendobry

/**
 * Aktualizuje karuzelę na podstawie bieżącego indeksu.
 * @function
 * @param {string} [direction] - Kierunek przewijania karuzeli ('prev' lub 'next').
 */
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

//przycisk poprzednie zdjęcie
prevButton.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  updateCarousel('prev');
});

//przycisk następne zdjęcie
nextButton.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % images.length;
  updateCarousel('next');
});

updateCarousel(); // Inicjalizacja karuzeli
});
