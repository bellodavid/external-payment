import React, { useState } from "react";
import { Product } from "@/types";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import USDTPayment from "./components/USDTPayment";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const products: Product[] = [
  {
    id: 1,
    name: "Luxury Watch",
    price: 1000,
    image: "https://images-cdn.ubuy.co.in/6538521dd843ca37ef23780e-oupinke-mens-watches-automatic-skeleton.jpg",
  },
  {
    id: 2,
    name: "Designer Handbag",
    price: 750,
    image: "https://nairametrics.com/wp-content/uploads/2023/05/designer-handbag-lead-art1.jpg",
  },
  {
    id: 3,
    name: "Premium Sunglasses",
    price: 250,
    image: "https://5.imimg.com/data5/ANDROID/Default/2021/7/SF/UI/DV/32393004/product-jpeg-1000x1000.jpg",
  },
  {
    id: 4,
    name: "Leather Shoes",
    price: 500,
    image: "https://www.districtonelabel.sg/pub/media/magefan_blog/A_Comprehensive_Buying_Guide_Leather_Shoes_for_Men_1.png",
  },
];

const HomePage: React.FC = () => {
  const [cart, setCart] = useState<Product[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
    setShowPayment(true);
  };

  const handlePaymentSuccess = (transactionId: string) => {
    setIsProcessingPayment(true);
    // Don't close the dialog immediately - let the Success component show
    setTimeout(() => {
      setIsProcessingPayment(false);
      setShowPayment(false);
      setCart([]); // Clear the cart
    }, 3000); // Match this with the Success component's redirectDelay
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-[#4c3f84]">
        Luxury Boutique
      </h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <ProductList products={products} addToCart={addToCart} />
        </div>
        <div className="md:w-1/3">
          <Cart
            items={cart}
            removeFromCart={removeFromCart}
            totalAmount={totalAmount}
            onCheckout={handleCheckout}
          />
        </div>
      </div>

      <Dialog 
        open={showPayment} 
        onOpenChange={(open) => {
          // Only allow closing if not processing payment
          if (!isProcessingPayment) {
            setShowPayment(open);
          }
        }}
      >
        <DialogContent className="flex flex-col w-[100vw] max-h-[80vh] bg-white p-0 overflow-hidden">
          <div className="flex-1 px-0 overflow-y-auto scrollbar-hide">
            <USDTPayment
              storeId="luxury-boutique"
              amount={totalAmount}
              currency="NGN"
              walletAddress="0x1234567890123456789012345678901234567890"
              description={`Purchase of ${cart.length} item(s) from Luxury Boutique`}
              callbackUrl="/api/payment-callback"
              onSuccess={handlePaymentSuccess}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomePage;