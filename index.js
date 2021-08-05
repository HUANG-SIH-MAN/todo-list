// 初始變數
const list = document.querySelector("#my-todo");
const addBtn = document.querySelector("#add-btn");
const input = document.querySelector("#new-todo");
const finishList = document.querySelector('#finish-todo')
const allTodo = document.querySelector('.all-todo')

// 資料 //之後要刪除(改儲存到local storage)
let todos = [];

//存放todo額外資訊 
//之後要刪除(改儲存到local storage)
let todoInformation = {}

// Create (按按鈕輸入)
addBtn.addEventListener("click", function () {
  const inputValue = input.value;
  if (checktext (inputValue)) {
    addItem(inputValue);
  }
});

//按Enter輸入
input.addEventListener("keydown", function (event) {
  const inputValue = input.value ;
  if (event.which === 13 && checktext (inputValue)) {
    addItem(inputValue);
  }
});

// Todo Delete and check and more information
allTodo.addEventListener("click", function (event) {
  const target = event.target;
  const parent = target.parentElement;
  const todoID = target.dataset.id

  if (target.classList.contains("delete")) {  //按到刪除   (無法刪除已儲存資料)  
    alertDelete(target, todoID)
      
  } else if (target.tagName === "LABEL") {   //按到代辦清單
    const grandfather = parent.parentElement
    if(grandfather.classList.contains('my-todo')) {   //按到未完成清單
       target.classList.add('checked')
       finishList.appendChild(parent)
    } else {                                          //按到完成清單
      list.appendChild(parent)
      target.classList.remove('checked')
    }  
  } else if (target.classList.contains("create-information")) {  //新增額外資訊  (未儲存在local storage)
    addTodoInformation(todoID, target)
    
  } else if (target.classList.contains("more-information")){ //按到額外資訊  (未儲存在local storage)
    const todo = target.previousElementSibling
    const todoID = todo.dataset.id
    const todoTitle =todo.previousElementSibling.innerText
    swal(`${todoTitle}`, `${todoInformation[todoID]}`)
  }
});

//函式們////////////////////////////////////////////
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
  const newItem = document.createElement("li");
  const todonumber = getTodoNumber()
  newItem.innerHTML = `
    <label for="todo" data-id=${todonumber}>${text}</label>  
    <i class="delete fa fa-trash" data-id=${todonumber}></i>
    <i class="far fa-plus-square create-information" data-id=${todonumber}></i>
  `;
  list.appendChild(newItem);
  input.value = ''
  storeTodo(todonumber, text)

}

//彈出視窗警告是否刪除
function alertDelete (target, id) {
  const parent = target.parentElement;
  //console.log(id)  //測試
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
      swal("删除！", "待辦事項已被刪除!!。","success");
      deleteStoreTodo(id)
      parent.remove();
    } else {
      swal("取消！", "未刪除待辦事項","error");
    }
  });
}

//新增額外資訊  (需更改)
function addTodoInformation (todoID, target) {
  const parent = target.parentElement;
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
    if (inputValue === false) return false;
      
    if (inputValue.trim().length === 0) {
      swal.showInputError("你需要輸入一些事項！");
      return false
    }
    swal("已儲存！", "你輸入了：" + inputValue,"success");
    todoInformation[todoID] = inputValue  //之後要刪除(改儲存到local storage)
    const moreIcon = document.createElement('i')
    moreIcon.classList.add('fas', 'fa-info-circle', 'more-information')
    parent.appendChild(moreIcon)
    target.remove()
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
  storeInformation.push(`{id:${id}, title:'${title}'}`)
  storeInformation = JSON.stringify(storeInformation)
  localStorage.setItem('storeTodoInformation', storeInformation)
}

//將已儲存 local storage 的todo資料刪除  (失敗)
function deleteStoreTodo (todoId) {
  console.log(todoId)
  let storeInformation =  JSON.parse(localStorage.getItem('storeTodoInformation'))
  storeInformation.forEach((item, index, array) => {
    console.log(item.id)   //無法取得ID
  //   if (item.id.includes(id)) {
  //     array.splice(index, 1)
  //   }
  });
  // console.log(storeInformation)
  // storeInformation = JSON.stringify(storeInformation)
  // localStorage.setItem('storeTodoInformation', storeInformation)
}