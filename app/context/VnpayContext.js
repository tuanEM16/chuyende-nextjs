import qs from "qs";
import HmacSHA512 from "crypto-js/hmac-sha512";
import Hex from "crypto-js/enc-hex";

export function removeVietnameseAccents(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

function formatDateForVNP(d = new Date()) {
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}${p(
    d.getHours()
  )}${p(d.getMinutes())}${p(d.getSeconds())}`;
}

export function buildVNPayUrl({
  vnpUrl,
  tmnCode,
  secret,
  amount,
  orderInfo,
  returnUrl,
  bankCode,
  txnRef, 
}) {
  const params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Amount: Math.round(amount) * 100,
    vnp_CurrCode: "VND",
    vnp_TxnRef: txnRef, 
    vnp_OrderInfo: removeVietnameseAccents(orderInfo),
    vnp_OrderType: "other",
    vnp_Locale: "vn",
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: "127.0.0.1",
    vnp_CreateDate: formatDateForVNP(),
  };

  if (bankCode) params.vnp_BankCode = bankCode;

  const sorted = Object.keys(params)
    .sort()
    .reduce((o, k) => {
      o[k] = params[k];
      return o;
    }, {});

  const signData = qs.stringify(sorted, { encode: true, format: "RFC1738" });

  const secureHash = HmacSHA512(signData, secret).toString(Hex).toUpperCase();

  return `${vnpUrl}?${signData}&vnp_SecureHash=${secureHash}`;
}
