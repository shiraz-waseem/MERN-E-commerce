import React, { useState } from "react";
import { selectError, selectLoggedInUser } from "../authSlice";
import { Link, Navigate } from "react-router-dom";
import { loginUserAsync } from "../authSlice";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { Oval } from "react-loader-spinner";
import { toast } from "react-toastify";
const Login = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const error = useSelector(selectError);
  const user = useSelector(selectLoggedInUser);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // console.log(errors);
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Unwrap the dispatched action to handle the result or error
      await dispatch(
        loginUserAsync({
          email: data.email,
          password: data.password,
        })
      ).unwrap();

      toast.success("Logged in successfully!", {
        position: "bottom-right",
      });
    } catch (error) {
      toast.error(`Error: ${error.error || "Login failed!"}`, {
        position: "bottom-right",
      });
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {user && <Navigate to="/" replace={true}></Navigate>}
      <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
        <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
          {/* Left Side Image */}
          <div className="flex-1 bg-blue-100 text-center hidden lg:flex">
            {/* About Products */}
            <div
              className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
              style={{
                backgroundImage: "url('/login.png')",
                margin: "0 auto",
              }}
            ></div>
          </div>

          {/* Right Side Form */}
          <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
            <div>
              <img
                src="/logo_shop.png"
                alt="Logo"
                className="mx-auto"
                style={{ margin: "-70px auto", height: "40vh" }}
              />
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full flex-1" style={{ margin: "-15px" }}>
                <div className="my-6 border-b text-center">
                  <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                    Log into your account now
                  </div>
                </div>
                <form
                  noValidate
                  // onSubmit={handleSubmit((data) => {
                  //   setLoading(true);
                  //   dispatch(
                  //     loginUserAsync({
                  //       email: data.email,
                  //       password: data.password,
                  //     })
                  //   );
                  //   setLoading(false);
                  // })}
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
                      })}
                      type="password"
                      autoComplete="current-password"
                      required
                      placeholder="Enter Password"
                    />
                    {errors.password && (
                      <p className="text-red-500">{errors.password.message}</p>
                    )}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div className="mt-1">
                        {error && (
                          <p className="text-red-500">
                            {error || error.message == "Unauthorized"
                              ? "Invalid Credentials"
                              : ""}
                          </p>
                        )}
                      </div>
                      <div className="text-sm mt-1">
                        <Link
                          to="/forgot-password"
                          className="font-semibold text-indigo-600 hover:text-indigo-500"
                        >
                          Forgot password?
                        </Link>
                      </div>
                    </div>

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
                      <span className="ml-2">Sign in</span>
                    </button>
                    <p className="mt-10 text-center text-sm text-gray-500">
                      Not a member?{" "}
                      <Link
                        to="/signup"
                        className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                      >
                        Create an Account
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
