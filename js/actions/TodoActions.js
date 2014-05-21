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
 * TodoActions
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var TodoConstants = require('../constants/TodoConstants');

var TodoActions = {

  /**
   * @param  {string} text
   */
  create: function(text) {
    AppDispatcher.trigger('create', {
      text: text
    });
  },

  /**
   * @param  {string} id The ID of the ToDo item
   * @param  {string} text
   */
  updateText: function(id, text) {
    AppDispatcher.trigger('updateText', {
      id: id,
      text: text
    });
  },

  /**
   * Toggle whether a single ToDo is complete
   * @param  {object} todo
   */
  toggleComplete: function(todo) {
    var id = todo.id;
    if (todo.complete) {
      AppDispatcher.trigger('undoComplete', {
        id: id
      });
    } else {
      AppDispatcher.trigger('complete', {
        id: id
      });
    }
  },

  /**
   * Mark all ToDos as complete
   */
  toggleCompleteAll: function() {
    AppDispatcher.trigger('toggleCompleteAll');
  },

  /**
   * @param  {string} id
   */
  destroy: function(id) {
    AppDispatcher.trigger('destroy', {
      id: id
    });
  },

  /**
   * Delete all the completed ToDos
   */
  destroyCompleted: function() {
    AppDispatcher.trigger('destroyCompleted');
  }

};

module.exports = TodoActions;
