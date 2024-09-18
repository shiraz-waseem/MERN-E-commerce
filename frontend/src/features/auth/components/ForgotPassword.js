import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { resetPasswordRequestAsync, selectMailSent } from "../authSlice";
import { Oval } from "react-loader-spinner";
import { toast } from "react-toastify";
const ForgotPassword = () => {
  const mailSent = useSelector(selectMailSent);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // State for error message

  console.log(error);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // console.log(errors);

  useEffect(() => {
    if (mailSent) {
      toast.success("A verification link has sent to your email account", {
        position: "bottom-right",
      });
      setLoading(false);
    }
  }, [mailSent]);

  const onSubmit = (data) => {
    setLoading(true);
    setError(null); // Clear any previous error
    dispatch(resetPasswordRequestAsync(data.email))
      .unwrap()
      .catch((error) => {
        setLoading(false);
        setError(error); // Set error message from the API
        toast.error(`${error}`, {
          position: "bottom-right",
        });
      });
  };

  return (
    <div
      className="flex min-h-full flex-1 flex-col px-6 py-12 lg:px-8"
      style={{
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
      }}
    >
      <div>
        <img
          className="mx-auto w-auto"
          src="/logo_shop.png"
          alt="Your Company"
        />
      </div>
      <div style={{ marginRight: "5rem" }}>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Enter email to reset password
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            // onSubmit={handleSubmit((data) => {
            //   setLoading(true);
            //   console.log(data.email);
            //   dispatch(resetPasswordRequestAsync(data.email));
            // })}
            className="space-y-6"
          >
            {/* field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  {...register("email", {
                    required: "email is required",
                    pattern: {
                      value: /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi,
                      message: "email not valid",
                    },
                  })}
                  type="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}

                {/* {mailSent && <p className="text-green-500">Mail Sent</p>} */}
              </div>
            </div>
            {/* Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {loading && (
                  <div style={{ marginRight: "8px" }}>
                    <Oval
                      visible={true}
                      height="1.5rem"
                      width="1.5rem"
                      color="#fff"
                      ariaLabel="oval-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                    />
                  </div>
                )}
                Send Email
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Send me back to{" "}
            <Link
              to="/login"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
