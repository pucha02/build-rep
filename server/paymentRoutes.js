const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const MERCHANT_ACCOUNT = 't_me_a7af8'; // Ваш Merchant login
const MERCHANT_SECRET_KEY = '3a98ae98c97ee8eb3b544a9358476560f0a10371'; // Ваш Merchant secret key

router.post('/create-payment', (req, res) => {
  const { amount, currency, orderReference } = req.body;

  const paymentData = {
    merchantAccount: MERCHANT_ACCOUNT,
    merchantDomainName: 'your-domain.com', // Убедитесь, что этот домен соответствует зарегистрированному в WayForPay
    orderReference: orderReference,
    orderDate: Math.floor(Date.now() / 1000),
    amount: amount,
    currency: currency,
    productName: ['Subscription'],
    productCount: [1],
    productPrice: [amount],
  };

  // Создание строки для подписи в правильном порядке
  const hashString = [
    paymentData.merchantAccount,
    paymentData.merchantDomainName,
    paymentData.orderReference,
    paymentData.orderDate,
    paymentData.amount,
    paymentData.currency,
    paymentData.productName.join(';'),
    paymentData.productCount.join(';'),
    paymentData.productPrice.join(';')
  ].join(';');

  // Создание подписи
  const merchantSignature = crypto
    .createHash('md5')
    .update(hashString + MERCHANT_SECRET_KEY)
    .digest('hex');

  paymentData.merchantSignature = merchantSignature;

  // Лог для проверки
  console.log('Hash string:', hashString);
  console.log('Merchant Signature:', merchantSignature);

  res.json(paymentData);
});

module.exports = router;
