const tap = require('tap')

const uriMatch = require('./').uriMatch

const negativeTests = [
  '/en',
  '/zh',
  '/whatever',
  '/something/other-thing/whatever',
  '/something/other-thing/whatever?with=a%20querystring'
]

const positiveTests = [
  {
    source: '/e/content/cat_page.asp?cat_id=211',
    expected: '/en/our-program/certification-and-audit/factory-lookup'
  },
  {
    source: '/s/content/cat_page.asp?cat_id=211',
    expected: '/zh/our-program-zh/certification-audit-zh/factory-lookup-zh'
  },
  {
    source: '/e/content/cat_page.asp?cat_id=206',
    expected: '/en/resources'
  },
  {
    source: '/s/content/cat_page.asp?cat_id=206',
    expected: '/zh/resources-zh'
  },
  {
    source: '/e/content/cat_page.asp?cat_id=191',
    expected: '/en/factories'
  },
  {
    source: '/s/content/cat_page.asp?cat_id=191',
    expected: '/zh/factories-zh'
  },
  {
    source: '/e/content/cat_page.asp?cat_id=257',
    expected: '/en/resources/factory-resources/etp-audit-protocol-handbook'
  },
  {
    source: '/s/content/cat_page.asp?cat_id=257',
    expected: '/zh/resources-zh/factory-resources-zh/etp-audit-protocol-handbook-zh'
  },
  {
    source: '/e/content/cat_page.asp?cat_id=273',
    expected: '/en/resources/factory-resources/etp-guidelines'
  },
  {
    source: '/s/content/cat_page.asp?cat_id=273',
    expected: '/zh/resources-zh/factory-resources-zh/etp-guidelines-zh'
  },
  {
    source: '/e/content/cat_page.asp?cat_id=194',
    expected: '/en/resources/factory-resources/policies'
  },
  {
    source: '/s/content/cat_page.asp?cat_id=194',
    expected: '/zh/resources-zh/factory-resources-zh/policies-zh'
  },
  {
    source: '/uploadfileMgnt/01_201742117591.pdf',
    expected: '/en/resources/factory-resources/factory-welcome-pack'
  },
  {
    source: '/uploadfileMgnt/01_2017421182447.pdf',
    expected: '/zh/resources-zh/factory-resources-zh/factory-welcome-pack-zh'
  },
  {
    source: '/e/content/cat_page.asp?cat_id=290',
    expected: '/en'
  },
  {
    source: '/s/content/cat_page.asp?cat_id=290',
    expected: '/zh'
  },
  {
    source: '/e/content/cat_page.asp?cat_id=284',
    expected: '/en/news-and-events'
  },
  {
    source: '/s/content/cat_page.asp?cat_id=284',
    expected: '/zh/news-and-events-zh'
  },
  {
    source: 'e/content/cont_page.asp?content_id=401',
    expected: '/en/introducing-the-ethical-toy-program'
  },
  {
    source: 's/content/cont_page.asp?content_id=401',
    expected: '/zh/introducing-the-ethical-toy-program-zh'
  },
  {
    source: 'e/default.asp',
    expected: '/en'
  },
  {
    source: 's/default.asp',
    expected: '/zh'
  }
]

negativeTests.forEach(source => {
  const [uri, querystring] = source.split('?')
  const request = {uri, querystring}
  const result = uriMatch({request})

  tap.same(result, {})
})

positiveTests.forEach(({source, expected}, index) => {
  const [uri, querystring] = source.split('?')
  const request = {uri, querystring}
  const result = uriMatch({request})

  const expectedResult = {
    status: 301,
    to: expected
  }

  tap.same(result, expectedResult)
})
