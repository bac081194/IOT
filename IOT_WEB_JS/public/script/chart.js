document.addEventListener("DOMContentLoaded", function () {
  let chart = null; // Biến để lưu đối tượng biểu đồ

  // Hàm để cập nhật hoặc vẽ biểu đồ mới
  function updateChart(data) {
    // Chuyển đổi giá trị "light" từ khoảng 99-1024 thành 1-100 (đảo ngược)
    function mapLightValue(light) {
      return (100 - ((light - 99) / (1024 - 99)) * 100).toFixed(2); // Định dạng giá trị light với 2 chữ số sau dấu phẩy
    }
  
    const chartOptions = {
      chart: {
        type: "area", // Thay đổi loại biểu đồ thành "area"
        height: 520,
        colors: ["#FD7238", "#3C91E6", "#FFCE26", "#FF5733"], // Thêm màu cho "db"
        animations: {
          enabled: false, // Tắt chuyển động khi biểu đồ được tải lại
        },
      },
      xaxis: {
        type: "datetime",
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return parseInt(value); // Định dạng giá trị trục tung thành số nguyên
          },
        },
      },
      series: [
        {
          name: "Humidity",
          data: data.map((record) => [
            new Date(record.timestamp).getTime(),
            record.humidity,
          ]),
        },
        {
          name: "Temperature",
          data: data.map((record) => [
            new Date(record.timestamp).getTime(),
            record.temperature,
          ]),
          color: "#d52121",
        },
      ],
      dataLabels: {
        enabled: true, // Cho phép hiển thị dấu dữ liệu trên biểu đồ
      },
      stroke: {
        curve: "smooth",
      },
      fill: {
        type: "gradient",
        gradient: {
          opacityFrom: 0.6,
          opacityTo: 0.8,
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
      },
    };
  
    // Kiểm tra xem biểu đồ đã tồn tại chưa
    if (chart) {
      chart.updateOptions(chartOptions);
    } else {
      chart = new ApexCharts(document.querySelector("#chart"), chartOptions);
      chart.render();
    }
  }

  // Hàm để lấy dữ liệu và cập nhật biểu đồ
  function fetchDataAndDisplay() {
    fetch("/latest_sensor_data")
      .then((response) => response.json())
      .then((data) => {
        // Xử lý dữ liệu và cắt nó thành 10 bản ghi
        const slicedData = data.slice(0, 10);

        // Điều chỉnh múi giờ thành GMT+8 (UTC+8)
        const adjustedData = slicedData.map((record) => {
          const timestamp = new Date(record.timestamp);
          timestamp.setHours(timestamp.getHours() + 7);
          return { ...record, timestamp: timestamp.toISOString() };
        });

        console.log("Dữ liệu mới nhất:", adjustedData);
        updateChart(adjustedData);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu:", error);
      });
  }

  // Ban đầu, gọi fetchDataAndDisplay một lần
  fetchDataAndDisplay();

  // Sử dụng setInterval để gọi nó sau mỗi giây và cập nhật biểu đồ
  setInterval(fetchDataAndDisplay, 1000);
});
