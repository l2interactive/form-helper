<style type="text/css">
  code {
    background-color: linen;
  }
  h3 {
    margin-top: 30px;
  }
</style>

<h2>Form Helper</h2>

Take the following form:

```html
<form action="/h/cart/Login" id="form-login" method="post">
  <fieldset>
    <legend class="form-legend">Log in</legend>

    <div class="js-fh-status-failure"        style="display: none;">Sorry, an error occurred.</div>
    <div class="js-fh-error-empty-inputs"    style="display: none;">One or more fields were left blank.</div>
    <div class="js-fh-error-bad-credentials" style="display: none;">The username and/or password you entered did not match our records.</div>

    <fieldset class="fieldset-credentials">
      <legend>Log in Credentials</legend>

      <div class="form-group">
        <label class="control-label" for="email">Email Address</label>
        <input type="email" class="form-control" id="email" name="email">
      </div>

      <div class="form-group">
        <label class="control-label" for="password">Password</label>
        <input type="password" class="form-control" id="password" name="password">
      </div>

    </fieldset>

    <button type="submit">Log in</button>

  </fieldset>
</form>
```

Register a {@link FormRule}:

```javascript
formHelper.addRule({
  form: '#form-login',
  status: {
    SUCCESS: function() {
      // Replace the form with returned HTML
      this.$form.html(this.data);
    }
  }
});
```

When the form above submits, FormHelper will match it up to the registered
FormRule and take over. The form will not post to the action as normal, but FormHelper
will take over by creating a new [FormHelperRequest]{@link formHelper.FormHelperRequest}
and make an XHR POST containing the serialized form input values. Server validates
and returns an appropriate JSON {@link FormHelperResponse} for the
FormHelperRequest to respond to.

If the user were to submit this form with a bad email address or password, we
would receive the following response, with which FormHelper would automatically
attempt to:

1. Given the status code <code>FAILURE</code>:
  * Make visible <code>.js-fh-status-failure</code>
2. Given the error code <code>bad-credentials</code>:
  * Make visible <code>.js-fh-error-bad-credentials</code>
3. Given the error params <code>email</code> and <code>password</code>:
  * Make visible <code>.js-fh-param-error-email</code> and <code>.js-fh-param-error-password</code>
  <em>not used in our example</em>
  * Add the class <code>has-error</code> to the control groups (i.e. the input's
  nearest containing <code>.form-group</code>) of the inputs <code>email</code>
  and <code>password</code>
4. Given there was at least one error:
  * Make visible <code>.js-fh-error-any-error</code> <em>not used in our example</em>
5. Attempt to execute a {@link FormRule.StatusHandler} keyed to <code>FAILURE</code>
<em>not used in our example</em>

```json
{
  "status": "FAILURE",
  "errors": [
    {
      "code": "bad-credentials",
      "params": [
        "email", "password"
      ]
    }
  ]
}
```

Nice - a lot of stuff happened for free. If the user re-enters their email and
password and re-submits with proper credentails, FormHelper will undo any
changes from the last submission and we'd get the following FormHelperResponse.

This time, FormHelper will attempt to:

1. Given the status code <code>SUCCESS</code>:
  * Make visible <code>.js-fh-status-success</code> <em>not used in our example</em>
2. Attempt to execute a StatusHandler keyed to <code>SUCCESS</code>

```json
{
  "status": "SUCCESS",
  "data": "<div class=\"message-login-successful\"><h2>Login Successful!</h2> ... </div>"
}
```

Since we defined a <code>SUCCESS</code> StatusHandler, it gets invoked. In
our case, we replaced the form with HTML returned by the server, but what a
StatusHandler does is completely up to you.


### XHR Callback and StatusHandler Execution Order
**All** of the following callbacks are first executed locally (i.e. callbacks
declared in a specific {@link FormRule}) then [globally]{@link formHelper.always}.
All callbacks are optional.

1. xhrReady _– cancellable_
1. xhrBeforeSend _– cancellable_
1. Either:
  * xhrSuccess
  * xhrError
1. Matching [StatusHandler]{@link FormRule.StatusHandler}
1. xhrComplete
1. onComplete


###### Generate these docs:

Install jsdoc globally then from the project root:

```
jsdoc src/formhelper.js docs/README.md -p -d docs/ -c docs/conf.json
```
