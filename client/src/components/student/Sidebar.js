import React, { useCallback, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import EngineeringIcon from "@mui/icons-material/Engineering";
import BarChartIcon from "@mui/icons-material/BarChart";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { useDispatch } from "react-redux";
import decode from "jwt-decode";

const isNotActiveStyle =
  "flex items-center rounded-xl px-4 gap-3 text-slate-500 hover:text-slate-800 transition-all duration-200 ease-in-out capitalize hover:bg-slate-100 py-2.5 my-1.5 mx-2";
const isActiveStyle =
  "flex items-center rounded-xl px-4 gap-3 text-cyan-700 bg-cyan-50 border border-cyan-100 transition-all duration-200 ease-in-out capitalize py-2.5 my-1.5 mx-2 shadow-sm";

const Sidebar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = useCallback(() => {
    alert("OOPS! Your session expired. Please Login again");
    dispatch({ type: "LOGOUT" });
    navigate("/");
  }, [dispatch, navigate]);

  useEffect(() => {
    const token = user?.token;

    if (token) {
      const decodedToken = decode(token);
      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }

    setUser(JSON.parse(localStorage.getItem("user")));
  }, [logout, user?.token]);

  return (
    <div className="flex-[0.22] min-w-[240px] px-2 pb-4">
      <div className="space-y-6 overflow-y-auto scrollbar-thin scrollbar-track-white scrollbar-thumb-slate-200 h-[calc(100vh-13.5rem)] bg-white/95 border border-slate-100 rounded-2xl py-3 shadow-sm">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold px-4 pb-1">
            Overview
          </p>
          <NavLink
            to="/student/home"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <HomeIcon className="" />
            <h1 className="font-medium">Dashboard</h1>
          </NavLink>
          <NavLink
            to="/student/profile"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <AssignmentIndIcon className="" />
            <h1 className="font-medium">Profile</h1>
          </NavLink>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold px-4 pb-1">
            Academics
          </p>
          <NavLink
            to="/student/testresult"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <BarChartIcon className="" />
            <h1 className="font-medium">Test Results</h1>
          </NavLink>
          <NavLink
            to="/student/attendance"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <FactCheckIcon className="" />
            <h1 className="font-medium">Attendance</h1>
          </NavLink>
          <NavLink
            to="/student/subjectlist"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <EngineeringIcon className="" />
            <h1 className="font-medium">Subject List</h1>
          </NavLink>
          <NavLink
            to="/student/assignments"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <AssignmentTurnedInIcon className="" />
            <h1 className="font-medium">Assignments</h1>
          </NavLink>
          <NavLink
            to="/student/fees"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <ReceiptLongIcon className="" />
            <h1 className="font-medium">My Fees</h1>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
