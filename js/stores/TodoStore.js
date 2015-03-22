/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * TodoStore
 */

var _ = require('underscore');
var Backbone = require('backbone');

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'change';

var _todos = new Backbone.Model();

/**
 * Create a TODO item.
 * @param  {string} text The content of the TODO
 */
function create(text) {
  // Hand waving here -- not showing how this interacts with XHR or persistent
  // server-side storage.
  // Using the current timestamp in place of a real id.
  var id = Date.now();
  _todos.set(id, {
    id: id,
    complete: false,
    text: text
  });
}

/**
 * Update a TODO item.
 * @param  {string} id
 * @param {object} updates An object literal containing only the data to be
 *     updated.
 */
function update(id, updates) {
  var beforeUpdate = _.clone( _todos.get(id) );
  var updated = _.extend( beforeUpdate, updates);
  _todos.set(id, updated);
}

/**
 * Update all of the TODO items with the same object.
 *     the data to be updated.  Used to mark all TODOs as completed.
 * @param  {object} updates An object literal containing only the data to be
 *     updated.

 */
function updateAll(updates) {
  _.each(_todos.keys(), function(id){
    update(id, updates);
  });
}

/**
 * Delete a TODO item.
 * @param  {string} id
 */
function destroy(id) {
  _todos.unset(id);
}

/**
 * Delete all the completed TODO items.
 */
function destroyCompleted() {
  _.each(_todos.keys(), function(id){
    if (_todos.get(id).complete) {
      destroy(id);
    }
  });
}

var TodoStore = _.extend(_todos, {

  /**
   * Tests whether all the remaining TODO items are marked as completed.
   * @return {booleam}
   */
  areAllComplete: function() {
    return _.every(_todos.keys(), function(id){
      return _todos.get(id).complete;
    });
  },

  /**
   * Get the entire collection of TODOs.
   * @return {object}
   */
  getAll: function() {
    return _todos.toJSON();
  }
});

// Register to handle all updates
AppDispatcher.on('all', function(eventName, payload) {
  var text;

  switch(eventName) {
    case 'create':
      text = payload.text.trim();
      if (text !== '') {
        create(text);
      }
      break;

    case 'toggleCompleteAll':
      if (TodoStore.areAllComplete()) {
        updateAll({complete: false});
      } else {
        updateAll({complete: true});
      }
      break;

    case 'undoComplete':
      update(payload.id, {complete: false});
      break;

    case 'complete':
      update(payload.id, {complete: true});
      break;

    case 'updateText':
      text = payload.text.trim();
      if (text !== '') {
        update(payload.id, {text: text});
      }
      break;

    case 'destroy':
      destroy(payload.id);
      break;

    case 'destroyCompleted':
      destroyCompleted();
      break;

    default:
      return;
  }

});

module.exports = TodoStore;
