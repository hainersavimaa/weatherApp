# weatherApp
This is a simple jQuery application which gets its data from OpenWeatherMap API. 

App data is pulled in with a simple Ajax GET method. From the response the application will select the following to store in an array:
<ul>
  <li>id</li>
  <li>name</li>
  <li>current temperature</li>
  <li>description</li>
  <li>timestamp of the data collection</li>
  <li>weather code</li>
</ul>
This info is then passed on to a function which appends a li element with an appropriate class(to assign a background image according to the current weather conditions) to the unordered list element.

On page load the application will try to get the user's device location. This feature in only supported in HTML5 ready browsers.
Later on, the user is able to add new cities to the list. Clicking on the button to add new city calls a function which:
<ul>
  <li>stores input field value</li>
  <li>opens Ajax connection to OpenWeatherMap API</li>
  <li>stores the response in an array variable</li>
  <li>assigns appropriate classes to newly added city and appends the "<li>" element to the list</li>
  <li>clears the input</li>
  </ul>

Unfortunately this application doesn't save the state after refresh. Although the added city gets converted for a suitable format for JSON POST function. There was some kind of cross-domain problems with the Ajax POST function. Since github pages are loaded over https and openweathermap API's do not support https connections the app should be cloned and hosted on your localhost or any other server with http.
