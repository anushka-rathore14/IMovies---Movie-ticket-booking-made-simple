import React, { useState } from 'react';
import {
  X,
  CreditCard,
  QrCode,
  Building,
  ShieldCheck,
  Lock,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

const CheckoutModal = ({
  isOpen,
  onClose,
  movie,
  theatre,
  show,
  selectedSeats = [],
  onConfirmBooking,
  isProcessing,
}) => {
  const [activeTab, setActiveTab] = useState('upi'); // 'upi' | 'card' | 'netbanking'
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [upiId, setUpiId] = useState('customer@okhdfcbank');

  if (!isOpen || !show || !movie) return null;

  const ticketSubtotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const convenienceFee = Math.round(ticketSubtotal * 0.05);
  const taxes = Math.round(convenienceFee * 0.18);
  const totalAmount = ticketSubtotal + convenienceFee + taxes;

  const handlePay = () => {
    let method = 'UPI / QR';
    if (activeTab === 'card') method = 'Credit/Debit Card';
    if (activeTab === 'netbanking') method = 'Net Banking';
    onConfirmBooking(method);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Secure Checkout & Ticket Pay</h3>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Movie & Show Capsule */}
          <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-14 h-20 rounded-xl object-cover shadow-md"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-white truncate">{movie.title}</h4>
              <p className="text-xs text-slate-400 mt-0.5 truncate">
                {theatre.name} • {show.format || 'IMAX 3D'}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-slate-300">
                <span className="px-2 py-0.5 rounded bg-slate-800 font-semibold text-rose-400">
                  {show.date} • {show.startTime}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 font-medium">
                  Screen {show.screenNumber || 1}
                </span>
              </div>
            </div>
          </div>

          {/* Seats & Price Breakdown */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Seats Selected ({selectedSeats.length}):</span>
              <span className="font-bold text-white">
                {selectedSeats.map((s) => s.seatNumber).join(', ')}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Ticket Subtotal</span>
              <span>₹{ticketSubtotal}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Convenience Fee (5%)</span>
              <span>₹{convenienceFee}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>GST & Taxes (18%)</span>
              <span>₹{taxes}</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-bold">
              <span className="text-white">Total Payable Amount</span>
              <span className="text-rose-400 text-lg">₹{totalAmount}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Select Payment Method
            </label>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('upi')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-semibold gap-1.5 transition-all ${
                  activeTab === 'upi'
                    ? 'border-rose-500 bg-rose-500/10 text-rose-400 font-bold'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:text-white'
                }`}
              >
                <QrCode className="w-5 h-5" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('card')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-semibold gap-1.5 transition-all ${
                  activeTab === 'card'
                    ? 'border-rose-500 bg-rose-500/10 text-rose-400 font-bold'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span>Card</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('netbanking')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-semibold gap-1.5 transition-all ${
                  activeTab === 'netbanking'
                    ? 'border-rose-500 bg-rose-500/10 text-rose-400 font-bold'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:text-white'
                }`}
              >
                <Building className="w-5 h-5" />
                <span>Net Banking</span>
              </button>
            </div>

            {/* Tab Details */}
            <div className="mt-4 p-4 rounded-2xl bg-slate-800/30 border border-slate-800/70">
              {activeTab === 'upi' && (
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-3 bg-white rounded-2xl shadow-lg shadow-black/40">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi://pay?pa=imovies@upi&pn=IMovies&am=${totalAmount}&cu=INR`}
                      alt="UPI QR Code"
                      className="w-28 h-28"
                    />
                  </div>
                  <p className="text-xs text-slate-400">
                    Scan with any UPI app (GPay, PhonePe, Paytm) or use VPA:
                  </p>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full max-w-xs px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-center text-white font-mono"
                  />
                </div>
              )}

              {activeTab === 'card' && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Card Number (Demo prefilled)</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">CVV</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        maxLength={4}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'netbanking' && (
                <div className="space-y-2 text-xs">
                  <label className="text-[11px] text-slate-400 block mb-1">Select Your Bank</label>
                  <select className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white">
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>State Bank of India (SBI)</option>
                    <option>Axis Bank</option>
                    <option>Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>256-Bit SSL Encrypted</span>
          </div>

          <button
            onClick={handlePay}
            disabled={isProcessing}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-xl shadow-rose-600/30 hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-all"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authorizing Payment...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Pay ₹{totalAmount} & Confirm</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
