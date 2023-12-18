const express = require("express");
const mysql = require("mysql2");
const mqtt = require("mqtt");
const app = express();
const apiRoutes = require("./routes/api");

const http = require("http");
const socketIo = require("socket.io");
const server = http.createServer(app);
const io = socketIo(server);

const path = require("path");
const { Chart } = require("chart.js"); // Import thư viện Chart.js

const bodyParser = require("body-parser");

const brokerAddress = 'mqtt://mqtt-dashboard.com';
const brokerPort = 1883;
const mqttClient = mqtt.connect(brokerAddress + ':' + brokerPort);

// const mqttClient = mqtt.connect("mqtt://192.168.123.58");

const port = 8082;

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123",
  database: "iot",
  
});

db.connect((err) => {
  if (err) {
    console.error("Không thể kết nối với cơ sở dữ liệu:", err);
    return;
  }
  console.log("Đã kết nối với cơ sở dữ liệu MySQL");

  db.query(
    `CREATE TABLE IF NOT EXISTS sensor_data1 (
    id INT AUTO_INCREMENT PRIMARY KEY,
    temperature FLOAT,
    humidity INT,
    light INT,
    state_1 INT,
    state_2 INT,
    state_3 INT,
    db INT,
    timestamp DATETIME 
  )`,
    (err, results) => {
      if (err) {
        console.error("Lỗi khi tạo bảng:", err);
      } else {
        console.log("Đã tạo bảng sensor_data1 hoặc bảng đã tồn tại.");
      }
    }
  );
});

const client = mqtt.connect(brokerAddress + ':' + brokerPort);
// const client = mqtt.connect("mqtt://192.168.123.58");

client.on("connect", () => {
  console.log("Đã kết nối thành công đến máy chủ MQTT");
  client.subscribe("DOOR"); 
});

client.on("message", (topic, message) => {
  console.log(`Nhận dữ liệu từ chủ đề '${topic}': ${message.toString()}`);

  try {
    const jsonData = JSON.parse(message.toString());
    console.log("Dữ liệu JSON:", jsonData);
    var today = new Date();
    var date =
      today.getDate() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getFullYear();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = time;

    const currentTime = new Date().toISOString().slice(0, 19).replace("T", " ");

    db.query(
      "INSERT INTO sensor_data1 (temperature, humidity, state_1, state_2, state_3, db, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        jsonData.temperature,
        jsonData.humidity,
        jsonData.state_1,
        jsonData.state_2,
        jsonData.state_3,
        jsonData.db,
        today,
      ],
      (err, results) => {
        if (err) {
          console.error("Lỗi khi thêm dữ liệu vào cơ sở dữ liệu:", err);
        } else {
          console.log("Đã thêm dữ liệu vào cơ sở dữ liệu.");
        }
      }
    );
  } catch (error) {
    console.error("Lỗi khi chuyển đổi dữ liệu JSON:", error);
  }
});

const chartData = {
  labels: [],
  datasets: [
    {
      label: "Temperature",
      borderColor: "rgb(255, 99, 132)",
      data: [],
    },
    {
      label: "Humidity",
      borderColor: "rgb(75, 192, 192)",
      data: [],
    },
  ],
};

// io.on("connection", (socket) => {
//   socket.emit("chartData", chartData);
//   socket.on("message", (data) => {
//     console.log("Received from server:", data);
//   });
// });

mqttClient.on("connect", () => {
  console.log("Đã kết nối thành công với MQTT broker");
});

mqttClient.on("error", (error) => {
  console.error("Không thể kết nối đến MQTT broker:", error);
});

app.use(bodyParser.json());

app.post("/control-relay", (req, res) => {
  const { relay1, relay2, relay3 } = req.body;

  // Kiểm tra và gửi thông điệp tới MQTT broker để điều khiển Đèn 
  if (relay1 === "on") {
    mqttClient.publish("LED", "1"); // Gửi lệnh bật Đèn 
    console.log(relay1)
  } else if (relay1 === "off") {
    mqttClient.publish("LED", "0"); // Gửi lệnh tắt Đèn 
    console.log(relay1)
  }

  // Kiểm tra và gửi thông điệp tới MQTT broker 
  if (relay2 === "on") {
    mqttClient.publish("DOOR", "1");
  } else if (relay2 === "off") {
    mqttClient.publish("DOOR", "0");
  }

  // Kiểm tra và gửi thông điệp tới MQTT broker 
  if (relay3 === "on") {
    mqttClient.publish("AIR", "1"); // Gửi lệnh bật Đèn 3
    
  } else if (relay3 === "off") {
    mqttClient.publish("AIR", "0"); // Gửi lệnh tắt Đèn 3
  }
  // console.log("đã điều khiển được cả 3 đèn")
  // res.status(200).json({ message: "Đã điều khiển đèn" });
});

// Tạo route cho đường dẫn /latest_sensor_data
// app.get("/latest_sensor_data", (req, res) => {
//   // Thực hiện truy vấn SQL hoặc lấy dữ liệu từ nguồn nào đó
//   // Ví dụ: Lấy dữ liệu từ cơ sở dữ liệu và trả về dưới dạng JSON
//   db.query(
//     "SELECT * FROM sensor_data1 ORDER BY timestamp DESC LIMIT 10",
//     (err, results) => {
//       if (err) {
//         console.error("Lỗi khi lấy dữ liệu:", err);
//         res.status(500).send("Lỗi khi lấy dữ liệu từ cơ sở dữ liệu.");
//       } else {
//         // Trả về dữ liệu dưới dạng JSON
//         res.json(results);
//       }
//     }
//   );
// });

// function predictTemp(temperature, humidity) {
//     var url = 'http://127.0.0.1:5000/temp/v1/predict';
//     var data = { temperature: temperature, humidity: humidity };

//     fetch(url, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//     })
//     .then(response => response.json())
//     .then(result => {
//         console.log(result);
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });
// }

// // Example usage
// predictTemp(42, 65);

app.get("/mqtt-data", (req, res) => {
  const mqttData = {
    relay1: "off",
    relay2: "off",
    relay3: "off", // Đọc trạng thái Đèn 3 từ MQTT broker
  };

  res.json(mqttData);
});

app.use("/api", apiRoutes);

app.use(express.static("public"));
app.use(express.static("views"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
