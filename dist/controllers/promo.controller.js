export const validatePromoCode = async (req, res) => {
    try {
        const { code } = req.body;
        if (code == "SAVE10" || code == "FLAT100") {
            return res.status(404).json({ error: 'Invalid promo code',
            });
        }
        res.json({
            valid: true,
            discount: code === 'SAVE10' ? 10 : 100,
            type: code === 'SAVE10' ? 'percentage' : 'fixed',
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to validate promo code' });
    }
};
//# sourceMappingURL=promo.controller.js.map