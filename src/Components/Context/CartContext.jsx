import axios from "axios";
import { createContext, useState } from "react";
import { apiUrl } from "../Http";


export const CartContext = createContext();

export default function CartContextProvider({children}){

    const [cartItems, setCartItems] = useState([]);
    const [prod, setCartProd] = useState([]);

    async function addToCart({ product_id, quantity, price }) {
        console.log(product_id,quantity,price);
    const res = await axios.post(
        `${apiUrl}/cart/add`,
        { product_id, quantity, price },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
        }
    );
    console.log(res);
    setCartItems(res?.data?.items || []);
}

    async function getCartItems(){
        const res = await axios.get(`${apiUrl}/cart`,{
            headers: {
                Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
              },
        });

        console.log(res.data);
        setCartItems(res?.data.items || []);
    }

    async function removeFromCart(itemId){
        const res = await axios.delete(`${apiUrl}/cart/remove/${itemId}`,{
            headers: {
                Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
              },
        });
        setCartItems(res?.data?.items || []);
    }

    const values = {
        addToCart
        ,getCartItems
        ,removeFromCart
        ,cartItems,
        prod
    }

    return <CartContext.Provider value={values}>
                {children}
    </CartContext.Provider>;
}