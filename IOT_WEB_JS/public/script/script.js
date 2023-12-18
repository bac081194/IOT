const allSideMenu = document.querySelectorAll("#sidebar .side-menu.top li a");

allSideMenu.forEach((item) => {
  const li = item.parentElement;

  item.addEventListener("click", function () {
    allSideMenu.forEach((i) => {
      i.parentElement.classList.remove("active");
    });
    li.classList.add("active");
  });
});

// TOGGLE SIDEBAR
const menuBar = document.querySelector("#content nav .bx.bx-menu");
const sidebar = document.getElementById("sidebar");

menuBar.addEventListener("click", function () {
  sidebar.classList.toggle("hide");
});

const searchButton = document.querySelector(
  "#content nav form .form-input button"
);
const searchButtonIcon = document.querySelector(
  "#content nav form .form-input button .bx"
);
const searchForm = document.querySelector("#content nav form");

searchButton.addEventListener("click", function (e) {
  if (window.innerWidth < 576) {
    e.preventDefault();
    searchForm.classList.toggle("show");
    if (searchForm.classList.contains("show")) {
      searchButtonIcon.classList.replace("bx-search", "bx-x");
    } else {
      searchButtonIcon.classList.replace("bx-x", "bx-search");
    }
  }
});

if (window.innerWidth < 768) {
  sidebar.classList.add("hide");
} else if (window.innerWidth > 576) {
  searchButtonIcon.classList.replace("bx-x", "bx-search");
  searchForm.classList.remove("show");
}

window.addEventListener("resize", function () {
  if (this.innerWidth > 576) {
    searchButtonIcon.classList.replace("bx-x", "bx-search");
    searchForm.classList.remove("show");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const btn1 = document.getElementById("dashbroad-btn");
  const btn2 = document.getElementById("profile-btn");
  const btn3 = document.getElementById("logging-btn");
  const btn4 = document.getElementById("ation-btn");
  const content1 = document.getElementById("content");
  const content2 = document.getElementById("bg-light");
  const content3 = document.getElementById("logging");
  const content4 = document.getElementById("btn-record");

  btn1.addEventListener("click", function () {
    content1.style.display = "block";
    content2.style.display = "none";
    content3.style.display = "none";
    content4.style.display = "none";
  });

  btn2.addEventListener("click", function () {
    content1.style.display = "none";
    content2.style.display = "block";
    content3.style.display = "none";
    content4.style.display = "none";
  });

  btn3.addEventListener("click", function () {
    content1.style.display = "none";
    content2.style.display = "none";
    content3.style.display = "block";
    content4.style.display = "none";
  });
  btn4.addEventListener("click", function () {
    content1.style.display = "none";
    content2.style.display = "none";
    content3.style.display = "none";
    content4.style.display = "block";
  });
});

// document.addEventListener("DOMContentLoaded", function() {
//     const btn1 = document.getElementById("dashbroad-btn");
//     const btn2 = document.getElementById("profile-btn");

//     btn1.addEventListener("click", function() {
//         console.log("Dashboard button clicked");
//         // Thêm mã thay đổi hiển thị ở đây
//     });

//     btn2.addEventListener("click", function() {
//         console.log("Profile button clicked");
//         // Thêm mã thay đổi hiển thị ở đây
//     });
// });

// Hàm để cập nhật dữ liệu trên trang
function updateSensorData(data) {
  const temperatureDisplay = document.getElementById("temperatureDisplay");
  const humidityDisplay = document.getElementById("humidityDisplay");
  const lightDisplay = document.getElementById("lightDisplay");
  const dustDisplay = document.getElementById("dustDisplay");
  const valueDisplay1 = document.getElementById("value-display1");
  const valueDisplay2 = document.getElementById("value-display2");
  const valueDisplay3 = document.getElementById("value-display3");
  const valueDisplay4 = document.getElementById("value-display4");

  // Kiểm tra xem có dữ liệu hay không
  if (data.length > 0) {
    const latestData = data[0]; // Lấy bản ghi mới nhất

    // Cập nhật các phần tử hiển thị với dữ liệu mới
    temperatureDisplay.textContent = latestData.temperature;
    humidityDisplay.textContent = latestData.humidity;
    const mappedLight = mapLightValue(latestData.light);
    lightDisplay.textContent = mappedLight;
    dustDisplay.textContent = latestData.db;

    // Cập nhật màu nền dựa trên giá trị số
    valueDisplay1.style.backgroundColor = getColorForValue(latestData.temperature);
    valueDisplay2.style.backgroundColor = getColorForValue(latestData.humidity);
    valueDisplay3.style.backgroundColor = getColorForValue(mappedLight);

    // Kiểm tra giá trị của latestData.db và thực hiện nhấp nháy
    if (latestData.db > 500) {
      // Sử dụng một biến để theo dõi trạng thái nhấp nháy
      let isFlashing = false;

      // Sử dụng setInterval để thực hiện nhấp nháy
      const flashingInterval = setInterval(() => {
        if (isFlashing) {
          valueDisplay4.style.backgroundColor = getColorForValue(latestData.db);
        } else {
          valueDisplay4.style.backgroundColor = "red";
        }
        isFlashing = !isFlashing;
      }, 500); // Mỗi 500ms thay đổi màu nền

      // Dừng nhấp nháy sau khi giá trị không còn lớn hơn 500
      const stopFlashingInterval = setInterval(() => {
        if (latestData.db <= 500) {
          clearInterval(flashingInterval);
          clearInterval(stopFlashingInterval);
          valueDisplay4.style.backgroundColor = getColorForValue(latestData.db);
        }
      }, 1000); // Kiểm tra mỗi giây

    } else {
      valueDisplay4.style.backgroundColor = getColorForValue(latestData.db);
    }
  }
}


function getColorForValue(value) {
  // Chọn màu cơ bản (ví dụ: "#54006e")
  const baseColor = "#54006e";
  
  // Định nghĩa một giá trị tối đa (tùy chọn)
  const maxValue = 100; // Giá trị tối đa (có thể thay đổi)

  // Tính toán màu nền dựa trên giá trị đầu vào và giá trị tối đa
  const ratio = value / maxValue; // Tính tỷ lệ dựa trên giá trị đầu vào và giá trị tối đa
  const hue = 240 - (ratio * 120); // Điều chỉnh màu Hue (màu sắc) trong phạm vi từ 240 đến 120

  // Chuyển đổi màu Hue sang mã màu RGB
  const rgbColor = hslToRgb(hue / 360, 1, 0.5);

  // Chuyển đổi mã màu RGB sang chuỗi Hex
  return rgbToHex(rgbColor);
}

// Hàm chuyển đổi màu HSL sang RGB
function hslToRgb(h, s, l) {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // Màu xám khi độ bão hòa s (s == 0)
  } else {
    const hueToRgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hueToRgb(p, q, h + 1 / 3);
    g = hueToRgb(p, q, h);
    b = hueToRgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Hàm chuyển đổi mã màu RGB sang chuỗi Hex
function rgbToHex(rgbColor) {
  return "#" + rgbColor.map(value => {
    const hex = value.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
}

// function getColorForValue(value) {
//   // Tính tỷ lệ màu dựa trên giá trị đầu vào
//   const ratio = value / 100; // Chia cho giá trị tối đa (trong trường hợp này là 100)

//   // Màu bắt đầu và màu kết thúc
//   const startColor = "#ecaeff"; // Màu nhạt
//   const endColor = "#54006e"; // Màu đậm

//   // Sử dụng linear interpolation để tính toán màu chuyển tiếp
//   const r = Math.floor(
//     parseInt(startColor.slice(1, 3), 16) * (1 - ratio) +
//       parseInt(endColor.slice(1, 3), 16) * ratio
//   );
//   const g = Math.floor(
//     parseInt(startColor.slice(3, 5), 16) * (1 - ratio) +
//       parseInt(endColor.slice(3, 5), 16) * ratio
//   );
//   const b = Math.floor(
//     parseInt(startColor.slice(5, 7), 16) * (1 - ratio) +
//       parseInt(endColor.slice(5, 7), 16) * ratio
//   );

//   // Định dạng kết quả thành một chuỗi màu Hex
//   return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
// }

function mapLightValue(light) {
  return (100 - ((light - 99) / (1024 - 99)) * 100).toFixed(2);
}

// Hàm để lấy dữ liệu từ API và cập nhật trang
function fetchDataAndDisplay() {
  fetch("/latest_sensor_data")
    .then((response) => response.json())
    .then((data) => {
      console.log("Dữ liệu mới nhất:", data);
      updateSensorData(data);
    })
    .catch((error) => {
      console.error("Lỗi khi lấy dữ liệu:", error);
    });
}

// Gọi fetchDataAndDisplay một lần khi trang được tải
fetchDataAndDisplay();

// Sử dụng setInterval để gọi nó sau mỗi giây và cập nhật trang
setInterval(fetchDataAndDisplay, 1000);

//   record log

const tableRows = [];
const tableRows2 = [];

// Hàm để thêm số liệu vào bảng

function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0"); // Định dạng giờ thành hai chữ số
  const minutes = now.getMinutes().toString().padStart(2, "0"); // Định dạng phút thành hai chữ số
  const seconds = now.getSeconds().toString().padStart(2, "0"); // Định dạng giây thành hai chữ số

  return `${hours}:${minutes}:${seconds}`;
}

// Hàm kiểm tra đèn tắt hay bật

function isBackgroundColorBlack(elementId) {
  const element = document.getElementById(elementId);

  // Kiểm tra xem phần tử có tồn tại không
  if (!element) {
    console.error(`Phần tử với ID ${elementId} không tồn tại.`);
    return false; // Hoặc giá trị mặc định khác tùy bạn
  }

  // Lấy giá trị background-color
  const computedStyle = window.getComputedStyle(element);
  const backgroundColor = computedStyle.backgroundColor;

  // Kiểm tra giá trị background-color
  return backgroundColor === "rgb(108, 204, 122)" ? "Bật" : "Tắt";
}

