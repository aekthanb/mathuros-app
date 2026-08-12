"use client";

import { useEffect, useRef, useState } from "react";

export type AddressSearchResult = {
  lat: number;
  lng: number;
  displayName: string;
  addressLine?: string;
  subDistrict?: string;
  district?: string;
  province?: string;
  postcode?: string;
};

type NominatimAddress = {
  house_number?: string;
  road?: string;
  neighbourhood?: string;
  suburb?: string;
  quarter?: string;
  village?: string;
  city_district?: string;
  district?: string;
  county?: string;
  city?: string;
  state?: string;
  province?: string;
  postcode?: string;
};

type NominatimResult = {
  lat: string;
  lon: string;
  display_name: string;
  address?: NominatimAddress;
};

// Thailand's special self-governing areas (Bangkok, Pattaya) aren't tagged with
// state/province in OSM data — they show up as `city` instead.
function provinceFromAddress(address: NominatimAddress): string | undefined {
  if (address.province) return address.province;
  if (address.state) return address.state;
  if (address.city && (address.city.includes("กรุงเทพ") || address.city.includes("พัทยา"))) return address.city;
  return undefined;
}

function addressLineFromAddress(address: NominatimAddress): string | undefined {
  const parts = [
    address.house_number,
    address.road,
    address.neighbourhood,
    address.quarter,
    address.suburb,
    address.city_district,
    address.district,
    address.county,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : undefined;
}

function subDistrictFromAddress(address: NominatimAddress): string | undefined {
  const value = address.quarter ?? address.neighbourhood ?? address.suburb ?? address.village;
  return value?.replace(/^(แขวง|ตำบล)\s*/, "");
}

function districtFromAddress(address: NominatimAddress): string | undefined {
  // Bangkok is commonly returned as quarter → suburb → city, where suburb is the district.
  const bangkokDistrict = address.quarter && address.suburb ? address.suburb : undefined;
  const value = address.city_district ?? address.district ?? address.county ?? bangkokDistrict;
  return value?.replace(/^(เขต|อำเภอ)\s*/, "");
}

export default function AddressSearch({ onSelect }: { onSelect: (result: AddressSearchResult) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AddressSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const skipNextSearchRef = useRef(false);

  useEffect(() => {
    if (skipNextSearchRef.current) {
      skipNextSearchRef.current = false;
      return;
    }
    const trimmed = query.trim();
    if (trimmed.length < 3) return;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          format: "jsonv2",
          addressdetails: "1",
          countrycodes: "th",
          "accept-language": "th",
          limit: "5",
          q: trimmed,
        });
        const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("search failed");
        const data: NominatimResult[] = await res.json();
        setResults(
          data.map((item) => ({
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            displayName: item.display_name,
            addressLine: item.address ? addressLineFromAddress(item.address) : undefined,
            subDistrict: item.address ? subDistrictFromAddress(item.address) : undefined,
            district: item.address ? districtFromAddress(item.address) : undefined,
            province: item.address ? provinceFromAddress(item.address) : undefined,
            postcode: item.address?.postcode,
          }))
        );
        setOpen(true);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError("ค้นหาที่อยู่ไม่สำเร็จ ลองใหม่อีกครั้ง");
          setResults([]);
          setOpen(true);
        }
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  function handleQueryChange(nextQuery: string) {
    setQuery(nextQuery);
    if (nextQuery.trim().length < 3) {
      setResults([]);
      setOpen(false);
      setError(null);
      setLoading(false);
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(result: AddressSearchResult) {
    onSelect(result);
    skipNextSearchRef.current = true;
    setQuery(result.displayName);
    setResults([]);
    setOpen(false);
  }

  return (
    <div className="address-search" ref={containerRef}>
      <input
        value={query}
        onChange={(event) => handleQueryChange(event.target.value)}
        onFocus={() => (results.length > 0 || error) && setOpen(true)}
        placeholder="ค้นหาที่อยู่ เช่น ชื่อถนน ตำบล หรือสถานที่"
      />
      {open && (
        <div className="address-search__results">
          {loading && <div className="address-search__status">กำลังค้นหา…</div>}
          {!loading && error && <div className="address-search__status address-search__status--error">{error}</div>}
          {!loading && !error && results.length === 0 && (
            <div className="address-search__status">ไม่พบที่อยู่ที่ค้นหา</div>
          )}
          {!loading &&
            results.map((result) => (
              <button
                key={`${result.lat},${result.lng},${result.displayName}`}
                type="button"
                className="address-search__item"
                onClick={() => handleSelect(result)}
              >
                {result.displayName}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
