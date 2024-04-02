export function createOrder(order) {
  return new Promise(async (resolve) => {
    //TODO: we will not hard-code server URL here
    const response = await fetch("http://localhost:8080/orders", {
      method: "POST",
      body: JSON.stringify(order),
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    resolve({ data });
  });
}

export function fetchAllOrders(sort, pagination) {
  let queryString = "";

  for (let key in sort) {
    queryString += `${key}=${sort[key]}&`;
  }

  for (let key in pagination) {
    queryString += `${key}=${pagination[key]}&`;
  }

  return new Promise(async (resolve) => {
    //TODO: we will not hard-code server URL here
    const response = await fetch("http://localhost:8080/orders?" + queryString);
    //   const data = await response.json();

    //   // Pagination

    //   resolve({ data: { orders: data, totalOrders: +totalOrders } });
    const data = await response.json();
    console.log("Data is: ", data);
    const totalOrders = await response.headers.get("X-Total-Count");
    // 2nd one is what we passing that is taken above
    resolve({ data: { orders: data, totalOrders: +totalOrders } });
  });
}

// Update order
export function updateOrder(order) {
  return new Promise(async (resolve) => {
    const response = await fetch("http://localhost:8080/orders/" + order.id, {
      method: "PATCH",
      body: JSON.stringify(order),
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    resolve({ data });
  });
}
