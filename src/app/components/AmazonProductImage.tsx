"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type AmazonOfferImage = {
  image?: string | null;
  title?: string | null;
};

const offerCache = new Map<string, AmazonOfferImage>();
const pendingOffers = new Map<string, Promise<AmazonOfferImage>>();

function loadAmazonOffer(asin: string): Promise<AmazonOfferImage> {
  const key = asin.toUpperCase();
  const cached = offerCache.get(key);
  if (cached) return Promise.resolve(cached);

  const pending = pendingOffers.get(key);
  if (pending) return pending;

  const request = fetch(`/api/amazon/${encodeURIComponent(key)}`)
    .then(async (response) => {
      if (!response.ok) throw new Error("Amazon image unavailable");
      return (await response.json()) as AmazonOfferImage;
    })
    .then((offer) => {
      offerCache.set(key, offer);
      return offer;
    })
    .finally(() => pendingOffers.delete(key));

  pendingOffers.set(key, request);
  return request;
}

type Props = {
  asin?: string;
  fallbackSrc: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  objectFit?: "cover" | "contain";
  padding?: string;
};

export default function AmazonProductImage({
  asin,
  fallbackSrc,
  alt,
  sizes,
  priority = false,
  objectFit = "cover",
  padding,
}: Props) {
  const [offer, setOffer] = useState<AmazonOfferImage | null>(() =>
    asin ? offerCache.get(asin.toUpperCase()) ?? null : null,
  );

  useEffect(() => {
    if (!asin) return;
    let active = true;
    loadAmazonOffer(asin)
      .then((nextOffer) => {
        if (active) setOffer(nextOffer);
      })
      .catch(() => {
        // L'image éditoriale reste affichée si Amazon ne répond pas.
      });
    return () => {
      active = false;
    };
  }, [asin]);

  if (offer?.image) {
    return (
      // L'URL vient de l'API Amazon et n'est jamais enregistrée sur le site.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={offer.image}
        alt={offer.title || alt}
        loading={priority ? "eager" : "lazy"}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", padding: padding || "8px" }}
      />
    );
  }

  return (
    <Image
      src={fallbackSrc}
      alt={alt}
      fill
      style={{ objectFit, padding }}
      sizes={sizes}
      priority={priority}
      loading={priority ? undefined : "lazy"}
    />
  );
}
