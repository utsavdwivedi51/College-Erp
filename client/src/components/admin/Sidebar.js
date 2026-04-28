import React, { useCallback, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import EngineeringIcon from "@mui/icons-material/Engineering";
import AddIcon from "@mui/icons-material/Add";
import BoyIcon from "@mui/icons-material/Boy";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import StorageIcon from "@mui/icons-material/Storage";
import { useDispatch } from "react-redux";
import decode from "jwt-decode";
const isNotActiveStyle =
  "flex items-center rounded-xl px-4 gap-3 text-slate-500 hover:text-slate-800 transition-all duration-200 ease-in-out capitalize hover:bg-slate-100 py-2.5 my-1.5 mx-2";
const isActiveStyle =
  "flex items-center rounded-xl px-4 gap-3 text-blue-700 bg-blue-50 border border-blue-100 transition-all duration-200 ease-in-out capitalize py-2.5 my-1.5 mx-2 shadow-sm";

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
  // useEffect(() => {
  //   if (rf === "home") {
  //     elRef[0].current.scrollIntoView({
  //       behavior: "smooth",
  //       block: "end",
  //       inline: "nearest",
  //     });
  //   }
  // }, []);
  return (
    <div className="flex-[0.22] min-w-[240px] px-2 pb-4">
      <div className="space-y-5 overflow-y-auto scrollbar-thin scrollbar-track-white scrollbar-thumb-slate-200 h-[calc(100vh-13.5rem)] bg-white/95 border border-slate-100 rounded-2xl py-3 shadow-sm">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold px-4 pb-1">
            Overview
          </p>
          <NavLink
            to="/admin/home"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <HomeIcon className="" />
            <h1 className="font-medium">Dashboard</h1>
          </NavLink>
          <NavLink
            to="/admin/profile"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <AssignmentIndIcon className="" />
            <h1 className="font-medium">Profile</h1>
          </NavLink>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold px-4 pb-1">
            Communication
          </p>
          <NavLink
            to="/admin/createnotice"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <AddIcon className="" />
            <h1 className="font-medium">Create Notice</h1>
          </NavLink>
          <NavLink
            to="/admin/bulk-operations"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <StorageIcon className="" />
            <h1 className="font-medium">Bulk Operations</h1>
          </NavLink>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold px-4 pb-1">
            Admins
          </p>
          <NavLink
            to="/admin/addadmin"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <AddIcon className="" />
            <h1 className="font-medium">Add Admin</h1>
          </NavLink>
          <NavLink
            to="/admin/deleteadmin"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <DeleteIcon className="" />
            <h1 className="font-medium">Delete Admin</h1>
          </NavLink>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold px-4 pb-1">
            Departments
          </p>
          <NavLink
            to="/admin/adddepartment"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <AddIcon className="" />
            <h1 className="font-medium">Add Department</h1>
          </NavLink>
          <NavLink
            to="/admin/deletedepartment"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <DeleteIcon className="" />
            <h1 className="font-medium">Delete Department</h1>
          </NavLink>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold px-4 pb-1">
            Faculty
          </p>
          <NavLink
            to="/admin/allfaculty"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <EngineeringIcon className="" />
            <h1 className="font-medium">Our Faculty</h1>
          </NavLink>

          <NavLink
            to="/admin/addfaculty"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <AddIcon className="" />
            <h1 className="font-medium">Add Faculty</h1>
          </NavLink>
          <NavLink
            to="/admin/deletefaculty"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <DeleteIcon className="" />
            <h1 className="font-medium">Delete Faculty</h1>
          </NavLink>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold px-4 pb-1">
            Students
          </p>
          <NavLink
            to="/admin/allstudent"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <BoyIcon className="" />
            <h1 className="font-medium">Our Students</h1>
          </NavLink>

          <NavLink
            to="/admin/addstudent"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <AddIcon className="" />
            <h1 className="font-medium">Add Students</h1>
          </NavLink>
          <NavLink
            to="/admin/deletestudent"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <DeleteIcon className="" />
            <h1 className="font-medium">Delete Student</h1>
          </NavLink>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold px-4 pb-1">
            Subjects
          </p>
          <NavLink
            to="/admin/allsubject"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <MenuBookIcon className="" />
            <h1 className="font-medium">Subjects</h1>
          </NavLink>

          <NavLink
            to="/admin/addsubject"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <AddIcon className="" />
            <h1 className="font-medium">Add Subject</h1>
          </NavLink>
          <NavLink
            to="/admin/deletesubject"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <DeleteIcon className="" />
            <h1 className="font-medium">Delete Subject</h1>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
