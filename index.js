// 初始變數
const list = document.querySelector("#my-todo")
const addBtn = document.querySelector("#add-btn")
const input = document.querySelector("#new-todo")
const finishList = document.querySelector('#finish-todo')
const allTodo = document.querySelector('.all-todo')

//開啟網頁後，載入之前儲存過的清單
loadTodo()

// Create (按按鈕輸入)
addBtn.addEventListener("click", function () {
  const inputValue = input.value
  if (checktext (inputValue)) {
    addItem(inputValue)
  }
})

//按Enter輸入
input.addEventListener("keydown", function (event) {
  const inputValue = input.value 
  if (event.which === 13 && checktext (inputValue)) {
    addItem(inputValue)
  }
})

// Todo Delete and check and more information
allTodo.addEventListener("click", function (event) {
  const target = event.target
  const parent = target.parentElement
  const todoID = target.dataset.id

  if (target.classList.contains("delete")) {  //按到刪除     
    alertDelete(target, todoID)
      
  } else if (target.tagName === "LABEL") {   //按到代辦清單
    const grandfather = parent.parentElement
    if(grandfather.classList.contains('my-todo')) {   //按到未完成清單
      finishList.appendChild(parent)
      target.classList.add('checked')
      storeFinsh (todoID)  //todo變更成已完成
    } else {                                          //按到完成清單
      list.appendChild(parent)
      target.classList.remove('checked')
      storeFinsh (todoID)  //todo變更成未完成
    }  
  } else if (target.classList.contains("create-information")) {  //新增額外資訊  
    addTodoInformation(todoID, target)
    
  } else if (target.classList.contains("more-information")){ //按到額外資訊 
    const todoId = target.previousElementSibling.dataset.id
    showInformation (todoId)
  }
})

//函式們////////////////////////////////////////////
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
    if (item.finsh === 'No') {
      if (item.information === undefined) {
        list.appendChild(renderTodo(item.title, item.id, 'create'))
      }else {
        list.appendChild(renderTodo(item.title, item.id, 'more'))
      }
    } else if (item.finsh === 'Yes') {
      if (item.information === undefined) {
        finishList.appendChild(renderTodo(item.title, item.id, 'create', 'checked'))
      }else {
        finishList.appendChild(renderTodo(item.title, item.id, 'more', 'checked'))
      }
    }
  })
}

//判斷是否輸入文字的函式
function checktext (text) {
  input.classList.remove('border-danger')
  input.placeholder = 'add item'
    const textLength = text.trim().length 
    if (textLength === 0) {
      input.classList.add('border-danger')
      input.value = null
      input.placeholder = 'Empty item'
        return false
    } else {
        return true
    }  
}

// 新增代辦清單函式
function addItem (text) {
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
  storetodo.finsh = 'No'
  storeInformation.push(storetodo)
  storeInformation = JSON.stringify(storeInformation)
  localStorage.setItem('storeTodoInformation', storeInformation)
}

//將已儲存 local storage 的todo資料刪除  
function deleteStoreTodo (todoId) { 
  let storeInformation =  JSON.parse(localStorage.getItem('storeTodoInformation'))  
  storeInformation.forEach((item, index, array) => {
    if (item.id === Number(todoId)) {
      array.splice(index, 1)
    }
  });
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
function storeFinsh (todoId) {
  let storeInformation =  JSON.parse(localStorage.getItem('storeTodoInformation'))  
  storeInformation.forEach(item => {
    if (item.id === Number(todoId)) {
      if (item.finsh === 'No') {
        item.finsh = 'Yes'
      } else {
        item.finsh = 'No'
      }
    }
  })
  storeInformation = JSON.stringify(storeInformation)
  localStorage.setItem('storeTodoInformation', storeInformation)
}
