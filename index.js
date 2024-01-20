import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
// import { initializeApp } from "/firebase/app";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const addToCartBtn = document.getElementById("add-button");
const inputField = document.getElementById("input-field");
const shoppingListEl = document.getElementById("shopping-list");

const appSettings = {
  databaseURL:
    "https://grocery-app-1de47-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const databse = getDatabase(app);
const groceriesInDB = ref(databse, "groceries");

onValue(groceriesInDB, function (snapshot) {
  if (snapshot.exists()) {
    let groceriesArray = Object.entries(snapshot.val());
    clearInnerHTML();
    for (let i = 0; i < groceriesArray.length; i++) {
      // let currentItem = groceriesArray[i][1];
      let currentItem = groceriesArray[i];
      let currentItemID = currentItem[0];
      let currentItemValue = currentItem[1];
      addItemToShoppingList(currentItem);
    }
  } else {
    shoppingListEl.innerHTML = `<p>There are no items...yet</p>`;
  }
});

inputField.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    let inputValue = inputField.value;
    clearInputField(inputField);
    push(groceriesInDB, inputValue);
    console.log(`${inputValue} added to database`);
  }
});

addToCartBtn.addEventListener("click", function () {
  let inputValue = inputField.value;
  clearInputField(inputField);
  push(groceriesInDB, inputValue);
  console.log(`${inputValue} added to database`);
});

function clearInputField(inputField) {
  inputField.value = "";
}

function addItemToShoppingList(item) {
  let itemID = item[0];
  let itemValue = item[1];
  let newEl = document.createElement("li");
  newEl.textContent = itemValue;
  newEl.addEventListener("dblclick", function () {
    let exactLocationOfItemInDB = ref(databse, `groceries/${itemID}`);
    remove(exactLocationOfItemInDB);
  });
  shoppingListEl.append(newEl);
}

function clearInnerHTML() {
  shoppingListEl.innerHTML = " ";
}
