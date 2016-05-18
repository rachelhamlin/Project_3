# Nextplorer
*Built by Irwin Tsay & Rachel Hamlin*

Nextplorer is a personal city guide for urban dwellers, travelers and explorers.

The perk of city life is an endless list of places to try: a new restaurant by a celebrity chef, a speakeasy your friend swears by, a gallery opening on Instagram. Keeping track is the only trouble.

Enter Nextplorer: a bookmarking tool for you to save spots in your city—and around the world—that you want to remember. Next time you’re looking for a bite to eat or something to do, open the app to see all your places nearby. Save new ones, add personal notes, and filter by category. Nextplorer makes it easy to make good on all those things you mean to try.

Nextplorer is built with Node.js, Mongo, and Express.


## How It Works

Once they complete their profile, users can search for places by name, or by typing in keywords. Search autocompletes with results from the Google Places library.


Users can save any place by clicking “Add to favorites,” adding any notes or reminders for themselves, and confirming. The new ‘favorite’ appears on the map as a star with notes attached.


Users can also remove a place from their favorites, if they’ve changed their mind.


Each time they open the app, users will be geolocated, so they can see all their favorites that are within easy reach.


They can also filter by category to see just the selections they want to see. Nextplorer leverages Google Place types to group businesses under specific filters.


Lastly, users can edit their personal information and update or delete their account.


## The Technology

**Overview:**
* Node.js
* jQuery
* Express
* Mongo DB
* Mongoose
* Passport JS
* Google Maps API
* Hand-coded CSS & HTML

**Front-End:**

The front-end relies exclusively on the Google Maps API and the Google Places library component for most functionality. AJAX calls are made to the database for creating, editing, reading and deleting users. AJAX calls are also used to add favorites to a User, render a User’s existing favorites and render new saved favorites. All content and functionality is handled without leaving the single page view and is updated in real-time using AJAX and JQuery.

To load any new places for saving, the front-end relies exclusively on the Google Maps API and the Google Places library as a component.

**Back-End:**

The Mongo database is comprised of a single collection of Users outlined with a User model. Each User has a unique username and email address, among other fields, and also contains an array of 'Favorites' which is modeled with a nested Favorites schema. Users are required to login with their username and password before accessing Nextplorer. Passport authentication and authorization is handled by the Passport JS module and a custom passport strategy. Users and their saved favorites persist and are served from our own API.

Routing is performed by Express. The index router handles Nextplorer's single page view by checking for a current cookie containing an authorized User session. In the absence of a legitimate user cookie, the User is routed to a login view. After a successful login, the User is routed to the main index view. API routes handle authorization, favorites delete, and the full array of CRUD actions for Users.


## The Approach

After agreeing upon our concept with our product managers, we separated our list of potential features into core functionalities, and stretch features. The core functionalities were simply to geolocate a user on the map, enable them to save a favorite to the database, and display those favorites back to them.

Stretch features included things like the ability to share a list with another user, OAuth log-in, and custom lists for users to organize their favorites.

Our core functionalities turned out to be challenging enough to work us till the deadline. :) But we got some extras in: not only do we render a user’s favorites, we also update them as they are removed and added in real-time. We let a user save data along with their favorite (notes) and dynamically display that data. We added category filtering. And we created a form to edit the user’s profile or delete the account.

Along the way, our PMs provided us with user research that led to several helpful UX changes—most notably, the idea to call out the “Filter” functionality on the header, rather than using a hamburger button.


## Final Thoughts

In the future, we’d really like to:
* Enable a user to save any nearby place on the map, including from Google’s built-in Points of Interest. There is some initial code that can access a POI’s address in string format by reverse geocoding, and we want to send that back through our search input in order to grab the exact place ID for saving.
* Tailor the icons on the map to match their place of business. Each newly-created marker could take a property matching its place type and display an appropriate matching icon..
* Populate new place search results when the map is dragged. There is starter code for this as well....called sergeyIsTheBest. Not semantic, but semi-true.
* Pull in images or other helpful data to a new place result. It would be fun to also work with the Instagram API to pull the latest social images tagged at a given location, for a live sense of the scene.
* Add UI to allow Users to quickly view all saved favorites and easily edit or remove favorites from that list.
* Add UI elements to handle miscellaneous actions such as failed login attempts.
* Make the app fully responsive and mobile-optimized.
* Style the profile page.
* Add custom lists.
* Add friends functionality along with custom list sharing.
* Refactor.
