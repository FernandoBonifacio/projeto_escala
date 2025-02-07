document.addEventListener("DOMContentLoaded", function () {
    loadSchedule();
    populateMonthsAndYears();
    populateWeekends();
});

let schedule = {};

function saveSchedule() {
    localStorage.setItem("schedule", JSON.stringify(schedule));
}

function loadSchedule() {
    let savedData = localStorage.getItem("schedule");
    if (savedData) {
        schedule = JSON.parse(savedData);
        updateSchedule();
    }
}

function populateMonthsAndYears() {
    let monthSelect = document.getElementById("month");
    let yearSelect = document.getElementById("year");
    let currentDate = new Date();

    let months = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    
    months.forEach((month, index) => {
        let option = document.createElement("option");
        option.value = index;
        option.textContent = month;
        monthSelect.appendChild(option);
    });

    monthSelect.value = currentDate.getMonth();

    let currentYear = currentDate.getFullYear();
    for (let i = 0; i < 5; i++) {
        let option = document.createElement("option");
        option.value = currentYear + i;
        option.textContent = currentYear + i;
        yearSelect.appendChild(option);
    }

    yearSelect.value = currentYear;
}

function populateWeekends() {
    let select = document.getElementById("weekend");
    let month = parseInt(document.getElementById("month").value);
    let year = parseInt(document.getElementById("year").value);

    select.innerHTML = "";

    for (let day = 1; day <= 31; day++) {
        let date = new Date(year, month, day);
        if (date.getMonth() !== month) break;
        if (date.getDay() === 6) {
            let sunday = new Date(date);
            sunday.setDate(sunday.getDate() + 1);
            if (sunday.getMonth() === month) {
                let option = document.createElement("option");
                option.value = `${day}-${sunday.getDate()}`;
                option.textContent = `${day} e ${sunday.getDate()} de ${month + 1}`;
                select.appendChild(option);
            }
        }
    }
}

function setSchedule() {
    let name = document.getElementById("nome").value;
    let weekend = document.getElementById("weekend").value;
    if (name.trim() === "") {
        alert("Por favor, insira um nome válido.");
        return;
    }
    schedule[weekend] = name;
    saveSchedule();
    updateSchedule();
    document.getElementById("nome").value = "";
}

function updateSchedule() {
    let list = document.getElementById("escalaLista");
    list.innerHTML = "";
    for (let date in schedule) {
        let item = document.createElement("li");
        item.classList.add("schedule-item");
        item.innerHTML = `${schedule[date]} <small>(${date})</small>
            <button class='small-button' onclick="editName('${date}')">✏️</button>
            <button class='small-button' onclick="removeName('${date}')">❌</button>`;
        list.appendChild(item);
    }
}

function editName(date) {
    let newName = prompt("Digite o novo nome:", schedule[date]);
    if (newName !== null && newName.trim() !== "") {
        schedule[date] = newName;
        saveSchedule();
        updateSchedule();
    }
}

function removeName(date) {
    delete schedule[date];
    saveSchedule();
    updateSchedule();
}