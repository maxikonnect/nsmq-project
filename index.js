const schools = document.getElementById("schools");
const form = document.querySelector("form");
const display = document.querySelector(".display");
const clearboard = document.querySelector(".clearboard")
const schoolDisplayBoard = document.querySelector(".schoolDisplayBoard");
const doneWithSchoolChoice = document.querySelector(".doneWithSchoolChoice");
const clearBoardContainer = document.querySelector(".clearBoardContainer");
const ballotPage = document.querySelector(".ballotPage");

/* TO TRACK PICKED POSITION */
let pickedPositions = []; 

/* LOCALSTORAGE TO STORE ARRAY OF BALLOTED POSITIONS OF SCHOOLS */
let ballotedPosition = JSON.parse(localStorage.getItem("ballotedPosition")) || [];

/*LOCALSTORAGE TO STORE ARRAY OF COMPETING SCHOOLS */
let contain = JSON.parse(localStorage.getItem("contain")) || []


function displayOnBoard() {
    display.innerHTML = ""; 
    contain.forEach((item, index) => {
        const listed = document.createElement("ul");
        listed.innerHTML = `
            <li>
                <span id="text-${index}">${item}</span>
                <input type="text" id="input-${index}" value="${item}" style="display: none;">
                <button onclick="enableEdit(${index})">Edit</button>
                <button onclick="saveEdit(${index})" style="display: none;">Save</button>
                <button onclick="deleteItem(${index})">Delete</button>
            </li>
        `;
        display.appendChild(listed);
    });
}


function updateDoneWithSelection(){
    if(contain.length < 2){
        doneWithSchoolChoice.disabled = true;
    }else{
        doneWithSchoolChoice.disabled = false;
    }
}

doneWithSchoolChoice.addEventListener("click", function () {
    display.innerHTML = "";
    clearBoardContainer.innerHTML = "";
    form.innerHTML = "";
    doneWithSchoolChoice.remove();

    ballotPage.innerHTML = `Click Your School Button To ballot For Your Sitting Position.`;

    contain.forEach((value, index) => {
        const divider = document.createElement("div");
        divider.innerHTML = `
            <span id="school-${index}">${value}</span>
            <button onclick="sittingPosition(${index}, this)">Click To Choose Sitting Position</button>
        `;
        ballotPage.appendChild(divider);
    });
});

function sittingPosition(index, button) {
    const schoolName = contain[index];

    if (pickedPositions.includes(index)) {
        alert(`${schoolName} has already picked a position!`);
        return;
    }

    let randomNumber;
    do {
        randomNumber = Math.floor(Math.random() * contain.length) + 1;
    } while (pickedPositions.includes(randomNumber));

    pickedPositions.push(randomNumber);

    // Update the school display with the picked position
    const schoolDisplay = document.getElementById(`school-${index}`);
    schoolDisplay.innerHTML = `${contain[index]} - Picked Position: ${randomNumber}`;

    // Store the picked position in localStorage
    ballotedPosition[randomNumber - 1] = contain[index];
    localStorage.setItem("ballotedPosition", JSON.stringify(ballotedPosition));

    // Remove the button after selection
    button.remove();

    console.log("Picked Positions:", pickedPositions);
    console.log("Balloted Positions:", ballotedPosition);
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
        updateDoneWithSelection()
    }
}

function deleteItem(index) {
    contain.splice(index, 1);
    localStorage.setItem("contain", JSON.stringify(contain));
    displayOnBoard();
    updateDoneWithSelection()
}
displayOnBoard();
updateDoneWithSelection()

form.addEventListener("submit", function(event) {
    event.preventDefault();
    let data = schools.value.trim()
    if (data !== "") {
        contain.push(data);
        localStorage.setItem("contain", JSON.stringify(contain));
        displayOnBoard();
        updateDoneWithSelection()
        schools.value = "";
    }
})


clearboard.addEventListener("click", function() {
    localStorage.clear();
    contain = [];
    ballotedPosition = [];
    displayOnBoard();
    updateDoneWithSelection()
});



