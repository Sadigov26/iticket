/* eslint-disable react/prop-types */
import axios from 'axios';
import { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import { x } from 'react-icons-kit/feather/x'
import translations from "../translations.json"

import Icon from 'react-icons-kit';
import { Link } from 'react-router-dom';



const SearchModal = ({ show, onHide, language }) => {
    const [events, setEvents] = useState([])
    const [venues, setVenues] = useState([])
    const [inputValue, setInputValue] = useState('')

    useEffect(() => {
        if (inputValue.trim() !== '') {
            axios.get(`https://api.iticket.az/${language}/v5/events/search?client=web&q=${inputValue}`)
                .then(response => {
                    setEvents(response.data.response.events);
                    setVenues(response.data.response.venues.data);
                })
                .catch(error => {
                    console.error('Error fetching events:', error);
                });
        } else {
            setEvents([]);
            setVenues([]);
        }
    }, [inputValue, language]);

    const handleClose = () => {
        onHide();
        setEvents([]);
        setVenues([])
        setInputValue('')
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleLinkClick = () => {
        handleClose(); 
    };
    return (

        <Modal
            show={show}
            onHide={onHide}
            backdropClassName="custom-backdrop"
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            className='modal-search'
        >
            <div className='modal-body relative p-12 bg-yellow border-0 overflow-hidden'>
                <div>
                    <input value={inputValue}
                        onChange={handleInputChange}
                        className='w-full border rounded-2xl py-5 outline-none pe-4 ps-14'
                        placeholder={translations[language]['search']} />
                    <button className='top-16 right-2 sm:block absolute' onClick={handleClose}>
                        <Icon className='text-white' icon={x} size={35} />
                    </button>
                </div>
                <div className='list-group flex flex-col items-center w-full mt-6 rounded-t-xl rounded-b-xl overflow-x-hidden'>

                    {events && events.length > 0 && (
                        <p className='list-group-item flex items-center w-full bg-slate-900  px-4 py-2 bg-dark border-black text-white font-medium'>{translations[language]['events']}</p>
                    )}
                    {events && events.map((event) => (
                        <Link onClick={handleLinkClick}
                        key={events.id} 
                        to={`/`}
                            className='list-group-item w-full text-sm px-4 py-2 bg-white border border-gray-400 border-t-0 hover:bg-amber-400'>{event.name}</Link>
                    ))}


                    {venues && venues.length > 0 && (
                        <p className='list-group-item flex items-center w-full bg-slate-900 px-4 py-2 bg-dark border-black text-white font-medium'>{translations[language]['venues']}</p>
                    )}
                    {venues && venues.map((venue, index) => (
                        <Link key={index} to={'/'} className='list-group-item w-full text-sm px-4 py-2 bg-white border border-gray-400 border-t-0 hover:bg-amber-400'>{venue}</Link>
                    ))}

                </div>

            </div>

        </Modal>

    )
}

export default SearchModal