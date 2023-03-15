"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = require("@quenk/test/lib/assert");
var future_1 = require("@quenk/noni/lib/control/monad/future");
var function_1 = require("@quenk/noni/lib/data/function");
var hash_1 = require("../../lib/hash");
describe('router', function () {
    describe('HashRouter', function () {
        var router;
        afterEach(function () {
            if (router)
                router.stop();
            window.location.hash = '';
        });
        it('should activate a route', function (cb) {
            var called = false;
            router = new hash_1.HashRouter(window, {});
            router
                .add('/search/:collection', function (req) {
                called = true;
                (0, assert_1.assert)(req.params.collection).equal('samples');
                return (0, future_1.pure)(undefined);
            })
                .start();
            window.location.hash = '#/search/samples';
            setTimeout(function () {
                (0, assert_1.assert)(called).equal(true);
                cb();
            }, 200);
        });
        it('should recognise # as /', function (cb) {
            var called = false;
            router = new hash_1.HashRouter(window, {});
            router
                .add('/', function () {
                called = true;
                return (0, future_1.pure)(undefined);
            })
                .start();
            window.location.hash = '#';
            setTimeout(function () {
                (0, assert_1.assert)(called).equal(true);
                cb();
            }, 200);
        });
        it('must parse path parameters variables', function (cb) {
            var called = false;
            router = new hash_1.HashRouter(window, {});
            router
                .add('/spreadsheet/locations/:worksheet', function (req) {
                (0, assert_1.assert)(req.query).not.undefined();
                (0, assert_1.assert)(req.query.b).equal('2');
                (0, assert_1.assert)(req.query.c).equal('3');
                called = true;
                return (0, future_1.pure)(undefined);
            })
                .start();
            window.location.hash = '#/spreadsheet/locations/1?a=1&b=2&c=3';
            setTimeout(function () {
                (0, assert_1.assert)(called).true();
                cb();
            }, 200);
        });
        it('should recognise "" as /', function (cb) {
            var called = false;
            router = new hash_1.HashRouter(window, {});
            router
                .add('/', function () {
                called = true;
                return (0, future_1.pure)(undefined);
            })
                .start();
            window.location.hash = '';
            setTimeout(function () {
                (0, assert_1.assert)(called).true();
                cb();
            }, 200);
        });
        it('should execute middleware', function (cb) {
            var count = 0;
            var mware = function (req) { count = count + 1; return (0, future_1.pure)(req); };
            router = new hash_1.HashRouter(window, {});
            router
                .use('/search', mware)
                .use('/search', mware)
                .use('/search', mware)
                .add('/search', function () {
                count = count + 1;
                return (0, future_1.pure)(undefined);
            })
                .start();
            window.location.hash = 'search';
            setTimeout(function () {
                (0, assert_1.assert)(count).equal(4);
                cb();
            }, 1000);
        });
        it('should invoke the 404 if not present', function (cb) {
            var hadNotFound = false;
            var onErr = function () { return (0, future_1.pure)((0, function_1.noop)()); };
            var onNotFound = function () { hadNotFound = true; return (0, future_1.pure)((0, function_1.noop)()); };
            router = new hash_1.HashRouter(window, {}, onErr, onNotFound);
            router.start();
            window.location.hash = 'waldo';
            setTimeout(function () {
                (0, assert_1.assert)(hadNotFound).true();
                cb();
            }, 1000);
        });
    });
});
//# sourceMappingURL=index_test.js.map