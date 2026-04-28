import React, { useEffect, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Spinner from "../../../../../utils/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { studentUpdatePassword } from "../../../../../redux/actions/studentActions";

const Body = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const store = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setLoading(false);
    }
  }, [store.errors]);

  const update = (e) => {
    e.preventDefault();

    setLoading(true);
    dispatch(
      studentUpdatePassword(
        {
          newPassword: newPassword,
          confirmPassword: confirmPassword,
          email: user.result.email,
        },
        navigate
      )
    );
  };

  useEffect(() => {
    if (store.errors) {
      setLoading(false);
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [store.errors]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full max-w-xl bg-white border border-slate-100 rounded-2xl shadow-sm p-8">
        <form onSubmit={update} className="flex flex-col space-y-6 items-center">
          <h1 className="text-slate-800 text-3xl font-bold">Set New Password</h1>
          <p className="text-sm text-slate-500 text-center">
            This is your first login. Please choose a strong password to continue.
          </p>
          <div className="space-y-1">
            <p className="text-slate-600 font-semibold text-sm">New Password</p>
            <div className="border-2 border-slate-200 rounded-lg px-3 flex items-center space-x-3 w-full">
              <input
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
                required
                type={showPassword ? "text" : "password"}
                className="text-slate-700 rounded-lg outline-none py-2 placeholder:text-sm bg-transparent"
                placeholder="New Password"
              />
              {showPassword ? (
                <VisibilityIcon
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer text-slate-500"
                />
              ) : (
                <VisibilityOffIcon
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer text-slate-500"
                />
              )}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-slate-600 font-semibold text-sm">Confirm Password</p>
            <div className="border-2 border-slate-200 rounded-lg px-3 flex items-center space-x-3 w-full">
              <input
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                required
                type={showPassword ? "text" : "password"}
                className="text-slate-700 rounded-lg outline-none py-2 placeholder:text-sm bg-transparent"
                placeholder="Confirm Password"
              />
              {showPassword ? (
                <VisibilityIcon
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer text-slate-500"
                />
              ) : (
                <VisibilityOffIcon
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer text-slate-500"
                />
              )}
            </div>
          </div>
          <button
            type="submit"
            className="w-36 hover:scale-105 transition-all duration-150 rounded-lg flex items-center justify-center text-white text-base py-2 bg-gradient-to-r from-cyan-600 to-blue-600">
            Update
          </button>
          {loading && (
            <Spinner
              message="Updating"
              height={30}
              width={150}
              color="#111111"
              messageColor="#blue"
            />
          )}
          {error.mismatchError && (
            <p className="text-red-500">{error.mismatchError}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Body;
