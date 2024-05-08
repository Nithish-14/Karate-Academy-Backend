function trimRequestBody(req, res, next) {
    // Check if the request body exists and is an object
    if (req.body && typeof req.body === 'object') {
      // Iterate over each key in the request body
      for (const key in req.body) {
        // Trim the value of each key
        if (typeof req.body[key] === 'string') {
          req.body[key] = req.body[key].trim();
        }
      }
    }
    // Move to the next middleware or route handler
    next();
}

module.exports = trimRequestBody;