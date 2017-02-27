# eq-express-middleware-acl

Access control middleware for Express

## Class: ExpressMiddlewareACL
### ExpressMiddlewareACL(middleware)
- ```middleware``` <Array>    Array of middleware function

#### Example
```javascript
function middleware(req, res, next) {
    next();
}

const express_middleware_acl = require('eq-express-middleware-acl'),
    acl = express_middleware_acl([middleware]);
```


### Class Method: ExpressMiddlewareACL.set(middleware)
Set middleware list to ```middleware``` (Overwrite current list)
- ```middleware``` <Array>    Array of middleware function

#### Example
```javascript
function middleware(req, res, next) {
    next();
}

const express_middleware_acl = require('eq-express-middleware-acl'),
    acl = express_middleware_acl();
acl.set([middleware]); // Set middleware list to [middleware]
acl.set([]); // Clear middleware list
```


### Class Method: ExpressMiddlewareACL.add(middleware)
Add ```middleware``` to end of middleware list
- ```middleware``` <Array>    Array of middleware function

#### Example
```javascript
function middleware(req, res, next) {
    next();
}

const express_middleware_acl = require('eq-express-middleware-acl'),
    acl = express_middleware_acl();
acl.add([middleware]);
```


### Class Method: ExpressMiddlewareACL.remove(index)
Remove middleware by index
- ```index``` <Number>    Index of middleware

#### Example
```javascript
function middleware(req, res, next) {
    next();
}

const express_middleware_acl = require('eq-express-middleware-acl'),
    acl = express_middleware([middleware, middleware, middleware]);
acl.remove(1);
```


### Class Method: middlware
Get access control middleware function

#### Example
```javascript
function middleware(req, res, next) {
    next();
}

const express = require('express'),
    express_middleware_acl = require('eq-express-middleware-acl'),
    app = express(),
    acl = express_middleware_acl([middleware]);
app.use(acl.middleware());
```


## Creating access control middleware
### Call next access control middleware
```javascript
function (req, res, next) {
    // Call next access control middleware
    next();
}
```

### Allow access and skip next middleware
```javascript
function (req, res, next) {
    // Skip next access control middleware
    next('route');
}
```

### Deny access
```javascript
function (req, res, next) {
    next(new Error('Forbidden'));
}
```
