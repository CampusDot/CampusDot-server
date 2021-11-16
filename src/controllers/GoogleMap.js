const mongoose = require('mongoose');
const request = require('request');
var axios = require('axios');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');
const College = mongoose.model('College');
const Store = mongoose.model('Store');



function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const nearbySearch = async (req, res) => {
    try {
      const college = await College.find();
      var a=0;
      for(k =0; k<college.length; k++){

        const result = await Store.find({College:college[k]._id});
        if (result){
          a+=1;
        }else{

        }
      }
      console.log(a);

      /*  adding cafe
        const college = await College.find();
     
        const data= [];
        const type =['한식','양식','중식','일식','분식','cafe' ]

      for(k =0; k<college.length; k++){
        for(j =0; j< type.length; j++){
          var temp;
          var next;

          var config = {
            method: 'get',
            url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+college[k].Latitude+'%2C'+college[k].Longtitude+'&radius=3000&type=restaurant&keyword='+encodeURI(type[j])+'&key=AIzaSyAnZoJeEHQJEHOWbi0qUIu8-Tlj0Ty-rto',
            headers: { }
          };

          
          await axios(config)
            .then(async function (response) {
              temp = response.data
              next = temp.next_page_token
              for(a=0; a<temp.results.length; a++){
                console.log(type[j]);
                await new Store({
                  College: college[k]._id,
                  Information: temp.results[a],
                  Category: type[j],
                }).save()                      
              }
            })
            .catch(function (error) {
              console.log(error);
            });

        
          while(next){
            await sleep(3000)
            config= {
                method: 'get',
                url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken='+next+'&key=AIzaSyAnZoJeEHQJEHOWbi0qUIu8-Tlj0Ty-rto',
                headers: { }               
            };
            await axios(config)
            .then(async function (response) {

              temp = response.data
              next = temp.next_page_token
              for(a=0; a<temp.results.length; a++){
                console.log(type[j]);
                await new Store({
                  College: college[k]._id,
                  Information: temp.results[a],
                  Category: type[j],
                }).save()                          
              }           
            })
            .catch(function (error) {
              console.log(error);
            });

          }
        
        }
      }*/

    } catch (err) {
        return res.status(422).send(err.message);
    }

}


module.exports = {
    nearbySearch ,
}