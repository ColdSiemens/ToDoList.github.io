let allCards = [];
let titleInput =
document.getElementById("title-input"),
  cardsGrid = document.getElementById("cards-grid"),
  createMenu = document.getElementById("create-menu"),
  descriptionInput = document.getElementById("description-input"),
  priorityInput = document.getElementById("priority-input"),
  inputSearch = document.querySelector(".title-search__bar"),
  menu = document.getElementById("menu"),
  searchPriority = document.getElementById("priority-search"),
  searchStatus = document.getElementById("status-search"),
  titleSearch = document.getElementById("title-search");

createMenu.addEventListener("click", createMenuButtons);
menu.addEventListener("click", menuButtons);
searchPriority.addEventListener("change", searchAll);
searchStatus.addEventListener("change", searchAll);
titleSearch.addEventListener("input", searchAll);
window.addEventListener("DOMContentLoaded", handlePageLoad);
class Card {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.priority = data.priority;
    this.isDone = data.isDone;
  }
  saveToStorage(allCards) {
    localStorage.setItem("globalStorage", JSON.stringify(allCards));
  }
  deleteFromStorage(allCards) {
    let listId = this.id;
    let index = allCards.findIndex(function(list) {
      return parseInt(list.id) === listId;
    });
    allCards.splice(index, 1);
    this.saveToStorage(allCards);
  }
}
function createMenuButtons(e) {
  e.preventDefault();
  if (e.target.id === "save-button") {
    addCard(e);
  } else if (e.target.id === "cancel-button") {
    toggleCreateMenu();
  } else if (e.target.id === "title-input") {
    titleInput.setAttribute("placeholder", "Your title..");
    titleInput.classList.remove("alert");
  }
}

function menuButtons(e) {
  e.preventDefault();
  if (e.target.id === "button-create") {
    toggleCreateMenu();
  }
}

function toggleCreateMenu() {
  titleInput.setAttribute("placeholder", "Your title..");
  titleInput.classList.remove("alert");
  createMenu.classList.toggle("hide");
}

function retrieveId(e, location) {
  var taskId = e.target.closest(location).getAttribute("id");
  return taskId;
}
function findIndex(taskId, globalArray) {
  return globalArray.findIndex(item => item.id === taskId);
}

function searchAll() {
  let searchCards,
    status = searchStatus.value,
    priority = searchPriority.value,
    priorityCards,
    statusCards;
  if (status === "All" && priority === "All") {
    searchCards = allCards.filter(item =>
      item.title.toLowerCase().includes(inputSearch.value.toLowerCase())
    );
  } else if (status === "All" && priority !== "All") {
    priorityCards = allCards.filter(item => item.priority === priority);
    searchCards = priorityCards.filter(item =>
      item.title.toLowerCase().includes(inputSearch.value.toLowerCase())
    );
  } else if (status === "open" && priority !== "All") {
    statusCards = allCards.filter(item => item.isDone === false);
    priorityCards = statusCards.filter(item => item.priority === priority);
    searchCards = priorityCards.filter(item =>
      item.title.toLowerCase().includes(inputSearch.value.toLowerCase())
    );
  } else if (status === "done" && priority !== "All") {
    statusCards = allCards.filter(item => item.isDone === true);
    priorityCards = statusCards.filter(item => item.priority === priority);
    searchCards = priorityCards.filter(item =>
      item.title.toLowerCase().includes(inputSearch.value.toLowerCase())
    );
  } else {
    if (status === "open") {
      statusCards = allCards.filter(item => item.isDone === false);
    } else {
      statusCards = allCards.filter(item => item.isDone === true);
    }
    searchCards = statusCards.filter(item =>
      item.title.toLowerCase().includes(inputSearch.value.toLowerCase())
    );
  }
  cardsGrid.innerHTML = "";
  for (let i = 0; i < searchCards.length; i++) {
    createCard(searchCards[i]);
  }
}

// For display cards in DOM
function createCard(card) {
  let cardBlock = `<article id='${card.id}'
  ${card.isDone ? 'class="card__wrapper"' : "class='card__wrapper open'"} >
  <i class="far fa-check-circle done"></i>
  <i class="far fa-circle undone"></i>
  <div class='card__text'>
    <div id='${"card__title" + card.id}' class='card__title'>
    ${card.title}</div>
    <input value='${card.title}' maxlength="30"
    id="${"edited-title" + card.id}" class='edited-title hide'/>
    <div id='${"card__description" + card.id}' class='card__description'>
    ${card.description}</div>
    <textarea value='${card.description}' maxlength="150" id="${"edited-description" + card.id}" class='edited-description hide'>${card.description}</textarea>
  </div>
  <div class='card__down'>
    <span id='${"card__priority" + card.id}' class='card__priority'>
    ${card.priority}</span>
    <div id='${"edit-priority" + card.id}' class="edit-select select hide">
      <select id='${"edited-priority" + card.id}'
        class="edited-priority hide" >
        <option selected value="High">High</option>
        <option value="Normal">Normal</option>
        <option value="Low">Low</option>
      </select>
    </div>
    <span id='${"card__edit" + card.id}'  class='card__edit'>
      <i class="fas fa-pen extra-img"></i>
      <div class='extra-menu'>
        <button class='extra-menu__done'>Done</button>
        <button class='extra-menu__edit'>Edit</button>
        <button class='extra-menu__delete'>Delete</button>
      </div>
    </span>
    <span id='${"ok" + card.id}' class='ok'>OK</span>
  </div>
</article>`;
  cardsGrid.insertAdjacentHTML("afterbegin", cardBlock);
  // Elements of extra-menu
  extraEdit = document.querySelector(".extra-menu__edit");
  extraDone = document.querySelector(".extra-menu__done");
  circleDone = document.querySelector(".fa-circle");
  checkDone = document.querySelector(".fa-check-circle");
  extraDelete = document.querySelector(".extra-menu__delete");
  // Events for extra-menu
  extraEdit.addEventListener("click", editCard);
  extraDone.addEventListener("click", doneCard);
  circleDone.addEventListener("click", doneCard);
  checkDone.addEventListener("click", doneCard);
  extraDelete.addEventListener("click", deleteCard);
}

/* Interactions with cards */
function addCard() {
  if (!titleInput.value) {
    titleInput.setAttribute("placeholder", "Card must have a title!");
    titleInput.classList.add("alert");
  } else {
    let newCard = new Card({
      id: 'x'+Date.now(),
      title: titleInput.value,
      description: descriptionInput.value,
      priority: priorityInput.value,
      isDone: false
    });
    allCards.push(newCard);
    createCard(newCard);
    newCard.saveToStorage(allCards);
    titleInput.value = "";
    descriptionInput.value = "";
    titleInput.classList.remove("alert");
    toggleCreateMenu();
  }
}

function editCard(e) {
  let listIndex = findIndex(retrieveId(e, "article"), allCards),
    id = allCards[listIndex].id,
    // Set unique ID for every single card
    idTitleDef = "#card__title" + id,
    idDescriptionDef = "#card__description" + id,
    idPriorityDef = "#card__priority" + id,
    idDots = "#card__edit" + id,
    // --
    idTitle = "#edited-title" + id,
    idDescription = "#edited-description" + id,
    idPriority = "#edited-priority" + id,
    idPrioritySelect = "#edit-priority" + id,
    idOk = "#ok" + id,
    // --
    editedTitle = document.querySelector(idTitle),
    editedDescription = document.querySelector(idDescription),
    editedPriority = document.querySelector(idPriority),
    editedPrioritySelect = document.querySelector(idPrioritySelect),
    // --
    defTitle = document.querySelector(idTitleDef),
    defDescription = document.querySelector(idDescriptionDef),
    defPriority = document.querySelector(idPriorityDef),
    // --
    dots = document.querySelector(idDots),
    ok = document.querySelector(idOk);
    ok.addEventListener("click", saveOk);

  // Swap between 'default' and 'editing'
  editedTitle.classList.toggle("hide");
  editedDescription.classList.toggle("hide");
  editedPriority.classList.toggle("hide");
  editedPrioritySelect.classList.toggle("hide");
  // --
  defTitle.classList.toggle("hide");
  defDescription.classList.toggle("hide");
  defPriority.classList.toggle("hide");
  // --
  dots.classList.toggle("hide");
  ok.classList.toggle("hide");
  // Export variables for using in another function
  let arr = [
    defTitle,
    editedTitle,
    defDescription,
    editedDescription,
    defPriority,
    editedPriority,
    id,
    listIndex
  ];
  return arr;
}

function saveOk(e) {
  // Use array of variables from last function
  let data = editCard(e);
  data[0].innerHTML = data[1].value;
  data[2].innerHTML = data[3].value;
  data[4].innerHTML = data[5].value;
  let itCard = allCards.find(item => item.id === data[6]);
  itCard.title = data[1].value;
  itCard.description = data[3].value;
  itCard.priority = data[5].value;
  allCards[data[7]].saveToStorage(allCards); // save changes into localStorage
}

function doneCard(e) {
  let listIndex = findIndex(retrieveId(e, "article"), allCards);
  // Set unique ID for card
  let itId = "#" + allCards[listIndex].id,
    itCard = document.querySelector(itId),
    itCardInArray = allCards.find(item => item.id === allCards[listIndex].id);
  itCard.classList.toggle("open");
  if (itCardInArray.isDone) {
    itCardInArray.isDone = false;
  } else {
    itCardInArray.isDone = true;
  }
  allCards[listIndex].saveToStorage(allCards); // save into localStorage
}

function deleteCard(e) {
  let listIndex = findIndex(retrieveId(e, "article"), allCards);
  console.log(allCards.findIndex(item => item.id === "f77"));
  allCards[listIndex].deleteFromStorage(allCards);
  e.target.closest("article").remove();
}

// Functions for using localStorage
function handlePageLoad() {
  if (JSON.parse(localStorage.getItem("globalStorage"))) {
    restoreData();
    restoreDOM();
  }
}

function restoreData() {
  let recoveredData = JSON.parse(localStorage.getItem("globalStorage")).map(
    function(data) {
      return new Card({
        id: data.id,
        title: data.title,
        description: data.description,
        priority: data.priority,
        isDone: data.isDone
      });
    }
  );
  allCards = recoveredData;
}

function restoreDOM() {
  for (let i = 0; i < allCards.length; i++) {
    createCard(allCards[i]);
  }
}
