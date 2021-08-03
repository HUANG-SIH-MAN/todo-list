// 初始變數
const list = document.querySelector("#my-todo");
const addBtn = document.querySelector("#add-btn");
const input = document.querySelector("#new-todo");
const finshList = document.querySelector('#finsh-todo')
const allTodo = document.querySelector('.all-todo')

// 資料
let todos = [
  "Hit the gym",
  "Read a book",
  "Buy eggs",
  "Organize office",
  "Pay bills"
];

//存放todo額外資訊
let todoImformation = {}

for (let todo of todos) {
  addItem(todo);
}

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
  if (target.classList.contains("delete")) {  //按到刪除
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
        parent.remove();
      } else {
        swal("取消！", "未刪除待辦事項","error");
      }
    });
    
  } else if (target.tagName === "LABEL") {   //按到代辦清單
    const grandfather = parent.parentElement
    if(grandfather.classList.contains('my-todo')) {   //按到未完成清單
       target.classList.add('checked')
       finshList.appendChild(parent)
    } else {                                          //按到完成清單
        list.appendChild(parent)
        target.classList.remove('checked')
    }  
  } else if (target.classList.contains("create-information")) {  //按到額外資訊
    const todoID = target.previousElementSibling.previousElementSibling.dataset.id
    //第一次新增額外資訊
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
      todoImformation[todoID] = inputValue
      const moreIcon = document.createElement('i')
      moreIcon.classList.add('fas', 'fa-info-circle', 'more-information')
      parent.appendChild(moreIcon)
      target.remove()
    });
    
  } else if (target.classList.contains("more-information")){ //按到額外資訊
    const todo = target.previousElementSibling.previousElementSibling
    const todoID = todo.dataset.id
    const todoTitle =todo.innerText
    swal(`${todoTitle}`, `${todoImformation[todoID]}`)
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
  newItem.innerHTML = `
    <label for="todo" data-id=${text}>${text}</label>
    <i class="delete fa fa-trash"></i>
    <i class="far fa-plus-square create-information"></i>
  `;
  list.appendChild(newItem);
  input.value = ''
}


