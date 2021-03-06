import * as React from "react";
import PageTitle from "components/PageTitle";
import DefaultLayout from "components/layouts/DefaultLayout";
import { Link } from "react-router-dom";
import Messages from "components/Messages";

const NotFoundPage = () => (
  <DefaultLayout>
    <PageTitle>403: Access Denied</PageTitle>
    <Messages />
    <div className="container">
      <p>
        You do not have permission to view this page.{" "}
        <Link to="/">Return to the home page.</Link>
      </p>
    </div>
  </DefaultLayout>
);

export default NotFoundPage;
