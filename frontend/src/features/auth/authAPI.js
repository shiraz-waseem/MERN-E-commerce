export function createUser(userData) {
  return new Promise(async (resolve) => {
    //TODO: we will not hard-code server URL here
    const response = await fetch("http://localhost:8000/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    // TODO: on server it will only return some info of user (not password)
    resolve({ data });
  });
}

export function loginUser(loginInfo) {
  return new Promise(async (resolve, reject) => {
    try {
      // const email = loginInfo.email;
      // const password = loginInfo.password;
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        body: JSON.stringify(loginInfo), // email psw bhej rhy
        headers: { "content-type": "application/json" },
      });

      // Backend py already check krrhyy

      // const data = await response.json();
      // console.log({ data });

      // if (data.length) {
      //   if (password === data[0].password) {
      //     resolve({ data: data[0] });
      //   } else {
      //     reject({ message: "wrong credentials" });
      //   }
      // } else {
      //   reject({ message: "user not found" });
      // }

      // means 200 type message agar ye na huta then ghlt email py bhi login
      if (response.ok) {
        const data = await response.json();
        resolve({ data }); // data ko resolve mein bhej degy
      } else {
        const error = await response.text(); // error text mein arha as Unauthorized
        reject(error);
      }
    } catch (error) {
      reject(error);
    }
  });
}

export function signOut(userId) {
  return new Promise(async (resolve) => {
    // TODO: on server we will remove user session info
    resolve({ data: "success" });
  });
}
