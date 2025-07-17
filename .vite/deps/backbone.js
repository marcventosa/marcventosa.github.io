import {
  index_all_exports,
  init_index_all
} from "./chunk-DQOW44NU.js";
import {
  __commonJS,
  __require,
  __toCommonJS
} from "./chunk-PLDDJCW6.js";

// node_modules/backbone/backbone.js
var require_backbone = __commonJS({
  "node_modules/backbone/backbone.js"(exports) {
    (function(factory) {
      var root = typeof self == "object" && self.self === self && self || typeof global == "object" && global.global === global && global;
      if (typeof define === "function" && define.amd) {
        define(["underscore", "jquery", "exports"], function(_2, $2, exports2) {
          root.Backbone = factory(root, exports2, _2, $2);
        });
      } else if (typeof exports !== "undefined") {
        var _ = (init_index_all(), __toCommonJS(index_all_exports)), $;
        try {
          $ = __require("jquery");
        } catch (e) {
        }
        factory(root, exports, _, $);
      } else {
        root.Backbone = factory(root, {}, root._, root.jQuery || root.Zepto || root.ender || root.$);
      }
    })(function(root, Backbone, _, $) {
      var previousBackbone = root.Backbone;
      var slice = Array.prototype.slice;
      Backbone.VERSION = "1.6.1";
      Backbone.$ = $;
      Backbone.noConflict = function() {
        root.Backbone = previousBackbone;
        return this;
      };
      Backbone.emulateHTTP = false;
      Backbone.emulateJSON = false;
      var Events = Backbone.Events = {};
      var eventSplitter = /\s+/;
      var _listening;
      var eventsApi = function(iteratee, events, name, callback, opts) {
        var i = 0, names;
        if (name && typeof name === "object") {
          if (callback !== void 0 && "context" in opts && opts.context === void 0) opts.context = callback;
          for (names = _.keys(name); i < names.length; i++) {
            events = eventsApi(iteratee, events, names[i], name[names[i]], opts);
          }
        } else if (name && eventSplitter.test(name)) {
          for (names = name.split(eventSplitter); i < names.length; i++) {
            events = iteratee(events, names[i], callback, opts);
          }
        } else {
          events = iteratee(events, name, callback, opts);
        }
        return events;
      };
      Events.on = function(name, callback, context) {
        this._events = eventsApi(onApi, this._events || {}, name, callback, {
          context,
          ctx: this,
          listening: _listening
        });
        if (_listening) {
          var listeners = this._listeners || (this._listeners = {});
          listeners[_listening.id] = _listening;
          _listening.interop = false;
        }
        return this;
      };
      Events.listenTo = function(obj, name, callback) {
        if (!obj) return this;
        var id = obj._listenId || (obj._listenId = _.uniqueId("l"));
        var listeningTo = this._listeningTo || (this._listeningTo = {});
        var listening = _listening = listeningTo[id];
        if (!listening) {
          this._listenId || (this._listenId = _.uniqueId("l"));
          listening = _listening = listeningTo[id] = new Listening(this, obj);
        }
        var error = tryCatchOn(obj, name, callback, this);
        _listening = void 0;
        if (error) throw error;
        if (listening.interop) listening.on(name, callback);
        return this;
      };
      var onApi = function(events, name, callback, options) {
        if (callback) {
          var handlers = events[name] || (events[name] = []);
          var context = options.context, ctx = options.ctx, listening = options.listening;
          if (listening) listening.count++;
          handlers.push({ callback, context, ctx: context || ctx, listening });
        }
        return events;
      };
      var tryCatchOn = function(obj, name, callback, context) {
        try {
          obj.on(name, callback, context);
        } catch (e) {
          return e;
        }
      };
      Events.off = function(name, callback, context) {
        if (!this._events) return this;
        this._events = eventsApi(offApi, this._events, name, callback, {
          context,
          listeners: this._listeners
        });
        return this;
      };
      Events.stopListening = function(obj, name, callback) {
        var listeningTo = this._listeningTo;
        if (!listeningTo) return this;
        var ids = obj ? [obj._listenId] : _.keys(listeningTo);
        for (var i = 0; i < ids.length; i++) {
          var listening = listeningTo[ids[i]];
          if (!listening) break;
          listening.obj.off(name, callback, this);
          if (listening.interop) listening.off(name, callback);
        }
        if (_.isEmpty(listeningTo)) this._listeningTo = void 0;
        return this;
      };
      var offApi = function(events, name, callback, options) {
        if (!events) return;
        var context = options.context, listeners = options.listeners;
        var i = 0, names;
        if (!name && !context && !callback) {
          for (names = _.keys(listeners); i < names.length; i++) {
            listeners[names[i]].cleanup();
          }
          return;
        }
        names = name ? [name] : _.keys(events);
        for (; i < names.length; i++) {
          name = names[i];
          var handlers = events[name];
          if (!handlers) break;
          var remaining = [];
          for (var j = 0; j < handlers.length; j++) {
            var handler = handlers[j];
            if (callback && callback !== handler.callback && callback !== handler.callback._callback || context && context !== handler.context) {
              remaining.push(handler);
            } else {
              var listening = handler.listening;
              if (listening) listening.off(name, callback);
            }
          }
          if (remaining.length) {
            events[name] = remaining;
          } else {
            delete events[name];
          }
        }
        return events;
      };
      Events.once = function(name, callback, context) {
        var events = eventsApi(onceMap, {}, name, callback, this.off.bind(this));
        if (typeof name === "string" && context == null) callback = void 0;
        return this.on(events, callback, context);
      };
      Events.listenToOnce = function(obj, name, callback) {
        var events = eventsApi(onceMap, {}, name, callback, this.stopListening.bind(this, obj));
        return this.listenTo(obj, events);
      };
      var onceMap = function(map, name, callback, offer) {
        if (callback) {
          var once = map[name] = _.once(function() {
            offer(name, once);
            callback.apply(this, arguments);
          });
          once._callback = callback;
        }
        return map;
      };
      Events.trigger = function(name) {
        if (!this._events) return this;
        var length = Math.max(0, arguments.length - 1);
        var args = Array(length);
        for (var i = 0; i < length; i++) args[i] = arguments[i + 1];
        eventsApi(triggerApi, this._events, name, void 0, args);
        return this;
      };
      var triggerApi = function(objEvents, name, callback, args) {
        if (objEvents) {
          var events = objEvents[name];
          var allEvents = objEvents.all;
          if (events && allEvents) allEvents = allEvents.slice();
          if (events) triggerEvents(events, args);
          if (allEvents) triggerEvents(allEvents, [name].concat(args));
        }
        return objEvents;
      };
      var triggerEvents = function(events, args) {
        var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
        switch (args.length) {
          case 0:
            while (++i < l) (ev = events[i]).callback.call(ev.ctx);
            return;
          case 1:
            while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1);
            return;
          case 2:
            while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2);
            return;
          case 3:
            while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3);
            return;
          default:
            while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args);
            return;
        }
      };
      var Listening = function(listener, obj) {
        this.id = listener._listenId;
        this.listener = listener;
        this.obj = obj;
        this.interop = true;
        this.count = 0;
        this._events = void 0;
      };
      Listening.prototype.on = Events.on;
      Listening.prototype.off = function(name, callback) {
        var cleanup;
        if (this.interop) {
          this._events = eventsApi(offApi, this._events, name, callback, {
            context: void 0,
            listeners: void 0
          });
          cleanup = !this._events;
        } else {
          this.count--;
          cleanup = this.count === 0;
        }
        if (cleanup) this.cleanup();
      };
      Listening.prototype.cleanup = function() {
        delete this.listener._listeningTo[this.obj._listenId];
        if (!this.interop) delete this.obj._listeners[this.id];
      };
      Events.bind = Events.on;
      Events.unbind = Events.off;
      _.extend(Backbone, Events);
      var Model = Backbone.Model = function(attributes, options) {
        var attrs = attributes || {};
        options || (options = {});
        this.preinitialize.apply(this, arguments);
        this.cid = _.uniqueId(this.cidPrefix);
        this.attributes = {};
        if (options.collection) this.collection = options.collection;
        if (options.parse) attrs = this.parse(attrs, options) || {};
        var defaults = _.result(this, "defaults");
        attrs = _.defaults(_.extend({}, defaults, attrs), defaults);
        this.set(attrs, options);
        this.changed = {};
        this.initialize.apply(this, arguments);
      };
      _.extend(Model.prototype, Events, {
        // A hash of attributes whose current and previous value differ.
        changed: null,
        // The value returned during the last failed validation.
        validationError: null,
        // The default name for the JSON `id` attribute is `"id"`. MongoDB and
        // CouchDB users may want to set this to `"_id"`.
        idAttribute: "id",
        // The prefix is used to create the client id which is used to identify models locally.
        // You may want to override this if you're experiencing name clashes with model ids.
        cidPrefix: "c",
        // preinitialize is an empty function by default. You can override it with a function
        // or object.  preinitialize will run before any instantiation logic is run in the Model.
        preinitialize: function() {
        },
        // Initialize is an empty function by default. Override it with your own
        // initialization logic.
        initialize: function() {
        },
        // Return a copy of the model's `attributes` object.
        toJSON: function(options) {
          return _.clone(this.attributes);
        },
        // Proxy `Backbone.sync` by default -- but override this if you need
        // custom syncing semantics for *this* particular model.
        sync: function() {
          return Backbone.sync.apply(this, arguments);
        },
        // Get the value of an attribute.
        get: function(attr) {
          return this.attributes[attr];
        },
        // Get the HTML-escaped value of an attribute.
        escape: function(attr) {
          return _.escape(this.get(attr));
        },
        // Returns `true` if the attribute contains a value that is not null
        // or undefined.
        has: function(attr) {
          return this.get(attr) != null;
        },
        // Special-cased proxy to underscore's `_.matches` method.
        matches: function(attrs) {
          return !!_.iteratee(attrs, this)(this.attributes);
        },
        // Set a hash of model attributes on the object, firing `"change"`. This is
        // the core primitive operation of a model, updating the data and notifying
        // anyone who needs to know about the change in state. The heart of the beast.
        set: function(key, val, options) {
          if (key == null) return this;
          var attrs;
          if (typeof key === "object") {
            attrs = key;
            options = val;
          } else {
            (attrs = {})[key] = val;
          }
          options || (options = {});
          if (!this._validate(attrs, options)) return false;
          var unset = options.unset;
          var silent = options.silent;
          var changes = [];
          var changing = this._changing;
          this._changing = true;
          if (!changing) {
            this._previousAttributes = _.clone(this.attributes);
            this.changed = {};
          }
          var current = this.attributes;
          var changed = this.changed;
          var prev = this._previousAttributes;
          for (var attr in attrs) {
            val = attrs[attr];
            if (!_.isEqual(current[attr], val)) changes.push(attr);
            if (!_.isEqual(prev[attr], val)) {
              changed[attr] = val;
            } else {
              delete changed[attr];
            }
            unset ? delete current[attr] : current[attr] = val;
          }
          if (this.idAttribute in attrs) {
            var prevId = this.id;
            this.id = this.get(this.idAttribute);
            if (this.id !== prevId) {
              this.trigger("changeId", this, prevId, options);
            }
          }
          if (!silent) {
            if (changes.length) this._pending = options;
            for (var i = 0; i < changes.length; i++) {
              this.trigger("change:" + changes[i], this, current[changes[i]], options);
            }
          }
          if (changing) return this;
          if (!silent) {
            while (this._pending) {
              options = this._pending;
              this._pending = false;
              this.trigger("change", this, options);
            }
          }
          this._pending = false;
          this._changing = false;
          return this;
        },
        // Remove an attribute from the model, firing `"change"`. `unset` is a noop
        // if the attribute doesn't exist.
        unset: function(attr, options) {
          return this.set(attr, void 0, _.extend({}, options, { unset: true }));
        },
        // Clear all attributes on the model, firing `"change"`.
        clear: function(options) {
          var attrs = {};
          for (var key in this.attributes) attrs[key] = void 0;
          return this.set(attrs, _.extend({}, options, { unset: true }));
        },
        // Determine if the model has changed since the last `"change"` event.
        // If you specify an attribute name, determine if that attribute has changed.
        hasChanged: function(attr) {
          if (attr == null) return !_.isEmpty(this.changed);
          return _.has(this.changed, attr);
        },
        // Return an object containing all the attributes that have changed, or
        // false if there are no changed attributes. Useful for determining what
        // parts of a view need to be updated and/or what attributes need to be
        // persisted to the server. Unset attributes will be set to undefined.
        // You can also pass an attributes object to diff against the model,
        // determining if there *would be* a change.
        changedAttributes: function(diff) {
          if (!diff) return this.hasChanged() ? _.clone(this.changed) : false;
          var old = this._changing ? this._previousAttributes : this.attributes;
          var changed = {};
          var hasChanged;
          for (var attr in diff) {
            var val = diff[attr];
            if (_.isEqual(old[attr], val)) continue;
            changed[attr] = val;
            hasChanged = true;
          }
          return hasChanged ? changed : false;
        },
        // Get the previous value of an attribute, recorded at the time the last
        // `"change"` event was fired.
        previous: function(attr) {
          if (attr == null || !this._previousAttributes) return null;
          return this._previousAttributes[attr];
        },
        // Get all of the attributes of the model at the time of the previous
        // `"change"` event.
        previousAttributes: function() {
          return _.clone(this._previousAttributes);
        },
        // Fetch the model from the server, merging the response with the model's
        // local attributes. Any changed attributes will trigger a "change" event.
        fetch: function(options) {
          options = _.extend({ parse: true }, options);
          var model = this;
          var success = options.success;
          options.success = function(resp) {
            var serverAttrs = options.parse ? model.parse(resp, options) : resp;
            if (!model.set(serverAttrs, options)) return false;
            if (success) success.call(options.context, model, resp, options);
            model.trigger("sync", model, resp, options);
          };
          wrapError(this, options);
          return this.sync("read", this, options);
        },
        // Set a hash of model attributes, and sync the model to the server.
        // If the server returns an attributes hash that differs, the model's
        // state will be `set` again.
        save: function(key, val, options) {
          var attrs;
          if (key == null || typeof key === "object") {
            attrs = key;
            options = val;
          } else {
            (attrs = {})[key] = val;
          }
          options = _.extend({ validate: true, parse: true }, options);
          var wait = options.wait;
          if (attrs && !wait) {
            if (!this.set(attrs, options)) return false;
          } else if (!this._validate(attrs, options)) {
            return false;
          }
          var model = this;
          var success = options.success;
          var attributes = this.attributes;
          options.success = function(resp) {
            model.attributes = attributes;
            var serverAttrs = options.parse ? model.parse(resp, options) : resp;
            if (wait) serverAttrs = _.extend({}, attrs, serverAttrs);
            if (serverAttrs && !model.set(serverAttrs, options)) return false;
            if (success) success.call(options.context, model, resp, options);
            model.trigger("sync", model, resp, options);
          };
          wrapError(this, options);
          if (attrs && wait) this.attributes = _.extend({}, attributes, attrs);
          var method = this.isNew() ? "create" : options.patch ? "patch" : "update";
          if (method === "patch" && !options.attrs) options.attrs = attrs;
          var xhr = this.sync(method, this, options);
          this.attributes = attributes;
          return xhr;
        },
        // Destroy this model on the server if it was already persisted.
        // Optimistically removes the model from its collection, if it has one.
        // If `wait: true` is passed, waits for the server to respond before removal.
        destroy: function(options) {
          options = options ? _.clone(options) : {};
          var model = this;
          var success = options.success;
          var wait = options.wait;
          var destroy = function() {
            model.stopListening();
            model.trigger("destroy", model, model.collection, options);
          };
          options.success = function(resp) {
            if (wait) destroy();
            if (success) success.call(options.context, model, resp, options);
            if (!model.isNew()) model.trigger("sync", model, resp, options);
          };
          var xhr = false;
          if (this.isNew()) {
            _.defer(options.success);
          } else {
            wrapError(this, options);
            xhr = this.sync("delete", this, options);
          }
          if (!wait) destroy();
          return xhr;
        },
        // Default URL for the model's representation on the server -- if you're
        // using Backbone's restful methods, override this to change the endpoint
        // that will be called.
        url: function() {
          var base = _.result(this, "urlRoot") || _.result(this.collection, "url") || urlError();
          if (this.isNew()) return base;
          var id = this.get(this.idAttribute);
          return base.replace(/[^\/]$/, "$&/") + encodeURIComponent(id);
        },
        // **parse** converts a response into the hash of attributes to be `set` on
        // the model. The default implementation is just to pass the response along.
        parse: function(resp, options) {
          return resp;
        },
        // Create a new model with identical attributes to this one.
        clone: function() {
          return new this.constructor(this.attributes);
        },
        // A model is new if it has never been saved to the server, and lacks an id.
        isNew: function() {
          return !this.has(this.idAttribute);
        },
        // Check if the model is currently in a valid state.
        isValid: function(options) {
          return this._validate({}, _.extend({}, options, { validate: true }));
        },
        // Run validation against the next complete set of model attributes,
        // returning `true` if all is well. Otherwise, fire an `"invalid"` event.
        _validate: function(attrs, options) {
          if (!options.validate || !this.validate) return true;
          attrs = _.extend({}, this.attributes, attrs);
          var error = this.validationError = this.validate(attrs, options) || null;
          if (!error) return true;
          this.trigger("invalid", this, error, _.extend(options, { validationError: error }));
          return false;
        }
      });
      var Collection = Backbone.Collection = function(models, options) {
        options || (options = {});
        this.preinitialize.apply(this, arguments);
        if (options.model) this.model = options.model;
        if (options.comparator !== void 0) this.comparator = options.comparator;
        this._reset();
        this.initialize.apply(this, arguments);
        if (models) this.reset(models, _.extend({ silent: true }, options));
      };
      var setOptions = { add: true, remove: true, merge: true };
      var addOptions = { add: true, remove: false };
      var splice = function(array, insert, at) {
        at = Math.min(Math.max(at, 0), array.length);
        var tail = Array(array.length - at);
        var length = insert.length;
        var i;
        for (i = 0; i < tail.length; i++) tail[i] = array[i + at];
        for (i = 0; i < length; i++) array[i + at] = insert[i];
        for (i = 0; i < tail.length; i++) array[i + length + at] = tail[i];
      };
      _.extend(Collection.prototype, Events, {
        // The default model for a collection is just a **Backbone.Model**.
        // This should be overridden in most cases.
        model: Model,
        // preinitialize is an empty function by default. You can override it with a function
        // or object.  preinitialize will run before any instantiation logic is run in the Collection.
        preinitialize: function() {
        },
        // Initialize is an empty function by default. Override it with your own
        // initialization logic.
        initialize: function() {
        },
        // The JSON representation of a Collection is an array of the
        // models' attributes.
        toJSON: function(options) {
          return this.map(function(model) {
            return model.toJSON(options);
          });
        },
        // Proxy `Backbone.sync` by default.
        sync: function() {
          return Backbone.sync.apply(this, arguments);
        },
        // Add a model, or list of models to the set. `models` may be Backbone
        // Models or raw JavaScript objects to be converted to Models, or any
        // combination of the two.
        add: function(models, options) {
          return this.set(models, _.extend({ merge: false }, options, addOptions));
        },
        // Remove a model, or a list of models from the set.
        remove: function(models, options) {
          options = _.extend({}, options);
          var singular = !_.isArray(models);
          models = singular ? [models] : models.slice();
          var removed = this._removeModels(models, options);
          if (!options.silent && removed.length) {
            options.changes = { added: [], merged: [], removed };
            this.trigger("update", this, options);
          }
          return singular ? removed[0] : removed;
        },
        // Update a collection by `set`-ing a new list of models, adding new ones,
        // removing models that are no longer present, and merging models that
        // already exist in the collection, as necessary. Similar to **Model#set**,
        // the core operation for updating the data contained by the collection.
        set: function(models, options) {
          if (models == null) return;
          options = _.extend({}, setOptions, options);
          if (options.parse && !this._isModel(models)) {
            models = this.parse(models, options) || [];
          }
          var singular = !_.isArray(models);
          models = singular ? [models] : models.slice();
          var at = options.at;
          if (at != null) at = +at;
          if (at > this.length) at = this.length;
          if (at < 0) at += this.length + 1;
          var set = [];
          var toAdd = [];
          var toMerge = [];
          var toRemove = [];
          var modelMap = {};
          var add = options.add;
          var merge = options.merge;
          var remove = options.remove;
          var sort = false;
          var sortable = this.comparator && at == null && options.sort !== false;
          var sortAttr = _.isString(this.comparator) ? this.comparator : null;
          var model, i;
          for (i = 0; i < models.length; i++) {
            model = models[i];
            var existing = this.get(model);
            if (existing) {
              if (merge && model !== existing) {
                var attrs = this._isModel(model) ? model.attributes : model;
                if (options.parse) attrs = existing.parse(attrs, options);
                existing.set(attrs, options);
                toMerge.push(existing);
                if (sortable && !sort) sort = existing.hasChanged(sortAttr);
              }
              if (!modelMap[existing.cid]) {
                modelMap[existing.cid] = true;
                set.push(existing);
              }
              models[i] = existing;
            } else if (add) {
              model = models[i] = this._prepareModel(model, options);
              if (model) {
                toAdd.push(model);
                this._addReference(model, options);
                modelMap[model.cid] = true;
                set.push(model);
              }
            }
          }
          if (remove) {
            for (i = 0; i < this.length; i++) {
              model = this.models[i];
              if (!modelMap[model.cid]) toRemove.push(model);
            }
            if (toRemove.length) this._removeModels(toRemove, options);
          }
          var orderChanged = false;
          var replace = !sortable && add && remove;
          if (set.length && replace) {
            orderChanged = this.length !== set.length || _.some(this.models, function(m, index) {
              return m !== set[index];
            });
            this.models.length = 0;
            splice(this.models, set, 0);
            this.length = this.models.length;
          } else if (toAdd.length) {
            if (sortable) sort = true;
            splice(this.models, toAdd, at == null ? this.length : at);
            this.length = this.models.length;
          }
          if (sort) this.sort({ silent: true });
          if (!options.silent) {
            for (i = 0; i < toAdd.length; i++) {
              if (at != null) options.index = at + i;
              model = toAdd[i];
              model.trigger("add", model, this, options);
            }
            if (sort || orderChanged) this.trigger("sort", this, options);
            if (toAdd.length || toRemove.length || toMerge.length) {
              options.changes = {
                added: toAdd,
                removed: toRemove,
                merged: toMerge
              };
              this.trigger("update", this, options);
            }
          }
          return singular ? models[0] : models;
        },
        // When you have more items than you want to add or remove individually,
        // you can reset the entire set with a new list of models, without firing
        // any granular `add` or `remove` events. Fires `reset` when finished.
        // Useful for bulk operations and optimizations.
        reset: function(models, options) {
          options = options ? _.clone(options) : {};
          for (var i = 0; i < this.models.length; i++) {
            this._removeReference(this.models[i], options);
          }
          options.previousModels = this.models;
          this._reset();
          models = this.add(models, _.extend({ silent: true }, options));
          if (!options.silent) this.trigger("reset", this, options);
          return models;
        },
        // Add a model to the end of the collection.
        push: function(model, options) {
          return this.add(model, _.extend({ at: this.length }, options));
        },
        // Remove a model from the end of the collection.
        pop: function(options) {
          var model = this.at(this.length - 1);
          return this.remove(model, options);
        },
        // Add a model to the beginning of the collection.
        unshift: function(model, options) {
          return this.add(model, _.extend({ at: 0 }, options));
        },
        // Remove a model from the beginning of the collection.
        shift: function(options) {
          var model = this.at(0);
          return this.remove(model, options);
        },
        // Slice out a sub-array of models from the collection.
        slice: function() {
          return slice.apply(this.models, arguments);
        },
        // Get a model from the set by id, cid, model object with id or cid
        // properties, or an attributes object that is transformed through modelId.
        get: function(obj) {
          if (obj == null) return void 0;
          return this._byId[obj] || this._byId[this.modelId(this._isModel(obj) ? obj.attributes : obj, obj.idAttribute)] || obj.cid && this._byId[obj.cid];
        },
        // Returns `true` if the model is in the collection.
        has: function(obj) {
          return this.get(obj) != null;
        },
        // Get the model at the given index.
        at: function(index) {
          if (index < 0) index += this.length;
          return this.models[index];
        },
        // Return models with matching attributes. Useful for simple cases of
        // `filter`.
        where: function(attrs, first) {
          return this[first ? "find" : "filter"](attrs);
        },
        // Return the first model with matching attributes. Useful for simple cases
        // of `find`.
        findWhere: function(attrs) {
          return this.where(attrs, true);
        },
        // Force the collection to re-sort itself. You don't need to call this under
        // normal circumstances, as the set will maintain sort order as each item
        // is added.
        sort: function(options) {
          var comparator = this.comparator;
          if (!comparator) throw new Error("Cannot sort a set without a comparator");
          options || (options = {});
          var length = comparator.length;
          if (_.isFunction(comparator)) comparator = comparator.bind(this);
          if (length === 1 || _.isString(comparator)) {
            this.models = this.sortBy(comparator);
          } else {
            this.models.sort(comparator);
          }
          if (!options.silent) this.trigger("sort", this, options);
          return this;
        },
        // Pluck an attribute from each model in the collection.
        pluck: function(attr) {
          return this.map(attr + "");
        },
        // Fetch the default set of models for this collection, resetting the
        // collection when they arrive. If `reset: true` is passed, the response
        // data will be passed through the `reset` method instead of `set`.
        fetch: function(options) {
          options = _.extend({ parse: true }, options);
          var success = options.success;
          var collection = this;
          options.success = function(resp) {
            var method = options.reset ? "reset" : "set";
            collection[method](resp, options);
            if (success) success.call(options.context, collection, resp, options);
            collection.trigger("sync", collection, resp, options);
          };
          wrapError(this, options);
          return this.sync("read", this, options);
        },
        // Create a new instance of a model in this collection. Add the model to the
        // collection immediately, unless `wait: true` is passed, in which case we
        // wait for the server to agree.
        create: function(model, options) {
          options = options ? _.clone(options) : {};
          var wait = options.wait;
          model = this._prepareModel(model, options);
          if (!model) return false;
          if (!wait) this.add(model, options);
          var collection = this;
          var success = options.success;
          options.success = function(m, resp, callbackOpts) {
            if (wait) {
              m.off("error", collection._forwardPristineError, collection);
              collection.add(m, callbackOpts);
            }
            if (success) success.call(callbackOpts.context, m, resp, callbackOpts);
          };
          if (wait) {
            model.once("error", this._forwardPristineError, this);
          }
          model.save(null, options);
          return model;
        },
        // **parse** converts a response into a list of models to be added to the
        // collection. The default implementation is just to pass it through.
        parse: function(resp, options) {
          return resp;
        },
        // Create a new collection with an identical list of models as this one.
        clone: function() {
          return new this.constructor(this.models, {
            model: this.model,
            comparator: this.comparator
          });
        },
        // Define how to uniquely identify models in the collection.
        modelId: function(attrs, idAttribute) {
          return attrs[idAttribute || this.model.prototype.idAttribute || "id"];
        },
        // Get an iterator of all models in this collection.
        values: function() {
          return new CollectionIterator(this, ITERATOR_VALUES);
        },
        // Get an iterator of all model IDs in this collection.
        keys: function() {
          return new CollectionIterator(this, ITERATOR_KEYS);
        },
        // Get an iterator of all [ID, model] tuples in this collection.
        entries: function() {
          return new CollectionIterator(this, ITERATOR_KEYSVALUES);
        },
        // Private method to reset all internal state. Called when the collection
        // is first initialized or reset.
        _reset: function() {
          this.length = 0;
          this.models = [];
          this._byId = {};
        },
        // Prepare a hash of attributes (or other model) to be added to this
        // collection.
        _prepareModel: function(attrs, options) {
          if (this._isModel(attrs)) {
            if (!attrs.collection) attrs.collection = this;
            return attrs;
          }
          options = options ? _.clone(options) : {};
          options.collection = this;
          var model;
          if (this.model.prototype) {
            model = new this.model(attrs, options);
          } else {
            model = this.model(attrs, options);
          }
          if (!model.validationError) return model;
          this.trigger("invalid", this, model.validationError, options);
          return false;
        },
        // Internal method called by both remove and set.
        _removeModels: function(models, options) {
          var removed = [];
          for (var i = 0; i < models.length; i++) {
            var model = this.get(models[i]);
            if (!model) continue;
            var index = this.indexOf(model);
            this.models.splice(index, 1);
            this.length--;
            delete this._byId[model.cid];
            var id = this.modelId(model.attributes, model.idAttribute);
            if (id != null) delete this._byId[id];
            if (!options.silent) {
              options.index = index;
              model.trigger("remove", model, this, options);
            }
            removed.push(model);
            this._removeReference(model, options);
          }
          if (models.length > 0 && !options.silent) delete options.index;
          return removed;
        },
        // Method for checking whether an object should be considered a model for
        // the purposes of adding to the collection.
        _isModel: function(model) {
          return model instanceof Model;
        },
        // Internal method to create a model's ties to a collection.
        _addReference: function(model, options) {
          this._byId[model.cid] = model;
          var id = this.modelId(model.attributes, model.idAttribute);
          if (id != null) this._byId[id] = model;
          model.on("all", this._onModelEvent, this);
        },
        // Internal method to sever a model's ties to a collection.
        _removeReference: function(model, options) {
          delete this._byId[model.cid];
          var id = this.modelId(model.attributes, model.idAttribute);
          if (id != null) delete this._byId[id];
          if (this === model.collection) delete model.collection;
          model.off("all", this._onModelEvent, this);
        },
        // Internal method called every time a model in the set fires an event.
        // Sets need to update their indexes when models change ids. All other
        // events simply proxy through. "add" and "remove" events that originate
        // in other collections are ignored.
        _onModelEvent: function(event, model, collection, options) {
          if (model) {
            if ((event === "add" || event === "remove") && collection !== this) return;
            if (event === "destroy") this.remove(model, options);
            if (event === "changeId") {
              var prevId = this.modelId(model.previousAttributes(), model.idAttribute);
              var id = this.modelId(model.attributes, model.idAttribute);
              if (prevId != null) delete this._byId[prevId];
              if (id != null) this._byId[id] = model;
            }
          }
          this.trigger.apply(this, arguments);
        },
        // Internal callback method used in `create`. It serves as a
        // stand-in for the `_onModelEvent` method, which is not yet bound
        // during the `wait` period of the `create` call. We still want to
        // forward any `'error'` event at the end of the `wait` period,
        // hence a customized callback.
        _forwardPristineError: function(model, collection, options) {
          if (this.has(model)) return;
          this._onModelEvent("error", model, collection, options);
        }
      });
      var $$iterator = typeof Symbol === "function" && Symbol.iterator;
      if ($$iterator) {
        Collection.prototype[$$iterator] = Collection.prototype.values;
      }
      var CollectionIterator = function(collection, kind) {
        this._collection = collection;
        this._kind = kind;
        this._index = 0;
      };
      var ITERATOR_VALUES = 1;
      var ITERATOR_KEYS = 2;
      var ITERATOR_KEYSVALUES = 3;
      if ($$iterator) {
        CollectionIterator.prototype[$$iterator] = function() {
          return this;
        };
      }
      CollectionIterator.prototype.next = function() {
        if (this._collection) {
          if (this._index < this._collection.length) {
            var model = this._collection.at(this._index);
            this._index++;
            var value;
            if (this._kind === ITERATOR_VALUES) {
              value = model;
            } else {
              var id = this._collection.modelId(model.attributes, model.idAttribute);
              if (this._kind === ITERATOR_KEYS) {
                value = id;
              } else {
                value = [id, model];
              }
            }
            return { value, done: false };
          }
          this._collection = void 0;
        }
        return { value: void 0, done: true };
      };
      var View = Backbone.View = function(options) {
        this.cid = _.uniqueId("view");
        this.preinitialize.apply(this, arguments);
        _.extend(this, _.pick(options, viewOptions));
        this._ensureElement();
        this.initialize.apply(this, arguments);
      };
      var delegateEventSplitter = /^(\S+)\s*(.*)$/;
      var viewOptions = ["model", "collection", "el", "id", "attributes", "className", "tagName", "events"];
      _.extend(View.prototype, Events, {
        // The default `tagName` of a View's element is `"div"`.
        tagName: "div",
        // jQuery delegate for element lookup, scoped to DOM elements within the
        // current view. This should be preferred to global lookups where possible.
        $: function(selector) {
          return this.$el.find(selector);
        },
        // preinitialize is an empty function by default. You can override it with a function
        // or object.  preinitialize will run before any instantiation logic is run in the View
        preinitialize: function() {
        },
        // Initialize is an empty function by default. Override it with your own
        // initialization logic.
        initialize: function() {
        },
        // **render** is the core function that your view should override, in order
        // to populate its element (`this.el`), with the appropriate HTML. The
        // convention is for **render** to always return `this`.
        render: function() {
          return this;
        },
        // Remove this view by taking the element out of the DOM, and removing any
        // applicable Backbone.Events listeners.
        remove: function() {
          this._removeElement();
          this.stopListening();
          return this;
        },
        // Remove this view's element from the document and all event listeners
        // attached to it. Exposed for subclasses using an alternative DOM
        // manipulation API.
        _removeElement: function() {
          this.$el.remove();
        },
        // Change the view's element (`this.el` property) and re-delegate the
        // view's events on the new element.
        setElement: function(element) {
          this.undelegateEvents();
          this._setElement(element);
          this.delegateEvents();
          return this;
        },
        // Creates the `this.el` and `this.$el` references for this view using the
        // given `el`. `el` can be a CSS selector or an HTML string, a jQuery
        // context or an element. Subclasses can override this to utilize an
        // alternative DOM manipulation API and are only required to set the
        // `this.el` property.
        _setElement: function(el) {
          this.$el = el instanceof Backbone.$ ? el : Backbone.$(el);
          this.el = this.$el[0];
        },
        // Set callbacks, where `this.events` is a hash of
        //
        // *{"event selector": "callback"}*
        //
        //     {
        //       'mousedown .title':  'edit',
        //       'click .button':     'save',
        //       'click .open':       function(e) { ... }
        //     }
        //
        // pairs. Callbacks will be bound to the view, with `this` set properly.
        // Uses event delegation for efficiency.
        // Omitting the selector binds the event to `this.el`.
        delegateEvents: function(events) {
          events || (events = _.result(this, "events"));
          if (!events) return this;
          this.undelegateEvents();
          for (var key in events) {
            var method = events[key];
            if (!_.isFunction(method)) method = this[method];
            if (!method) continue;
            var match = key.match(delegateEventSplitter);
            this.delegate(match[1], match[2], method.bind(this));
          }
          return this;
        },
        // Add a single event listener to the view's element (or a child element
        // using `selector`). This only works for delegate-able events: not `focus`,
        // `blur`, and not `change`, `submit`, and `reset` in Internet Explorer.
        delegate: function(eventName, selector, listener) {
          this.$el.on(eventName + ".delegateEvents" + this.cid, selector, listener);
          return this;
        },
        // Clears all callbacks previously bound to the view by `delegateEvents`.
        // You usually don't need to use this, but may wish to if you have multiple
        // Backbone views attached to the same DOM element.
        undelegateEvents: function() {
          if (this.$el) this.$el.off(".delegateEvents" + this.cid);
          return this;
        },
        // A finer-grained `undelegateEvents` for removing a single delegated event.
        // `selector` and `listener` are both optional.
        undelegate: function(eventName, selector, listener) {
          this.$el.off(eventName + ".delegateEvents" + this.cid, selector, listener);
          return this;
        },
        // Produces a DOM element to be assigned to your view. Exposed for
        // subclasses using an alternative DOM manipulation API.
        _createElement: function(tagName) {
          return document.createElement(tagName);
        },
        // Ensure that the View has a DOM element to render into.
        // If `this.el` is a string, pass it through `$()`, take the first
        // matching element, and re-assign it to `el`. Otherwise, create
        // an element from the `id`, `className` and `tagName` properties.
        _ensureElement: function() {
          if (!this.el) {
            var attrs = _.extend({}, _.result(this, "attributes"));
            if (this.id) attrs.id = _.result(this, "id");
            if (this.className) attrs["class"] = _.result(this, "className");
            this.setElement(this._createElement(_.result(this, "tagName")));
            this._setAttributes(attrs);
          } else {
            this.setElement(_.result(this, "el"));
          }
        },
        // Set attributes from a hash on this view's element.  Exposed for
        // subclasses using an alternative DOM manipulation API.
        _setAttributes: function(attributes) {
          this.$el.attr(attributes);
        }
      });
      var addMethod = function(base, length, method, attribute) {
        switch (length) {
          case 1:
            return function() {
              return base[method](this[attribute]);
            };
          case 2:
            return function(value) {
              return base[method](this[attribute], value);
            };
          case 3:
            return function(iteratee, context) {
              return base[method](this[attribute], cb(iteratee, this), context);
            };
          case 4:
            return function(iteratee, defaultVal, context) {
              return base[method](this[attribute], cb(iteratee, this), defaultVal, context);
            };
          default:
            return function() {
              var args = slice.call(arguments);
              args.unshift(this[attribute]);
              return base[method].apply(base, args);
            };
        }
      };
      var addUnderscoreMethods = function(Class, base, methods, attribute) {
        _.each(methods, function(length, method) {
          if (base[method]) Class.prototype[method] = addMethod(base, length, method, attribute);
        });
      };
      var cb = function(iteratee, instance) {
        if (_.isFunction(iteratee)) return iteratee;
        if (_.isObject(iteratee) && !instance._isModel(iteratee)) return modelMatcher(iteratee);
        if (_.isString(iteratee)) return function(model) {
          return model.get(iteratee);
        };
        return iteratee;
      };
      var modelMatcher = function(attrs) {
        var matcher = _.matches(attrs);
        return function(model) {
          return matcher(model.attributes);
        };
      };
      var collectionMethods = {
        forEach: 3,
        each: 3,
        map: 3,
        collect: 3,
        reduce: 0,
        foldl: 0,
        inject: 0,
        reduceRight: 0,
        foldr: 0,
        find: 3,
        detect: 3,
        filter: 3,
        select: 3,
        reject: 3,
        every: 3,
        all: 3,
        some: 3,
        any: 3,
        include: 3,
        includes: 3,
        contains: 3,
        invoke: 0,
        max: 3,
        min: 3,
        toArray: 1,
        size: 1,
        first: 3,
        head: 3,
        take: 3,
        initial: 3,
        rest: 3,
        tail: 3,
        drop: 3,
        last: 3,
        without: 0,
        difference: 0,
        indexOf: 3,
        shuffle: 1,
        lastIndexOf: 3,
        isEmpty: 1,
        chain: 1,
        sample: 3,
        partition: 3,
        groupBy: 3,
        countBy: 3,
        sortBy: 3,
        indexBy: 3,
        findIndex: 3,
        findLastIndex: 3
      };
      var modelMethods = {
        keys: 1,
        values: 1,
        pairs: 1,
        invert: 1,
        pick: 0,
        omit: 0,
        chain: 1,
        isEmpty: 1
      };
      _.each([
        [Collection, collectionMethods, "models"],
        [Model, modelMethods, "attributes"]
      ], function(config) {
        var Base = config[0], methods = config[1], attribute = config[2];
        Base.mixin = function(obj) {
          var mappings = _.reduce(_.functions(obj), function(memo, name) {
            memo[name] = 0;
            return memo;
          }, {});
          addUnderscoreMethods(Base, obj, mappings, attribute);
        };
        addUnderscoreMethods(Base, _, methods, attribute);
      });
      Backbone.sync = function(method, model, options) {
        var type = methodMap[method];
        _.defaults(options || (options = {}), {
          emulateHTTP: Backbone.emulateHTTP,
          emulateJSON: Backbone.emulateJSON
        });
        var params = { type, dataType: "json" };
        if (!options.url) {
          params.url = _.result(model, "url") || urlError();
        }
        if (options.data == null && model && (method === "create" || method === "update" || method === "patch")) {
          params.contentType = "application/json";
          params.data = JSON.stringify(options.attrs || model.toJSON(options));
        }
        if (options.emulateJSON) {
          params.contentType = "application/x-www-form-urlencoded";
          params.data = params.data ? { model: params.data } : {};
        }
        if (options.emulateHTTP && (type === "PUT" || type === "DELETE" || type === "PATCH")) {
          params.type = "POST";
          if (options.emulateJSON) params.data._method = type;
          var beforeSend = options.beforeSend;
          options.beforeSend = function(xhr2) {
            xhr2.setRequestHeader("X-HTTP-Method-Override", type);
            if (beforeSend) return beforeSend.apply(this, arguments);
          };
        }
        if (params.type !== "GET" && !options.emulateJSON) {
          params.processData = false;
        }
        var error = options.error;
        options.error = function(xhr2, textStatus, errorThrown) {
          options.textStatus = textStatus;
          options.errorThrown = errorThrown;
          if (error) error.call(options.context, xhr2, textStatus, errorThrown);
        };
        var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
        model.trigger("request", model, xhr, options);
        return xhr;
      };
      var methodMap = {
        "create": "POST",
        "update": "PUT",
        "patch": "PATCH",
        "delete": "DELETE",
        "read": "GET"
      };
      Backbone.ajax = function() {
        return Backbone.$.ajax.apply(Backbone.$, arguments);
      };
      var Router = Backbone.Router = function(options) {
        options || (options = {});
        this.preinitialize.apply(this, arguments);
        if (options.routes) this.routes = options.routes;
        this._bindRoutes();
        this.initialize.apply(this, arguments);
      };
      var optionalParam = /\((.*?)\)/g;
      var namedParam = /(\(\?)?:\w+/g;
      var splatParam = /\*\w+/g;
      var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;
      _.extend(Router.prototype, Events, {
        // preinitialize is an empty function by default. You can override it with a function
        // or object.  preinitialize will run before any instantiation logic is run in the Router.
        preinitialize: function() {
        },
        // Initialize is an empty function by default. Override it with your own
        // initialization logic.
        initialize: function() {
        },
        // Manually bind a single named route to a callback. For example:
        //
        //     this.route('search/:query/p:num', 'search', function(query, num) {
        //       ...
        //     });
        //
        route: function(route, name, callback) {
          if (!_.isRegExp(route)) route = this._routeToRegExp(route);
          if (_.isFunction(name)) {
            callback = name;
            name = "";
          }
          if (!callback) callback = this[name];
          var router = this;
          Backbone.history.route(route, function(fragment) {
            var args = router._extractParameters(route, fragment);
            if (router.execute(callback, args, name) !== false) {
              router.trigger.apply(router, ["route:" + name].concat(args));
              router.trigger("route", name, args);
              Backbone.history.trigger("route", router, name, args);
            }
          });
          return this;
        },
        // Execute a route handler with the provided parameters.  This is an
        // excellent place to do pre-route setup or post-route cleanup.
        execute: function(callback, args, name) {
          if (callback) callback.apply(this, args);
        },
        // Simple proxy to `Backbone.history` to save a fragment into the history.
        navigate: function(fragment, options) {
          Backbone.history.navigate(fragment, options);
          return this;
        },
        // Bind all defined routes to `Backbone.history`. We have to reverse the
        // order of the routes here to support behavior where the most general
        // routes can be defined at the bottom of the route map.
        _bindRoutes: function() {
          if (!this.routes) return;
          this.routes = _.result(this, "routes");
          var route, routes = _.keys(this.routes);
          while ((route = routes.pop()) != null) {
            this.route(route, this.routes[route]);
          }
        },
        // Convert a route string into a regular expression, suitable for matching
        // against the current location hash.
        _routeToRegExp: function(route) {
          route = route.replace(escapeRegExp, "\\$&").replace(optionalParam, "(?:$1)?").replace(namedParam, function(match, optional) {
            return optional ? match : "([^/?]+)";
          }).replace(splatParam, "([^?]*?)");
          return new RegExp("^" + route + "(?:\\?([\\s\\S]*))?$");
        },
        // Given a route, and a URL fragment that it matches, return the array of
        // extracted decoded parameters. Empty or unmatched parameters will be
        // treated as `null` to normalize cross-browser behavior.
        _extractParameters: function(route, fragment) {
          var params = route.exec(fragment).slice(1);
          return _.map(params, function(param, i) {
            if (i === params.length - 1) return param || null;
            return param ? decodeURIComponent(param) : null;
          });
        }
      });
      var History = Backbone.History = function() {
        this.handlers = [];
        this.checkUrl = this.checkUrl.bind(this);
        if (typeof window !== "undefined") {
          this.location = window.location;
          this.history = window.history;
        }
      };
      var routeStripper = /^[#\/]|\s+$/g;
      var rootStripper = /^\/+|\/+$/g;
      var pathStripper = /#.*$/;
      History.started = false;
      _.extend(History.prototype, Events, {
        // The default interval to poll for hash changes, if necessary, is
        // twenty times a second.
        interval: 50,
        // Are we at the app root?
        atRoot: function() {
          var path = this.location.pathname.replace(/[^\/]$/, "$&/");
          return path === this.root && !this.getSearch();
        },
        // Does the pathname match the root?
        matchRoot: function() {
          var path = this.decodeFragment(this.location.pathname);
          var rootPath = path.slice(0, this.root.length - 1) + "/";
          return rootPath === this.root;
        },
        // Unicode characters in `location.pathname` are percent encoded so they're
        // decoded for comparison. `%25` should not be decoded since it may be part
        // of an encoded parameter.
        decodeFragment: function(fragment) {
          return decodeURI(fragment.replace(/%25/g, "%2525"));
        },
        // In IE6, the hash fragment and search params are incorrect if the
        // fragment contains `?`.
        getSearch: function() {
          var match = this.location.href.replace(/#.*/, "").match(/\?.+/);
          return match ? match[0] : "";
        },
        // Gets the true hash value. Cannot use location.hash directly due to bug
        // in Firefox where location.hash will always be decoded.
        getHash: function(window2) {
          var match = (window2 || this).location.href.match(/#(.*)$/);
          return match ? match[1] : "";
        },
        // Get the pathname and search params, without the root.
        getPath: function() {
          var path = this.decodeFragment(
            this.location.pathname + this.getSearch()
          ).slice(this.root.length - 1);
          return path.charAt(0) === "/" ? path.slice(1) : path;
        },
        // Get the cross-browser normalized URL fragment from the path or hash.
        getFragment: function(fragment) {
          if (fragment == null) {
            if (this._usePushState || !this._wantsHashChange) {
              fragment = this.getPath();
            } else {
              fragment = this.getHash();
            }
          }
          return fragment.replace(routeStripper, "");
        },
        // Start the hash change handling, returning `true` if the current URL matches
        // an existing route, and `false` otherwise.
        start: function(options) {
          if (History.started) throw new Error("Backbone.history has already been started");
          History.started = true;
          this.options = _.extend({ root: "/" }, this.options, options);
          this.root = this.options.root;
          this._trailingSlash = this.options.trailingSlash;
          this._wantsHashChange = this.options.hashChange !== false;
          this._hasHashChange = "onhashchange" in window && (document.documentMode === void 0 || document.documentMode > 7);
          this._useHashChange = this._wantsHashChange && this._hasHashChange;
          this._wantsPushState = !!this.options.pushState;
          this._hasPushState = !!(this.history && this.history.pushState);
          this._usePushState = this._wantsPushState && this._hasPushState;
          this.fragment = this.getFragment();
          this.root = ("/" + this.root + "/").replace(rootStripper, "/");
          if (this._wantsHashChange && this._wantsPushState) {
            if (!this._hasPushState && !this.atRoot()) {
              var rootPath = this.root.slice(0, -1) || "/";
              this.location.replace(rootPath + "#" + this.getPath());
              return true;
            } else if (this._hasPushState && this.atRoot()) {
              this.navigate(this.getHash(), { replace: true });
            }
          }
          if (!this._hasHashChange && this._wantsHashChange && !this._usePushState) {
            this.iframe = document.createElement("iframe");
            this.iframe.src = "javascript:0";
            this.iframe.style.display = "none";
            this.iframe.tabIndex = -1;
            var body = document.body;
            var iWindow = body.insertBefore(this.iframe, body.firstChild).contentWindow;
            iWindow.document.open();
            iWindow.document.close();
            iWindow.location.hash = "#" + this.fragment;
          }
          var addEventListener = window.addEventListener || function(eventName, listener) {
            return attachEvent("on" + eventName, listener);
          };
          if (this._usePushState) {
            addEventListener("popstate", this.checkUrl, false);
          } else if (this._useHashChange && !this.iframe) {
            addEventListener("hashchange", this.checkUrl, false);
          } else if (this._wantsHashChange) {
            this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
          }
          if (!this.options.silent) return this.loadUrl();
        },
        // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
        // but possibly useful for unit testing Routers.
        stop: function() {
          var removeEventListener = window.removeEventListener || function(eventName, listener) {
            return detachEvent("on" + eventName, listener);
          };
          if (this._usePushState) {
            removeEventListener("popstate", this.checkUrl, false);
          } else if (this._useHashChange && !this.iframe) {
            removeEventListener("hashchange", this.checkUrl, false);
          }
          if (this.iframe) {
            document.body.removeChild(this.iframe);
            this.iframe = null;
          }
          if (this._checkUrlInterval) clearInterval(this._checkUrlInterval);
          History.started = false;
        },
        // Add a route to be tested when the fragment changes. Routes added later
        // may override previous routes.
        route: function(route, callback) {
          this.handlers.unshift({ route, callback });
        },
        // Checks the current URL to see if it has changed, and if it has,
        // calls `loadUrl`, normalizing across the hidden iframe.
        checkUrl: function(e) {
          var current = this.getFragment();
          if (current === this.fragment && this.iframe) {
            current = this.getHash(this.iframe.contentWindow);
          }
          if (current === this.fragment) {
            if (!this.matchRoot()) return this.notfound();
            return false;
          }
          if (this.iframe) this.navigate(current);
          this.loadUrl();
        },
        // Attempt to load the current URL fragment. If a route succeeds with a
        // match, returns `true`. If no defined routes matches the fragment,
        // returns `false`.
        loadUrl: function(fragment) {
          if (!this.matchRoot()) return this.notfound();
          fragment = this.fragment = this.getFragment(fragment);
          return _.some(this.handlers, function(handler) {
            if (handler.route.test(fragment)) {
              handler.callback(fragment);
              return true;
            }
          }) || this.notfound();
        },
        // When no route could be matched, this method is called internally to
        // trigger the `'notfound'` event. It returns `false` so that it can be used
        // in tail position.
        notfound: function() {
          this.trigger("notfound");
          return false;
        },
        // Save a fragment into the hash history, or replace the URL state if the
        // 'replace' option is passed. You are responsible for properly URL-encoding
        // the fragment in advance.
        //
        // The options object can contain `trigger: true` if you wish to have the
        // route callback be fired (not usually desirable), or `replace: true`, if
        // you wish to modify the current URL without adding an entry to the history.
        navigate: function(fragment, options) {
          if (!History.started) return false;
          if (!options || options === true) options = { trigger: !!options };
          fragment = this.getFragment(fragment || "");
          var rootPath = this.root;
          if (!this._trailingSlash && (fragment === "" || fragment.charAt(0) === "?")) {
            rootPath = rootPath.slice(0, -1) || "/";
          }
          var url = rootPath + fragment;
          fragment = fragment.replace(pathStripper, "");
          var decodedFragment = this.decodeFragment(fragment);
          if (this.fragment === decodedFragment) return;
          this.fragment = decodedFragment;
          if (this._usePushState) {
            this.history[options.replace ? "replaceState" : "pushState"]({}, document.title, url);
          } else if (this._wantsHashChange) {
            this._updateHash(this.location, fragment, options.replace);
            if (this.iframe && fragment !== this.getHash(this.iframe.contentWindow)) {
              var iWindow = this.iframe.contentWindow;
              if (!options.replace) {
                iWindow.document.open();
                iWindow.document.close();
              }
              this._updateHash(iWindow.location, fragment, options.replace);
            }
          } else {
            return this.location.assign(url);
          }
          if (options.trigger) return this.loadUrl(fragment);
        },
        // Update the hash location, either replacing the current entry, or adding
        // a new one to the browser history.
        _updateHash: function(location, fragment, replace) {
          if (replace) {
            var href = location.href.replace(/(javascript:|#).*$/, "");
            location.replace(href + "#" + fragment);
          } else {
            location.hash = "#" + fragment;
          }
        }
      });
      Backbone.history = new History();
      var extend = function(protoProps, staticProps) {
        var parent = this;
        var child;
        if (protoProps && _.has(protoProps, "constructor")) {
          child = protoProps.constructor;
        } else {
          child = function() {
            return parent.apply(this, arguments);
          };
        }
        _.extend(child, parent, staticProps);
        child.prototype = _.create(parent.prototype, protoProps);
        child.prototype.constructor = child;
        child.__super__ = parent.prototype;
        return child;
      };
      Model.extend = Collection.extend = Router.extend = View.extend = History.extend = extend;
      var urlError = function() {
        throw new Error('A "url" property or function must be specified');
      };
      var wrapError = function(model, options) {
        var error = options.error;
        options.error = function(resp) {
          if (error) error.call(options.context, model, resp, options);
          model.trigger("error", model, resp, options);
        };
      };
      Backbone._debug = function() {
        return { root, _ };
      };
      return Backbone;
    });
  }
});
export default require_backbone();
//# sourceMappingURL=backbone.js.map
