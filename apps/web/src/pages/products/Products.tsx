import {
  ArrowUpRight,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import AdminLayout from "../../components/layout/AdminLayout";

const products = [
  {
    name: "Black T-Shirt",
    sku: "ST-TS-001",
    category: "T-Shirts",
    price: "₹999",
    stock: 42,
    tags: 18,
    status: "Active",
  },
  {
    name: "Denim Jacket",
    sku: "ST-JK-014",
    category: "Jackets",
    price: "₹2,499",
    stock: 18,
    tags: 9,
    status: "Active",
  },
  {
    name: "White Sneakers",
    sku: "ST-SN-008",
    category: "Footwear",
    price: "₹3,299",
    stock: 27,
    tags: 12,
    status: "Active",
  },
  {
    name: "Oversized Hoodie",
    sku: "ST-HD-021",
    category: "Hoodies",
    price: "₹1,799",
    stock: 8,
    tags: 6,
    status: "Low stock",
  },
];

function Products() {
  return (
    <AdminLayout>
      <div className="products-page">
        <div className="page-heading">
          <div>
            <span className="page-kicker">CATALOG</span>

            <h1>Products</h1>

            <p>
              Manage products, pricing, inventory and SmartTags from one place.
            </p>
          </div>

          <button className="primary-button" type="button">
            <Plus size={17} />
            Add Product
          </button>
        </div>

        <section className="product-summary-grid">
          <div className="product-summary-card">
            <span>Total Products</span>
            <strong>128</strong>
            <small>+12 this month</small>
          </div>

          <div className="product-summary-card">
            <span>Active Products</span>
            <strong>116</strong>
            <small>90.6% of catalog</small>
          </div>

          <div className="product-summary-card">
            <span>Low Stock</span>
            <strong>8</strong>
            <small>Needs attention</small>
          </div>

          <div className="product-summary-card">
            <span>Tagged Units</span>
            <strong>486</strong>
            <small>Across all products</small>
          </div>
        </section>

        <section className="panel products-panel">
          <div className="products-toolbar">
            <div className="products-search">
              <Search size={17} />

              <input
                type="search"
                placeholder="Search products or SKU..."
              />
            </div>

            <div className="products-toolbar-actions">
              <button className="secondary-button" type="button">
                <SlidersHorizontal size={16} />
                Filters
              </button>

              <button className="secondary-button" type="button">
                Export
                <ArrowUpRight size={15} />
              </button>
            </div>
          </div>

          <div className="products-table">
            <div className="product-row product-row-head">
              <span>Product</span>
              <span>Category</span>
              <span>Price</span>
              <span>Stock</span>
              <span>Tags</span>
              <span>Status</span>
              <span />
            </div>

            {products.map((product) => (
              <div className="product-row" key={product.sku}>
                <div className="product-name-cell">
                  <div className="product-thumb">
                    {product.name.charAt(0)}
                  </div>

                  <div>
                    <strong>{product.name}</strong>
                    <small>{product.sku}</small>
                  </div>
                </div>

                <span className="product-muted">
                  {product.category}
                </span>

                <strong className="product-price">
                  {product.price}
                </strong>

                <span
                  className={
                    product.stock <= 10
                      ? "product-stock product-stock-low"
                      : "product-stock"
                  }
                >
                  {product.stock} units
                </span>

                <span className="product-muted">
                  {product.tags} tags
                </span>

                <span
                  className={
                    product.status === "Low stock"
                      ? "product-status product-status-warning"
                      : "product-status product-status-active"
                  }
                >
                  {product.status}
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
      </div>
    </AdminLayout>
  );
}

export default Products;