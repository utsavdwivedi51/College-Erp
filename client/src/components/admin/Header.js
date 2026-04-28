import React from "react";
import { Avatar } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
const Header = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };
  return (
    <div className="flex-[0.08] flex justify-between items-center mx-5 mt-4 px-4 py-3 rounded-2xl bg-white/95 border border-slate-100 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-bold text-sm flex items-center justify-center shadow-sm">
          ERP
        </div>
        <div>
          <h1 className="font-bold text-slate-800 text-base leading-tight">
            Admin Control Center
          </h1>
          <p className="text-xs text-slate-500">Manage your campus operations</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Avatar
          src={user?.result?.avatar}
          alt={user?.result?.name?.charAt(0)}
          sx={{ width: 34, height: 34 }}
          className="border-blue-200 border"
        />
        <div className="text-right">
          <h1 className="font-semibold text-slate-700 text-sm">
            {user?.result?.name?.split(" ")[0] || "Admin"}
          </h1>
          <p className="text-xs text-slate-500">Welcome back 👋</p>
        </div>
        <LogoutIcon
          onClick={logout}
          className="cursor-pointer text-slate-600 hover:text-red-500 hover:scale-110 transition-all"
        />
      </div>
    </div>
  );
};

export default Header;
