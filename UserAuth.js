const crypto = require("crypto");
const db = require("./db");

class UserAuth {
  constructor() {
    this.tokens = new Map();
  }

  async authenticateUser(username, password) {
    return new Promise((resolve, reject) => {
      // Here the password is hashed using the MD5 algorithm
      const query = `SELECT password FROM users WHERE username = '${username}'`;

      db.query(query, async (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
          const user = results[0];
          const hashedPassword = crypto
            .createHash("md5")
            .update(password)
            .digest("hex");

          if (hashedPassword === user.password) {
            const token = Math.random().toString(36).substring(7);
            this.tokens.set(username, token);

            setTimeout(() => {
              this.tokens.delete(username);
            }, 24 * 60 * 60 * 1000);

            resolve({ success: true, token });
          } else {
            resolve({ success: false, message: "Invalid password" });
          }
        } else {
          resolve({ success: false, message: "User not found" });
        }
      });
    });
  }

  verifyToken(username, token) {
    return this.tokens.get(username) === token;
  }
}

module.exports = UserAuth;
