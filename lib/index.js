/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/* eslint-env es6, mocha, node */
/* eslint-extends: eslint:recommended */
'use strict';



/**
 * ExpressMiddlewareACL
 *
 * @class
 */
class ExpressMiddlewareACL {

    /**
     * Constructor
     *
     * @param {Array} middleware
     * @param {Object} options
     * @constructs ExpressMiddlewareACL
     */
    constructor(middleware, options) {
        const self = this,
            list = middleware || [];

        self.options = options || {};
        self.list = Array.isArray(list) ? list : [list];
    }

    /**
     * Set middleware
     *
     * @param {Array} middleware
     * @returns {Object}
     */
    set(middleware) {
        const self = this,
            list = middleware || [];
        self.list = Array.isArray(list) ? list : [list];

        return self;
    }

    /**
     * Add middleware
     *
     * @param   {Function} middleware
     * @returns {Object}
     */
    add(middleware) {
        const self = this;
        Array.prototype.push.apply(self.list, Array.isArray(middleware) ? middleware : [middleware]);

        return self;
    }

    /**
     * Remove middleware
     *
     * @param   {Number} index
     * @param   {Number} count
     * @returns {Object}
     */
    remove(index, count) {
        const self = this;
        self.list.splice(index, count || 1);

        return self;
    }

    /**
     * Get middleware function
     *
     * @returns {Function}
     */
    middleware() {
        const self = this;

        return function (req, res, next) {
            if (!self.list.length) {
                return next();
            }

            let index = 0;
            (function callback (result) {
                if (result) {
                    return ('route' === result) ? next() : next(result);
                }

                const middleware = self.list[index];
                index = index + 1;

                return (middleware) ? middleware(req, res, callback) : next(result);
            })();
        };
    }
}


// Export module
module.exports = function (middleware, options) {
    return new ExpressMiddlewareACL(middleware, options);
};



/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */