import { useEffect, useState } from "react";

export default function useCountdown(weddingDate) {
  const calculateElapsed = () => {
    const weddingTime = new Date(weddingDate).getTime();
    const now = Date.now();

    const difference = Math.max(0, now - weddingTime);

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [time, setTime] = useState(calculateElapsed);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(calculateElapsed());
    }, 1000);

    return () => clearInterval(timer);
  }, [weddingDate]);

  return time;
}