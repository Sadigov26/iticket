/* eslint-disable react/prop-types */

import Icon from 'react-icons-kit'
import axios from "axios"
import { ic_shopping_cart } from 'react-icons-kit/md/ic_shopping_cart'
import { x } from 'react-icons-kit/feather/x'
import { trash } from 'react-icons-kit/fa/trash'
import { useEffect, useState } from 'react';
import warning from "../Images/warning.svg";
import translations from '../translations.json';
import { Link } from 'react-router-dom'



const SideCart = ({ handleClose, cartItemCount, ids, handleDelete, timeLeft, handleClearCart }) => {
    const [carts, setCarts] = useState([])
    const language = localStorage.getItem('language') || 'az'
    const [showWarning, setShowWarning] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (e.target.closest('.side-cart') === null) {
                handleClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClose]);




    useEffect(() => {
        const fetchCarts = async () => {
            try {
                let url = `https://api.iticket.az/${language}/v5/events?client=web`;

                if (ids && ids.length > 0) {
                    const idString = ids.join('&event_ids[]=');
                    url += `&event_ids[]=${idString}`;
                } else {
                    setCarts([]);
                    return;
                }
                const response = await axios.get(url);
                setCarts(response.data.response.events.data);

                const totalPrice = response.data.response.events.data.reduce((acc, event) => acc + event.min_price, 0);
                setTotalPrice(totalPrice);

            } catch (error) {
                console.error('Error fetching event detail:', error);
            } finally {
                setTimeout(() => setShowWarning(true), 300);
            }
        };
        fetchCarts();
    }, [language, ids]);



    const formatTime = (timeLeft) => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };


    return (
        <div style={{ zIndex: "1000" }}
            className='sidecart-overlay fixed top-0 left-0 w-full h-dvh flex justify-end'>
            <div className='side-cart px-5 md:w-1/2 w-11/12 pt-5 pb-3 overflow-x-hidden overflow-y-scroll relative bg-white h-full'>
                {carts.length > 0 ? (
                    <div className='h-full flex flex-col justify-between w-full'>
                        <div className='flex flex-col'>
                            <div className="flex justify-between items-center mt-4 mb-5 w-full">
                                <div className="flex gap-2 text-gray-500">
                                    <Icon icon={ic_shopping_cart} size={25} />
                                    <p>{translations[language]['ticketcount']} {cartItemCount}
                                    </p>
                                </div>
                                <Icon onClick={handleClose} icon={x} size={25} className='text-gray-500 cursor-pointer' />
                            </div>
                            <div className='mb-5'>
                                <h1 className="page-title">{translations[language]['cart']}</h1>
                                <div className="time-limit-container h-1.5 mt-4 bg-gray-400 relative">
                                    <div style={{ width: `${(timeLeft / (15 * 60)) * 100}%` }}
                                        className="time-limit orange h-1.5"></div>
                                    <div className="max-w-16 h-8 rounded-lg absolute right-0 -top-3 py-1 px-2 bg-white shadow text-base font-semibold">
                                        {formatTime(timeLeft)}
                                    </div>
                                </div>
                            </div>
                            <div className='cart-item'>
                                {carts.map(event => (
                                    <div key={event.id} className="ticket-list-item  md:flex md:items-center !justify-between pb-8 flex flex-row mt-8">
                                        <div className="flex items-center">
                                            <div className="ticket_image overflow-hidden  max-h-28 max-w-28 mr-2 lg:mr-4 rounded-lg flex items-center relative">
                                                <img className="object-cover" src={event.poster_bg_url} />
                                                <img className="object-contain absolute" src={event.poster_url} />
                                            </div>
                                            <div className="ticket-info flex flex-col justify-between">
                                                <div className="session-datetime lg:hidden md:text-sm text-xs text-gray-500 mb-1">
                                                    BZP /
                                                    10:00, 19.04.24
                                                </div>
                                                <div className="session-datetime hidden lg:flex  md:text-sm text-xs text-gray-500 lg:mb-2">
                                                    BZP /
                                                    Cümə, 19 Aprel - 10:00
                                                </div>
                                                <div className="event-name lg:text-xl md:text-lg text-base font-medium mb-2 whitespace-normal">
                                                    {event.name}
                                                </div>
                                                <div>Standart</div>
                                            </div>
                                        </div>
                                        <div className="price-label flex md:flex-row flex-col md:items-center md:gap-3 gap-0 group md:ml-0 ml-1">
                                            <div className="price-block p-3 orange text-center md:rounded-xl rounded-b-none rounded-t-xl flex flex-col items-center justify-center">
                                                <div className="price whitespace-nowrap lg:text-2xl text-lg text-center">
                                                    {event.min_price} ₼
                                                </div>
                                                <div className="label text-gray-600 text-sm">
                                                {language === 'en' ? 'from' : ''}  {language === 'ru' ? 'от' : ''} {event.age_limit} {language === 'az' ? 'yaşlar üçün' : ''} {language === 'en' ? 'years old' : ''} {language === 'ru' ? 'лет' : ''}                                                    </div>
                                            </div>
                                            <button onClick={() => handleDelete(event.id)}
                                                className="delete-btn flex items-center justify-center md:rounded-full rounded-t-none rounded-b-xl md:h-10 md:w-10 p-2 group-hover:bg-red-600 bg-red-400 transition duration-300">
                                                <Icon icon={trash} className="text-white" size={25} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className='cart-footer border-t-2 flex flex-col pt-6 gap-3 border-gray-300'>
                            <div className="total-price flex justify-between items-center mb-2">
                                <p className='text-lg font-semibold text-gray-700'>{translations[language]['total']}</p>
                                <p className='text-lg font-semibold text-gray-700'>{totalPrice} ₼</p>
                            </div>
                            <div className='basket flex justify-between items-center'>

                                <button onClick={handleClearCart} className='flex gap-3 items-center'>
                                    <Icon icon={trash} size={15} className='text-gray-500' />
                                    <p className='text-gray-500 text-sm font-semibold'>{translations[language]['clearcart']}  </p>
                                </button>
                                <Link onClick={handleClose} to={`/${language}/cart`} className="orange rounded-lg">
                                    <p className="text-xl font-bold text-center py-4 px-5">{translations[language]['cart']}</p>
                                </Link>
                            </div>

                        </div>
                    </div>
                ) :
                    (showWarning &&
                        <div className='warning h-full w-full justify-center flex items-center gap-2'>
                            <Icon onClick={handleClose} icon={x} size={25} className='text-gray-500 cursor-pointer absolute top-4 right-4' />
                            <img src={warning} alt='warning' className='w-8' />
                            <p className='font-medium text-lg'>{translations[language]['carterror']}</p>
                        </div>
                    )}
            </div>
        </div>
    )
}

export default SideCart
