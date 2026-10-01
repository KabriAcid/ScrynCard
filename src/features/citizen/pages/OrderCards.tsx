import { ArrowLeft } from "lucide-react";
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
          <ArrowLeft aria-hidden="true" /> <span>Back to home</span>
        </button>
      </header>
      <main className="order-page-main">
        <div className="order-page-heading">
          <p>SCRYNCARD ORDER</p>
          <h1>Make your rewards memorable.</h1>
          <span>Create branded airtime and data cards for your business.</span>
        </div>
        <OrderForm />
      </main>
    </div>
  );
}
