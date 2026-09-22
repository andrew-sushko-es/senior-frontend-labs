type HeroMediaProps = {
  alt: string;
  imageUrl: string;
};

export function HeroMedia({ alt, imageUrl }: HeroMediaProps) {
  return (
    <div className="lcp-hero-media">
      <img
        alt={alt}
        height={1440}
        loading="lazy"
        src={imageUrl}
        width={2560}
      />
    </div>
  );
}
