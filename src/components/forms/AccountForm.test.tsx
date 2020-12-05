import React from "react";
import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import AccountForm from "./AccountForm";
import { randomUser } from "fixtures/random";
import { noop } from "lodash";

const { name: testName, email: testEmail } = randomUser();
const testDefaultValues = {
  name: testName,
  email: testEmail,
};

test("Form renders", () => {
  render(<AccountForm defaultValues={testDefaultValues} onSubmit={noop} />);
});

test("Form submission succeeds", (done) => {
  render(
    <AccountForm
      defaultValues={testDefaultValues}
      onSubmit={({ name, email }) => {
        expect(name).toEqual(testName);
        expect(email).toEqual(testEmail);
        done();
      }}
    />
  );

  userEvent.clear(screen.getByLabelText(/name/i));
  userEvent.type(screen.getByLabelText(/name/i), testName);
  userEvent.clear(screen.getByLabelText(/email address/i));
  userEvent.type(screen.getByLabelText(/email address/i), testEmail);
  userEvent.click(screen.getByText(/save/i));
});

test("Empty form submission fails", () => {
  render(
    <AccountForm
      defaultValues={testDefaultValues}
      onSubmit={() => {
        throw new Error("onSubmit should not be called.");
      }}
    />
  );

  userEvent.clear(screen.getByLabelText(/email address/i));
  userEvent.clear(screen.getByLabelText(/name/i));
  userEvent.click(screen.getByText(/save/i));
  expect(screen.getAllByText(/required/i)).toHaveLength(2);
});

test("Reject invalid form input", () => {
  const invalidEmail = testEmail.replace("@", "_");

  render(
    <AccountForm
      defaultValues={testDefaultValues}
      onSubmit={() => {
        throw new Error("onSubmit should not be called.");
      }}
    />
  );

  userEvent.clear(screen.getByLabelText(/email address/i));
  userEvent.type(screen.getByLabelText(/email address/i), invalidEmail);
  userEvent.click(screen.getByText(/save/i));
  screen.getByText(/must be a valid email address/i);
});