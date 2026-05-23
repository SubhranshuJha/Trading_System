const OrderSummary = ({
  estimated,
}) => {
  return (
    <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4">

      <h3 className="text-sm font-medium text-white">
        Order Summary
      </h3>

      <div className="mt-4 space-y-3">

        <div className="flex items-center justify-between text-sm">

          <span className="text-slate-500">
            Estimated
          </span>

          <span className="font-medium">
            ₹{estimated.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">

          <span className="text-slate-500">
            Brokerage
          </span>

          <span className="font-medium">
            ₹0
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-sm">

          <span className="text-slate-400">
            Available Balance
          </span>

          <span className="font-semibold text-green-400">
            ₹42,500
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;