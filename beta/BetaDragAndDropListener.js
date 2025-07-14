class BetaDragAndDropListener {
    constructor(taskCreator) {
        this.taskCreator = taskCreator;
        this.draggedElement = null;
        this.columns = document.querySelectorAll('.tasks-column');
    }

    initiate() {
        // Initialize all cards
        document.querySelectorAll('.task.card').forEach(card => this.makeDraggable(card));

        this.columns.forEach(column => {
            column.addEventListener('dragover', (e) => this.handleDragOver(e));
            column.addEventListener('drop', (e) => this.handleDrop(e));
            column.addEventListener('dragenter', (e) => this.handleDragEnter(e));
            column.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        });
    }

    makeDraggable(card) {
        card.addEventListener('dragstart', (e) => {
            this.draggedElement = card;
            card.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        });

        card.addEventListener('dragend', () => {
            this.draggedElement.classList.remove('dragging');
            this.draggedElement = null;
        });
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    handleDrop(e) {
        e.preventDefault();

        const column = e.currentTarget;
        const dropTargetUl = column.querySelector('ul');

        if (this.draggedElement && dropTargetUl) {
            dropTargetUl.appendChild(this.draggedElement);

            const id = this.draggedElement.getAttribute('data-id');
            const columnId = column.id.replace('tasks--', '');
            const tasks = this.taskCreator.getStoredTasks();
            const updatedTasks = tasks.map(t => {
                if (t.id === id) t.column = columnId;
                return t;
            });
            this.taskCreator.saveTasks(updatedTasks);
        }

        column.classList.remove('drop-hover');
    }

    handleDragEnter(e) {
        e.preventDefault();
        e.currentTarget.classList.add('drop-hover');
    }

    handleDragLeave(e) {
        e.currentTarget.classList.remove('drop-hover');
    }
}

export { BetaDragAndDropListener };
