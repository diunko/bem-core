/**
 * Base class for collections
 * Create collection of similar objects
 * @abstract
 * @inherit Array
 */

modules.define('i-bem__collection', ['inherit'], function(provide, inherit) {

provide(inherit(null, {
    /**
     * Get method names that will be implemented in collection
     * @return {Array}
     */
    getMethods : function() {
        return ['on', 'onFirst', 'un', 'trigger',
            'setMod', 'toggleMod', 'delMod',
            'afterCurrentEvent', 'destruct'];
    },

    /**
     * Get base prototype for collection
     * @return {Object}
     */
    getBase : function() {
        return {
            applyMethod : function(method, args) {
                this.forEach(function(context) {
                    context[method] && context[method].apply(context, args);
                });
                return this;
            },

            callMethod : function() {
                var args = this.slice.call(arguments);
                return this.applyMethod(args.shift(), args);
            }
        };
    },

    /**
     * Create collection instance
     * @param {Array} a list of similar objects
     * @return {Object}
     */
    create : function(a) {
        var decl = this.getBase();

        this.getMethods()
            .forEach(function(method) {
                if(!decl[method]) {
                    decl[method] = function() {
                        return this.applyMethod(method, arguments);
                    };
                }
            });

        /**
         * "Inherit" Array using direct extend
         * @see http://perfectionkills.com/how-ecmascript-5-still-does-not-allow-to-subclass-an-array/
         */
        this.create = function(arr) {
            arr || (arr = []);
            arr.__self = this;
            return jQuery.extend(arr, decl);
        };

        return this.create(a);
    }
}));

});
