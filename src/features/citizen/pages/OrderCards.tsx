import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/logo";
import { OrderForm } from "@/features/citizen/components/order/OrderForm";

export default function OrderCardsPage() {
  const navigate = useNavigate();

  return (
    <div className="order-page">
      <header className="order-page-header">
        <Logo />
        <button type="button" onClick={() => navigate("/redeem")} className="order-back-link">
          <span>Back to home</span>
        </button>
      </header>
      <main className="order-page-main">
        <OrderForm />
      </main>
    </div>
  );
}
