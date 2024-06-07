/* eslint-disable react/prop-types */

import Icon from 'react-icons-kit'
import { heart } from 'react-icons-kit/feather/heart'
import { share } from 'react-icons-kit/feather/share'
import { ic_shopping_cart } from 'react-icons-kit/md/ic_shopping_cart'
import translations from '../translations.json'
import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios';
import venuesvg from '../Images/venue.svg'
import datesvg from '../Images/date.svg'
import agesvg from '../Images/age.svg'
import localesvg from '../Images/locale.svg'
import currencysvg from '../Images/currency.svg'
import infosvg from '../Images/info.svg'
import ticketssvg from '../Images/tickets.svg'
import noposter from '../Images/no-app-poster.png'
import Lightbox from 'yet-another-react-lightbox';
import "yet-another-react-lightbox/styles.css";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';



const EventDetail = ({ category, carts, addToCarts }) => {
    const { language } = useParams()
    const [title1, setTitle1] = useState(true);
    const [title2, setTitle2] = useState(false);
    const [events, setEvents] = useState([]);
    const [venues, setVenues] = useState([]);
    const [eventsSugg, setEventsSugg] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [favoriteActive, setFavoriteActive] = useState(false)
    const [isOpen, setIsOpen] = useState(false);
    const [cartStatus, setCartStatus] = useState({});


    //Favorites
    const addToFavorites = (eventId) => {
        if (favorites.includes(eventId)) {
            setFavorites(prevFavorites => prevFavorites.filter(id => id !== eventId));
            setFavoriteActive(false);
        } else {
            setFavorites(prevFavorites => [...prevFavorites, eventId]);
            setFavoriteActive(true);
        }
    };

    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(storedFavorites);
    }, []);

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
        const id = JSON.parse(localStorage.getItem('id'));
        if (id && favorites.includes(id)) {
            setFavoriteActive(true);
        }
    }, [favorites]);



    //Cart 
    useEffect(() => {
        const id = JSON.parse(localStorage.getItem('id'));
        const updatedCartStatus = {};
        carts.forEach(eventId => {
            updatedCartStatus[eventId] = eventId === id;
        });
        setCartStatus(updatedCartStatus);
    }, [carts]);
    ///// 

    const title1Toggle = () => {
        setTitle1(true);
        setTitle2(false);
    }
    const title2Toggle = () => {
        setTitle1(false);
        setTitle2(true);
    }


    const toggleLightbox = () => {
        setIsOpen(!isOpen);
    };



    const [locations, setLocations] = useState([]);

    useEffect(() => {
        const venueLocations = venues.map(venue => ({
            map_lat: venue.map_lat,
            map_lng: venue.map_lng
        }));
        setLocations(venueLocations);
    }, [venues]);



    useEffect(() => {
        if (locations.length > 0) {
            const map = L.map('map').setView([locations[0].map_lat, locations[0].map_lng], 15);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);
            locations.forEach(location => {
                L.marker([location.map_lat, location.map_lng]).addTo(map);
            });
            return () => {
                map.remove();
            };
        }
    }, [locations]);


    const id = JSON.parse(localStorage.getItem('id'));
    const page = JSON.parse(localStorage.getItem('page'));
    useEffect(() => {
        const fetchEventDetail = async () => {
            try {
                let url = `https://api.iticket.az/${language}/v5/events?client=web`;
                let urlSuggestion = `https://api.iticket.az/${language}/v5/events?client=web`;


                if (id) {
                    url += `&event_ids[]=${id}`
                }

                if (category) {
                    urlSuggestion += `&category_slug=${category}`
                }


                if (page) {
                    urlSuggestion += `&page=${page}`
                }


                window.scrollTo(0, 0);
                const response = await axios.get(url);
                const responseSuggestion = await axios.get(urlSuggestion);

                setVenues(response.data.response.venues);
                setEvents(response.data.response.events.data);
                setEventsSugg(responseSuggestion.data.response.events.data);


            } catch (error) {
                console.error('Error fetching event detail:', error);
            }
        };
        fetchEventDetail();
    }, [language, category, id, page]);

    const handleEventClick = (eventData) => {
        const { id } = eventData;
        localStorage.setItem('id', JSON.stringify(id));
    };


    return (
        <div className="event-detail">

            {events && events.length > 0 && events.map(event => (
                <div key={event.id}>

                    <div className="event-image mb-10 lg:p-5 overflow-hidden mx-auto relative w-full">
                        {
                            event.poster_wide_url &&
                            <img className="wide-bg lg:block absolute object-cover hidden w-full rounded-2xl shadow-md" alt='posterwide'
                                src={event.poster_wide_url}
                            />
                        }
                        <img className="wide-bg lg:block hidden w-full rounded-2xl shadow-md" alt='posterwide'
                            src={event.poster_wide_bg_url}
                        />  
                        <img className='lg:hidden block w-full absolute object-cover' alt='poster' src={event.poster_url} />
                        <img className='lg:hidden block w-full' alt='poster' src={event.poster_bg_url} />
                        <div className='info absolute lg:left-0 lg:right-0 lg:bottom-5 lg:py-10 lg:px-5 xl:py-20 xl:px-0'>
                            <div className='content-container lg:flex hidden items-center justify-start gap-3 lg:px-5'>
                                <span className={`btn text-xl lg:py-4 lg:px-6  z-20 orange rounded-full py-2 px-4 font-bold`}>
                                    <span className="price whitespace-nowrap">{language === 'en' ? 'from' : ''}  {language === 'ru' ? 'от' : ''} {event.min_price} ₼</span>{language === 'az' ? '-dan' : ''}
                                </span>
                                <button onClick={() => addToFavorites(event.id)}
                                    className={`${favoriteActive ? 'favorite_active' : ' '} p-5  group shadow-md hover:bg-white border-white hover:border-amber-400 transition duration-300 flex items-center justify-center lg:h-16 lg:w-16 lg:border-4 rounded-full`}>
                                    <Icon className={`${favoriteActive ? 'favorite_active' : ' '} text-white group-hover:text-amber-400 transition`} size={22} icon={heart} />
                                </button>
                                <button className='p-5 flex shadow-md items-center border-white justify-center group hover:bg-white hover:border-amber-400 transition duration-300 lg:h-16 lg:w-16 lg:border-4 rounded-full'>
                                    <Icon className='text-white group-hover:text-amber-400 transition' size={24} icon={share} />
                                </button>
                                <button onClick={() => addToCarts(event.id)}
                                    className={`${cartStatus[event.id] ? 'cart_active' : ' '} p-5  group shadow-md hover:bg-white border-white hover:border-amber-400 transition duration-300 flex items-center justify-center lg:h-16 lg:w-16 lg:border-4 rounded-full`}>
                                    <Icon className={`${cartStatus[event.id] ? 'cart_active' : ' '} text-white group-hover:text-amber-400 transition`} size={27} icon={ic_shopping_cart} />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='content-container flex flex-col relative px-3 lg:px-0'>
                        <button onClick={() => addToCarts(event.id)} className={`${cartStatus[event.id] ? 'cartmobile_active' : ' '} z-40 group p-5 gap-3 mb-6 bg-white lg:hidden flex shadow-md items-center border-amber-400 justify-center group border-4 rounded-full`}>
                        <p className={`${cartStatus[event.id] ? 'text-white add-to-cart' : ' '} font-bold text-lg text-black`}>
                            {cartStatus[event.id] ? translations[language]['added-to-cart'] : translations[language]['add-to-cart']}
                            </p>
                         <Icon className={`${cartStatus[event.id] ? 'cartmobile_active' : ' '} text-black`} size={30} icon={ic_shopping_cart} />
                        </button>
                        <div className='event-chips grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-11 md:grid order-4 lg:order-1'>
                            <div className='info-block flex items-center rounded-3xl p-2 bg-white shadow-xl'>
                                <span className="icon z-20 w-20 h-20 flex justify-center items-center">
                                    <img src={venuesvg} />
                                </span>
                                <span className="icon z-10 -ml-12 w-20 h-20 flex justify-center items-center">
                                    <img src={datesvg} />
                                </span>
                                <div className="flex-1 pl-1">
                                    <div className="title !mb-0 flex flex-col font-medium text-lg">
                                        <span> {translations[language]['location']}</span>
                                        <span> {translations[language]['date']}</span>
                                    </div>
                                </div>
                            </div>
                            <div className='info-block flex items-center rounded-3xl p-2 bg-white shadow-xl'>
                                <span className="icon z-20 w-20 h-20 flex justify-center items-center">
                                    <img src={agesvg} />
                                    <span className="absolute text-white font-medium">6+</span>
                                </span>
                                <span className="icon z-10 -ml-12 w-20 h-20 flex justify-center items-center">
                                    <img src={localesvg} />
                                </span>
                                <div className="flex-1 pl-1">
                                    <div className="title !mb-0 flex flex-col font-medium text-lg">
                                        <span> {translations[language]['language']}</span>
                                        <span> {translations[language]['age_restriction']}</span>
                                    </div>
                                </div>
                            </div>
                            <div className='info-block flex items-center rounded-3xl p-2 bg-white shadow-xl'>
                                <span className="icon z-20 w-20 h-20 flex justify-center items-center">
                                    <img src={currencysvg} />
                                </span>
                                <span className="icon z-10 -ml-12 w-20 h-20 flex justify-center items-center">
                                    <img src={ticketssvg} />
                                </span>
                                <div className="flex-1 pl-1">
                                    <div className="title !mb-0 flex flex-col font-medium text-lg">
                                        <span> {translations[language]['price']}</span>
                                        <span> {translations[language]['about_tickets']}</span>
                                    </div>
                                </div>
                            </div>
                            <div className='info-block flex items-center rounded-3xl p-2 bg-white shadow-xl'>
                                <span className="icon z-20 w-20 h-20 flex justify-center items-center">
                                    <img src={infosvg} />
                                </span>

                                <div className="flex-1 pl-1">
                                    <div className="title !mb-0 flex flex-col font-medium text-lg">
                                        <span> {translations[language]['about_events']}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='detail grid grid-cols-1 lg:grid-cols-12 gap-10 lg:pt-10 order-4'>
                            <div className='lg:col-span-7'>
                                <div className='list'>
                                    <div className='list-header gap-5 mb-5 flex md:flex-row flex-col'>
                                        <button onClick={title1Toggle} className={`list-title bg-white grow ${title1 ? 'active' : ''} rounded-3xl`}>
                                            <h2 className='p-5 text-center'>
                                                <p className='text-xl font-bold '>
                                                {translations[language]['about']}

                                                </p>
                                            </h2>
                                        </button>
                                        <button onClick={title2Toggle} className={`list-title-2 bg-white ${title2 ? 'active' : ''} grow rounded-3xl`}>
                                            <h2 className='p-5 text-center'>
                                                <p className='text-xl font-bold '>
                                                    {translations[language]['yas/dil']}
                                                </p>
                                            </h2>
                                        </button>
                                    </div>
                                    <div className='list-body flex flex-col grow gap-5 overflow-hidden mb-8 md:mb-0 h-full'>
                                        <div className='list-content flex h-full min-h-72 p-5 bg-white rounded-3xl md:overflow-hidden'>
                                            {title1 &&
                                                <div className='md:h-full overflow-auto w-full'>
                                                    <p className='mb-4'>“Heç vaxt”, “Ömrün baharları”, “Dəşti Təsnifi” kimi mahnıları ilə gənclərin sevimlisinə çevrilən Joseph Abbas “XG Club Cafe”də sevənləri ilə görüşəcək. Sizi gözəl musiqilərdən zövq almağa dəvət edirik.</p>
                                                    <p className='mb-4'></p>
                                                    <p className='mb-4'></p>
                                                    <p className='mb-4'></p>
                                                </div>
                                            }
                                            {title2 &&
                                                <div className='md:h-full overflow-auto w-full'>
                                                    <p className='mb-4'>{event.age_limit} / Azərbaycanca</p>
                                                    <p className='mb-4'></p>
                                                    <p className='mb-4'></p>
                                                    <p className='mb-4'></p>
                                                </div>
                                            }

                                        </div>
                                    </div>
                                </div>
                                <div className='light-box mt-5'>
                                    <div onClick={toggleLightbox} className='light-box-img max-w-32 max-h-32 rounded-3xl overflow-hidden  cursor-pointer relative'>
                                        <img src={event.poster_url} alt='gallery' className='object-cover absolute' />
                                        <img src={event.poster_bg_url} alt='gallery' className='object-contain' />
                                        <Lightbox
                                            slides={[{ src: event.poster_bg_url, caption: 'Image Caption' }]}
                                            open={isOpen}
                                            close={toggleLightbox}
                                            backdropCloseable={true}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='lg:col-span-5'>
                                <div className='artist-image relative'>
                                    <img src={event.poster_url} alt='artistimage' className='h-full object-cover absolute object-bottom w-full ' />
                                    <img src={event.poster_bg_url} alt='artistimage' className='h-full object-contain object-bottom w-full' />

                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            ))}
            <div className='content-container flex flex-col relative px-3 lg:px-0'>
                <div className='venue-detail'>
                    <hr className='my-10' />
                    <div className='venue'>
                        <h1 className='venue-title mb-8 text-3xl font-bold'>{translations[language]['locationplace']}</h1>
                        <div className='lg:grid-cols-12 my-10 grid grid-cols-1 gap-10 h-full'>
                            <div className="lg:col-span-7 z-0 flex min-h-72">
                                <div id='map' className="flex-1 map lg:h-full rounded-3xl">
                                </div>
                            </div>
                            {venues && venues.length > 0 && venues.map(venue => (

                                <div key={venue.id} className='lg:col-span-5 bg-white flex flex-col venue-card py-4 px-6 shadow-md rounded-3xl'>
                                    <div className="flex-1">
                                        <div className="venue-name text-2xl font-bold mb-2">
                                            <p >{venue.name} </p>
                                        </div>
                                        <div className="venue-address text-gray-500 mb-6 text-xl font-medium w-3/5">Səməd Vurğun küç., 36</div>
                                        <div className="venue-phones">
                                            <div className="title mb-1 font-bold text-xl">Mobil</div>
                                            <p className='text-gray-500'>
                                                {venue.phone || venue.mobile}
                                            </p>
                                        </div>
                                    </div>
                                    <a href={`https://maps.google.com/maps?q=${venue.map_lat},${venue.map_lng}`} target="_blank" className="btn mx-auto mt-2">
                                        <button className='orange rounded-full text-black text-xl font-bold py-4 px-12'>
                                            İstiqamət
                                        </button>
                                    </a>

                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>

            <div className="Suggestions content-container lg:px-5 px-3 mx-auto pt-7 lg:pt-8 pb-3">
                <h1 className="page-title !text-3xl !font-extrabold">{translations[language]['suggestions']}</h1>
            </div>
            <div className='events-list lg:pt-10 pt-5'>
                <div className='content-container lg:px-5 px-6'>
                    <div>
                        {events.length > 0 ? (
                            <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-10'>
                                {eventsSugg.slice(0, 7).map(event => (
                                    id !== event.id && (
                                        <Link onClick={() => handleEventClick(event)} key={event.id} to={`/${language}/${event.category_slug}/${event.slug}`} className='event-list-item'>
                                            <div className='relative'>
                                                <div className='image'>
                                                    <img
                                                        src={noposter}
                                                        alt='bg'
                                                        className='bg'
                                                        onLoad={(e) => { e.target.src = event.poster_bg_url; }}
                                                    />
                                                    <img
                                                        src={noposter}
                                                        alt='pic'
                                                        className='op'
                                                        onLoad={(e) => { e.target.src = event.poster_url; }}

                                                    />
                                                    <span className={`btn text-lg lg:py-2 lg:px-4 absolute lg:right-7 lg:bottom-7 z-20 orange rounded-full py-2 px-4 font-bold bottom-5 right-5`}>
                                                        <span className="price whitespace-nowrap">{language === 'en' ? 'from' : ''}  {language === 'ru' ? 'от' : ''}  {event.min_price} ₼</span>{language === 'az' ? '-dan' : ''}
                                                    </span>
                                                </div>
                                                <div className='info lg:p-8 lg:text-xl'>
                                                    <p className="event-name lg:pt-2 text-white">
                                                        {event.name}
                                                    </p>
                                                    <div className="flex w-full items-center flex-1">
                                                        <div className="event-date">
                                                            {new Date(event.event_starts_at).toLocaleDateString(language === 'az' ? 'tr-TR' : language === 'en' ? 'en-US' : 'ru-RU',
                                                                { month: 'long', day: 'numeric', year: 'numeric' })}
                                                        </div>
                                                        <div className="venue-name ms-1">
                                                            • {event.venues && event.venues.length > 0 ? event.venues[0].name : ""}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    )
                                ))}
                            </div>
                        ) : ''}
                    </div>
                </div>

            </div>


        </div>
    )
}

export default EventDetail