'use strict';

const PATH = require('path');
const Rx   = require('rxjs');
const Util = require('feliz.util');

module.exports = function(options){

    const util = Util();

    if (!util.is(options).object()) options = {};

    options.deps = !util.is(options.deps).object()? [] : Object.keys(options.deps);

    const package$ = Rx.Observable
        .from(options.deps)
        .filter(name => name.indexOf('feliz-') === 0);

    let file$ = Rx.Observable.from([]);
    if (util.is(options.path).string()) file$ = util.rx.path(options.path)
        .readdir()
        .filter(filename =>
            PATH.extname(filename) === PATH.extname(process.mainModule.filename)
        )

    return Rx.Observable
        .merge(package$, file$)
        .map(modname => process.mainModule.require(modname));
}
