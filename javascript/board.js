function openAddTask() {
    let container = document.getElementById('add-task-popup');
    container.classList.remove('d-none');
    container.innerHTML = `
    <div class="margin-left-top">
    <h1>Add Task</h1>
    <div class="add-task-section">

        <div class="add-task-titel-container">
            <p>Titel</p>
            <input class="margin-buttom" type="text" placeholder="Enter a title">
            <p>Description</p>
            <textarea class="margin-buttom" name="" id="" placeholder="Enter a Description"></textarea>
            <p>Assigned to</p>
            <select name="" id="">
                <option value="volvo">Volvo</option>
                <option value="audi" selected>Select contacts to assign</option>
            </select>
        </div>

        <div class="add-task-between-line"></div>

        <div class="add-task-date-container">
            <p>Due date</p>
            <input class="margin-buttom" type="date">
            <p>Prio</p>
            <div class="margin-buttom add-task-prio">
                <div class="prio-selection-urgent">
                    <span>Urgent</span> 
                    <img class="prio-icons" src="./assets/img/arrowsTop.svg">
                </div>
                <div class="prio-selection-medium">
                    <span>Medium</span> 
                    <img class="prio-icons" src="./assets/img/result.svg">
                </div>
                <div class="prio-selection-low">
                    <span>Low</span> 
                    <img class="prio-icons" src="./assets/img/arrowsButtom.svg">
                </div>
            </div>
            <p>Category</p>
            <select class="margin-buttom" name="" id="">
                <option class="task-options" value="volvo">Technical Task</option>
                <option class="task-options" value="saab">User Story</option>
                <option class="task-options" value="audi" selected>Select contacts to assign</option>
            </select>
            <p>Subtasks</p>
            <input type="text" name="" id="">
        </div>

    </div>`;
}