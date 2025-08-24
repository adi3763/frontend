import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Home } from "./Components/Home";
import { Shop } from "./Components/Common/Shop"; // fix the ../src import
import ProductPage from "./Components/ProductPage";
import Cart from "./Components/Cart";
import Checkout from "./Components/Checkout";
import Login from "./Components/Admin/Login";
import Dashboard from "./Components/Admin/Dashboard";
import AdminAuthProvider from "./Components/Context/AdminAuthContext"; // default export
import ProtectedRoutes from "./ProtectedRoutes";
import ShowCategory from "./Components/Admin/CategoryComponents/ShowCategory";
import EditCategory from "./Components/Admin/CategoryComponents/EditCategory";
import CreateCategory from "./Components/Admin/CategoryComponents/CreateCategory";

function App() {
  return (
    <AdminAuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/admin/login" element={<Login />} />

        {/* Protected Admin Area */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          {/* add more protected admin routes here */}
          <Route path="/admin/categories" element={<ShowCategory />} />
          <Route path="/admin/category" element={<CreateCategory />} />
          <Route path="/admin/category/:id" element={<EditCategory />} />
        </Route>
      </Routes>
    </AdminAuthProvider>
  );
}

export default App;
