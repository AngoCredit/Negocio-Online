import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  Truck,
  CreditCard,
  Smartphone,
  CheckCircle2,
  ShieldCheck,
  Building,
  ArrowRight
} from 'lucide-react';
import { Listing, Profile, PORTUGAL_DISTRICTS, Order } from '../types/database.types';

interface CartCheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: { listing: Listing; quantity: number }[];
  onRemoveFromCart: (listingId: string) => void;
  onUpdateQuantity: (listingId: string, quantity: number) => void;
  onClearCart: () => void;
  currentUser: Profile;
  onCreateOrder: (orderData: Omit<Order, 'id' | 'order_number' | 'created_at'>) => Order;
}

export const CartCheckoutDrawer: React.FC<CartCheckoutDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveFromCart,
  onUpdateQuantity,
  onClearCart,
  currentUser,
  onCreateOrder,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [recipientName, setRecipientName] = useState(currentUser.full_name);
  const [street, setStreet] = useState(currentUser.address_street || 'Avenida da Liberdade 120, 2º Dto');
  const [postalCode, setPostalCode] = useState(currentUser.address_postal_code || '1250-142');
  const [concelho, setConcelho] = useState(currentUser.address_city || 'Lisboa');
  const [district, setDistrict] = useState(currentUser.address_district || 'Lisboa');
  const [phone, setPhone] = useState(currentUser.phone || '+351 912 345 678');
  const [paymentMethod, setPaymentMethod] = useState<'mbway' | 'multibanco' | 'cartao'>('mbway');
  const [mbwayPhone, setMbwayPhone] = useState('912345678');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const subtotal = cartItems.reduce((acc, item) => acc + item.listing.price * item.quantity, 0);
  const shippingFee = cartItems.some(i => i.listing.delivery_available) ? 4.90 : 0;
  const total = subtotal + shippingFee;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    const firstSeller = cartItems[0].listing.seller_id;
    const firstSellerName = cartItems[0].listing.seller_name || 'Vendedor Marketplace';

    const order = onCreateOrder({
      buyer_id: currentUser.id,
      buyer_name: currentUser.full_name,
      seller_id: firstSeller,
      seller_name: firstSellerName,
      status: 'paid',
      items: cartItems.map(i => ({
        id: 'item-' + i.listing.id,
        listing_id: i.listing.id,
        listing_title: i.listing.title,
        listing_image: i.listing.images[0] || '',
        unit_price: i.listing.price,
        quantity: i.quantity,
        total_price: i.listing.price * i.quantity,
      })),
      subtotal,
      shipping_fee: shippingFee,
      total,
      payment_method: paymentMethod,
      shipping_address: {
        recipient_name: recipientName,
        street,
        postal_code: postalCode,
        concelho,
        district,
        phone,
      },
      delivery_tracking_code: `CTT-PT-${Math.floor(10000000 + Math.random() * 90000000)}`,
      delivery_status: 'preparing',
      delivery_partner_name: 'CTT Expresso',
    });

    setPlacedOrder(order);
    onClearCart();
    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">
              {step === 'cart' ? `Carrinho de Compras (${cartItems.length})` :
               step === 'checkout' ? 'Finalizar Encomenda (Portugal)' : 'Encomenda Confirmada!'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ========================================= */}
        {/* STEP 1: CART ITEMS */}
        {/* ========================================= */}
        {step === 'cart' && (
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            {cartItems.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <ShoppingBag className="w-12 h-12 text-slate-300 mb-3" />
                <h4 className="text-sm font-bold text-slate-800">O seu carrinho está vazio</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Navegue pelos produtos com entrega disponível e adicione ao carrinho para comprar com segurança.
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
                >
                  Continuar a Comprar
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {cartItems.map(({ listing, quantity }) => (
                    <div
                      key={listing.id}
                      className="flex gap-3 p-3 rounded-2xl border border-slate-200 bg-white shadow-2xs items-center"
                    >
                      <img
                        src={listing.images[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=100&q=80'}
                        alt=""
                        className="w-16 h-16 rounded-xl object-cover bg-slate-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {listing.title}
                        </h4>
                        <p className="text-xs font-black text-emerald-700 mt-0.5">
                          {listing.price.toLocaleString('pt-PT')} €
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <Truck className="w-3 h-3 text-emerald-600" /> Entrega em {listing.district}
                        </p>
                      </div>

                      {/* Quantity & Delete */}
                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => onRemoveFromCart(listing.id)}
                          className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5 text-xs font-bold">
                          <button
                            onClick={() => onUpdateQuantity(listing.id, Math.max(1, quantity - 1))}
                            className="w-5 h-5 flex items-center justify-center hover:bg-white rounded"
                          >
                            -
                          </button>
                          <span className="px-1.5">{quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(listing.id, quantity + 1)}
                            className="w-5 h-5 flex items-center justify-center hover:bg-white rounded"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cart Summary Footer */}
                <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal</span>
                      <span className="font-bold">{subtotal.toLocaleString('pt-PT')} €</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span className="flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5 text-emerald-600" /> Portes de Envio CTT
                      </span>
                      <span className="font-bold">{shippingFee.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                      <span>Total</span>
                      <span className="text-emerald-700">{total.toLocaleString('pt-PT')} €</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep('checkout')}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Avançar para Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ========================================= */}
        {/* STEP 2: CHECKOUT & ADDRESS IN PORTUGAL */}
        {/* ========================================= */}
        {step === 'checkout' && (
          <form onSubmit={handlePlaceOrder} className="flex-1 flex flex-col justify-between overflow-y-auto">
            <div className="p-5 space-y-4">
              {/* Delivery Address */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-emerald-600" /> Morada de Entrega em Portugal
                </h4>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">Nome do Destinatário</label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">Morada Completa</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-1">Código Postal</label>
                    <input
                      type="text"
                      required
                      placeholder="1000-001"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-1">Concelho</label>
                    <input
                      type="text"
                      required
                      value={concelho}
                      onChange={(e) => setConcelho(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-1">Distrito</label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300"
                    >
                      {PORTUGAL_DISTRICTS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-1">Telefone / Telemóvel</label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900 block">
                  Método de Pagamento Nacional
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mbway')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'mbway' ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-600/20' : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                    <span className="text-[11px] block">MB WAY</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('multibanco')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'multibanco' ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-600/20' : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <Building className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                    <span className="text-[11px] block">Multibanco</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cartao')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'cartao' ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-600/20' : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                    <span className="text-[11px] block">Cartão</span>
                  </button>
                </div>

                {paymentMethod === 'mbway' && (
                  <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 mt-2">
                    <label className="text-[10px] font-bold text-emerald-900 block mb-1">
                      Número de Telemóvel MB WAY
                    </label>
                    <input
                      type="text"
                      value={mbwayPhone}
                      onChange={(e) => setMbwayPhone(e.target.value)}
                      placeholder="912 345 678"
                      className="w-full text-xs p-2 rounded-lg bg-white border border-emerald-300 font-bold"
                    />
                    <span className="text-[10px] text-emerald-700 mt-1 block">
                      Receberá uma notificação na aplicação MB WAY para autorizar o pagamento de {total.toFixed(2)} €.
                    </span>
                  </div>
                )}

                {paymentMethod === 'multibanco' && (
                  <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200 mt-2 text-xs text-blue-900 space-y-1">
                    <p className="font-bold">Dados de Pagamento Multibanco:</p>
                    <p>Entidade: <strong>21245</strong></p>
                    <p>Referência: <strong>998 123 456</strong></p>
                    <p>Montante: <strong>{total.toFixed(2)} €</strong></p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Bar */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep('cart')}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black py-3 px-6 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Confirmar e Pagar ({total.toFixed(2)} €)</span>
              </button>
            </div>
          </form>
        )}

        {/* ========================================= */}
        {/* STEP 3: ORDER SUCCESS */}
        {/* ========================================= */}
        {step === 'success' && placedOrder && (
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-lg font-black text-slate-900">Encomenda Efetuada com Sucesso!</h4>
              <p className="text-xs text-slate-500 mt-1">
                Número da Encomenda: <strong className="font-mono text-slate-800">{placedOrder.order_number}</strong>
              </p>
            </div>

            <div className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Destinatário:</span>
                <span className="font-bold">{placedOrder.shipping_address.recipient_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Localidade:</span>
                <span className="font-bold">{placedOrder.shipping_address.concelho}, {placedOrder.shipping_address.district}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Código de Rastreio CTT:</span>
                <span className="font-mono font-bold text-emerald-700">{placedOrder.delivery_tracking_code}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="text-slate-700 font-bold">Total Pago:</span>
                <span className="text-base font-black text-slate-900">{placedOrder.total.toFixed(2)} €</span>
              </div>
            </div>

            <button
              onClick={() => {
                setStep('cart');
                onClose();
              }}
              className="w-full bg-slate-900 text-white text-xs font-bold py-3 rounded-xl cursor-pointer"
            >
              Concluir e Voltar ao Marketplace
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
