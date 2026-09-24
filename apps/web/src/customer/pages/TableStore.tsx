import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type TableData = {
  id: string;
  name: string;
  zone: string;
  productIds: string[];
};

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  sizes: string[];
  color: string;
  tagCount: number;
};

const API_BASE_URL = "http://127.0.0.1:8000";

const tables: Record<string, TableData> = {
  "T-001": {
    id: "T-001",
    name: "Table 01",
    zone: "Men's Wear",
    productIds: ["ST-TS-001", "ST-HD-021"],
  },
  "T-002": {
    id: "T-002",
    name: "Table 02",
    zone: "Footwear",
    productIds: ["ST-SN-008"],
  },
  "T-003": {
    id: "T-003",
    name: "Table 03",
    zone: "Women's Wear",
    productIds: ["ST-HD-021", "ST-JK-014"],
  },
  "T-004": {
    id: "T-004",
    name: "Table 04",
    zone: "T-Shirts",
    productIds: [
      "ST-TS-001",
      "ST-HD-021",
      "ST-JK-014",
    ],
  },
};

function TableStore() {
  const navigate = useNavigate();
  const { tableId } = useParams();

  const table = tableId
    ? tables[tableId.toUpperCase()]
    : undefined;

  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] =
    useState(true);
  const [productsError, setProductsError] =
    useState(false);

  const [selectedProductId, setSelectedProductId] =
    useState("");

  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        setProductsLoading(true);
        setProductsError(false);

        const response = await fetch(
          `${API_BASE_URL}/api/products`,
        );

        if (!response.ok) {
          throw new Error("Failed to load products");
        }

        const data = (await response.json()) as {
          products: Product[];
          count: number;
        };

        if (!cancelled) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error(
          "SmartTag products API error:",
          error,
        );

        if (!cancelled) {
          setProductsError(true);
        }
      } finally {
        if (!cancelled) {
          setProductsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const availableProducts = useMemo(() => {
    if (!table) {
      return [];
    }

    return products.filter((product) =>
      table.productIds.includes(product.id),
    );
  }, [products, table]);

  useEffect(() => {
    if (availableProducts.length === 0) {
      return;
    }

    const currentProductExists =
      availableProducts.some(
        (product) => product.id === selectedProductId,
      );

    if (!currentProductExists) {
      setSelectedProductId(
        availableProducts[0].id,
      );
    }
  }, [availableProducts, selectedProductId]);

  const selectedProduct = availableProducts.find(
    (product) => product.id === selectedProductId,
  );

  useEffect(() => {
    if (selectedProduct) {
      setSelectedSize(
        selectedProduct.sizes[0] ?? "",
      );
    }
  }, [selectedProduct]);

  const total = selectedProduct
    ? selectedProduct.price * quantity
    : 0;

  const handleProductSelect = (product: Product) => {
    setSelectedProductId(product.id);
    setSelectedSize(product.sizes[0] ?? "");
    setQuantity(1);
  };

  const handleContinue = () => {
    if (!table || !selectedProduct || !selectedSize) {
      return;
    }

    navigate(`/checkout?table=${table.id}`);
  };

  if (!table) {
    return (
      <div className="customer-page customer-invalid-page">
        <main className="customer-invalid-card">
          <div className="customer-invalid-icon">
            <ShoppingBag size={24} />
          </div>

          <span className="customer-kicker">
            SMARTTAG
          </span>

          <h1>Table not found</h1>

          <p>
            This SmartTag table link is invalid or no
            longer active. Please scan the QR code
            provided at the store.
          </p>

          <button
            className="customer-secondary-button"
            type="button"
            onClick={() => navigate("/")}
          >
            Return to SmartTag
          </button>
        </main>
      </div>
    );
  }

  if (productsLoading) {
    return (
      <div className="customer-page customer-invalid-page">
        <main className="customer-invalid-card">
          <div className="customer-invalid-icon">
            <ShoppingBag size={24} />
          </div>

          <span className="customer-kicker">
            SMARTTAG STORE
          </span>

          <h1>Loading products</h1>

          <p>
            SmartTag is securely loading the products
            available at {table.name}.
          </p>
        </main>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="customer-page customer-invalid-page">
        <main className="customer-invalid-card">
          <div className="customer-invalid-icon">
            <ShoppingBag size={24} />
          </div>

          <span className="customer-kicker">
            SMARTTAG STORE
          </span>

          <h1>Store temporarily unavailable</h1>

          <p>
            We couldn't load the products right now.
            Please try again in a moment.
          </p>

          <button
            className="customer-secondary-button"
            type="button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="customer-page">
      <header className="customer-header">
        <div className="customer-brand">
          <div className="customer-brand-mark">
            S
          </div>

          <div>
            <strong>SmartTag</strong>
            <span>Retail Experience</span>
          </div>
        </div>

        <div className="customer-table-status">
          <span className="customer-live-dot" />
          {table.name}
        </div>
      </header>

      <main className="customer-main">
        <section className="customer-hero">
          <div>
            <span className="customer-kicker">
              SMARTTAG STORE
            </span>

            <h1>
              Explore products on{" "}
              <span>{table.name}</span>
            </h1>

            <p>
              Browse the products available at this
              table. Select an item and continue to
              secure payment.
            </p>
          </div>

          <div className="customer-table-card">
            <span>TABLE</span>
            <strong>{table.name}</strong>
            <small>{table.zone}</small>
          </div>
        </section>

        <section className="customer-content">
          <div className="customer-products-section">
            <div className="customer-section-heading">
              <div>
                <span className="customer-kicker">
                  AVAILABLE NOW
                </span>

                <h2>Products</h2>
              </div>

              <span className="customer-product-count">
                {availableProducts.length} products
              </span>
            </div>

            <div className="customer-product-grid">
              {availableProducts.map((product) => {
                const isSelected =
                  selectedProductId === product.id;

                return (
                  <button
                    key={product.id}
                    className={`customer-product-card ${
                      isSelected ? "selected" : ""
                    }`}
                    type="button"
                    onClick={() =>
                      handleProductSelect(product)
                    }
                  >
                    <div className="customer-product-visual">
                      <span>
                        {product.name
                          .split(" ")
                          .map((word) =>
                            word.charAt(0),
                          )
                          .join("")
                          .slice(0, 2)}
                      </span>

                      {isSelected && (
                        <div className="customer-selected-badge">
                          <CheckCircle2 size={17} />
                        </div>
                      )}
                    </div>

                    <div className="customer-product-details">
                      <span className="customer-product-category">
                        {product.category}
                      </span>

                      <h3>{product.name}</h3>

                      <p>
                        {product.color} ·{" "}
                        {product.tagCount} tags available
                      </p>

                      <strong>
                        ₹
                        {product.price.toLocaleString(
                          "en-IN",
                        )}
                      </strong>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedProduct && (
            <aside className="customer-selection-card">
              <div className="customer-selection-header">
                <div>
                  <span className="customer-kicker">
                    YOUR SELECTION
                  </span>

                  <h2>{selectedProduct.name}</h2>
                </div>

                <span className="customer-selection-sku">
                  {selectedProduct.id}
                </span>
              </div>

              <div className="customer-selection-divider" />

              <div className="customer-option-group">
                <div className="customer-option-label">
                  <span>Size</span>
                  <strong>
                    {selectedSize || "Select"}
                  </strong>
                </div>

                <div className="customer-size-list">
                  {selectedProduct.sizes.map(
                    (size) => (
                      <button
                        key={size}
                        className={`customer-size-button ${
                          selectedSize === size
                            ? "active"
                            : ""
                        }`}
                        type="button"
                        onClick={() =>
                          setSelectedSize(size)
                        }
                      >
                        {size}
                      </button>
                    ),
                  )}
                </div>
              </div>

              <div className="customer-option-group">
                <div className="customer-option-label">
                  <span>Quantity</span>
                  <strong>{quantity}</strong>
                </div>

                <div className="customer-quantity-control">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() =>
                      setQuantity((current) =>
                        Math.max(
                          1,
                          current - 1,
                        ),
                      )
                    }
                  >
                    <Minus size={16} />
                  </button>

                  <span>{quantity}</span>

                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() =>
                      setQuantity((current) =>
                        Math.min(
                          5,
                          current + 1,
                        ),
                      )
                    }
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="customer-price-summary">
                <div>
                  <span>Product</span>

                  <strong>
                    ₹
                    {selectedProduct.price.toLocaleString(
                      "en-IN",
                    )}
                  </strong>
                </div>

                <div>
                  <span>Quantity</span>
                  <strong>× {quantity}</strong>
                </div>

                <div className="customer-total-row">
                  <span>Total</span>

                  <strong>
                    ₹{total.toLocaleString("en-IN")}
                  </strong>
                </div>
              </div>

              <button
                className="customer-pay-button"
                type="button"
                onClick={handleContinue}
                disabled={
                  !selectedProduct ||
                  !selectedSize
                }
              >
                Continue to Payment
                <ArrowRight size={18} />
              </button>

              <div className="customer-security-note">
                <ShieldCheck size={17} />

                <span>
                  Your payment is verified securely
                  before the physical SmartTag is
                  authorized to unlock.
                </span>
              </div>
            </aside>
          )}
        </section>
      </main>

      <footer className="customer-footer">
        <div>
          <span>SmartTag Retail Platform</span>
        </div>

        <div className="customer-footer-right">
          <span>
            <ShieldCheck size={15} />
            Secure checkout
          </span>

          <span>
            <ChevronDown size={14} />
            {table.name}
          </span>
        </div>
      </footer>
    </div>
  );
}

export default TableStore;