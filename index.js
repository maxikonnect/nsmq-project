const schools = document.getElementById("schools");
const schoolInputForm = document.querySelector(".schoolInputForm");
const display = document.querySelector(".display");
const clearboard = document.querySelector(".clearboard");
const doneWithSchoolChoice = document.querySelector(".doneWithSchoolChoice");
const clearBoardContainer = document.querySelector(".clearBoardContainer");
const ballotPage = document.querySelector(".ballotPage");



// LOCALSTORAGE STORING DATA FOR SELECTED SCHOOLS
let contain = JSON.parse(localStorage.getItem("contain")) || [];

// LOCALSTORAGE FOR BALLOTED SCHOOLS
let pickedPositions = []; 
let ballotedPosition = JSON.parse(localStorage.getItem("ballotedPosition")) || {};



function displayOnBoard() {
    display.innerHTML = ""; // Clear existing content before adding new ones

    const list = document.createElement("ul");

    contain.forEach((item, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <span id="text-${index}">${item}</span>
            <input type="text" id="input-${index}" value="${item}" style="display: none;">
            <button onclick="enableEdit(${index})">Edit</button>
            <button onclick="saveEdit(${index})" style="display: none;">Save</button>
            <button onclick="deleteItem(${index})">Delete</button>
        `;
        list.appendChild(listItem);
    });

    display.appendChild(list);
}



function updateDoneWithSelection() {
    doneWithSchoolChoice.disabled = contain.length < 2;
}



function displayToBallot() {
    ballotPage.innerHTML = ""; // Clear previous ballot content

    const instructions = document.createElement("p");
    instructions.textContent = "Click Your School Button To ballot For Your Sitting Position.";
    ballotPage.appendChild(instructions);

    contain.forEach((value, index) => {
        const divider = document.createElement("div");
        const position = ballotedPosition[value] ? ` - Picked Position: ${ballotedPosition[value]}` : "";
        
        divider.innerHTML = `
            <span id="school-${index}">${value}${position}</span>
            ${ballotedPosition[value] ? "" : `<button onclick="sittingPosition(${index}, this)">Click To Choose Sitting Position</button>`}
        `;

        ballotPage.appendChild(divider);
    });

    let existingClearBallot = document.querySelector(".clear-ballot");
    if (existingClearBallot) existingClearBallot.remove();

    const clearBallot = document.createElement("button");
    clearBallot.classList.add("clear-ballot");
    clearBallot.textContent = "CLEAR AND REDO BALLOTING";
    clearBallot.addEventListener("click", function(){
        ballotedPosition = {};
        pickedPositions = [];
        displayToBallot();
    });
    ballotPage.appendChild(clearBallot);

    const backToSchool = document.createElement("button");
    backToSchool.classList.add("backToSchool")
    backToSchool.textContent = "GO BACK TO SCHOOL SELECTION";
    backToSchool.addEventListener("click", function(){
        backToSchoolSelection();
    })
    ballotPage.appendChild(backToSchool);
}




doneWithSchoolChoice.addEventListener("click", function () {
    display.innerHTML = "";
    clearBoardContainer.innerHTML = "";
    schoolInputForm.style.display = "none"; // Hide instead of remove
    doneWithSchoolChoice.style.display = "none"; 

    displayToBallot();

    // Prevent duplicate buttons
    let existingClearBallot = document.querySelector(".clear-ballot");
    if (existingClearBallot) existingClearBallot.remove();

    const clearBallot = document.createElement("button");
    clearBallot.classList.add("clear-ballot");
    clearBallot.textContent = "CLEAR AND REDO BALLOTING";
    clearBallot.addEventListener("click", function(){
        ballotedPosition = {};
        pickedPositions = [];
        displayToBallot();
    });
    ballotPage.appendChild(clearBallot);
});





function sittingPosition(index, button) {
    const schoolName = contain[index];

    if (pickedPositions.includes(index)) {
        alert(`${schoolName} has already picked a position!`);
        return;
    }

    let availablePositions = Array.from({ length: contain.length }, (_, i) => i + 1)
        .filter(num => !Object.values(ballotedPosition).includes(num));

    if (availablePositions.length === 0) {
        alert("All positions have been assigned.");
        return;
    }

    let randomNumber = availablePositions[Math.floor(Math.random() * availablePositions.length)];

    pickedPositions.push(index);
    ballotedPosition[schoolName] = randomNumber;

    console.log(ballotedPosition);
    console.log(pickedPositions);
    const schoolDisplay = document.getElementById(`school-${index}`);
    schoolDisplay.innerHTML = `${schoolName} - Picked Position: ${randomNumber}`;

    localStorage.setItem("ballotedPosition", JSON.stringify(ballotedPosition));
    button.remove();
}



function enableEdit(index) {
    document.getElementById(`text-${index}`).style.display = "none";
    document.getElementById(`input-${index}`).style.display = "inline";
    event.target.nextElementSibling.style.display = "inline"; // Show Save button
}




function saveEdit(index) {
    let newValue = document.getElementById(`input-${index}`).value.trim();
    if (newValue !== "") {
        contain[index] = newValue;
        localStorage.setItem("contain", JSON.stringify(contain));
        displayOnBoard();
        updateDoneWithSelection();
    }
}



function deleteItem(index) {
    contain.splice(index, 1);
    localStorage.setItem("contain", JSON.stringify(contain));
    displayOnBoard();
    updateDoneWithSelection();
}



schoolInputForm.addEventListener("submit", function(event){
    event.preventDefault();
    let data = schools.value.trim();

    contain.push(data);
    localStorage.setItem("contain", JSON.stringify(contain));

    console.log(contain);
    schools.value = "";
    displayOnBoard();
    updateDoneWithSelection();

})




clearboard.addEventListener("click", function() {
    localStorage.removeItem("contain");
    localStorage.removeItem("ballotedPosition");
    contain = [];
    ballotedPosition = [];
    displayOnBoard();
    updateDoneWithSelection();
});


// Initial display updates
displayOnBoard();
updateDoneWithSelection();


function backToSchoolSelection(){
    displayOnBoard();
    displayToBallot.innerHTML = "";
    schoolInputForm.style.display = "block"; 
    doneWithSchoolChoice.style.display = "block";
    clearBoardContainer.style.display = "block";
    ballotPage.innerHTML = "";
}