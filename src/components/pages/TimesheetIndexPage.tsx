import React from "react";
import PageTitle from "components/PageTitle";
import DefaultLayout from "components/layouts/DefaultLayout";
import { useAuth } from "context/auth";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import TimesheetTable from "components/tables/TimesheetTable";
import { useSelector } from "react-redux";
import { selectTimesheets } from "store/timesheets";

const TimesheetIndexPage = () => {
  const { user, logout } = useAuth();
  const { timesheets, status: timesheetStoreStatus } = useSelector(
    selectTimesheets
  );

  return (
    <DefaultLayout>
      <PageTitle>Timesheets</PageTitle>
      <div className="container">
        <div className="my-3">
          <Link className="btn btn-primary" to="/new-timesheet">
            Create new timesheet
          </Link>
        </div>
        {timesheetStoreStatus === "pending" ? (
          <p>Loading...</p>
        ) : (
          <TimesheetTable timesheets={timesheets} />
        )}
      </div>
    </DefaultLayout>
  );
};

export default TimesheetIndexPage;
