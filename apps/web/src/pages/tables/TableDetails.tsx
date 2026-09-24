import {
  ArrowLeft,
  Copy,
  Download,
  MoreHorizontal,
  Package,
  Smartphone,
  Tag,
  Trash2,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useNavigate } from "react-router-dom";

import AdminLayout from "../../components/layout/AdminLayout";

const products = [
  {
    name: "Black T-Shirt",
    sku: "ST-TS-001",
    price: "₹999",
    tags: 6,
    available: 6,
  },
  {
    name: "Oversized Hoodie",
    sku: "ST-HD-021",
    price: "₹1,799",
    tags: 4,
    available: 3,
  },
  {
    name: "Denim Jacket",
    sku: "ST-JK-014",
    price: "₹2,499",
    tags: 5,
    available: 5,
  },
];

const assignedTags = [
  {
    id: "A103",
    product: "Black T-Shirt",
    status: "Locked",
    battery: "94%",
  },
  {
    id: "A104",
    product: "Black T-Shirt",
    status: "Locked",
    battery: "91%",
  },
  {
    id: "H021",
    product: "Oversized Hoodie",
    status: "Unlocked",
    battery: "88%",
  },
  {
    id: "J014",
    product: "Denim Jacket",
    status: "Locked",
    battery: "96%",
  },
];

function TableDetails() {
  const navigate = useNavigate();

  const tableUrl = "https://smarttag.store/t/T-004";

  return (
    <AdminLayout>
      <div className="table-details-page">
        <div className="table-details-back">
          <button
            className="back-button"
            type="button"
            onClick={() => navigate("/tables")}
          >
            <ArrowLeft size={17} />
            Back to Tables
          </button>
        </div>

        <div className="page-heading">
          <div>
            <span className="page-kicker">TABLE MANAGEMENT</span>

            <div className="table-title-row">
              <h1>Table 04</h1>

              <span className="table-detail-active">
                Active
              </span>
            </div>

            <p>
              Manage products, SmartTags and customer QR access
              for this display table.
            </p>
          </div>

          <div className="table-heading-actions">
            <button className="secondary-button" type="button">
              <Download size={16} />
              Download QR
            </button>

            <button className="primary-button" type="button">
              <Tag size={17} />
              Assign Tag
            </button>
          </div>
        </div>

        <section className="table-detail-overview">
          <div className="table-qr-card">
            <div className="qr-preview">
              <QRCodeSVG
                value={tableUrl}
                size={190}
                bgColor="#ffffff"
                fgColor="#111827"
                level="H"
                includeMargin
              />
            </div>

            <div className="qr-card-content">
              <span className="page-kicker">CUSTOMER QR</span>

              <h2>Table 04 QR</h2>

              <p>
                Customers scan this QR to browse products
                displayed on this table.
              </p>

              <div className="qr-url">
                <span>{tableUrl}</span>

                <button
                  className="copy-button"
                  type="button"
                  aria-label="Copy table QR URL"
                  onClick={() => {
                    navigator.clipboard.writeText(tableUrl);
                  }}
                >
                  <Copy size={15} />
                </button>
              </div>

              <div className="qr-actions">
                <button
                  className="secondary-button"
                  type="button"
                >
                  Preview QR
                </button>

                <button
                  className="secondary-button"
                  type="button"
                >
                  <Download size={16} />
                  Download
                </button>
              </div>
            </div>
          </div>

          <div className="table-detail-stats">
            <div className="detail-stat-card">
              <Package size={19} />
              <span>Products</span>
              <strong>6</strong>
              <small>Currently displayed</small>
            </div>

            <div className="detail-stat-card">
              <Smartphone size={19} />
              <span>SmartTags</span>
              <strong>24</strong>
              <small>Connected to table</small>
            </div>

            <div className="detail-stat-card">
              <QRCodeSVG
                value={tableUrl}
                size={19}
                bgColor="transparent"
                fgColor="currentColor"
              />
              <span>QR Scans</span>
              <strong>184</strong>
              <small>Today</small>
            </div>

            <div className="detail-stat-card">
              <Tag size={19} />
              <span>Unlocks</span>
              <strong>27</strong>
              <small>Successful today</small>
            </div>
          </div>
        </section>

        <section className="panel table-detail-panel">
          <div className="detail-panel-header">
            <div>
              <span className="page-kicker">CATALOG</span>
              <h2>Assigned Products</h2>
              <p>
                Products currently displayed on Table 04.
              </p>
            </div>

            <button
              className="secondary-button"
              type="button"
            >
              <Package size={16} />
              Add Product
            </button>
          </div>

          <div className="assigned-product-list">
            {products.map((product) => (
              <div
                className="assigned-product-row"
                key={product.sku}
              >
                <div className="assigned-product-icon">
                  {product.name.charAt(0)}
                </div>

                <div className="assigned-product-main">
                  <strong>{product.name}</strong>
                  <small>{product.sku}</small>
                </div>

                <span className="assigned-product-price">
                  {product.price}
                </span>

                <div className="assigned-product-tags">
                  <Tag size={15} />
                  <span>{product.tags} tags</span>
                </div>

                <span className="assigned-product-stock">
                  {product.available} available
                </span>

                <button
                  className="row-action-button"
                  type="button"
                  aria-label={`More options for ${product.name}`}
                >
                  <MoreHorizontal size={17} />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="panel table-detail-panel">
          <div className="detail-panel-header">
            <div>
              <span className="page-kicker">HARDWARE</span>
              <h2>Assigned SmartTags</h2>
              <p>
                Physical tags currently connected to Table 04.
              </p>
            </div>

            <button
              className="secondary-button"
              type="button"
            >
              <Tag size={16} />
              Manage Tags
            </button>
          </div>

          <div className="assigned-tag-list">
            {assignedTags.map((tag) => (
              <div
                className="assigned-tag-row"
                key={tag.id}
              >
                <div className="assigned-tag-icon">
                  <Smartphone size={17} />
                </div>

                <div className="assigned-tag-main">
                  <strong>{tag.id}</strong>
                  <small>{tag.product}</small>
                </div>

                <span
                  className={
                    tag.status === "Locked"
                      ? "tag-status tag-status-locked"
                      : "tag-status tag-status-unlocked"
                  }
                >
                  {tag.status}
                </span>

                <span className="assigned-tag-battery">
                  Battery {tag.battery}
                </span>

                <button
                  className="row-action-button"
                  type="button"
                  aria-label={`Remove tag ${tag.id}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

export default TableDetails;