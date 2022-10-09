import publicRoutes from "./router/index";
import React, { Fragment } from "react";
import DefaultLayout from './component/DefaultLayout/DefaultLayout'
import PublicRoute from "./router/PublicRoute";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/">
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
        </Routes>
      </div>
      {/* <BrowserRouter>
        <div className="App">
          <Routes>
            <Route index element={<Home />} />
            <Route path="product" element={<List />} />
          </Routes>
        </div>
      </BrowserRouter> */}
    </Router>
  );
}

export default App;
