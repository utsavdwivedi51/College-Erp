import React from "react";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import SecurityUpdateIcon from "@mui/icons-material/SecurityUpdate";
import { Avatar } from "@mui/material";
import Data from "./Data";
import { useNavigate } from "react-router-dom";
const Body = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  return (
    <div className="flex-[0.78] mt-1 overflow-y-auto pr-1">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2 text-slate-500">
            <AssignmentIndIcon />
            <h1 className="font-medium">Profile</h1>
          </div>

          <div
            onClick={() => navigate("/student/update")}
            className="flex items-center gap-2 cursor-pointer bg-cyan-50 text-cyan-700 border border-cyan-100 px-3 py-1.5 rounded-xl hover:bg-cyan-100 transition-all">
            <SecurityUpdateIcon sx={{ fontSize: 20 }} />
            <h1 className="font-semibold text-sm">Update Profile</h1>
          </div>
        </div>

        <div className="w-full bg-white border border-slate-100 relative rounded-2xl shadow-sm min-h-[33rem]">
          <div className="absolute left-1/2 -translate-x-1/2 -top-9">
            <Avatar src={user.result.avatar} sx={{ width: 70, height: 70 }} />
          </div>

          <div className="overflow-y-auto h-[31rem] px-6 pt-14 pb-6">
            <div className="grid lg:grid-cols-2 gap-10">
              <div className="flex flex-col space-y-7">
                <Data label="Name" value={user.result.name} />
                <Data label="Email" value={user.result.email} />
                <Data label="Username" value={user.result.username} />
                <Data label="Department" value={user.result.department} />
                <Data label="Father's Name" value={user.result.fatherName} />
                <Data label="Mother's Name" value={user.result.motherName} />
              </div>

              <div className="flex flex-col space-y-7">
                <Data label="DOB" value={user.result.dob} />
                <Data label="Year" value={user.result.year} />
                <Data
                  label="Contact Number"
                  value={user.result.contactNumber}
                />
                <Data label="Section" value={user.result.section} />
                <Data
                  label="Father's Contact Number"
                  value={user.result.fatherContactNumber}
                />
                <Data label="Batch" value={user.result.batch} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
