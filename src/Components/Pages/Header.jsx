/* eslint-disable react/prop-types */

import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import translations from "../translations.json"
import { heart } from 'react-icons-kit/feather/heart'
import Icon from 'react-icons-kit'
import { search } from 'react-icons-kit/feather/search'
import { ic_shopping_cart } from 'react-icons-kit/md/ic_shopping_cart'
import { menu } from 'react-icons-kit/feather/menu'
import { user } from 'react-icons-kit/feather/user'
import { threeHorizontal } from 'react-icons-kit/entypo/threeHorizontal'
import LoginModal from '../Modals/LoginModal'
import { x } from 'react-icons-kit/feather/x'
import SearchModal from '../Modals/SearchModal'
import axios from 'axios'
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';




const Header = ({cartItemCount}) => {
    const location = useLocation();
    const [openDrop, setOpenDrop] = useState(false);
    const [loginModalShow, setLoginModalShow] = useState(false);
    const [searchModalShow, setSearchModalShow] = useState(false);
    const [openNav, setOpenNav] = useState(false)
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'az');

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        let lastScroll = 0;

        const handleScroll = () => {
            const currentScroll = window.pageYOffset;
            const scrollUp = currentScroll < lastScroll;

            if (scrollUp) {
                gsap.to('.header', { top: 0, duration: .8, ease: 'power2.inOut' });
            } else {
                gsap.to('.header', { top: '-100%', duration: .4, ease: 'power2.inOut' });
            }

            lastScroll = currentScroll <= 0 ? 0 : currentScroll;
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


    useEffect(() => {
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage) {
            setLanguage(savedLanguage);
        }
    }, []);

    const handleLanguageChange = (newLanguage) => {
        setLanguage(newLanguage);
        localStorage.setItem('language', newLanguage);
    };

    const languages = [
        { code: 'az', label: 'AZ' },
        { code: 'en', label: 'EN' },
        { code: 'ru', label: 'RU' },
    ];

    const filteredLanguages = languages.filter(lang => lang.code !== language);

    const getCategoryFromUrl = () => {
        const parts = location.pathname.split('/');
        const languageIndex = parts.findIndex(part => ['az', 'ru', 'en'].includes(part));
        if (languageIndex >= 0) {
            const categoryIndex = languageIndex + 1;
            if (categoryIndex < parts.length && parts[categoryIndex] !== '') {
                return parts[categoryIndex];
            }
        }
        return '';
    };
    const currentCategory = getCategoryFromUrl();

    const getSlugFromUrl = () => {
        const parts = location.pathname.split('/');
        const languageIndex = parts.findIndex(part => ['az', 'ru', 'en'].includes(part));
        if (languageIndex >= 0) {
            const categoryIndex = languageIndex + 2;
            if (categoryIndex < parts.length && parts[categoryIndex] !== '') {
                return parts[categoryIndex];
            }
        }
        return '';
    }; const currentSlug = getSlugFromUrl();





    useEffect(() => {
        const handleCloseMobileNav = () => {
            setOpenNav(false);
        };

        handleCloseMobileNav();

        return () => {
            handleCloseMobileNav();
        };
    }, [location]);

 
    const handleLoginModal = () => {
        setLoginModalShow(true)
    }

    const handleSearchModal = () => {
        setSearchModalShow(true)
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleClickOutside = (e) => {
        if (e.target.closest('.mobile-navigation') === null) {
            setOpenNav(false);
        }
    };
    
    const DropToggle = () => {
        setOpenDrop(!openDrop)
    }


    //// Mobile search

    const [events, setEvents] = useState([])
    const [venues, setVenues] = useState([])
    const [inputValue, setInputValue] = useState('')

    useEffect(() => {
        if (inputValue.trim() !== '') {
            axios.get(`https://api.iticket.az/${language}/v5/events/search?client=web&q=${inputValue}`)
                .then(response => {
                    const searchEvents = response.data.response.events.map(event => event.name);
                    const searchVenues = response.data.response.venues.map(venue => venue.name);
                    setEvents(searchEvents);
                    setVenues(searchVenues);
                })
                .catch(error => {
                    console.error('Error fetching events:', error);
                });
        } else {
            setEvents([]);
            setVenues([]);
            setInputValue('');
        }
    }, [inputValue, language]);


    const clearSearchResults = (openNav) => {
        if (!openNav) {
            setEvents([]);
            setVenues([]);
            setInputValue('');
        }
    };
    useEffect(() => {
        clearSearchResults();
    }, [openNav]);


    const handleInputChange = (e) => {
        setInputValue(e.target.value);

        if (inputValue === '') {
            setEvents([]);
            setVenues([]);
        }
    };



    return (
        <div className={`header w-full bg-white shadow-md z-50 sticky`}>
            <LoginModal
                language={language}
                show={loginModalShow}
                onHide={() => { setLoginModalShow(false); }}
            />
            <SearchModal
                language={language}
                show={searchModalShow}
                onHide={() => { setSearchModalShow(false); }}
            />
            {/* { openNav &&  */}
            <div className={`mobile-overlay ${openNav ? 'left-0 opacity-100' : '-left-full opacity-20 '} bg-black top-0 z-50 fixed`}>
                <button className='absolute top-5 right-10 z-40' onClick={() => setOpenNav(false)}
                >
                    <Icon className='text-white' icon={x} size={35} />
                </button>
                <div className={`mobile-navigation  ${openNav ? 'left-0' : '-left-full '} fixed flex flex-col`}>
                    <div className='mobilenav-header pt-6 px-4'>
                        <div className='flex justify-between items-center mb-6'>
                            <Link to={`/${language}`} className="logo">
                                <svg viewBox="0 0 160 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M28.4104 40.7111V42.6294H6.7431C3.01861 42.6294 0.000244141 39.6111 0.000244141 35.8874V7.15433C0.000244141 3.42616 3.01861 0.408203 6.7431 0.408203H28.4104V2.3229C26.7358 2.34902 25.377 3.71555 25.377 5.39677C25.377 7.07514 26.7358 8.44167 28.4104 8.46412V10.3862C26.7358 10.4127 25.377 11.7751 25.377 13.4572C25.377 15.1392 26.7358 16.5049 28.4104 16.5278V18.4462C26.7358 18.4727 25.377 19.8351 25.377 21.5204C25.377 23.1988 26.7358 24.5649 28.4104 24.5874V26.5098C26.7358 26.5323 25.377 27.8984 25.377 29.5804C25.377 31.2584 26.7358 32.6286 28.4104 32.6515V34.5694C26.7358 34.5923 25.377 35.9584 25.377 37.6409C25.377 39.3221 26.7358 40.6886 28.4104 40.7111" fill="#FFDC00"></path>
                                    <path d="M124.469 30.4205C124.469 31.8278 123.327 32.9691 121.919 32.9691C120.512 32.9691 119.374 31.8278 119.374 30.4205C119.374 29.0123 120.512 27.8711 121.919 27.8711C123.327 27.8711 124.469 29.0123 124.469 30.4205Z" fill="#FFDC00"></path>
                                    <path d="M11.6436 32.3849H15.4317V17.1028L11.6436 18.3792V32.3849Z" fill="#828283"></path>
                                    <path d="M13.5391 10.6494C12.1313 10.6494 10.9897 11.7947 10.9897 13.1988C10.9897 14.6061 12.1313 15.7474 13.5391 15.7474C14.9468 15.7474 16.0885 14.6061 16.0885 13.1988C16.0885 11.7947 14.9468 10.6494 13.5391 10.6494Z" fill="#828283"></path>
                                    <g className="text-color">
                                        <path d="M38.7801 29.0307C38.2507 28.7414 37.9874 28.0471 37.9874 26.9585V20.1295H42.3205V17.1005H37.9874V13.1699L34.196 14.4087V17.1005H31.4099V20.1295H34.196V26.7222C34.196 30.1005 35.9303 31.5536 36.9625 32.116C37.845 32.6009 38.7947 32.796 39.7299 32.796C41.3858 32.796 43.0037 32.1805 44.1454 31.4524L42.1813 28.6209C41.0552 29.3422 39.5458 29.4507 38.7801 29.0307Z"></path>
                                        <path d="M48.6942 10.6494C47.2864 10.6494 46.1444 11.7947 46.1444 13.1988C46.1444 14.6061 47.2864 15.7474 48.6942 15.7474C50.102 15.7474 51.2436 14.6061 51.2436 13.1988C51.2436 11.7947 50.102 10.6494 48.6942 10.6494Z"> </path>
                                        <path d="M46.7986 32.3849H50.5867V17.1028L46.7986 18.3792V32.3849Z"></path>
                                        <path d="M61.7797 20.1442C63.5483 20.1442 65.065 21.1956 65.7744 22.6969L69.0711 20.7977C67.7005 18.1626 64.9487 16.3564 61.7797 16.3564C57.2442 16.3564 53.5573 20.043 53.5573 24.5777C53.5573 29.1087 57.2442 32.7952 61.7797 32.7952C64.9487 32.7952 67.7005 30.9895 69.0711 28.3581L65.7744 26.4548C65.065 27.9569 63.5483 29.0079 61.7797 29.0079C59.3356 29.0079 57.3495 27.0181 57.3495 24.5777C57.3495 22.134 59.3356 20.1442 61.7797 20.1442Z"></path>
                                        <path d="M85.5175 16.9143H80.2273L75.2224 22.0498V9.95801L71.4342 11.2347V32.3845H75.2224V27.4821L76.2701 26.4119L81.2787 32.3845H86.2273L78.924 23.6825L85.5175 16.9143Z"></path>
                                        <path d="M90.4653 22.6707C91.1788 21.1838 92.6878 20.1446 94.449 20.1446C96.2062 20.1446 97.7155 21.1838 98.4323 22.6707H90.4653ZM94.449 16.3564C89.9172 16.3564 86.2266 20.0429 86.2266 24.5776C86.2266 29.1082 89.9172 32.7952 94.449 32.7952C97.4788 32.7952 100.126 31.1433 101.553 28.6919L98.2596 26.796C97.4935 28.1103 96.0821 29.007 94.449 29.007C92.3955 29.007 90.6792 27.5956 90.1764 25.6964H102.585C102.634 25.3282 102.668 24.9568 102.668 24.5776C102.668 23.9209 102.585 23.2821 102.435 22.6707C101.575 19.0556 98.3241 16.3564 94.449 16.3564Z"></path>
                                        <path d="M114.333 28.6206C113.206 29.3418 111.697 29.4541 110.927 29.03C110.401 28.741 110.135 28.0504 110.135 26.9614V20.1292H114.472V17.1031H110.135V13.1729L106.347 14.4116V17.1031H103.561V20.1292H106.347V26.721C106.347 30.1035 108.078 31.5524 109.11 32.1194C109.996 32.6039 110.946 32.7953 111.881 32.7953C113.537 32.7953 115.155 32.1794 116.293 31.4512L114.333 28.6206Z"></path>
                                    </g>
                                    <path d="M138.01 28.0396C138.891 27.1898 139.332 26.089 139.332 24.7368C139.332 23.3849 138.891 22.2792 138.01 21.4188C137.129 20.558 136.115 20.1278 134.968 20.1278C133.718 20.1278 132.688 20.5482 131.879 21.3878C131.07 22.2278 130.665 23.3441 130.665 24.7368C130.665 26.1298 131.07 27.2413 131.879 28.0702C132.688 28.9 133.718 29.3147 134.968 29.3147C136.115 29.3147 137.129 28.8898 138.01 28.0396ZM143.388 32.3878H139.332V31.1894C137.959 32.2955 136.269 32.8486 134.261 32.8486C132.233 32.8486 130.47 32.08 128.975 30.5445C127.479 29.0078 126.732 27.0723 126.732 24.7368C126.732 22.4017 127.484 20.4613 128.99 18.9147C130.496 17.3678 132.253 16.5947 134.261 16.5947C136.289 16.5947 137.979 17.158 139.332 18.2845V17.0551H143.388V32.3878Z" fill="#828283"></path>
                                    <path d="M159.829 32.3876H146.215V29.7451L154.451 20.3741H146.43V17.0553H159.46V19.7594L151.224 29.0692H159.829V32.3876Z" fill="#828283"></path>
                                </svg>
                            </Link>
                            <div className="lang-switcher flex mx-10 border border-gray-300 rounded-md">
                                {filteredLanguages.map(lang => (
                                    <NavLink
                                        to={`/${lang.code}${currentCategory ? `/${currentCategory}` : ''}${currentSlug ? `/${currentSlug}` : ''}`}
                                        key={lang.code}
                                        className={`text-gray-400 text-sm font-medium px-0.5 first:border-e`}
                                        onClick={() => handleLanguageChange(lang.code)}
                                    >
                                        {lang.label}
                                    </NavLink>
                                ))}
                            </div>
                        </div>

                        <div className='form-control relative'>
                            <Icon className='absolute search-icon text-gray-400' icon={search} />
                            <input placeholder={translations[language]['search']}
                                value={inputValue}
                                onChange={handleInputChange}
                                className='search-input w-full border rounded-lg' />
                        </div>
                    </div>
                    <div className='mobilenav-body overflow-x-hidden overflow-y-scroll px-4 pt-2 flex flex-col justify-start h-full'>
                        <div className='list-group z-50 flex flex-col items-center w-full rounded-t-xl rounded-b-xl overflow-x-hidden overflow-y-scroll absolute'>

                            {events.length > 0 && (
                                <p className='list-group-item flex items-center w-full bg-slate-900  px-4 py-2 bg-dark border-black text-white font-medium'>{translations[language]['events']}</p>
                            )}
                            {events.map((event, index) => (
                                <a key={index} href='!#' className='list-group-item w-full text-sm px-4 py-2 bg-white border border-gray-400 border-t-0 hover:bg-amber-400'>{event}</a>
                            ))}


                            {venues.length > 0 && (
                                <p className='list-group-item flex items-center w-full bg-slate-900 px-4 py-2 bg-dark border-black text-white font-medium'>{translations[language]['venues']}</p>
                            )}
                            {venues.map((venue, index) => (
                                <a key={index} href='!#' className='list-group-item w-full text-sm px-4 py-2 bg-white border border-gray-400 border-t-0 hover:bg-amber-400'>{venue}</a>
                            ))}

                        </div>
                        <nav className="mobilenav-links flex flex-col">
                            <NavLink to={`/${language}`} >{translations[language]['all_events']}</NavLink>
                            <NavLink to={`/${language}/concerts`}  >{translations[language]['concerts']}</NavLink>
                            <NavLink to={`/${language}/theatre`}  >{translations[language]['theatre']}</NavLink>
                            <NavLink to={`/${language}/kids`}  >{translations[language]['concerts']}</NavLink>
                            <NavLink to={`/${language}/dream-fest-2024`}  >Dream Fest 2024</NavLink>
                            <NavLink to={`/${language}/sport`} >{translations[language]['sport']}</NavLink>
                            <NavLink to={`/${language}/jolly-joker-baku`} >Jolly Joker</NavLink>
                            <NavLink to={`/${language}/museum`} >{translations[language]['museum']}</NavLink>
                            <NavLink to={`/${language}/tourism`} >{translations[language]['tourism']}</NavLink>
                            <NavLink to={`/${language}/seminar`} >{translations[language]['seminar']}</NavLink>
                            <NavLink to={`/${language}/master-class`} >{translations[language]['master-class']}</NavLink>
                            <NavLink to={`/${language}/other`} >{translations[language]['other']}</NavLink>
                        </nav>
                    </div>
                    <div className="mobilenav-footer flex justify-between items-center shadow-md border-t py-2 px-4">
                        <a href="/">
                        {translations[language]['ticket-location']}
                        </a>
                        <a href="/">
                        {translations[language]['contact']}
                        </a>
                    </div>
                </div>
            </div>
            {/* } */}
            {/* Header Left */}
            <div className='nav wrapper z-10 mx-auto container flex items-center xl:justify-start justify-between md:py-5 md:px-8 py-2 px-4'>
                <button onClick={() => setOpenNav(true)}
                    className='text-gray-400 xl:hidden block me-12'>
                    <Icon icon={menu} size={25} />
                </button>
                <Link to={`/${language}`} className="logo">
                    <svg viewBox="0 0 160 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M28.4104 40.7111V42.6294H6.7431C3.01861 42.6294 0.000244141 39.6111 0.000244141 35.8874V7.15433C0.000244141 3.42616 3.01861 0.408203 6.7431 0.408203H28.4104V2.3229C26.7358 2.34902 25.377 3.71555 25.377 5.39677C25.377 7.07514 26.7358 8.44167 28.4104 8.46412V10.3862C26.7358 10.4127 25.377 11.7751 25.377 13.4572C25.377 15.1392 26.7358 16.5049 28.4104 16.5278V18.4462C26.7358 18.4727 25.377 19.8351 25.377 21.5204C25.377 23.1988 26.7358 24.5649 28.4104 24.5874V26.5098C26.7358 26.5323 25.377 27.8984 25.377 29.5804C25.377 31.2584 26.7358 32.6286 28.4104 32.6515V34.5694C26.7358 34.5923 25.377 35.9584 25.377 37.6409C25.377 39.3221 26.7358 40.6886 28.4104 40.7111" fill="#FFDC00"></path>
                        <path d="M124.469 30.4205C124.469 31.8278 123.327 32.9691 121.919 32.9691C120.512 32.9691 119.374 31.8278 119.374 30.4205C119.374 29.0123 120.512 27.8711 121.919 27.8711C123.327 27.8711 124.469 29.0123 124.469 30.4205Z" fill="#FFDC00"></path>
                        <path d="M11.6436 32.3849H15.4317V17.1028L11.6436 18.3792V32.3849Z" fill="#828283"></path>
                        <path d="M13.5391 10.6494C12.1313 10.6494 10.9897 11.7947 10.9897 13.1988C10.9897 14.6061 12.1313 15.7474 13.5391 15.7474C14.9468 15.7474 16.0885 14.6061 16.0885 13.1988C16.0885 11.7947 14.9468 10.6494 13.5391 10.6494Z" fill="#828283"></path>
                        <g className="text-color">
                            <path d="M38.7801 29.0307C38.2507 28.7414 37.9874 28.0471 37.9874 26.9585V20.1295H42.3205V17.1005H37.9874V13.1699L34.196 14.4087V17.1005H31.4099V20.1295H34.196V26.7222C34.196 30.1005 35.9303 31.5536 36.9625 32.116C37.845 32.6009 38.7947 32.796 39.7299 32.796C41.3858 32.796 43.0037 32.1805 44.1454 31.4524L42.1813 28.6209C41.0552 29.3422 39.5458 29.4507 38.7801 29.0307Z"></path>
                            <path d="M48.6942 10.6494C47.2864 10.6494 46.1444 11.7947 46.1444 13.1988C46.1444 14.6061 47.2864 15.7474 48.6942 15.7474C50.102 15.7474 51.2436 14.6061 51.2436 13.1988C51.2436 11.7947 50.102 10.6494 48.6942 10.6494Z"> </path>
                            <path d="M46.7986 32.3849H50.5867V17.1028L46.7986 18.3792V32.3849Z"></path>
                            <path d="M61.7797 20.1442C63.5483 20.1442 65.065 21.1956 65.7744 22.6969L69.0711 20.7977C67.7005 18.1626 64.9487 16.3564 61.7797 16.3564C57.2442 16.3564 53.5573 20.043 53.5573 24.5777C53.5573 29.1087 57.2442 32.7952 61.7797 32.7952C64.9487 32.7952 67.7005 30.9895 69.0711 28.3581L65.7744 26.4548C65.065 27.9569 63.5483 29.0079 61.7797 29.0079C59.3356 29.0079 57.3495 27.0181 57.3495 24.5777C57.3495 22.134 59.3356 20.1442 61.7797 20.1442Z"></path>
                            <path d="M85.5175 16.9143H80.2273L75.2224 22.0498V9.95801L71.4342 11.2347V32.3845H75.2224V27.4821L76.2701 26.4119L81.2787 32.3845H86.2273L78.924 23.6825L85.5175 16.9143Z"></path>
                            <path d="M90.4653 22.6707C91.1788 21.1838 92.6878 20.1446 94.449 20.1446C96.2062 20.1446 97.7155 21.1838 98.4323 22.6707H90.4653ZM94.449 16.3564C89.9172 16.3564 86.2266 20.0429 86.2266 24.5776C86.2266 29.1082 89.9172 32.7952 94.449 32.7952C97.4788 32.7952 100.126 31.1433 101.553 28.6919L98.2596 26.796C97.4935 28.1103 96.0821 29.007 94.449 29.007C92.3955 29.007 90.6792 27.5956 90.1764 25.6964H102.585C102.634 25.3282 102.668 24.9568 102.668 24.5776C102.668 23.9209 102.585 23.2821 102.435 22.6707C101.575 19.0556 98.3241 16.3564 94.449 16.3564Z"></path>
                            <path d="M114.333 28.6206C113.206 29.3418 111.697 29.4541 110.927 29.03C110.401 28.741 110.135 28.0504 110.135 26.9614V20.1292H114.472V17.1031H110.135V13.1729L106.347 14.4116V17.1031H103.561V20.1292H106.347V26.721C106.347 30.1035 108.078 31.5524 109.11 32.1194C109.996 32.6039 110.946 32.7953 111.881 32.7953C113.537 32.7953 115.155 32.1794 116.293 31.4512L114.333 28.6206Z"></path>
                        </g>
                        <path d="M138.01 28.0396C138.891 27.1898 139.332 26.089 139.332 24.7368C139.332 23.3849 138.891 22.2792 138.01 21.4188C137.129 20.558 136.115 20.1278 134.968 20.1278C133.718 20.1278 132.688 20.5482 131.879 21.3878C131.07 22.2278 130.665 23.3441 130.665 24.7368C130.665 26.1298 131.07 27.2413 131.879 28.0702C132.688 28.9 133.718 29.3147 134.968 29.3147C136.115 29.3147 137.129 28.8898 138.01 28.0396ZM143.388 32.3878H139.332V31.1894C137.959 32.2955 136.269 32.8486 134.261 32.8486C132.233 32.8486 130.47 32.08 128.975 30.5445C127.479 29.0078 126.732 27.0723 126.732 24.7368C126.732 22.4017 127.484 20.4613 128.99 18.9147C130.496 17.3678 132.253 16.5947 134.261 16.5947C136.289 16.5947 137.979 17.158 139.332 18.2845V17.0551H143.388V32.3878Z" fill="#828283"></path>
                        <path d="M159.829 32.3876H146.215V29.7451L154.451 20.3741H146.43V17.0553H159.46V19.7594L151.224 29.0692H159.829V32.3876Z" fill="#828283"></path>
                    </svg>
                </Link>
                {/* Header Middle */}
                <div className='items-center justify-start xl:flex xl:grow hidden'>
                    <div className="lang-switcher flex mx-10 border border-gray-300 rounded-md">
                        {filteredLanguages.map(lang => (
                            <NavLink
                                to={`/${lang.code}${currentCategory ? `/${currentCategory}` : ''}${currentSlug ? `/${currentSlug}` : ''}`}
                                key={lang.code}
                                className={`text-gray-400 text-sm font-medium px-0.5 first:border-e`}
                                onClick={() => handleLanguageChange(lang.code)}
                            >
                                {lang.label}
                            </NavLink>
                        ))}
                    </div>
                    <nav className='navigation flex items-center'>
                        <NavLink to={`/${language}`} end>{translations[language]['all_events']}</NavLink>
                        <NavLink to={`/${language}/concerts`} >{translations[language]['concerts']}</NavLink>
                        <NavLink to={`/${language}/theatre`} >{translations[language]['theatre']}</NavLink>
                        <NavLink to={`/${language}/kids`} >{translations[language]['kids']}</NavLink>
                        <NavLink to={`/${language}/dream-fest-2024`} >Dream Fest 2024</NavLink>
                    </nav>
                    <div className='dropdown relative lg:block hidden'>
                        <button onClick={DropToggle} type="button">
                            <Icon icon={threeHorizontal} size={22} />
                        </button>
                        {openDrop ?
                            <div id="dropdown" className='navigation-dropdown absolute z-30 shadow-md rounded-lg bg-white'>
                                <nav className='flex flex-col'>
                                    {/* <NavLink to='/hayal'>Hayal Kahvesi </NavLink> */}
                                    <NavLink to={`/${language}/sport`} >{translations[language]['sport']}</NavLink>
                                    <NavLink to={`/${language}/jolly-joker-baku`} >Jolly Joker</NavLink>
                                    <NavLink to={`/${language}/museum`} >{translations[language]['museum']}</NavLink>
                                    <NavLink to={`/${language}/tourism`} >{translations[language]['tourism']}</NavLink>
                                    <NavLink to={`/${language}/seminar`} >{translations[language]['seminar']}</NavLink>
                                    <NavLink to={`/${language}/master-class`} >{translations[language]['master-class']}</NavLink>
                                    <NavLink to={`/${language}/other`} >{translations[language]['other']}</NavLink>

                                </nav>
                            </div>
                            : null}
                    </div>
                </div>
                {/* Header End */}
                <div className='buttons flex items-center'>
                    <Link className='lg:block hidden' to={`/${language}/favorites`}>
                        <button className='p-3 flex items-center justify-center'>
                            <Icon className='text-gray-400' size={22} icon={heart} />
                        </button>
                    </Link>
                    <button onClick={() => { handleSearchModal() }} className='p-3 xl:flex hidden items-center justify-center'>
                        <Icon className='text-gray-400 text-center' size={22} icon={search} />
                    </button>
                    <Link to={`/${language}/cart`}>
                        <button className='p-3 flex items-center justify-center xl:me-8 text-gray-400'>
                            <Icon size={22} className=' text-center' icon={ic_shopping_cart} />
                            <p className='text-sm font-bold'>{cartItemCount}</p>
                        </button>
                    </Link>
                    <button onClick={() => { handleLoginModal() }} className='profile p-3 w-12 h-12 rounded-full flex items-center justify-center orange'>
                        <Icon icon={user} size={25} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Header
