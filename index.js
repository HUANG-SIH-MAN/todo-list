//定義目前狀態
const STATE = {
    start: 'start',
    addNewTodo: 'addNewTodo',
    todoList: 'todoList'
}

//DOM節點
const navbar = document.querySelector('.navbar')   //導覽列
const allTodoList = document.querySelector('#all-todo-list')  //左側清單列表
const mainBody = document.querySelector('#main-body')    //右側畫面主體

//MVC架構
const model = {
    state: STATE.start,  //目前狀態
    todoNow: 0,        //所選取的清單
    storeNewTodo (todoName) {   //儲存新的代辦清單
        const todoNameList = JSON.parse(localStorage.getItem('todoNameList')) || []
        const todo = {id: model.getTodoId(), todoName: todoName}
        todoNameList.push(todo)
        localStorage.setItem('todoNameList', JSON.stringify(todoNameList))
    },
    getTodoId () {
        let todoId = JSON.parse(localStorage.getItem('todoId')) || 0
        todoId++
        localStorage.setItem('todoId', todoId)
        return todoId
    },
    deleteTodo (todoId) {
        localStorage.removeItem(todoId)
        const todoNameList = JSON.parse(localStorage.getItem('todoNameList'))
        const index = todoNameList.findIndex(item => item.id === Number(todoId))
        todoNameList.splice(index, 1)
        localStorage.setItem('todoNameList', JSON.stringify(todoNameList))
    },
    storeRenameTodo (todoId, newName) {
        const todoNameList = JSON.parse(localStorage.getItem('todoNameList'))
        const index = todoNameList.findIndex(item => item.id === Number(todoId))
        todoNameList[index].todoName = newName
        localStorage.setItem('todoNameList', JSON.stringify(todoNameList))
    },
    storeItem (todoId,itemName) {
        const itemList = JSON.parse(localStorage.getItem(todoId)) || [{number: 0}]
        const number = itemList[0].number++
        const itemInf = {itemNumber: number, itemName: itemName, finish: false}
        itemList.push(itemInf)
        localStorage.setItem(todoId, JSON.stringify(itemList))
        return number
    },
    deleteItem (itemNumber) {
        const todoId = String(model.todoNow)
        const itemList = JSON.parse(localStorage.getItem(todoId))
        const index = itemList.findIndex(item => item.itemNumber === Number(itemNumber))
        itemList.splice(index, 1)
        localStorage.setItem(todoId, JSON.stringify(itemList))
    }
}

const view = {
    renderStart () {
        mainBody.innerHTML =`
            <div class="jumbotron jumbotron-fluid container-fluid">
                <div class="container">
                    <h1 class="display-4 ml-1 mb-5">快來新增屬於你的代辦清單吧!!</h1>
                    <p class="lead ml-3"><i class="far fa-hand-point-right mr-2"></i>點擊上方導覽列的新增todo，在下方輸入框輸入想新增的代辦清單名稱</p>
                    <div class="ml-3 mb-4"><img class="explain-img" src="addNewTodo.png" alt="圖片說明掛了我也沒辦法，靠想像力去操作網頁吧!!!!!"></div>
                    <hr/>
                    <p class="lead ml-3 mt-5"><i class="far fa-hand-point-right mr-2"></i>新增代辦清單成功後，點擊左側清單列表，即可進入代辦清單畫面!!</p>
                    <p class="lead ml-3 mt-3"><i class="far fa-star mr-2"></i>趕快在下方輸入框輸入，新增代辦清單的細節項目</p>
                    <div class="ml-3 mb-4"><img class="explain-img" src="todoList.png" alt="圖片說明掛了我也沒辦法，靠想像力去操作網頁吧!!!!!"></div>
                    <hr/>
                    <!--還有新增刪除細項的介紹-->
                </div>
            </div>
        `
    },
    renderAddNewTodo () {
        mainBody.innerHTML =`
            <h3>新增待辦清單</h3>
            <div class="input-group mb-3 mt-5">
                <input type="text" class="form-control" id="new-todo-input" placeholder="請輸入待辦清單名稱" aria-label="Recipient's username" aria-describedby="button-addon2">
                <div class="input-group-append ml-2">
                <button class="btn btn-success" type="button" id="add-new-todoList">新增</button>
                </div>
            </div>
        `
    },
    renderTodoList () {
        const todoNameList = JSON.parse(localStorage.getItem('todoNameList')) || []
        allTodoList.innerHTML = ''
        todoNameList.forEach(item => {
            allTodoList.innerHTML +=`
                <li><a class="nav-link" href="#" data-id=${item.id}>${item.todoName}</a></li>
            `
        });
    },
    alertNoInput () {
        sweetAlert("懶人!!", "給我輸入文字阿!!!","error")
    },
    renderTodo (todoId, todoname) {
        const todoContent = JSON.parse(localStorage.getItem(String(todoId))) || []

        //上方標題
        let bodyHTML = `
            <div class="container d-flex justify-content-between align-items-center">
                <h3 class="m-3">${todoname}</h3>
                <div class="btn-group btn-group-sm" role="group" aria-label="Basic example">
                    <button type="button" class="btn btn-success pr-3" id="rename-todo" data-id="${todoId}"><i class="fas fa-undo-alt mr-2"></i>重新命名</button>
                    <button type="button" class="btn btn-danger  pr-3" id="delete-todo" data-id="${todoId}"><i class="far fa-trash-alt mr-2"></i>刪除代辦清單</button>
                </div>
            </div>
            <hr/>
        `
        //輸入代辦細項區塊
        bodyHTML+= `
            <div class="m-5 d-flex flex-column">
                <header class="mb-3">
                <h4>My Todo</h4>
                <div class="form-inline">
                    <input type="text" placeholder="add item" id="new-item-input" class="form-control mr-2">
                    <button id="add-btn" class="btn btn-info add-new-item" data-id="${todoId}">Add</button>
                </div>
                </header>
            `
        //未完成代辦細項區塊
        bodyHTML+= `
                <div class="all-todo">
                <div class="unfinish">
                    <ul id="unfinish-todo" class="list-unstyled">
                    </ul>
                </div>
            `
        //未完成代辦細項區塊
        bodyHTML+= `
                <div class="finish mt-5">
                    <h4>Finish Todo</h4>
                    <ul id="finish-todo" class="list-unstyled">
                    </ul>
                </div> 
                </div>
            </div>
        `
        mainBody.innerHTML = bodyHTML
    },
    renderItem (itemNumber, itemName) {
        const unfinishTodo = document.querySelector('#unfinish-todo')
        const li = document.createElement('li')
        li.innerHTML = `
            <label for="todo" class="create" data-number="${itemNumber}">${itemName}</label>  
            <i class="fa fa-trash delete-item" data-number="${itemNumber}"></i>
            <i class="far fa-plus-square create-information" data-number="${itemNumber}"></i>
        `
        unfinishTodo.appendChild(li)
    }
}

const control = {
    currentState : STATE.start,
    createStart () {
        control.currentState = STATE.start
        mainBody.dataset.state = 'start'
        view.renderStart()
        view.renderTodoList()
    },
    showAddNewTodo () {
        control.currentState = STATE.addNewTodo
        mainBody.dataset.state = 'addNewTodo'
        view.renderAddNewTodo()
    },
    addNewTodo () {
        let newTodoInput = document.querySelector('#new-todo-input')
        const newTodoName = newTodoInput.value.trim()
        if (newTodoName.length === 0) {    //沒輸入文字
            view.alertNoInput()
            newTodoInput.value = ''
            return
        }
        model.storeNewTodo(newTodoName)
        newTodoInput.value = ''
        view.renderTodoList()
    },
    showTodo (todoId, todoname) {
        control.currentState = STATE.todoList
        mainBody.dataset.state = 'todoList'
        model.todoNow = todoId
        view.renderTodo(todoId, todoname)
    },
    deleteTodo (todoId) {
        swal({
            title: "確定刪除嗎?",
            text: "你將無法恢復刪除的代辦清單唷!!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "確定刪除！",
            closeOnConfirm: false,
            closeOnCancel: false
          },
          function(isConfirm){
            if (isConfirm) {
              swal("删除！", "待辦清單已被刪除!!。","success")
              model.deleteTodo(todoId) 
              control.createStart()
            } else {
              swal("取消！", "未刪除待辦清單","error")
            }
          })
    },
    renameTodo (todoId) {
        swal({
            title: "幫代辦清單重新命名！",
            text: "為它取一個厲害的新名字吧 !!!",
            type: "input",
            showCancelButton: true,
            closeOnConfirm: false,
            animation: "slide-from-top",
            inputPlaceholder: "輸入一段文字"
          },
          function(inputValue){
            if (inputValue === false) return false
            if (inputValue.trim() === "") {
              swal.showInputError("給我輸入文字唷!! 不許空白")
              return false
            }
            swal("非常好！", "你輸入了：" + inputValue,"success")
            model.storeRenameTodo (todoId, inputValue)
            view.renderTodoList()
            view.renderTodo(todoId, inputValue)
          })
    },
    addTodoItem (todoId) {
        const itemInput = document.querySelector('#new-item-input')
        if (itemInput.value.trim() === '') {
            view.alertNoInput()
            itemInput.value = ''
            return
        }
        const itemNumber = model.storeItem (todoId, itemInput.value)
        view.renderItem (itemNumber, itemInput.value)
        itemInput.value = ''
    },
    deleteItem (itemNumber, target) {
        swal({
            title: "確定刪除嗎？",
            text: "刪除的文件就像已經分手的女友，再也回不來！",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "確定刪除！",
            closeOnConfirm: false
          },
          function(){
            swal("删除！", "清單項目已被删除。", "success")
            target.parentElement.remove()
            model.deleteItem(itemNumber)
          });
    }
}

//一開始載入畫面
control.createStart()

//DOM事件(導覽列)
navbar.addEventListener('click', function addNewTodo (event) {
    if (event.target.matches('#add-new-todo')) {
        control.showAddNewTodo()
    }
})

//DOM事件(左側清單列)
allTodoList.addEventListener('click', function clickAllTodoList(event) {
    const target = event.target
    const id = target.dataset.id
    const name = target.innerText

    //確保沒按錯地方
    if (target.tagName !== 'A') return  

    //去除前一次的active樣式
    if (document.querySelector('.active') !== null){
        document.querySelector('.active').classList.remove('active') 
    }
    //新增本次的active樣式
    target.classList.add('active')
    
    //載入對應代辦清單畫面
    control.showTodo(id, name)
})

//DOM事件(右側畫面主體)
mainBody.addEventListener('click', function clickMainBody(event) {
    //初始資料常數
    const target = event.target
    const state = mainBody.dataset.state
    const id = target.dataset.id   
    const number = target.dataset.number

    //根據不同狀態決定不同DOM事件
    switch (state) {
        case 'addNewTodo':
            if (target.matches('#add-new-todoList')) {
                control.addNewTodo()
            }
            break
        case 'todoList':
            if (target.matches('#delete-todo')) {   //刪除代辦清單
                control.deleteTodo(id)
            } else if (target.matches('#rename-todo')) {   //重新命名代辦清單
                control.renameTodo(id)
            } else if (target.matches('.add-new-item')) {   //新增代辦清單項目
                control.addTodoItem(id)
            } else if (target.matches('.delete-item')) {    //刪除代辦清單項目
                control.deleteItem(number, target)
            } else if (target.matches('label')) {    //點擊代辦清單項目，(未完成 --→ 完成)，(完成 --→ 未完成)
               // control.finishItem(number, target)   //未完成
            }
            break
    }
})
