import ledgerModel from "../models/ledger.model.js";

const addFund = async (req, res) => {
  try {
    const userId = req.id;
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Unable to add funds ! Amount is required.",
      });
    }

    const newLedgerData = {
      userId,
      type: "DEPOSIT",
      amount,
      balanceAfter: 0,
      referenceModel: null,
      referenceId: null,
    };

    // get the last ledger entry to calculate the new balance
    const lastLedger = await ledgerModel
      .findOne({ userId })
      .sort({ createdAt: -1 });
    newLedgerData.balanceAfter = lastLedger
      ? lastLedger.balanceAfter + amount
      : amount;

    await ledgerModel.create(newLedgerData);
    res
      .status(200)
      .json({ success: true, message: "Funds added successfully !" });
  } catch (error) {
    console.log("ISE > ", error);
    res.status(500).json({ success: false, message: "Unable to add funds" });
  }
};

export { addFund };
