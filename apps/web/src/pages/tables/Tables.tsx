import {
  CheckCircle2,
  MoreHorizontal,
  Plus,
  QrCode,
  Search,
  Smartphone,
  Tag,
} from "lucide-react";

import AdminLayout from "../../components/layout/AdminLayout";

const tables = [
  {
    id: "T-001",
    name: "Table 01",
    zone: "Men's Wear",
    products: 8,
    tags: 32,
    status: "Active",
    lastScan: "2 min ago",
  },
  {
    id: "T-002",
    name: "Table 02",
    zone: "Footwear",
    products: 5,
    tags: 18,
    status: "Active",
    lastScan: "5 min ago",
  },
  {
    id: "T-003",
    name: "Table 03",
    zone: "Women's Wear",
    products: 11,
    tags: 41,
    status: "Active",
    lastScan: "1 min ago",
  },
  {
    id: "T-004",
    name: "Table 04",
    zone: "T-Shirts",
    products: 6,
    tags: 24,
    status: "Active",
    lastScan: "Just now",
  },
  {
    id: "T-005",
    name: "Table 05",
    zone: "Accessories",
    products: 4,
    tags: 16,
    status: "Inactive",
    lastScan: "Yesterday",
  },
];

function Tables() {
  return (
    <AdminLayout>
      <div className="tables-page">
        <div className="page-heading">
          <div>
            <span className="page-kicker">STORE LAYOUT</span>
            <h1>Tables</h1>
            <p>
              Manage display tables, QR codes, products and connected
              SmartTags.
            </p>
          </div>

          <button className="primary-button" type="button">
            <Plus size={17} />
            Add Table
          </button>
        </div>

        <section className="table-summary-grid">
          <div className="table-summary-card">
            <span>Total Tables</span>
            <strong>12</strong>
            <small>Across store floor</small>
          </div>

          <div className="table-summary-card">
            <span>Active Tables</span>
            <strong>11</strong>
            <small>91.7% active</small>
          </div>

          <div className="table-summary-card">
            <span>Connected Tags</span>
            <strong>486</strong>
            <small>Across all tables</small>
          </div>

          <div className="table-summary-card">
            <span>QR Scans Today</span>
            <strong>1,284</strong>
            <small>+18.4% vs yesterday</small>
          </div>
        </section>

        <section className="panel tables-panel">
          <div className="tables-toolbar">
            <div className="tables-search">
              <Search size={17} />
              <input
                type="search"
                placeholder="Search table, zone or ID..."
              />
            </div>

            <div className="tables-toolbar-info">
              <span className="live-dot" />
              Store floor connected
            </div>
          </div>

          <div className="tables-table">
            <div className="table-row table-row-head">
              <span>Table</span>
              <span>Zone</span>
              <span>Products</span>
              <span>SmartTags</span>
              <span>QR Code</span>
              <span>Status</span>
              <span>Last Scan</span>
              <span />
            </div>

            {tables.map((table) => (
              <div className="table-row" key={table.id}>
                <div className="table-name-cell">
                  <div className="table-icon">
                    <QrCode size={17} />
                  </div>

                  <div>
                    <strong>{table.name}</strong>
                    <small>{table.id}</small>
                  </div>
                </div>

                <span className="table-zone">
                  {table.zone}
                </span>

                <div className="table-count">
                  <Tag size={15} />
                  <span>{table.products}</span>
                </div>

                <div className="table-count">
                  <Smartphone size={15} />
                  <span>{table.tags}</span>
                </div>

                <button
                  className="qr-action-button"
                  type="button"
                  aria-label={`View QR code for ${table.name}`}
                >
                  <QrCode size={16} />
                  View QR
                </button>

                <span
                  className={
                    table.status === "Active"
                      ? "table-status table-status-active"
                      : "table-status table-status-inactive"
                  }
                >
                  <CheckCircle2 size={13} />
                  {table.status}
                </span>

                <span className="table-muted">
                  {table.lastScan}
                </span>

                <button
                  className="row-action-button"
                  type="button"
                  aria-label={`More options for ${table.name}`}
                >
                  <MoreHorizontal size={17} />
                </button>
              </div>
            ))}
          </div>

          <div className="tables-footer">
            <span>
              Showing {tables.length} of 12 tables
            </span>

            <span>
              QR-based product discovery is enabled
            </span>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

export default Tables;