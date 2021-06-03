const listContainer = document.querySelector(".times");
const countryInput = document.querySelector("#country");
const cityInput = document.querySelector("#city");
const submit = document.querySelector(".submit-button");
const formContainer = document.querySelector(".form-container");
const displayDate = document.querySelector(".date");
const displayTime = document.querySelector(".time");
const displayLocation = document.querySelector(".location");

let country;
let city;

function clearDisplay() {
  if (!city && !country) {
    listContainer.style.display = "none";
    displayDate.textContent = "";
    displayTime.textContent = "";
    displayLocation.textContent = "";
  }
}

clearDisplay();

// Time and Date
const date = new Date();
let month = date.getMonth() + 1;
let year = date.getFullYear();
let day = date.getDay();
let hours = addZero(date.getHours());
let minutes = addZero(date.getMinutes());

function addZero(num) {
  return num < 10 ? `0${num}` : num;
}

function display() {
  displayDate.textContent = `${month}/${day}/${year}`;
  hours < 12
    ? (displayTime.textContent = `${hours}:${minutes}AM`)
    : (displayTime.textContent = `${hours}:${minutes}PM`);

  displayLocation.textContent = `${country.toUpperCase()}, ${city.toUpperCase()}`;
}

async function AdanTime() {
  if (!city && !country) {
    listContainer.style.display = "none";
    return;
  }

  const prayerTime = await fetch(
    `http://api.aladhan.com/v1/calendarByCity?city=${city}&country=${country}&method=2&month=${date.getMonth}&year=${date.getYear}`
  );
  const rest = await prayerTime.json();
  return rest;
}

submit.addEventListener("click", (e) => {
  e.preventDefault();
  country = countryInput.value;
  city = cityInput.value;
  listContainer.style.display = "block";
  display();
  clearDisplay();
  AdanTime().then((time) => {
    console.log(time);
    let newData = time.data;
    newData.forEach((element) => {
      if (
        element.date.gregorian.month.number === date.getMonth() + 1 &&
        Number(element.date.gregorian.day) === date.getDay()
      ) {
        Object.entries(element.timings).forEach((element) => {
          console.log(element);
          const [key, value] = element;
          const list = document.createElement("li");
          list.innerHTML = `${key}: ${value}`;
          listContainer.appendChild(list);
        });
      }
    });
  });
  formContainer.reset();
  listContainer.textContent = "";
});
