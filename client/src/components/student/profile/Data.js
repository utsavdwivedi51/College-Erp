import React from "react";
import * as classes from "../../../utils/styles";
const Data = ({ label, value }) => {
  return (
    <div className={classes.adminForm3}>
      <h1 className={classes.adminLabel}>{label} :</h1>
      <h2 className="font-medium text-slate-700 text-sm md:text-base bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg">
        {value}
      </h2>
    </div>
  );
};

export default Data;
