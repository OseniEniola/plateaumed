import logo from './logo.svg';
import React from "react";
import './App.scss';
import {authProtectedRoutes,publicRoutes,Roles} from "./routes";
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import AppRoute from "./routes/routes";
import MainLayout from "./components/shared/layout/main-layout";
import Login from "./pages/login/Login";
import {Toaster} from "react-hot-toast";
import {loadUserDataToLocalStorage} from "./helpers/services/api";

function getLoggedInUserData() {
    if (localStorage.getItem("authUser") != undefined) {
        const userData = JSON.parse(atob(localStorage.getItem("authUser") || ""));
        if (userData) return userData;
        return null;
    }
}
const App =() => {
        loadUserDataToLocalStorage();
    const loggedUser = getLoggedInUserData();
  const PublicRoutes = publicRoutes.map((route, idx) => (
      <Route
          key={idx}
          path={route.path}
          element={
            <React.Suspense fallback={""}>
              <AppRoute isAuthProtected={false} component={route.component} />
            </React.Suspense>
          }
      />
  ));

  const AuthProtectedRoutes = authProtectedRoutes.filter(e=>{
      console.log(loggedUser)

      return e.roles?.includes(loggedUser?.role)}).map((route, idx) => {
    return (
        <>
            {console.log('return route')}
            <Route
                key={idx}
                exact
                path={route.path}
                element={
                    <React.Suspense fallback={""}>
                        <AppRoute isAuthProtected={true} layout={MainLayout} component={route.component} />
                    </React.Suspense>
                }
            >
                {" "}
            </Route>
        </>

    );
  });

  const router = createBrowserRouter(
      createRoutesFromElements(
          <>
            {[...PublicRoutes]}
            {[...AuthProtectedRoutes]}
            <Route path="*" element={<Login />} />
          </>
      )
  );

  return (
      <div>
        <RouterProvider router={router} />
          <div>
              <Toaster
                  position="top-right"
                  toastOptions={{
                      style: {
                          fontSize: "0.88rem",
                      },
                  }}
              />
              <script src="https://unpkg.com/primereact/core/core.min.js"></script>
              <script src="https://unpkg.com/primereact/confirmdialog/confirmdialog.min.js"></script>

              <title>React App</title>
          </div>
      </div>);
}

export default App;
