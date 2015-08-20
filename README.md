# dropboxhackathon-web
A secure tool that analyses your Dropbox files by creating a json object and presenting the results as you log in through the webapp. Created for the Dropbox London Hackathon 23.01.2015 - 24.01.2015.

## How to run:

* git clone https://github.com/anthonymonori/dropboxhackathon-web
* git clone https://github.com/anthonymonori/dropboxhackathon-backend
* cd dropboxhackathon-backend
* ./build.sh (Build the application that analyses the Dropbox locally)
* ./run.sh (Analyse your Dropbox and generate a json file out of it)
* ./upload.sh (Should be changed first with a server to place it)
* cd ../dropboxhackathon-web
* npm install
* node app.js
* open http://localhost:8080

## Credits:
* tcox2 (backend)
* h-marvic (backend)
* anthonymonori (frontend/backend)
* atican (design/frontent)
