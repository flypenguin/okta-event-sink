"use strict";
/*
  The only thing this receiver does is to split the events[] list into
  separate _single_ events, and push them into the event topic so they
  don't get lost.

  The format of the pushed object is:

  { meta: {event metadata, like time etc}, event: {the event} }

*/

// no async, cause then we'll receive a promise, which is useless here.
function get_verify_response(headers) {
  return {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: { verification: headers["x-okta-verification-challenge"] }
  };
}

module.exports = async function(context, req) {
  let log_me;

  // verify okta request
  if (req.method == "GET" && "x-okta-verification-challenge" in req.headers) {
    log_me = {
      action: "okta_event_verify_hook"
    };
    context.bindings.res = get_verify_response(req.headers);
  } else {
    let results = [];
    let count = 0;
    let meta = { ...req.body };
    delete meta.data;
    for (const event of req.body.data.events) {
      let push_me = { event: { ...event }, meta: meta };
      results.push(push_me);
      count += 1;
    }
    context.bindings.oktaEventQueue = results;
    log_me = {
      action: "okta_event_enqueue",
      count: count
    };
  }

  context.log(log_me);
  context.done();
};
