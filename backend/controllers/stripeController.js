import stripe from "../config/stripe.js";

const calculateStripeTotalSales = async (req, res) => {
  try {
    const payments = await stripe.paymentIntents.list({ limit: 100 });

    const totalSales = payments.data
      .filter((p) => p.status === "succeeded") // only successful payments
      .reduce((sum, p) => sum + p.amount_received, 0); // amounts are in cents

    res.json({ totalSales: totalSales / 100 }); // convert to dollars/euros
  } catch (error) {
    console.error("Stripe error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const calculateStripeSalesByDate = async (req, res) => {
  try {
    const payments = await stripe.paymentIntents.list({ limit: 100 });

    const salesByDate = payments.data
      .filter((p) => p.status === "succeeded")
      .reduce((acc, p) => {
        const date = new Date(p.created * 1000) // Stripe timestamps are in seconds
          .toISOString()
          .slice(0, 10); // YYYY-MM-DD

        acc[date] = (acc[date] || 0) + p.amount_received;
        return acc;
      }, {});

    // transform into array
    const result = Object.entries(salesByDate)
      .map(([date, total]) => {
        const [year, month, day] = date.split("-");
        return {
          date: `${day}.${month}`,
          sortKey: date,
          totalSales: total / 100,
        };
      })
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
      .map(({ date, totalSales }) => ({ date, totalSales }));

    res.json(result);
  } catch (error) {
    console.error("Stripe error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export { calculateStripeTotalSales, calculateStripeSalesByDate };
