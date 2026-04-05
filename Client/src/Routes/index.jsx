import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoading } from "../Components/Common/LoadingIndicator";
import PrivateRoute from "./PrivateRoutes";
import AdminRoute from "./AdminRoutes";
import GeneralLayout from "../Layouts/GeneralLayout";
import AdminLayout from "../Views/Admin/AdminLayout";
import ProfileView from "../Components/Common/ProfileView";
import CategoryProductsPage from "../Views/Home/CategoryProductsPage";
import CategoriesPage from "../Views/Home/CategoriesPage";
import AddressModal from "../Views/Address";
import ThankYouPage from "../Views/ThankYouPage";
import MyAccount from "../Views/Account";
import PageLoader from "../Components/Common/PageLoader";
import { getMe } from "../store/redux/thunks";
// Lazy-loaded Pages
const Home = lazy(() => import("../Views/Home"));
const About = lazy(() => import("../Views/About"));
const PrivacyPolicy = lazy(() => import("../Views/Public/PrivacyPolicy"));
const TermsOfService = lazy(() => import("../Views/Public/TermsOfService"));
const BlogFeed = lazy(() => import("../Views/Public/BlogFeed"));
const FAQ = lazy(() => import("../Views/Public/FAQ"));
const Contact = lazy(() => import("../Views/Contact"));
const NotFound = lazy(() => import("../Views/NotFound"));
const Login = lazy(() => import("../Views/Admin/Login"));
const Logout = lazy(() => import("../Views/Admin/Logout/Logout"));
const Dashboard = lazy(() => import("../Views/Admin/Dashboard"));
const CategoryManager = lazy(() => import("../Views/Admin/Products"));
const ProductDetails = lazy(() => import("../Views/Admin/Products/ProductDetails"));
const Users = lazy(() => import("../Views/Admin/Users"));

const AppRoutes = () => {
  const user = useSelector((state) => state.auth.user);
  const userState = useSelector((state) => state.user);
  const { showLoading } = useLoading();
  const dispatch = useDispatch();

  if (userState.isFetching) {
  // return (
  //   <div style={{ padding: 30 }}>
  //     <LoadingIndicator />
  //   </div>
  // );
  }

  useEffect(() => {
    dispatch(getMe());
  }, []);

  return (
    <Suspense fallback={<PageLoader/>}>
      <Routes>

        <Route element={<GeneralLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route path="/category/:categoryId" element={<CategoryProductsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path ="/privacy" element={<PrivacyPolicy/>} />
          <Route path ="/terms" element={<TermsOfService/>} />
          <Route path ="blog" element={<BlogFeed/>} />
          <Route path ="faqs" element={<FAQ/>} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route
          path="/admin/login"
          element={
            user
              ? user.userRole === "admin"
                ? <Navigate to="/admin/dashboard" />
                : <Navigate to="/" />
              : <Login />
          }
        />

        <Route element={<PrivateRoute />}>
          <Route element={<GeneralLayout />}>
            <Route path="/addresses" element={<AddressModal />} />
            <Route path="/account" element={<MyAccount />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
          </Route>
        </Route>

        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<ProfileView />} />
            <Route path="/admin/logout" element={<Logout />} />
            <Route path="/admin/categories" element={<CategoryManager />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/admin/users" element={<Users />} />
          </Route>
        </Route>

      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
