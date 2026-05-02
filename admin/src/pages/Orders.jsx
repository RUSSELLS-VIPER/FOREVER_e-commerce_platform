import React from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([])
  const statusOptions = [
    'Order Placed',
    'Packing',
    'Shipped',
    'Out for Delivery',
    'Delivered'
  ]
  const handleStatusChange = async (orderId, newStatus) => {
    if (!token) return toast.error('No auth token')
    try {
      const response = await axios.post(
        backendUrl + '/api/order/status',
        { orderId, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (response.data.success) {
        setOrders(prev => prev.map(o => (o._id === orderId ? { ...o, status: newStatus } : o)))
        toast.success('Order status updated')
      } else {
        toast.error(response.data.message || 'Failed to update status')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }
  const fetchAllOrders = async () => {
    if (!token) return null
    try {
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { Authorization: `Bearer ${token}` } })
      if (response.data.success) {
        setOrders(response.data.orders || [])
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [token])
  return (
    <div>
      <h3>Order Page</h3>
      <div>
        {orders.map((order, orderIdx) => (
          <div key={`${order._id || 'order'}-${orderIdx}`} className="mb-4 p-3 border rounded">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <img src={assets.parcel_icon} alt="parcel" className="w-8 h-8" />
                <div>
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">Order:</span> {order._id || `#${orderIdx + 1}`}
                  </div>
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">Date:</span> {order.date ? new Date(order.date).toLocaleString() : '—'}
                  </div>
                  <div className="mt-2">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, itemIdx) => (
                        <p key={`${order._id || orderIdx}-item-${item._id || itemIdx}`} className="text-sm">
                          {item.name} x {item.quantity} <span className="ml-2 text-gray-600">{item.size}</span>
                        </p>
                      ))
                    ) : (
                      <p>No items</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-sm text-right">
                <p>
                  <span className="font-medium">Amount:</span> ₹{order.amount ?? order.total ?? 0}
                </p>
                <p>
                  <span className="font-medium">Payment:</span> {order.payment ? 'Paid' : 'Unpaid'}
                </p>
                <p>
                  <span className="font-medium">Method:</span> {order.paymentMethod || '—'}
                </p>
                <div className="mb-1">
                  <span className="font-medium">Status:</span>
                  <div className="mt-1">
                    <select
                      value={order.status || 'Order Placed'}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 text-sm text-gray-600">
              <p className="font-semibold">{order.address?.firstName || ''} {order.address?.lastName || ''}</p>
              {order.address?.address && <p>{order.address.address}</p>}
              {(order.address?.city || order.address?.state || order.address?.pin) && (
                <p>
                  {order.address?.city || ''}{order.address?.state ? `, ${order.address.state}` : ''}{order.address?.pin ? ` ${order.address.pin}` : ''}
                </p>
              )}
              {order.address?.phone && <p>Phone: {order.address.phone}</p>}
              {order.address?.email && <p>Email: {order.address.email}</p>}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default Orders