import cron from "node-cron";
import ipoModel from "../models/ipo.model.js";
import { closeIPOInternal } from "../service/closeIPOInternal.js";


cron.schedule("* * * * *", async () => {

    const now = new Date();

    try {

        const upcoming = await ipoModel.find({
            status: "UPCOMING",
            startDate: { $lte: now }
        });

        for (let ipo of upcoming) {
            ipo.status = "OPEN";
            await ipo.save();
            console.log(`IPO ${ipo._id} opened`);
        }

        // 🔥 CLOSE IPOs
        const open = await ipoModel.find({
            status: "OPEN",
            endDate: { $lte: now }
        });

        for (let ipo of open) {
            console.log(`Closing IPO ${ipo._id}`);
            await closeIPOInternal(ipo._id);
        }

    } catch (err) {
        console.error("Scheduler error:", err);
    }
});