import React from "react";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider } from "../context/auth";
import { MemoryRouter } from "react-router-dom";
import {
  randomSettings,
  randomTimesheet,
  randomUser,
} from "../fixtures/random";
import TimesheetPage from "./TimesheetPage";
import * as datastore from "../services/datastore";
import { Provider } from "react-redux";
import store from "../store";
import { setSettings } from "../store/settings";
import { Shift } from "../types";
import { getTimesFromShift } from "../helpers/shift";

jest.mock("../services/datastore");
const testUser = randomUser();
const testTimesheet = randomTimesheet(testUser);
const testShifts = testTimesheet.shifts as Shift[];
// Make the user's default shift times coincide with the test timesheet's times.
testUser.defaultShifts = testShifts.map((shift) => getTimesFromShift(shift));
// Make the first day of the week coincide with the date of the first shift 
// in testTimesheet.
const testSettings = randomSettings({
  firstDayOfWeek: new Date(testShifts[0].start).getDay().toString(),
});

const Fixture: React.FC = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <MemoryRouter>
          <TimesheetPage />
        </MemoryRouter>
      </AuthProvider>
    </Provider>
  );
};

beforeAll(() => {
  jest.spyOn(datastore, "fetchCurrentUser").mockResolvedValue(testUser);
  localStorage.setItem("user", JSON.stringify(testUser));
  store.dispatch(setSettings(testSettings));
});

test("renders timesheet page", async () => {
  await act(async () => {
    render(<Fixture />);
  });

  expect(screen.getByRole("heading")).toHaveTextContent(/new timesheet/i);
});

test("handles TimesheetForm submission", async () => {
  // jest.spyOn(datastore, "createTimesheet").mockResolvedValue(testTimesheet);

  await act(async () => {
    render(<Fixture />);
  });

  expect(screen.getByRole("heading")).toHaveTextContent(/new timesheet/i);
  userEvent.click(screen.getByText(/^submit$/i));
  expect(datastore.createTimesheet).toHaveBeenCalledWith({
    userID: testTimesheet.userID,
    shifts: testTimesheet.shifts,
  });
});