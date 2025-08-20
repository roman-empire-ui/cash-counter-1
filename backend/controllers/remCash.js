import RemCash from "../models/remainingCashModel.js";

export const saveRemainingCash = async (req, res) => {
  const { date, notes, coins, remarks } = req.body;

  // Use custom date if provided, else default to today
  const entryDate = date ? new Date(date) : new Date();
  entryDate.setUTCHours(0, 0, 0, 0); // Normalize time

  // Calculate totals
  const calculatedNotes = notes.map(item => ({
    denomination: item.denomination,
    count: item.count,
    total: item.denomination * item.count
  }));

  const calculatedCoins = coins.map(item => ({
    denomination: item.denomination,
    count: item.count,
    total: item.denomination * item.count
  }));

  const totalRemCash = [...calculatedNotes, ...calculatedCoins]
    .reduce((sum, item) => sum + item.total, 0);

  let existing = await RemCash.findOne({ date: entryDate });

  if (existing) {
    existing.notes = calculatedNotes;
    existing.coins = calculatedCoins;
    existing.totalRemainingCash = totalRemCash;
    existing.remarks = remarks || '';
    await existing.save();

    return res.status(200).json({
      message: 'Remaining cash updated for this date',
      remainingCash: existing
    });
  }

  const newEntry = new RemCash({
    date: entryDate,
    notes: calculatedNotes,
    coins: calculatedCoins,
    totalRemainingCash: totalRemCash,
    remarks,
  });

  await newEntry.save();

  res.status(201).json({
    message: 'Remaining cash saved for this date',
    remainingCash: newEntry
  });
};
