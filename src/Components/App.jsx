
import { Route, Routes, useParams } from 'react-router-dom';
import './App.scss';
import EventPage from './Pages/EventPage';
import Header from './Pages/Header';
import Footer from './Pages/Footer';
import AllEvents from './Pages/AllEvents';
import Cart from './Pages/Cart';
import Favorites from './Pages/Favorites';
import Home from './Pages/Home';
import EventDetail from './Pages/EventDetail';
import Icon from 'react-icons-kit'
import { ic_shopping_cart } from 'react-icons-kit/md/ic_shopping_cart'
import { useEffect, useState } from 'react';
import SideCart from './Pages/SideCart';
import translations from "./translations.json"
import toast, { Toaster } from 'react-hot-toast';


function App() {
  const { language, category } = useParams()
  const [openSideCart, setOpenSideCart] = useState(false)
  const [carts, setCarts] = useState([]);
  const [ids, setIds] = useState([]);
  const [timeLeft, setTimeLeft] = useState(() => {
    const storedTimeLeft = JSON.parse(localStorage.getItem('timeLeft'));
    return storedTimeLeft !== null ? storedTimeLeft : 15 * 60;
  })

  useEffect(() => {
    localStorage.setItem('timeLeft', JSON.stringify(timeLeft));
  }, [timeLeft]);

  useEffect(() => {
    const storedCarts = JSON.parse(localStorage.getItem('carts')) || [];
    setCarts(storedCarts);
  }, []);

  useEffect(() => {
    localStorage.setItem('carts', JSON.stringify(carts));
  }, [carts]);


  const addToCarts = (eventId) => {
    if (carts.includes(eventId)) {
      setCarts(prevCarts => prevCarts.filter(id => id !== eventId));
      toast.success(translations[language]['toast-error']);

    } else {
      setCarts(prevCarts => [...prevCarts, eventId]);
      toast.success(translations[language]['toast-success']);
      setTimeLeft(15 * 60);
    }
  };

  useEffect(() => {
    // Sebet itemleri deyisende Cart Fetch render
    const storedCarts = JSON.parse(localStorage.getItem('carts')) || [];
    setIds(storedCarts);

    //Time Limit
    if (carts.length > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft === 0) {
            clearInterval(timer);
            localStorage.removeItem('carts');
            setIds([]);
            setCarts([])
            toast.success(translations[language]['toast-error']);
            return 0;
          } else {
            return prevTimeLeft - 1;
          }
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [carts, language]);

  const handleCartIconClick = () => {
    if (!openSideCart && carts.length > 0) {
      setOpenSideCart(true);
    }
  };

  const handleDelete = (idToDelete) => {
    const updatedIds = ids.filter(id => id !== idToDelete);
    setIds(updatedIds);

    const updatedCarts = carts.filter(id => id !== idToDelete);
    setCarts(updatedCarts);

    localStorage.setItem('carts', JSON.stringify(updatedIds));
    toast.success(translations[language]['toast-error']);

    if (updatedCarts.length === 0) {
      setOpenSideCart(false);
      setTimeout(() => {
        setTimeLeft(0);
      }, 2000);    }
  };

  const handleClearCart = () => {
    setCarts([])
    localStorage.removeItem('carts');
    setOpenSideCart(false);
    setTimeLeft(0);
    toast.success(translations[language]['toast-error']);
  }

  return (
    <div className='relative'>
      <Toaster
        position='top-right'
        toastOptions={{
          duration: 2000,
          className: 'custom-toast',
          style: {
            backgroundColor: "#fd0",
            fontWeight: "600",
            padding: '16px',
            color: '#713200',
            // animation: 'fade-in 0.5s ease, fade-out 0.5s ease ',
          },
        }} />
      <button onClick={handleCartIconClick}
        className='cart-icon fixed h-14 w-14 orange mt-5 mr-5 mb-5 p-3 z-50 right-0 rounded-full bottom-0'>
        <Icon icon={ic_shopping_cart} size={27} />
        <span className='rounded-full w-5 absolute top-0 right-0 bg-red-700 text-white text-sm'>
          {carts.length}
        </span>
      </button>
      <Header cartItemCount={carts.length} />
      {openSideCart &&
        <SideCart
          ids={ids}
          setIds={setIds}
          handleDelete={handleDelete}
          handleClose={() => setOpenSideCart(false)}
          timeLeft={timeLeft}
          cartItemCount={carts.length}
          handleClearCart={handleClearCart}
        />
      }
      <Routes>
        <Route path="/" element={<Home language={language} />} exact />
        <Route path="/:language" element={<AllEvents category={category} />} exact />
        <Route path="/:language/:category" element={<EventPage />} exact />
        <Route path='/:language/:category/:slug'
          element={<EventDetail
            addToCarts={addToCarts}
            carts={carts}
            setCarts={setCarts}
            category={category} />} exact />
        <Route path='/:language/cart' element={<Cart
          handleDelete={handleDelete}
          ids={ids}
          setIds={setIds}
          timeLeft={timeLeft}
        />} exact />
        <Route path='/:language/favorites' element={<Favorites />} exact />
      </Routes>
      <Footer />
    </div>

  );
}

export default App;
