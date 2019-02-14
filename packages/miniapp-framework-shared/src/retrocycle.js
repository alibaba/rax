export default function retrocycle($) {
  'use strict';
  // Restore an object that was reduced by decycle. Members whose values are
  // objects of the form
  //      {$ref: PATH}
  // are replaced with references to the value found by the PATH. This will
  // restore cycles. The object will be mutated.
  // The eval function is used to locate the values described by a PATH. The
  // root object is kept in a $ variable. A regular expression is used to
  // assure that the PATH is extremely well formed. The regexp contains nested
  // * quantifiers. That has been known to have extremely bad performance
  // problems on some browsers for very long strings. A PATH is expected to be
  // reasonably short. A PATH is allowed to belong to a very restricted subset of
  // Goessner's JSONPath.
  // So,
  //      var s = '[{"$ref":"$"}]';
  //      return JSON.retrocycle(JSON.parse(s));
  // produces an array containing a single element which is the array itself.
  var px = /^\$(?:\[(?:\d+|"(?:[^\\"\u0000-\u001f]|\\(?:[\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*")\])*$/;
  (function rez(value) {
    // The rez function walks recursively through the object looking for $ref
    // properties. When it finds one that has a value that is a path, then it
    // replaces the $ref object with a reference to the value that is found by
    // the path.
    if (value && typeof value === 'object') {
      if (Array.isArray(value)) {
        value.forEach(function(element, i) {
          if (typeof element === 'object' && element !== null) {
            var path = element.$ref;
            if (typeof path === 'string' && px.test(path)) {
              value[i] = eval(path);
            } else {
              rez(element);
            }
          }
        });
      } else {
        Object.keys(value).forEach(function(name) {
          var item = value[name];
          if (typeof item === 'object' && item !== null) {
            var path = item.$ref;
            if (typeof path === 'string' && px.test(path)) {
              value[name] = eval(path);
            } else {
              rez(item);
            }
          }
        });
      }
    }
  }($));
  return $;
};