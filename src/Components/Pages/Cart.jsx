/* eslint-disable react/prop-types */

import { useParams } from "react-router-dom";
import axios from "axios"
import warning from "../Images/warning.svg";
import translations from '../translations.json';
import { useEffect, useState } from "react";
import { Helmet } from 'react-helmet';
import Icon from 'react-icons-kit'
import { trash } from 'react-icons-kit/fa/trash'
import ticket1 from '../Images/1.svg'
import ticket2 from '../Images/2.svg'



const Cart = ({handleDelete, ids, timeLeft}) => {
  const { language } = useParams();
  const [carts, setCarts] = useState([])
  const [showWarning, setShowWarning] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0); 



  const formatTime = (timeLeft) => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

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



  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  return (
    <div>
      <Helmet>
        <title>Cart | iTicket.AZ</title>
      </Helmet>
      <div className="content-container lg:px-5 px-3 mx-auto pt-7 lg:pt-12 pb-6">
        <div className='relative bg-white rounded-3xl px-5 overflow-hidden'>
          {carts.length > 0 ? (
            <div className="grid lg:grid-cols-4">
              <div className="lg:col-span-3">
                <div className="cart-items py-8 md:px-5 lg:pr-10 lg:pl-7 lg:border-r border-gray-300">
                  <h1 className="page-title">{translations[language]['cart']}</h1>
                  <div className="time-limit-container h-1.5 mt-4 bg-gray-400 relative">
                                    <div style={{ width: `${(timeLeft / (15 * 60)) * 100}%` }}
                                        className="time-limit orange h-1.5"></div>
                                    <div className="max-w-16 h-8 rounded-lg absolute right-0 -top-3 py-1 px-2 bg-white shadow text-base font-semibold">
                                        {formatTime(timeLeft)}
                                    </div>
                                </div>
                  <div className="tickets-list lg:-mr-5 pb-10">
                    {carts.map(event => (
                      <div key={event.id} className="ticket-list-item  md:flex md:items-center !justify-between pb-8 border-b-2 flex flex-row mt-8">
                        <div className="flex items-center">
                          <div className="ticket_image overflow-hidden md:w-28 md:h-28 h-36 w-36 mr-2 lg:mr-4 rounded-lg flex items-center relative">
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
                            <div className="event-name md:text-2xl text-base font-medium mb-2 whitespace-normal">{event.name}</div>
                            <div>Standart</div>
                          </div>
                        </div>
                        <div className="price-label flex md:flex-row flex-col md:items-center md:gap-3 gap-0 group md:ml-0 ml-1">
                          <div className="price-block p-3 orange text-center md:rounded-xl rounded-b-none rounded-t-xl flex flex-col items-center justify-center">
                            <div className="price whitespace-nowrap text-2xl text-center">{event.min_price} ₼</div>
                            <div className="label text-gray-600 text-sm">{language === 'en' ? 'from' : ''}  {language === 'ru' ? 'от' : ''} {event.age_limit} {language === 'az' ? 'yaşlar üçün' : ''} {language === 'en' ? 'years old' : ''} {language === 'ru' ? 'лет' : ''}</div>
                          </div>
                          <button onClick={() => handleDelete(event.id)}
                            className="delete-btn flex items-center justify-center md:rounded-full rounded-t-none rounded-b-xl md:h-10 md:w-10 p-2 group-hover:bg-red-600 bg-red-400 transition duration-300">
                            <Icon icon={trash} className="text-white" size={25} />
                          </button>
                        </div>
                      </div>
                    ))}

                  </div>
                  <div>
                    <h1 className="lg:text-3xl mb-5 font-normal">Çatdırılma üsulunu seçin</h1>
                    <div className="card-options mt-6">
                      <div className="grid lg:grid-cols-3 gap-10">
                        <div className="card-option overflow-hidden shadow-md rounded-2xl flex items-center py-7 px-4 gap-4 border-2 border-gray-300 hover:border-amber-400 transition">
                          <img src={ticket1} alt="ticket" className="w-9" />
                          <p className="text-base font-semibold">Elektron bilet və ya vauçer</p>
                        </div>
                        <div className="card-option overflow-hidden shadow-md rounded-2xl flex items-center py-7 px-4 gap-4 border-2 border-gray-300 hover:border-amber-400 transition">
                          <img src={ticket2} alt="ticket" className="w-9" />
                          <p className="text-base font-semibold">Şəhərin satış məntəqələrində</p>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="cart-sidebar py-7 px-8">
                  <div className="mb-10">
                    <p className="text-xl text-gray-800 mb-2">Çatdırılma üsulu</p>
                    <p className="text-xl font-bold">Elektron bilet və ya vauçer (PDF formatında)</p>
                  </div>
                  <div className="form mb-10">
                    <p className="text-xl text-gray-800 mb-2">İstifadəçi Məlumatları</p>
                    <div className="form-group">
                      <form>
                        <input type="text" placeholder="Ad" className="mb-2 w-full py-3 px-4 border border-gray-300 rounded-xl outline-none" />
                        <input type="text" placeholder="Soyad" className="mb-2 w-full py-3 px-4 border border-gray-300 rounded-xl outline-none" />
                        <input type="number" placeholder="Telefon nömrəsi" className="mb-2 w-full py-3 px-4 border border-gray-300 rounded-xl outline-none" />
                        <input type="email" placeholder="E-poçt" className="mb-2 w-full py-3 px-4 border border-gray-300 rounded-xl outline-none" />
                      </form>
                    </div>
                  </div>
                  <div className="mb-10">
                    <p className="text-xl font-medium text-gray-800 mb-2">Promokod</p>
                    <span className="text-blue-600">Promo kodum var</span>
                  </div>
                  <div className="last-price flex justify-between items-center text-xl color-gray-500 mb-2">
                    <p>{translations[language]['total']}</p>
                    <p>{totalPrice} ₼</p>
                  </div>
                  <div className="mt-5 flex">
                    <input type="checkbox" className="outline-none border-blue-800" />
                    <p className="ml-4">Şərtləri və qaydaları qəbul edirəm.</p>
                  </div>
                  <button className="mt-5 orange rounded-lg w-full">
                    <p className="text-xl font-bold text-center py-4 px-5">{translations[language]['order']}</p>
                  </button>
                </div>
              </div>
            </div>
          ) :
            (showWarning &&
              <div className="py-8">
                <h1 className="page-title">{translations[language]['cart']}</h1>
                <div className='warning mt-10 flex items-center gap-2'>
                  <img src={warning} alt='warning' className='w-8' />
                  <p className='font-medium text-lg'>{translations[language]['carterror']}</p>
                </div>
              </div>
            )}
        </div>

      </div>
    </div>
  )
}

export default Cart