function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function isValidDate(day, month, year) {
  const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth[month - 1];
}

function showError(inputId, message) {
  const inputGroup = document.getElementById(inputId).parentElement;

  const label = inputGroup.querySelector("label");
  label.style.color = "hsl(0, 100%, 67%)";

  // Input border red
  const input = inputGroup.querySelector("input");
  input.style.borderColor = "hsl(0, 100%, 67%)";

  // Add error message if not already there
  let error = inputGroup.querySelector(".error-message");
  if (!error) {
    error = document.createElement("small");
    error.className = "error-message";
    error.style.color = "hsl(0, 100%, 67%)"; 
    error.style.fontSize = "10px";
    error.style.marginTop = "5px";
    inputGroup.appendChild(error);
  }
  error.textContent = message;
}

function clearErrors() {
  const inputGroups = document.querySelectorAll(".input-group");
  inputGroups.forEach(group => {
    group.querySelector("label").style.color = ""; // Reset label
    const input = group.querySelector("input");
    input.style.borderColor = ""; // Reset border

    const error = group.querySelector(".error-message");
    if (error) error.remove();
  });
}

function animateValue(elementId, start, end, duration) {
  const element = document.getElementById(elementId);
  const range = end - start;
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = timestamp - startTime;
    const value = Math.min(Math.floor(start + (range * (progress / duration))), end);
    element.textContent = value;
    if (progress < duration) {
      requestAnimationFrame(step);
    } else {
      element.textContent = end;
    }
  }

  requestAnimationFrame(step); 
}

document.getElementById("calculate").addEventListener("click", function () {
  clearErrors();

  const dayInput = document.getElementById("day");
  const monthInput = document.getElementById("month");
  const yearInput = document.getElementById("year");

  const day = parseInt(dayInput.value, 10);
  const month = parseInt(monthInput.value, 10);
  const year = parseInt(yearInput.value, 10);

  const currentDate = new Date();
  const birthDate = new Date(year, month - 1, day);

  let hasError = false;

  // Required field checks
  if (!dayInput.value) {
    showError("day", "This field is required");
    hasError = true;
  } else if (isNaN(day) || day < 1 || day > 31) {
    showError("day", "Must be a valid day");
    hasError = true;
  }

  if (!monthInput.value) {
    showError("month", "This field is required");
    hasError = true;
  } else if (isNaN(month) || month < 1 || month > 12) {
    showError("month", "Must be a valid month");
    hasError = true;
  }

  if (!yearInput.value) {
    showError("year", "This field is required");
    hasError = true;
  } else if (isNaN(year) || year < 1900 || year > currentDate.getFullYear()) {
    showError("year", "Must be a valid year");
    hasError = true;
  }

// Valid date check
  if (!hasError) {
  if (!isValidDate(day, month, year)) {
    const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Check if month is invalid (e.g. 13)
    if (month < 1 || month > 12) {
      showError("month", "Must be a valid month");
    }
    // Check if day is invalid for a valid month
    else if (day < 1 || day > daysInMonth[month - 1]) {
      showError("day", "Must be a valid date" );
    }
    // Otherwise, fallback
    else {
      showError("day", "Must be a valid date");
    }

    hasError = true;
  }
}
  // Future date check
  if (!hasError && birthDate >= currentDate) {
    showError("year", "Must be in past");
    hasError = true;
  }

  if (hasError) {
    document.getElementById("years").textContent = "--";
    document.getElementById("months").textContent = "--";
    document.getElementById("days").textContent = "--";
    return;
  }

  // Age calculation
  let ageYear = currentDate.getFullYear() - birthDate.getFullYear();
  let ageMonth = currentDate.getMonth() - birthDate.getMonth();
  let ageDay = currentDate.getDate() - birthDate.getDate();

  if (ageDay < 0) {
    ageMonth--;
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    ageDay += lastMonth.getDate();
  }

  if (ageMonth < 0) {
    ageYear--;
    ageMonth += 12;
  }

  animateValue("years", 0, ageYear, 1000);
  animateValue("months", 0, ageMonth, 1000);
  animateValue("days", 0, ageDay, 1000);
});

// Remove error styles and messages when any input is focused
["day", "month", "year"].forEach((id) => {
  const input = document.getElementById(id);
  input.addEventListener("focus", () => {
    const group = input.parentElement;
    const error = group.querySelector(".error-message");
    if (error) error.remove();

    input.style.borderColor = ""; // Reset border
    group.querySelector("label").style.color = ""; // Reset label color
  });
});

// Clear all inputs and output values
document.getElementById("clear").addEventListener("click", () => {
  ["day", "month", "year"].forEach(id => {
    document.getElementById(id).value = "";
  });

  document.getElementById("years").textContent = "--";
  document.getElementById("months").textContent = "--";
  document.getElementById("days").textContent = "--";

  // Optional: remove any errors
  document.querySelectorAll(".error-message").forEach(el => el.remove());
});
