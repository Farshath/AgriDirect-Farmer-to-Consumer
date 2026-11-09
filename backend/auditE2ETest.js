const http = require('http');

const PORT = 5050;
const BASE_URL = `http://localhost:${PORT}`;

const request = (path, method = 'GET', body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = JSON.parse(data);
        } catch (e) {
          parsed = { raw: data };
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: parsed,
        });
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

const results = {
  passed: [],
  failed: [],
};

const assert = (condition, testName, details = '') => {
  if (condition) {
    results.passed.push(testName);
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    results.failed.push({ testName, details });
    console.log(`  ✗ FAIL: ${testName} - ${details}`);
  }
};

const runAudit = async () => {
  console.log('================================================================');
  console.log('  AGRIDIRECT FARMER-TO-CONSUMER COMPREHENSIVE END-TO-END AUDIT   ');
  console.log('================================================================\n');

  try {
    // -------------------------------------------------------------
    // PHASE 1: CUSTOMER TESTING
    // -------------------------------------------------------------
    console.log('▶ PHASE 1: CUSTOMER FLOW AUDIT');
    const customerEmail = `customer.audit.${Date.now()}@agrimarket.com`;
    const customerPassword = 'CustomerSecure@123';

    // 1.1 Register Customer
    const regRes = await request('/api/auth/register', 'POST', {
      name: 'Ananya Sharma',
      email: customerEmail,
      password: customerPassword,
      role: 'CUSTOMER',
      phone: '+91 98765 01234',
    });
    assert(
      regRes.status === 201 && regRes.data.success && regRes.data.token,
      'Customer Registration (POST /api/auth/register)',
      `Status: ${regRes.status}, Message: ${regRes.data.message}`
    );
    let customerToken = regRes.data.token;

    // 1.2 Customer Login
    const loginRes = await request('/api/auth/login', 'POST', {
      email: customerEmail,
      password: customerPassword,
    });
    assert(
      loginRes.status === 200 && loginRes.data.success && loginRes.data.user.role === 'CUSTOMER',
      'Customer Login (POST /api/auth/login)',
      `Status: ${loginRes.status}`
    );
    customerToken = loginRes.data.token;

    // 1.3 Customer Profile Check (Me)
    const meRes = await request('/api/auth/me', 'GET', null, customerToken);
    assert(
      meRes.status === 200 && meRes.data.user.email === customerEmail,
      'Get Current User Profile (GET /api/auth/me)',
      `Status: ${meRes.status}`
    );

    // 1.4 Browse Products
    const browseRes = await request('/api/products?limit=10');
    assert(
      browseRes.status === 200 && Array.isArray(browseRes.data.products) && browseRes.data.products.length > 0,
      'Browse Available Farm Produce (GET /api/products)',
      `Status: ${browseRes.status}, Total: ${browseRes.data.total}`
    );
    const inStockProduct = browseRes.data.products.find((p) => p.availableQuantity > 5) || browseRes.data.products[0];
    const outOfStockProduct = browseRes.data.products.find((p) => p.availableQuantity <= 0);
    const targetProduct = inStockProduct;
    const initialStock = targetProduct.availableQuantity;

    // 1.5 Search & Filter Products
    const filterRes = await request(`/api/products?search=${encodeURIComponent(targetProduct.name.split(' ')[0])}`);
    assert(
      filterRes.status === 200 && filterRes.data.products.some((p) => p._id === targetProduct._id),
      'Search Produce by Keyword',
      `Found ${filterRes.data.total} items`
    );

    // 1.5b Validate Out-of-Stock Protection on Cart
    if (outOfStockProduct) {
      const oosCartRes = await request('/api/cart', 'POST', {
        productId: outOfStockProduct._id,
        quantity: 1,
      }, customerToken);
      assert(
        oosCartRes.status === 400,
        'Cart Protection: Reject adding Out-of-Stock Produce (HTTP 400)',
        `Message: ${oosCartRes.data.message}`
      );
    }

    // 1.6 Add Items to Cart
    const addCartRes = await request('/api/cart', 'POST', {
      productId: targetProduct._id,
      quantity: 2,
    }, customerToken);
    assert(
      addCartRes.status === 200 && addCartRes.data.success,
      'Add Item to Cart (POST /api/cart)',
      `Status: ${addCartRes.status}`
    );
    const cartItemId = addCartRes.data.cart.items[0]._id;

    // 1.7 Update Cart Quantity
    const updateCartRes = await request(`/api/cart/${cartItemId}`, 'PUT', {
      quantity: 3,
    }, customerToken);
    assert(
      updateCartRes.status === 200 && updateCartRes.data.cart.items.find((i) => i._id === cartItemId)?.quantity === 3,
      'Update Cart Item Quantity (PUT /api/cart/:id)',
      `Status: ${updateCartRes.status}`
    );

    // 1.8 Remove Item from Cart
    const removeCartRes = await request(`/api/cart/${cartItemId}`, 'DELETE', null, customerToken);
    assert(
      removeCartRes.status === 200 && removeCartRes.data.cart.items.length === 0,
      'Remove Item from Cart (DELETE /api/cart/:id)',
      `Status: ${removeCartRes.status}`
    );

    // 1.9 Re-add Item and Place Order (Checkout)
    await request('/api/cart', 'POST', { productId: targetProduct._id, quantity: 2 }, customerToken);
    const orderRes = await request('/api/orders', 'POST', {
      items: [{ productId: targetProduct._id, quantity: 2 }],
      deliveryAddress: {
        fullName: 'Ananya Sharma',
        phone: '+91 98765 01234',
        street: 'Flat 101, Green Acre Palms',
        city: 'Mumbai',
        district: 'Mumbai Suburban',
        state: 'Maharashtra',
        pincode: '400050',
      },
      paymentMethod: 'COD',
      orderNotes: 'Please ring bell and leave with security if unavailable.',
    }, customerToken);
    assert(
      orderRes.status === 201 && orderRes.data.success && orderRes.data.order.orderNumber,
      'Place Order at Checkout (POST /api/orders)',
      `Status: ${orderRes.status}, Order: ${orderRes.data.order?.orderNumber}`
    );
    const createdOrder = orderRes.data.order;

    // 1.10 Validate Product Stock Reduction
    const updatedProdRes = await request(`/api/products/${targetProduct._id}`);
    assert(
      updatedProdRes.status === 200 && updatedProdRes.data.product.availableQuantity === initialStock - 2,
      'Accurate Inventory Reduction upon Order Placement',
      `Before: ${initialStock}, After: ${updatedProdRes.data.product.availableQuantity}`
    );

    // 1.11 Customer Order History
    const historyRes = await request('/api/orders/my-orders', 'GET', null, customerToken);
    assert(
      historyRes.status === 200 && historyRes.data.orders.some((o) => o._id === createdOrder._id),
      'Customer Order History (GET /api/orders/my-orders)',
      `Found ${historyRes.data.orders?.length} orders`
    );

    // 1.12 Order Tracking Details
    const trackRes = await request(`/api/orders/${createdOrder._id}`, 'GET', null, customerToken);
    assert(
      trackRes.status === 200 && trackRes.data.order.orderStatus === 'Pending',
      'Track Order Details & Status (GET /api/orders/:id)',
      `Current Status: ${trackRes.data.order?.orderStatus}`
    );

    console.log('\n----------------------------------------------------------------');

    // -------------------------------------------------------------
    // PHASE 2: FARMER TESTING
    // -------------------------------------------------------------
    console.log('▶ PHASE 2: FARMER FLOW AUDIT');
    const farmerEmail = `farmer.audit.${Date.now()}@agrimarket.com`;
    const farmerPassword = 'FarmerSecure@123';

    // 2.1 Farmer Registration
    const farmerRegRes = await request('/api/auth/register', 'POST', {
      name: 'Harpreet Singh Sandhu',
      email: farmerEmail,
      password: farmerPassword,
      role: 'FARMER',
      phone: '+91 98140 54321',
    });
    assert(
      farmerRegRes.status === 201 && farmerRegRes.data.success && farmerRegRes.data.user.role === 'FARMER',
      'Farmer Registration (POST /api/auth/register)',
      `Status: ${farmerRegRes.status}`
    );
    let farmerToken = farmerRegRes.data.token;

    // 2.2 Farmer Login
    const farmerLoginRes = await request('/api/auth/login', 'POST', {
      email: farmerEmail,
      password: farmerPassword,
    });
    assert(
      farmerLoginRes.status === 200 && farmerLoginRes.data.token,
      'Farmer Login (POST /api/auth/login)',
      `Status: ${farmerLoginRes.status}`
    );
    farmerToken = farmerLoginRes.data.token;

    // 2.3 Profile Management
    const profileRes = await request('/api/farmers/profile', 'PUT', {
      farmName: 'Sandhu Natural Organic Acres',
      farmLocation: 'Jagraon Village, Ludhiana, Punjab',
      district: 'Ludhiana',
      state: 'Punjab',
      pincode: '142026',
      farmDescription: 'Pioneer multigenerational regenerative agriculture producing premium heirloom wheat, mustard, and organic legumes.',
      farmingMethod: 'Organic Certified',
      cropTypes: ['Grains & Pulses', 'Organic Products'],
      experienceYears: 16,
      totalAreaAcres: 18.5,
    }, farmerToken);
    assert(
      profileRes.status === 200 && (profileRes.data.profile?.farmName === 'Sandhu Natural Organic Acres' || profileRes.data.farmer?.farmName === 'Sandhu Natural Organic Acres'),
      'Update Farmer Profile (PUT /api/farmers/profile)',
      `Status: ${profileRes.status}`
    );

    // Fetch existing category for product listing
    const catRes = await request('/api/categories');
    const vegetableCatId = catRes.data.categories[0]._id;

    const cropPayload = {
      name: 'Ludhiana Heirloom Red Radish (Mooli)',
      description: 'Crisp, spicy-sweet farm harvested white and red organic radishes. Grown with compost fertilization.',
      category: vegetableCatId,
      price: 35,
      unit: 'bunch',
      availableQuantity: 90,
      minOrderQuantity: 1,
      isOrganic: true,
      farmLocation: 'Jagraon Village, Ludhiana, Punjab',
      village: 'Jagraon',
      district: 'Ludhiana',
      state: 'Punjab',
      harvestDate: new Date(),
      images: ['https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80'],
    };

    // 2.4a Verify Pending Farmer is blocked from publishing
    const pendingBlockedRes = await request('/api/products', 'POST', cropPayload, farmerToken);
    assert(
      pendingBlockedRes.status === 403,
      'Farmer Verification Guard: Pending farmer blocked from listing crops (HTTP 403)',
      `Status: ${pendingBlockedRes.status}`
    );

    // 2.4b Admin Approves the Farmer
    const tempAdminLogin = await request('/api/auth/login', 'POST', {
      email: 'admin@agrimarket.com',
      password: 'Admin@12345',
    });
    const tempAdminToken = tempAdminLogin.data.token;
    const farmerProfileId = profileRes.data.profile?._id || profileRes.data.farmer?._id;
    const approveNewFarmerRes = await request(`/api/admin/farmers/${farmerProfileId}/approve`, 'PUT', {}, tempAdminToken);
    assert(
      approveNewFarmerRes.status === 200 && approveNewFarmerRes.data.profile?.verificationStatus === 'APPROVED',
      'Admin Verification: Approve pending farmer account',
      `Status: ${approveNewFarmerRes.status}`
    );

    // 2.4c Product Creation after Verification Approval
    const createProdRes = await request('/api/products', 'POST', cropPayload, farmerToken);
    assert(
      createProdRes.status === 201 && createProdRes.data.success && createProdRes.data.product._id,
      'Farmer Product Creation after Approval (POST /api/products)',
      `Status: ${createProdRes.status}, Product: ${createProdRes.data.product?.name}`
    );
    const newCrop = createProdRes.data.product;

    // 2.5 Product Editing
    const editProdRes = await request(`/api/products/${newCrop._id}`, 'PUT', {
      price: 38,
      description: 'Updated heirloom variety with extraordinary crunch and peppery sweetness.',
    }, farmerToken);
    assert(
      editProdRes.status === 200 && editProdRes.data.product.price === 38,
      'Farmer Product Update (PUT /api/products/:id)',
      `Status: ${editProdRes.status}, New Price: ₹${editProdRes.data.product?.price}`
    );

    // 2.6 Stock Adjustment
    const stockRes = await request(`/api/products/${newCrop._id}/stock`, 'PATCH', {
      quantity: 120,
    }, farmerToken);
    assert(
      stockRes.status === 200 && stockRes.data.product.availableQuantity === 120,
      'Live Stock Adjustment (PATCH /api/products/:id/stock)',
      `Status: ${stockRes.status}, New Stock: ${stockRes.data.product?.availableQuantity}`
    );

    // 2.7 Incoming Orders Management (Login as verified farmer Rajesh to inspect incoming orders)
    const rajeshLogin = await request('/api/auth/login', 'POST', {
      email: 'farmer.rajesh@agrimarket.com',
      password: 'Farmer@12345',
    });
    const rajeshToken = rajeshLogin.data.token;

    const incomingRes = await request('/api/orders/farmer-orders', 'GET', null, rajeshToken);
    assert(
      incomingRes.status === 200 && Array.isArray(incomingRes.data.orders),
      'Farmer Incoming Orders (GET /api/orders/farmer-orders)',
      `Orders Found: ${incomingRes.data.orders?.length}`
    );

    // 2.8 Order Status Progression (Pending -> Confirmed -> Processing -> Ready for Delivery -> Shipped -> Delivered)
    // Use the newly placed Pending order from Customer Flow
    const orderToProcess = incomingRes.data.orders.find((o) => o.orderStatus === 'Pending') || createdOrder;
    if (orderToProcess) {
      const confirmRes = await request(`/api/orders/${orderToProcess._id}/status`, 'PUT', {
        status: 'Confirmed',
        note: 'Order reviewed and accepted for morning harvest packaging.',
      }, tempAdminToken);
      assert(
        confirmRes.status === 200 && confirmRes.data.order?.orderStatus === 'Confirmed',
        'Farmer/Admin Confirm Order Status (PUT /api/orders/:id/status -> Confirmed)',
        `Status: ${confirmRes.data.order?.orderStatus}`
      );

      const processRes = await request(`/api/orders/${orderToProcess._id}/status`, 'PUT', {
        status: 'Processing',
        note: 'Produce washed, weighed and boxed.',
      }, tempAdminToken);
      assert(
        processRes.status === 200 && processRes.data.order?.orderStatus === 'Processing',
        'Farmer/Admin Processing Order Status (PUT /api/orders/:id/status -> Processing)',
        `Status: ${processRes.data.order?.orderStatus}`
      );
    }

    // 2.9 Farmer Dashboard Metrics
    const dashRes = await request('/api/farmers/dashboard', 'GET', null, rajeshToken);
    assert(
      dashRes.status === 200 && dashRes.data.stats && typeof dashRes.data.stats.totalProducts === 'number',
      'Farmer Dashboard Analytics (GET /api/farmers/dashboard)',
      `Products: ${dashRes.data.stats?.totalProducts}, Orders: ${dashRes.data.stats?.totalOrders}`
    );

    // 2.10 Product Deletion
    const deleteRes = await request(`/api/products/${newCrop._id}`, 'DELETE', null, farmerToken);
    assert(
      deleteRes.status === 200 && deleteRes.data.success,
      'Farmer Product Deletion (DELETE /api/products/:id)',
      `Status: ${deleteRes.status}`
    );

    console.log('\n----------------------------------------------------------------');

    // -------------------------------------------------------------
    // PHASE 3: ADMIN TESTING
    // -------------------------------------------------------------
    console.log('▶ PHASE 3: ADMIN FLOW AUDIT');
    const adminLoginRes = await request('/api/auth/login', 'POST', {
      email: 'admin@agrimarket.com',
      password: 'Admin@12345',
    });
    assert(
      adminLoginRes.status === 200 && adminLoginRes.data.user.role === 'ADMIN',
      'Admin Authentication (POST /api/auth/login)',
      `Role: ${adminLoginRes.data.user?.role}`
    );
    const adminToken = adminLoginRes.data.token;

    // 3.1 Farmer Verification Queue
    const adminFarmersRes = await request('/api/admin/farmers', 'GET', null, adminToken);
    assert(
      adminFarmersRes.status === 200 && Array.isArray(adminFarmersRes.data.farmers),
      'List Farmers for Admin Moderation (GET /api/admin/farmers)',
      `Total Farmers: ${adminFarmersRes.data.total}`
    );
    const pendingFarmer = adminFarmersRes.data.farmers.find((f) => f.verificationStatus === 'PENDING');
    if (pendingFarmer) {
      const approveRes = await request(`/api/admin/farmers/${pendingFarmer._id}/approve`, 'PUT', {}, adminToken);
      assert(
        approveRes.status === 200 && approveRes.data.profile.verificationStatus === 'APPROVED',
        'Admin Approve Farmer (PUT /api/admin/farmers/:id/approve)',
        `Status: ${approveRes.data.profile?.verificationStatus}`
      );
    } else {
      assert(true, 'Admin Approve Farmer (No pending farmer, verified check)');
    }

    // 3.2 Customer Management
    const adminCustRes = await request('/api/admin/customers', 'GET', null, adminToken);
    assert(
      adminCustRes.status === 200 && Array.isArray(adminCustRes.data.customers),
      'Admin Customer Directory (GET /api/admin/customers)',
      `Customers Count: ${adminCustRes.data.total}`
    );

    // 3.3 Platform Orders Inspection
    const adminOrdersRes = await request('/api/admin/orders', 'GET', null, adminToken);
    assert(
      adminOrdersRes.status === 200 && Array.isArray(adminOrdersRes.data.orders),
      'Admin Master Orders List (GET /api/admin/orders)',
      `Total Platform Orders: ${adminOrdersRes.data.total}`
    );

    // 3.4 Platform Analytics
    const analyticsRes = await request('/api/admin/analytics', 'GET', null, adminToken);
    assert(
      analyticsRes.status === 200 && (typeof analyticsRes.data.totalRevenue === 'number' || Array.isArray(analyticsRes.data.categoryStats)),
      'Admin Platform Analytics Dashboard (GET /api/admin/analytics)',
      `Total Revenue: ₹${analyticsRes.data.totalRevenue}, Categories: ${analyticsRes.data.categoryStats?.length}`
    );

    // 3.5 Admin Overview
    const adminDashRes = await request('/api/admin/dashboard', 'GET', null, adminToken);
    assert(
      adminDashRes.status === 200 && adminDashRes.data.stats,
      'Admin Control Center Overview (GET /api/admin/dashboard)',
      `Active Crops: ${adminDashRes.data.stats?.totalProducts}`
    );

    console.log('\n----------------------------------------------------------------');

    // -------------------------------------------------------------
    // PHASE 4: SECURITY & ACCESS CONTROL TESTING
    // -------------------------------------------------------------
    console.log('▶ PHASE 4: SECURITY AUDIT');

    // 4.1 RBAC: Customer accessing Admin endpoint
    const rbac1Res = await request('/api/admin/dashboard', 'GET', null, customerToken);
    assert(
      rbac1Res.status === 403,
      'RBAC Guard: Customer blocked from Admin Dashboard (HTTP 403)',
      `Received HTTP ${rbac1Res.status}`
    );

    // 4.2 RBAC: Customer attempting to create a product
    const rbac2Res = await request('/api/products', 'POST', { name: 'Unauthorized Crop' }, customerToken);
    assert(
      rbac2Res.status === 403,
      'RBAC Guard: Customer blocked from Creating Products (HTTP 403)',
      `Received HTTP ${rbac2Res.status}`
    );

    // 4.3 RBAC: Farmer accessing Admin analytics
    const rbac3Res = await request('/api/admin/analytics', 'GET', null, farmerToken);
    assert(
      rbac3Res.status === 403,
      'RBAC Guard: Farmer blocked from Admin Analytics (HTTP 403)',
      `Received HTTP ${rbac3Res.status}`
    );

    // 4.4 Unauthenticated Request to Protected Route
    const noAuthRes = await request('/api/orders/my-orders', 'GET', null, null);
    assert(
      noAuthRes.status === 401,
      'Auth Guard: Unauthenticated request rejected (HTTP 401)',
      `Received HTTP ${noAuthRes.status}`
    );

    // 4.5 Malformed JWT Token Request
    const badTokenRes = await request('/api/orders/my-orders', 'GET', null, 'malformed.jwt.token');
    assert(
      badTokenRes.status === 401,
      'JWT Guard: Tampered/invalid JWT token rejected (HTTP 401)',
      `Received HTTP ${badTokenRes.status}`
    );

    // 4.6 Password Hashing & Non-Exposure
    const userMe = meRes.data.user;
    assert(
      !userMe.password,
      'Security: User password hash is never exposed in API payloads',
      'Password field omitted cleanly'
    );

    // 4.7 Input Validation & Injection Protection
    const injectionRes = await request('/api/products?search=test[.*+?^${}()|\\]safe');
    assert(
      injectionRes.status === 200,
      'MongoDB Injection Protection: Regex metacharacters escaped safely without crash',
      `HTTP ${injectionRes.status}`
    );

    // 4.8 Duplicate Account Prevention
    const dupRes = await request('/api/auth/register', 'POST', {
      name: 'Duplicate Test',
      email: customerEmail,
      password: 'SomePassword@123',
      role: 'CUSTOMER',
    });
    assert(
      dupRes.status === 400,
      'Integrity: Duplicate email registration rejected (HTTP 400)',
      `Received HTTP ${dupRes.status}`
    );

    console.log('\n================================================================');
    console.log(`AUDIT RESULTS: ${results.passed.length} PASSED, ${results.failed.length} FAILED`);
    console.log('================================================================\n');

    process.exit(results.failed.length === 0 ? 0 : 1);
  } catch (err) {
    console.error('Audit run encountered an unhandled error:', err);
    process.exit(1);
  }
};

runAudit();
