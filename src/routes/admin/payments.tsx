import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/payments")({
  component: PaymentPage,
});

function PaymentPage() {
  return (
    <div className="p-8 text-white font-sans text-xl font-bold bg-[#03070d] min-h-[50vh] flex items-center justify-center border border-[#243343] rounded-xl">
      Hello Payment
    </div>
  );
}
