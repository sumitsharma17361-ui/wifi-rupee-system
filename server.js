const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Payment Webhook Route (Yahan payment gateway signal bhejega)
app.post('/api/webhook', (req, res) => {
    const paymentData = req.body;
    console.log("Payment Received:", paymentData);
    
    // Yahan hum check karenge ki payment successful hai ya nahi
    // Aur user ke liye Wi-Fi token generate karenge
    
    res.status(200).json({ status: "success", token: "WIFI-PASS-1234" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
