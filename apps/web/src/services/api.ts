const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

export type ApiProduct = {
  id: string;
  name: string;
  sku: string;
  price: number;
  description: string | null;
  created_at: string;
};

export async function getProducts(): Promise<ApiProduct[]> {
  const response = await fetch(`${API_BASE_URL}/products/`);

  if (!response.ok) {
    throw new Error("Unable to load products");
  }

  return response.json() as Promise<ApiProduct[]>;
}

export async function checkApiHealth() {
  const response = await fetch(`${API_BASE_URL}/health`);

  if (!response.ok) {
    throw new Error("SmartTag API is unavailable");
  }

  return response.json() as Promise<{
    status: string;
    service: string;
  }>;
}

export async function createOrder(
  productId: string,
  tagId: string,
) {
  const response = await fetch(`${API_BASE_URL}/orders/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product_id: productId,
      tag_id: tagId,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.detail || "Unable to create order",
    );
  }

  return response.json() as Promise<{
    id: string;
    product_id: string;
    tag_id: string;
    payment_provider: string | null;
    payment_order_id: string | null;
    payment_session_id: string | null;
    payment_transaction_id: string | null;
    amount: number;
    status: string;
    created_at: string;
  }>;
}

export async function getTagsByProduct(
  productId: string,
) {
  const response = await fetch(
    `${API_BASE_URL}/tags/product/${productId}`,
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.detail || "Unable to load SmartTags",
    );
  }

  return response.json() as Promise<
    Array<{
      id: string;
      product_id: string;
      tag_code: string;
      status: string;
      created_at: string;
    }>
  >;
}
