import React, { useState, useEffect } from 'react';
import './Cart.css';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Text, Image, HStack, VStack, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, useToast } from '@chakra-ui/react';

const URL = "https://saleem-footwear-api.vercel.app/api/v1";
const token = localStorage.getItem('token');

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [quantityChanges, setQuantityChanges] = useState({});
  
  // Chakra Modal and Toast State
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [orderConfirm, setOrderConfirm] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };
        const response = await axios.get(`${URL}/cart`, { headers });
        const cartData = response.data.data.items || [];

        const calculatedTotalPrice = cartData.reduce((acc, item) => {
          const fullQuantity = item.itemSet.reduce((sum, setItem) => sum + setItem.lengths, 0);
          return acc + (fullQuantity * item.productId.price);
        }, 0);

        setUserId(response.data.data.userId);
        setTotalItems(response.data.data.totalItems);
        setTotalPrice(calculatedTotalPrice);
        setCart(cartData);
      } catch (error) {
        console.error('Error fetching cart data:', error);
        setCart([]);
      }
    };

    fetchCart();
  }, []);

  const removeItem = async (CartItemId) => {
    try {
      const headers = {
        'Authorization': `Bearer ${token}`
      };
      await axios.delete(`${URL}/cart/${CartItemId}`, { headers });
      setCart(cart.filter(item => item._id !== CartItemId));
      window.dispatchEvent(new Event('cart-updated'));
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const handleQuantityChange = (CartItemId, increment) => {
    const cartItem = cart.find(item => item._id === CartItemId);
    const itemSetLength = cartItem.itemSet.reduce((sum, setItem) => sum + setItem.lengths, 0);

    const newQuantity = (quantityChanges[CartItemId] ?? itemSetLength) + increment * itemSetLength;

    if (newQuantity < itemSetLength) return;

    setQuantityChanges(prev => ({
      ...prev,
      [CartItemId]: newQuantity
    }));
  };

  const updateCartSummary = (updatedCart) => {
    const calculatedTotalPrice = updatedCart.reduce((acc, item) => {
      const fullQuantity = item.itemSet.reduce((sum, setItem) => sum + setItem.lengths, 0);
      return acc + (fullQuantity * item.productId.price);
    }, 0);

    const calculatedTotalItems = updatedCart.reduce((acc, item) => {
      const fullQuantity = item.itemSet.reduce((sum, setItem) => sum + setItem.lengths, 0);
      return acc + fullQuantity;
    }, 0);

    setTotalPrice(calculatedTotalPrice);
    setTotalItems(calculatedTotalItems);
  };

  const updateQuantity = async (CartItemId) => {
    const newQuantity = quantityChanges[CartItemId];

    if (!newQuantity) return;

    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      await axios.patch(
        `${URL}/cart/${CartItemId}`,
        { quantity: newQuantity }, 
        { headers }
      );

      const updatedCart = cart.map(item =>
        item._id === CartItemId ? { ...item, quantity: newQuantity } : item
      );

      setCart([...updatedCart]);
      updateCartSummary(updatedCart);

      setQuantityChanges(prev => {
        const updatedChanges = { ...prev };
        delete updatedChanges[CartItemId];
        return updatedChanges;
      });

    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity. Please try again.');
    }
  };

  const handlePdfDownload = () => {
    if (cart.length > 0) {
      const input = document.querySelector('.cart');
      const originalColor = input.style.color;
      input.style.color = 'black';

      html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'pt',
          format: [canvas.width, canvas.height],
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save('Cart.pdf');
        input.style.color = originalColor;
      });
    }
  };

  const handleOrderNow = () => {
    onOpen();  // Open the Chakra confirmation modal
  };

  const confirmOrder = async () => {
    onClose(); // Close the modal after confirmation

    try {
      if (cart.length > 0) {
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        const orderData = {
          userId: userId,
          items: cart.map(item => ({
            productId: item.productId._id,
            quantity: item.itemSet.reduce((sum, setItem) => sum + setItem.lengths, 0),
            price: item.productId.price,
            itemSet: item.itemSet,
            color: item.color,
          })),
          totalPrice: totalPrice,
          totalItems: totalItems,
        };

        const response = await axios.post(`${URL}/order`, orderData, { headers });

        // Show success toast
        toast({
          title: "Order placed.",
          description: `Your order of ₹${totalPrice} has been placed successfully!`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        // Clear cart after successful order
        setCart([]);
        navigate('/order-summary', { state: { order: response.data.data } });
      } else {
        toast({
          title: "Cart is empty.",
          description: "Please add items to your cart before placing an order.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error placing order:', error);

      // Show error toast
      toast({
        title: "Order failed.",
        description: "Failed to place the order. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const quantity = (item, fullQuantity) => {
    return item.quantity === 1 ? fullQuantity : item.quantity - 1;
  };

  return (
    <Box className="cart" p={4}>
      <Text fontSize="2xl" fontWeight="bold" color="red.500">Cart</Text>
      <Text fontSize="xl" color="black">Total Cost: ₹{totalPrice}</Text>
      
      <HStack spacing={4} mt={4}>
        <Button colorScheme="red" width="100%" onClick={handleOrderNow}>Order Now</Button>
      </HStack>

      {cart.length === 0 ? (
        <Text>Your cart is empty</Text>
      ) : (
        <Box mt={4}>
          {cart.map((item, index) => {
            const fullQuantity = item.itemSet.reduce((sum, setItem) => sum + setItem.lengths, 0);
            const itemTotalPrice = fullQuantity * item.productId.price;

            return (
              <Box key={index} p={4} borderWidth={1} borderRadius="md" mb={4}>
                <HStack spacing={4}>
                  <Image src={item.productId.images[0]} alt={item.productId.name} boxSize="100px" />
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold" fontSize="lg">{item.productId.name}</Text>
                    <Text>Brand: {item.productId.brand}</Text>
                    <Text>Price: ₹{itemTotalPrice}</Text>
                  </VStack>
                </HStack>
                <HStack spacing={4} mt={2}>
                  <Button size="sm" onClick={() => handleQuantityChange(item._id, -1)}>-</Button>
                  <Text>{quantityChanges[item._id] ?? fullQuantity}</Text>
                  <Button size="sm" onClick={() => handleQuantityChange(item._id, 1)}>+</Button>
                  <Button size="sm" colorScheme="green" onClick={() => updateQuantity(item._id)}>Confirm</Button>
                  <Button size="sm" colorScheme="red" onClick={() => removeItem(item._id)}>Remove</Button>
                </HStack>
              </Box>
            );
          })}
        </Box>
      )}

      {/* Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Order</ModalHeader>
          <ModalBody>
            <Text>Are you sure you want to place the order worth ₹{totalPrice}?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={onClose}>Cancel</Button>
            <Button colorScheme="green" onClick={confirmOrder} ml={3}>Confirm</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Cart;
