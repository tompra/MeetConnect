/* eslint-disable react-hooks/exhaustive-deps */
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import EventList from './EventList';
import CitySearch from './CitySearch';
import NumberOfEvents from './NumberOfEvents';
import Loading from './Loading';
import CityEventCharts from './CityEventsChart';
import EventGenresChart from './EventGenresChart';
import { useEffect, useState } from 'react';
import { getEvents, extractLocations } from './api';
import { InfoAlert, WarningAlert, DangerAlert } from './Alert';

const App = () => {
    const [events, setEvents] = useState([]);
    const [currentNOE, setCurrentNOE] = useState(32);
    const [allLocations, setAllLocations] = useState([]);
    const [currentCity, setCurrentCity] = useState('See all cities');
    const [infoAlert, setInfoAlert] = useState('');
    const [warningAlert, setWarningAlert] = useState('');
    const [dangerAlert, setDangerAlert] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const allEvents = await getEvents();
            const filteredEvents =
                currentCity === 'See all cities'
                    ? allEvents
                    : allEvents.filter(
                          (event) =>
                              event.location && event.location === currentCity
                      );

            setEvents(filteredEvents.slice(0, currentNOE));
            setAllLocations(extractLocations(allEvents));
            setLoading(false);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    useEffect(() => {
        let dangerTxt;
        if (navigator.onLine) {
            dangerTxt = '';
        } else {
            dangerTxt = 'You are offline. Events must not be updated';
            setDangerAlert(dangerTxt);
        }
        fetchData();
    }, [currentCity, currentNOE]);

    return (
        <div className='App container-fluid pt-2 '>
            <div className='row d-flex flex-column justify-content-center align-items-center'>
                {loading ? (
                    <Loading />
                ) : (
                    <>
                        <div className='col-md-4 alerts-container'>
                            {infoAlert.length ? (
                                <InfoAlert text={infoAlert} />
                            ) : null}
                            {warningAlert.length ? (
                                <WarningAlert text={warningAlert} />
                            ) : null}
                            {dangerAlert.length ? (
                                <DangerAlert text={dangerAlert} />
                            ) : null}
                        </div>
                        <div className='col-md-6 mt-2'>
                            <CitySearch
                                allLocations={allLocations}
                                setCurrentCity={setCurrentCity}
                                setInfoAlert={setInfoAlert}
                            />
                        </div>
                        <div className='col-md-6'>
                            <NumberOfEvents
                                setCurrentNOE={setCurrentNOE}
                                setWarningAlert={setWarningAlert}
                            />
                        </div>
                        <div className='col-md-12 col-12 charts-container'>
                            <CityEventCharts
                                allLocations={allLocations}
                                events={events}
                            />
                            <EventGenresChart events={events} />
                        </div>
                        <div className='col-md-12'>
                            <EventList
                                events={events}
                                loading={loading}
                                setLoading={setLoading}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default App;
