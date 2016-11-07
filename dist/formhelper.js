(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('jquery'), require('jquery-serializejson')) :
  typeof define === 'function' && define.amd ? define('formhelper', ['jquery', 'jquery-serializejson'], factory) :
  (global.formHelper = factory(global.jQuery,global.serializeJSON));
}(this, (function (jQuery,jquerySerializejson) { 'use strict';

jQuery = 'default' in jQuery ? jQuery['default'] : jQuery;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();















var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

/**
 * Object used to define actions FormHelper will take upon form submission and
 * XHR lifecycle
 *
 * @typedef {Object} FormRule
 * @namespace FormRule
 *
 * @property {String} form - Form CSS selector string
 *
 * @property {String} [action] - Where to post the XHR request. If ommitted,
 * will use the form's 'action' attribute value
 *
 * @property {Object} [xhrOptions] - Custom XHR options to use. See [jQuery documentation]{@link http://api.jquery.com/jQuery.ajax/#jQuery-ajax-settings}
 * for full list of options
 *
 * @property {Object} [data] - Additional post data. Useful for defaults or
 * 'always args'<br><br>
 *
 * Note the order order in which data is merged (later items take
 * precedence):
 * <ol>
 *   <li>formHelper.FormHelperRequest.Defaults.xhrOptions.data
 *   <li>rule.xhrOptions.data
 *   <li>rule.data
 *   <li>serialized form data
 * </ol>
 *
 * @property {Boolean} [isMultiForm] - Modify [$form]{@link formHelper.FormHelperRequest#$form}
 * to be the set of all matched {@link FormRule.form} elements as opposed to the
 * single submitted form, i.e. treat multiple forms as one single big form
 *
 * @property {Boolean} [disableControls] - Automatically disable form controls
 * during submit
 *
 * @property {Boolean} [scrollIntoViewOnUIUpdate] - Automatically scroll the form
 * into view (if it isn't already) if response caused us to modify the DOM
 *
 * @property {Boolean} [focusFirstErroredControl] - Automatically focuses
 * the first errored control
 *
 * @property {Boolean} [blankAllPasswordsOnSubmit] - Automatically call
 * [blankAllPasswordFields]{@link formHelper.FormHelperRequest#blankAllPasswordFields} on submit
 *
 * @property {Boolean} [releaseFormAndUpdateUIOnXHRSuccess] - Automatically call
 * [releaseForm]{@link formHelper.FormHelperRequestController#releaseForm} and
 * [updateUI]{@link formHelper.FormHelperRequestController#updateUI} after
 * [xhrSuccess]{@link formHelper.FormHelperRequestController#xhrSuccess}
 *
 * @property {FormRule.xhrReady} [xhrReady] - Callback fired when [xhrOptions]{@link formHelper.FormHelperRequest#xhrOptions}
 * has been created but before the actual jqXHR has been created. <b>The most
 * relevant non-StatusHandler callback</b>
 *
 * @property {FormRule.xhrBeforeSend} [xhrBeforeSend] - Callback fired during
 * the jqXHR beforeSend event:
 * <blockquote>
 * <b>[beforeSend]{@link http://api.jquery.com/Ajax_Events/}</b><br>
 * This event, which is triggered before an Ajax request is started, allows you
 * to modify the XMLHttpRequest object (setting additional headers, if need be.)
 * </blockquote>
 *
 * @property {FormRule.xhrSuccess} [xhrSuccess] - Callback fired during the
 * jqXHR success event:
 * <blockquote>
 * <b>[success]{@link http://api.jquery.com/Ajax_Events/}</b><br>
 * This event is only called if the request was successful (no errors from the
 * server, no errors with the data).
 * </blockquote>
 *
 * @property {FormRule.xhrComplete} [xhrComplete] - Callback fired during the
 * jqXHR complete event:
 * <blockquote>
 * <b>[complete]{@link http://api.jquery.com/Ajax_Events/}</b><br>
 * This event is called regardless of if the request was successful, or not. You
 * will always receive a complete callback, even for synchronous requests.
 * </blockquote>
 *
 * @property {FormRule.xhrError} [xhrError] - Callback fired during the jqXHR
 * error event:
 * <blockquote>
 * <b>[error]{@link http://api.jquery.com/Ajax_Events/}</b><br>
 * This event is only called if an error occurred with the request (you can
 * never have both an error and a success callback with a request).
 * </blockquote>
 *
 * @property {Function} [requestController] - Class to instantiate to handle
 * FormRule execution. Defaults to [FormHelperRequest]{@link formHelper.FormHelperRequest}
 *
 * @property {Function} [customSubmitHandler] - Prevents FormHelper from creating
 * a [FormHelperRequest]{@link formHelper.FormHelperRequest} on submit and calls
 * this function instead.
 *
 * @property {Function} [onComplete] - Callback fired after when FormHelperRequest
 * is complete.
 *
 * @property {Object.<String, FormRule.StatusHandler>} [status]
 * Object with keys matching {@link FormHelperResponse} status codes and their
 * accompanying StatusHandlers. Only the StatusHandler registered for the
 * returned status code will be invoked
 *
 * @example
 * {
 *   form: '#form-login',
 *   action: '/h/module/loginForm',
 *
 *   xhrOptions: {
 *     type: 'POST', // Default value
 *     data: {
 *       foo: 'bar'
 *     }
 *   },
 *
 *   data: {
 *     foo: 'bar',
 *     baz: 'qux'
 *   },
 *
 *   xhrReady: function(xhrOptions) {
 *     // Everything is prepared, about to create jqXHR
 *   },
 *   xhrBeforeSend: function(jqXHR, settings) {
 *     // jqXHR instantiated, about to make the request
 *   },
 *   xhrSuccess: function(data, textStatus, jqXHR) {
 *     // Response received, all good.
 *   },
 *   xhrError: function(jqXHR, textStatus, errorThrown) {
 *     // Something went wrong...
 *   },
 *   xhrComplete: function(jqXHR, textStatus) {
 *     // jqXHR complete
 *   },
 *
 *   status: {
 *     SUCCESS: '/account', // Login successful, redirect user
 *     ERROR: function() {
 *       // Fired on a response status code of 'error'
 *       this.find('#fancy-error-message').show();
 *     }
 *   }
 * }
 *
 * @example
 * {
 *   form: '#form-sign-up',
 *   action: '/h/module/signup',
 *
 *   xhrReady: function(xhrOptions) {
 *    if (xhrOptions.data.accepts !== '1') {
 *      this.cancel();
 *      this.find('#message-accept-terms').show();
 *    }
 *   },
 *
 *   status: {
 *     SUCCESS: function() {
 *       this.$form.html(this.data);
 *     }
 *   }
 * }
 */

/**
 * @typedef {(fn|String)} StatusHandler
 * @memberOf FormRule
 * @description
 * Handler for a given {@link FormHelperResponse} status. Can either be a
 * function or a string. If it's a function, it will be called in the context of
 * the [FormHelperRequest]{@link formHelper.FormHelperRequest} instance. If it's
 * a string, the browser will be forwarded to the given URL/path.
 * @example
 * // Update UI appropriately for this status code
 * function() {
 *   this.find("#update-success").show();
 *   this.scrollToTopOfForm();
 * }
 * @example
 * // Forward the browser to '/account/main'
 * '/account/main'
 */

/**
 * @callback xhrReady
 * @memberOf FormRule
 * @param  {Object} xhrOptions - Complete XHR options object
 */

/**
 * @callback xhrBeforeSend
 * @memberOf FormRule
 * @param  {jqXHR} jqXHR - Prepared [jQuery XMLHttpRequest object]{@link http://api.jquery.com/jQuery.ajax/#jqXHR}
 * @param  {object} settings - jqXHR settings object
 */

/**
 * @callback xhrComplete
 * @memberOf FormRule
 * @param  {jqXHR} jqXHR - [jQuery XMLHttpRequest object]{@link http://api.jquery.com/jQuery.ajax/#jqXHR}
 * @param  {String} textStatus jQuery request status
 */

/**
 * @callback xhrSuccess
 * @memberOf FormRule
 * @param  {object} data Response payload
 * @param  {String} textStatus jQuery request status
 * @param  {jqXHR} jqXHR - [jQuery XMLHttpRequest object]{@link http://api.jquery.com/jQuery.ajax/#jqXHR}
 */

/**
 * @callback xhrError
 * @memberOf FormRule
 * @param  {jqXHR} jqXHR - [jQuery XMLHttpRequest object]{@link http://api.jquery.com/jQuery.ajax/#jqXHR}
 * @param  {String} textStatus jQuery request status
 * @param  {String} errorThrown HTTP status – 'Not Found', 'Internal Server
 * Error', etc.
 */

/**
 * This describes the expected format of a FormHelperRequest JSON response
 *
 * @typedef {Object} FormHelperResponse
 * @namespace FormHelperResponse
 *
 * @property {String} status Custom status code for the request. Form Helper
 * will try to make visible any elements within the form having a class matching
 * the pattern <code>js-fh-status-{status}</code>. Optionally maps to a
 * {@link FormRule.StatusHandler} for additional logic
 *
 * @property [data] Arbitrary data. Typically HTML or additional JSON data
 *
 * @property {Array.<FormHelperResponse.RequestError>} [errors] Any errors and
 * metadata for the request
 *
 * @example
 * {
 *   "status": "ERROR",
 *   "errors": [
 *     {
 *       "code": "pw-too-short",
 *       "message": "password must be at least 8 characters",
 *       "params": [
 *         "password",
 *         "password-confirm"
 *       ]
 *     },
 *     {
 *       "code": "incomplete-address",
 *       "message": "missing address fields",
 *       "params": [
 *         "city"
 *       ]
 *     }
 *   ]
 * }
 *
 * @example
 * {
 *   "status": "SUCCESS",
 *   "data": "<div>Thank you!</div>"
 * }
 */

/**
 * @typedef {Object} RequestError
 * @memberOf FormHelperResponse
 *
 * @property {String} code User defined error code. Form Helper will try to make
 * visible any elements within the form having a class matching the pattern
 * <code>js-fh-error-{code}</code>
 *
 * @property {String} [message] Developer-only details and/or description of the
 * error. Not used by Form Helper
 *
 * @property {Array.String} [params] Array of request parameters, i.e. form
 * inputs, that are associated with the RequestError
 *
 * @example
 * {
 *   "code": "login-failure",
 *   "message": "Email address and/or password invalid",
 *   "params": [
 *     "email-address",
 *     "password",
 *     "password-confirm"
 *   ]
 * }
 */

/**
* @namespace formHelper
*/

var $ = jQuery;
var formHelper = {};
var rules = [];

/**
 * API method for registering a FormRule. The associated form element not need
 * to exist in the DOM at this point
 * @param {FormRule} formRule [FormRule]{@link formHelper.FormRule} object
 */
formHelper.addRule = function (formRule) {
  rules.push(formRule);
};

/**
 * Fires when ANY form submits. Checks to see if the submitting form matches
 * any given {@link FormRule} selectors. If a match is found, [preventDefault]{@link https://developer.mozilla.org/en-US/docs/Web/API/event.preventDefault}
 * and instantiate a new {@link formHelper.FormHelperRequest}
 * @param {Event} event submit event
 *
 * @memberof formHelper
 * @inner
 */
function onFormSubmit(event) {

  var matchedRule = null;
  var $form = $(this);

  // Check if this form matches any of our rules
  $(rules).each(function (index, rule) {
    if (!matchedRule) {
      if ($form.is(rule.form)) {
        matchedRule = rule;
      }
    }
  });

  if (matchedRule) {

    event.preventDefault();

    // If there is an alternate onFormSubmit behaviour specified
    // in the rule, do that instead
    if (matchedRule.customSubmitHandler) {
      matchedRule.customSubmitHandler();
      return;
    }

    if (matchedRule.isMultiForm) {
      $form = $(matchedRule.form);
    }

    var RequestController = matchedRule.requestController || formHelper.FormHelperRequest;
    new RequestController($form, matchedRule, event);
  }
}

$(function () {
  $(document).on('submit', 'form', onFormSubmit);
});

/**
 * FormHelperRequestController's methods get mixed in to FormHelperRequest.
 * FormHelperRequestController should never be instantiated - it's simply a
 * way to separate the internal FormHelper system logic from functionality
 * safe for use in [FormRule.StatusHandler]{@link FormRule.StatusHandler}
 *
 * @class
 * @memberOf formHelper
 * @private
 */
function FormHelperRequestController() {
  throw new Error('FormHelperRequestController should not be instantiated');
}
$.extend(FormHelperRequestController.prototype, /** @lends formHelper.FormHelperRequestController.prototype */{

  startXHR: function startXHR() {
    if (this.cancelled) return;

    if (this.rule.blankAllPasswordsOnSubmit) {
      this.blankAllPasswordFields();
    }
    this.jqXHR = $.ajax(this.xhrOptions);
  },

  /**
   * Invoke form rule's xhrBeforeSend callback. If it returns false or [cancels]{@link formHelper.FormHelperRequest#cancel},
   * request and don't do anything with the UI. Hold off on modifying the
   * form's state until we know we're in the clear.
   *
   * If not cancelled, reset UI and proceed with the request.
   *
   * @param  {jqXHR} jqXHR - Prepared [jQuery XMLHttpRequest object]{@link http://api.jquery.com/jQuery.ajax/#jqXHR}
   * @param  {object} settings - jqXHR settings object
   */
  xhrBeforeSend: function xhrBeforeSend(jqXHR, settings) {

    var cancelledViaReturnFalse = this.invokeStatusHandler(this.rule.xhrBeforeSend, [jqXHR, settings]) === false;

    if (!cancelledViaReturnFalse) {
      cancelledViaReturnFalse = this.invokeStatusHandler(formHelper.always.xhrBeforeSend, [jqXHR, settings]) === false;
    }

    if (!cancelledViaReturnFalse || !this.cancelled) {
      this.checkoutForm();
      this.hideAllStatusMessages();
      this.hideAllErrorMessages();
      this.hideAllParamMessages();
      this.clearAllErroredFields();
      this.disableControls();
    }
  },

  /**
   * Sets [status]{@link formHelper.FormHelperRequest#status}, [data]{@link formHelper.FormHelperRequest#data},
   * and [errors]{@link formHelper.FormHelperRequest#errors} properties.
   * Invokes [xhrSuccess StatusHandler]{@link FormRule.StatusHandler}. If not
   * [cancelled]{@link formHelper.FormHelperRequest#cancel}, [enable controls]{@link formHelper.FormHelperRequestController#enableControls}
   * and [update UI]{@link formHelper.FormHelperRequestController#updateUI}
   *
   * @param  {Object} data Response payload, i.e. {@link FormHelperResponse}
   * @param  {String} textStatus jQuery request status
   * @param  {jqXHR} jqXHR - [jQuery XMLHttpRequest object]{@link http://api.jquery.com/jQuery.ajax/#jqXHR}
   */
  xhrSuccess: function xhrSuccess(data, textStatus, jqXHR) {

    this.status = data.status;
    this.data = data.data;
    this.errors = data.errors;

    this.invokeStatusHandler(this.rule.xhrSuccess, [data, textStatus, jqXHR]);
    this.invokeStatusHandler(formHelper.always.xhrSuccess, [data, textStatus, jqXHR]);

    if (this.status) {
      if (this.rule.status) {
        this.invokeStatusHandler(this.rule.status[this.status]);
      }
      if (formHelper.always.status) {
        this.invokeStatusHandler(formHelper.always.status[this.status]);
      }
    }

    if (this.cancelled) return;

    if (this.rule.releaseFormAndUpdateUIOnXHRSuccess) {
      this.releaseForm();
      this.updateUI();
    }

    this.invokeStatusHandler(this.rule.onComplete);
    this.invokeStatusHandler(formHelper.always.onComplete);
  },

  /**
   * [Releases form]{@link formHelper.FormHelperRequestController#releaseForm}
   * and invoke [xhrError StatusHandler]{@link FormRule.StatusHandler}
    * @param  {jqXHR} jqXHR - [jQuery XMLHttpRequest object]{@link http://api.jquery.com/jQuery.ajax/#jqXHR}
   * @param  {String} textStatus jQuery request status
   * @param  {String} errorThrown HTTP status – 'Not Found', 'Internal Server Error', etc.
   */
  xhrError: function xhrError(jqXHR, textStatus, errorThrown) {
    this.releaseForm();
    this.invokeStatusHandler(this.rule.xhrError, [jqXHR, textStatus, errorThrown]);
    this.invokeStatusHandler(formHelper.always.xhrError, [jqXHR, textStatus, errorThrown]);
  },

  /**
   * Invoke [xhrComplete StatusHandler]{@link FormRule.StatusHandler}
   *
   * @param  {jqXHR} jqXHR - [jQuery XMLHttpRequest object]{@link http://api.jquery.com/jQuery.ajax/#jqXHR}
   * @param  {String} textStatus jQuery request status
   */
  xhrComplete: function xhrComplete(jqXHR, textStatus) {
    this.invokeStatusHandler(this.rule.xhrComplete, [jqXHR, textStatus]);
    this.invokeStatusHandler(formHelper.always.xhrComplete, [jqXHR, textStatus]);
  },

  /**
   * Invoke given StatusHandler (if any) with supplied args
   *
   * @param  {FormRule.StatusHandler} [statusHandler] StatusHandler to invoke
   * @param  {array} [args] The callback's arguments
   */
  invokeStatusHandler: function invokeStatusHandler(statusHandler, args) {
    if (this.cancelled) return;

    if (statusHandler) {
      switch (typeof statusHandler === 'undefined' ? 'undefined' : _typeof(statusHandler)) {
        case 'string':
          this.redirect(statusHandler);
          break;
        case 'function':
          return statusHandler.apply(this, args || []);
        default:
          break;
      }
    }
  },

  /**
   * Marks the form element as being 'checked out' by applying
   * [FH_FORM_SUBMITTING]{@link formHelper.Classes.FH_FORM_SUBMITTING} class.
   * A checked out form will cancel any additional FormHelperRequests on the
   * form until [released]{@link formHelper.FormHelperRequestController#releaseForm}
   */
  checkoutForm: function checkoutForm() {
    this.$form.addClass(formHelper.Classes.FH_FORM_SUBMITTING);
  },

  /**
   * Removes [FH_FORM_SUBMITTING]{@link formHelper.Classes.FH_FORM_SUBMITTING}
   * class from the form and [enables controls]{@link formHelper.FormHelperRequestController#enableControls}
   */
  releaseForm: function releaseForm() {
    this.enableControls();
    this.$form.removeClass(formHelper.Classes.FH_FORM_SUBMITTING);
  },

  /**
   * Determine if the form is 'checked out' by a FormHelperRequest instance by
   * testing for the presence of [FH_FORM_SUBMITTING]{@link formHelper.Classes.FH_FORM_SUBMITTING}
   * class on the form element
   * @return {Boolean}
   */
  isFormCheckedOut: function isFormCheckedOut() {
    return this.$form.hasClass(formHelper.Classes.FH_FORM_SUBMITTING);
  },

  /**
   * Calls [getErrorMessages]{@link formHelper.FormHelperRequestController#getErrorMessages},
   * [getParamMessages]{@link formHelper.FormHelperRequestController#getParamMessages},
   * [getStatusMessage]{@link formHelper.FormHelperRequestController#getStatusMessage},
   * and [getErroredControls]{@link formHelper.FormHelperRequestController#getErroredControls}.
   * Uses the return values to determine if any UI has been updated, and if
   * so, scrolls the form into view
   */
  updateUI: function updateUI() {

    var errors = this.errors;
    var classes = formHelper.Classes;
    var ctx = this;
    var $win;
    var winScrollTop;
    var viewportHeight;
    var formOffset;
    var formHeight;
    var scrollTopTarget;

    var errorMessages = this.getErrorMessages();
    var paramMessages = this.getParamMessages();
    var statusMessage = this.getStatusMessage();
    var erroredFields = this.getErroredControls();

    if (this.rule.scrollIntoViewOnUIUpdate) {

      if (errorMessages.length || paramMessages.length || statusMessage.length || erroredFields.length) {
        // UI has been updated

        $win = $(window);
        formOffset = this.$form.offset();
        winScrollTop = $win.scrollTop();
        viewportHeight = $win.innerHeight();
        formHeight = this.$form.outerHeight();

        // If the form is NOT completely in view
        if (!(formOffset.top > winScrollTop && formOffset.top + formHeight < winScrollTop + viewportHeight)) {
          if (formOffset.top < winScrollTop) {
            scrollTopTarget = formOffset.top;
          } else {
            if (formHeight > viewportHeight) {
              scrollTopTarget = formOffset.top;
            } else {
              scrollTopTarget = formOffset.top + formHeight - viewportHeight;
            }
          }
        }

        if (scrollTopTarget !== undefined) {
          $('html, body').animate({ scrollTop: scrollTopTarget + 'px' });
        }
      }
    }
  },

  /**
   * Given any [RequestError]{@link FormHelperResponse.RequestError} codes,
   * find, show, and mark [FH_MARKED_ERROR_MESSAGE]{@link formHelper.Classes.FH_MARKED_ERROR_MESSAGE}
   * all associated error message elements
   *
   * @return {jQuery} All shown error messages
   */
  getErrorMessages: function getErrorMessages() {
    var Classes = formHelper.Classes;
    var ErrorCodes = formHelper.ErrorCodes;
    var errors = this.errors;
    var selectors = [];
    var objects = $();

    if (errors && errors.length) {

      selectors.push('.' + Classes.ERROR_MESSAGE_PREFIX + ErrorCodes.ANY_ERROR);

      $(errors).each(function (index, error) {
        if (error.code) {
          selectors.push('.' + Classes.ERROR_MESSAGE_PREFIX + error.code);
        }
      });
    }

    if (selectors.length) {
      objects = objects.add(this.find(selectors.join(',')).addClass(Classes.FH_MARKED_ERROR_MESSAGE).show());
    }
    return objects;
  },

  /**
   * Given any [RequestError]{@link FormHelperResponse.RequestError} params,
   * find and show all associated param messages
   *
   * @return {jQuery} All modified param messages
   */
  getParamMessages: function getParamMessages() {
    var Classes = formHelper.Classes;
    var errors = this.errors;
    var selectors = [];
    var objects = $();

    if (errors && errors.length) {
      $(errors).each(function (index, error) {
        if (error.params) {
          $(error.params).each(function (index, param) {
            selectors.push('.' + Classes.PARAM_MESSAGE_PREFIX + param);
          });
        }
      });
    }

    if (selectors.length) {
      objects = objects.add(this.find(selectors.join(',')).addClass(Classes.FH_MARKED_PARAM_MESSAGE).show());
    }
    return objects;
  },

  /**
   * Find and show the status message element, if it exists, for the given
   * [RequestError]{@link FormHelperResponse.RequestError} status
   *
   * @return {jQuery} Shown status message
   */
  getStatusMessage: function getStatusMessage() {
    var Classes = formHelper.Classes;
    if (this.status) {
      return this.find('.' + Classes.STATUS_MESSAGE_PREFIX + this.status.toLowerCase()).addClass(Classes.FH_MARKED_STATUS_MESSAGE).show();
    } else {
      return $();
    }
  },

  /**
   * Given any [RequestError]{@link FormHelperResponse.RequestError} params,
   * find all associated control and apply [CONTROL_GROUP_ERROR]{@link formHelper.Classes.CONTROL_GROUP_ERROR}
   * to their control group
   *
   * @return {jQuery} All controls for error params
   */
  getErroredControls: function getErroredControls() {
    var Classes = formHelper.Classes;
    var errors = this.errors;
    var controls = $();
    var ctx = this;
    var control;

    if (errors && errors.length) {
      $(errors).each(function (index, error) {
        if (error.params) {
          $(error.params).each(function (index, param) {

            control = ctx.control(param);

            if (control.length) {
              controls = controls.add(control);

              ctx.controlGroup(control).addClass(Classes.CONTROL_GROUP_ERROR + ' ' + Classes.FH_MARKED_CONTROL_GROUP);
            }
          });
        }
      });
    }

    if (this.rule.focusFirstErroredControl) {
      if (controls.length) {
        control = controls[0];

        // IE8 jank - can't focus an input that was just enabled.
        window.setTimeout(function () {
          control.focus();
          if (control.select) {
            control.select();
          }
        }, 0);
      }
    }

    return controls;
  },

  /**
   * Removes all occurrances of [CONTROL_GROUP_ERROR]{@link formHelper.Classes.CONTROL_GROUP_ERROR}
   * from [FH_MARKED_CONTROL_GROUP]{@link formHelper.Classes.FH_MARKED_CONTROL_GROUP}
   * elements
   */
  clearAllErroredFields: function clearAllErroredFields() {
    var Classes = formHelper.Classes;
    this.find('.' + Classes.FH_MARKED_CONTROL_GROUP).removeClass(Classes.CONTROL_GROUP_ERROR + ' ' + Classes.FH_MARKED_CONTROL_GROUP);
  },

  /**
   * Hides any elements marked [FH_MARKED_ERROR_MESSAGE]{@link formHelper.Classes.FH_MARKED_ERROR_MESSAGE}
   * and removes marker
   */
  hideAllErrorMessages: function hideAllErrorMessages() {
    var Classes = formHelper.Classes;
    this.find('.' + Classes.FH_MARKED_ERROR_MESSAGE).hide().removeClass(Classes.FH_MARKED_ERROR_MESSAGE);
  },

  /**
   * Hides any elements marked [FH_MARKED_PARAM_MESSAGE]{@link formHelper.Classes.FH_MARKED_PARAM_MESSAGE}
   * and removes marker
   */
  hideAllParamMessages: function hideAllParamMessages() {
    var Classes = formHelper.Classes;
    this.find('.' + Classes.FH_MARKED_PARAM_MESSAGE).hide().removeClass(Classes.FH_MARKED_PARAM_MESSAGE);
  },

  /**
   * Hides any elements marked [FH_MARKED_STATUS_MESSAGE]{@link formHelper.Classes.FH_MARKED_STATUS_MESSAGE}
   * and removes marker
   */
  hideAllStatusMessages: function hideAllStatusMessages() {
    var Classes = formHelper.Classes;
    this.find('.' + Classes.FH_MARKED_STATUS_MESSAGE).hide().removeClass(Classes.FH_MARKED_STATUS_MESSAGE);
  },

  /**
   * Sets 'disabled' attribute and applies [FH_DISABLED_CONTROL]{@link formHelper.Classes.FH_DISABLED_CONTROL}
   * class to all controls within the form
   *
   * @todo 99.9% sure this doesn't work in all browsers. Will probably need to
   * beef this up by adding disabled classes and registering a handler on form
   * change that simply prevents default until enabled.
   */
  disableControls: function disableControls() {
    if (this.rule.disableControls) {
      this.find('input, select, textarea, button').not(':disabled').attr('disabled', 'disabled').addClass(formHelper.Classes.FH_DISABLED_CONTROL);
    }
  },

  /**
   * Removes 'disabled' attribute and [FH_DISABLED_CONTROL]{@link formHelper.Classes.FH_DISABLED_CONTROL}
   * class from all inputs within the form
   */
  enableControls: function enableControls() {
    var Classes = formHelper.Classes;
    if (this.rule.disableControls) {
      this.find('.' + Classes.FH_DISABLED_CONTROL).removeAttr('disabled').removeClass(Classes.FH_DISABLED_CONTROL);
    }
  }

});

/**
 * FormHelperRequest instances are created automatically by FormHelper when
 * form matching any [registered FormRule]{@link formHelper.addRule}
 * submits. FormHelperRequest is not typically instantiated directly by the
 * user.<br><br>
 *
 * The FormRule's callbacks are executed in the context of the
 * FormHelperRequest instance, so members listed below are available during
 * any XHR callbacks and {@link FormRule.StatusHandler}<br>
 *
 * @class
 * @param {HTMLFormElement} formEl Form element to be handled
 * @param {FormRule} rule The form's [FormRule]{@link formHelper.FormRule}
 * @param {Event} submitEvent The form's original submit event
 * @mixes formHelper.FormHelperRequestController
 * @memberOf formHelper
 */

function FormHelperRequest(formEl, rule, submitEvent) {
  if (!formEl) return;
  this.initialize(formEl, rule, submitEvent);
}
FormHelperRequest.prototype = FormHelperRequestController.prototype;
formHelper.FormHelperRequest = FormHelperRequest;

$.extend(formHelper.FormHelperRequest.prototype, /** @lends formHelper.FormHelperRequest.prototype */{

  initialize: function initialize(formEl, rule, submitEvent) {
    /**
     * jQuery-wrapped form element for the request
     * @type {jQuery}
     */
    this.$form = $(formEl);

    if (this.isFormCheckedOut()) return;

    /**
     * The FormRule for this request. Your custom rules merged with the defaults
     * @type {FormRule}
     */
    this.rule = $.extend(true, {}, formHelper.FormHelperRequest.Defaults.rule, rule);

    /**
     * The form's submit event
     * @type {Event}
     */
    this.submitEvent = submitEvent;
    this.cancelled = false;

    /**
     * {@link FormHelperResponse} status code. Only available after [xhrSuccess]{@link formHelper.FormHelperRequestController#xhrSuccess}
     * @type {String}
     */
    this.status = null;

    /**
     * {@link FormHelperResponse} data, if any was supplied. Only available after [xhrSuccess]{@link formHelper.FormHelperRequestController#xhrSuccess}
     */
    this.data = null;

    /**
     * Array of {@link FormHelperResponse.RequestError} objects, if any. Only available after [xhrSuccess]{@link formHelper.FormHelperRequestController#xhrSuccess}
     * @type {Array}
     */
    this.errors = null;

    // Deep copy so rule.xhrOptions.data will be sent along.
    var xhrOptions = $.extend(true, {}, formHelper.FormHelperRequest.Defaults.xhrOptions, rule.xhrOptions || {}, {
      context: this,
      url: this.rule.action || this.$form.attr('action'),
      data: $.extend({}, rule.data || {}, this.$form.serializeJSON()),
      beforeSend: this.xhrBeforeSend,
      success: this.xhrSuccess,
      complete: this.xhrComplete,
      error: this.xhrError
    });

    /**
     * Object used to create [jQuery Ajax request]{@link http://api.jquery.com/jQuery.ajax/#jQuery-ajax-settings}.
     * Hang on to this mostly for its 'data' property, which is an object with
     * key value pairs of the form input names and their values. After this
     * property is set, it's no longer necessary to query the DOM to read user
     * input values
     *
     * @example
     * {
     *   url:      "/h/module/loginForm",
     *   type:     "POST",
     *   dataType: "json",
     *   cache:    false,
     *   data: {
     *     // user input values
     *     firstname: "Billy",
     *     lastname:  "White",
     *     email:     "billy@lynch2.com"
     *   },
     *   ...
     * }
     *
     * @type {object}
     */
    this.xhrOptions = xhrOptions;

    this.invokeStatusHandler(rule.xhrReady, [xhrOptions]);
    this.invokeStatusHandler(formHelper.always.xhrReady, [xhrOptions]);

    if (this.cancelled) return;

    this.startXHR();
  },

  /**
   * Cancels any further processing of the FormHelperRequest. Can be called
   * during a rule's [xhrReady]{@link FormRule.xhrReady} or [xhrBeforeSend]{@link formHelper.FormHelperRequestController#xhrBeforeSend}
   * callbacks to prevent FormHelper UI updates and XHR
   */
  cancel: function cancel() {
    this.cancelled = true;
  },

  /**
   * [Cancels]{@link formHelper.FormHelperRequest#cancel} the request and forwards the browser to the given location
   * @param {String} location - URL/path to go to
   */
  redirect: function redirect(location) {
    this.cancel();
    window.location.href = location;
  },

  /**
   * Scroll the page so the top of the form is at the top of the window
   */
  scrollToTopOfForm: function scrollToTopOfForm() {
    $('html, body').animate({ scrollTop: this.$form.offset().top + 'px' });
  },

  /**
   * Clear the value of every password input field in the form
   */
  blankAllPasswordFields: function blankAllPasswordFields() {
    this.find('input[type=password]').each(function (index, input) {
      $(input).val('');
    });
  },

  /**
   * Shortcut for finding elements scoped within the form
   * @param  {String} selector CSS Selector String
   * @return {jQuery}
   */
  find: function find(selector) {
    return this.$form.find(selector);
  },

  /**
   * Find the control element for given name or id
   * @param  {String} control - Control name or id
   * @return {jQuery}
   */
  control: function control(_control) {
    var $el = this.find('[name=' + _control + ']');
    if (!$el.length) {
      $el = this.find('#' + _control);
    }
    return $el.first();
  },

  /**
   * Find and return a jQuery-wrapped control group for a given control
   * @param  {String|jQuery} control - Control name or id string, or
   * jQuery-wrapped control element
   * @return {jQuery}
   */
  controlGroup: function controlGroup(control) {
    return (typeof control === 'string' ? this.control(control) : control).closest('.' + formHelper.Classes.CONTROL_GROUP);
  }

});

/** @namespace  */
formHelper.Classes = {
  /**
   * Class denoting a 'control group', i.e. the container for an input and
   * label pair
   * @default
   */
  CONTROL_GROUP: 'form-group',

  /**
   * Class applied to CONTROL_GROUP in the event of an error
   * @default
   */
  CONTROL_GROUP_ERROR: 'has-error',

  /**
   * Class prefix denoting a pre-loaded hidden error message
   * @example
   * <div class="js-fh-error-bad-password" style="display: none;">Invalid password. Please try again.</div>
   * @default
   */
  ERROR_MESSAGE_PREFIX: 'js-fh-error-',

  /**
   * Class prefix denoting a pre-loaded hidden message for returned params
   * @example
   * <div class="js-fh-param-error-first-name" style="display: none;">First Name</div>
   * @default
   */
  PARAM_MESSAGE_PREFIX: 'js-fh-param-error-',

  /**
   * Class prefix denoting a pre-loaded hidden message for returned status
   * code
   * @example
   * <div class="js-fh-status-success" style="display: none;">Thank You!</div>
   * @default
   */
  STATUS_MESSAGE_PREFIX: 'js-fh-status-',

  /**
   * Class applied to [$form]{@link formHelper.FormHelperRequest#$form} while
   * submitting
   * @default
   */
  FH_FORM_SUBMITTING: 'js-fh-submitting',

  /**
   * Class applied to made-visible error messages
   * @default
   */
  FH_MARKED_ERROR_MESSAGE: 'js-fh-marked-error-msg',

  /**
   * Class applied to made-visible param error messages
   * @default
   */
  FH_MARKED_PARAM_MESSAGE: 'js-fh-marked-param-msg',

  /**
   * Class applied to made-visible status messages
   * @default
   */
  FH_MARKED_STATUS_MESSAGE: 'js-fh-marked-status-msg',

  /**
   * Class applied to error-marked control groups
   * @default
   */
  FH_MARKED_CONTROL_GROUP: 'js-fh-marked-control-group',

  /**
   * Class applied to made-disabled control groups while submitting
   * @default
   */
  FH_DISABLED_CONTROL: 'js-fh-disabled-control'
};

/** @namespace  */
formHelper.ErrorCodes = {
  /**
   * Special error code that will be made visible if there is at least on
   * error in the response
   * @example
   * <div class="js-fh-error-any-error" style="display: none;">Oops, something went wrong!</div>
   * @default
   */
  ANY_ERROR: 'any-error'
};

/**
* <p>A place to declare site-wide XHR callbacks and StatusHandlers. These
* callbacks, if present, are invoked immediately after (and independant of) a
* FormRule's local counterpart.</p>
* <p>Note that even though these are registered
* 'globally', they are still executed within the context of the working
* FormHelperRequest.</p>
*
* @example
* formHelper.always.xhrSuccess = function() {
*   if (this.status !== 'SUCCESS') {
*     // A form submission was not successful!
*     // Track an event perhaps?
*   }
* };
* @example
* formHelper.always = {
*   xhrError: function() {
*     // XHR error - what to do?
*   },
*   status: {
*     WEBSITE_BROKEN: '/' // Redirect home
*   }
* };
* @namespace
* @property {FormRule.xhrReady} [xhrReady]
* @property {FormRule.xhrBeforeSend} [xhrBeforeSend]
* @property {FormRule.xhrSuccess} [xhrSuccess]
* @property {FormRule.xhrError} [xhrError]
* @property {FormRule.xhrComplete} [xhrComplete]
* @property {FormRule.onComplete} [onComplete]
* @property {Object.<String, FormRule.StatusHandler>} [status]
*/
formHelper.always = {
  xhrReady: null,
  xhrBeforeSend: null,
  xhrSuccess: null,
  xhrError: null,
  xhrComplete: null,
  onComplete: null,
  status: {}
};

/**
 * @namespace
 * @memberOf formHelper.FormHelperRequest
*/
formHelper.FormHelperRequest.Defaults = {

  /**
   * @namespace
   * @description Either change these globaly for a site by modifying these
   * properties or on a form-by-form basis by specifying alternate values in
   * a form rule.
  */
  rule: {
    /** @default */
    disableControls: true,
    /** @default */
    scrollIntoViewOnUIUpdate: true,
    /** @default */
    focusFirstErroredControl: true,
    /** @default */
    releaseFormAndUpdateUIOnXHRSuccess: true
  },

  /**
   * @namespace
   * @description Yeah, don't change these...
  */
  xhrOptions: {
    /** @default */
    cache: false,
    /** @default */
    dataType: 'json',
    /** @default */
    type: 'POST'
  }
};

return formHelper;

})));
//# sourceMappingURL=formhelper.js.map
