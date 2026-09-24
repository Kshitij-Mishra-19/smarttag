import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  Lock,
  Package,
  ShoppingBag,
  Unlock,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect } from "react";

import AdminLayout from "../../components/layout/AdminLayout";
import { useTheme } from "../../context/ThemeContext";
import { checkApiHealth } from "../../services/api";

const revenueData = [
  { day: "01", revenue: 4200 },
  { day: "05", revenue: 6800 },
  { day: "10", revenue: 5200 },
  { day: "15", revenue: 9100 },
  { day: "20", revenue: 7600 },
  { day: "25", revenue: 11200 },
  { day: "30", revenue: 13800 },
];

const recentOrders = [
  {
    id: "#ORD-1048",
    product: "Black T-Shirt",
    tag: "A103",
    amount: "₹999",
    status: "Paid",
    time: "2 min ago",
  },
  {
    id: "#ORD-1047",
    product: "Denim Jacket",
    tag: "B204",
    amount: "₹2,499",
    status: "Paid",
    time: "8 min ago",
  },
  {
    id: "#ORD-1046",
    product: "White Sneakers",
    tag: "C118",
    amount: "₹3,299",
    status: "Paid",
    time: "14 min ago",
  },
  {
    id: "#ORD-1045",
    product: "Oversized Hoodie",
    tag: "D091",
    amount: "₹1,799",
    status: "Pending",
    time: "21 min ago",
  },
];

function Dashboard() {
  const { theme } = useTheme();

  const isDark = theme === "dark";

  useEffect(() => {
    checkApiHealth()
      .then((data) => {
        console.log("SmartTag API:", data);
      })
      .catch((error) => {
        console.error(
          "SmartTag API connection failed:",
          error,
        );
      });
  }, []);

  const chartStroke = isDark ? "#818cf8" : "#6366f1";
  const chartGrid = isDark ? "#293548" : "#eef0f4";
  const chartText = isDark ? "#98a2b3" : "#98a2b3";
  const tooltipBackground = isDark
    ? "#111827"
    : "#ffffff";
  const tooltipBorder = isDark
    ? "#293548"
    : "#e6e9ef";

  return (
    <AdminLayout>
      <div className="dashboard-page">
        <div className="page-heading">
          <div>
            <span className="page-kicker">OVERVIEW</span>

            <h1>Dashboard</h1>

            <p>
              Monitor your SmartTag store, sales and
              connected hardware from one place.
            </p>
          </div>

          <div className="dashboard-date">
            <Activity size={16} />
            Live store data
          </div>
        </div>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-top">
              <span>Today's Revenue</span>

              <div className="stat-icon stat-icon-revenue">
                <CreditCard size={18} />
              </div>
            </div>

            <strong>₹48,620</strong>

            <div className="stat-card-bottom">
              <span className="stat-positive">
                <ArrowUpRight size={14} />
                12.8%
              </span>

              <small>vs yesterday</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span>Orders</span>

              <div className="stat-icon stat-icon-orders">
                <ShoppingBag size={18} />
              </div>
            </div>

            <strong>184</strong>

            <div className="stat-card-bottom">
              <span className="stat-positive">
                <ArrowUpRight size={14} />
                8.4%
              </span>

              <small>vs yesterday</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span>Active SmartTags</span>

              <div className="stat-icon stat-icon-tags">
                <Package size={18} />
              </div>
            </div>

            <strong>442</strong>

            <div className="stat-card-bottom">
              <span className="stat-positive">
                <ArrowUpRight size={14} />
                4.2%
              </span>

              <small>this week</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span>Unlock Rate</span>

              <div className="stat-icon stat-icon-unlock">
                <Unlock size={18} />
              </div>
            </div>

            <strong>94.6%</strong>

            <div className="stat-card-bottom">
              <span className="stat-negative">
                <ArrowDownRight size={14} />
                1.2%
              </span>

              <small>vs last week</small>
            </div>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="panel revenue-panel">
            <div className="panel-header">
              <div>
                <span className="page-kicker">SALES</span>

                <h2>Revenue Overview</h2>

                <p>
                  Revenue performance over the last 30
                  days.
                </p>
              </div>

              <div className="revenue-total">
                <strong>₹2.84L</strong>
                <span>Last 30 days</span>
              </div>
            </div>

            <div className="revenue-chart">
              <ResponsiveContainer
                width="100%"
                height={300}
              >
                <AreaChart
                  data={revenueData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient
                      id="revenueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={chartStroke}
                        stopOpacity={0.28}
                      />

                      <stop
                        offset="100%"
                        stopColor={chartStroke}
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={chartGrid}
                  />

                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: chartText,
                      fontSize: 11,
                    }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: chartText,
                      fontSize: 11,
                    }}
                    tickFormatter={(value) =>
                      `₹${value / 1000}k`
                    }
                  />

                  <Tooltip
                    contentStyle={{
                      background: tooltipBackground,
                      border: `1px solid ${tooltipBorder}`,
                      borderRadius: "10px",
                      color: isDark
                        ? "#f9fafb"
                        : "#101828",
                      boxShadow: isDark
                        ? "0 12px 30px rgba(0,0,0,0.28)"
                        : "0 8px 24px rgba(16,24,40,0.08)",
                    }}
                    labelStyle={{
                      color: isDark
                        ? "#98a2b3"
                        : "#667085",
                    }}
                    formatter={(value) => [
                      `₹${Number(value).toLocaleString(
                        "en-IN",
                      )}`,
                      "Revenue",
                    ]}
                  />

                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke={chartStroke}
                    strokeWidth={2.5}
                    fill="url(#revenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="panel tag-status-panel">
            <div className="panel-header">
              <div>
                <span className="page-kicker">
                  HARDWARE
                </span>

                <h2>Tag Status</h2>

                <p>
                  Current SmartTag availability.
                </p>
              </div>
            </div>

            <div className="tag-status-list">
              <div className="tag-status-item">
                <div className="tag-status-icon tag-status-icon-locked">
                  <Lock size={17} />
                </div>

                <div className="tag-status-info">
                  <strong>Locked</strong>
                  <span>Ready for customers</span>
                </div>

                <strong>318</strong>
              </div>

              <div className="tag-status-item">
                <div className="tag-status-icon tag-status-icon-unlocked">
                  <Unlock size={17} />
                </div>

                <div className="tag-status-info">
                  <strong>Unlocked</strong>
                  <span>Currently authorized</span>
                </div>

                <strong>124</strong>
              </div>

              <div className="tag-status-item">
                <div className="tag-status-icon tag-status-icon-offline">
                  <Activity size={17} />
                </div>

                <div className="tag-status-info">
                  <strong>Offline</strong>
                  <span>Needs attention</span>
                </div>

                <strong>44</strong>
              </div>
            </div>

            <div className="tag-health">
              <span className="live-dot" />
              <span>All systems operational</span>
            </div>
          </div>
        </section>

        <section className="panel recent-orders-panel">
          <div className="panel-header">
            <div>
              <span className="page-kicker">
                TRANSACTIONS
              </span>

              <h2>Recent Orders</h2>

              <p>
                Latest customer purchases from your
                store.
              </p>
            </div>

            <button
              className="secondary-button"
              type="button"
            >
              View all orders
              <ArrowUpRight size={15} />
            </button>
          </div>

          <div className="orders-table">
            <div className="order-row order-row-head">
              <span>Order</span>
              <span>Product</span>
              <span>Tag</span>
              <span>Amount</span>
              <span>Status</span>
              <span>Time</span>
            </div>

            {recentOrders.map((order) => (
              <div
                className="order-row"
                key={order.id}
              >
                <strong>{order.id}</strong>

                <span className="order-product">
                  {order.product}
                </span>

                <span className="order-tag">
                  {order.tag}
                </span>

                <strong>{order.amount}</strong>

                <span
                  className={
                    order.status === "Paid"
                      ? "order-status order-status-paid"
                      : "order-status order-status-pending"
                  }
                >
                  {order.status}
                </span>

                <span className="order-time">
                  {order.time}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

export default Dashboard;