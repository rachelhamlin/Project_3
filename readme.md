# Nextplorer
*Built by Irwin Tsay & Rachel Hamlin*

Nextplorer is a personal city guide for urban dwellers, travelers and explorers.

The perk of city life is an endless list of places to try: that new restaurant by a celebrity chef, the speakeasy your friend says you have to try, a gallery opening you saw on Instagram. Keeping track is the only trouble.

Enter Nextplorer: a bookmarking tool for you to save spots in your city—and around the world–that you want to remember. Next time you’re looking for a bite to eat or something to do, open the app to see all your places nearby. Save new places, add personal notes, and filter by category. Nextplorer makes it easy to make good on all the places you’ve been planning to try.

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
* Google Maps API
* Hand-coded CSS & HTML

**Back-End:**
Two models with a nested schema. Users and their saved favorites persist and are served from our own API. Irwin section!

**Front-End:**

The front-end is making AJAX calls to the database to render a user’s existing favorites. Any time a user removes or adds a favorite, the favorite is added to the map in real time. Same goes for any profile updates.

To load any new places for saving, the front-end relies exclusively on the Google Maps API and the Google Places library as a component.


## The Approach

After agreeing upon our concept with our product managers, we separated our list of potential features into core functionalities, and stretch features. The core functionalities were simply to geolocate a user on the map, enable them to save a favorite to the database, and display those favorites back to them.

Stretch features included things like the ability to share a list with another user, OAuth log-in, and custom lists for users to organize their favorites.

Our core functionalities turned out to be challenging enough to work us till the deadline. :) But we got some extras in: not only do we render a user’s favorites, we also update them as they are removed and added in real-time. We let a user save data along with their favorite (notes) and dynamically display that data. We added category filtering. And we created a form to edit the user’s profile or delete the account.

Along the way, our PMs provided us with user research that led to several helpful UX changes—most notably, the idea to call out the “Filter” functionality on the header, rather than using a hamburger button.


## Final Thoughts

In the future, we’d really like to:
* Enable a user to save any place on the map, including from Google’s built-in Points of Interest. There is some initial code that can access a POI’s address in string format by reverse geocoding, and we want to send that back through our search input in order to grab the correct place for saving.
* Tailor the icons on the map to match their place of business. Each newly-created marker could take a property matching its place type, with an icon generated to match that.
* Populate new place search results when the map is dragged. There is starter code for this as well....called sergeyIsTheBest. Not semantic, but semi-true.
* Pull in images or other helpful data to a new place result. It would be fun to also work with the Instagram API to pull the latest social images tagged at a given location, for a live sense of the scene.
* Make the app fully responsive and mobile-optimized.
* Style the profile page.
* Add custom lists.
* Refactor.
