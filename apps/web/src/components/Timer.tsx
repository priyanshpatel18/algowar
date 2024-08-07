import { useEffect, useState } from "react";

interface TimerProps {
  startTime?: string;
}

export default function Timer({ startTime }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(true);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined = undefined;

    const calculateTimeLeft = () => {
      if (startTime === undefined) {
        setTimeLeft(0);
        setIsActive(false);
        return;
      }

      const now = new Date();
      const start = new Date(startTime);
      const endTime = new Date(start.getTime() + 60 * 1000);
      const difference = endTime.getTime() - now.getTime();

      if (difference <= 0) {
        setIsActive(false);
        setTimeLeft(0);
      } else {
        clearInterval(intervalId);
        setIsActive(true);
        setTimeLeft(Math.floor(difference / 1000));
      }
    };

    if (startTime) {
      // Initial Calculation
      calculateTimeLeft();
      intervalId = setInterval(() => {
        calculateTimeLeft();
      }, 1000);
    } else {
      setTimeLeft(0);
      setIsActive(false);
    }

    return () => intervalId && clearInterval(intervalId);
  }, [startTime])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="select-none text-4xl font-mono mb-4">
        {isActive ? formatTime(timeLeft) : '00:00'}
      </div>
    </div>
  );
}
