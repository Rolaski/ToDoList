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
          renderTasks(); // Ponowne renderowanie zadań
        }
  
        // Ustaw atrybut readonly po zakończeniu edycji
        task_input_el.setAttribute('readonly', 'readonly');
  
        // Zmień tekst przycisku z powrotem na "Edytuj"
        task_edit_el.innerText = 'Edytuj';
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
      renderTasks(); // Ponowne renderowanie zadań
    };
  
    // Renderuj zadania podczas ładowania strony
    renderTasks();
  
    // Słuchacz zdarzeń dla formularza
    form.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const task = input.value;
  
      if (task.trim() !== '') {
        // Dodaj nowe zadanie do tablicy zadań
        storedTasks = [...storedTasks, task];
        localStorage.setItem('tasks', JSON.stringify(storedTasks));
        renderTasks(); // Ponowne renderowanie zadań
  
        input.value = '';
      }
    });
  });
  