Sunrise-challenge - Google Calendar Data Proxy
==============================================

A test version of this challenge is available at: https://sunrise-challenge.herokuapp.com

Available routes
----------------

    /api/authenticate
    /api/authenticate/callback
    /api/calendars?accessToken=<accessToken>
    /api/calendars/:id/events?accessToken=<accessToken>
    
To run
------

    git clone git@github.com:sebastienvillar/sunrise-challenge.git
    cd sunrise-challenge
    mkdir config
    cd config/src
    
Add a file with your configuration:

    module.exports = {
	    google: {
		    clientId: <Google API client id>,
		    clientSecret: <Google API client secret>,
		    redirectUri: <hostname> + /api/authenticate/callback
	    }
	  }
	  
And then

     node app.js
	  
Notes
-----

I added a middleware to verify the accessToken. This requires an extra http request to the Google API. I wanted to manager this verification at one place and therefore added the middleware. An improvement would be to store the tokens in a database with their expiration time to avoid extra requests.
