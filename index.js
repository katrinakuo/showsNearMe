/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/



'use strict';
var Alexa = require('alexa-sdk');
var APP_ID = undefined;
var http = require('http')
var request = require('request');
var eventArray;
const requestPromise = require("request-promise");


// // 1. Text strings =====================================================================================================
//  //    Modify these strings and messages to change the behavior of your Lambda function

 var speechOutput;
 var reprompt;
 var welcomeOutput = "Let's find you a concert. Where or when would you like to see the show?";
 var welcomeReprompt = "Let me know where you'd like to see your concert or when you'd like to see it";
 var showIntro = [
   "Ok! Cool. ",
   "Nice. Sounds fun! ",
   "Wow! Ok. "
 ];


 var handlers = {
    'LaunchRequest': function () {
      this.emit(':ask', welcomeOutput, welcomeReprompt);
    },
    'showsNearMe': function () {


    	var filledSlots = delegateSlotCollection.call(this);

    	//compose speechOutput that simply reads all the collected slot values
      var speechOutput = randomPhrase(showIntro);


      var showCity=this.event.request.intent.slots.showCity.value;
      var timePeriod=this.event.request.intent.slots.timePeriod.value + 'T10:00:00Z';

      //function myHandler(input, callback) {
      const self = this;  // <--- pointer to this in the outer function scope
      // request("https://app.ticketmaster.com/discovery/v2/events.json?city=Boston&size=1&segmentName=Music&apikey=bP5gQH4GDftg8tE8j3dyXHYYPdNzDBV7", 
      //   function(error, response, body) {
      //          if (response) { 
      //           //part = body.substr(1,25);
      //              //d = JSON.parse(body);
      //               // we have a success so call the call back
      //               // for (var i = 0; i < Object.keys(response).length; i++) {
      //               //self.emit(":tell",String(typeof(body)));
      //               //self.emit(":tell",String(typeof(response["data"]));
      //           this.emit(':tell', str(body.length));
      //               //self.emit(":tell",body);
      //               //self.emit(":tell",Object.keys(response['_events']).join(' '));
      //                   // } //  <--- self points to the object you want
      //          } else {
      //                self.emit(':ask', 'hello');
      //          }
      //   })

getStatus(showCity,timePeriod).then(
    (response) => {
        var d = JSON.parse(response)
        var infoList = []
        var output = ''
         for (var i = 0; i < d['_embedded']['events'].length; i++) {
          if (Date.parse(d['_embedded']['events'][i]["dates"]["start"]["localDate"]) < Date.parse(timePeriod)) { //THIS CONDITONAL AND THE part of the URL that filters for date are not working. 
          infoList.push([d["_embedded"]["events"][i]["_embedded"]["attractions"][0]["name"],d['_embedded']['events'][i]["dates"]["start"]["localDate"]])
          output += d['_embedded']['events'][i]["name"] + " on " + d['_embedded']['events'][i]["dates"]["start"]["localDate"]
          //+ " on " +  d['_embedded']['events'][i]["dates"]["start"]["localDate"]
          output += ', '
        }
           
        }
        if (infoList.length > 0) {
        self.emit(":tellWithCard","Here are " + String(infoList.length) + " concerts in " + showCity + " before " + timePeriod + " : " + output, showCity + " concerts before " + timePeriod,output);
         }
         else {
          self.emit(":tell", "There are no concerts that meet your needs at this time. Check back later.")
         }
        
        console.log(response);
    },
    (error) => {
        console.error('uh-oh! ' + error);
    }
);



},

    //     speechOutput = '';
    //     var text = '';
    //     var self = this;
    //     var options = {
    // url: "https://app.ticketmaster.com/discovery/v2/events.json?city=" + showCity+ "&size=10&segmentName=" + 
    //          'Music' + "&apikey=bP5gQH4GDftg8tE8j3dyXHYYPdNzDBV7",
    // method: 'GET'
    //      };

    //      getEvents(options, function (quote){
    //         if(quote == ''){
    //         speechOutput = "Please try again later";
    //         }
    //         else{speechOutput = quote;}
    //         self.emit(':tell', speechOutput);
    //     }

        //this.emit(":tell", "HEY")

//           request.get({
//            url: "https://app.ticketmaster.com/discovery/v2/events.json?city=" + showCity+ "&size=10&segmentName=" + 
//             'Music' + "&apikey=bP5gQH4GDftg8tE8j3dyXHYYPdNzDBV7",
           
//          }, function(err, response, body) {
//            body = JSON.parse(body);


//            //eventArray = []
//            //console.log(body); 
//            //console.log(body['_embedded']);
//            for (var i = 0; i < body['_embedded']['events'].length;i++ ) {
//              //console.log(body['_embedded']['events'][i]['dates']['start']['localDate']);
//              if (body['_embedded']['events'][i]['dates']['start']['localDate'] <= timePeriod) {
//            //console.log([body['_embedded']['events'][i]['name'], body['_embedded']['events'][i]['classifications'][0]['segment']['name']]);
//            var eventTitle = body['_embedded']['events'][i]['name'];
//            var eventDate = body['_embedded']['events'][i]['dates']['start']['localDate'];
//            var eventCity = body['_embedded']['events'][i]['_embedded']['venues'][0]['city']['name'];
//            var eventType = body['_embedded']['events'][i]['classifications'][0]['segment']['name'];
             
//            this.emit(":tell",eventTitle);
//            //eventArray.push([eventTitle,eventDate]);

//            // console.log(body['_embedded']['events'][i]['name']);
//            // console.log(body['_embedded']['events'][i]['dates']['start']['localDate']);
//            // console.log(body['_embedded']['events'][i]['_embedded']['venues'][0]['city']['name']);
//            // console.log(body['_embedded']['events'][i]['classifications'][0]['segment']['name']);
//            console.log(eventTitle);
//            console.log(eventDate);
//            console.log(eventCity);
//            console.log(eventType);
//            console.log('____________________'); 

//            //eventArray.push([eventTitle,eventDate,eventCity,eventType]);


            
//            }

//          }
//          return body['_embedded']['events'][0]['name']
//          //console.log(eventArray);

//            });
// )


        
        // speechOutput+= "You will see a show in "+ showCity + " before " + timePeriod;

        // //this.emit(":tell",speechOutput);
        // this.emit(':tellWithCard', speechOutput, "ticketmaster JSON", speechOutput);

    //},
    'AMAZON.HelpIntent': function () {
        speechOutput = "";
        reprompt = "";
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        speechOutput = "";
        this.emit(':tell', "HELP");
    },
    'AMAZON.StopIntent': function () {
        speechOutput = "";
        this.emit(':tell', "HELP");
    },
    'SessionEndedRequest': function () {
        var speechOutput = "";
        this.emit(':tell', "HELP");
    },
};

exports.handler = (event, context,callback) => {
    var alexa = Alexa.handler(event, context);
    //alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    //alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

//radius
//numberOfEvents
// function getEvents(city, eventType, dateRange) {
// 	request.get({
// 					  url: "https://app.ticketmaster.com/discovery/v2/events.json?city=" + city + "&size=35&segmentName=" + 
// 					   eventType + "&apikey=bP5gQH4GDftg8tE8j3dyXHYYPdNzDBV7",
					 
// 					}, function(err, response, body) {
// 					  body = JSON.parse(body);
// 					  //eventArray = []
// 					  //console.log(body); 
// 					  //console.log(body['_embedded']);
// 					  for (var i = 0; i < body['_embedded']['events'].length;i++ ) {
// 					  	//console.log(body['_embedded']['events'][i]['dates']['start']['localDate']);
// 					  	if (body['_embedded']['events'][i]['dates']['start']['localDate'] <= dateRange) {
// 					  //console.log([body['_embedded']['events'][i]['name'], body['_embedded']['events'][i]['classifications'][0]['segment']['name']]);
// 					  var eventTitle = body['_embedded']['events'][i]['name'];
// 					  var eventDate = body['_embedded']['events'][i]['dates']['start']['localDate'];
// 					  var eventCity = body['_embedded']['events'][i]['_embedded']['venues'][0]['city']['name'];
// 					  var eventType = body['_embedded']['events'][i]['classifications'][0]['segment']['name'];

// 					  // console.log(body['_embedded']['events'][i]['name']);
// 					  // console.log(body['_embedded']['events'][i]['dates']['start']['localDate']);
// 					  // console.log(body['_embedded']['events'][i]['_embedded']['venues'][0]['city']['name']);
// 					  // console.log(body['_embedded']['events'][i]['classifications'][0]['segment']['name']);
// 					  console.log(eventTitle);
// 					  console.log(eventDate);
// 					  console.log(eventCity);
// 					  console.log(eventType);
// 					  console.log('____________________'); 

// 					  //eventArray.push([eventTitle,eventDate,eventCity,eventType]);


					  
// 					  }

// 					}
// 					//console.log(eventArray);

// 					  });



  //};

//getEvents('Boston','Music', '2017-08-15T10:00:00Z');


//    END of Intent Handlers {} ========================================================================================
// 3. Helper Function  =================================================================================================

function delegateSlotCollection(){
  console.log("in delegateSlotCollection");
  console.log("current dialogState: "+this.event.request.dialogState);
    if (this.event.request.dialogState === "STARTED") {
      console.log("in Beginning");
      var updatedIntent=this.event.request.intent;
      //optionally pre-fill slots: update the intent object with slot values for which
      //you have defaults, then return Dialog.Delegate with this updated intent
      // in the updatedIntent property
      this.emit(":delegate", updatedIntent);
    } else if (this.event.request.dialogState !== "COMPLETED") {
      console.log("in not completed");
      // return a Dialog.Delegate directive with no updatedIntent property.
      this.emit(":delegate");
    } else {
      console.log("in completed");
      console.log("returning: "+ JSON.stringify(this.event.request.intent));
      // Dialog is now complete and all required slots should be filled,
      // so call your normal intent handler.
      return this.event.request.intent;
    }
}

function randomPhrase(array) {
    // the argument is an array [] of words or phrases
    var i = 0;
    i = Math.floor(Math.random() * array.length);
    return(array[i]);
}
function isSlotValid(request, slotName){
        var slot = request.intent.slots[slotName];
        //console.log("request = "+JSON.stringify(request)); //uncomment if you want to see the request
        var slotValue;

        //if we have a slot, get the text and store it into speechOutput
        if (slot && slot.value) {
            //we have a value in the slot
            slotValue = slot.value.toLowerCase();
            return slotValue;
        } else {
            //we didn't get a value in the slot.
            return false;
        }
}

var getStatus = function getStatus(showCity,timePeriod) {
    var url = "https://app.ticketmaster.com/discovery/v2/events.json?city=" + showCity + "&segmentName=Music&eventdate_to=" + timePeriod + "&apikey=bP5gQH4GDftg8tE8j3dyXHYYPdNzDBV7"
    return requestPromise.get(url);
}



// function getEvents(options, callback){
//     http.get(options, function(res) {
//         console.error("Got response: " + res.statusCode);
//         res.on("data", function(body) {
//         console.error("BODY: " + body);
//         text = '' + body['_embedded']['events'][i]['name'];
//         return callback(text);
//     });
//     }).on('error', function(e) {
//         text = 'error' + e.message;
//         console.error("Got error: " + e.message);
// });
// }