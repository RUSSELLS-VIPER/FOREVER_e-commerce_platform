import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const placeorder = () => {

  const [method, setMethod] = useState('cod')
  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  })

  const onChangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value

    setFormData(data => ({ ...data, [name]: value }))
  }

  const loadRazorpayScript = () => new Promise((resolve) => {
    if (document.querySelector('#razorpay-script')) return resolve(true)
    const script = document.createElement('script')
    script.id = 'razorpay-script'
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      let orderItems = []
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items))
            if (itemInfo) {
              itemInfo.size = item
              itemInfo.quantity = cartItems[items][item]
              orderItems.push(itemInfo)
            }
          }
        }
      }
      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee
      }
      switch (method) {
        case 'cod':
          try {
            const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { authorization: `Bearer ${token}` } })
            if (response.data.success) {
              setCartItems({})
              navigate('/orders')
            } else {
              toast.error(response.data.message)
            }
          } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message || error.message)
          }
          break;
        case 'stripe':
          try {
            const resp = await axios.post(backendUrl + '/api/order/stripe/checkout', { amount: orderData.amount, order: orderData }, { headers: { authorization: `Bearer ${token}` } })
            if (resp.data.success && resp.data.url) {
              // redirect to Stripe Checkout
              window.location.href = resp.data.url
            } else {
              toast.error(resp.data.message || 'Failed to start Stripe checkout')
            }
          } catch (error) {
            toast.error(error?.response?.data?.message || error.message)
          }
          break;
        case 'razorpay':
          try {
            const loaded = await loadRazorpayScript()
            if (!loaded) return toast.error('Failed to load Razorpay SDK')

            const resp = await axios.post(backendUrl + '/api/order/razorpay', { amount: orderData.amount }, { headers: { authorization: `Bearer ${token}` } })
            if (!resp.data.success) return toast.error(resp.data.message || 'Failed to create Razorpay order')

            const rOrder = resp.data.order
            const options = {
              key: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
              amount: rOrder.amount,
              currency: rOrder.currency,
              name: 'E-Shop',
              description: 'Order Payment',
              order_id: rOrder.id,
              handler: async function (paymentResult) {
                try {
                  const verifyResp = await axios.post(backendUrl + '/api/order/razorpay/verify', {
                    razorpay_order_id: paymentResult.razorpay_order_id,
                    razorpay_payment_id: paymentResult.razorpay_payment_id,
                    razorpay_signature: paymentResult.razorpay_signature,
                    order: orderData
                  }, { headers: { authorization: `Bearer ${token}` } })

                  if (verifyResp.data.success) {
                    setCartItems({})
                    navigate('/orders')
                  } else {
                    toast.error(verifyResp.data.message || 'Payment verification failed')
                  }
                } catch (err) {
                  toast.error(err?.response?.data?.message || err.message)
                }
              },
              prefill: {
                name: formData.firstName + ' ' + formData.lastName,
                email: formData.email,
                contact: formData.phone
              }
            }

            const rzp = new window.Razorpay(options)
            rzp.open()
          } catch (error) {
            toast.error(error.message)
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>

      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>

        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} type="text" className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='First Name' />
          <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} type="text" className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='Last Name' />
        </div>
        <input required onChange={onChangeHandler} name='email' value={formData.email} type="email" className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='Email Address' />
        <input onChange={onChangeHandler} name='street' value={formData.street} type="text" className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='Street' />
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='city' value={formData.city} type="text" className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='City' />
          <input required onChange={onChangeHandler} name='state' value={formData.state} type="text" className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='State' />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} type="number" className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='ZIP Code' />
          <input required onChange={onChangeHandler} name='country' value={formData.country} type="text" className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='Country' />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='phone' value={formData.phone} type="tel" className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='Phone Number' />
        </div>

      </div>

      <div className='mt-8'>

        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>

        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'} />

          <div className='flex gap-3 flex-col lg:flex-row'>
            <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
              <img src={assets.stripe_logo} className='h-5 mx-4' alt="" />
            </div>
            <div onClick={() => setMethod('razorpay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''}`}></p>
              <img src={assets.razorpay_logo} className='h-5 mx-4' alt="" />
            </div>
            <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>

          <div className='w-full text-end mt-8'>
            <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>PLACE ORDER</button>
          </div>

        </div>

      </div>

    </form>
  )
}

export default placeorder
