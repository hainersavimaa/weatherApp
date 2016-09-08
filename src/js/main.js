
$(function(){
   var appid = '02b9147507121ec986375000ed8b1dac'; //openweathermap access key
   //To get user device location
   x = navigator.geolocation;
   x.getCurrentPosition(success, failure);
   //if location is enabled and/or supported by user's browser
   function success(position) {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
      getWeather(latitude,longitude);
      console.log(latitude, longitude);
   }
   //location not supported, failed
   function failure() {
      //$("#geo").html("<p>it did not work</p>");
      $('#cities').prepend("<li class='weather location failure active'>Unable to locate your device. Try MS Edge.<button id='remove'>X</button></li>");
   }

   $('#call-add-city').on('click', function(){
      $('.input-container').addClass('input-container-open');
      $(this).fadeOut();
   });
   //if location was successful, pass in as parameters latitude and longitude
   function getWeather(latitude, longitude) {
      //if latitude and longitude exists
      if(latitude != '' && longitude !='') {
         console.log("retrieving information..");
         $.getJSON( "https://api.openweathermap.org/data/2.5/weather?lat="+latitude+"&lon="+longitude+"&units=metric&appid="+appid, function(data) {
            //load wanted json objects into a new array "locationWeather".
            var locationWeather= new Array();
            locationWeather['id'] = data.id;
            locationWeather['city'] = data.name;
            locationWeather['currentTemp'] = Math.round(data.main.temp);
            locationWeather['description'] = data.weather[0].description;
            locationWeather['cloudiness'] = data.weather[0].all;
            locationWeather['time'] = data.dt;
            locationWeather['code'] = data.weather[0].id;
            locationWeather['icon'] = "http://openweathermap.org/img/w/"+data.weather[0].icon+".png";

            setClasses(locationWeather);
            //add location symbol to geolocation item
            $('#cities li.weather').first().append("<span class='location-symbol'>&#10148;</span>");
         });
      }
   }
   //function that gets called when add-city button is pressed
   $("#add-city").click(function(event){
   var city = $("#city").val();  //
   if(city!='') { //if there is an input
      $.getJSON( "https://api.openweathermap.org/data/2.5/weather?q="+encodeURIComponent(city)+"&units=metric&appid="+appid, function(data) {
         //load info from JSON into an array
         var currentWeather = new Array();
         currentWeather['id'] = data.id;
         currentWeather['city'] = data.name;
         currentWeather['currentTemp'] = Math.round(data.main.temp);
         currentWeather['description'] = data.weather[0].description;
         currentWeather['cloudiness'] = data.weather[0].all;
         currentWeather['time'] = data.dt;
         currentWeather['code'] = data.weather[0].id;
         currentWeather['icon'] = "http://openweathermap.org/img/w/"+data.weather[0].icon+".png";

         $("input").val("");
         //call function that appends <li> elements and appropriate classes
         setClasses(currentWeather);
         //convert to object to post new city object into JSON file --- NOT WORKING!
         console.log(JSON.stringify(currentWeather));

      });
   }else {  //if there is not an input
         $('#response').text("Didn't get any informatio");
      }
   });
   // for removing from DOM
   $('#cities').delegate('#remove','click', function(){
      $(this).parent().fadeOut();
   });
   // add/remove .active class on click
   $('#cities').delegate('li','click', function(){
      $('.weather').removeClass('active');
      $(this).addClass('active');
   });
});
// function that converts inserted timestamp to hh:mm format
function convertTime(timestamp){
   var date = new Date(timestamp*1000);
   // to get hours
   var hours = date.getHours();
   // to get minutes
   var minutes = "0" + date.getMinutes();
   // put it into a varible formattedTime
   var formattedTime = hours + ':' + minutes.substr(-2);
   return formattedTime;
};

//function to set classes to <li> elements depending on the weather.id code (in order to set different background images)
function setClasses(weatherType){
   var formattedTime = convertTime(weatherType['time']);
   var response = "<p class='time'>"+formattedTime+"</p> <h1>" + weatherType['city']+"</h1> <span class='temp'>"+weatherType['currentTemp']+"&#176;</span> <div class='info'>"+weatherType['description']+"</div><button id='remove'>X</button>";
   var weatherClass;
   if(weatherType['code'] === 800){ //800 is sunny
      weatherClass = $('#cities').append("<li class='weather sunny' id=''"+weatherType['city']+"''>"+response+"</li>");
      return weatherClass;
   }else if (weatherType['code'] === 801 || weatherType['code'] === 802 ) { //801 & 802 are for light cloudiness
      weatherClass = $('#cities').append("<li class='weather light-cloudy' id=''"+weatherType['city']+"''>"+response+"</li>");
      return weatherClass
   } else if (weatherType['code'] === 803 || weatherType['code'] === 804) { //803 & 804 for thicker clouds
      weatherClass = $('#cities').append("<li class='weather light-cloudy' id=''"+weatherType['city']+"''>"+response+"</li>");
      return weatherClass;
   }else if (weatherType['code'] >= 500 && weatherType['code'] <=531) { //for different rainy weathers
      weatherClass = $('#cities').append("<li class='weather rainy' id=''"+weatherType['city']+"''>"+response+"</li>");
      return weatherClass;
   }else if (weatherType['code'] >= 900 && weatherType['code'] <=902) { //for storm
      weatherClass = $('#cities').append("<li class='weather thunder' id=''"+weatherType['city']+"''>"+response+"</li>");
      return weatherClass;
   }else{   //other i.e snow, mist...
      $('#cities').append("<li class='weather unknown' id=''"+weatherType['city']+"''>"+response+"</li>");
   }

}

//to convert an array to object for json POST
(function(){
    // Convert array to object
    var convArrToObj = function(array){
        var thisEleObj = new Object();
        if(typeof array == "object"){
            for(var i in array){
                var thisEle = convArrToObj(array[i]);
                thisEleObj[i] = thisEle;
            }
        }else {
            thisEleObj = array;
        }
        return thisEleObj;
    };
    var oldJSONStringify = JSON.stringify;
    JSON.stringify = function(input){
        if(oldJSONStringify(input) == '[]')
            return oldJSONStringify(convArrToObj(input));
        else
            return oldJSONStringify(input);
    };
})();
