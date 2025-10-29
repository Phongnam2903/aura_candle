/**
 * Script để seed fragrances vào products nếu chưa có
 * Chạy: node scripts/seedFragrances.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../src/models/Product');

// Danh sách mùi hương phổ biến cho nến thơm
const COMMON_FRAGRANCES = [
    'Lavender',
    'Rose',
    'Vanilla',
    'Jasmine',
    'Sandalwood',
    'Cinnamon',
    'Ocean Breeze',
    'Fresh Linen',
    'Citrus',
    'Peppermint',
    'Eucalyptus',
    'Coconut',
    'Coffee',
    'Green Tea',
    'White Tea',
    'Peach',
    'Strawberry',
    'Bergamot',
    'Patchouli',
    'Ylang Ylang',
    'Lemongrass',
    'Cedarwood',
    'Pine',
    'Gardenia',
    'Magnolia'
];

async function seedFragrances() {
    try {
        // Kết nối database
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aura_candle');
        console.log('✅ Connected to MongoDB');

        // Lấy tất cả products chưa có fragrances
        const products = await Product.find({
            $or: [
                { fragrances: { $exists: false } },
                { fragrances: { $size: 0 } }
            ]
        });

        console.log(`📦 Found ${products.length} products without fragrances`);

        if (products.length === 0) {
            console.log('✅ All products already have fragrances!');
            process.exit(0);
        }

        // Random assign 1-3 mùi cho mỗi sản phẩm
        let updated = 0;
        for (const product of products) {
            const numFragrances = Math.floor(Math.random() * 3) + 1; // 1-3 mùi
            const randomFragrances = [];
            
            // Chọn random unique fragrances
            const shuffled = [...COMMON_FRAGRANCES].sort(() => 0.5 - Math.random());
            for (let i = 0; i < numFragrances; i++) {
                randomFragrances.push(shuffled[i]);
            }

            product.fragrances = randomFragrances;
            await product.save();
            
            console.log(`✅ Updated ${product.name}: [${randomFragrances.join(', ')}]`);
            updated++;
        }

        console.log(`\n🎉 Successfully updated ${updated} products!`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

// Run
seedFragrances();

