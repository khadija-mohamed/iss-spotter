const request = require("request");

const fetchMyIP = function(callback) {
  request(`https://api.ipify.org?format=json`), (error, response, body) => {
  if (error) {
    callback(error, null);
    return;
  }
  if (response.statusCode !== 200) {
    const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
    callback(Error(msg), null);
    return;
  }
}

const fetchCoordsByIp = function(ip, callback) {
request(`http://freegeoip.app/json/${ip}`, (error, response, body) => {
  if (error) { 
   return callback(error, null);
  }

  if (response.statusCode !== 200) {
    const msg = `Status Code ${response.statusCode} when fetching coordinates. Response: ${body}`;
    callback(Error(msg), null);
    return;
  }

  const result = JSON.parse(body); 
  const coords = {
    latitude: result.latitude,
    longitude: result.longitude
  };
  callback (null, coords)
}) 
};

  const fetchISSFlyOverTimes = function(coords, callback) {
  request(`https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`);
  if (error) {
    callback(error, null)
    return;
  }
  
  if (response.statusCode !== 200) {
    const msg = `Status Code ${response.statusCode} when fetching ISS Flyover times. Response: ${body}`;
    callback(Error(msg), null);
    return;
  }
  
  const flyover = JSON.parse(body);
  callback (null, flyover);
}
}

const nextISSTimesForMyLocation = function (callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      fetchCoordsByIp (ip, (error, coords) => {
        if (error) {
          fetchISSFlyOverTimes (coords, (error, passTimes) => {
            if (error) {
              return callback (null, passTimes, coords)
            }
            return callback(error);
          })
        }        
      })
      return callback (error);
    }
    return callback(error);
  })


};
module.exports = { nextISSTimesForMyLocation };