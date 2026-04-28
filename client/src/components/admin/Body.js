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
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
const Body = () => {
  const [open, setOpen] = useState(false);
  const [openNotice, setOpenNotice] = useState({});
  const notices = useSelector((state) => state.admin.notices.result);
  const [value, onChange] = useState(new Date());
  const students = useSelector((state) => state.admin.allStudent);
  const faculties = useSelector((state) => state.admin.allFaculty);
  const admins = useSelector((state) => state.admin.allAdmin);
  const departments = useSelector((state) => state.admin.allDepartment);
  const dashboardStats = useSelector((state) => state.admin.dashboardStats);
  const passPercentageData = dashboardStats?.passPercentageData || [];
  const facultyDistributionData =
    dashboardStats?.facultyDistributionData || [];
  const enrollmentTrendsData = dashboardStats?.enrollmentTrendsData || [];
  const pieColors = ["#6366f1", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444"];

  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        <div className="flex text-slate-500 items-center space-x-2">
          <HomeIcon />
          <h1 className="font-semibold">Dashboard</h1>
        </div>
        <div className="flex flex-col mr-5 space-y-4 overflow-y-auto pr-2 pb-2">
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
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-slate-700 font-semibold">Analytics Overview</h2>
              <span className="text-xs text-slate-400">
                Updated with latest tests & attendance
              </span>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-2">
                  Department-wise Pass %
                </h3>
                <div className="h-56">
                  {passPercentageData.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={passPercentageData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="passPercentage" fill="#6366f1" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-sm text-slate-400">
                      No pass percentage data yet.
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-2">
                  Faculty Load Distribution
                </h3>
                <div className="h-56">
                  {facultyDistributionData.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Tooltip />
                        <Legend />
                        <Pie
                          data={facultyDistributionData}
                          dataKey="count"
                          nameKey="name"
                          innerRadius={45}
                          outerRadius={80}
                          paddingAngle={4}
                        >
                          {facultyDistributionData.map((entry, index) => (
                            <Cell
                              key={`cell-${entry.name}-${index}`}
                              fill={pieColors[index % pieColors.length]}
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-sm text-slate-400">
                      No faculty distribution data yet.
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-2">
                  Enrollment Trends
                </h3>
                <div className="h-56">
                  {enrollmentTrendsData.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={enrollmentTrendsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="students"
                          stroke="#0ea5e9"
                          strokeWidth={3}
                          dot={{ r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-sm text-slate-400">
                      No enrollment trend data yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
