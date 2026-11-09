const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Notification = require('../models/Notification');
const { generateOrderNumber } = require('../utils/helpers');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (CUSTOMER)
const createOrder = async (req, res, next) => {
  try {
    const { items, deliveryAddress, paymentMethod = 'COD', orderNotes } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items specified',
      });
    }

    if (
      !deliveryAddress ||
      !deliveryAddress.fullName ||
      !deliveryAddress.phone ||
      !deliveryAddress.street ||
      !deliveryAddress.city ||
      !deliveryAddress.pincode
    ) {
      return res.status(400).json({
        success: false,
        message: 'Complete delivery address is required (Full Name, Phone, Street, City, Pincode)',
      });
    }

    // Step 1: Validate stock for each item & prepare order items
    const validatedItems = [];
    let subtotal = 0;
    const farmersInvolved = new Set();

    for (const item of items) {
      const product = await Product.findById(item.productId || item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.productId || item.product} not found`,
        });
      }

      if (product.availableQuantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Available: ${product.availableQuantity} ${product.unit}, requested: ${item.quantity}`,
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;
      farmersInvolved.add(product.farmer.toString());

      validatedItems.push({
        product: product._id,
        farmer: product.farmer,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        unit: product.unit,
        image: product.images && product.images.length > 0 ? product.images[0] : '',
      });
    }

    const deliveryCharge = subtotal >= 500 ? 0 : 40;
    const totalAmount = subtotal + deliveryCharge;
    const orderNumber = generateOrderNumber();

    // Step 2: Deduct product stock
    for (const item of validatedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { availableQuantity: -item.quantity },
      });
    }

    // Step 3: Create Order document
    const order = await Order.create({
      orderNumber,
      customer: req.user._id,
      items: validatedItems,
      deliveryAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PENDING',
      subtotal,
      deliveryCharge,
      totalAmount,
      orderStatus: 'Pending',
      orderNotes: orderNotes || '',
      statusHistory: [
        {
          status: 'Pending',
          timestamp: new Date(),
          note: 'Order successfully placed with Cash on Delivery payment option',
        },
      ],
    });

    // Step 4: Clear user cart
    await Cart.findOneAndUpdate({ user: req.user._id }, { $set: { items: [] } });

    // Step 5: Notify Farmers
    for (const farmerId of farmersInvolved) {
      await Notification.create({
        recipient: farmerId,
        sender: req.user._id,
        title: 'New Order Received!',
        message: `You received a new harvest order ${orderNumber}. Please check your orders to confirm.`,
        type: 'ORDER',
        link: `/farmer/orders`,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in customer's orders
// @route   GET /api/orders/my-orders
// @access  Private (CUSTOMER)
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.farmer', 'name phone email avatar');

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get farmer's received orders
// @route   GET /api/orders/farmer-orders
// @access  Private (FARMER)
const getFarmerOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 15 } = req.query;
    const query = { 'items.farmer': req.user._id };

    if (status) {
      query.orderStatus = status;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('customer', 'name email phone avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Filter each order's items so farmer only sees their own items and calculated earnings
    const formattedOrders = orders.map((order) => {
      const oObj = order.toObject();
      const myItems = oObj.items.filter(
        (it) => it.farmer.toString() === req.user._id.toString()
      );
      const mySubtotal = myItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
      return {
        ...oObj,
        myItems,
        myEarnings: mySubtotal,
      };
    });

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      orders: formattedOrders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order details by ID or orderNumber
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const isObjectId = req.params.id.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: req.params.id } : { orderNumber: req.params.id };

    const order = await Order.findOne(query)
      .populate('customer', 'name email phone avatar')
      .populate('items.farmer', 'name email phone avatar');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Authorization check
    const isCustomer = order.customer._id.toString() === req.user._id.toString();
    const isFarmerInvolved = order.items.some(
      (item) => item.farmer && item.farmer._id.toString() === req.user._id.toString()
    );
    const isAdmin = req.user.role === 'ADMIN';

    if (!isCustomer && !isFarmerInvolved && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order',
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Farmer or Admin)
// @route   PUT /api/orders/:id/status
// @access  Private (FARMER, ADMIN)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const allowedStatuses = [
      'Pending',
      'Confirmed',
      'Processing',
      'Ready for Delivery',
      'Shipped',
      'Delivered',
      'Cancelled',
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}`,
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Role check
    const isFarmerInvolved = order.items.some(
      (item) => item.farmer.toString() === req.user._id.toString()
    );
    if (!isFarmerInvolved && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this order' });
    }

    // If order is already delivered or cancelled, disallow invalid transitions
    if (order.orderStatus === 'Delivered' && status !== 'Delivered') {
      return res.status(400).json({
        success: false,
        message: 'Delivered orders cannot be moved back to an earlier status',
      });
    }

    // If cancelling, restore stock
    if (status === 'Cancelled' && order.orderStatus !== 'Cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { availableQuantity: item.quantity },
        });
      }
    }

    // If delivered via COD, mark payment PAID
    if (status === 'Delivered' && order.paymentMethod === 'COD') {
      order.paymentStatus = 'PAID';
    }

    order.orderStatus = status;
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note: note || `Order status updated to ${status} by ${req.user.name}`,
    });

    await order.save();

    // Notify customer
    await Notification.create({
      recipient: order.customer,
      sender: req.user._id,
      title: `Order Update: ${status}`,
      message: `Your order #${order.orderNumber} is now ${status}. ${note || ''}`,
      type: 'ORDER',
      link: `/customer/orders/${order._id}`,
    });

    return res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getFarmerOrders,
  getOrderById,
  updateOrderStatus,
};

