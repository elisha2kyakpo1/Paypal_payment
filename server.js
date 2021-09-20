require('dotenv').config()

const express = require('express');

const app = express();
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.json())

const paypal = require('@paypal/checkout-server-sdk');
const e = require('express');

const storeItems = new Map([
  [1, {price: 100, name: 'Pizza'}],
  [2, {price: 200, name: 'Wine'}],
  [3, {price: 300, name: 'T-bone'}],
])

const Environment =
  process.env.NODE_ENV === 'production'
    ? paypal.core.LiveEnvironment
    : paypal.core.SandboxEnvironment

  const paypalClient = new paypal.core.PayPalHttpClient(
    new Environment(
      process.env.PAYPAY_CLIENT_ID,
      process.env.PAYPAY_CLIENT_SECRET
    )
  )

app.get('/', (req, res) => {
  res.render('index', {
    paypalClientId: process.env.PAYPAY_CLIENT_ID
  })
})

app.post('/create-order', async(req, res) => {
  const request = new paypal.ordersCreateRequest()
  const total = req.body.items.reduce((sum, item) => {
    return sum + storeItems.get(item.id).price * item.quantity
  }, 0)
  request.prefer('return=representation')
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: total,
          breadown: {
            item_total: {
              currency_code: 'USD',
              value: total
            }
          }
        },
        items: req.body.items.map((item) => {
          const storeItem = storeItems.get(item.id)
          return {
            name: storeItem.name,
            unit_amount: {
              currency_code: 'USD',
              value: storeItem.price,
            },
            quantity: item.quantity,
          }
        })
      }
    ]
  })

  try {
    const order = await paypalClient.execute(request)
    res.json({ id: order.result.id})
  } catch (e) {
    res.status(500).json( { error: e.message })
  }
})

app.listen(3000)
