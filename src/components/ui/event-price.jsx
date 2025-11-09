export default function EventPrice({ price, currency = '$' }) {
  return (
    <div className="text-base leading-6 text-black">
      <p>{price ? `From ${price} ${currency}` : 'Free'}</p>
    </div>
  );
}
