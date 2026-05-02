import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


export const ShopContext = createContext()

const ShopContextProvider = (props) => {

    const currency = '₹'
    const delivery_fee = 100
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID
    const [search, setSearch] = useState('')
    const [showSearch, setShowSearch] = useState(false)
    const [cartItems, setCartItems] = useState({})
    const [products, setProducts] = useState([])
    const [token, setToken] = useState('')
    const navigate = useNavigate()



    const addToCart = async (itemId, size) => {
        let cartData = structuredClone(cartItems)

        if (!size) {
            toast.error('Select Product Size')
            return
        }

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1
            } else {
                cartData[itemId][size] = 1
            }
        } else {
            cartData[itemId] = {}
            cartData[itemId][size] = 1
        }
        setCartItems(cartData)

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/add', { itemId, size }, { headers: { authorization: `Bearer ${token}` } })
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }
    }

    const getCartCount = () => {
        let totalCount = 0
        for (const itemId in cartItems) {
            const sizes = cartItems[itemId]
            if (!sizes || typeof sizes !== 'object') continue
            for (const sizeKey in sizes) {
                const qty = Number(sizes[sizeKey]) || 0
                totalCount += qty
            }
        }
        return totalCount
    }

    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems)

        cartData[itemId][size] = quantity

        setCartItems(cartData)

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { authorization: `Bearer ${token}` } })
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }
    }

    const getCartAmount = () => {
        let totalAmount = 0
        for (const itemId in cartItems) {
            const itemInfo = products.find((product) => product._id === itemId)
            if (!itemInfo) continue
            const sizes = cartItems[itemId]
            for (const sizeKey in sizes) {
                const qty = Number(sizes[sizeKey]) || 0
                if (qty > 0) {
                    totalAmount += itemInfo.price * qty
                }
            }
        }
        return totalAmount
    }

    const getProductsData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list')
            if (response.data.success) {
                setProducts(response.data.products)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getUserCart = async (tokenParam) => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { authorization: `Bearer ${tokenParam}` } })
            if (response.data.success) {
                setCartItems(response.data.cartData)
            }
        } catch (error) {
            console.log(error)
            // silently fail on first load if token is invalid
        }
    }

    useEffect(() => {
        getProductsData()
    }, [])

    useEffect(() => {
        const storedToken = localStorage.getItem('token')
        if (storedToken && !token) {
            setToken(storedToken)
        }
    }, [])

    useEffect(() => {
        if (token) {
            getUserCart(token)
        }
    }, [token])

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, setCartItems, addToCart, getCartCount, updateQuantity,
        getCartAmount, navigate, backendUrl, setToken, token
    }
    // expose razorpayKey for client-side checkout
    value.razorpayKey = razorpayKey
    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider