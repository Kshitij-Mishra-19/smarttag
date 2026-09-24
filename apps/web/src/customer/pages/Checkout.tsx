import {
  ArrowLeft,
  CheckCircle2,
  LockKeyhole,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const checkoutProduct = {
  name: "Black T-Shirt",
  sku: "ST-TS-001",
  size: "M",
  quantity: 1,
  price: 999,
};

type PaymentState =
  | "checkout"
  | "processing"
  | "success";

function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const tableId = searchParams.get("table") || "T-004";

  const [paymentState, setPaymentState] =
    useState<PaymentState>("checkout");

  const subtotal =
    checkoutProduct.price * checkoutProduct.quantity;

  const total = subtotal;

  const handlePayment = () => {
    setPaymentState("processing");

    window.setTimeout(() => {
      setPaymentState("success");
    }, 1800);
  };

  if (paymentState === "processing") {
    return (
      <div className="checkout-page">
        <main className="checkout-state-page">
          <div className="checkout-state-card">
            <div className="checkout-loader">
              <div />
            </div>

            <span className="customer-kicker">
              PAYMENT PROCESSING
            </span>

            <h1>Verifying your payment</h1>

            <p>
              Please wait while SmartTag securely processes
              your transaction.
            </p>

            <div className="checkout-processing-steps">
              <div className="active">
                <CheckCircle2 size={17} />
                <span>Payment request received</span>
              </div>

              <div className="active">
                <CheckCircle2 size={17} />
                <span>Verifying transaction</span>
              </div>

              <div>
                <LockKeyhole size={17} />
                <span>Authorizing SmartTag unlock</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (paymentState === "success") {
    return (
      <div className="checkout-page">
        <main className="checkout-state-page">
          <div className="checkout-state-card checkout-success-card">
            <div className="checkout-success-icon">
              <CheckCircle2 size={34} />
            </div>

            <span className="customer-kicker">
              PAYMENT VERIFIED
            </span>

            <h1>Payment successful</h1>

            <p>
              Your payment has been verified successfully.
              SmartTag authorization is now ready for the
              selected product.
            </p>

            <div className="checkout-success-summary">
              <div>
                <span>Product</span>
                <strong>{checkoutProduct.name}</strong>
              </div>

              <div>
                <span>Table</span>
                <strong>Table 04</strong>
              </div>

              <div>
                <span>Amount</span>
                <strong>
                  ₹{total.toLocaleString("en-IN")}
                </strong>
              </div>
            </div>

            <div className="checkout-unlock-status">
              <div className="checkout-unlock-icon">
                <LockKeyhole size={19} />
              </div>

              <div>
                <strong>Unlock authorization created</strong>

                <span>
                  The physical SmartTag is authorized only
                  after server-side payment verification.
                </span>
              </div>
            </div>

            <button
              className="checkout-pay-button"
              type="button"
              onClick={() =>
                navigate(`/t/${tableId}`)
              }
            >
              Return to Store
              <ArrowLeft size={17} />
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <header className="checkout-header">
        <button
          className="checkout-back-button"
          type="button"
          onClick={() => navigate(`/t/${tableId}`)}
        >
          <ArrowLeft size={17} />
          Back to products
        </button>

        <div className="checkout-secure">
          <LockKeyhole size={15} />
          Secure checkout
        </div>
      </header>

      <main className="checkout-main">
        <div className="checkout-heading">
          <span className="customer-kicker">
            CHECKOUT
          </span>

          <h1>Complete your purchase</h1>

          <p>
            Review your product and continue to secure
            payment.
          </p>
        </div>

        <div className="checkout-layout">
          <section className="checkout-card">
            <div className="checkout-card-header">
              <div>
                <span className="customer-kicker">
                  ORDER SUMMARY
                </span>

                <h2>Your product</h2>
              </div>

              <span className="checkout-table-badge">
                Table 04
              </span>
            </div>

            <div className="checkout-product">
              <div className="checkout-product-image">
                <span>
                  {checkoutProduct.name.charAt(0)}
                </span>
              </div>

              <div className="checkout-product-info">
                <span>{checkoutProduct.sku}</span>

                <h3>{checkoutProduct.name}</h3>

                <p>
                  Size {checkoutProduct.size} · Qty{" "}
                  {checkoutProduct.quantity}
                </p>
              </div>

              <strong>
                ₹
                {checkoutProduct.price.toLocaleString(
                  "en-IN",
                )}
              </strong>
            </div>

            <div className="checkout-price-list">
              <div>
                <span>Subtotal</span>

                <strong>
                  ₹{subtotal.toLocaleString("en-IN")}
                </strong>
              </div>

              <div>
                <span>Taxes</span>
                <strong>Included</strong>
              </div>

              <div className="checkout-total-row">
                <span>Total</span>

                <strong>
                  ₹{total.toLocaleString("en-IN")}
                </strong>
              </div>
            </div>
          </section>

          <section className="checkout-card checkout-payment-card">
            <div className="checkout-card-header">
              <div>
                <span className="customer-kicker">
                  PAYMENT
                </span>

                <h2>Choose payment method</h2>
              </div>
            </div>

            <button
              className="checkout-payment-option active"
              type="button"
            >
              <div className="checkout-payment-icon">
                <Smartphone size={19} />
              </div>

              <div>
                <strong>UPI Payment</strong>

                <span>
                  Pay securely using any UPI app
                </span>
              </div>

              <CheckCircle2 size={19} />
            </button>

            <div className="checkout-payment-info">
              <ShieldCheck size={18} />

              <div>
                <strong>
                  Payment verification
                </strong>

                <p>
                  SmartTag will verify your payment on
                  the server before authorizing the
                  physical tag unlock.
                </p>
              </div>
            </div>

            <button
              className="checkout-pay-button"
              type="button"
              onClick={handlePayment}
            >
              Pay ₹{total.toLocaleString("en-IN")}
              <LockKeyhole size={17} />
            </button>

            <p className="checkout-disclaimer">
              By continuing, you agree to the store's
              purchase terms. Your physical SmartTag will
              only unlock after successful payment
              verification.
            </p>
          </section>
        </div>

        <section className="checkout-trust">
          <div>
            <ShieldCheck size={17} />
            <span>
              Payment verified before physical unlock
            </span>
          </div>

          <div>
            <LockKeyhole size={17} />
            <span>Secure transaction</span>
          </div>

          <div>
            <CheckCircle2 size={17} />
            <span>
              SmartTag authorization protected
            </span>
          </div>
        </section>
      </main>

      <footer className="customer-footer">
        <div>
          <span>SmartTag Retail Platform</span>
        </div>

        <span>Secure · Fast · Connected</span>
      </footer>
    </div>
  );
}

export default Checkout;