class Task {
    constructor({ id, taskName, category, priority, description, date, column }) {
        this.id = id || `task_${Date.now()}`;
        this.taskName = taskName;
        this.category = category;
        this.priority = priority;
        this.description = description;
        this.date = date;
        this.column = column || 'pending';
    }

    static fromCardElement(cardElement) {
        const id = cardElement.getAttribute('data-id');
        const taskName = cardElement.querySelector('.task-name')?.textContent || '';
        const category = cardElement.querySelector('.tag')?.textContent || '';
        const priority = cardElement.querySelector('.priority')?.textContent || '';
        const description = cardElement.querySelector('.card__description')?.textContent || '';
        const date = cardElement.querySelector('.card__attributes .date .date')?.textContent || '';
        const column = cardElement.closest('[id^="tasks--"]')?.id.replace('tasks--', '') || 'pending';

        return new Task({ id, taskName, category, priority, description, date, column });
    }
}

export { Task };
