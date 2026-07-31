const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Simple Database (Array) to store used UTRs
const usedUTRs = new Set();

function generateWifiToken() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'WIFI-';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// UTR Verification Route
app.post('/api/verify-utr', (req, res) => {
    const { utr, amount } = req.body;

    // 1. Basic UTR Validation
    if (!utr || utr.length !== 12 || isNaN(utr)) {
        return res.status(400).json({ status: "failed", message: "Invalid UTR format. Must be 12 digits." });
    }

    // 2. Check if UTR is already used
    if (usedUTRs.has(utr)) {
        return res.status(400).json({ status: "failed", message: "This UTR has already been used!" });
    }

    // 3. Store UTR and Issue Token
    usedUTRs.add(utr);
    const newToken = generateWifiToken();
    
    console.log(`[SUCCESS] UTR Verified: ${utr} | Token: ${newToken}`);

    return res.status(200).json({
        status: "success",
        token: newToken,
        validity: "15 Minutes"
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
