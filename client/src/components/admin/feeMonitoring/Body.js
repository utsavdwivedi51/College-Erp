import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import HomeIcon from "@mui/icons-material/Home";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  assignFee,
  batchAssignFee,
  getAdminFees,
  getFeeReport,
} from "../../../redux/actions/adminActions";

const Body = () => {
  const dispatch = useDispatch();
  const students = useSelector((state) => state.admin.allStudent) || [];
  const departments = useSelector((state) => state.admin.allDepartment) || [];
  const fees = useSelector((state) => state.admin.fees) || [];
  const feeReport = useSelector((state) => state.admin.feeReport);

  const [filters, setFilters] = useState({
    department: "",
    year: "",
    section: "",
    status: "",
    search: "",
  });

  const [assignData, setAssignData] = useState({
    studentId: "",
    feeType: "Tuition",
    academicYear: "",
    semester: "",
    totalAmount: "",
    dueDate: "",
  });

  const [batchData, setBatchData] = useState({
    department: "",
    year: "",
    section: "",
    feeType: "Tuition",
    academicYear: "",
    semester: "",
    totalAmount: "",
    dueDate: "",
  });

  const [reportData, setReportData] = useState({
    department: "",
    year: "",
    section: "",
  });

  useEffect(() => {
    dispatch(getAdminFees());
  }, [dispatch]);

  const handleFilter = () => {
    dispatch(getAdminFees(filters));
  };

  const handleAssignFee = (event) => {
    event.preventDefault();
    if (!assignData.studentId || !assignData.totalAmount) return;
    dispatch(assignFee({
      ...assignData,
      totalAmount: Number(assignData.totalAmount),
    }));
    setAssignData((prev) => ({ ...prev, totalAmount: "" }));
  };

  const handleBatchAssign = (event) => {
    event.preventDefault();
    if (!batchData.department || !batchData.year || !batchData.totalAmount) return;
    dispatch(batchAssignFee({
      ...batchData,
      totalAmount: Number(batchData.totalAmount),
    }));
  };

  const handleReport = () => {
    if (!reportData.department || !reportData.year) return;
    dispatch(getFeeReport(reportData));
  };

  const classOptions = useMemo(() => {
    const years = [1, 2, 3, 4];
    return years.map((year) => ({ label: `Year ${year}`, value: year }));
  }, []);

  return (
    <div className="flex-[0.8] mt-3 overflow-y-auto pr-2">
      <div className="space-y-5">
        <div className="flex text-slate-500 items-center space-x-2">
          <HomeIcon />
          <h1 className="font-semibold">Fee Monitoring</h1>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Overview</h2>
                <p className="text-sm text-slate-500">
                  Assign fees, track collections, and generate class reports.
                </p>
              </div>
              <div className="flex items-center gap-2 text-blue-600">
                <MonetizationOnIcon />
                <span className="text-sm font-medium">Fee Control</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <form
              onSubmit={handleAssignFee}
              className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-4">
              <h3 className="text-sm font-semibold text-slate-700">
                Assign Fee to Student
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <select
                  className="border border-slate-200 rounded-xl px-3 py-2 text-sm"
                  value={assignData.studentId}
                  onChange={(event) =>
                    setAssignData((prev) => ({
                      ...prev,
                      studentId: event.target.value,
                    }))
                  }>
                  <option value="">Select student</option>
                  {students.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.name} ({student.username || student.email})
                    </option>
                  ))}
                </select>
                <input
                  className="border border-slate-200 rounded-xl px-3 py-2 text-sm"
                  placeholder="Fee type"
                  value={assignData.feeType}
                  onChange={(event) =>
                    setAssignData((prev) => ({
                      ...prev,
                      feeType: event.target.value,
                    }))
                  }
                />
                <input
                  className="border border-slate-200 rounded-xl px-3 py-2 text-sm"
                  placeholder="Academic year"
                  value={assignData.academicYear}
                  onChange={(event) =>
                    setAssignData((prev) => ({
                      ...prev,
                      academicYear: event.target.value,
                    }))
                  }
                />
                <input
                  className="border border-slate-200 rounded-xl px-3 py-2 text-sm"
                  placeholder="Semester"
                  value={assignData.semester}
                  onChange={(event) =>
                    setAssignData((prev) => ({
                      ...prev,
                      semester: event.target.value,
                    }))
                  }
                />
                <input
                  type="number"
                  className="border border-slate-200 rounded-xl px-3 py-2 text-sm"
                  placeholder="Total amount"
                  value={assignData.totalAmount}
                  onChange={(event) =>
                    setAssignData((prev) => ({
                      ...prev,
                      totalAmount: event.target.value,
                    }))
                  }
                />
                <input
                  type="date"
                  className="border border-slate-200 rounded-xl px-3 py-2 text-sm"
                  value={assignData.dueDate}
                  onChange={(event) =>
                    setAssignData((prev) => ({
                      ...prev,
                      dueDate: event.target.value,
                    }))
                  }
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
                Add Fee Record
              </button>
            </form>

            <form
              onSubmit={handleBatchAssign}
              className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-4">
              <h3 className="text-sm font-semibold text-slate-700">
                Batch Fee Assignment
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <select
                  className="border border-slate-200 rounded-xl px-3 py-2 text-sm"
                  value={batchData.department}
                  onChange={(event) =>
                    setBatchData((prev) => ({
                      ...prev,
                      department: event.target.value,
                    }))
                  }>
                  <option value="">Select department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept.department}>
                      {dept.department}
                    </option>
                  ))}
                </select>
                <select
                  className="border border-slate-200 rounded-xl px-3 py-2 text-sm"
                  value={batchData.year}
                  onChange={(event) =>
                    setBatchData((prev) => ({
                      ...prev,
                      year: event.target.value,
                    }))
                  }>
                  <option value="">Select year</option>
                  {classOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <input
                  className="border border-slate-200 rounded-xl px-3 py-2 text-sm"
                  placeholder="Section (optional)"
                  value={batchData.section}
                  onChange={(event) =>
                    setBatchData((prev) => ({
                      ...prev,
                      section: event.target.value,
                    }))
                  }
                />
                <input
                  className="border border-slate-200 rounded-xl px-3 py-2 text-sm"
                  placeholder="Fee type"
                  value={batchData.feeType}
                  onChange={(event) =>
                    setBatchData((prev) => ({
                      ...prev,
                      feeType: event.target.value,
                    }))
                  }
                />
                <input
                  className="border border-slate-200 rounded-xl px-3 py-2 text-sm"
                  placeholder="Academic year"
                  value={batchData.academicYear}
                  onChange={(event) =>
                    setBatchData((prev) => ({
                      ...prev,
                      academicYear: event.target.value,
                    }))
                  }
                />
                <input
                  className="border border-slate-200 rounded-xl px-3 py-2 text-sm"
                  placeholder="Semester"
                  value={batchData.semester}
                  onChange={(event) =>
                    setBatchData((prev) => ({
                      ...prev,
                      semester: event.target.value,
                    }))
                  }
                />
                <input
                  type="number"
                  className="border border-slate-200 rounded-xl px-3 py-2 text-sm"
                  placeholder="Total amount"
                  value={batchData.totalAmount}
                  onChange={(event) =>
                    setBatchData((prev) => ({
                      ...prev,
                      totalAmount: event.target.value,
                    }))
                  }
                />
                <input
                  type="date"
                  className="border border-slate-200 rounded-xl px-3 py-2 text-sm"
                  value={batchData.dueDate}
                  onChange={(event) =>
                    setBatchData((prev) => ({
                      ...prev,
                      dueDate: event.target.value,
                    }))
                  }
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700">
                Assign to Class
              </button>
            </form>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-700">
                Fee Records
              </h3>
              <button
                onClick={handleFilter}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold">
                <FilterAltIcon fontSize="small" />
                Apply Filters
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <input
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm"
                placeholder="Search student"
                value={filters.search}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, search: event.target.value }))
                }
              />
              <select
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm"
                value={filters.department}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    department: event.target.value,
                  }))
                }>
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept.department}>
                    {dept.department}
                  </option>
                ))}
              </select>
              <select
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm"
                value={filters.year}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, year: event.target.value }))
                }>
                <option value="">All Years</option>
                {classOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <input
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm"
                placeholder="Section"
                value={filters.section}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    section: event.target.value,
                  }))
                }
              />
              <select
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm"
                value={filters.status}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, status: event.target.value }))
                }>
                <option value="">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Partial">Partial</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-500 text-left">
                    <th className="py-2">Student</th>
                    <th className="py-2">Class</th>
                    <th className="py-2">Fee Type</th>
                    <th className="py-2">Total</th>
                    <th className="py-2">Paid</th>
                    <th className="py-2">Due Date</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  {fees.map((fee) => (
                    <tr
                      key={fee._id}
                      className="border-t border-slate-100 hover:bg-slate-50">
                      <td className="py-2">
                        {fee.student?.name || "-"}
                        <div className="text-xs text-slate-400">
                          {fee.student?.username || fee.student?.email}
                        </div>
                      </td>
                      <td className="py-2">
                        {fee.student?.department || "-"} / {fee.student?.year || "-"}
                        {fee.student?.section ? `-${fee.student.section}` : ""}
                      </td>
                      <td className="py-2">{fee.feeType}</td>
                      <td className="py-2">₹{fee.totalAmount}</td>
                      <td className="py-2">₹{fee.paidAmount}</td>
                      <td className="py-2">
                        {fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : "-"}
                      </td>
                      <td className="py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${fee.status === "Paid"
                              ? "bg-emerald-100 text-emerald-700"
                              : fee.status === "Partial"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-rose-100 text-rose-700"
                            }`}>
                          {fee.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {!fees.length && (
                    <tr>
                      <td colSpan="7" className="py-6 text-center text-slate-400">
                        No fee records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-700">
                Class Fee Report
              </h3>
              <button
                onClick={handleReport}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium">
                Generate Report
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm"
                value={reportData.department}
                onChange={(event) =>
                  setReportData((prev) => ({
                    ...prev,
                    department: event.target.value,
                  }))
                }>
                <option value="">Select department</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept.department}>
                    {dept.department}
                  </option>
                ))}
              </select>
              <select
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm"
                value={reportData.year}
                onChange={(event) =>
                  setReportData((prev) => ({ ...prev, year: event.target.value }))
                }>
                <option value="">Select year</option>
                {classOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <input
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm"
                placeholder="Section (optional)"
                value={reportData.section}
                onChange={(event) =>
                  setReportData((prev) => ({
                    ...prev,
                    section: event.target.value,
                  }))
                }
              />
            </div>
            {feeReport && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-xs text-slate-500">Total Assigned</p>
                    <h4 className="text-xl font-semibold text-slate-800">
                      ₹{feeReport?.totals?.totalAssigned || 0}
                    </h4>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-4">
                    <p className="text-xs text-slate-500">Total Collected</p>
                    <h4 className="text-xl font-semibold text-slate-800">
                      ₹{feeReport?.totals?.totalPaid || 0}
                    </h4>
                  </div>
                  <div className="bg-rose-50 rounded-xl p-4">
                    <p className="text-xs text-slate-500">Total Due</p>
                    <h4 className="text-xl font-semibold text-slate-800">
                      ₹{feeReport?.totals?.totalDue || 0}
                    </h4>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-slate-500 text-left">
                        <th className="py-2">Student</th>
                        <th className="py-2">Roll No</th>
                        <th className="py-2">Assigned</th>
                        <th className="py-2">Paid</th>
                        <th className="py-2">Due</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-700">
                      {feeReport?.students?.map((student) => (
                        <tr
                          key={student.id}
                          className="border-t border-slate-100 hover:bg-slate-50">
                          <td className="py-2">{student.name}</td>
                          <td className="py-2">{student.rollNo}</td>
                          <td className="py-2">₹{student.totalAmount}</td>
                          <td className="py-2">₹{student.paidAmount}</td>
                          <td className="py-2">₹{student.dueAmount}</td>
                        </tr>
                      ))}
                      {!feeReport?.students?.length && (
                        <tr>
                          <td colSpan="5" className="py-6 text-center text-slate-400">
                            No data available for this class.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
