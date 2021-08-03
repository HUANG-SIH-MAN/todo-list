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

// Todo Delete and check
allTodo.addEventListener("click", function (event) {
  const target = event.target;
  const parent = target.parentElement;
  if (target.classList.contains("delete")) {  //按到刪除
    parent.remove();
  } else if (target.tagName === "LABEL") {   //按到代辦清單
    const grandfather = parent.parentElement
    if(grandfather.classList.contains('my-todo')) {   //按到未完成清單
       target.classList.add('checked')
       finshList.appendChild(parent)
    } else {                                          //按到完成清單
        list.appendChild(parent)
        target.classList.remove('checked')
    }  
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
    <label for="todo">${text}</label>
    <i class="delete fa fa-trash"></i>
  `;
  list.appendChild(newItem);
  input.value = ''
}


