const express = require("express");
const mysql = require("mysql2");

const app = express();
app.use(express.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "haianh123",
  database: "sqlite",
});

connection.connect((err) => {
  if (err) {
    console.error("Kết nối thất bại:", err);
    return;
  }
  console.log("Kết nối thành công");
});

// thêm mới
app.post("/users", (req, res) => {
  const { name, email, age } = req.body;
  const sql = "INSERT INTO users (name, email, age) VALUES (?, ?, ?)";
  connection.query(sql, [name, email, age], (err, result) => {
    if (err) {
      console.error("chưa thể thêm mới người dùng", err);
      res.status(500).json({ error: "thêm mới thất bại" });
    } else {
      res.status(201).json({ message: "Thêm mới thành công" });
    }
  });
});

// lấy hết users
app.get("/users", (req, res) => {
  const sql = "SELECT * FROM users";
  connection.query(sql, (err, result) => {
    if (err) {
      console.error("Thất bại", err);
      res.status(500).json({ error: "kết nỗi thất bại" });
    } else {
      res.status(200).json(result);
    }
  });
});

// lấy theo id
app.get("/users/:id", (req, res) => {
  const userId = req.params.id;
  const sql = "SELECT * FROM users WHERE id = ?";
  connection.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Thất bại :", err);
      res.status(500).json({ error: "Chưa lấy được thông tin" });
    } else if (result.length === 0) {
      res.status(404).json({ error: "Không tồn tại" });
    } else {
      res.status(200).json(result[0]);
    }
  });
});

// update user
app.patch("/users/:id", (req, res) => {
  const userId = req.params.id;
  const { name, email, age } = req.body;
  const sql = "UPDATE users SET name=?, email=?, age=? WHERE id=?";
  connection.query(sql, [name, email, age, userId], (err, result) => {
    if (err) {
      console.error("thất bại", err);
      res.status(500).json({ error: "cập nhật thất bại" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "không tồn tại" });
    } else {
      res.status(200).json({ message: "cập nhật thành công" });
    }
  });
});

// xóa user
app.delete("/users/:id", (req, res) => {
  const userId = req.params.id;
  const sql = "DELETE FROM users WHERE id=?";
  connection.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("thất bại", err);
      res.status(500).json({ error: "xóa thất bại" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "không tồn tại" });
    } else {
      res.status(200).json({ message: "xóa thành công" });
    }
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
