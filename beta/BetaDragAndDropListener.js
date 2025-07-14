class BetaDragAndDropListener {
    constructor() {
        this.draggedElement = null;
        this.columns = document.querySelectorAll('.tasks-column');
    }

    initiate() {
        // Make all existing task cards draggable
        document.querySelectorAll('.task.card').forEach(card => {
            card.addEventListener('dragstart', (e) => this.handleDragStart(e));
            card.addEventListener('dragend', (e) => this.handleDragEnd(e));
        });

        this.columns.forEach(column => {
            column.addEventListener('dragover', (e) => this.handleDragOver(e));
            column.addEventListener('drop', (e) => this.handleDrop(e));
            column.addEventListener('dragenter', (e) => this.handleDragEnter(e));
            column.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        });
    }

    handleDragStart(e) {
        this.draggedElement = e.target;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.outerHTML);
        e.target.classList.add('dragging');
    }

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
        this.draggedElement = null;
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    handleDrop(e) {
        e.preventDefault();

        const column = e.currentTarget;
        const dropTargetUl = column.querySelector('ul');

        if (this.draggedElement && dropTargetUl && dropTargetUl !== this.draggedElement.parentNode) {
            dropTargetUl.appendChild(this.draggedElement);
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