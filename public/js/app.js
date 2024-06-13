document.writeln("<p>express static serve test</p>")

function renderTodoItem(todo) {
    const template = document.getElementById('todo-template').innerHTML;

    return template.replace(/{{id}}/g, todo.id).replace(/{{task}}/g, todo.task);
  }

  function openEditModal(id, task) {
    const editForm = document.getElementById('editTodoForm');
    editForm.setAttribute('data-id', id)
    document.getElementById('editTask').value = task;
    $('#editTodoModal').modal('show');
  }

  function deleteTodo(id) {
    fetch(`/api/todos/${id}`, {
      method: 'DELETE'
    })
    .then(() => {
      document.querySelector(`#todo-${id}`).remove();
    });
  }

  document.addEventListener('htmx:afterRequest', (event) => {
    if (event.detail.requestConfig.verb === 'post') {
      document.querySelector('#addTodoModal form').reset();
      $('#addTodoModal').modal('hide');

      const newTodo = JSON.parse(event.detail.xhr.responseText);
      const todoHtml = renderTodoItem(newTodo);

      document.getElementById('todo-list').insertAdjacentHTML('beforeend', todoHtml);

      event.preventDefault();
    } else if (event.detail.requestConfig.verb === 'put') {
      $('#editTodoModal').modal('hide');
    }
  });

  document.addEventListener('htmx:afterSwap', (event) => {
    if (event.target.id === 'todo-list') {
      const todos = JSON.parse(event.detail.xhr.responseText);

      if (Array.isArray(todos)) {
        let html = '';

        todos.forEach(todo => {
          html += renderTodoItem(todo);
        });

        event.target.innerHTML = html;
      } else {
        const todoHtml = renderTodoItem(todos);
        event.target.insertAdjacentHTML('beforeend', todoHtml);
      }
    }
  });

  document.getElementById('editTodoForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const id = event.target.getAttribute('data-id');
    const task = document.getElementById('editTask').value;

    fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ task })
    })
    .then(response => response.json())
    .then(data => {
      const todoHtml = renderTodoItem(data);
      document.querySelector(`#todo-${id}`).outerHTML = todoHtml;
      $('#editTodoModal').modal('hide');
    })
    .catch(error => console.error(error));
  });