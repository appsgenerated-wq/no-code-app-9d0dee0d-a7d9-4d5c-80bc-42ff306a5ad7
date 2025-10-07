import React, { useEffect, useState } from 'react';
import config from '../constants.js';
import { UserCircleIcon, Cog6ToothIcon, ArrowLeftIcon, ShoppingCartIcon, XMarkIcon, ClockIcon, TruckIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const OrderStatusBadge = ({ status }) => {
  const statusStyles = {
    pending: { icon: ClockIcon, color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
    preparing: { icon: Cog6ToothIcon, color: 'bg-blue-100 text-blue-800', label: 'Preparing' },
    in_transit: { icon: TruckIcon, color: 'bg-indigo-100 text-indigo-800', label: 'In Transit' },
    delivered: { icon: CheckCircleIcon, color: 'bg-green-100 text-green-800', label: 'Delivered' },
  };
  const style = statusStyles[status] || statusStyles.pending;
  const Icon = style.icon;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.color}`}>
      <Icon className="-ml-0.5 mr-1.5 h-4 w-4" />
      {style.label}
    </span>
  );
};

const DashboardPage = ({ user, onLogout, manifest }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [deliveryCrater, setDeliveryCrater] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const restaurantResponse = await manifest.from('restaurant').find();
      setRestaurants(restaurantResponse.data || []);
      const orderResponse = await manifest.from('order').with(['restaurant']).find({ orderBy: 'createdAt', order: 'DESC' });
      setOrders(orderResponse.data || []);
    };
    fetchData();
  }, []);

  const selectRestaurant = async (restaurant) => {
    setSelectedRestaurant(restaurant);
    const menuResponse = await manifest.from('menuItem').find({ filter: { restaurantId: restaurant.id } });
    setMenuItems(menuResponse.data || []);
  };

  const addToCart = (item) => {
    setCart(currentCart => [...currentCart, item]);
  };

  const placeOrder = async () => {
    if (cart.length === 0 || !deliveryCrater) {
      alert('Please add items to your cart and specify a delivery crater.');
      return;
    }
    const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
    const newOrderData = {
      restaurantId: selectedRestaurant.id,
      deliveryCrater,
      totalPrice,
    };

    try {
      const newOrder = await manifest.from('order').create(newOrderData);
      setOrders([newOrder, ...orders]);
      setCart([]);
      setDeliveryCrater('');
      setIsCartOpen(false);
      setSelectedRestaurant(null);
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Failed to place order:', error);
      alert('There was an error placing your order.');
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  const mainContent = () => {
    if (selectedRestaurant) {
      return (
        <div>
          <button onClick={() => setSelectedRestaurant(null)} className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Restaurants
          </button>
          <div className="flex items-center mb-6">
            <img src={selectedRestaurant.logo?.url} alt={selectedRestaurant.name} className="h-20 w-20 rounded-lg object-cover mr-4" />
            <div>
                <h2 className="text-3xl font-bold text-gray-900">{selectedRestaurant.name}</h2>
                <p className="text-gray-600">{selectedRestaurant.description}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.length > 0 ? menuItems.map(item => (
              <div key={item.id} className="bg-white border rounded-lg shadow overflow-hidden">
                <img src={item.photo?.url} alt={item.name} className="h-40 w-full object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-gray-500 text-sm mb-2">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-green-600">{formatCurrency(item.price)}</span>
                    <button onClick={() => addToCart(item)} className="bg-cyan-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-cyan-600">Add</button>
                  </div>
                </div>
              </div>
            )) : <p>No menu items available.</p>}
          </div>
        </div>
      );
    }

    return (
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Lunar Cantinas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.length > 0 ? restaurants.map(restaurant => (
            <div key={restaurant.id} onClick={() => selectRestaurant(restaurant)} className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-4">
                <img src={restaurant.logo?.url} alt={restaurant.name} className="h-16 w-16 rounded-md object-cover" />
                <div>
                    <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                    <p className="text-gray-500 text-sm">{restaurant.description}</p>
                </div>
              </div>
            </div>
          )) : <p>No restaurants found.</p>}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">LunarEats Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, {user.name}!</span>
            {user.role === 'admin' && (
              <a href={`${config.BACKEND_URL}/admin`} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-600 hover:underline">Admin Panel</a>
            )}
            <button onClick={() => setIsCartOpen(true)} className="relative p-2 rounded-full hover:bg-gray-100">
                <ShoppingCartIcon className="h-6 w-6 text-gray-600"/>
                {cart.length > 0 && <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{cart.length}</span>}
            </button>
            <button onClick={onLogout} className="text-sm font-medium text-red-600 hover:text-red-800">Logout</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">{mainContent()}</div>
            <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-semibold mb-4">My Orders</h3>
                    <div className="space-y-4">
                        {orders.length > 0 ? orders.map(order => (
                            <div key={order.id} className="border p-3 rounded-md">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold">{order.restaurant?.name}</p>
                                        <p className="text-sm text-gray-500">To: {order.deliveryCrater}</p>
                                    </div>
                                    <span className="font-bold text-green-600">{formatCurrency(order.totalPrice)}</span>
                                </div>
                                <div className="mt-2">
                                    <OrderStatusBadge status={order.status}/>
                                </div>
                            </div>
                        )) : <p className="text-gray-500">You haven't placed any orders yet.</p>}
                    </div>
                </div>
            </div>
        </div>
      </main>
      
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsCartOpen(false)}></div>
      )}
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl z-50 transform transition-transform ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">My Cart</h2>
                <button onClick={() => setIsCartOpen(false)}><XMarkIcon className="h-6 w-6"/></button>
            </div>
            <div className="flex-grow overflow-y-auto space-y-3">
                {cart.length > 0 ? cart.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="flex justify-between items-center">
                        <span className="text-gray-700">{item.name}</span>
                        <span className="font-medium">{formatCurrency(item.price)}</span>
                    </div>
                )) : <p className="text-gray-500">Your cart is empty.</p>}
            </div>
            <div className="border-t pt-4 mt-4">
                <div className="flex justify-between font-bold text-lg mb-4">
                    <span>Total</span>
                    <span>{formatCurrency(cartTotal)}</span>
                </div>
                <input type="text" placeholder="Delivery Crater (e.g., Tranquility Base)" value={deliveryCrater} onChange={e => setDeliveryCrater(e.target.value)} className="w-full p-2 border rounded mb-4"/>
                <button onClick={placeOrder} disabled={cart.length === 0 || !deliveryCrater} className="w-full bg-cyan-500 text-white py-3 rounded-lg font-bold hover:bg-cyan-600 disabled:bg-gray-300">Place Order</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
