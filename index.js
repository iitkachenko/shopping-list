import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://shopping-cart-app-ab48a-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")
const shoppingListArr = [];

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value.trim();
    
    if (inputValue && !isInShoppingListArr(inputValue)) {
        push(shoppingListInDB, inputValue);
    }
    
    clearInputFieldEl()
})

onValue(shoppingListInDB, function(snapshot) {
    if (!snapshot.exists()) {
        shoppingListEl.innerHTML = "No items here... yet";
        return;
    }
    
    let itemsArray = Object.entries(snapshot.val())

    clearShoppingListEl();
    clearShoppingLIstArr();
    
    for (let i = 0; i < itemsArray.length; i++) {
        let currentItem = itemsArray[i]
        let currentItemID = currentItem[0]
        let currentItemValue = currentItem[1]
        
        appendItemToShoppingListEl(currentItem)
    }    

})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    
    newEl.textContent = itemValue;
    addItemToShoppingListArr(itemValue);
    
    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        
        remove(exactLocationOfItemInDB);
        removeItemFromShoppingListArr(itemValue);
    })
    
    shoppingListEl.append(newEl);
}

function addItemToShoppingListArr(item) {
    shoppingListArr.push(item);
}

function removeItemFromShoppingListArr(item) {
    shoppingListArr.filter(arrItem => arrItem != item);
}

function clearShoppingLIstArr() {
    shoppingListArr.length = 0;
}

function isInShoppingListArr(item) {
   return  shoppingListArr.includes(item);
}

    console.log(shoppingListArr);
