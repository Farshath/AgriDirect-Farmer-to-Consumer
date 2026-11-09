const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper to calculate total
const calculateCartTotal = (items) => {
  let subtotal = 0;
  items.forEach((item) => {
    if (item.product && item.product.price) {
      subtotal += item.product.price * item.quantity;
    }
  });
  return subtotal;
};

// @desc    Get user's current shopping cart
// @route   GET /api/cart
// @access  Private (CUSTOMER)
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      populate: { path: 'farmer', select: 'name email phone avatar' },
    });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Filter out deleted products if any
    cart.items = cart.items.filter((item) => item.product !== null);
    const subtotal = calculateCartTotal(cart.items);
    const deliveryCharge = subtotal > 0 ? (subtotal >= 500 ? 0 : 40) : 0;
    const total = subtotal + deliveryCharge;

    return res.status(200).json({
      success: true,
      cart,
      summary: {
        subtotal,
        deliveryCharge,
        total,
        itemCount: cart.items.reduce((acc, curr) => acc + curr.quantity, 0),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add product to cart
// @route   POST /api/cart
// @access  Private (CUSTOMER)
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or currently unavailable',
      });
    }

    if (product.availableQuantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Product is currently out of stock',
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    const qtyToAdd = Math.max(1, Number(quantity));

    if (existingIndex > -1) {
      const newQty = cart.items[existingIndex].quantity + qtyToAdd;
      if (newQty > product.availableQuantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.availableQuantity} ${product.unit} available in stock`,
        });
      }
      cart.items[existingIndex].quantity = newQty;
    } else {
      if (qtyToAdd > product.availableQuantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.availableQuantity} ${product.unit} available in stock`,
        });
      }
      cart.items.push({
        product: productId,
        quantity: qtyToAdd,
        priceAtAddition: product.price,
      });
    }

    await cart.save();

    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private (CUSTOMER)
const updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === itemId || item.product.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not in cart' });
    }

    const product = await Product.findById(cart.items[itemIndex].product);
    if (!product) {
      cart.items.splice(itemIndex, 1);
      await cart.save();
      return getCart(req, res, next);
    }

    const newQty = Number(quantity);
    if (newQty <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      if (newQty > product.availableQuantity) {
        return res.status(400).json({
          success: false,
          message: `Cannot exceed stock of ${product.availableQuantity} ${product.unit}`,
        });
      }
      cart.items[itemIndex].quantity = newQty;
    }

    await cart.save();
    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private (CUSTOMER)
const removeFromCart = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) => item._id.toString() !== itemId && item.product.toString() !== itemId
    );

    await cart.save();
    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private (CUSTOMER)
const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    return res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      cart: { items: [] },
      summary: { subtotal: 0, deliveryCharge: 0, total: 0, itemCount: 0 },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};

