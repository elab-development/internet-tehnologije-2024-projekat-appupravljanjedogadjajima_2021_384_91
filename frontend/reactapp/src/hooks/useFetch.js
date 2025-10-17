import { useState, useEffect } from "react";

/**
 * Custom hook za dinamičko učitavanje podataka sa API-ja
 * @param {string} url - putanja do API endpointa
 * @returns {object} { data, loading, error, refetch }
 */
export default function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // glavna funkcija za učitavanje podataka
  const fetchData = () => {
    setLoading(true);
    setError(null);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Greška pri učitavanju podataka!");
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  // učitaj odmah pri prvom renderovanju
  useEffect(() => {
    fetchData();
  }, [url]);

  // vraća sve što komponenti može da zatreba
  return { data, loading, error, refetch: fetchData };
}
