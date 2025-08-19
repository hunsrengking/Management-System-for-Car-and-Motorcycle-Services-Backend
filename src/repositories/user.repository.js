const pool = require("../config/db");

class UserRepository {
  async createUser(user) {
    const [result] = await pool.execute(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, )",
      [user.username, user.email, user.password]
    );
    return { id: result.insertId, ...user };
  }

  async findByEmail(email) {
    const [rows] = await pool.execute("SELECT * FROM users WHERE email = ? AND is_delete = 0", [
      email,
    ]);
    return rows[0];
  }
  async findByUsername(username) {
    const [rows] = await pool.execute("SELECT * FROM users WHERE username = ? AND is_delete = 0", [
      username,
    ]);
    return rows[0];
  }

  async findAll() {
    const [rows] = await pool.execute("SELECT * FROM users WHERE IS_DELETE = 0");
    return rows;
  }

  async findById(id) {
    const [rows] = await pool.execute(
      "SELECT id, username, email, role, created_at FROM users WHERE id = ?",
      [id]
    );
    return rows[0];
  }
  async incrementFailedAttempts(id) {
      const [result] = await pool.execute(
        "UPDATE users SET failed_attempts = failed_attempts + 1 WHERE id = ?",
        [id]
      );
      return result.affectedRows > 0;
  }
  async resetFailedAttempts(id) {
    await pool.execute("UPDATE users SET failed_attempts = 0 WHERE id = ?", [id]);
  }

  async lockUser(id) {
    await pool.execute(
      "UPDATE users SET is_lock = 1 WHERE id = ?",
      [id]
    );
  }
  async updateUser(id, data) {
    const fields = [];
    const values = [];

    if (data.username) {
      fields.push("username = ?");
      values.push(data.username);
    }
    if (data.email) {
      fields.push("email = ?");
      values.push(data.email);
    }
    if (data.password) {
      fields.push("password = ?");
      values.push(data.password);
    }

    values.push(id);

    const [result] = await pool.execute(
      `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    return result.affectedRows > 0;
  }

  async deleteUser(id) {
    const [result] = await pool.execute("UPDATE users SET IS_DELETE = 1 WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }
}

module.exports = new UserRepository();
