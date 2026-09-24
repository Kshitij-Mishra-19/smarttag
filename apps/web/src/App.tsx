import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AdminLayout from "./components/layout/AdminLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Products from "./pages/products/Products";
import Tables from "./pages/tables/Tables";
import TableDetails from "./pages/tables/TableDetails";
import Tags from "./pages/tags/Tags";
import TableStore from "./customer/pages/TableStore";
import Checkout from "./customer/pages/Checkout";

function PlaceholderPage({ title }: { title: string }) {
  return (
    <AdminLayout>
      <div className="page-heading">
        <div>
          <span className="page-kicker">SMARTTAG</span>
          <h1>{title}</h1>
          <p>This module is being built next.</p>
        </div>
      </div>
    </AdminLayout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin */}
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/tables"
          element={<Tables />}
        />

        <Route
          path="/tables/:tableId"
          element={<TableDetails />}
        />

        <Route
          path="/tags"
          element={<Tags />}
        />

        <Route
          path="/orders"
          element={<PlaceholderPage title="Orders" />}
        />

        <Route
          path="/payments"
          element={<PlaceholderPage title="Payments" />}
        />

        <Route
          path="/devices"
          element={<PlaceholderPage title="Devices" />}
        />

        <Route
          path="/analytics"
          element={<PlaceholderPage title="Analytics" />}
        />

        <Route
          path="/settings"
          element={<PlaceholderPage title="Settings" />}
        />

        {/* Customer */}
        <Route
          path="/t/:tableId"
          element={<TableStore />}
        />

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        {/* Unknown URL */}
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;