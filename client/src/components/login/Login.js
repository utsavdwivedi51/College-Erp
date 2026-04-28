import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { adminSignIn } from "../../redux/actions/adminActions";
import { facultySignIn } from "../../redux/actions/facultyActions";
import { studentSignIn } from "../../redux/actions/studentActions";
import { SET_ERRORS } from "../../redux/actionTypes";
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const errors = useSelector((state) => state.errors || {});
  const [selectedRole, setSelectedRole] = useState("faculty");
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const roles = useMemo(
    () => [
      {
        key: "admin",
        icon: "🛡️",
        title: "Admin",
        subtitle: "Manage ERP",
        sampleId: "ADMDUMMY",
      },
      {
        key: "faculty",
        icon: "👨‍🏫",
        title: "Teacher",
        subtitle: "Staff login",
        sampleId: "FAC2026...",
      },
      {
        key: "student",
        icon: "👨‍🎓",
        title: "Student",
        subtitle: "Student login",
        sampleId: "STU2026...",
      },
    ],
    []
  );

  const activeRole = roles.find((role) => role.key === selectedRole) || roles[0];

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
    setFormData({ username: "", password: "" });
    setShowPassword(false);
    setLoading(false);
  }, [dispatch, selectedRole]);

  useEffect(() => {
    if (Object.keys(errors).length !== 0) {
      setLoading(false);
    }
  }, [errors]);

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch({ type: SET_ERRORS, payload: {} });

    const payload = {
      username: formData.username.trim(),
      password: formData.password,
    };

    if (selectedRole === "admin") {
      dispatch(adminSignIn(payload, navigate));
      return;
    }

    if (selectedRole === "faculty") {
      dispatch(facultySignIn(payload, navigate));
      return;
    }

    dispatch(studentSignIn(payload, navigate));
  };

  return (
    <div className="min-h-screen w-screen bg-[#e8f3ff]">
      <header className="h-16 px-6 lg:px-20 bg-white/85 backdrop-blur-md border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-bold text-sm flex items-center justify-center shadow-md">
            UGI
          </div>
          <h1 className="text-slate-800 font-bold text-xl">UGIverse</h1>
          <span className="text-[11px] font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
            Attendance ERP
          </span>
        </div>
        <p className="text-sm font-semibold text-slate-700">Unified Login</p>
      </header>

      <main className="px-6 md:px-12 py-10 md:py-16 flex justify-center">
        <section className="w-full max-w-5xl grid lg:grid-cols-2 gap-5">
          <div className="rounded-2xl bg-[#bfd5f6] border border-blue-100 p-6 md:p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              Student & Teacher Portal
            </h2>
            <p className="text-slate-600 font-medium">Developed by UGIverse</p>
            <p className="text-slate-600 mb-7">Your whole college universe in one website</p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/45 rounded-xl p-4 border border-blue-100">
                <p className="text-4xl font-bold text-blue-600">5</p>
                <p className="text-slate-700 font-semibold">Students</p>
              </div>
              <div className="bg-white/45 rounded-xl p-4 border border-blue-100">
                <p className="text-4xl font-bold text-blue-600">2</p>
                <p className="text-slate-700 font-semibold">Classes</p>
              </div>
              <div className="bg-white/45 rounded-xl p-4 border border-blue-100">
                <p className="text-4xl font-bold text-blue-600">0%</p>
                <p className="text-slate-700 font-semibold">Today Present</p>
              </div>
              <div className="bg-white/45 rounded-xl p-4 border border-blue-100">
                <p className="text-4xl font-bold text-blue-600">40</p>
                <p className="text-slate-700 font-semibold">Attendance Records</p>
              </div>
            </div>
          </div>

          <form
            onSubmit={onSubmit}
            className="rounded-2xl bg-white p-6 md:p-8 shadow-xl border border-slate-100">
            <h2 className="text-4xl font-bold text-slate-800 mb-5">Login</h2>

            <div className="grid grid-cols-3 gap-2 mb-5">
              {roles.map((role) => (
                <button
                  key={role.key}
                  type="button"
                  onClick={() => setSelectedRole(role.key)}
                  className={`rounded-xl border px-2 py-3 text-center transition-all duration-150 ${selectedRole === role.key
                    ? "border-blue-500 bg-blue-50 shadow-sm"
                    : "border-slate-200 bg-slate-50 hover:border-slate-300"
                    }`}>
                  <p className="text-xl">{role.icon}</p>
                  <p className="text-slate-800 font-semibold leading-tight">{role.title}</p>
                  <p className="text-xs text-slate-500">{role.subtitle}</p>
                </button>
              ))}
            </div>

            <div className="space-y-3 mb-5">
              <div>
                <label className="text-sm text-slate-500 font-semibold">Username / ID</label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, username: e.target.value }))
                  }
                  placeholder={`e.g. ${activeRole.sampleId}`}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-700 outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="text-sm text-slate-500 font-semibold">Password</label>
                <div className="mt-1 flex gap-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, password: e.target.value }))
                    }
                    placeholder="Enter password"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-700 outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="rounded-lg border border-slate-300 px-3 text-slate-600 bg-slate-50 text-sm font-semibold">
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-2.5 shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-150">
              {loading ? "Signing in..." : `Sign in as ${activeRole.title}`}
            </button>

            {(errors.usernameError || errors.passwordError || errors.backendError) && (
              <p className="mt-3 text-sm text-red-500 text-center">
                {errors.usernameError || errors.passwordError || errors.backendError}
              </p>
            )}

            <p className="mt-3 text-xs text-slate-500 text-center">
              One page login for Admin, Teacher, and Student.
            </p>
          </form>
        </section>
      </main>
    </div>
  );
};

export default Login;
