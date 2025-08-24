import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { loginInSchema } from "../../schemas/authSchema";
import LoadingSpinner from "../shared/common/LoadingSpinner";
import { toast } from "react-toastify";
import { useLoginMutation } from "../../redux/slices/authApiSlice";
import { useSelector } from "react-redux";
import { ROLES } from "../../utils/roles";

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginInSchema)
  });

  const navigate = useNavigate();
  const location = useLocation();
  const [errorMsg, setErrorMsg] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const user = useSelector((s) => s.auth?.user);


  const onSubmit = async (data) => {
    setErrorMsg("");
    try {
      const res = await login(data).unwrap();
      toast.success(res?.message || "Logged in");

      // decide where to go
      const role = res?.data?.role || user?.role;
      const from = location.state?.from?.pathname;

      if (from) {
        return navigate(from, { replace: true });
      }

      if (role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN) {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setErrorMsg(err?.data?.message || "Login failed");
      toast.error(err?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 bg-[#f1faee]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-2xl p-6 sm:p-8 lg:p-10 w-full max-w-md sm:max-w-lg font-montserrat"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-10 text-center text-[#282828]">
          Welcome Back
        </h2>

        <div className="mb-6 sm:mb-8">
          <label className="block mb-2 sm:mb-3 font-medium text-sm sm:text-base text-[#282828]">
            Email
          </label>
          <input
            {...register("email")}
            type="email"
            placeholder="example@gmail.com"
            className={`w-full px-4 sm:px-5 py-3 sm:py-4 border-1 text-sm sm:text-base focus:outline-none focus:ring-1 transition-all ease-in-out duration-300
              ${errors.email ? "border-[#e63946] focus:ring-[#e63946]" : "border-[#282828] focus:ring-[#457b9d]"}
              ${isLoading ? "bg-gray-100 cursor-not-allowed opacity-60" : "bg-white cursor-text"}`}
          />
          {errors.email && (
            <p className="mt-2 text-sm sm:text-base text-[#e63946]">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-6 sm:mb-8">
          <label className="block mb-2 sm:mb-3 font-medium text-sm sm:text-base text-[#282828]">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            {...register("password")}
            className={`w-full px-4 sm:px-5 py-3 sm:py-4 border-1 text-sm sm:text-base focus:outline-none focus:ring-1 transition-all ease-in-out duration-300
              ${errors.password ? "border-[#e63946] focus:ring-[#e63946]" : "border-[#282828] focus:ring-[#457b9d]"}
              ${isLoading ? "bg-gray-100 cursor-not-allowed opacity-60" : "bg-white cursor-text"}`}
          />
          {errors.password && (
            <p className="mt-2 text-sm sm:text-base text-[#e63946]">{errors.password.message}</p>
          )}
        </div>

        {errorMsg && (
          <p className="mb-6 sm:mb-8 text-center text-sm sm:text-base text-[#e63946]">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 sm:py-4 text-white font-semibold text-sm sm:text-base flex items-center justify-center mb-6 sm:mb-8
            ${isLoading ? "bg-[#585757] cursor-not-allowed opacity-60" : "bg-[#282828] hover:bg-[#585757]"}`}
        >
          {isLoading ? <LoadingSpinner /> : <span>Login</span>}
        </button>

        <p className="text-center text-sm sm:text-base text-[#282828]">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium hover:underline hover:opacity-80 hover:font-semibold text-[#1d3557] cursor-pointer"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
