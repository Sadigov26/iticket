import { useCallback, useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom';
import translations from '../translations.json'
import axios from 'axios';
import Select from 'react-select'
import DatePicker from "react-multi-date-picker";
import noposter from '../Images/no-app-poster.png'
import warning from "../Images/warning.svg"
import { RangeSlider } from 'rsuite';
import { Helmet } from 'react-helmet';

import 'rsuite/RangeSlider/styles/index.css';



const EventPage = () => {

  const { category, language } = useParams();
  const navigate = useNavigate()

  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [minPriceAPI, setMinPriceAPI] = useState(null)
  const [maxPriceAPI, setMaxPriceAPI] = useState(null);
  const [pageTitle, setPageTitle] = useState('');
  const [showWarning, setShowWarning] = useState(false);


  const getVenueName = (language) => {
    switch (language) {
      case 'az':
        return "Məkan seçin";
      case 'en':
        return "Choose venue";
      case 'ru':
        return "Выберите местоположение";
      default:
        return "Məkan seçin";
    }
  }
  const venueTitle = getVenueName(language);
  const getDateName = (language) => {
    switch (language) {
      case 'az':
        return "Tarix aralığını seçin";
      case 'en':
        return "Choose date range";
      case 'ru':
        return "Выберите диапазон дат";
      default:
        return "Tarix aralığını seçin";
    }
  }

  const dateTitle = getDateName(language);


  const getPriceName = (language) => {
    switch (language) {
      case 'az':
        return `Qiymət ${minPrice} ₼-dan ${maxPrice} ₼-dək`;
      case 'en':
        return `Price from ${minPrice} ₼ to ${maxPrice}`;
      case 'ru':
        return `Цена от ${minPrice} ₼ до ${maxPrice} ₼`;
      default:
        return `Qiymət ${minPrice} ₼-dan ${maxPrice} ₼-dək`;
    }
  }

  const priceTitle = getPriceName(language);


  const fetchData = useCallback(async (pageNumber, category, startDate, endDate, venueId, minPrice, maxPrice) => {
    try {
      setLoading(true);
      let url = `https://api.iticket.az/${language}/v5/events?client=web`;
      if (category) {
        url += `&category_slug=${category}`
      }

      if (pageNumber > 1) {
        url += `&page=${pageNumber}`
      }

      if (startDate) {
        url += `&start_date=${formatDate(startDate)}`;
      }

      if (endDate) {
        url += `&end_date=${formatDate(endDate)}`;
      }


      if (venueId) {
        url += `&venue_id=${venueId}`;
      }


      if ((minPrice !== null || maxPrice !== null) && (minPrice !== minPriceAPI || maxPrice !== maxPriceAPI)) {
        url += `&min_price=${minPrice}&max_price=${maxPrice}`;
      }

      const response = await axios.get(url);

      setMinPriceAPI(Number(response.data.response.prices.min));
      setMaxPriceAPI(Number(response.data.response.prices.max));

      if ((minPrice === null) && (maxPrice === null)) {
        setMinPrice(Number(response.data.response.prices.min));
        setMaxPrice(Number(response.data.response.prices.max));
      }

      const venueNames = response.data.response.venues.map(venue => ({ value: venue.id, label: venue.name }));
      setPageTitle(response.data.response.category.name)
      setVenues(venueNames);

      if (pageNumber === 1) {
        setEvents(response.data.response.events.data);
      } else {
        setEvents(prevEvents => [...prevEvents, ...response.data.response.events.data]);
      }

      setHasMore(response.data.response.events.data.length > 0);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setTimeout(() => setShowWarning(true), 1000);
    }
  }, [minPriceAPI, maxPriceAPI, language]);


  useEffect(() => {
    fetchData(page, category, startDate, endDate, selectedVenue ? selectedVenue.value : null, minPrice, maxPrice);
  }, [fetchData, page, category, startDate, endDate, selectedVenue, minPrice, maxPrice]);



  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };


  const handleVenueChange = selectedOption => {
    setSelectedVenue(selectedOption);
    setPage(1)
    const venueId = selectedOption ? selectedOption.value : null;
    let url = '';

    if (startDate && endDate) {
      if (url !== '') {
        url += '&';
      } else {
        url += '?';
      }
      url += `start_date=${formatDate(startDate)}&end_date=${formatDate(endDate)}`;
    } else if (startDate) {
      if (url !== '') {
        url += '&';
      } else {
        url += '?';
      }
      url += `start_date=${formatDate(startDate)}`;
    }

    if (venueId) {
      if (url !== '') {
        url += '&';
      } else {
        url += '?';
      }
      url += `venue_id=${venueId}`;
    }

    if ((minPrice !== null || maxPrice !== null) && (minPrice !== minPriceAPI || maxPrice !== maxPriceAPI)) {
      if (url !== '') {
        url += '&';
      } else {
        url += '?';
      }
      url += `min_price=${minPrice}&max_price=${maxPrice}`;
    }


    navigate(url);
  };

  const handleDateChange = (dates) => {
    let url = '';
    if (selectedVenue && selectedVenue.value) {
      if (url !== '') {
        url += '&'
      }
      else {
        url += '?';
      }
      url += `venue_id=${selectedVenue.value}`;
    }

    if ((minPrice !== null || maxPrice !== null) && (minPrice !== minPriceAPI || maxPrice !== maxPriceAPI)) {
      if (url !== '') {
        url += '&';
      } else {
        url += '?';
      }
      url += `min_price=${minPrice}&max_price=${maxPrice}`;
    }

    if (dates.length === 1) {
      if (url !== '') {
        url += '&'
      }
      else {
        url += '?';
      }
      url += `start_date=${formatDate(dates[0])}`;
      setStartDate(dates[0]);
      setEndDate(null);
    } else if (dates.length === 2) {
      if (url !== '') {
        url += '&'
      }
      else {
        url += '?';
      }
      url += `start_date=${formatDate(dates[0])}&end_date=${formatDate(dates[1])}`;
      setStartDate(dates[0]);
      setEndDate(dates[1]);
    }
    navigate(url);
  };

  const formatDate = date => {
    const formattedDate = new Date(date).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return formattedDate.split('.').join('.');
  };

  useEffect(() => {
    setStartDate(null)
    setEndDate(null)
    setSelectedVenue(category);
    setPage(1)
    setMaxPriceAPI(null)
    setMinPriceAPI(null)
    setMaxPrice(null)
    setMinPrice(null)
    window.scrollTo(0, 0);
  }, [category, language]);



  const handleSliderChange = (values) => {
    const [minValue, maxValue] = values;
    if (minPrice !== null && maxPrice !== null) {
      setMinPrice(minValue);
      setMaxPrice(maxValue);
      let url = '';

      if (startDate && endDate) {
        if (url !== '') {
          url += '&';
        } else {
          url += '?';
        }
        url += `start_date=${formatDate(startDate)}&end_date=${formatDate(endDate)}`;
      } else if (startDate) {
        if (url !== '') {
          url += '&';
        } else {
          url += '?';
        }
        url += `start_date=${formatDate(startDate)}`;
      }

      if (selectedVenue && selectedVenue.value) {
        if (url !== '') {
          url += '&';
        } else {
          url += '?';
        }
        url += `venue_id=${selectedVenue.value}`;
      }

      if (minValue !== null || maxValue !== null) {
        if (url !== '') {
          url += '&';
        } else {
          url += '?';
        }
        url += `min_price=${minValue}&max_price=${maxValue}`;
      }

      navigate(url);
    }
  };


  const handleEventClick = (eventData) => {
    const { id } = eventData;
    localStorage.setItem('id', JSON.stringify(id));
  };
  const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div>
      <Helmet>
        <title>{`${capitalizedCategory} | iTicket.AZ`}</title>
      </Helmet>
      <div className="content-container lg:px-5 px-3 mx-auto pt-7 lg:pt-12 pb-6">
        <h1 className="page-title">{pageTitle} </h1>
      </div>
      <div className="content-container concert-filter mx-auto pt-7 px-3 lg:px-0 lg:pt-12 pb-6">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className='form-control flex items-center shadow-md'>
            <Select classNamePrefix="react-select"
              placeholder={venueTitle}
              className='react-select-container z-20 w-full text-start'
              options={venues}
              onChange={handleVenueChange}
              value={selectedVenue} />
          </div>
          <div className='form-control flex items-center shadow-md'>
            <DatePicker
              value={[startDate, endDate]}
              onChange={handleDateChange}
              format="DD MMM YYYY"
              maxDate={endDate}
              multiple={false}
              placeholder={dateTitle}
              containerClassName='DatePicker myDatePicker'
              inputClass='DatePicker'
              minDate={new Date()}
              range
              dateSeparator=" - "
            />
          </div>
          <div className='form-control relative flex items-center shadow-md flex-col'>
            <input type='text' className='w-full text-center price-sorter'
              placeholder={
                (minPrice === null || maxPrice === null) ? '' : priceTitle
              }
              readOnly />
            {(minPrice !== null || maxPrice !== null) &&
              <RangeSlider className='w-full absolute -bottom-5'
                min={minPriceAPI}
                max={maxPriceAPI}
                value={[minPrice, maxPrice]}
                onChange={handleSliderChange} />}
          </div>
        </div>
      </div>
      <div className='events-list lg:pt-10 pt-5'>
        <div className='content-container lg:px-5 px-6'>
          <div>
            {events.length > 0 ? (
              <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-10'>
                {events.map(event => (
                  // <Link key={event.id} to={`/${language}/${event.category_slug}/${event.slug}${(page > 1) ? `/${page}` : ''}`} className='event-list-item'>
                  <Link onClick={() => handleEventClick(event)}
                    key={event.id}
                    to={`/${language}/${event.category_slug}/${event.slug}`}
                    className='event-list-item'>
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
        <div className='mt-10 w-full flex justify-center'>
          {loading && <button className='load-more orange mx-auto text-xl lg:py-4 lg:px-6 rounded-full font-bold py-2 px-4 cursor-none'>
            {translations[language]['loading']}
          </button>}

          {hasMore && !loading && (
            <button onClick={handleLoadMore} className='load-more orange mx-auto text-xl lg:py-4 lg:px-6 rounded-full font-bold py-2 px-4'>
              {translations[language]['loadmore']}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default EventPage