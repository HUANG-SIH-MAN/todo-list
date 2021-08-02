// 初始變數
const list = document.querySelector("#my-todo");
const addBtn = document.querySelector("#add-btn");
const input = document.querySelector("#new-todo");
const finshList = document.querySelector('#finsh-todo')

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
input.addEventListener("keydown", function () {
  const inputValue = input.value ;
  if (event.which === 13 && checktext (inputValue)) {
    addItem(inputValue);
  }
});

// 待辦清單Delete and check
list.addEventListener("click", function (event) {
  const target = event.target;

  if (target.classList.contains("delete")) {
    const parentElement = target.parentElement;
    parentElement.remove();
  } else if (target.tagName === "LABEL") {
    const text = target.innerText
    addFinshItem(text)
    target.parentElement.remove();
  }
});

//編輯已完成代辦清單
finshList.addEventListener('click', event =>{
  const target = event.target;
  if (target.classList.contains("delete")) {
    let parentElement = target.parentElement;
    parentElement.remove();
  } else if (target.tagName === "LABEL") {
    let text = target.innerText
    addItem(text)
    target.parentElement.remove();
  }
})

//函式們////////////////////////////////////////////
//判斷是否輸入文字的函式 (被 trim() 取代)
function checktext (text) {
  input.classList.remove('border-danger')
  input.placeholder = 'add item'
    let allLength = text.length
    let wordLength = text.split(' ').length - 1 
    if (allLength === wordLength) {
      input.classList.add('border-danger')
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

//加入完成的代辦清單函式
function addFinshItem (text) {
  const newItem = document.createElement("li");
  newItem.innerHTML = `
    <label for="todo" class="checked">${text}</label>
    <i class="delete fa fa-trash"></i>
  `;
 finshList.appendChild(newItem);
}

