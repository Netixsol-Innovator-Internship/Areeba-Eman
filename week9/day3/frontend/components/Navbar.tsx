"use client";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/store/store";
import { logout } from "@/store/authSlice";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  return (
    <nav className="flex justify-between items-center bg-gray-800 text-white p-4">
      <h1 className="text-xl font-bold">Chat App</h1>
      {token && (
        <div className="flex items-center gap-4">
          <span>Hi, {user?.email}</span>
          <button
            onClick={() => {
              dispatch(logout());
              router.push("/login");
            }}
            className="bg-red-500 px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
