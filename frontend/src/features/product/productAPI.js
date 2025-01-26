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
    const response = await fetch(`/products/${id}`);
    // /products?id=${id}
    const data = await response.json();
    resolve({ data });
  });
}

// For admin
export function createProduct(product) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`/products`, {
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
    const response = await fetch(`/products/` + update.id, {
      method: "PATCH",
      body: JSON.stringify(update),
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    console.log(data);
    // TODO: on server it will only return some info of user (not password)
    resolve({ data });
  });
}

// admin thing

export function fetchProductsByFilters(filter, sort, pagination, admin) {
  let queryString = "";

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
    const response = await fetch(`/products?` + queryString);
    const data = await response.json();
    console.log(data);
    // const totalItems = await response.headers.get("X-Total-Count");
    resolve({ data: { products: data.products, totalItems: data.totalItems } });
  });
}

export function fetchCategories() {
  return new Promise(async (resolve) => {
    const response = await fetch(`/categories`);
    const data = await response.json();
    resolve({ data });
  });
}

export function fetchBrands() {
  return new Promise(async (resolve) => {
    const response = await fetch(`/brands`);
    const data = await response.json();
    resolve({ data });
  });
}

export function createCategory(category) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`/categories`, {
        method: "POST",
        body: JSON.stringify(category),
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
      reject({ message: "Failed to create category", error: err });
    }
  });
}

export function fetchCategoryById(id) {
  return new Promise(async (resolve) => {
    const response = await fetch(`/categories/${id}`);
    const data = await response.json();
    resolve({ data });
  });
}

export function updateCategory(update) {
  return new Promise(async (resolve) => {
    const response = await fetch(`/categories/` + update.id, {
      method: "PATCH",
      body: JSON.stringify(update),
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    resolve({ data });
  });
}

export function deleteCategory(id) {
  return new Promise(async (resolve) => {
    const response = await fetch(`/categories/` + id, {
      method: "DELETE",
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    resolve({ data });
  });
}
