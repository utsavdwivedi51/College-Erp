import React, { useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import Calendar from "react-calendar";
import EngineeringIcon from "@mui/icons-material/Engineering";
import BoyIcon from "@mui/icons-material/Boy";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import "react-calendar/dist/Calendar.css";
import ShowNotice from "../notices/ShowNotice";
import { useSelector } from "react-redux";
import ReplyIcon from "@mui/icons-material/Reply";
import Notice from "../notices/Notice";
import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
const Body = () => {
  const [open, setOpen] = useState(false);
  const [openNotice, setOpenNotice] = useState({});
  const notices = useSelector((state) => state.admin.notices.result);
  const testResult = useSelector((state) => state.student.testResult.result);
  const attendance = useSelector((state) => state.student.attendance.result);
  const user = JSON.parse(localStorage.getItem("user"));
  const subjects = useSelector((state) => state.admin.subjects.result);
  const dashboardStats = useSelector((state) => state.student.dashboardStats);
  const radarData = dashboardStats?.radarData || [];
  const comparisonData = dashboardStats?.comparisonData || [];
  const rank = dashboardStats?.rank || "N/A";
  const totalStudentsInClass = dashboardStats?.totalStudentsInClass || 0;
  var totalAttendance = 0;
  console.log(attendance);

  attendance?.map((att) => (totalAttendance += att.attended));

  const [value, onChange] = useState(new Date());

  return (
    <div className="flex-[0.78] mt-1 overflow-y-auto pr-1">
      <div className="space-y-4">
        <div className="flex text-slate-500 items-center space-x-2">
          <HomeIcon />
          <h1 className="font-medium">Dashboard</h1>
        </div>

        <div className="flex flex-col space-y-4 overflow-y-auto pr-2 pb-2">
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm grid md:grid-cols-4 sm:grid-cols-2 gap-3 p-4">
            <div className="flex items-center space-x-4 bg-orange-50 rounded-xl px-4 py-3">
              <EngineeringIcon
                className="rounded-full py-2 bg-orange-200 text-orange-700"
                sx={{ fontSize: 40 }}
              />
              <div className="flex flex-col">
                <h1 className="text-slate-600 text-sm font-medium">Subjects</h1>
                <h2 className="text-2xl font-bold text-slate-800">{subjects?.length}</h2>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-sky-50 rounded-xl px-4 py-3">
              <BoyIcon
                className="rounded-full py-2 bg-sky-200 text-sky-700"
                sx={{ fontSize: 40 }}
              />
              <div className="flex flex-col">
                <h1 className="text-slate-600 text-sm font-medium">Tests</h1>
                <h2 className="text-2xl font-bold text-slate-800">{testResult?.length}</h2>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-emerald-50 rounded-xl px-4 py-3">
              <SupervisorAccountIcon
                className="rounded-full py-2 bg-emerald-200 text-emerald-700"
                sx={{ fontSize: 40 }}
              />
              <div className="flex flex-col">
                <h1 className="text-slate-600 text-sm font-medium">Attendance</h1>
                <h2 className="text-2xl font-bold text-slate-800">{totalAttendance}</h2>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-violet-50 rounded-xl px-4 py-3">
              <MenuBookIcon
                className="rounded-full py-2 bg-violet-200 text-violet-700"
                sx={{ fontSize: 40 }}
              />
              <div className="flex flex-col">
                <h1 className="text-slate-600 text-sm font-medium">Year</h1>
                <h2 className="text-2xl font-bold text-slate-800">{user.result.year}</h2>
              </div>
            </div>
          </div>

          <div className="flex md:flex-row flex-col gap-4">
            <div className="flex flex-col space-y-4 md:w-[30%]">
              <div className="bg-white border border-slate-100 min-h-[18rem] rounded-2xl shadow-sm p-2">
                <Calendar onChange={onChange} value={value} />
              </div>
            </div>

            <div className="bg-white border border-slate-100 min-h-[18rem] w-full rounded-2xl shadow-sm flex flex-col pt-3">
              <div className="flex px-4 items-center">
                {open && (
                  <ReplyIcon
                    onClick={() => setOpen(false)}
                    className="cursor-pointer text-slate-500 hover:text-slate-800"
                  />
                )}
                <h1 className="font-semibold text-lg text-slate-700 w-full text-center">
                  Notices
                </h1>
              </div>

              <div className="mx-4 mt-4 space-y-3 overflow-y-auto h-[13rem] pr-1">
                {!open ? (
                  notices?.map((notice, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setOpen(true);
                        setOpenNotice(notice);
                      }}
                      className="cursor-pointer rounded-xl hover:bg-slate-50 transition-colors">
                      <Notice idx={idx} notice={notice} notFor="faculty" />
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
              <h2 className="text-slate-700 font-semibold">Performance Analytics</h2>
              <span className="text-xs text-slate-400">
                Personalized insights for this term
              </span>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 xl:col-span-2">
                <h3 className="text-sm font-semibold text-slate-700 mb-2">
                  Subject-wise Performance Radar
                </h3>
                <div className="h-64">
                  {radarData.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                        <Radar
                          dataKey="score"
                          stroke="#6366f1"
                          fill="#6366f1"
                          fillOpacity={0.4}
                        />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-sm text-slate-400">
                      No performance data yet.
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 text-white rounded-2xl shadow-lg p-5 flex flex-col justify-between">
                <div>
                  <p className="text-sm uppercase tracking-wide text-white/70">Class Rank</p>
                  <h3 className="text-4xl font-semibold mt-2">#{rank}</h3>
                </div>
                <div className="text-sm text-white/80">
                  Out of {totalStudentsInClass || "-"} students
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">
                Personal vs Class Average
              </h3>
              <div className="h-64">
                {comparisonData.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="personal" fill="#22c55e" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="average" fill="#38bdf8" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-sm text-slate-400">
                    No comparison data yet.
                  </div>
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
