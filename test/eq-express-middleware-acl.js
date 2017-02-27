/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/* eslint-env es6, mocha, node */
/* eslint-extends: eslint:recommended */
'use strict';



// Variables
const expect = require('expect.js'),
    express_middleware_acl = require('../');


// Middleware
function allow(req, res, next) {
    next('route');
}

function pass(req, res, next) {
    next();
}

function deny(req, res, next) {
    next(new Error('Forbidden'));
}


// Test
describe('express-middleware-acl', function () {
    describe('constructor', function () {
        describe('Should set intance', function () {
            it('With middleware', function () {
                const instance = express_middleware_acl(allow);

                expect(instance.constructor.name).to.be('ExpressMiddlewareACL');
                expect(instance.list).to.have.length(1);
                expect(instance.options).to.eql({});
                expect(instance.policy).to.be('deny');
            });

            it('Without middleware', function () {
                const instance = express_middleware_acl();

                expect(instance.constructor.name).to.be('ExpressMiddlewareACL');
                expect(instance.options).to.eql({});
                expect(instance.policy).to.be('deny');
            });

            it('Without options', function () {
                const options = {policy: 'allow'},
                    instance = express_middleware_acl(null, options);

                expect(instance.constructor.name).to.be('ExpressMiddlewareACL');
                expect(instance.options).to.eql(options);
                expect(instance.policy).to.be('allow');
            });
        });
    });

    describe('set', function () {
        describe('Should set middleware', function () {
            it('Single', function () {
                const instance = express_middleware_acl([allow]);

                expect(instance.list).to.have.length(1);
                expect(instance.list.every(function (item) {
                    return ('allow' === item.name);
                })).to.be(true);
                instance.set(deny);
                expect(instance.list).to.have.length(1);
                expect(instance.list.every(function (item) {
                    return ('deny' === item.name);
                })).to.be(true);
            });

            it('Multi', function () {
                const instance = express_middleware_acl([allow]);

                expect(instance.list).to.have.length(1);
                expect(instance.list.every(function (item) {
                    return ('allow' === item.name);
                })).to.be(true);
                instance.set([deny, deny, deny]);
                expect(instance.list).to.have.length(3);
                expect(instance.list.every(function (item) {
                    return ('deny' === item.name);
                })).to.be(true);
            });
        });

        it('Should clear middleware', function () {
            const instance = express_middleware_acl([allow, allow, allow, allow, allow]);

            expect(instance.list).to.have.length(5);
            instance.set();
            expect(instance.list).to.have.length(0);
        });
    });

    describe('use', function () {
        describe('Should use middleware', function () {
            it('Single', function () {
                const instance = express_middleware_acl();

                expect(instance.list).to.have.length(0);
                instance.use(allow);
                expect(instance.list).to.have.length(1);
            });

            it('Multi', function () {
                const instance = express_middleware_acl();

                expect(instance.list).to.have.length(0);
                instance.use([allow, deny]);
                expect(instance.list).to.have.length(2);
            });
        });
    });

    describe('remove', function () {
        describe('Should remove middleware', function () {
            it('Single', function () {
                const instance = express_middleware_acl([allow, allow, deny, allow, allow]);
                instance.remove(2);

                expect(instance.list).to.have.length(4);
                expect(instance.list.every(function (item) {
                    return ('allow' === item.name);
                })).to.be(true);
            });

            it('Multi', function () {
                const instance = express_middleware_acl([allow, allow, deny, deny, allow]);
                instance.remove(2, 2);

                expect(instance.list).to.have.length(3);
                expect(instance.list.every(function (item) {
                    return ('allow' === item.name);
                })).to.be(true);
            });
        });
    });

    describe('middleware', function () {
        it('Should get middleware function', function () {
            const instance = express_middleware_acl(),
                middlware = instance.middleware();

            expect(middlware).to.be.a(Function);
        });

        it('Should skip acl', function (done) {
            const instance = express_middleware_acl(),
                middleware = instance.middleware();

            middleware({}, {}, function (result) {
                expect(result).to.be(undefined);

                done();
            });
        });

        it('Should deny request', function (done) {
            const instance = express_middleware_acl([pass, pass, pass, deny, allow]),
                middleware = instance.middleware();

            middleware({}, {}, function (result) {
                expect(result.message).to.be('Forbidden');

                done();
            });
        });

        it('Should allow request', function (done) {
            const instance = express_middleware_acl([pass, pass, pass, allow, deny]),
                middleware = instance.middleware();

            middleware({}, {}, function (result) {
                expect(result).to.be(undefined);

                done();
            });
        });

        describe('Should pass all middleware', function () {
            it('Policy allow', function (done) {
                let count = 0;
                const test = function (req, res, next) {
                        count = count + 1;

                        next();
                    },
                    instance = express_middleware_acl([test, test, test, test, test], {policy: 'allow'}),
                    middleware = instance.middleware();

                middleware({}, {}, function (result) {
                    expect(count).to.be(5);
                    expect(result).to.be(undefined);

                    done();
                });
            });

            it('Policy deny', function (done) {
                let count = 0;
                const test = function (req, res, next) {
                        count = count + 1;

                        next();
                    },
                    instance = express_middleware_acl([test, test, test, test, test], {policy: 'deny'}),
                    middleware = instance.middleware();

                middleware({}, {}, function (result) {
                    expect(count).to.be(5);
                    expect(result.message).to.be('Forbidden');

                    done();
                });
            });
        });
    });
});




/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
