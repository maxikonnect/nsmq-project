document.addEventListener("DOMContentLoaded", function () {
    const round1Container = document.querySelector(".round1-container");
    const round2Container = document.querySelector(".round2-container");
    const round3Container = document.querySelector(".round3-container");
    const round4Container = document.querySelector(".round4-container");

    const toggleRound1 = document.getElementById("toggleRound1");
    const toggleRound2 = document.getElementById("toggleRound2");
    const toggleRound3 = document.getElementById("toggleRound3");
    const toggleRound4 = document.getElementById("toggleRound4");

    function toggleContainer(container) {
        if (container) {
            container.style.display = (container.style.display === "none" || container.style.display === "") 
                ? "table-row-group" 
                : "none"; 
        }
    }

    if (toggleRound1) toggleRound1.addEventListener("click", () => toggleContainer(round1Container));
    if (toggleRound2) toggleRound2.addEventListener("click", () => toggleContainer(round2Container));
    if (toggleRound3) toggleRound3.addEventListener("click", () => toggleContainer(round3Container));
    if (toggleRound4) toggleRound4.addEventListener("click", () => toggleContainer(round4Container));

    if (round1Container) round1Container.style.display = "none";
    if (round2Container) round2Container.style.display = "none";
    if (round3Container) round3Container.style.display = "none";
    if (round4Container) round4Container.style.display = "none";
});

const round1Container = document.querySelector(".round1-container");
const round2Container = document.querySelector(".round2-container");
const round3Container = document.querySelector(".round3-container");
const round4Container = document.querySelector(".round4-container");

const round1Team1Values = round1Container.querySelectorAll(".team1");
const round1Team1Total = document.querySelector(".team1round1Total");
const round1Team2Values = round1Container.querySelectorAll(".team2");
const round1Team2Total = document.querySelector(".team2round1Total");

const round2Team1Values = round2Container.querySelectorAll(".team1");
const round2Team1Total = document.querySelector(".team1round2Total");
const round2Team2Values = round2Container.querySelectorAll(".team2");
const round2Team2Total = document.querySelector(".team2round2Total");

const round3Team1Values = round3Container.querySelectorAll(".team1");
const round3Team1Total = document.querySelector(".team1round3Total");
const round3Team2Values = round3Container.querySelectorAll(".team2");
const round3Team2Total = document.querySelector(".team2round3Total");

const round4Team1Values = round4Container.querySelectorAll(".team1");
const round4Team1Total = document.querySelector(".team1round4Total");
const round4Team2Values = round4Container.querySelectorAll(".team2");
const round4Team2Total = document.querySelector(".team2round4Total");

const overAllTotalTeam1 = document.querySelector(".overAllTotalTeam1");
const overAllTotalTeam2 = document.querySelector(".overAllTotalTeam2");

function calculateTotal(teamValues, roundTotal) {
    let total = 0;
    teamValues.forEach((item) => {
        let value = item.value.trim() === "" ? 0 : Number(item.value);
        total += value;
    });
    if (roundTotal) {
        roundTotal.value = total;
    }
}

function updateOverallTotals() {
    overAllTotalTeam1.value = 
        (Number(round1Team1Total?.value?.trim()) || 0) + 
        (Number(round2Team1Total?.value?.trim()) || 0) + 
        (Number(round3Team1Total?.value?.trim()) || 0) + 
        (Number(round4Team1Total?.value?.trim()) || 0);

    overAllTotalTeam2.value = 
        (Number(round1Team2Total?.value?.trim()) || 0) + 
        (Number(round2Team2Total?.value?.trim()) || 0) + 
        (Number(round3Team2Total?.value?.trim()) || 0) + 
        (Number(round4Team2Total?.value?.trim()) || 0);
}

function addEventListeners(teamValues, roundTotal) {
    teamValues.forEach((item) => {
        item.addEventListener("input", () => {
            calculateTotal(teamValues, roundTotal);
            updateOverallTotals();
        });
    });
}

addEventListeners(round1Team1Values, round1Team1Total);
addEventListeners(round1Team2Values, round1Team2Total);
addEventListeners(round2Team1Values, round2Team1Total);
addEventListeners(round2Team2Values, round2Team2Total);
addEventListeners(round3Team1Values, round3Team1Total);
addEventListeners(round3Team2Values, round3Team2Total);
addEventListeners(round4Team1Values, round4Team1Total);
addEventListeners(round4Team2Values, round4Team2Total);

updateOverallTotals();