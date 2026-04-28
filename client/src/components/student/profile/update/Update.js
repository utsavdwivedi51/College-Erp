import React, { useEffect } from "react";
import Body from "./Body";
import Header from "../../Header";
import Sidebar from "../../Sidebar";
import { useDispatch } from "react-redux";
import { getAllDepartment } from "../../../../redux/actions/adminActions";

const Update = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllDepartment());
  }, [dispatch]);

  return (
    <div className="bg-gradient-to-br from-slate-100 via-cyan-50 to-blue-100 min-h-screen flex items-center justify-center p-4 md:p-6">
      <div className="flex flex-col bg-slate-50/95 h-[95vh] w-full rounded-3xl shadow-2xl shadow-slate-300/50 space-y-4 overflow-hidden border border-white/60">
        <Header />
        <div className="flex flex-[0.95] px-4 pb-4 gap-3 overflow-hidden">
          <Sidebar />
          <Body />
        </div>
      </div>
    </div>
  );
};

export default Update;
