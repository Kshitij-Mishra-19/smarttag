import { NavLink } from "react-router-dom";
import {
  BarChart3,
  Box,
  CreditCard,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingBag,
  Smartphone,
  Tags,
  Table2,
} from "lucide-react";

const navigation = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    label: "Products",
    icon: Package,
    path: "/products",
  },
  {
    label: "Tables",
    icon: Table2,
    path: "/tables",
  },
  {
    label: "Tags",
    icon: Tags,
    path: "/tags",
  },
  {
    label: "Orders",
    icon: ShoppingBag,
    path: "/orders",
  },
  {
    label: "Payments",
    icon: CreditCard,
    path: "/payments",
  },
  {
    label: "Devices",
    icon: Smartphone,
    path: "/devices",
  },
  {
    label: "Analytics",
    icon: BarChart3,
    path: "/analytics",
  },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark">S</div>

        <div>
          <div className="brand-name">SmartTag</div>
          <div className="brand-caption">Retail Intelligence</div>
        </div>
      </div>

      <div className="sidebar-section">
        <span className="sidebar-label">Workspace</span>

        <nav className="sidebar-nav">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <Icon size={18} strokeWidth={1.8} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-bottom">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <Settings size={18} strokeWidth={1.8} />
          <span>Settings</span>
        </NavLink>

        <div className="store-card">
          <div className="store-avatar">S</div>

          <div className="store-info">
            <strong>SmartTag Store</strong>
            <span>Admin workspace</span>
          </div>

          <Box size={16} />
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;