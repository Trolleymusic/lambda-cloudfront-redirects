'use strict'
const {STATUS_CODES} = require('http')
const redirects = require('./redirects.json')

const uriMatch = ({request}) => {
  try {
    const {uri, querystring} = request
    const url = querystring ? `${uri}?${querystring}` : uri
    const match = redirects.filter(redirect => url.match(redirect.source))

    // If there's no match, don't bother, just return an empty object
    if (!match.length) {
      return {}
    }

    const {to, status = 301} = match.shift()
    return {to, status}
  } catch (e) {
    console.log('uriMatch: Error', e)
    // If there's an error, return an empty object
    return {}
  }
}

exports.handler = (event, context, callback) => {
  const {cf} = event.Records[0]
  const {request} = cf
  const {to, status} = uriMatch({request})

  if (!to) {
    // Continue the response
    return callback(null, cf.response || request)
  }

  const response = {
    status: String(status),
    statusDescription: STATUS_CODES[status],
    headers: {
      'content-type': [{
        key: 'Content-Type',
        value: 'text/plain; charset=UTF-8'
      }],
      location: [{
        key: 'Location',
        value: to
      }]
    }
  }

  return callback(null, response)
}
