//新增的DOM變數 (一開始載入需要)
const nav = document.querySelector('nav')
const mainBody = document.querySelector('#main-body')
const mainTodo = document.querySelector('#main-todo')
const todoAllList = document.querySelector('#todo-all-list')

//網頁載入，載入左側代辦清單
loadTodoList()

////新增的DOM事件//////////////////////////////////////////////////////////////////////////////////////////////////////
nav.addEventListener('click', function (event) {
  const target = event.target
  if (target.matches('#add-new-todo')) {
    event.preventDefault()
    mainTodo.dataset.state = 'addNewTodo'
    mainTodo.innerHTML = `
      <h3>新增待辦清單</h3>
      <div class="input-group mb-3 mt-5">
        <input type="text" class="form-control" id="new-todo-input" placeholder="請輸入待辦清單名稱" aria-label="Recipient's username" aria-describedby="button-addon2">
        <div class="input-group-append ml-2">
          <button class="btn btn-success" type="button" id="add-new-todoList">新增</button>
        </div>
      </div>
    `
  }
})

mainTodo.addEventListener('click', function (event) {
  const newTodoInput = document.querySelector('#new-todo-input')
  const target = event.target

  if (mainTodo.dataset.state === 'addNewTodo') {  //再新增代辦清單網頁的時候
    //點擊新增清單按鈕
    if (target.matches('#add-new-todoList')) {
      const inputValue = newTodoInput.value
      if (checktext (inputValue, newTodoInput)) {
        //將清單儲存在 local storage
        const listId = getListId()
        storeTodoList(inputValue, listId)

        //新增清單名稱在左側列中
        const li = document.createElement('li')
        li.innerHTML = `<a class="nav-link" href="#" data-id=${listId}>${inputValue}</a>`
        todoAllList.appendChild(li)

        //跳出視窗通知使用者新增成功
        swal("代辦清單新增成功！", "點擊左方清單列，可看到代辦清單目錄")
      }
    }
  } else if (mainTodo.dataset.state === 'todo') {  //在todo清單內
    //新增todo個項目
    if (target.matches('#add-btn')) {
      const input = document.querySelector("#new-todo")
      const inputValue = input.value
      const list = document.querySelector("#my-todo")
      if (checktext (inputValue, input)) {
        addItem(inputValue)

      }
    }
  }
  

  

})

todoAllList.addEventListener('click', event => {
  mainTodo.dataset.state = 'todo'
  //去除前一次的active樣式
  if (document.querySelector('.active') !== null){
    document.querySelector('.active').classList.remove('active') 
  }
  //新增本次的active樣式
  const target = event.target
  target.classList.add('active')

  //載入對應的清單畫面
  const ListId = target.dataset.id
  mainTodo.innerHTML = loadOldTodo(ListId)
})




////新人函式們////(複製舊有函式，改成新功能的樣式)/////////////////////////////////////////////////////////////////////////////////////////
//一開始載入左側清單列
function loadTodoList () {
  let todoList =  JSON.parse(localStorage.getItem('todoList')) || []
  todoList.forEach(item => {
    const li = document.createElement('li')
    li.innerHTML = `<a class="nav-link" href="#" data-id=${item.listId}>${item.name}</a>`
    todoAllList.appendChild(li)
  })

}

//取得已儲存todoList編號到多少
function getListId () {  
  let number =  localStorage.getItem('ListId') || 0
  number ++
  localStorage.setItem('ListId', number)
  return number
}

//將新增的代辦清單名字儲存
function storeTodoList (todoName, listId) {
  let todoList =  JSON.parse(localStorage.getItem('todoList')) || [] 
  let todoInformation = {} 
  todoInformation.name = todoName
  todoInformation.listId = listId
  todoInformation.information = false
  todoList.push(todoInformation)
  todoList = JSON.stringify(todoList)
  localStorage.setItem('todoList', todoList)
}

//載入待辦清單完整清單項目
function loadOldTodo (listId) {
  const todoList =  JSON.parse(localStorage.getItem('todoList'))
  let TodoinnerHTML = ''
  todoList.forEach(item => {
    if (item.listId === Number(listId)) {
      TodoinnerHTML += `
        <h3 class="m-3">${item.name}</h3>
        <hr/>
      `
      if(!item.information) {  //原本沒有儲存清單項目，給新的todo模板
        TodoinnerHTML += `
          <div class="m-5 d-flex flex-column">
            <header class="mb-3">
              <h4>My Todo</h4>
              <div class="form-inline">
                  <input type="text" placeholder="add item" id="new-todo" class="form-control mr-2">
                  <button id="add-btn" class="btn btn-info">Add</button>
              </div>
            </header>
            <div class="all-todo">
              <div class="unfinish-todo">
                <ul id="my-todo" class="my-todo list-unstyled">
                </ul>
              </div>
              <div class="finish mt-5">
                <h4>Finsh Todo</h4>
                <ul id="finish-todo" class="finish-todo list-unstyled">
                </ul>
              </div> 
            </div>
          </div>
        `
      } else {   //原本有儲存清單項目，載入它
        //先搞定新增項目功能
      }
    }
  })
  return TodoinnerHTML
}

//判斷是否輸入文字的函式
function checktext (text, input) {
  input.classList.remove('border-danger')
  input.placeholder = 'add item'
    const textLength = text.trim().length 
    if (textLength === 0) {
      input.classList.add('border-danger')
      input.value = null
      input.placeholder = 'Empty item'
        return false
    } else {
        input.value = ''
        return true
    }  
}

// 新增代辦清單函式
function addItem (text) {
  //const todonumber = getTodoNumber()
  list.appendChild(renderTodo(text, todonumber, 'create'))
  input.value = ''
  storeTodo(todonumber, text)  //將資料儲存進 local storage 
}

/////////////////////////////////////////////
//老人舊人函式們////////////////////////////////////////////
//載入todo畫面
function renderTodo (title, id, model, className) {
  const newItem = document.createElement("li")
  if (model === 'more') {
    newItem.innerHTML = `
      <label for="todo" class='${className}' data-id=${id}>${title}</label>  
      <i class="delete fa fa-trash" data-id=${id}></i>
      <i class="fas fa-info-circle more-information"></i>
    `
  } else if (model === 'create') {
    newItem.innerHTML = `
      <label for="todo" class='${className}' data-id=${id}>${title}</label>  
      <i class="delete fa fa-trash" data-id=${id}></i>
      <i class="far fa-plus-square create-information" data-id=${id}></i>
    `   
  }
  return newItem
}

//一開始載入網頁的函式
function loadTodo () {
  let storeInformation =  JSON.parse(localStorage.getItem('storeTodoInformation')) || [] 
  storeInformation.forEach(item => {
    if (!item.finsh) {
      if (item.information === undefined) {
        list.appendChild(renderTodo(item.title, item.id, 'create'))
      }else {
        list.appendChild(renderTodo(item.title, item.id, 'more'))
      }
    } else if (item.finsh) {
      if (item.information === undefined) {
        finishList.appendChild(renderTodo(item.title, item.id, 'create', 'checked'))
      }else {
        finishList.appendChild(renderTodo(item.title, item.id, 'more', 'checked'))
      }
    }
  })
}



// 新增代辦清單函式
function addItem1 (text) {
  const todonumber = getTodoNumber()
  list.appendChild(renderTodo(text, todonumber, 'create'))
  input.value = ''
  storeTodo(todonumber, text)  //將資料儲存進 local storage 
}

//彈出視窗警告是否刪除
function alertDelete (target, id) {
  const parent = target.parentElement
  swal({
    title: "確定刪除嗎？",
    text: "您將無法恢復代辦清單！",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#DD6B55",
    confirmButtonText: "確定刪除！",
    cancelButtonText: "取消刪除！",
    closeOnConfirm: false,
    closeOnCancel: false
  },
  function(isConfirm){
    if (isConfirm) {
      swal("删除！", "待辦事項已被刪除!!。","success")
      deleteStoreTodo(id)  //將資料從進 local storage 刪除
      parent.remove()
    } else {
      swal("取消！", "未刪除待辦事項","error")
    }
  });
}

//新增額外資訊  
function addTodoInformation (todoID, target) {
  const parent = target.parentElement
  swal({
    title: "輸入!",
    text: "輸入代辦清單詳細內容：",
    type: "input",
    showCancelButton: true,
    closeOnConfirm: false,
    animation: "slide-from-top",
    inputPlaceholder: "輸入一些话"
  },
  function(inputValue){
    if (inputValue === false) return false
      
    if (inputValue.trim().length === 0) {
      swal.showInputError("你需要輸入一些事項！");
      return false
    }
    swal("已儲存！", "你輸入了：" + inputValue,"success")
    const moreIcon = document.createElement('i')
    moreIcon.classList.add('fas', 'fa-info-circle', 'more-information')
    parent.appendChild(moreIcon)
    target.remove()
    storeInformation(todoID, inputValue)  //將額外資訊存在local storage
  });
}

//顯示出額外資訊
function showInformation (todoId) {
  let storeInformation =  JSON.parse(localStorage.getItem('storeTodoInformation'))
  storeInformation.forEach(item => {
    if (item.id === Number(todoId)) {
      swal(`${item.title}`, `${item.information}`)
    }
  });
}

//取得已儲存todo編號到多少 
function getTodoNumber () {  
  let number =  localStorage.getItem('todoNumber') || 0
  number ++
  localStorage.setItem('todoNumber', number)
  return number
}

//將todo資料儲存進 local storage (新增全新todo的時候)
function storeTodo (id, title) {
  let storeInformation =  JSON.parse(localStorage.getItem('storeTodoInformation')) || []
  let storetodo ={}
  storetodo.id = id
  storetodo.title = title
  storetodo.finsh = false
  storeInformation.push(storetodo)
  storeInformation = JSON.stringify(storeInformation)
  localStorage.setItem('storeTodoInformation', storeInformation)
}

//將已儲存 local storage 的todo資料刪除  
function deleteStoreTodo (todoId) { 
  let storeInformation =  JSON.parse(localStorage.getItem('storeTodoInformation'))
  const index = storeInformation.findIndex(item => item.id === Number(todoId))
  storeInformation.splice(index, 1)
  storeInformation = JSON.stringify(storeInformation)
  localStorage.setItem('storeTodoInformation', storeInformation)
}

//將額外資訊存在local storage
function storeInformation (todoId, information) {
  let storeInformation =  JSON.parse(localStorage.getItem('storeTodoInformation'))
  storeInformation.forEach(item => {
    if (item.id === Number(todoId)) {
      item.information = information
    }
  })
  storeInformation = JSON.stringify(storeInformation)
  localStorage.setItem('storeTodoInformation', storeInformation)
} 

//記錄todo是否已經完成
function storeFinsh (todoId, state) {
  let storeInformation =  JSON.parse(localStorage.getItem('storeTodoInformation'))  
  storeInformation.forEach(item => {
    if (item.id === Number(todoId)) {
      item.finsh = state
    }
  })
  storeInformation = JSON.stringify(storeInformation)
  localStorage.setItem('storeTodoInformation', storeInformation)
}
