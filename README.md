## Load Shedder

Google SRE defines load shedder as a way to shed requests when there is too much oad. This repo implements a basic express middleware that load sheds via returning 429 when a concurrency limit is hit. Technically there are more specific ways to decide when to shed in a case to case basis, however this is the best way to determine if some requests should be shedded.

How to use:

`npm install @matthewzhao/load-shed`

```javascript
const shedder = require('@matthewzhao/load-shed')
const express = require('express')

const app = express()
const redisConfig = {}
const shedderConfig = {RedisConfig: redisConfig, limit: 10, RedisKey: '/counter'}

app.get('/transaction', shedder.shedder(shedderConfig), async (req, res) => {
    // Do the expensive processing
    res.send('transaction success')
})

app.listen(3000)

```