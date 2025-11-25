const buildPriceLabel = ({
  isFree,
  priceFrom,
  priceTo,
  currency = '$',
  priceTier,
}) => {
  if (priceTier) return priceTier;
  if (isFree) return 'Free';
  if (priceFrom != null && priceTo != null && priceFrom !== priceTo) {
    return `${priceFrom}–${priceTo}${currency ? ` ${currency}` : ''}`;
  }
  if (priceFrom != null) {
    return `${priceFrom}${currency ? ` ${currency}` : ''}`;
  }
  if (priceTo != null) {
    return `${priceTo}${currency ? ` ${currency}` : ''}`;
  }
  return null;
};

export default function EventPrice({
  isFree = true,
  priceFrom = null,
  priceTo = null,
  currency = '$',
  priceTier = null,
}) {
  const label = buildPriceLabel({
    isFree,
    priceFrom,
    priceTo,
    currency,
    priceTier,
  });
  if (!label) return null;

  return (
    <div className="text-base leading-6 text-black">
      <p>{label}</p>
    </div>
  );
}
