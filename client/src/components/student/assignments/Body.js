import React, { useEffect, useMemo, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DownloadIcon from "@mui/icons-material/Download";
import { useDispatch, useSelector } from "react-redux";
import {
    getStudentAssignments,
    submitAssignment,
} from "../../../redux/actions/studentActions";
import { SET_ERRORS } from "../../../redux/actionTypes";

const readFilesAsBase64 = async (files) => {
    const fileList = Array.from(files || []);
    const validFiles = fileList.filter((file) => file.size <= 10 * 1024 * 1024);

    const converted = await Promise.all(
        validFiles.map(
            (file) =>
                new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        resolve({
                            name: file.name,
                            type: file.type,
                            size: file.size,
                            content: reader.result,
                        });
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                })
        )
    );

    return converted;
};

const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString();
};

const getDaysLeft = (deadline) => {
    if (!deadline) return "";
    const now = new Date();
    const due = new Date(deadline);
    const diff = due.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days < 0) return `${Math.abs(days)}d overdue`;
    if (days === 0) return "Due today";
    return `${days}d left`;
};

const Body = () => {
    const dispatch = useDispatch();
    const assignments = useSelector(
        (state) => state.student.assignments?.result || []
    );
    const errors = useSelector((state) => state.errors || {});

    const [statusFilter, setStatusFilter] = useState("all");
    const [showModal, setShowModal] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [submissionFiles, setSubmissionFiles] = useState([]);
    const [notes, setNotes] = useState("");

    useEffect(() => {
        dispatch(getStudentAssignments());
        dispatch({ type: SET_ERRORS, payload: {} });
    }, [dispatch]);

    const stats = useMemo(() => {
        const total = assignments.length;
        const submitted = assignments.filter(
            (item) => item.status === "submitted"
        ).length;
        const pending = assignments.filter((item) => item.status === "pending").length;
        const graded = assignments.filter(
            (item) => item?.submission?.marksAwarded !== undefined
        ).length;
        return { total, submitted, pending, graded };
    }, [assignments]);

    const filteredAssignments = useMemo(() => {
        if (statusFilter === "all") return assignments;
        return assignments.filter((assignment) => assignment.status === statusFilter);
    }, [assignments, statusFilter]);

    const openSubmitModal = (assignment) => {
        setSelectedAssignment(assignment);
        setNotes(assignment?.submission?.notes || "");
        setSubmissionFiles([]);
        dispatch({ type: SET_ERRORS, payload: {} });
        setShowModal(true);
    };

    const handleSubmissionFiles = async (event) => {
        const files = await readFilesAsBase64(event.target.files);
        setSubmissionFiles(files);
    };

    const onSubmitAssignment = async (event) => {
        event.preventDefault();

        if (!selectedAssignment) return;

        if (submissionFiles.length === 0) {
            alert("Please attach at least one file");
            return;
        }

        await dispatch(
            submitAssignment(selectedAssignment._id, {
                notes,
                attachments: submissionFiles,
            })
        );

        setShowModal(false);
    };

    return (
        <div className="flex-[0.78] mt-1 overflow-y-auto pr-1">
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-800">My Assignments</h1>
                        <p className="text-slate-500 text-2xl">
                            View and submit your assignments before the deadline.
                        </p>
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(event) => setStatusFilter(event.target.value)}
                        className="h-11 w-40 rounded-2xl border border-slate-300 bg-white px-4 text-slate-700">
                        <option value="all">All</option>
                        <option value="pending">Pending</option>
                        <option value="submitted">Submitted</option>
                        <option value="overdue">Overdue</option>
                    </select>
                </div>

                <div className="grid grid-cols-4 gap-3">
                    <div className="bg-slate-200/70 rounded-2xl p-4">
                        <p className="text-4xl font-bold text-blue-600">{stats.total}</p>
                        <p className="text-3xl text-slate-800">Total</p>
                    </div>
                    <div className="bg-slate-200/70 rounded-2xl p-4">
                        <p className="text-4xl font-bold text-blue-600">{stats.submitted}</p>
                        <p className="text-3xl text-slate-800">Submitted</p>
                    </div>
                    <div className="bg-slate-200/70 rounded-2xl p-4">
                        <p className="text-4xl font-bold text-blue-600">{stats.pending}</p>
                        <p className="text-3xl text-slate-800">Pending</p>
                    </div>
                    <div className="bg-slate-200/70 rounded-2xl p-4">
                        <p className="text-4xl font-bold text-blue-600">{stats.graded}</p>
                        <p className="text-3xl text-slate-800">Graded</p>
                    </div>
                </div>

                {filteredAssignments.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500">
                        No assignments available for this filter.
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-2 gap-4">
                        {filteredAssignments.map((assignment) => (
                            <div
                                key={assignment._id}
                                className="rounded-3xl border border-blue-400 bg-white p-5 space-y-3 shadow-sm">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-3xl font-semibold text-slate-800">
                                        {assignment.title}
                                    </h2>
                                    <span
                                        className={`px-4 py-1 rounded-full border text-sm font-semibold ${assignment.status === "submitted"
                                                ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                                                : assignment.status === "overdue"
                                                    ? "bg-red-50 border-red-300 text-red-700"
                                                    : "bg-amber-50 border-amber-300 text-amber-700"
                                            }`}>
                                        {assignment.status}
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 text-slate-600 text-xl">
                                    <span>📚 {assignment.subject}</span>
                                    <span>·</span>
                                    <span>⭐ {assignment.maxMarks} marks</span>
                                    <span>·</span>
                                    <span>👤 {assignment.createdByName}</span>
                                </div>

                                <div className="border-t border-slate-200 pt-3 flex justify-between text-slate-700 text-xl">
                                    <p className="flex items-center gap-2">
                                        <CalendarTodayIcon sx={{ fontSize: 18 }} />
                                        {formatDate(assignment.deadline)}
                                    </p>
                                    <p className="flex items-center gap-2 text-emerald-600">
                                        <AccessTimeIcon sx={{ fontSize: 18 }} />
                                        {getDaysLeft(assignment.deadline)}
                                    </p>
                                </div>

                                <button
                                    onClick={() => openSubmitModal(assignment)}
                                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow">
                                    {assignment.status === "submitted" ? "Resubmit" : "Submit"}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showModal && selectedAssignment && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <form
                        onSubmit={onSubmitAssignment}
                        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-800">
                                    {selectedAssignment.title}
                                </h2>
                                <p className="text-slate-500 text-lg">
                                    📚 {selectedAssignment.subject} · 🏫 {selectedAssignment.department}-
                                    {selectedAssignment.year}{selectedAssignment.section} · ⭐ {selectedAssignment.maxMarks}
                                    marks
                                </p>
                                <p className="text-emerald-600 text-lg">{getDaysLeft(selectedAssignment.deadline)}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="text-slate-500 hover:text-slate-800">
                                <CloseIcon />
                            </button>
                        </div>

                        <div className="bg-slate-100 rounded-xl p-4 text-slate-700">
                            {selectedAssignment.description || "No description provided."}
                        </div>

                        <div>
                            <p className="text-slate-500 text-xl font-semibold mb-2">
                                Assignment Files
                            </p>
                            {selectedAssignment.attachments?.length ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {selectedAssignment.attachments.map((file, idx) => (
                                        <div key={`${file.name}-${idx}`} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg flex-shrink-0">
                                                    <InsertDriveFileIcon />
                                                </div>
                                                <div className="truncate">
                                                    <p className="text-sm font-semibold text-slate-700 truncate" title={file.name}>
                                                        {file.name}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>
                                            </div>
                                            <a
                                                href={file.content}
                                                download={file.name}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex-shrink-0"
                                                title="Download"
                                            >
                                                <DownloadIcon />
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-200">No files attached by teacher.</p>
                            )}
                        </div>

                        {selectedAssignment.submission?.attachments?.length > 0 && (
                            <div>
                                <p className="text-slate-500 text-xl font-semibold mb-2">
                                    Your Submitted Files
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {selectedAssignment.submission.attachments.map((file, idx) => (
                                        <div key={`${file.name}-${idx}`} className="flex items-center justify-between p-3 bg-white border border-emerald-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg flex-shrink-0">
                                                    <InsertDriveFileIcon />
                                                </div>
                                                <div className="truncate">
                                                    <p className="text-sm font-semibold text-slate-700 truncate" title={file.name}>
                                                        {file.name}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>
                                            </div>
                                            <a
                                                href={file.content}
                                                download={file.name}
                                                className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex-shrink-0"
                                                title="Download"
                                            >
                                                <DownloadIcon />
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <p className="text-slate-500 text-xl font-semibold mb-2">
                                Upload Your Submission (Max 10 MB per file)
                            </p>
                            <div className="border-2 border-dashed border-blue-300 rounded-2xl p-6 text-center bg-blue-50/50 hover:bg-blue-50 transition-colors relative">
                                <input 
                                    type="file" 
                                    multiple 
                                    onChange={handleSubmissionFiles} 
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="text-blue-600 mb-2 flex justify-center">
                                    <InsertDriveFileIcon sx={{ fontSize: 40 }} />
                                </div>
                                <p className="text-lg font-medium text-blue-700">Click or drag files here to upload</p>
                                <p className="text-sm text-blue-500 mt-1">PDF, DOC, DOCX, PNG, JPG, ZIP</p>
                            </div>
                            
                            {submissionFiles.length > 0 && (
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {submissionFiles.map((file, idx) => (
                                        <div key={`${file.name}-${idx}`} className="flex items-center p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg mr-3 flex-shrink-0">
                                                <InsertDriveFileIcon />
                                            </div>
                                            <div className="truncate flex-1">
                                                <p className="text-sm font-semibold text-slate-700 truncate" title={file.name}>
                                                    {file.name}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <p className="text-slate-500 text-xl font-semibold">
                                Notes / Comments (Optional)
                            </p>
                            <textarea
                                value={notes}
                                onChange={(event) => setNotes(event.target.value)}
                                placeholder="Any notes for your teacher..."
                                className="mt-2 h-24 w-full rounded-xl border border-slate-300 p-3"
                            />
                        </div>

                        {errors.backendError && (
                            <p className="text-red-500 text-sm">{errors.backendError}</p>
                        )}

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="px-6 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold">
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold">
                                Submit Assignment
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Body;
