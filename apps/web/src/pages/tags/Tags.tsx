import {
  Battery,
  Bluetooth,
  CircleCheck,
  Lock,
  MoreHorizontal,
  Plus,
  Search,
  Signal,
  Unlock,
} from "lucide-react";

import AdminLayout from "../../components/layout/AdminLayout";

const tags = [
  {
    id: "A103",
    product: "Black T-Shirt",
    table: "Table 04",
    status: "Locked",
    battery: 94,
    signal: "Strong",
    lastSeen: "Just now",
  },
  {
    id: "B204",
    product: "Denim Jacket",
    table: "Table 07",
    status: "Unlocked",
    battery: 81,
    signal: "Strong",
    lastSeen: "12 sec ago",
  },
  {
    id: "C118",
    product: "White Sneakers",
    table: "Table 02",
    status: "Locked",
    battery: 76,
    signal: "Good",
    lastSeen: "28 sec ago",
  },
  {
    id: "D091",
    product: "Oversized Hoodie",
    table: "Table 09",
    status: "Offline",
    battery: 38,
    signal: "Offline",
    lastSeen: "8 min ago",
  },
];

function Tags() {
  return (
    <AdminLayout>
      <div className="tags-page">
        <div className="page-heading">
          <div>
            <span className="page-kicker">HARDWARE</span>

            <h1>SmartTags</h1>

            <p>
              Monitor, assign and manage physical SmartTags across your store.
            </p>
          </div>

          <button className="primary-button" type="button">
            <Plus size={17} />
            Add Tag
          </button>
        </div>

        <section className="tag-summary-grid">
          <div className="tag-summary-card">
            <span>Total Tags</span>
            <strong>486</strong>
            <small>Across 12 tables</small>
          </div>

          <div className="tag-summary-card">
            <span>Locked</span>
            <strong>318</strong>
            <small>Ready for customers</small>
          </div>

          <div className="tag-summary-card">
            <span>Unlocked</span>
            <strong>124</strong>
            <small>Currently authorized</small>
          </div>

          <div className="tag-summary-card">
            <span>Offline</span>
            <strong>44</strong>
            <small>Needs attention</small>
          </div>
        </section>

        <section className="panel tags-panel">
          <div className="tags-toolbar">
            <div className="tags-search">
              <Search size={17} />

              <input
                type="search"
                placeholder="Search tag ID, product or table..."
              />
            </div>

            <div className="tags-live-status">
              <span className="live-dot" />
              Live device monitoring
            </div>
          </div>

          <div className="tags-table">
            <div className="tag-row tag-row-head">
              <span>Tag</span>
              <span>Product</span>
              <span>Table</span>
              <span>Status</span>
              <span>Battery</span>
              <span>Signal</span>
              <span>Last seen</span>
              <span />
            </div>

            {tags.map((tag) => (
              <div className="tag-row" key={tag.id}>
                <div className="tag-id-cell">
                  <div className="tag-icon">
                    <Bluetooth size={16} />
                  </div>

                  <div>
                    <strong>{tag.id}</strong>
                    <small>SmartTag</small>
                  </div>
                </div>

                <span className="tag-product">
                  {tag.product}
                </span>

                <span className="tag-muted">
                  {tag.table}
                </span>

                <span
                  className={
                    tag.status === "Locked"
                      ? "tag-status tag-status-locked"
                      : tag.status === "Unlocked"
                        ? "tag-status tag-status-unlocked"
                        : "tag-status tag-status-offline"
                  }
                >
                  {tag.status === "Locked" ? (
                    <Lock size={12} />
                  ) : tag.status === "Unlocked" ? (
                    <Unlock size={12} />
                  ) : (
                    <Signal size={12} />
                  )}

                  {tag.status}
                </span>

                <div className="tag-battery">
                  <Battery size={15} />

                  <span>{tag.battery}%</span>
                </div>

                <div className="tag-signal">
                  <span
                    className={
                      tag.signal === "Offline"
                        ? "signal-bars signal-offline"
                        : "signal-bars"
                    }
                  >
                    <i />
                    <i />
                    <i />
                  </span>

                  <span>{tag.signal}</span>
                </div>

                <span className="tag-muted">
                  {tag.lastSeen}
                </span>

                <button
                  className="row-action-button"
                  type="button"
                  aria-label={`More options for tag ${tag.id}`}
                >
                  <MoreHorizontal size={17} />
                </button>
              </div>
            ))}
          </div>

          <div className="tags-footer">
            <div className="tags-health">
              <CircleCheck size={15} />
              All connected devices are reporting normally
            </div>

            <span>Showing 4 of 486 tags</span>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

export default Tags;