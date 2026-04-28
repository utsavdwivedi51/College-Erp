import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import StorageIcon from "@mui/icons-material/Storage";
import {
    bulkAddFaculty,
    bulkAddStudent,
    bulkUpdateUserStatus,
} from "../../../redux/actions/adminActions";
import { SET_ERRORS } from "../../../redux/actionTypes";

// bulk add student format : 
// name,email,dob(YYYY-MM-DD),department,section,year
/*
riya,riya@gmail.com,2005-09-14,CSE,A,4
rohan,rohan@gmail.com,2005-09-15,CSE,A,4
suman,suman@gmail.com,2005-09-16,CSE,B,4
*/

const parseCsvText = (text) => {
    const rows = text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

    if (rows.length < 2) {
        throw new Error("CSV must include a header row and at least one data row");
    }

    const headers = rows[0].split(",").map((header) => header.trim());

    if (headers.some((header) => !header)) {
        throw new Error("CSV headers cannot be empty");
    }

    return rows.slice(1).map((line, idx) => {
        const values = line.split(",").map((item) => item.trim());
        const rowObj = {};

        headers.forEach((header, headerIdx) => {
            rowObj[header] = values[headerIdx] ?? "";
        });

        rowObj.__row = idx + 2;
        return rowObj;
    });
};

const Body = () => {
    const dispatch = useDispatch();
    const errors = useSelector((state) => state.errors || {});
    const bulkResult = useSelector((state) => state.admin.bulkOperationResult);

    const [facultyCsv, setFacultyCsv] = useState("");
    const [studentCsv, setStudentCsv] = useState("");
    const [statusForm, setStatusForm] = useState({
        role: "student",
        identifierField: "username",
        identifiersText: "",
        isActive: true,
    });

    const [loadingState, setLoadingState] = useState({
        faculty: false,
        student: false,
        status: false,
    });

    const hasError = Boolean(
        errors?.backendError || errors?.emailError || errors?.usernameError
    );

    const clearErrors = () => dispatch({ type: SET_ERRORS, payload: {} });

    const parsedIdentifierList = useMemo(
        () =>
            statusForm.identifiersText
                .split(/\r?\n|,/)
                .map((item) => item.trim())
                .filter(Boolean),
        [statusForm.identifiersText]
    );

    const onFacultyBulkSubmit = async (e) => {
        e.preventDefault();
        clearErrors();
        try {
            setLoadingState((prev) => ({ ...prev, faculty: true }));
            const facultyList = parseCsvText(facultyCsv).map((row) => {
                const payload = { ...row };
                delete payload.__row;
                return payload;
            });
            await dispatch(bulkAddFaculty(facultyList));
            setFacultyCsv("");
        } catch (error) {
            dispatch({
                type: SET_ERRORS,
                payload: { backendError: error?.backendError || error.message },
            });
        } finally {
            setLoadingState((prev) => ({ ...prev, faculty: false }));
        }
    };

    const onStudentBulkSubmit = async (e) => {
        e.preventDefault();
        clearErrors();
        try {
            setLoadingState((prev) => ({ ...prev, student: true }));
            const studentList = parseCsvText(studentCsv).map((row) => {
                const payload = { ...row };
                delete payload.__row;
                return payload;
            });
            await dispatch(bulkAddStudent(studentList));
            setStudentCsv("");
        } catch (error) {
            dispatch({
                type: SET_ERRORS,
                payload: { backendError: error?.backendError || error.message },
            });
        } finally {
            setLoadingState((prev) => ({ ...prev, student: false }));
        }
    };

    const onStatusBulkSubmit = async (e) => {
        e.preventDefault();
        clearErrors();

        if (parsedIdentifierList.length === 0) {
            dispatch({
                type: SET_ERRORS,
                payload: { backendError: "Provide at least one identifier" },
            });
            return;
        }

        try {
            setLoadingState((prev) => ({ ...prev, status: true }));
            await dispatch(
                bulkUpdateUserStatus({
                    role: statusForm.role,
                    identifierField: statusForm.identifierField,
                    identifiers: parsedIdentifierList,
                    isActive: statusForm.isActive,
                })
            );
            setStatusForm((prev) => ({ ...prev, identifiersText: "" }));
        } catch (error) {
            dispatch({
                type: SET_ERRORS,
                payload: { backendError: error?.backendError || error.message },
            });
        } finally {
            setLoadingState((prev) => ({ ...prev, status: false }));
        }
    };

    return (
        <div className="flex-[0.8] mt-3 pr-4 pb-4 overflow-y-auto scrollbar-thin scrollbar-track-white scrollbar-thumb-slate-200">
            <div className="space-y-5">
                <div className="flex text-slate-500 items-center space-x-2">
                    <StorageIcon />
                    <h1 className="font-semibold">Bulk Operations</h1>
                </div>

                <div className="grid xl:grid-cols-2 gap-5">
                    <form
                        onSubmit={onFacultyBulkSubmit}
                        className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-3">
                        <h2 className="text-lg font-semibold text-slate-800">Bulk Add Faculty</h2>
                        <p className="text-xs text-slate-500">
                            Required columns: name,email,dob,department,designation (optional:
                            joiningYear,gender,contactNumber,avatar)
                        </p>
                        <textarea
                            required
                            value={facultyCsv}
                            onChange={(e) => setFacultyCsv(e.target.value)}
                            placeholder="name,email,dob,department,designation\nAman,aman@x.com,2000-04-20,CSE,Professor"
                            className="w-full h-48 rounded-lg border border-slate-300 bg-slate-50 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                        />
                        <button
                            type="submit"
                            disabled={loadingState.faculty}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-60">
                            {loadingState.faculty ? "Processing..." : "Upload Faculty CSV"}
                        </button>
                    </form>

                    <form
                        onSubmit={onStudentBulkSubmit}
                        className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-3">
                        <h2 className="text-lg font-semibold text-slate-800">Bulk Add Students</h2>
                        <p className="text-xs text-slate-500">
                            Required columns: name,email,dob,department,section,year (optional:
                            gender,batch,contactNumber,fatherName,motherName,fatherContactNumber,motherContactNumber,avatar)
                        </p>
                        <textarea
                            required
                            value={studentCsv}
                            onChange={(e) => setStudentCsv(e.target.value)}
                            placeholder="name,email,dob,department,section,year\nRiya,riya@x.com,2005-09-14,CSE,A,1"
                            className="w-full h-48 rounded-lg border border-slate-300 bg-slate-50 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                        />
                        <button
                            type="submit"
                            disabled={loadingState.student}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-60">
                            {loadingState.student ? "Processing..." : "Upload Student CSV"}
                        </button>
                    </form>
                </div>

                <form
                    onSubmit={onStatusBulkSubmit}
                    className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-4">
                    <h2 className="text-lg font-semibold text-slate-800">
                        Bulk Activate / Deactivate Users
                    </h2>

                    <div className="grid md:grid-cols-4 gap-3">
                        <select
                            value={statusForm.role}
                            onChange={(e) =>
                                setStatusForm((prev) => ({ ...prev, role: e.target.value }))
                            }
                            className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-300">
                            <option value="student">Student</option>
                            <option value="faculty">Faculty</option>
                            <option value="admin">Admin</option>
                        </select>

                        <select
                            value={statusForm.identifierField}
                            onChange={(e) =>
                                setStatusForm((prev) => ({ ...prev, identifierField: e.target.value }))
                            }
                            className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-300">
                            <option value="username">Username</option>
                            <option value="email">Email</option>
                            <option value="_id">Mongo _id</option>
                        </select>

                        <select
                            value={statusForm.isActive ? "active" : "inactive"}
                            onChange={(e) =>
                                setStatusForm((prev) => ({
                                    ...prev,
                                    isActive: e.target.value === "active",
                                }))
                            }
                            className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-300">
                            <option value="active">Set Active</option>
                            <option value="inactive">Set Inactive</option>
                        </select>

                        <button
                            type="submit"
                            disabled={loadingState.status}
                            className="bg-gradient-to-r from-slate-700 to-slate-900 text-white rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-60">
                            {loadingState.status ? "Updating..." : "Update Status"}
                        </button>
                    </div>

                    <textarea
                        value={statusForm.identifiersText}
                        onChange={(e) =>
                            setStatusForm((prev) => ({ ...prev, identifiersText: e.target.value }))
                        }
                        placeholder="Enter usernames/emails/ids, one per line or comma separated"
                        className="w-full h-28 rounded-lg border border-slate-300 bg-slate-50 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                    />

                    <p className="text-xs text-slate-500">
                        Parsed identifiers: {parsedIdentifierList.length}
                    </p>
                </form>

                {(hasError || bulkResult) && (
                    <div
                        className={`rounded-xl border p-4 text-sm ${hasError
                                ? "bg-red-50 border-red-200 text-red-700"
                                : "bg-green-50 border-green-200 text-green-800"
                            }`}>
                        {hasError ? (
                            <p>{errors.backendError || errors.emailError || errors.usernameError}</p>
                        ) : (
                            <div className="space-y-1">
                                <p className="font-semibold">{bulkResult?.message || "Completed"}</p>
                                {bulkResult?.summary && (
                                    <p>
                                        Total: {bulkResult.summary.total ?? bulkResult.summary.requested} | Created/Matched: {bulkResult.summary.created ?? bulkResult.summary.matched} | Failed/Modified: {bulkResult.summary.failed ?? bulkResult.summary.modified}
                                    </p>
                                )}
                                {Array.isArray(bulkResult?.failures) && bulkResult.failures.length > 0 && (
                                    <p className="text-xs">
                                        Failures: {bulkResult.failures
                                            .slice(0, 5)
                                            .map((item) => `Row ${item.row}: ${item.reason}`)
                                            .join(" | ")}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Body;
