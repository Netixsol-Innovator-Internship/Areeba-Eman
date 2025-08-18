import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { loginInSchema } from "../../schemas/authSchema";
import LoadingSpinner from "../shared/common/LoadingSpinner";
import api from "../../services/api";
import { toast } from "react-toastify";

const LoginForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(loginInSchema)
    });
    const { login } = useAuth();
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        setErrorMsg("");
        try {
            const res = await api.post("/auth/login", data);
            const token = res.data.data.token;
            const userData = res.data.data;
            toast.success(res?.data?.message)
            login(token, userData);
            navigate("/dashboard");
        } catch (err) {
            setErrorMsg(err.response?.data?.message || "Login failed");
            toast.error(err.response?.data?.message)
        } finally {
            setLoading(false);
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

                {/* Email */}
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
                        ${loading ? "bg-gray-100 cursor-not-allowed opacity-60" : "bg-white cursor-text"}
        `}
                    />
                    {errors.email && (
                        <p className="mt-2 text-sm sm:text-base text-[#e63946] transition-all ease-in-out duration-300">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                {/* Password */}
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
                        ${loading ? "bg-gray-100 cursor-not-allowed opacity-60" : "bg-white cursor-text"}
        `}
                    />
                    {errors.password && (
                        <p className="mt-2 text-sm sm:text-base text-[#e63946] transition-all ease-in-out duration-300">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                {/* API Error */}
                {errorMsg && (
                    <p className="mb-6 sm:mb-8 text-center text-sm sm:text-base text-[#e63946] transition-all ease-in-out duration-300">
                        {errorMsg}
                    </p>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 sm:py-4 text-white font-semibold text-sm sm:text-base flex items-center justify-center mb-6 sm:mb-8 transform transition-all ease-in-out duration-300
        ${loading ? "bg-[#585757] cursor-not-allowed opacity-60 scale-100" : "bg-[#282828] hover:bg-[#585757] cursor-pointer hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"}
        `}
                >
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <span className="inline-block rounded-lg">Login</span>
                    )}
                </button>

                {/* Sign Up Link */}
                <p className="text-center text-sm sm:text-base text-[#282828]">
                    Don't have an account?{" "}
                    <Link
                        to="/signup"
                        className="font-medium hover:underline hover:opacity-80 hover:font-semibold text-[#1d3557] cursor-pointer transition-all ease-in-out duration-300"
                    >
                        Sign Up
                    </Link>
                </p>
            </form>
        </div>

    );
};

export default LoginForm;
