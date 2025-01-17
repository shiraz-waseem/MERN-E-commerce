import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { selectLoggedInUser, createUserAsync } from "../authSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner";
// import LogoShop from "/ecommerce.png";

const Signup = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectLoggedInUser);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Unwrap the dispatched async action to handle the result
      await dispatch(
        createUserAsync({
          email: data.email,
          password: data.password,
          addresses: [],
          role: "user",
        })
      ).unwrap();

      // Show success toast if the request is successful
      toast.success("Account Created Successfully!", {
        position: "bottom-right",
      });
    } catch (error) {
      // Handle error and show error toast
      console.log("Error: ", error);

      toast.error(
        `${error.error || error.message || "Account creation failed!"}`,
        {
          position: "bottom-right",
        }
      );
    } finally {
      setLoading(false); // Always set loading to false after request completes
    }
  };

  return (
    <>
      {user && <Navigate to="/" replace={true}></Navigate>}
      <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
        <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
          <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
            <div>
              <img
                src="/logo_shop.png"
                alt="Logo"
                className="w-mx-auto"
                style={{ margin: "-70px auto", height: "40vh" }}
              />
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full flex-1" style={{ margin: "-15px" }}>
                <div className="my-6 border-b text-center">
                  <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                    Create your account now
                  </div>
                </div>
                <form
                  noValidate
                  // className="space-y-6"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className="mx-auto max-w-xs">
                    <input
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                      id="email"
                      {...register("email", {
                        required: "email is required",
                        pattern: {
                          value: /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi,
                          message: "email not valid",
                        },
                      })}
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="Enter Email Address"
                    />
                    {errors.email && (
                      <p className="text-red-500">{errors.email.message}</p>
                    )}
                    <input
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                      id="password"
                      {...register("password", {
                        required: "password is required",
                        pattern: {
                          value:
                            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
                          message: `- at least 8 characters\n
                    - must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number\n
                    - Can contain special characters`,
                        },
                      })}
                      type="password"
                      autoComplete="current-password"
                      required
                      placeholder="Enter Password"
                    />
                    {errors.password && (
                      <p className="text-red-500">{errors.password.message}</p>
                    )}
                    <input
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                      id="confirmPassword"
                      {...register("confirmPassword", {
                        required: "confirm password is required",
                        validate: (value, formValues) =>
                          value === formValues.password ||
                          "password not matching",
                      })}
                      type="password"
                      required
                      placeholder="Confirm Password"
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                    <button
                      type="submit"
                      className="mt-5 tracking-wide font-semibold bg-blue-500 text-white w-full py-4 rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                    >
                      {loading ? (
                        <Oval
                          visible={true}
                          height="1.5rem"
                          width="1.5rem"
                          color="#fff"
                          ariaLabel="oval-loading"
                          wrapperStyle={{}}
                          wrapperClass=""
                        />
                      ) : (
                        <svg
                          className="w-6 h-6 -ml-2"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                          <circle cx="8.5" cy="7" r="4" />
                          <path d="M20 8v6M23 11h-6" />
                        </svg>
                      )}

                      <span className="ml-2">Sign Up</span>
                    </button>
                    <p className="mt-10 text-center text-sm text-gray-500">
                      Already a Member?{" "}
                      <Link
                        to="/login"
                        className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                      >
                        {" "}
                        Log In
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-blue-100 text-center hidden lg:flex">
            {/* About Products */}
            <div
              className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
              style={{
                backgroundImage: "url('/register.png')",
                margin: "0 auto",
              }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
