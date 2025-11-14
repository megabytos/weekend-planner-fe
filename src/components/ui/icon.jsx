'use client';

export default function Icon({ className, name, width, height, ariaLabel }) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      aria-label={ariaLabel}
    >
      <use href={`/svg/sprite.svg#${name}`} />
    </svg>
  );
}
