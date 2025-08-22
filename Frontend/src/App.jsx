import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import AppRoute from "./config/routes";
import React, { Fragment } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "sonner";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster position="top-right" richColors />
      <Routes>
        {AppRoute.map((route) => {
          const Layout = route.layout || Fragment;
          const Page = route.page;
          const element = (
            <Layout>
              <Page />
            </Layout>
          );
          return (
            <Route
              key={route.path}
              path={route.path}
              element={
                route.allowedRoles ? (
                  <ProtectedRoute allowedRoles={route.allowedRoles}>
                    {element}
                  </ProtectedRoute>
                ) : (
                  element
                )
              }
            />
          );
        })}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
