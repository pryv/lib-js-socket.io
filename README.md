# Socket.io add-on for Pryv lib-js

Extends Pryv's [lib-js](https://github.com/pryv/lib-js) with socket.io transport and notifications.


```javascript
const Pryv = require('pryv');
require('@pryv/socket.io')(Pryv);

const apiEndpoint = 'https://ck6bwmcar00041ep87c8ujf90@drtom.pryv.me';
const conn = new Pryv.Connection(apiEndpoint);

// --- Notifications
function onEventsChange() { 
  // update events
}
function onStreamsChange() { 
  // update streams
}

(async () => { 
	// open the connection 
  await conn.socket.open();
  
  // register your listener
  conn.socket.on('eventsChanged', onEventsChange);
  conn.socket.on('streamsChanged', onStreamsChange);
  
  // call the api with socket.io transport
  const res = await conn.socket.api([{method: 'events.get', params: {}}]);
});


```

