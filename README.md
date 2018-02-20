# Some CloudFront redirects using Lambda@Edge

`./redirects.json` contains an array of redirects like so:

```json
[
  {
    "source": "/path/to/old/resource",
    "to": "/path/to/new/resource"
  }
]
```

Where `source` is a string that'll be parsed as a RegExp object. Add in querystrings if you like, they'll be matched.

### Testing:

See the `event.json` file for an edited/pared down real request. Edit `event.json` to see if your requests and redirects work as they should together.

Run `npm test` to test

A positive match/redirect will output an object like this:

```json
{
  "status": "301",
  "statusDescription": "Moved Permanently",
  "headers": {
    "content-type": [{
      "key": "Content-Type",
      "value": "text/plain; charset=UTF-8"
    }],
    "location": [{
      "key": "Location",
      "value": "The place you're redirecting to"
    }]
  }
}
```

A negative match/no redirect will output the original response or request object

### Publishing / using it

Make sure you're watching your dependencies closely, keep devDependencies in devDependencies as the Lambda@Egde functions have even tighter restrictions on weight and execution time. For more information see: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cloudfront-limits.html#limits-lambda-at-edge

When you're done testing:
0. Modify your existing Lambda user or create a new one that has [sufficient privileges](https://docs.aws.amazon.com/lambda/latest/dg/lambda-edge.html#lambda-edge-permissions) - do it now cause it's a big pain to do it later
1. Run `npm run package`
2. Create a new Lambda function
3. Upload the zip in `./build`
4. Make sure your settings are as specified in the [Lambda@Edge limits](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cloudfront-limits.html#limits-lambda-at-edge), eg: the function timeout is max 5 seconds
5. Add some tests if you like (eg: copy the `event.json` variations you were using)
6. Publish and name a version - this is what you'll be linking to CloudFront
7. Copy the full function version ARN, it should have a `:n` at the end, where the `n` is the published version number, eg: `arn:aws:lambda:us-east-1:123456789012:function:my-awesome-redirect-function:1`
8. In the CloudFront distribution, open a behaviour and at the bottom under _Lambda Function Associations_ set _Event Type_ to __Origin Request__ and paste the full function version ARN from the previous point into the _Lambda Function ARN_ box
9. Hit __Yes, edit__ and wait for changes to take over
10. Test the paths you wanted redirecting, they should now initially respond with a 301
