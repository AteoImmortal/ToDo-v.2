function ToDoList(){
    let todos = [
        {
            id: '1',
            task: 'Выучить js',
            isDone: false,
            isEdit: false,
        },
        {
            id: '2',
            task: 'Выучить css',
            isDone: false,
            isEdit: false,
        }
    ];
    this.init = (className) => {
        const perentContainer = document.querySelector(`.${className}`)
        if(!perentContainer){
            console.log('Ошибка в указании селектора класса');
            return
        }

        const elementHTMLToDo = creatHTMLToDo();
        perentContainer.appendChild(elementHTMLToDo);
        addToDoInputEvent();
        addDeleteAllTodosEvent();
        showToDoTask();
        addCompletedAllTasks();

        
    }

    const addDeleteAllTodosEvent = () => {
        const deleteAllBtn = document.querySelector('.delete__all__btn');
        deleteAllBtn.addEventListener('click', () => {
            if(todos.length !== 0){
                todos = [];
                showToDoTask();
            }
            return
        })
    }

    const addCompletedAllTasks = () => {
        const completeAllTasks = document.querySelector('.completed__all__tasks');
        completeAllTasks.addEventListener('click', () => {
            todos = todos.map((todo) => {
                todo.isDone = !todo.isDone
                console.log(todo)
                showToDoTask();
                return todo;
            });
        })
    }


    const addToDoInputEvent = () => {
        const toDoInput = document.querySelector('.todo__input');

        toDoInput.addEventListener('keydown', (event) => {
            if(event.keyCode === 13){
                todos.push(
                    {
                        id: `${new Date().getTime()}`,
                        task: event.target.value,
                        isDone: false,
                        isEdit: false,
                    }
                );
                event.target.value = '';
                showToDoTask()
            }
        })
    }

    const creatHTMLToDo = () => {
        const todoElement = document.createElement('div');
        todoElement.classList.add('todo');
        todoElement.innerHTML = `
            <div class='todo__wrapper'>
                <header class='todo__header'>
                    <h2>Список дел</h2>
                    <input type='text' class='todo__input' placeholder='Введите задачу'>
                    <button class='delete__all__btn'>Очистить список дел</button>
                    <button class='completed__all__tasks'>Выполнить всё</button>
                </header>
                <div class='todo__body'></div>
            </div>
        `
        return todoElement
    }

    const showToDoTask = () => {
        const todoBody = document.querySelector('.todo__body');
        if(todos.length === 0){
            todoBody.innerHTML = `<h2 class='empty__result'>Список дел пуст</h2>`
            return
        }
        const ul = document.createElement('ul');
        ul.classList.add('todo__tasks');

        let listToDo = '';
        const checkEdit = checkEditTodoHelper();
        todos.forEach(({id, task, isDone, isEdit})=> {
            listToDo += `   <li class='todo__task${isDone ? ' isDone': ''}'>
                                ${!isEdit ? `
                                <input type='checkbox' ${isDone ? 'checked': ''} id='${id}' class='todo_checkbox'>
                                <p class="todo__task__content">${task}</p>
                                <button class='todo__delete__btn btn' ${!isDone ? 'disabled': ''} data-delete='${id}'>Удалить</button>
                                <button class='todo__edit__btn btn' ${checkEdit ? 'disabled' : ''} data-edit='${id}'>Редактировать</button>`
                                :`
                                <input type='text' value='${task}' class='todo__edit__input'>
                                <button class='todo__edit__cancel btn' data-edit-cancel='${id}'>Отменить</button>
                                <button class='todo__edit__save btn'data-edit-save='${id}'>Сохранить</button>
                                `}
                                
                            </li>`
        })

        ul.innerHTML = listToDo;
        todoBody.innerHTML = '';
        todoBody.appendChild(ul);
        addCheckBoxsEvent();
        addDeleteTodoEvent();
        getEditTodoEvent()
        if(checkEdit){
            addEditCancelTodo();
            addEditSaveTodo();
        }
    }
    
    const getEditTodoEvent = () => {
        const editButtons = document.querySelectorAll('.todo__edit__btn');
        editButtons.forEach((editButton)=>{
            editButton.addEventListener('click', (event)=>{
                const btn = event.target;
                const todoId = btn.dataset.edit;
                todos = todos.map((todo) => {
                    if(todo.id === todoId){
                        todo.isEdit = true;
                    }
                    return todo;
                })
                showToDoTask();
            })
        })
    }

    const checkEditTodoHelper = () => {
        return todos.some(({isEdit})=> isEdit)
    }

    const addEditSaveTodo = () => {
        const saveButton = document.querySelector('.todo__edit__save');
        saveButton.addEventListener('click', (event)=>{
            const btn = event.target;
            const todoId = btn.dataset.editSave;
            const newTaskValue = document.querySelector('.todo__edit__input').value;
            todos = todos.map((todo)=> ({
                    ...todo,
                    ...(todo.id === todoId ? {
                        isEdit: false,
                        task: newTaskValue,
                    } : undefined)
                }
            ))
            showToDoTask()
        })
    }

    const addEditCancelTodo = () => {
        const cancelButton = document.querySelector('.todo__edit__cancel');
        cancelButton.addEventListener('click', (event)=>{
            const btn = event.target;
            const todoId = btn.dataset.editCancel;
            todos = todos.map((todo) => ({
                    ...todo,
                    ...(todo.id === todoId ? {isEdit: false}: undefined)
                })
            )
            showToDoTask()
        })
    }

    const addDeleteTodoEvent = () => {
        const deleteButtons = document.querySelectorAll('.todo__delete__btn');
        deleteButtons.forEach((deleteButton)=>{
            deleteButton.addEventListener('click', (event)=>{
                const btn = event.target;
                const todoId = btn.dataset.delete;
                todos = todos.filter((todo)=> todo.id !== todoId)
                showToDoTask();
            })
        })
    }

    const addCheckBoxsEvent = () => {
        const checkBoxs = document.querySelectorAll('.todo_checkbox');
        checkBoxs.forEach((checkbox) =>{
            checkbox.addEventListener('change', (event)=>{
                const todoId = event.target.id;
                chengeStatusTodo(todoId)
            })
        })
    }

    const chengeStatusTodo = (todoId) => {
        todos = todos.map((todo)=>{
            if(todo.id === todoId){
                todo.isDone = !todo.isDone;
            }
            return todo;
        })
        showToDoTask()
    }
}

window.addEventListener('load', () => {
    const todo = new ToDoList();
    todo.init('app');
})
