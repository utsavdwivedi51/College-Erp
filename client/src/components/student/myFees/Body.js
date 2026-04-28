import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import HomeIcon from "@mui/icons-material/Home";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { payStudentFee } from "../../../redux/actions/studentActions";

const Body = () => {
    const dispatch = useDispatch();
    const fees = useSelector((state) => state.student.fees) || [];
    const summary = useSelector((state) => state.student.feeSummary);

    const [selectedFeeId, setSelectedFeeId] = useState("");
    const [payment, setPayment] = useState({ amount: "", method: "Online" });

    const handlePay = (event) => {
        event.preventDefault();
        if (!selectedFeeId || !payment.amount) return;
        dispatch(
            payStudentFee({
                feeId: selectedFeeId,
                amount: Number(payment.amount),
                method: payment.method,
            })
        );
        setPayment((prev) => ({ ...prev, amount: "" }));
    };

    return (
        <div className="flex-[0.78] mt-1 overflow-y-auto pr-1">
            <div className="space-y-4">
                <div className="flex text-slate-500 items-center space-x-2">
                    <HomeIcon />
                    <h1 className="font-medium">My Fees</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4">
                        <p className="text-xs text-slate-500">Total Fees</p>
                        <h2 className="text-2xl font-semibold text-slate-800">
                            ₹{summary?.totalAmount || 0}
                        </h2>
                    </div>
                    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4">
                        <p className="text-xs text-slate-500">Paid Amount</p>
                        <h2 className="text-2xl font-semibold text-slate-800">
                            ₹{summary?.paidAmount || 0}
                        </h2>
                    </div>
                    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4">
                        <p className="text-xs text-slate-500">Due Amount</p>
                        <h2 className="text-2xl font-semibold text-slate-800">
                            ₹{summary?.totalDue || 0}
                        </h2>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-500 text-white rounded-2xl shadow-sm p-4">
                        <p className="text-xs text-white/80">Pending Fees</p>
                        <h2 className="text-2xl font-semibold text-white">
                            {summary?.pendingCount || 0}
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                    <form
                        onSubmit={handlePay}
                        className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-4">
                        <div className="flex items-center gap-2 text-slate-700">
                            <CreditCardIcon />
                            <h2 className="text-sm font-semibold">Pay Fee</h2>
                        </div>
                        <select
                            className="border border-slate-200 rounded-xl px-3 py-2 text-sm w-full"
                            value={selectedFeeId}
                            onChange={(event) => setSelectedFeeId(event.target.value)}>
                            <option value="">Select fee record</option>
                            {fees.map((fee) => (
                                <option key={fee._id} value={fee._id}>
                                    {fee.feeType} - Due ₹{Math.max(fee.totalAmount - fee.paidAmount, 0)}
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            className="border border-slate-200 rounded-xl px-3 py-2 text-sm w-full"
                            placeholder="Amount to pay"
                            value={payment.amount}
                            onChange={(event) =>
                                setPayment((prev) => ({ ...prev, amount: event.target.value }))
                            }
                        />
                        <select
                            className="border border-slate-200 rounded-xl px-3 py-2 text-sm w-full"
                            value={payment.method}
                            onChange={(event) =>
                                setPayment((prev) => ({ ...prev, method: event.target.value }))
                            }>
                            <option value="Online">Online</option>
                            <option value="Cash">Cash</option>
                            <option value="Card">Card</option>
                            <option value="UPI">UPI</option>
                        </select>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700">
                            Pay Now
                        </button>
                    </form>

                    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 xl:col-span-2">
                        <h2 className="text-sm font-semibold text-slate-700 mb-3">
                            Fee Records
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-slate-500 text-left">
                                        <th className="py-2">Fee Type</th>
                                        <th className="py-2">Academic Year</th>
                                        <th className="py-2">Semester</th>
                                        <th className="py-2">Total</th>
                                        <th className="py-2">Paid</th>
                                        <th className="py-2">Due Date</th>
                                        <th className="py-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-slate-700">
                                    {fees.map((fee) => (
                                        <tr key={fee._id} className="border-t border-slate-100">
                                            <td className="py-2">{fee.feeType}</td>
                                            <td className="py-2">{fee.academicYear || "-"}</td>
                                            <td className="py-2">{fee.semester || "-"}</td>
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
                                                No fee records available yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Body;
