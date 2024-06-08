export function addToCart(item) {
  return new Promise(async (resolve) => {
    const response = await fetch("http://localhost:8000/cart", {
      method: "POST",
      body: JSON.stringify(item),
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    // TODO: on server it will only return some info of user (not password)
    resolve({ data });
  });
}

// Will display in cart page
export function fetchItemsByUserId() {
  return new Promise(async (resolve) => {
    //TODO: we will not hard-code server URL here
    const response = await fetch("http://localhost:8000/cart");
    const data = await response.json();
    resolve({ data });
  });
}

// Quantity Changes
export function updateCart(update) {
  return new Promise(async (resolve) => {
    const response = await fetch("http://localhost:8000/cart/" + update.id, {
      method: "PATCH",
      body: JSON.stringify(update),
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    // TODO: on server it will only return some info of user (not password)
    resolve({ data });
  });
}

export function deleteItemFromCart(itemId) {
  return new Promise(async (resolve) => {
    const response = await fetch("http://localhost:8000/cart/" + itemId, {
      method: "DELETE",
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    // TODO: on server it will only return some info of user (not password)
    resolve({ data: { id: itemId } });
  });
}

export function resetCart() {
  // get all items of user's cart - and then delete each

  // we have to remove all the items
  return new Promise(async (resolve) => {
    const response = await fetchItemsByUserId(); // json mein convert krchuka already since method mein defined
    const items = response.data;
    for (let item of items) {
      // jitna items us mein sy
      await deleteItemFromCart(item.id); // delete method wants the id
    }
    resolve({ status: "success" }); // pta chal jata
  });
}
