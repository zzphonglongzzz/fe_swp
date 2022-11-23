import React, { Fragment } from "react";
import DefaultLayout from "./component/DefaultLayout/DefaultLayout";
import PublicRoute from "./router/PublicRoute";
import ProtectedRoute from "./router/ProtectedRoute";
import { privateRoutes, publicRoutes } from "./router";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<PublicRoute />}>
            {publicRoutes.map((route, index) => {
              const Layout = route.layout === null ? Fragment : DefaultLayout;
              const Page = route.component;
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}
          </Route>
          <Route path="/" element={<ProtectedRoute />}>
            {privateRoutes.map((route, index) => {
              const Layout = route.layout === null ? Fragment : DefaultLayout;
              const Page = route.component;
              const acceptRole = route.acceptRole;
              return (
                <Route
                  path="/"
                  key={index}
                  element={<ProtectedRoute acceptRole={acceptRole} />}
                >
                  <Route
                    path={route.path}
                    element={
                      <Layout>
                        <Page />
                      </Layout>
                    }
                  />
                </Route>
              );
            })}
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
