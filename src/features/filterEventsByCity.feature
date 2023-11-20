Feature: Filter event by city
    Scenario: When user hasn't searched for a city, show upcoming events from all cities.
        Given user hasn't search for any city
        When user opens the app
        Then user should see the list of all upcoming events.

    Scenario: User should see a list of suggestions when they search for a city.
        Given main page is opens
        When user starts typing in the city textbox
        Then user should receive a list of cities (suggestions) that match what they've typed
    
    Scenario: User can select a city from the suggested list.
        Given user was typing "Berlin" in the city textbox
        And the list of suggested cities is showing
        When user selects a city (e.g: "Berlin, Germany") from the list
        Then their city should be changed to that city (i.e: "Berlin, Germany")
        And user should receive a list of upcoming events in that city
