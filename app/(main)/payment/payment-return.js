import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/api";

export default function PaymentReturn() {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [txnInfo, setTxnInfo] = useState({
    orderId: "",
    amount: "",
    bankCode: "",
    payDate: "",
    transactionNo: "",
    responseCode: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const orderId = params.get("vnp_TxnRef");      // ID đơn hàng phía backend gửi sang VNPay
    const responseCode = params.get("vnp_ResponseCode");
    const amount = params.get("vnp_Amount");
    const bankCode = params.get("vnp_BankCode");
    const payDate = params.get("vnp_PayDate");
    const transactionNo = params.get("vnp_TransactionNo");

    if (!orderId) {
      setMessage("Không xác định được đơn hàng.");
      setLoading(false);
      return;
    }

    // Lưu info để hiển thị UI
    setTxnInfo({
      orderId,
      amount: amount ? (Number(amount) / 100).toLocaleString("vi-VN") + "₫" : "—",
      bankCode: bankCode || "—",
      payDate: payDate || "—",
      transactionNo: transactionNo || "—",
      responseCode: responseCode || "—",
    });

    const processPayment = async () => {
      try {
        setLoading(true);

        // Gọi backend xử lý thanh toán (update PAID / FAILED)
        await api.post(
          `/orders/${orderId}/pay?vnp_ResponseCode=${responseCode}`
        );

        if (responseCode === "00") {
          setIsSuccess(true);
          setMessage("Thanh toán thành công! Đơn hàng của bạn đã được ghi nhận.");
        } else {
          setIsSuccess(false);
          setMessage("Thanh toán thất bại hoặc đã bị hủy. Vui lòng thử lại.");
        }
      } catch (err) {
        console.error("Lỗi khi xử lý đơn hàng:", err);
        setIsSuccess(false);
        setMessage("Có lỗi xảy ra khi xử lý đơn hàng. Vui lòng liên hệ hỗ trợ.");
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [location.search]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white shadow-lg rounded-2xl px-8 py-10 flex flex-col items-center">
          <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-600 text-lg font-medium">
            Đang xử lý thanh toán của bạn...
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Vui lòng không tắt trình duyệt trong giây lát.
          </p>
        </div>
      </div>
    );
  }

  const statusColor = isSuccess ? "text-emerald-600" : "text-rose-600";
  const statusBg = isSuccess ? "bg-emerald-50" : "bg-rose-50";
  const statusIconBg = isSuccess ? "bg-emerald-100" : "bg-rose-100";
  const statusButton =
    isSuccess ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-3xl overflow-hidden">
        {/* Header trạng thái */}
        <div className={`px-8 py-6 ${statusBg} border-b`}>
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center ${statusIconBg}`}
            >
              {isSuccess ? (
                <svg
                  className="w-8 h-8 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-8 h-8 text-rose-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v4m0 4h.01M12 5a7 7 0 100 14 7 7 0 000-14z"
                  />
                </svg>
              )}
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${statusColor}`}>
                {isSuccess ? "Thanh toán thành công" : "Thanh toán không thành công"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {isSuccess
                  ? "Cảm ơn bạn đã mua sắm. Thông tin đơn hàng đã được cập nhật."
                  : "Rất tiếc, giao dịch của bạn chưa được hoàn tất."}
              </p>
            </div>
          </div>
        </div>

        {/* Nội dung chính */}
        <div className="px-8 py-6 space-y-6">
          <p className="text-base text-gray-700">{message}</p>

          {/* Thông tin giao dịch */}
          <div className="border rounded-2xl p-4 bg-slate-50">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Thông tin giao dịch
            </h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <dt className="text-gray-500">Mã đơn hàng</dt>
                <dd className="font-medium text-gray-800 break-all">
                  {txnInfo.orderId}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Số tiền</dt>
                <dd className="font-semibold text-gray-900">
                  {txnInfo.amount}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Ngân hàng</dt>
                <dd className="font-medium text-gray-800">
                  {txnInfo.bankCode}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Mã giao dịch</dt>
                <dd className="font-medium text-gray-800">
                  {txnInfo.transactionNo}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Mã phản hồi</dt>
                <dd className="font-medium text-gray-800">
                  {txnInfo.responseCode}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Thời gian thanh toán</dt>
                <dd className="font-medium text-gray-800">
                  {txnInfo.payDate}
                </dd>
              </div>
            </dl>
          </div>

          {/* Gợi ý tiếp theo */}
          <div className="text-xs text-gray-500 bg-slate-50 rounded-2xl p-3">
            {isSuccess ? (
              <p>
                Bạn sẽ nhận được email hoặc thông báo trong mục đơn hàng khi
                hệ thống xử lý xong. Nếu cần hỗ trợ, vui lòng liên hệ chăm sóc
                khách hàng.
              </p>
            ) : (
              <p>
                Nếu tiền đã trừ nhưng đơn hàng chưa được ghi nhận, vui lòng
                liên hệ bộ phận hỗ trợ và cung cấp mã giao dịch để được kiểm
                tra.
              </p>
            )}
          </div>
        </div>

        {/* Footer nút */}
        <div className="px-8 py-4 border-t bg-slate-50 flex flex-col sm:flex-row sm:justify-between gap-3">
          <button
            onClick={() => navigate("/")}
            className="w-full sm:w-auto bg-gray-600 text-white px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-700 transition"
          >
            Về trang chủ
          </button>

          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={() => navigate("/user/orders")}
              className={`flex-1 sm:flex-none ${statusButton} text-white px-4 py-2.5 rounded-full text-sm font-semibold transition`}
            >
              Xem lịch sử đơn hàng
            </button>
            {!isSuccess && (
              <button
                onClick={() => navigate("/cart")}
                className="flex-1 sm:flex-none bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-100 transition"
              >
                Thanh toán lại
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
