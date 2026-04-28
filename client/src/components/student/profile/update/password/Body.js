import React, { useEffect, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Spinner from "../../../../../utils/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as classes from "../../../../../utils/styles";
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
    <div className="flex-[0.78] mt-1 overflow-y-auto pr-1">
      <div className="space-y-5">
        <div className="flex text-slate-500 items-center space-x-2">
          <VisibilityOffIcon />
          <h1 className="font-medium">Password</h1>
        </div>

        <div className="bg-white border border-slate-100 flex flex-col rounded-2xl min-h-[33rem] shadow-sm pt-4">
          <form
            onSubmit={update}
            className="flex flex-col space-y-6 items-center my-8">
            <h1 className="text-slate-800 text-3xl font-bold">Update Password</h1>
            <div className="space-y-1">
              <p className="text-[#515966] font-bold text-sm">New Password</p>
              <div className="border-2 rounded-lg px-3 flex items-center space-x-3 w-full">
                <input
                  onChange={(e) => setNewPassword(e.target.value)}
                  value={newPassword}
                  required
                  type={showPassword ? "text" : "password"}
                  className="rounded-lg outline-none py-2  placeholder:text-sm"
                  placeholder="New Password"
                />
                {showPassword ? (
                  <VisibilityIcon
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer"
                  />
                ) : (
                  <VisibilityOffIcon
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer"
                  />
                )}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[#515966] font-bold text-sm">
                Confirm Password
              </p>
              <div className="border-2 rounded-lg px-3 flex items-center space-x-3 w-full">
                <input
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  required
                  type={showPassword ? "text" : "password"}
                  className="rounded-lg outline-none py-2  placeholder:text-sm"
                  placeholder="Confirm Password"
                />
                {showPassword ? (
                  <VisibilityIcon
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer"
                  />
                ) : (
                  <VisibilityOffIcon
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer"
                  />
                )}
              </div>
            </div>
            <div className={classes.adminFormButton}>
              <button className={classes.adminFormSubmitButton} type="submit">
                Update
              </button>
              <button
                onClick={() => navigate("/student/profile")}
                className={classes.adminFormClearButton}
                type="button">
                Cancel
              </button>
            </div>
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
    </div>
  );
};

export default Body;
