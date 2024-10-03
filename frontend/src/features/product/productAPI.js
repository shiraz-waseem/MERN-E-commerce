// export function fetchAllProducts() {
//   return new Promise(async (resolve) => {
//     //TODO: we will not hard-code server URL here
//     const response = await fetch("/products");
//     const data = await response.json();
//     resolve({ data });
//   });
// }

export function fetchProductById(id) {
  return new Promise(async (resolve) => {
    const response = await fetch(`http://localhost:8000/products/${id}`);
    // /products?id=${id}
    const data = await response.json();
    resolve({ data });
  });
}

// For admin
export function createProduct(product) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch("http://localhost:8000/products", {
        method: "POST",
        body: JSON.stringify(product),
        headers: { "Content-Type": "application/json" },
      });

      // Check if the response is not ok (e.g., status 400 or 500)
      if (!response.ok) {
        const errorData = await response.json();
        reject(errorData); // Reject the promise with the error data
      } else {
        const data = await response.json();
        resolve({ data });
      }
    } catch (err) {
      reject({ message: "Failed to create product", error: err });
    }
  });
}

export function updateProduct(update) {
  return new Promise(async (resolve) => {
    const response = await fetch(
      "http://localhost:8000/products/" + update.id,
      {
        method: "PATCH",
        body: JSON.stringify(update),
        headers: { "content-type": "application/json" },
      }
    );
    const data = await response.json();
    // TODO: on server it will only return some info of user (not password)
    resolve({ data });
  });
}

// admin thing

export function fetchProductsByFilters(filter, sort, pagination, admin) {
  // filter = {"category":["smartphone","laptops"]}
  // sort = {_sort:"price",_order="desc"}
  // pagination = {_page:1,_limit=10}
  // TODO : on server we will support multi values in filter
  // TODO : Server will filter deleted products in case of non-admin

  let queryString = "";

  // for (let key in filter) {
  //   // queryString += `${key}=${filter[key]}&`;
  //   const categoryValues = filter[key]; // poora array agaya

  //   // last index last category value mil jana array mein sy. Future mein poora array bhej dia kre gy abhi sirf last category utha pa rha
  //   if (categoryValues.length) {
  //     const lastCategoryValue = categoryValues[categoryValues.length - 1];
  //     queryString += `${key}=${lastCategoryValue}&`;
  //   }
  // }

  for (let key in filter) {
    const categoryValues = filter[key];
    if (categoryValues.length) {
      queryString += `${key}=${categoryValues}&`;
    }
  }

  for (let key in sort) {
    // aik sy ziada values hu so for loop                 & is lia ke agy aik sy ziada bhi handle
    queryString += `${key}=${sort[key]}&`;
  }

  console.log(pagination);
  for (let key in pagination) {
    queryString += `${key}=${pagination[key]}&`;
  }

  // backend ko bata dega admin ha taky deleted wala dhek sky
  if (admin) {
    queryString += `admin=true`;
  }

  return new Promise(async (resolve) => {
    //TODO: we will not hard-code server URL here
    const response = await fetch(
      "http://localhost:8000/products?" + queryString
    );
    const data = await response.json();
    console.log(data);
    // const products = data.data;
    // console.log("products to products is: ", products);
    // const totalItems = data.items;
    // console.log(totalItems);
    // // issue yahan py arha
    // // const totalItems = response.headers.get("X-Total-Count");

    // resolve({ data: { products: products, totalItems: totalItems } });

    // New
    const totalItems = await response.headers.get("X-Total-Count");
    resolve({ data: { products: data, totalItems: +totalItems } });
  });
}

export function fetchCategories() {
  return new Promise(async (resolve) => {
    const response = await fetch("http://localhost:8000/categories");
    const data = await response.json();
    resolve({ data });
  });
}

export function fetchBrands() {
  return new Promise(async (resolve) => {
    const response = await fetch("http://localhost:8000/brands");
    const data = await response.json();
    resolve({ data });
  });
}
