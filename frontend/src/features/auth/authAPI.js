export function createUser(userData) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch("http://localhost:8000/auth/signup", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: { "content-type": "application/json" },
      });
      const data = await response.json();

      if (!response.ok) {
        return reject(data); // Reject with error response
      }
      // TODO: on server it will only return some info of user (not password)
      resolve({ data });
    } catch (error) {
      // Reject if there is a network or other fetch error
      reject({ error: "Network error or server is unreachable!" });
    }
  });
}

export function loginUser(loginInfo) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        body: JSON.stringify(loginInfo),
        headers: { "content-type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        resolve({ data });
      } else {
        const error = await response.json(); // Parse the error response as JSON
        reject({ error: error.message || "Invalid email or password" });
      }
    } catch (error) {
      // Catch network or other errors and reject with a custom error message
      reject({ error: "Invalid Credentials. Please try again" });
    }
  });
}

export function checkAuth() {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch("http://localhost:8000/auth/check");
      if (response.ok) {
        const data = await response.json();
        resolve({ data });
      } else {
        const error = await response.text();
        reject(error);
      }
    } catch (error) {
      reject(error);
    }
  });
}

export function signOut(userId) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch("http://localhost:8000/auth/logout");
      if (response.ok) {
        resolve({ data: "success" });
      } else {
        const error = await response.text();
        reject(error);
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

// only backend mein email chae
export function resetPasswordRequest(email) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(
        "http://localhost:8000/auth/reset-password-request",
        {
          method: "POST",
          body: JSON.stringify({ email }),
          headers: { "content-type": "application/json" },
        }
      );
      if (response.ok) {
        const data = await response.json();
        resolve({ data });
      } else {
        const error = await response.json(); // Parse JSON error response
        reject(error.message); // Reject with the error message
      }
    } catch (error) {
      reject(error.message || "An unexpected error occurred.");
    }
  });
}

// email with token bhi chae
export function resetPassword(data) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(
        "http://localhost:8000/auth/reset-password",
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: { "content-type": "application/json" },
        }
      );
      if (response.ok) {
        const data = await response.json();
        resolve({ data });
      } else {
        const error = await response.text();
        reject(error);
      }
    } catch (error) {
      reject(error);
    }
  });
}
