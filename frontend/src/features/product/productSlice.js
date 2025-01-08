import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchProductsByFilters,
  fetchBrands,
  fetchCategories,
  fetchProductById,
  createProduct,
  updateProduct,
  createCategory,
  fetchCategoryById,
  updateCategory,
  deleteCategory,
} from "./productAPI";

const initialState = {
  products: [],
  brands: [],
  categories: [],
  status: "idle",
  totalItems: 0,
  selectedProduct: null,
  selectedCategory: null,
};

export const fetchProductByIdAsync = createAsyncThunk(
  "product/fetchProductById",
  async (id) => {
    const response = await fetchProductById(id);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const fetchProductsByFiltersAsync = createAsyncThunk(
  "product/fetchProductsByFilters",
  async ({ filter, sort, pagination, admin }) => {
    const response = await fetchProductsByFilters(
      filter,
      sort,
      pagination,
      admin
    );
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

// For admin
export const createProductAsync = createAsyncThunk(
  "product/create",
  async (product, { rejectWithValue }) => {
    try {
      const response = await createProduct(product);
      return response.data;
    } catch (error) {
      // Pass the error message to the rejected action
      return rejectWithValue(error.message || error.error || "Unknown error");
    }
  }
);

export const updateProductAsync = createAsyncThunk(
  "product/update",
  async (update) => {
    console.log(update);
    const response = await updateProduct(update);
    return response.data;
  }
);

// categories
export const fetchBrandsAsync = createAsyncThunk(
  "product/fetchBrands",
  async () => {
    const response = await fetchBrands();
    // The value we return becomes the `fulfilled` action payload
    console.log(response.data);
    return response.data;
  }
);
export const fetchCategoriesAsync = createAsyncThunk(
  "product/fetchCategories",
  async () => {
    const response = await fetchCategories();
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const fetchCategoryByIdAsync = createAsyncThunk(
  "product/fetchCategoryById",
  async (id) => {
    const response = await fetchCategoryById(id);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const createCategoryAsync = createAsyncThunk(
  "category/create",
  async (category, { rejectWithValue }) => {
    try {
      const response = await createCategory(category);
      return response.data;
    } catch (error) {
      // Pass the error message to the rejected action
      return rejectWithValue(error.message || error.error || "Unknown error");
    }
  }
);

export const updateCategoryAsync = createAsyncThunk(
  "category/update",
  async (update) => {
    const response = await updateCategory(update);
    return response.data;
  }
);

export const deleteCategoryAsync = createAsyncThunk(
  "category/delete",
  async (id) => {
    const response = await deleteCategory(id);
    return response.data;
  }
);

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsByFiltersAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductsByFiltersAsync.fulfilled, (state, action) => {
        state.status = "idle";
        // state.products = action.payload;
        state.products = action.payload.products;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchProductByIdAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductByIdAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.selectedProduct = action.payload;
      })
      .addCase(createProductAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createProductAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.products.push(action.payload);
      })
      .addCase(updateProductAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProductAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.products.findIndex(
          // product ka jo index and jo action.payload mein aya jo update krne ke lia aya wo match?
          (product) => product.id === action.payload.id
        );
        // if then yes products mein wo wala py index py action.payload
        state.products[index] = action.payload;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchBrandsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBrandsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.brands = action.payload;
      })
      .addCase(fetchCategoriesAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategoriesAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.categories = action.payload;
      })
      .addCase(createCategoryAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createCategoryAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.categories.push(action.payload);
      })
      .addCase(fetchCategoryByIdAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategoryByIdAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.selectedCategory = action.payload;
      })
      .addCase(updateCategoryAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCategoryAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.categories.findIndex(
          (product) => product.id === action.payload.id
        );
        state.categories[index] = action.payload;
        state.selectedCategory = action.payload;
      })
      .addCase(deleteCategoryAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteCategoryAsync.fulfilled, (state, action) => {
        state.status = "idle";
      });
  },
});

export const { clearSelectedProduct } = productSlice.actions;
export const { clearSelectedCategory } = productSlice.actions;

export const selectAllProducts = (state) => state.product.products;
export const selectProductById = (state) => state.product.selectedProduct;

export const selectTotalItems = (state) => state.product.totalItems;

export const selectBrands = (state) => state.product.brands;
export const selectCategories = (state) => state.product.categories;
export const selectCategoryById = (state) => state.product.selectedCategory;

export const selectProductListStatus = (state) => state.product.status;

export default productSlice.reducer;
