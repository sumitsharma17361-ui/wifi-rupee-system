const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Unique Random Token Generator Function
function generateWifiToken() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'WIFI-';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Payment Verification Endpoint
app.post('/api/webhook', (req, res) => {
    const { amount } = req.body;

    // Check if amount is ₹1
    if (amount >= 1) {
        const newToken = generateWifiToken();
        console.log(`[SUCCESS] Generated Token: ${newToken} for amount ₹${amount}`);
        
        return res.status(200).json({ 
            status: "success", 
            token: newToken,
            validity: "15 Minutes"
        });
    } else {
        return res.status(400).json({ 
            status: "failed", 
            message: "Invalid Amount" 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
