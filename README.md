# Socket.io add-on for Pryv lib-js

Extends Pryv's [lib-js](https://github.com/pryv/lib-js) with socket.io transport and notifications.

## Setup

This library extends `Pryv.Connection` instance with a `connection.socket` property. 

### Node.js 

`npm install pryv @pryv/socket.io`

In you project files, one time only. Then the Pryv javascript package will be "patched" with socket.io capabilities. 

```javascript
const Pryv = require('pryv');
require('@pryv/socket.io')(Pryv);
```

### Browser


```html
<script src="https://api.pryv.com/lib-js/pryv.js"></script>
<script src="https://api.pryv.com/lib-js-socket.io/pryv.jspryv-socket.io.js"></script>

<script>
(function () { 
	// the following line "patches" Pryv with PryvSocket capabilities 
  PryvSocket(Pryv); 
})();
</script>

```

## Usage

Once Socket.io has been setup `Pryv.Connection` instances expose `.socket`

- `conn.socket.open()` is an asynchronous call that open the socket.io connection. It throws Errors on failures.

- `conn.socket.api()` is identical to `conn.api()` using the socket.io transport [lib-js:API calls](https://github.com/pryv/lib-js#api-calls)

- `conn.socket.on({event-name}, callback)` registers an event listener.

  Possible `event-name` values are:

  - `eventsChanged` :  Fired when on or multiples events are deleted, changed or added.
  - `streamsChanged`: Fired when on or multiples streams are deleted, changed or added.
  - `accessChanged`: Fired when an access is deleted or added.
  - `error`: Fired on error. The callback will eventually receive the error as first argument.

## Examples

### Node.js

```javascript
const Pryv = require('pryv');
require('@pryv/socket.io')(Pryv);

const apiEndpoint = 'https://{token}@my-computer.rec.la:4443/{username}/';
(async () => { 
  const conn = new Pryv.Connection(apiEndpoint);
  try {
    await conn.socket.open();
    conn.socket.on('eventsChanged', async () => {
      const res = await conn.socket.api([{method: 'events.get', params: {limit: 2}}]);
    	console.log('Last 2 events: ', res);
    });
  } catch (e) {
    console.log('An error occured: ', e.message);
  }
})();
```

### Browser

```html
<script src="https://api.pryv.com/lib-js/pryv.js"></script>
<script src="https://api.pryv.com/lib-js-socket.io/pryv.jspryv-socket.io.js"></script>


<script>
const apiEndpoint = 'https://{token}@my-computer.rec.la:4443/{username}/';
(async function () { 
	// the following line "patches" Pryv with PryvSocket capabilities 
  PryvSocket(Pryv); 
  try {
    await conn.socket.open();
    conn.socket.on('eventsChanged', async () => {
      const res = await conn.socket.api([{method: 'events.get', params: {limit: 2}}]);
    	console.log('Last 2 events: ', res);
    });
  } catch (e) {
    console.log('An error occured: ', e.message);
  }
});
</script>
```

