import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useAlert } from "react-alert";
import { Oval } from "react-loader-spinner";
import "../../../responsive.css";
import {
  clearSelectedCategory,
  createCategoryAsync,
  fetchCategoryByIdAsync,
  selectCategoryById,
  updateCategoryAsync,
  updateProductAsync,
} from "../../product/productSlice";

const CategoryForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const alert = useAlert();
  const navigate = useNavigate();

  // edit
  const selectedCategory = useSelector(selectCategoryById);
  useEffect(() => {
    if (params.id) {
      dispatch(fetchCategoryByIdAsync(params.id));
    } else {
      dispatch(clearSelectedCategory());
    }
  }, [params.id, dispatch]);

  useEffect(() => {
    if (selectedCategory && params.id) {
      setValue("name", selectedCategory.label);
    }
  }, [selectedCategory, params.id, setValue]);

  return (
    <div>
      <div class="adminProductForm">
        <form
          noValidate
          onSubmit={handleSubmit(async (data) => {
            const dataSend = { value: data.name, label: data.name };
            if (params.id) {
              const dataUpdate = {
                id: params.id,
                value: data.name,
                label: data.name,
              };
              await dispatch(updateCategoryAsync(dataUpdate)).unwrap();
              alert.success("Product Updated");
              navigate("/admin");
              reset();
            } else {
              try {
                await dispatch(createCategoryAsync(dataSend)).unwrap();
                alert.success("Category Created");
                reset();
              } catch (error) {
                alert.error(`${error}`);
              }
            }
          })}
        >
          <div className="space-y-12 bg-white p-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Add Category
              </h2>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                {/* NAME */}
                <div className="sm:col-span-6">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Category Name{" "}
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
                      <input
                        type="text"
                        {...register("name", {
                          required: "Name is required",
                        })}
                        id="name"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                    {errors.name && (
                      <p style={{ color: "red" }} className="error">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {loading ? (
                <Oval
                  visible={true}
                  height="1.3rem"
                  width="1.3rem"
                  color="#fff"
                  ariaLabel="oval-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
