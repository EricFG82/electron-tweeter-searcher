# Tweets searcher application
Example of an Electron application to search tweets.

Project is done using following technologies: 
* [Nodejs](https://nodejs.org/) 
* [React](https://reactjs.org/)
* [Electron](https://www.electronjs.org/)
* [WebpackJS](https://webpack.js.org/)

## Usage of the application
The application allows you to do general searches or search for content of an specific user.

![GitHub Logo](docs/screenshots/search-screenshot.png)

Example of searches:
Search value               | Description
-------------------------- | -------
windows                    | Performs a general search using the keyword "windows".
@billgates				   | Search tweets of user "billgates".
@billgates research        | Search tweets of user "billgates" containing the keyword "research".

The last 5 recent searches are saved to be used as a bookmark:

![GitHub Logo](docs/screenshots/search-recent-screenshot.png)

## Install prerequisites
- Install node.js: download and install setup from [node.js](https://nodejs.org/en/download/)

## Installation
* Do a GIT clone or download this source code and extract all files to a local folder.
* Open the command line, go to your directory previously created and run: ``` npm install ```

## Twitter consumer key
This application requires consumer keys to be able to use the Twitter REST API. 
This key is like your username. It is used to verify who you are to Twitter. 

The consumer keys are composed of two keys:
* API Key
* API Secret Key

If you want to generate your own keys, you will need to be registered on the [Twitter Developer portal](https://developer.twitter.com/en/portal/projects-and-apps)
and then create a Twitter application before. See more information [here](https://developer.twitter.com/en/docs/apps/overview) 

You must create an .env file on the root path of the project and specify following environment variables:
* TWITTER_API_KEY=**YOUR_API_KEY**
* TWITTER_API_SECRET_KEY=**YOUR_API_SECRET_KEY**

See the sample file ".env.example" for more details.

## Start the application in development mode
### Start the project as an Electron application:
* On the command line, run: ``` npm start ```

## Package the application
### Package the project as an Electron application:
* On the command line, execute: 
```sh
npm run prod
npm run build 
```
* For macOS only, on the command line, execute:
```sh
npm run prod
npm run build:mac
```
* For Windows only, on the command line, execute:
```sh
npm run prod
npm run build:win
```

## Structure of the source code
Path                       | Description
-------------------------- | -------
/                          | Root path. Here are the project configuration files.
/docs/                     | The documentation files are located here.
/public/                   | Public folder. Here are the public files such as index.html, favicon.ico.
/src/                      | The source files are located here.
/src/main                  | The main application source files are located here.
/src/main/services         | Here are the source files to define the services of the main application.
/src/renderer              | The renderer application source files are located here.
/src/renderer/components   | Here are the source files to define the components of the renderer application.
/src/renderer/services     | Here are the source files to define the services of the main application.
/src/models                | Here are the source files to define the data Transfer Objects (DTO).
/dist                      | Here are the compiled files prepared for distribution.

## Common errors
In case you get an "HTTP 403 Unauthorized" error when searching for tweets from the application, make sure the ``` .env ``` file exists and its content is correct. If this is not the case, add the file with the data and run the command again. For example: ``` npm start ```. 
