import { Task } from '../shared/objects/Task.js';
import { BetaTaskColumnAddButtonListener } from './BetaTaskColumnAddButtonListener.js';
import { BetaDragAndDropListener } from "./BetaDragAndDropListener.js";

class BetaTaskCreator {
    constructor() {
        this.generalNewTaskBtn = document.querySelector('#new-task-btn');
        this.tabLabels = document.querySelectorAll('#tasks-tabs .label');
        this.dragHandler = new BetaDragAndDropListener(this);
    }

    getStoredTasks() {
        return JSON.parse(localStorage.getItem('tasks') || '[]');
    }

    saveTasks(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    newTaskPopupTemplate(buttonText = "Add task") {
        return `
            <div id="add-task-popup">
                <div id="dismiss-button" role="button">
                    <span class="material-icons close">close</span>
                    <span style="color: white">dismiss</span>
                </div>

                <h3>${buttonText === "Add task" ? "Add Task" : "Edit Task"}</h3>

                <form>
                    <div id="left-column">
                        <input type="text" name="task name" id="task-name" placeholder="Task name" required>
                        <input type="text" name="category" id="category" placeholder="Select category">
                        <select name="priority" id="priority-selector" required>
                            <option value="">Priority</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                        <textarea name="description" id="description" placeholder="Add description"></textarea>
                    </div>

                    <div id="right-column">
                        <input type="date" name="date" id="date-selector">
                        <button type="submit">${buttonText}</button>
                    </div>
                </form>
            </div>
        `;
    }

    popup(buttonText = "Add task", taskElement = null, focusInput = false, targetUl = null) {
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: '100',
            display: 'flex', justifyContent: 'center', alignItems: 'center'
        });

        overlay.innerHTML = this.newTaskPopupTemplate(buttonText);
        document.body.appendChild(overlay);

        const dismissBtn = overlay.querySelector('#dismiss-button');
        dismissBtn.addEventListener('click', () => overlay.remove());

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });

        const form = overlay.querySelector('form');
        const submitBtn = form.querySelector('[type="submit"]');
        const taskInput = form.querySelector('[name="task name"]');

        let taskObj = null;

        if (taskElement) {
            taskObj = Task.fromCardElement(taskElement);
            form.querySelector('[name="task name"]').value = taskObj.taskName;
            form.querySelector('[name="category"]').value = taskObj.category;
            form.querySelector('[name="priority"]').value = taskObj.priority;
            form.querySelector('[name="description"]').value = taskObj.description;
            form.querySelector('[name="date"]').value = taskObj.date;
            if (focusInput) taskInput.focus();
        }

        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (!form.checkValidity()) return form.reportValidity();

            const taskName = form.querySelector('[name="task name"]').value;
            const category = form.querySelector('[name="category"]').value;
            const priority = form.querySelector('[name="priority"]').value;
            const description = form.querySelector('[name="description"]').value;
            const date = form.querySelector('[name="date"]').value;

            let column = 'pending';
            if (targetUl) {
                column = targetUl.closest('[id^="tasks--"]').id.replace('tasks--', '');
            } else if (window.matchMedia('(max-width: 1024px)').matches) {
                const activeTab = document.querySelector('.tasks-column.active')?.id || 'tasks--pending';
                column = activeTab.replace('tasks--', '');
            }

            if (buttonText === "Add task") {
                taskObj = new Task({ taskName, category, priority, description, date, column });
                const tasks = this.getStoredTasks();
                tasks.push(taskObj);
                this.saveTasks(tasks);
                this.createNewTaskCard(taskObj);
            } else {
                const id = taskElement.getAttribute('data-id');
                taskObj = new Task({ id, taskName, category, priority, description, date, column });
                const tasks = this.getStoredTasks().map(t => t.id === id ? taskObj : t);
                this.saveTasks(tasks);
                this.updateTaskCard(taskElement, taskObj);
            }

            overlay.remove();
        });
    }

    createNewTaskCard(task) {
        const { id, taskName, category, priority, description, date, column } = task;

        const newTaskCard = document.createElement('li');
        newTaskCard.classList.add('task', 'card');
        newTaskCard.setAttribute('draggable', 'true');
        newTaskCard.setAttribute('data-id', id);

        newTaskCard.innerHTML = `
            <div class="card__title">
                <h6 class="task-name">${taskName}</h6>
                <span class="priority">${priority}</span>
                <div class="task__options">
                    <span class="material-icons edit">edit_square</span>
                    <span class="material-icons delete">delete</span>
                </div>
            </div>
            <p class="card__description">${description}</p>
            <div class="card__attributes">
                <span class="tag">${category}</span>
                <div class="date">
                    <span class="material-icons calendar_day">calendar_today</span>
                    <span class="date">${date}</span>
                </div>
            </div>
        `;

        if (!date) {
            newTaskCard.querySelector('.calendar_day')?.remove();
            newTaskCard.querySelector('.card__attributes .date .date')?.remove();
        }

        const columnSelector = `#tasks--${column} ul`;
        document.querySelector(columnSelector)?.appendChild(newTaskCard);
        this.attachCardListeners(newTaskCard);

        this.dragHandler.makeDraggable(newTaskCard);
    }

    updateTaskCard(card, task) {
        const { taskName, category, priority, description, date } = task;

        card.querySelector('.task-name').textContent = taskName;
        card.querySelector('.priority').textContent = priority;
        card.querySelector('.card__description').textContent = description;
        card.querySelector('.tag').textContent = category;

        const dateContainer = card.querySelector('.card__attributes .date');
        if (date) {
            if (!dateContainer.querySelector('.calendar_day')) {
                const icon = document.createElement('span');
                icon.classList.add('material-icons', 'calendar_day');
                icon.textContent = 'calendar_today';
                dateContainer.insertBefore(icon, dateContainer.firstChild);
            }
            if (!dateContainer.querySelector('.date')) {
                const span = document.createElement('span');
                span.classList.add('date');
                dateContainer.appendChild(span);
            }
            dateContainer.querySelector('.date').textContent = date;
        } else {
            card.querySelector('.calendar_day')?.remove();
            card.querySelector('.card__attributes .date .date')?.remove();
        }
    }

    attachCardListeners(cardElement) {
        cardElement.querySelector('.delete')?.addEventListener('click', () => {
            const confirmDelete = confirm("Are you sure you want to delete this task?");
            if (!confirmDelete) return;
            const id = cardElement.getAttribute('data-id');
            const tasks = this.getStoredTasks().filter(task => task.id !== id);
            this.saveTasks(tasks);
            cardElement.remove();
        });

        cardElement.querySelector('.edit')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.popup("Update task", cardElement, true);
        });

        cardElement.addEventListener('click', (e) => {
            if (!e.target.closest('.edit') && !e.target.closest('.delete')) {
                this.popup("Update task", cardElement, false);
            }
        });
    }

    loadTasks() {
        const tasks = this.getStoredTasks();
        tasks.forEach(task => this.createNewTaskCard(task));
    }

    restoreActiveTab() {
        const savedTabId = localStorage.getItem('activeTabId');
        if (savedTabId) {
            const labelToClick = document.querySelector(`#tasks--${savedTabId}__label`);
            if (labelToClick) labelToClick.click();
        }
    }

    setupTabPersistence() {
        this.tabLabels.forEach(label => {
            label.addEventListener('click', () => {
                const col = label.getAttribute('data-link');
                if (col) localStorage.setItem('activeTabId', col);
            });
        });
    }

    initiate() {
        this.loadTasks();
        this.setupTabPersistence();
        this.restoreActiveTab();
        new BetaTaskColumnAddButtonListener(this).attach();
        this.generalNewTaskBtn.addEventListener('click', () => this.popup());

        this.dragHandler.initiate();
    }
}

export { BetaTaskCreator };
