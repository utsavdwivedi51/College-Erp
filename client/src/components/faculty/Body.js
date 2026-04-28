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
import ReplyIcon from "@mui/icons-material/Reply";
import ShowNotice from "../notices/ShowNotice";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
const Body = () => {
  const [value, onChange] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [openNotice, setOpenNotice] = useState({});
  const notices = useSelector((state) => state.admin.notices.result);
  const dashboardStats = useSelector((state) => state.faculty.dashboardStats);
  const classAverageData = dashboardStats?.classAverageData || [];
  const attendanceTrendsData = dashboardStats?.attendanceTrendsData || [];
  const topPerformers = dashboardStats?.topPerformers || [];
  const bottomPerformers = dashboardStats?.bottomPerformers || [];

  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        <div className="flex text-gray-400 items-center space-x-2">
          <HomeIcon />
          <h1>Dashboard</h1>
        </div>
        <div className="flex flex-col mr-5 space-y-4 overflow-y-auto pr-2 pb-2">
          <div className="bg-white h-[8rem] rounded-xl shadow-lg grid grid-cols-4 justify-between px-8 items-center space-x-4">
            <div className="flex items-center space-x-4 border-r-2">
              <EngineeringIcon
                className="rounded-full py-2 bg-orange-300"
                sx={{ fontSize: 40 }}
              />
              <div className="flex flex-col">
                <h1>Class</h1>
                <h2 className="text-2xl font-bold">12</h2>
              </div>
            </div>
            <div className="flex items-center space-x-4 border-r-2">
              <BoyIcon
                className="rounded-full py-2 bg-orange-300"
                sx={{ fontSize: 40 }}
              />
              <div className="flex flex-col">
                <h1>Student</h1>
                <h2 className="text-2xl font-bold">10</h2>
              </div>
            </div>
            <div className="flex items-center space-x-4 border-r-2">
              <SupervisorAccountIcon
                className="rounded-full py-2 bg-orange-300"
                sx={{ fontSize: 40 }}
              />
              <div className="flex flex-col">
                <h1>Subject</h1>
                <h2 className="text-2xl font-bold">5</h2>
              </div>
            </div>
            <div className="flex items-center space-x-4 ">
              <MenuBookIcon
                className="rounded-full py-2 bg-orange-300"
                sx={{ fontSize: 40 }}
              />
              <div className="flex flex-col">
                <h1>Test</h1>
                <h2 className="text-2xl font-bold">3</h2>
              </div>
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="flex flex-col space-y-4 w-2/6">
              <div className="bg-white h-[17rem] rounded-xl shadow-lg">
                <Calendar onChange={onChange} value={value} />
              </div>
            </div>
            <div className="bg-white h-[17rem] w-full rounded-xl shadow-lg flex flex-col  pt-3">
              <div className="flex px-3">
                {open && (
                  <ReplyIcon
                    onClick={() => setOpen(false)}
                    className="cursor-pointer"
                  />
                )}
                <h1 className="font-bold text-xl w-full text-center">
                  Notices
                </h1>
              </div>
              <div className="mx-5 mt-5 space-y-3 overflow-y-auto h-[12rem]">
                {!open ? (
                  notices?.map((notice, idx) => (
                    <div
                      onClick={() => {
                        setOpen(true);
                        setOpenNotice(notice);
                      }}
                      className="">
                      <Notice idx={idx} notice={notice} notFor="student" />
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
              <h2 className="text-slate-700 font-semibold">Teaching Insights</h2>
              <span className="text-xs text-slate-400">
                Based on department test data
              </span>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-2">
                  Class Average per Test
                </h3>
                <div className="h-56">
                  {classAverageData.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={classAverageData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="average" fill="#f97316" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-sm text-slate-400">
                      No test averages yet.
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-2">
                  Attendance Trends by Subject
                </h3>
                <div className="h-56">
                  {attendanceTrendsData.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={attendanceTrendsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="percentage"
                          stroke="#0ea5e9"
                          strokeWidth={3}
                          dot={{ r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-sm text-slate-400">
                      No attendance trend data yet.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-2">
                  Top Performers (Avg. Marks)
                </h3>
                <div className="h-48">
                  {topPerformers.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topPerformers} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis type="number" tick={{ fontSize: 11 }} />
                        <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={90} />
                        <Tooltip />
                        <Bar dataKey="average" fill="#22c55e" radius={[0, 6, 6, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-sm text-slate-400">
                      No performer data yet.
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-2">
                  Bottom Performers (Avg. Marks)
                </h3>
                <div className="h-48">
                  {bottomPerformers.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={bottomPerformers} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis type="number" tick={{ fontSize: 11 }} />
                        <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={90} />
                        <Tooltip />
                        <Bar dataKey="average" fill="#ef4444" radius={[0, 6, 6, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-sm text-slate-400">
                      No performer data yet.
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
