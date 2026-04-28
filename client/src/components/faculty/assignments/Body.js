import React, { useEffect, useMemo, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useDispatch, useSelector } from "react-redux";
import {
    createAssignment,
    deleteAssignment,
    getAssignmentSubmissions,
    getFacultyAssignments,
    updateAssignment,
} from "../../../redux/actions/facultyActions";
import { SET_ERRORS } from "../../../redux/actionTypes";

const emptyAssignmentForm = {
    title: "",
    subject: "",
    department: "",
    year: "",
    section: "",
    deadline: "",
    maxMarks: 100,
    description: "",
    attachments: [],
};

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
    const user = JSON.parse(localStorage.getItem("user"));

    const assignments = useSelector(
        (state) => state.faculty.assignments?.result || []
    );
    const submissions = useSelector(
        (state) => state.faculty.assignmentSubmissions?.result || []
    );
    const errors = useSelector((state) => state.errors || {});

    const [showFormModal, setShowFormModal] = useState(false);
    const [showSubmissionModal, setShowSubmissionModal] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [formData, setFormData] = useState({
        ...emptyAssignmentForm,
        department: user?.result?.department || "",
        year: user?.result?.year || "",
        section: user?.result?.section || "",
    });
    const [statusFilter, setStatusFilter] = useState("all");
    const [classFilter, setClassFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        dispatch(getFacultyAssignments());
        dispatch({ type: SET_ERRORS, payload: {} });
    }, [dispatch]);

    const stats = useMemo(() => {
        const now = new Date();
        const total = assignments.length;
        const active = assignments.filter(
            (item) => item.isActive !== false && new Date(item.deadline) >= now
        ).length;
        const overdue = assignments.filter(
            (item) => item.isActive !== false && new Date(item.deadline) < now
        ).length;
        const submissionCount = assignments.reduce(
            (sum, item) => sum + (item.submittedCount || 0),
            0
        );

        return { total, active, overdue, submissionCount };
    }, [assignments]);

    const classOptions = useMemo(() => {
        const options = assignments.map(
            (item) => `${item.department}-${item.year}-${item.section}`
        );
        return ["all", ...new Set(options)];
    }, [assignments]);

    const filteredAssignments = useMemo(() => {
        const now = new Date();

        return assignments.filter((item) => {
            const classKey = `${item.department}-${item.year}-${item.section}`;
            const titleAndSubject = `${item.title} ${item.subject}`.toLowerCase();
            const isOverdue = new Date(item.deadline) < now;
            const isActive = item.isActive !== false && !isOverdue;

            const statusMatch =
                statusFilter === "all" ||
                (statusFilter === "active" && isActive) ||
                (statusFilter === "overdue" && isOverdue) ||
                (statusFilter === "inactive" && item.isActive === false);

            const classMatch = classFilter === "all" || classFilter === classKey;
            const searchMatch =
                searchQuery.trim() === "" ||
                titleAndSubject.includes(searchQuery.trim().toLowerCase());

            return statusMatch && classMatch && searchMatch;
        });
    }, [assignments, classFilter, searchQuery, statusFilter]);

    const openCreateModal = () => {
        setSelectedAssignment(null);
        setFormData({
            ...emptyAssignmentForm,
            department: user?.result?.department || "",
            year: user?.result?.year || "",
            section: user?.result?.section || "",
            deadline: "",
            maxMarks: 100,
        });
        dispatch({ type: SET_ERRORS, payload: {} });
        setShowFormModal(true);
    };

    const openEditModal = (assignment) => {
        setSelectedAssignment(assignment);
        setFormData({
            title: assignment.title,
            subject: assignment.subject,
            department: assignment.department,
            year: assignment.year,
            section: assignment.section,
            deadline: assignment.deadline
                ? new Date(assignment.deadline).toISOString().slice(0, 16)
                : "",
            maxMarks: assignment.maxMarks || 100,
            description: assignment.description || "",
            attachments: assignment.attachments || [],
        });
        dispatch({ type: SET_ERRORS, payload: {} });
        setShowFormModal(true);
    };

    const onFileUpload = async (event) => {
        const files = await readFilesAsBase64(event.target.files);
        setFormData((prev) => ({ ...prev, attachments: [...(prev.attachments || []), ...files] }));
    };

    const onSubmit = (event) => {
        event.preventDefault();

        if (selectedAssignment) {
            dispatch(updateAssignment(selectedAssignment._id, formData));
        } else {
            dispatch(createAssignment(formData));
        }

        setShowFormModal(false);
    };

    const onDelete = (assignmentId) => {
        if (window.confirm("Delete this assignment?")) {
            dispatch(deleteAssignment(assignmentId));
        }
    };

    const openSubmissionModal = (assignment) => {
        setSelectedAssignment(assignment);
        dispatch(getAssignmentSubmissions(assignment._id));
        setShowSubmissionModal(true);
    };

    return (
        <div className="flex-[0.8] mt-3 pr-5 pb-4 overflow-y-auto">
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Assignments</h1>
                        <p className="text-slate-500 text-lg">
                            Upload assignments with deadlines. Students submit before the due
                            date.
                        </p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow-lg">
                        + New Assignment
                    </button>
                </div>

                <div className="grid grid-cols-4 gap-3">
                    <div className="bg-slate-200/70 rounded-2xl p-4">
                        <p className="text-4xl font-bold text-blue-600">{stats.total}</p>
                        <p className="text-3xl text-slate-800">Total</p>
                    </div>
                    <div className="bg-slate-200/70 rounded-2xl p-4">
                        <p className="text-4xl font-bold text-blue-600">{stats.active}</p>
                        <p className="text-3xl text-slate-800">Active</p>
                    </div>
                    <div className="bg-slate-200/70 rounded-2xl p-4">
                        <p className="text-4xl font-bold text-blue-600">{stats.overdue}</p>
                        <p className="text-3xl text-slate-800">Overdue</p>
                    </div>
                    <div className="bg-slate-200/70 rounded-2xl p-4">
                        <p className="text-4xl font-bold text-blue-600">
                            {stats.submissionCount}
                        </p>
                        <p className="text-3xl text-slate-800">Submissions</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <select
                        value={classFilter}
                        onChange={(event) => setClassFilter(event.target.value)}
                        className="h-12 rounded-xl border border-slate-300 bg-white px-4 text-slate-700">
                        {classOptions.map((item) => (
                            <option key={item} value={item}>
                                {item === "all" ? "All Classes" : item}
                            </option>
                        ))}
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(event) => setStatusFilter(event.target.value)}
                        className="h-12 rounded-xl border border-slate-300 bg-white px-4 text-slate-700">
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="overdue">Overdue</option>
                        <option value="inactive">Inactive</option>
                    </select>

                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Search by title or subject..."
                        className="h-12 rounded-xl border border-slate-300 bg-white px-4 text-slate-700"
                    />
                </div>

                {filteredAssignments.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
                        No assignments found.
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-2 gap-4">
                        {filteredAssignments.map((assignment) => {
                            const totalStudents = assignment.totalStudents || 0;
                            const submittedCount = assignment.submittedCount || 0;
                            const progress =
                                totalStudents > 0
                                    ? Math.min(100, Math.round((submittedCount / totalStudents) * 100))
                                    : 0;

                            return (
                                <div
                                    key={assignment._id}
                                    className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <h2 className="text-2xl font-semibold text-slate-800">
                                            {assignment.title}
                                        </h2>
                                        <span
                                            className={`px-4 py-1 rounded-full border text-sm font-semibold ${new Date(assignment.deadline) < new Date()
                                                    ? "bg-red-50 border-red-200 text-red-600"
                                                    : "bg-emerald-50 border-emerald-300 text-emerald-600"
                                                }`}>
                                            {new Date(assignment.deadline) < new Date()
                                                ? "Overdue"
                                                : "Active"}
                                        </span>
                                    </div>

                                    <div className="text-slate-600 text-xl flex flex-wrap items-center gap-2">
                                        <span>📚 {assignment.subject}</span>
                                        <span>·</span>
                                        <span>
                                            🏫 {assignment.department}-{assignment.year}{assignment.section}
                                        </span>
                                        <span>·</span>
                                        <span>⭐ {assignment.maxMarks} marks</span>
                                    </div>

                                    <p className="text-slate-600 text-xl">
                                        👤 {assignment.createdByName || "Faculty"}
                                    </p>

                                    <div>
                                        <div className="flex justify-between text-slate-600 text-xl">
                                            <span>Submissions</span>
                                            <span>
                                                {submittedCount} / {totalStudents}
                                            </span>
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-1">
                                            <div
                                                className="h-full bg-blue-500"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-between text-slate-700 text-xl">
                                        <p className="flex items-center gap-2">
                                            <CalendarTodayIcon sx={{ fontSize: 18 }} />
                                            {formatDate(assignment.deadline)}
                                        </p>
                                        <p className="flex items-center gap-2 text-emerald-600">
                                            <AccessTimeIcon sx={{ fontSize: 18 }} />
                                            {getDaysLeft(assignment.deadline)}
                                        </p>
                                    </div>

                                    <div className="flex gap-2 pt-1">
                                        <button
                                            onClick={() => openSubmissionModal(assignment)}
                                            className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold">
                                            View Submissions
                                        </button>
                                        <button
                                            onClick={() => openEditModal(assignment)}
                                            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold">
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => onDelete(assignment._id)}
                                            className="px-4 py-2 rounded-xl bg-red-600 text-white font-semibold">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {showFormModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <form
                        onSubmit={onSubmit}
                        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-6 space-y-4 max-h-[92vh] overflow-y-auto">
                        <div className="flex justify-between items-center">
                            <h2 className="text-3xl font-bold text-slate-800">
                                {selectedAssignment ? "Edit Assignment" : "New Assignment"}
                            </h2>
                            <button
                                type="button"
                                onClick={() => setShowFormModal(false)}
                                className="text-slate-500 hover:text-slate-800">
                                <CloseIcon />
                            </button>
                        </div>

                        <div>
                            <label className="text-slate-500 text-xl font-semibold">
                                Assignment Title *
                            </label>
                            <input
                                required
                                value={formData.title}
                                onChange={(event) =>
                                    setFormData((prev) => ({ ...prev, title: event.target.value }))
                                }
                                placeholder="e.g. Data Structures – Linked List Implementation"
                                className="mt-1 h-12 w-full rounded-xl border border-slate-300 px-4"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-3">
                            <div>
                                <label className="text-slate-500 text-xl font-semibold">Subject *</label>
                                <input
                                    required
                                    value={formData.subject}
                                    onChange={(event) =>
                                        setFormData((prev) => ({ ...prev, subject: event.target.value }))
                                    }
                                    placeholder="e.g. Computer Science"
                                    className="mt-1 h-12 w-full rounded-xl border border-slate-300 px-4"
                                />
                            </div>

                            <div>
                                <label className="text-slate-500 text-xl font-semibold">Target Class *</label>
                                <div className="grid grid-cols-3 gap-2 mt-1">
                                    <input
                                        required
                                        value={formData.department}
                                        onChange={(event) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                department: event.target.value,
                                            }))
                                        }
                                        placeholder="Dept"
                                        className="h-12 rounded-xl border border-slate-300 px-3"
                                    />
                                    <input
                                        required
                                        value={formData.year}
                                        onChange={(event) =>
                                            setFormData((prev) => ({ ...prev, year: event.target.value }))
                                        }
                                        placeholder="Year"
                                        className="h-12 rounded-xl border border-slate-300 px-3"
                                    />
                                    <input
                                        required
                                        value={formData.section}
                                        onChange={(event) =>
                                            setFormData((prev) => ({ ...prev, section: event.target.value }))
                                        }
                                        placeholder="Section"
                                        className="h-12 rounded-xl border border-slate-300 px-3"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-3">
                            <div>
                                <label className="text-slate-500 text-xl font-semibold">Deadline *</label>
                                <input
                                    required
                                    type="datetime-local"
                                    value={formData.deadline}
                                    onChange={(event) =>
                                        setFormData((prev) => ({ ...prev, deadline: event.target.value }))
                                    }
                                    className="mt-1 h-12 w-full rounded-xl border border-slate-300 px-4"
                                />
                            </div>

                            <div>
                                <label className="text-slate-500 text-xl font-semibold">Max Marks</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.maxMarks}
                                    onChange={(event) =>
                                        setFormData((prev) => ({ ...prev, maxMarks: event.target.value }))
                                    }
                                    className="mt-1 h-12 w-full rounded-xl border border-slate-300 px-4"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-slate-500 text-xl font-semibold">
                                Description / Instructions
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(event) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        description: event.target.value,
                                    }))
                                }
                                placeholder="Describe the assignment, marking criteria, etc."
                                className="mt-1 h-24 w-full rounded-xl border border-slate-300 p-3"
                            />
                        </div>

                        <div>
                            <label className="text-slate-500 text-xl font-semibold block mb-2">
                                Attach Files (Max 10 MB each)
                            </label>
                            <div className="border-2 border-dashed border-blue-300 rounded-2xl p-6 text-center bg-blue-50/50 hover:bg-blue-50 transition-colors relative">
                                <input 
                                    type="file" 
                                    multiple 
                                    onChange={onFileUpload} 
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="text-blue-600 mb-2 flex justify-center">
                                    <InsertDriveFileIcon sx={{ fontSize: 40 }} />
                                </div>
                                <p className="text-lg font-medium text-blue-700">Click or drag files here to attach</p>
                                <p className="text-sm text-blue-500 mt-1">PDF, DOC, DOCX, PNG, JPG, ZIP</p>
                            </div>

                            {formData.attachments?.length > 0 && (
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {formData.attachments.map((file, idx) => (
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
                                            <div className="flex items-center gap-1 flex-shrink-0">
                                                {file.content && (
                                                    <a
                                                        href={file.content}
                                                        download={file.name}
                                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Download"
                                                    >
                                                        <DownloadIcon fontSize="small" />
                                                    </a>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            attachments: prev.attachments.filter((_, i) => i !== idx)
                                                        }));
                                                    }}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Remove"
                                                >
                                                    <DeleteOutlineIcon fontSize="small" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {errors.backendError && (
                            <p className="text-red-500 text-sm">{errors.backendError}</p>
                        )}

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowFormModal(false)}
                                className="px-6 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold">
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold">
                                {selectedAssignment ? "Update Assignment" : "Publish Assignment"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {showSubmissionModal && selectedAssignment && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-800">
                                    {selectedAssignment.title}
                                </h2>
                                <p className="text-slate-500 text-lg">
                                    {selectedAssignment.subject} · {formatDate(selectedAssignment.deadline)}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowSubmissionModal(false)}
                                className="text-slate-500 hover:text-slate-800">
                                <CloseIcon />
                            </button>
                        </div>

                        {submissions.length === 0 ? (
                            <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 text-slate-500">
                                No submissions yet.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {submissions.map((submission) => (
                                    <div
                                        key={submission._id}
                                        className="rounded-xl border border-slate-200 p-4 bg-white shadow-sm">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-semibold text-slate-800">
                                                    {submission.studentName}
                                                </h3>
                                                <p className="text-slate-500 text-sm">
                                                    {submission.studentUsername} · {formatDate(submission.submittedAt)}
                                                </p>
                                            </div>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${submission.isLate
                                                        ? "bg-red-50 text-red-600 border border-red-200"
                                                        : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                                    }`}>
                                                {submission.isLate ? "Late" : "On time"}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-slate-600 text-sm">
                                            {submission.notes || "No notes provided."}
                                        </p>
                                        {submission.attachments?.length > 0 && (
                                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {submission.attachments.map((file, idx) => (
                                                    <div key={`${file.name}-${idx}`} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                                        <div className="flex items-center gap-3 overflow-hidden">
                                                            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg flex-shrink-0">
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
                                                        {file.content && (
                                                            <a
                                                                href={file.content}
                                                                download={file.name}
                                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors flex-shrink-0"
                                                                title="Download"
                                                            >
                                                                <DownloadIcon />
                                                            </a>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Body;
