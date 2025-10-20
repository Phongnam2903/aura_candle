const crypto = require('crypto');
const moment = require('moment');
const QRCode = require('qrcode');

// VNPay Configuration
const VNPAY_CONFIG = {
    vnp_TmnCode: process.env.VNPAY_TMN_CODE || 'YOUR_TMN_CODE',
    vnp_HashSecret: process.env.VNPAY_HASH_SECRET || 'YOUR_HASH_SECRET',
    vnp_Url: process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    vnp_ReturnUrl: process.env.VNPAY_RETURN_URL || 'http://localhost:3000/payment/vnpay-return',
    vnp_Api: process.env.VNPAY_API || 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction',
};

// Momo Configuration
const MOMO_CONFIG = {
    partnerCode: process.env.MOMO_PARTNER_CODE || 'YOUR_PARTNER_CODE',
    accessKey: process.env.MOMO_ACCESS_KEY || 'YOUR_ACCESS_KEY',
    secretKey: process.env.MOMO_SECRET_KEY || 'YOUR_SECRET_KEY',
    endpoint: process.env.MOMO_ENDPOINT || 'https://test-payment.momo.vn/v2/gateway/api/create',
    returnUrl: process.env.MOMO_RETURN_URL || 'http://localhost:3000/payment/momo-return',
    notifyUrl: process.env.MOMO_NOTIFY_URL || 'http://localhost:5000/api/payment/momo-notify',
};

class PaymentService {
    // Tạo VNPay payment URL
    static async createVNPayPayment(orderData) {
        try {
            const {
                orderId,
                amount,
                orderDescription,
                orderType = 'other',
                bankCode = ''
            } = orderData;

            const vnp_Params = {};
            vnp_Params['vnp_Version'] = '2.1.0';
            vnp_Params['vnp_Command'] = 'pay';
            vnp_Params['vnp_TmnCode'] = VNPAY_CONFIG.vnp_TmnCode;
            vnp_Params['vnp_Locale'] = 'vn';
            vnp_Params['vnp_CurrCode'] = 'VND';
            vnp_Params['vnp_TxnRef'] = orderId;
            vnp_Params['vnp_OrderInfo'] = orderDescription;
            vnp_Params['vnp_OrderType'] = orderType;
            vnp_Params['vnp_Amount'] = amount * 100; // VNPay yêu cầu số tiền nhân 100
            vnp_Params['vnp_ReturnUrl'] = VNPAY_CONFIG.vnp_ReturnUrl;
            vnp_Params['vnp_IpAddr'] = '127.0.0.1';
            vnp_Params['vnp_CreateDate'] = moment().format('YYYYMMDDHHmmss');

            if (bankCode !== null && bankCode !== '') {
                vnp_Params['vnp_BankCode'] = bankCode;
            }

            // Sắp xếp tham số theo thứ tự alphabet
            const sortedParams = this.sortObject(vnp_Params);
            
            // Tạo query string
            const querystring = require('querystring');
            const signData = querystring.stringify(sortedParams, { encode: false });
            
            // Tạo chữ ký
            const hmac = crypto.createHmac('sha512', VNPAY_CONFIG.vnp_HashSecret);
            hmac.update(signData);
            const vnp_SecureHash = hmac.digest('hex');
            
            sortedParams['vnp_SecureHash'] = vnp_SecureHash;
            const vnpUrl = VNPAY_CONFIG.vnp_Url + '?' + querystring.stringify(sortedParams, { encode: false });

            return {
                success: true,
                paymentUrl: vnpUrl,
                orderId: orderId
            };
        } catch (error) {
            console.error('VNPay payment creation error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Tạo Momo payment
    static async createMomoPayment(orderData) {
        try {
            const {
                orderId,
                amount,
                orderDescription,
                orderType = 'momo_wallet'
            } = orderData;

            const requestId = moment().format('YYYYMMDDHHmmss') + Math.floor(Math.random() * 1000);
            const orderInfo = orderDescription;
            const redirectUrl = MOMO_CONFIG.returnUrl;
            const ipnUrl = MOMO_CONFIG.notifyUrl;
            const extraData = '';

            // Tạo raw signature
            const rawSignature = `accessKey=${MOMO_CONFIG.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${MOMO_CONFIG.partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${orderType}`;

            // Tạo chữ ký
            const signature = crypto.createHmac('sha256', MOMO_CONFIG.secretKey)
                .update(rawSignature)
                .digest('hex');

            const requestBody = {
                partnerCode: MOMO_CONFIG.partnerCode,
                partnerName: "Aura Candle",
                storeId: "AuraCandleStore",
                requestId: requestId,
                amount: amount,
                orderId: orderId,
                orderInfo: orderInfo,
                redirectUrl: redirectUrl,
                ipnUrl: ipnUrl,
                lang: "vi",
                extraData: extraData,
                requestType: orderType,
                signature: signature
            };

            const response = await fetch(MOMO_CONFIG.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            const result = await response.json();

            if (result.resultCode === 0) {
                return {
                    success: true,
                    paymentUrl: result.payUrl,
                    orderId: orderId,
                    qrCode: result.qrCodeUrl
                };
            } else {
                return {
                    success: false,
                    error: result.message || 'Momo payment creation failed'
                };
            }
        } catch (error) {
            console.error('Momo payment creation error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Tạo QR Code từ URL
    static async generateQRCode(paymentUrl) {
        try {
            const qrCodeDataURL = await QRCode.toDataURL(paymentUrl, {
                width: 300,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            });
            return qrCodeDataURL;
        } catch (error) {
            console.error('QR Code generation error:', error);
            return null;
        }
    }

    // Xác thực VNPay callback
    static verifyVNPayCallback(vnp_Params) {
        const vnp_SecureHash = vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        const sortedParams = this.sortObject(vnp_Params);
        const querystring = require('querystring');
        const signData = querystring.stringify(sortedParams, { encode: false });
        
        const hmac = crypto.createHmac('sha512', VNPAY_CONFIG.vnp_HashSecret);
        hmac.update(signData);
        const secureHash = hmac.digest('hex');

        return secureHash === vnp_SecureHash;
    }

    // Xác thực Momo callback
    static verifyMomoCallback(params) {
        const {
            partnerCode,
            accessKey,
            requestId,
            amount,
            orderId,
            orderInfo,
            orderType,
            transId,
            resultCode,
            message,
            payType,
            responseTime,
            extraData,
            signature
        } = params;

        const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

        const expectedSignature = crypto.createHmac('sha256', MOMO_CONFIG.secretKey)
            .update(rawSignature)
            .digest('hex');

        return expectedSignature === signature;
    }

    // Sắp xếp object theo alphabet
    static sortObject(obj) {
        const sorted = {};
        const str = [];
        let key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                str.push(encodeURIComponent(key));
            }
        }
        str.sort();
        for (key = 0; key < str.length; key++) {
            sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
        }
        return sorted;
    }
}

module.exports = PaymentService;

