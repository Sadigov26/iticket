import { Link, useParams } from "react-router-dom"
import warning from "../Images/warning.svg"
import translations from '../translations.json'
import { useEffect, useState } from "react"
import axios from "axios"
import noposter from '../Images/no-app-poster.png'
import { Helmet } from 'react-helmet';



const Favorites = () => {
  const  {language} = useParams()
  const [favorites, setFavorites] = useState([])
  const [ids, setIds] = useState([]);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setIds(storedFavorites);
  }, []);
  
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        let url = `https://api.iticket.az/${language}/v5/events?client=web`;

        if (ids && ids.length > 0) {
          const idString = ids.join('&event_ids[]=');
          url += `&event_ids[]=${idString}`;
        } else {
          setFavorites([]);
          return;
        }

        const response = await axios.get(url);
        setFavorites(response.data.response.events.data);
      } catch (error) {
        console.error('Error fetching event detail:', error);
      } finally {
        setTimeout(() => setShowWarning(true), 1000);
      }
    };

    window.scrollTo(0, 0);
    fetchFavorites();
  }, [language, ids]);

const handleEventClick = (eventData) => {
  const {id} = eventData;    
  localStorage.setItem('id', JSON.stringify(id));
};

  return (
    <div>
       <Helmet>
        <title>Favorites | iTicket.AZ</title>
      </Helmet>
       <div className="content-container px-5 mx-auto pt-7 lg:pt-9 pb-6">
        <h1 className="page-title">{translations[language]['favorites']}</h1>
        {favorites.length > 0 ? (
              <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-10 mt-16'>
                {favorites.map(event => (
                  // <Link key={event.id} to={`/${language}/${event.category_slug}/${event.slug}${(page > 1) ? `/${page}` : ''}`} className='event-list-item'>
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
                ))}
              </div>
            ) : (showWarning && <div className='warning mt-7 relative flex items-center gap-2'>
              <img src={warning} alt='warning' className='w-8' />
              <p className='font-medium text-lg'>  {translations[language]['fetcherror']}</p>
            </div>
            )}
      
      </div>
    </div>
  )
}

export default Favorites
