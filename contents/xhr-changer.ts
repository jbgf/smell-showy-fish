import type { PlasmoCSConfig } from "plasmo";
import { feature } from "./const/feature";
import { phone } from "./const/phone";
import { collectData } from "./fetchDataFromPath";

function parseData (rawData: {d: string}) {
    let stringify = `${rawData}`
    /** remove extra code */
    const new_stringify = stringify.replace(`/*""*/`, '').replace(`/*\"\"*/`, '').replace(/\/\*\.*\*\//, '')
    const newData = JSON.parse(new_stringify)
 
    /** remove extra code */
    const searchBody = newData.d?.replace(`)]}'\n`, '');

    const FieldsMap = {
        'feature': feature
    }
    const fields = Object.keys(FieldsMap)
    return collectData(JSON.parse(searchBody), feature, phone);
}


export const config: PlasmoCSConfig = {
  matches: ["https://www.google.com/maps/*"],
  world: "MAIN"
};
(function(xhr) {

  var XHR = xhr.prototype;

  var open = XHR.open;
  var send = XHR.send;
  var setRequestHeader = XHR.setRequestHeader;

  XHR.open = function(method, url) {
      this._method = method;
      this._url = url;
      this._requestHeaders = {};
      this._startTime = (new Date()).toISOString();

      return open.apply(this, arguments);
  };

  XHR.setRequestHeader = function(header, value) {
      this._requestHeaders[header] = value;
      return setRequestHeader.apply(this, arguments);
  };

  XHR.send = function(postData) {

      this.addEventListener('load', function() {
          var endTime = (new Date()).toISOString();

          var myUrl = this._url ? this._url.toLowerCase() : this._url;
          if(myUrl) {

              if (postData) {
                  if (typeof postData === 'string') {
                      try {
                          // here you get the REQUEST HEADERS, in JSON format, so you can also use JSON.parse
                          this._requestHeaders = postData;    
                      } catch(err) {
                          console.log('Request Header JSON decode failed, transfer_encoding field could be base64');
                          console.log(err);
                      }
                  } else if (typeof postData === 'object' || typeof postData === 'array' || typeof postData === 'number' || typeof postData === 'boolean') {
                          // do something if you need
                  }
              }

              // here you get the RESPONSE HEADERS
              var responseHeaders = this.getAllResponseHeaders();

              if ( this.responseType != 'blob' && this.responseText) {
                  // responseText is string or null
                  try {

                      // here you get RESPONSE TEXT (BODY), in JSON format, so you can use JSON.parse
                      var data = this.responseText;

                      // printing url, request headers, response headers, response body, to console

                     /*  ;
                      console.log(JSON.parse(this._requestHeaders));
                      console.log(responseHeaders);
                      console.log(JSON.parse(arr));        */                 
                      if (this._url.indexOf('search') > -1) {
                          console.log('this._url', this._url, )
                          console.log(/* 'response', data,  */'this._url parsed:', parseData((data)));
                        }
                  } catch(err) {
                      console.log("Error in responseType try catch");
                      console.log(err);
                  }
              }

          }
      });

      return send.apply(this, arguments);
  };

})(XMLHttpRequest);