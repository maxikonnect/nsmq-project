const startQuizContainer = document.querySelector(".startQuizContainer");

const quizSchools = JSON.parse(localStorage.getItem("ballotedPosition")) || {};
const chosenSchools = Object.entries(quizSchools)
  .sort((a, b) => a[1] - b[1])
  .map(([key]) => key);

// Load saved data from localStorage
const savedData = JSON.parse(localStorage.getItem("quizData")) || {};

// Generate the table headers dynamically
const schoolHeaders = chosenSchools.map((school) => `<th>${school}</th>`).join("");

const selectedSchools = document.createElement("div");
selectedSchools.innerHTML = `
    <div>
        <table>
            <caption>Quiz</caption>
            <thead>
                <tr>
                    <th>Subjects</th>
                    ${schoolHeaders}
                    <th>Total</th>
                </tr>
            </thead>
            <tbody class="round" id="round1">
                <tr onclick="toggleRound(1)">
                    <td colspan=${chosenSchools.length + 2}><strong>▶ Round 1</strong></td>
                    <td><button onclick="event.stopPropagation(); addRow(1)">Add Row</button></td>
                </tr>
            </tbody>
            <tfoot id="totalRow1">
                <tr>
                    <td></td>
                    <td></td>
                </tr>
            </tfoot>
            <tfoot id="totalRow1Footer">
                <tr>
                    <td><strong>Total (Round 1)</strong></td>
                    ${chosenSchools.map(() => `<td class="round1-total">0</td>`).join("")}
                    <td class="round1-overall">0</td>
                </tr>
            </tfoot>
            <tbody class="round" id="round2">
                <tr onclick="toggleRound(2)">
                    <td colspan=${chosenSchools.length + 2}><strong>▶ Round 2</strong></td>
                    <td><button onclick="event.stopPropagation(); addRow(2)">Add Row</button></td>
                </tr>
            </tbody>
            <tfoot id="totalRow2Footer">
                <tr>
                    <td><strong>Total (Round 2)</strong></td>
                    ${chosenSchools.map(() => `<td class="round2-total">0</td>`).join("")}
                    <td class="round2-overall">0</td>
                </tr>
            </tfoot>
            <tbody class="round" id="round3">
                <tr onclick="toggleRound(3)">
                    <td colspan=${chosenSchools.length + 2}><strong>▶ Round 3</strong></td>
                    <td><button onclick="event.stopPropagation(); addRow(3)">Add Row</button></td>
                </tr>
            </tbody>
            <tfoot id="totalRow3Footer">
                <tr>
                    <td><strong>Total (Round 3)</strong></td>
                    ${chosenSchools.map(() => `<td class="round3-total">0</td>`).join("")}
                    <td class="round3-overall">0</td>
                </tr>
            </tfoot>
            <tbody class="round" id="round4">
                <tr onclick="toggleRound(4)">
                    <td colspan=${chosenSchools.length + 2}><strong>▶ Round 4</strong></td>
                    <td><button onclick="event.stopPropagation(); addRow(4)">Add Row</button></td>
                </tr>
            </tbody>
            <tfoot id="totalRow4Footer">
                <tr>
                    <td><strong>Total (Round 4)</strong></td>
                    ${chosenSchools.map(() => `<td class="round4-total">0</td>`).join("")}
                    <td class="round4-overall">0</td>
                </tr>
            </tfoot>
            <tfoot>
                <tr>
                    <td><strong>Overall Total</strong></td>
                    ${chosenSchools.map(() => `<td class="overall-school-total">0</td>`).join("")}
                    <td id="overallTotal">0</td>
                </tr>
            </tfoot>
        </table>  
    </div>
`;

startQuizContainer.appendChild(selectedSchools);

// Function to Add Row Below the Correct Round
function addRow(index) {
    const roundBody = document.getElementById(`round${index}`);
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
        <td><input type="text" placeholder="Subject Name"></td>
        ${chosenSchools.map(() => `<td><input type="number" value="0" oninput="updateScores()"></td>`).join("")}
    `;

    roundBody.appendChild(newRow);

    // Ensure the round stays open
    ensureRoundOpen(index);

    // Save to localStorage
    saveData();
}

// Function to Toggle Round Open/Close
function toggleRound(index) {
    const roundBody = document.getElementById(`round${index}`);
    
    [...roundBody.children].forEach((row, i) => {
        if (i !== 0) row.style.display = row.style.display === "none" ? "table-row" : "none";
    });

    updateArrow(index);
}

// Ensure Round Stays Open
function ensureRoundOpen(index) {
    const roundBody = document.getElementById(`round${index}`);
    [...roundBody.children].forEach((row, i) => {
        if (i !== 0) row.style.display = "table-row";
    });

    updateArrow(index, true);
}

// Update Arrow Symbol
function updateArrow(index, forceOpen = false) {
    const roundHeader = document.getElementById(`round${index}`).querySelector("tr");
    const arrow = roundHeader.querySelector("strong");

    if (forceOpen || arrow.innerHTML.includes("▶")) {
        arrow.innerHTML = "▼ Round " + index;
    } else {
        arrow.innerHTML = "▶ Round " + index;
    }
}

// Save Data to localStorage
function saveData() {
    const data = {};
    for (let i = 1; i <= 4; i++) {
        const roundBody = document.getElementById(`round${i}`);
        data[`round${i}`] = [...roundBody.querySelectorAll("tr:not(:first-child)")].map(row =>
            [...row.querySelectorAll("input")].map(input => input.value)
        );
    }
    localStorage.setItem("quizData", JSON.stringify(data));
}

// Load Data from localStorage
function loadData() {
    for (let i = 1; i <= 4; i++) {
        if (savedData[`round${i}`]) {
            savedData[`round${i}`].forEach(scores => {
                const roundBody = document.getElementById(`round${i}`);
                const newRow = document.createElement("tr");

                newRow.innerHTML = `
                    ${scores.map(score => `<td><input type="number" value="${score}" oninput="updateScores()"></td>`).join("")}
                `;

                roundBody.appendChild(newRow);
            });
        }
    }
    updateScores();
}

// Update Total Scores
function updateScores() {
    let overallTotal = 0;
    let schoolTotals = new Array(chosenSchools.length).fill(0);

    for (let i = 1; i <= 4; i++) {
        let roundTotals = new Array(chosenSchools.length).fill(0);

        document.querySelectorAll(`#round${i} tr:not(:first-child)`).forEach(row => {
            row.querySelectorAll("input").forEach((input, index) => {
                roundTotals[index] += Number(input.value);
                schoolTotals[index] += Number(input.value);
            });
        });

        document.querySelectorAll(`.round${i}-total`).forEach((td, index) => td.textContent = roundTotals[index]);
        document.querySelector(`.round${i}-overall`).textContent = roundTotals.reduce((a, b) => a + b, 0);
        overallTotal += roundTotals.reduce((a, b) => a + b, 0);
    }

    document.querySelectorAll(".overall-school-total").forEach((td, index) => td.textContent = schoolTotals[index]);
    document.getElementById("overallTotal").textContent = overallTotal;
    saveData();
}

// Load stored data on page load
loadData();
