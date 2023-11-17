import { render, within } from '@testing-library/react';
import App from '../App';
import userEvent from '@testing-library/user-event';
import { getEvents } from '../api';

describe('<App /> component', () => {
    let AppDOM;

    beforeEach(() => {
        AppDOM = render(<App />).container.firstChild;
    });
    test('renders list of events', () => {
        expect(AppDOM.querySelector('#event-list')).toBeInTheDocument();
    });
    test('render city search', () => {
        expect(AppDOM.querySelector('#city-search')).toBeInTheDocument();
    });
    test('render number of events', () => {
        expect(AppDOM.querySelector('#number-of-events')).toBeInTheDocument();
    });
});

describe('<App /> integration', () => {
    test('renders a list of events matching the city selected by the user', async () => {
        const user = userEvent.setup();
        const AppComponent = render(<App />);
        const AppDOM = AppComponent.container.firstChild;

        const CitySearchDOM = AppDOM.querySelector('#city-search');
        const CitySearchInput = within(CitySearchDOM).queryByRole('textbox');

        await user.type(CitySearchInput, 'Berlin');
        const berlingSuggestionItem =
            within(CitySearchDOM).queryByText('Berlin, Germany');
        await user.click(berlingSuggestionItem);

        const EventListDOM = AppDOM.querySelector('#event-list');
        const allRenderedEventList =
            within(EventListDOM).queryAllByRole('listitem');

        const allEvents = await getEvents();
        const berlinEvents = allEvents.filter(
            (event) => event.location === 'Berlin, Germany'
        );

        expect(allRenderedEventList.length).toBe(berlinEvents.length);
        allRenderedEventList.forEach((event) => {
            expect(event.textContent).toContain('Berlin, Germany');
        });
    });
    test('renders the events can change the events displayed', async () => {
        const user = userEvent.setup();
        const AppComponent = render(<App />);
        const AppDOM = AppComponent.container.firstChild;

        const EventListInput = AppDOM.querySelector('#number-of-events');

        await user.type(EventListInput, '{backspace}{backspace}10');

        const EventListDOM = AppDOM.querySelector('#event-list');
        const renderEventList = within(EventListDOM).queryAllByRole('listitem');

        expect(renderEventList).toHaveLength(10);
    });
});
