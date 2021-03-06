import DefaultLayout from "components/layouts/DefaultLayout";
import Messages from "components/Messages";
import PageTitle from "components/PageTitle";
import TimesheetView from "components/TimesheetView";
import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { selectTimesheets } from "store/timesheets";
import NotFoundPage from "./NotFoundPage";

const TimesheetViewPage: React.FC = () => {
  const { id } = useParams<{
    id: string;
  }>();
  const { timesheets } = useSelector(selectTimesheets);
  const timesheet = timesheets.find((timesheet) => timesheet.id === id);

  return timesheet ? (
    <DefaultLayout>
      <PageTitle>Timesheet Details</PageTitle>
      <Messages />
      <div className="container">
        <TimesheetView timesheet={timesheet} />
      </div>
    </DefaultLayout>
  ) : (
    <NotFoundPage />
  );
};

export default TimesheetViewPage;
