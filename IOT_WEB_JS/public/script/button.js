
// Hàm gửi yêu cầu đến máy chủ Node.js để điều khiển Đèn 1
const toggleButtonRelay1 = document.getElementById("toggleRelay1");
const toggleButtonLight = document.getElementById("img-light");

let isRelay1On = false;

function toggleRelay1() {
  
  if (!isRelay1On) {
    // Gửi yêu cầu bật Đèn 1
    turnOnRelay1();
    toggleButtonRelay1.textContent = "Tắt Đèn ";
    toggleButtonLight.style.backgroundColor = "#6ccc7a"

  } else {
    // Gửi yêu cầu tắt Đèn 1
    turnOffRelay1();
    toggleButtonRelay1.textContent = "Bật Đèn ";
    toggleButtonLight.style.backgroundColor = "#2e2832"
  }
  isRelay1On = !isRelay1On;
}

// Hàm gửi yêu cầu đến máy chủ Node.js để điều khiển Đèn 1
function turnOnRelay1() {
  console.log("den1")
  fetch("/control-relay", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      relay1: "on",
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
    })
    .catch((error) => {
      console.error("Lỗi khi gửi yêu cầu:", error);
    });
}

function turnOffRelay1() {
  fetch("/control-relay", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      relay1: "off",
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
    })
    .catch((error) => {
      console.error("Lỗi khi gửi yêu cầu:", error);
    });
}

const toggleButtonRelay2 = document.getElementById("toggleRelay2");
const toggleButtonPan = document.getElementById("img-pan");

let isRelay2On = false;

function toggleRelay2() {
  isRelay2On = !isRelay2On;
  if (isRelay2On) {
    // Gửi yêu cầu bật Đèn 2
    turnOnRelay2();
    toggleButtonRelay2.textContent = "Đóng Cửa ";
    toggleButtonPan.style.backgroundColor = "#6ccc7a"

  } else {
    // Gửi yêu cầu tắt Đèn 2
    turnOffRelay2();
    toggleButtonRelay2.textContent = "Mở Cửa ";
    toggleButtonPan.style.backgroundColor = "#2e2832"

  }
}

// Hàm gửi yêu cầu đến máy chủ Node.js để điều khiển Đèn 2
function turnOnRelay2() {
  fetch("/control-relay", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      relay2: "on",
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
    })
    .catch((error) => {
      console.error("Lỗi khi gửi yêu cầu:", error);
    });
}

function turnOffRelay2() {
  fetch("/control-relay", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      relay2: "off",
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
    })
    .catch((error) => {
      console.error("Lỗi khi gửi yêu cầu:", error);
    });
}

// Hàm gửi yêu cầu đến máy chủ Node.js để điều khiển Đèn 3
const toggleButtonRelay3 = document.getElementById("toggleRelay3");
const toggleButtonExtra = document.getElementById("img-extra");

let isRelay3On = false;

function toggleRelay3() {
  isRelay3On = !isRelay3On;
  if (isRelay3On) {
    // Gửi yêu cầu bật Đèn 3
    turnOnRelay3();
    toggleButtonRelay3.textContent = "Tắt Điều Hòa";
    toggleButtonExtra.style.backgroundColor = "#6ccc7a"

  } else {
    // Gửi yêu cầu tắt Đèn 3
    turnOffRelay3();
    toggleButtonRelay3.textContent = "Bật Điều Hòa";
    toggleButtonExtra.style.backgroundColor = "#2e2832"

  }
}

// Hàm gửi yêu cầu đến máy chủ Node.js để điều khiển Đèn 3
function turnOnRelay3() {
  fetch("/control-relay", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      relay3: "on",
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
    })
    .catch((error) => {
      console.error("Lỗi khi gửi yêu cầu:", error);
    });
}

function turnOffRelay3() {
  fetch("/control-relay", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      relay3: "off",
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
    })
    .catch((error) => {
      console.error("Lỗi khi gửi yêu cầu:", error);
    });
}
