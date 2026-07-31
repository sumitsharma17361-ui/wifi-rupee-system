const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const usedUTRs = new Set();
const activeTokens = new Map();

function generateWifiToken() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'WIFI-';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// 1. Verify UTR & Generate Token
app.post('/api/verify-utr', (req, res) => {
    const { utr } = req.body;

    if (!utr || utr.length !== 12 || isNaN(utr)) {
        return res.status(400).json({ status: "failed", message: "Invalid 12-digit UTR." });
    }

    if (usedUTRs.has(utr)) {
        return res.status(400).json({ status: "failed", message: "This UTR is already used!" });
    }

    usedUTRs.add(utr);
    const newToken = generateWifiToken();
    
    activeTokens.set(newToken, {
        createdAt: Date.now(),
        durationMinutes: 15
    });

    console.log(`[UTR VERIFIED] UTR: ${utr} | Token: ${newToken}`);

    return res.status(200).json({
        status: "success",
        token: newToken,
        validity: "15 Minutes"
    });
});

// 2. Connect Wi-Fi / Check Token
app.post('/api/check-token', (req, res) => {
    const { token } = req.body;

    if (!token || !activeTokens.has(token)) {
        return res.status(400).json({ valid: false, message: "Invalid or Expired Token!" });
    }

    const tokenData = activeTokens.get(token);
    const currentTime = Date.now();
    const expiryTime = tokenData.createdAt + (tokenData.durationMinutes * 60 * 1000);

    if (currentTime > expiryTime) {
        activeTokens.delete(token);
        return res.status(400).json({ valid: false, message: "Token Expired!" });
    }

    return res.status(200).json({
        valid: true,
        message: "Access Granted",
        timeRemainingSeconds: Math.floor((expiryTime - currentTime) / 1000)
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
