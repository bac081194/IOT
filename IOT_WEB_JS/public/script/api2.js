const dataTableElement2 = document.getElementById("actionTable");
const itemsPerPage2 = 25; // Số mục trên mỗi trang
let currentPage2 = 1; // Trang hiện tại

// public/api.js
function formatTimestamp2(timestamp) {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}
function formatState2(state) {
  return state === 0 ? "Tắt" : "Mở";
}

function compareTime2(time1, time2) {
  // Chuyển đổi chuỗi thời gian thành mảng chứa [hours, minutes, seconds]
  const time1Parts = time1.split(":").map(Number);
  const time2Parts = time2.split(":").map(Number);

  // So sánh giờ, phút và giây theo thứ tự tăng dần
  if (time1Parts[0] !== time2Parts[0]) {
    return time1Parts[0] - time2Parts[0];
  }

  if (time1Parts[1] !== time2Parts[1]) {
    return time1Parts[1] - time2Parts[1];
  }

  if (time1Parts[2] !== time2Parts[2]) {
    return time1Parts[2] - time2Parts[2];
  }

  // Nếu giờ, phút và giây đều giống nhau, trả về 0 (bằng nhau)
  return 0;
}

// Hàm để hiển thị dữ liệu trên trang cụ thể
function displayDataOnPage2(data, page) {
  const startIndex = (page - 1) * itemsPerPage2;
  const endIndex = startIndex + itemsPerPage2;
  const pageData = data.slice(startIndex, endIndex);
  currentPage2 = page;
  pageData.sort((a, b) => {
    const dateA = new Date(a.timestamp);
    const dateB = new Date(b.timestamp);
  
    // So sánh ngày
    if (dateA > dateB) {
      return -1;
    } else if (dateA < dateB) {
      return 1;
    } else {
      return 0;
    }
  });
  const tableRows = pageData
    .map((item) => {
      const formattedTimestamp = formatTimestamp2(item.timestamp);
      const state1 = formatState2(item.state_1);
      const state2 = formatState2(item.state_2);
      const state3 = formatState2(item.state_3);
      return `
        <tr>
          <td>${formattedTimestamp}</td>
          <td>${state1}</td>
          <td>${state2}</td>
          <td>${state3}</td>
        </tr>
      `;
    })
    .join("");

  const tableHTML = `
    <table>
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>State 1</th>
          <th>State 2</th>
          <th>State 3</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
  `;

  dataTableElement2.innerHTML = tableHTML;

  // Gọi hàm để hiển thị phân trang
  displayPagination2(data, page);
}


// Hàm để hiển thị phân trang
function displayPagination2(data, currentPage2) {
  const totalPages = Math.ceil(data.length / itemsPerPage2);
  const paginationElement = document.createElement("div");
  paginationElement.classList.add("pagination");

  // Hiển thị nút "Trang trước" và xử lý sự kiện khi nhấn
  const prevButton = document.createElement("button");
  prevButton.textContent = "Trang trước";
  prevButton.addEventListener("click", () => {
    if (currentPage2 > 1) {
      currentPage2--;
      displayDataOnPage2(data, currentPage2);
    }
  });
  paginationElement.appendChild(prevButton);

  // Hiển thị nút cho trang đầu tiên
  const firstPageButton = document.createElement("button");
  firstPageButton.textContent = "1";
  if (1 === currentPage2) {
    firstPageButton.classList.add("active");
  }
  firstPageButton.addEventListener("click", () => {
    currentPage2 = 1;
    displayDataOnPage2(data, currentPage2);
  });
  paginationElement.appendChild(firstPageButton);

  // Hiển thị nút cho trang thứ 2 nếu có
  if (totalPages > 1) {
    const secondPageButton = document.createElement("button");
    secondPageButton.textContent = "2";
    if (2 === currentPage2) {
      secondPageButton.classList.add("active");
    }
    secondPageButton.addEventListener("click", () => {
      currentPage2 = 2;
      displayDataOnPage2(data, currentPage2);
    });
    paginationElement.appendChild(secondPageButton);
  }

  // Hiển thị nút và dấu "..." cho các trang ở giữa
  if (totalPages > 5) {
    // Hiển thị nút cho trang trước "..."
    if (currentPage2 > 3) {
      const prevEllipsis = document.createElement("span");
      prevEllipsis.textContent = "...";
      paginationElement.appendChild(prevEllipsis);
    }

    // Hiển thị nút cho các trang ở giữa
    const startPage = Math.max(currentPage2 - 2, 3);
    const endPage = Math.min(currentPage2 + 2, totalPages - 2);

    for (let i = startPage; i <= endPage; i++) {
      const pageButton = document.createElement("button");
      pageButton.textContent = i;
      if (i === currentPage2) {
        pageButton.classList.add("active");
      }
      pageButton.addEventListener("click", () => {
        currentPage2 = i;
        displayDataOnPage2(data, currentPage2);
      });
      paginationElement.appendChild(pageButton);
    }

    // Hiển thị nút cho trang sau "..."
    if (currentPage2 < totalPages - 2) {
      const nextEllipsis = document.createElement("span");
      nextEllipsis.textContent = "...";
      paginationElement.appendChild(nextEllipsis);
    }
  } else {
    // Hiển thị nút cho tất cả các trang nếu tổng số trang nhỏ hơn hoặc bằng 5
    for (let i = 3; i <= totalPages - 2; i++) {
      const pageButton = document.createElement("button");
      pageButton.textContent = i;
      if (i === currentPage2) {
        pageButton.classList.add("active");
      }
      pageButton.addEventListener("click", () => {
        currentPage2 = i;
        displayDataOnPage2(data, currentPage2);
      });
      paginationElement.appendChild(pageButton);
    }
  }

  // Hiển thị nút cho trang cuối cùng
  const lastPageButton = document.createElement("button");
  lastPageButton.textContent = totalPages;
  if (totalPages === currentPage2) {
    lastPageButton.classList.add("active");
  }
  lastPageButton.addEventListener("click", () => {
    currentPage2 = totalPages;
    displayDataOnPage2(data, currentPage2);
  });
  paginationElement.appendChild(lastPageButton);

  // Hiển thị nút "Trang sau" và xử lý sự kiện khi nhấn
  const nextButton = document.createElement("button");
  nextButton.textContent = "Trang sau";
  nextButton.addEventListener("click", () => {
    if (currentPage2 < totalPages) {
      currentPage2++;
      displayDataOnPage2(data, currentPage2);
    }
  });
  paginationElement.appendChild(nextButton);

  // Hiển thị phân trang trong phần tử HTML
  dataTableElement2.appendChild(paginationElement);
}




// Lấy tham chiếu đến phần tử HTML table để hiển thị dữ liệu

// Hàm để tải dữ liệu từ API và hiển thị nó trong bảng
function fetchDataAndDisplay2() {
  fetch("/api/sensor_data1")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Sắp xếp dữ liệu theo thời gian giảm dần
      data.sort((a, b) => {
        const dateA = new Date(a.timestamp);
        const dateB = new Date(b.timestamp);
      
        // So sánh ngày
        if (dateA > dateB) {
          return -1;
        } else if (dateA < dateB) {
          return 1;
        } else {
          return 0;
        }
      });
      // Hiển thị dữ liệu trên trang hiện tại
      displayDataOnPage2(data, currentPage2);
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

// Gọi hàm để tải và hiển thị dữ liệu
fetchDataAndDisplay2();

// Sử dụng setInterval để cập nhật dữ liệu mỗi 5 giây
setInterval(fetchDataAndDisplay2, 1000);
