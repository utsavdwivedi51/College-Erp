import React, { useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import Calendar from "react-calendar";
import EngineeringIcon from "@mui/icons-material/Engineering";
import BoyIcon from "@mui/icons-material/Boy";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import "react-calendar/dist/Calendar.css";
import { useSelector } from "react-redux";
import Notice from "../notices/Notice";
import ShowNotice from "../notices/ShowNotice";
import ReplyIcon from "@mui/icons-material/Reply";
const Body = () => {
  const [open, setOpen] = useState(false);
  const [openNotice, setOpenNotice] = useState({});
  const notices = useSelector((state) => state.admin.notices.result);
  const [value, onChange] = useState(new Date());
  const students = useSelector((state) => state.admin.allStudent);
  const faculties = useSelector((state) => state.admin.allFaculty);
  const admins = useSelector((state) => state.admin.allAdmin);
  const departments = useSelector((state) => state.admin.allDepartment);

  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        <div className="flex text-slate-500 items-center space-x-2">
          <HomeIcon />
          <h1 className="font-semibold">Dashboard</h1>
        </div>
        <div className="flex flex-col mr-5 space-y-4 overflow-y-hidden">
          <div className="bg-white h-[8.75rem] rounded-2xl border border-slate-100 shadow-sm grid grid-cols-4 justify-between px-8 items-center space-x-4">
            <div className="flex items-center space-x-4 border-r border-slate-100">
              <EngineeringIcon
                className="rounded-xl p-2 bg-blue-100 text-blue-700"
                sx={{ fontSize: 40 }}
              />
              <div className="flex flex-col">
                <h1 className="text-slate-500 text-sm">Faculty</h1>
                <h2 className="text-2xl font-bold text-slate-800">{faculties?.length}</h2>
              </div>
            </div>
            <div className="flex items-center space-x-4 border-r border-slate-100">
              <BoyIcon
                className="rounded-xl p-2 bg-violet-100 text-violet-700"
                sx={{ fontSize: 40 }}
              />
              <div className="flex flex-col">
                <h1 className="text-slate-500 text-sm">Student</h1>
                <h2 className="text-2xl font-bold text-slate-800">{students?.length}</h2>
              </div>
            </div>
            <div className="flex items-center space-x-4 border-r border-slate-100">
              <SupervisorAccountIcon
                className="rounded-xl p-2 bg-cyan-100 text-cyan-700"
                sx={{ fontSize: 40 }}
              />
              <div className="flex flex-col">
                <h1 className="text-slate-500 text-sm">Admin</h1>
                <h2 className="text-2xl font-bold text-slate-800">{admins?.length}</h2>
              </div>
            </div>
            <div className="flex items-center space-x-4 ">
              <MenuBookIcon
                className="rounded-xl p-2 bg-emerald-100 text-emerald-700"
                sx={{ fontSize: 40 }}
              />
              <div className="flex flex-col">
                <h1 className="text-slate-500 text-sm">Department</h1>
                <h2 className="text-2xl font-bold text-slate-800">{departments?.length}</h2>
              </div>
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="flex flex-col space-y-4 w-2/6">
              <div className="bg-white h-[17rem] rounded-2xl border border-slate-100 shadow-sm p-2">
                <Calendar onChange={onChange} value={value} />
              </div>
            </div>
            <div className="bg-white h-[17rem] w-full rounded-2xl border border-slate-100 shadow-sm flex flex-col pt-3">
              <div className="flex px-4 items-center">
                {open && (
                  <ReplyIcon
                    onClick={() => setOpen(false)}
                    className="cursor-pointer text-slate-500 hover:text-slate-700"
                  />
                )}
                <h1 className="font-bold text-lg text-slate-800 w-full text-center">
                  Notices
                </h1>
              </div>
              <div className="mx-5 mt-4 space-y-3 overflow-y-auto h-[12rem] scrollbar-thin scrollbar-track-white scrollbar-thumb-slate-200">
                {!open ? (
                  notices?.map((notice, idx) => (
                    <div
                      key={notice?._id || idx}
                      onClick={() => {
                        setOpen(true);
                        setOpenNotice(notice);
                      }}
                      className="cursor-pointer">
                      <Notice idx={idx} notice={notice} notFor="" />
                    </div>
                  ))
                ) : (
                  <ShowNotice notice={openNotice} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
