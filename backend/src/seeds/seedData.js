const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const FarmerProfile = require('../models/FarmerProfile');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Notification = require('../models/Notification');
const Cart = require('../models/Cart');

const connectDB = require('../config/db');

const seedDatabase = async () => {
  try {
    const conn = await connectDB();
    if (!conn) {
      console.error('Could not establish database connection for seeding.');
      process.exit(1);
    }
    console.log('MongoDB connected successfully for seed script.');

    // Clear existing records
    await Promise.all([
      User.deleteMany(),
      FarmerProfile.deleteMany(),
      Category.deleteMany(),
      Product.deleteMany(),
      Order.deleteMany(),
      Review.deleteMany(),
      Notification.deleteMany(),
      Cart.deleteMany(),
    ]);

    console.log('Existing collections cleared.');

    // 1. Create Users
    // Admin
    const adminUser = await User.create({
      name: 'Platform Administrator',
      email: 'admin@agrimarket.com',
      password: 'Admin@12345',
      role: 'ADMIN',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    });

    // Farmer 1 (Maharashtra)
    const farmer1 = await User.create({
      name: 'Rajesh Patil',
      email: 'farmer.rajesh@agrimarket.com',
      password: 'Farmer@12345',
      role: 'FARMER',
      phone: '+91 98234 56789',
      avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
    });

    // Farmer 2 (Maharashtra)
    const farmer2 = await User.create({
      name: 'Anita Sharma',
      email: 'farmer.anita@agrimarket.com',
      password: 'Farmer@12345',
      role: 'FARMER',
      phone: '+91 98112 34567',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    });

    // Farmer 3 (Punjab)
    const farmer3 = await User.create({
      name: 'Gurpreet Singh',
      email: 'farmer.gurpreet@agrimarket.com',
      password: 'Farmer@12345',
      role: 'FARMER',
      phone: '+91 98761 23456',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    });

    // Farmer 4 (Himachal Pradesh)
    const farmer4 = await User.create({
      name: 'Rameshwar Thakur',
      email: 'farmer.rameshwar@agrimarket.com',
      password: 'Farmer@12345',
      role: 'FARMER',
      phone: '+91 94180 12345',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    });

    // Farmer 5 (Kerala)
    const farmer5 = await User.create({
      name: 'Devika Nair',
      email: 'farmer.devika@agrimarket.com',
      password: 'Farmer@12345',
      role: 'FARMER',
      phone: '+91 94470 54321',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    });

    // Farmer 6 (Pending Verification)
    const farmer6 = await User.create({
      name: 'Suresh Kumar',
      email: 'farmer.suresh@agrimarket.com',
      password: 'Farmer@12345',
      role: 'FARMER',
      phone: '+91 97654 32109',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    });

    // Customers
    const customer1 = await User.create({
      name: 'Priya Deshmukh',
      email: 'customer.priya@agrimarket.com',
      password: 'Customer@12345',
      role: 'CUSTOMER',
      phone: '+91 99887 76655',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    });

    const customer2 = await User.create({
      name: 'Rahul Verma',
      email: 'customer.rahul@agrimarket.com',
      password: 'Customer@12345',
      role: 'CUSTOMER',
      phone: '+91 98765 11223',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    });

    console.log('Demo Users created.');

    // 2. Create Farmer Profiles
    await FarmerProfile.create({
      user: farmer1._id,
      farmName: 'Green Harvest Organic Orchards',
      farmLocation: 'Ozar Village, Nashik, Maharashtra',
      village: 'Ozar',
      district: 'Nashik',
      state: 'Maharashtra',
      pincode: '422206',
      farmDescription:
        'Generations of passionate natural agriculture. We specialize in zero-chemical pesticide farming, harvesting fresh organic vegetables, table grapes, and sun-ripened tomatoes.',
      farmingMethod: 'Organic Certified',
      cropTypes: ['Vegetables', 'Fruits', 'Grains'],
      experienceYears: 14,
      totalAreaAcres: 12.5,
      profileImage: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=600&q=80',
      coverImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
      verificationStatus: 'APPROVED',
      documents: [
        { docType: 'APEDA Organic Certificate', docUrl: 'https://example.com/certs/apeda-rajesh.pdf' },
        { docType: 'State Land Record (7/12 Extract)', docUrl: 'https://example.com/certs/land-record-nashik.pdf' },
      ],
      rating: 4.9,
      numReviews: 38,
    });

    await FarmerProfile.create({
      user: farmer2._id,
      farmName: 'Vedic Valley Dairy & Crops',
      farmLocation: 'Khed Shivapur Village, Pune, Maharashtra',
      village: 'Khed Shivapur',
      district: 'Pune',
      state: 'Maharashtra',
      pincode: '412205',
      farmDescription:
        'A sustainable community farm emphasizing native Gir cow milk, bilona churned A2 Ghee, stone-milled ancient wheat, and non-GMO honey.',
      farmingMethod: 'Natural / Permaculture',
      cropTypes: ['Dairy Products', 'Grains', 'Organic Products'],
      experienceYears: 9,
      totalAreaAcres: 8.0,
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      coverImage: 'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&w=1200&q=80',
      verificationStatus: 'APPROVED',
      documents: [
        { docType: 'FSSAI Dairy Food License', docUrl: 'https://example.com/certs/fssai-anita.pdf' },
      ],
      rating: 4.8,
      numReviews: 24,
    });

    await FarmerProfile.create({
      user: farmer3._id,
      farmName: 'Golden Fields Agro Farm',
      farmLocation: 'Kotkapura Village, Faridkot, Punjab',
      village: 'Kotkapura',
      district: 'Faridkot',
      state: 'Punjab',
      pincode: '151204',
      farmDescription:
        'Specializing in heritage non-GMO Sharbati wheat, premium aromatic basmati rice, mustard seeds, and natural unpolished pulses with zero synthetic sprays.',
      farmingMethod: 'Organic Certified',
      cropTypes: ['Grains & Pulses', 'Organic Products', 'Vegetables'],
      experienceYears: 18,
      totalAreaAcres: 22.0,
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      coverImage: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1200&q=80',
      verificationStatus: 'APPROVED',
      rating: 4.9,
      numReviews: 29,
    });

    await FarmerProfile.create({
      user: farmer4._id,
      farmName: 'Himalayan Ridge Orchard',
      farmLocation: 'Kotgarh Village, Shimla, Himachal Pradesh',
      village: 'Kotgarh',
      district: 'Shimla',
      state: 'Himachal Pradesh',
      pincode: '172031',
      farmDescription:
        'High-altitude orchard in the heart of apple country. Pristine glacier meltwater, chemical-free pollination, producing world-renowned Royal Delicious apples and wild mountain honey.',
      farmingMethod: 'Natural / Permaculture',
      cropTypes: ['Fruits', 'Organic Products', 'Vegetables'],
      experienceYears: 15,
      totalAreaAcres: 10.5,
      profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
      coverImage: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=1200&q=80',
      verificationStatus: 'APPROVED',
      rating: 5.0,
      numReviews: 34,
    });

    await FarmerProfile.create({
      user: farmer5._id,
      farmName: 'Malabar Green Spices & Groves',
      farmLocation: 'Meppadi Village, Wayanad, Kerala',
      village: 'Meppadi',
      district: 'Wayanad',
      state: 'Kerala',
      pincode: '673577',
      farmDescription:
        'Rainforest multi-tiered spice plantation growing sun-dried Malabar black pepper, wild cardamom, Robusta bananas, and fresh tender coconuts with rain-harvested water.',
      farmingMethod: 'Organic Certified',
      cropTypes: ['Organic Products', 'Fruits', 'Vegetables'],
      experienceYears: 11,
      totalAreaAcres: 7.0,
      profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
      coverImage: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1200&q=80',
      verificationStatus: 'APPROVED',
      rating: 4.9,
      numReviews: 21,
    });

    await FarmerProfile.create({
      user: farmer6._id,
      farmName: 'Surya Nature Agro Estates',
      farmLocation: 'Wai Village, Satara, Maharashtra',
      village: 'Wai',
      district: 'Satara',
      state: 'Maharashtra',
      pincode: '412803',
      farmDescription:
        'Transitioning strawberry and ginger estates to 100% natural organic compost. Awaiting platform verification.',
      farmingMethod: 'Organic Certified',
      cropTypes: ['Fruits', 'Organic Products'],
      experienceYears: 6,
      totalAreaAcres: 5.5,
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
      coverImage: 'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=1200&q=80',
      verificationStatus: 'PENDING',
      rating: 5.0,
      numReviews: 0,
    });

    console.log('Farmer Profiles created.');

    // 3. Create Categories
    const categories = await Category.insertMany([
      {
        name: 'Vegetables',
        slug: 'vegetables',
        description: 'Crisp, crisp, vitamin-packed farm fresh greens and vegetables',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
        icon: 'Carrot',
      },
      {
        name: 'Fruits',
        slug: 'fruits',
        description: 'Naturally ripened, sweet, pesticide-free seasonal fruits',
        image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80',
        icon: 'Apple',
      },
      {
        name: 'Dairy Products',
        slug: 'dairy-products',
        description: 'Grass-fed native cow A2 milk, pure bilona ghee, and fresh cottage cheese',
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
        icon: 'Milk',
      },
      {
        name: 'Grains & Pulses',
        slug: 'grains',
        description: 'Unpolished lentils, traditional aromatic rice, and heirloom flours',
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
        icon: 'Wheat',
      },
      {
        name: 'Organic Products',
        slug: 'organic-products',
        description: 'Pure forest honey, stone-pressed wood oils, spices, and dried herbs',
        image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
        icon: 'Leaf',
      },
    ]);

    const catMap = {};
    categories.forEach((cat) => {
      catMap[cat.slug] = cat._id;
    });

    console.log('Categories created.');

    // 4. Create Products
    const products = await Product.insertMany([
      // Vegetables
      {
        farmer: farmer1._id,
        name: 'Organic Vine-Ripened Farm Tomatoes',
        slug: 'organic-farm-tomatoes',
        description: 'Plump, naturally juicy red tomatoes harvested at dawn. Grown with zero chemical fertilizers, rich in antioxidants and authentic heirloom flavor.',
        category: catMap['vegetables'],
        price: 45,
        unit: 'kg',
        availableQuantity: 150,
        minOrderQuantity: 1,
        images: [
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1546470427-227c7369a9b0?auto=format&fit=crop&w=800&q=80',
        ],
        isOrganic: true,
        harvestDate: new Date(),
        farmLocation: 'Ozar Village, Nashik, Maharashtra',
        village: 'Ozar',
        district: 'Nashik',
        state: 'Maharashtra',
        tags: ['Fresh', 'Organic', 'Heirloom', 'Daily Harvest'],
        rating: 4.9,
        numReviews: 18,
        isActive: true,
        isApproved: true,
      },
      {
        farmer: farmer1._id,
        name: 'Farm Fresh Spinach (Palak)',
        slug: 'farm-fresh-spinach-palak',
        description: 'Tender baby spinach leaves picked fresh from our chemical-free soil. Washed in clean spring water, packed with iron and vital minerals.',
        category: catMap['vegetables'],
        price: 30,
        unit: 'bunch',
        availableQuantity: 80,
        minOrderQuantity: 1,
        images: [
          'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80',
        ],
        isOrganic: true,
        harvestDate: new Date(),
        farmLocation: 'Ozar Village, Nashik, Maharashtra',
        village: 'Ozar',
        district: 'Nashik',
        state: 'Maharashtra',
        tags: ['Greens', 'Iron-Rich', 'Pesticide-Free'],
        rating: 4.8,
        numReviews: 12,
        isActive: true,
        isApproved: true,
      },
      {
        farmer: farmer4._id,
        name: 'Sweet Crunch Shimla Bell Peppers',
        slug: 'sweet-crunch-shimla-bell-peppers',
        description: 'Vibrant green, crisp capsicums grown in polyhouse with natural composting. Sweet, thick-walled, and perfect for fresh salads and curries.',
        category: catMap['vegetables'],
        price: 65,
        unit: 'kg',
        availableQuantity: 70,
        minOrderQuantity: 1,
        images: [
          'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80',
        ],
        isOrganic: true,
        harvestDate: new Date(Date.now() - 24 * 3600 * 1000),
        farmLocation: 'Kotgarh Village, Shimla, Himachal Pradesh',
        village: 'Kotgarh',
        district: 'Shimla',
        state: 'Himachal Pradesh',
        tags: ['Crunchy', 'Vitamin C', 'Shimla Capsicum'],
        rating: 4.7,
        numReviews: 8,
        isActive: true,
        isApproved: true,
      },
      {
        farmer: farmer3._id,
        name: 'Crunchy Orange Farm Carrots',
        slug: 'crunchy-orange-farm-carrots',
        description: 'Naturally sweet and juicy carrots freshly harvested from fertile Punjab soil. High beta-carotene and completely free from synthetic sprays.',
        category: catMap['vegetables'],
        price: 40,
        unit: 'kg',
        availableQuantity: 110,
        minOrderQuantity: 1,
        images: [
          'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80',
        ],
        isOrganic: true,
        harvestDate: new Date(Date.now() - 12 * 3600 * 1000),
        farmLocation: 'Kotkapura Village, Faridkot, Punjab',
        village: 'Kotkapura',
        district: 'Faridkot',
        state: 'Punjab',
        tags: ['Vitamin A', 'Sweet Carrots', 'Root Vegetable'],
        rating: 4.9,
        numReviews: 15,
        isActive: true,
        isApproved: true,
      },

      // Fruits
      {
        farmer: farmer1._id,
        name: 'Nashik Sun-Grown Seedless Grapes',
        slug: 'nashik-sun-grown-seedless-grapes',
        description: 'Famous Nashik valley table grapes with crisp skin and high brix sweetness. Hand-picked bunch by bunch to preserve natural bloom.',
        category: catMap['fruits'],
        price: 110,
        unit: 'kg',
        availableQuantity: 95,
        minOrderQuantity: 1,
        images: [
          'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=800&q=80',
        ],
        isOrganic: true,
        harvestDate: new Date(),
        farmLocation: 'Ozar Village, Nashik, Maharashtra',
        village: 'Ozar',
        district: 'Nashik',
        state: 'Maharashtra',
        tags: ['Sweet', 'Seasonal', 'Export Quality'],
        rating: 5.0,
        numReviews: 14,
        isActive: true,
        isApproved: true,
      },
      {
        farmer: farmer4._id,
        name: 'Royal Delicious Himalayan Apples',
        slug: 'royal-delicious-himalayan-apples',
        description: 'Crisp, aromatic red apples grown at 7,000 feet in the pristine mountain orchards of Kotgarh. Tree-ripened, hand-wax free, and packed with mountain crispness.',
        category: catMap['fruits'],
        price: 160,
        unit: 'kg',
        availableQuantity: 140,
        minOrderQuantity: 1,
        images: [
          'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80',
        ],
        isOrganic: true,
        harvestDate: new Date(Date.now() - 36 * 3600 * 1000),
        farmLocation: 'Kotgarh Village, Shimla, Himachal Pradesh',
        village: 'Kotgarh',
        district: 'Shimla',
        state: 'Himachal Pradesh',
        tags: ['Himalayan Apples', 'Crisp Red', 'Mountain Fresh'],
        rating: 4.9,
        numReviews: 28,
        isActive: true,
        isApproved: true,
      },
      {
        farmer: farmer5._id,
        name: 'Fresh Tender Green Coconuts (Pack of 3)',
        slug: 'fresh-tender-green-coconuts',
        description: 'Sweet, electrolyte-rich natural water and tender coconut malai from rain-drenched organic groves of Wayanad. Chilled and hydrating.',
        category: catMap['fruits'],
        price: 150,
        unit: 'bunch',
        availableQuantity: 60,
        minOrderQuantity: 1,
        images: [
          'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=800&q=80',
        ],
        isOrganic: true,
        harvestDate: new Date(),
        farmLocation: 'Meppadi Village, Wayanad, Kerala',
        village: 'Meppadi',
        district: 'Wayanad',
        state: 'Kerala',
        tags: ['Coconut Water', 'Hydration', 'Kerala Fresh'],
        rating: 4.8,
        numReviews: 16,
        isActive: true,
        isApproved: true,
      },
      {
        farmer: farmer5._id,
        name: 'Organic Golden Robusta Bananas',
        slug: 'organic-golden-robusta-bananas',
        description: 'Naturally calcium-ripened organic bananas with rich creamy sweetness and zero carbide chemicals.',
        category: catMap['fruits'],
        price: 60,
        unit: 'dozen',
        availableQuantity: 75,
        minOrderQuantity: 1,
        images: [
          'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80',
        ],
        isOrganic: true,
        harvestDate: new Date(Date.now() - 24 * 3600 * 1000),
        farmLocation: 'Meppadi Village, Wayanad, Kerala',
        village: 'Meppadi',
        district: 'Wayanad',
        state: 'Kerala',
        tags: ['Chemical-Free', 'Potassium-Rich', 'Dozen'],
        rating: 4.7,
        numReviews: 9,
        isActive: true,
        isApproved: true,
      },
      {
        farmer: farmer1._id,
        name: 'Ratnagiri Alphonso Mangoes (Out of Season)',
        slug: 'ratnagiri-alphonso-mangoes-seasonal',
        description: 'The King of Mangoes directly from Devgad and Ratnagiri coastal orchards. Sweet aroma and silky saffron pulp. Currently out of harvest stock.',
        category: catMap['fruits'],
        price: 750,
        unit: 'dozen',
        availableQuantity: 0, // OUT OF STOCK to test availability filter!
        minOrderQuantity: 1,
        images: [
          'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
        ],
        isOrganic: true,
        harvestDate: new Date(Date.now() - 90 * 86400 * 1000),
        farmLocation: 'Ozar Village, Nashik, Maharashtra',
        village: 'Ozar',
        district: 'Nashik',
        state: 'Maharashtra',
        tags: ['Alphonso', 'Seasonal', 'GI-Tagged'],
        rating: 5.0,
        numReviews: 45,
        isActive: true,
        isApproved: true,
      },

      // Dairy Products
      {
        farmer: farmer2._id,
        name: 'Pure Desi Gir Cow A2 Bilona Ghee',
        slug: 'pure-desi-gir-cow-a2-bilona-ghee',
        description: 'Cultured from whole A2 curd using the ancient Vedic wooden churn (bilona method) over slow cow-dung fire. Golden, aromatic, and rich in healing butyric acid.',
        category: catMap['dairy-products'],
        price: 850,
        unit: 'litre',
        availableQuantity: 40,
        minOrderQuantity: 1,
        images: [
          'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=800&q=80',
        ],
        isOrganic: true,
        harvestDate: new Date(Date.now() - 48 * 3600 * 1000),
        farmLocation: 'Khed Shivapur Village, Pune, Maharashtra',
        village: 'Khed Shivapur',
        district: 'Pune',
        state: 'Maharashtra',
        tags: ['Vedic Bilona', 'A2 Ghee', 'Gut Health'],
        rating: 4.9,
        numReviews: 22,
        isActive: true,
        isApproved: true,
      },
      {
        farmer: farmer2._id,
        name: 'Farm-Fresh Raw A2 Milk (Chilled Glass Bottle)',
        slug: 'farm-fresh-raw-a2-milk',
        description: 'Pure, unadulterated milk from pasture-grazed Indian native Gir cows. Free of synthetic hormones and antibiotics. Bottled cold immediately after morning milking.',
        category: catMap['dairy-products'],
        price: 75,
        unit: 'litre',
        availableQuantity: 60,
        minOrderQuantity: 1,
        images: [
          'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
        ],
        isOrganic: true,
        harvestDate: new Date(),
        farmLocation: 'Khed Shivapur Village, Pune, Maharashtra',
        village: 'Khed Shivapur',
        district: 'Pune',
        state: 'Maharashtra',
        tags: ['Fresh Milk', 'A2 Protein', 'Direct Delivery'],
        rating: 4.8,
        numReviews: 19,
        isActive: true,
        isApproved: true,
      },

      // Grains & Pulses
      {
        farmer: farmer3._id,
        name: 'Heritage Traditional Basmati Brown Rice',
        slug: 'heritage-traditional-basmati-brown-rice',
        description: 'Single-estate aromatic brown rice grown with traditional canal irrigation in Punjab. Slow aged for 12 months for exceptional fragrance, high fiber and low glycemic index.',
        category: catMap['grains'],
        price: 130,
        unit: 'kg',
        availableQuantity: 200,
        minOrderQuantity: 1,
        images: [
          'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
        ],
        isOrganic: true,
        harvestDate: new Date(Date.now() - 15 * 86400 * 1000),
        farmLocation: 'Kotkapura Village, Faridkot, Punjab',
        village: 'Kotkapura',
        district: 'Faridkot',
        state: 'Punjab',
        tags: ['Whole Grain', 'Aromatic Basmati', 'High Fiber'],
        rating: 4.9,
        numReviews: 11,
        isActive: true,
        isApproved: true,
      },
      {
        farmer: farmer3._id,
        name: 'Sharbati Whole Golden Wheat Grain',
        slug: 'sharbati-whole-golden-wheat-grain',
        description: 'Sun-drenched, heavy-kernel Sharbati wheat grown organically on fertile black soils. Makes exceptionally soft, golden, and sweet rotis.',
        category: catMap['grains'],
        price: 55,
        unit: 'kg',
        availableQuantity: 250,
        minOrderQuantity: 1,
        images: [
          'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
        ],
        isOrganic: true,
        harvestDate: new Date(Date.now() - 20 * 86400 * 1000),
        farmLocation: 'Kotkapura Village, Faridkot, Punjab',
        village: 'Kotkapura',
        district: 'Faridkot',
        state: 'Punjab',
        tags: ['Sharbati', 'Stone-Mill', 'Golden Wheat'],
        rating: 4.9,
        numReviews: 17,
        isActive: true,
        isApproved: true,
      },

      // Organic Products
      {
        farmer: farmer4._id,
        name: 'Wild Forest Raw Acacia Honey',
        slug: 'wild-forest-raw-acacia-honey',
        description: 'Raw, unpasteurized and unheated floral honey gently extracted from sustainable bee boxes placed in Himalayan forest flora. Rich in natural bee pollen and live enzymes.',
        category: catMap['organic-products'],
        price: 420,
        unit: 'box',
        availableQuantity: 50,
        minOrderQuantity: 1,
        images: [
          'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
        ],
        isOrganic: true,
        harvestDate: new Date(Date.now() - 7 * 86400 * 1000),
        farmLocation: 'Kotgarh Village, Shimla, Himachal Pradesh',
        village: 'Kotgarh',
        district: 'Shimla',
        state: 'Himachal Pradesh',
        tags: ['Raw Honey', 'Unfiltered', 'Immunity'],
        rating: 5.0,
        numReviews: 16,
        isActive: true,
        isApproved: true,
      },
      {
        farmer: farmer5._id,
        name: 'Organic Whole Malabar Black Pepper (250g)',
        slug: 'organic-whole-malabar-black-pepper',
        description: 'Sun-dried high-piperine Tellicherry grade whole black pepper bold peppercorns from rainforest hills of Wayanad. Intense aroma and medicinal warmth.',
        category: catMap['organic-products'],
        price: 180,
        unit: 'gram',
        availableQuantity: 85,
        minOrderQuantity: 1,
        images: [
          'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80',
        ],
        isOrganic: true,
        harvestDate: new Date(Date.now() - 10 * 86400 * 1000),
        farmLocation: 'Meppadi Village, Wayanad, Kerala',
        village: 'Meppadi',
        district: 'Wayanad',
        state: 'Kerala',
        tags: ['Black Gold', 'Malabar Pepper', 'Tellicherry'],
        rating: 4.9,
        numReviews: 13,
        isActive: true,
        isApproved: true,
      },
    ]);

    console.log('Products created.');

    // 5. Create Sample Orders
    const order1 = await Order.create({
      orderNumber: 'AGRI-2026-849201',
      customer: customer1._id,
      items: [
        {
          product: products[0]._id,
          farmer: farmer1._id,
          name: products[0].name,
          price: products[0].price,
          quantity: 3,
          unit: 'kg',
          image: products[0].images[0],
        },
        {
          product: products[4]._id,
          farmer: farmer1._id,
          name: products[4].name,
          price: products[4].price,
          quantity: 2,
          unit: 'kg',
          image: products[4].images[0],
        },
      ],
      deliveryAddress: {
        fullName: 'Priya Deshmukh',
        phone: '+91 99887 76655',
        street: 'Flat 402, Green Meadows, Baner Road',
        city: 'Pune',
        district: 'Pune',
        state: 'Maharashtra',
        pincode: '411045',
      },
      paymentMethod: 'COD',
      paymentStatus: 'PAID',
      subtotal: 45 * 3 + 110 * 2,
      deliveryCharge: 40,
      totalAmount: 395,
      orderStatus: 'Delivered',
      statusHistory: [
        { status: 'Pending', timestamp: new Date(Date.now() - 4 * 86400 * 1000) },
        { status: 'Confirmed', timestamp: new Date(Date.now() - 3 * 86400 * 1000) },
        { status: 'Processing', timestamp: new Date(Date.now() - 2 * 86400 * 1000) },
        { status: 'Delivered', timestamp: new Date(Date.now() - 1 * 86400 * 1000) },
      ],
    });

    console.log('Sample Order created.');
    console.log('Database seeding successfully finished!');
    process.exit(0);
  } catch (err) {
    console.error('Error during seeding:', err);
    process.exit(1);
  }
};

seedDatabase();
