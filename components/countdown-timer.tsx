
"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button"; // Assuming you have the Button component
import { Input } from "@/components/ui/input"; // Assuming you have the Input component

export default function Countdown() {
  const [duration, setDuration] = useState<number | string>("");
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const timeRef = useRef<NodeJS.Timeout | null>(null);

  const handleSetDuration = (): void => {
    if (typeof duration === "number" && duration > 0) {
      setTimeLeft(duration);
      setIsActive(false);
      setIsPaused(false);
      setIsFinished(false);
      if (timeRef.current) {
        clearInterval(timeRef.current);
      }
    }
  };

  const handleStart = (): void => {
    if (timeLeft > 0) {
      setIsActive(true);
      setIsPaused(false);
      setIsFinished(false);
    }
  };

  const handlePause = (): void => {
    if (isActive) {
      setIsPaused(true);
      setIsActive(false);
      if (timeRef.current) {
        clearInterval(timeRef.current);
      }
    }
  };

  const handleReset = (): void => {
    setIsActive(false);
    setIsPaused(true);
    setIsFinished(false);
    setTimeLeft(typeof duration === "number" ? duration : 0);
    if (timeRef.current) {
      clearInterval(timeRef.current);
    }
  };

  useEffect(() => {
    if (isActive && !isPaused) {
      timeRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timeRef.current!);
            setIsFinished(true); // Mark as finished when the timer hits zero
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => {
      if (timeRef.current) {
        clearInterval(timeRef.current);
      }
    };
  }, [isActive, isPaused]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")} : ${String(seconds).padStart(2, "0")}`;
  };

  const handleDurationChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setDuration(Number(e.target.value) || "");
  };

  // Calculate progress bar width
  const progressBarWidth = (timeLeft / Number(duration)) * 100;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-indigo-800 via-purple-700 to-pink-600">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 w-full max-w-md animate__animated animate__fadeIn">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">Countdown Timer</h1>
        <div className="flex items-center mb-6">
          <Input
            type="number"
            id="duration"
            placeholder="Enter duration in seconds"
            value={duration}
            onChange={handleDurationChange}
            className="flex-1 mr-4 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 shadow-lg"
          />
          <Button
            onClick={handleSetDuration}
            variant="outline"
            className="text-gray-800 dark:text-gray-200 transition-all ease-in-out duration-300 transform hover:bg-primary-500 hover:text-white"
          >
            Set
          </Button>
        </div>
        <div className={`text-6xl font-bold text-gray-800 dark:text-gray-200 mb-8 text-center animate__animated animate__pulse animate__infinite`}>
          {formatTime(timeLeft)}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-2 mb-6">
          <div
            className="bg-green-500 h-2"
            style={{ width: `${progressBarWidth}%` }} // Correct width calculation
          />
        </div>

        <div className="flex justify-center gap-4">
          <Button
            onClick={handleStart}
            variant="outline"
            className="text-gray-800 dark:text-gray-200 transition-all ease-in-out duration-300 transform hover:bg-green-500 hover:text-white hover:scale-105"
          >
            {isPaused ? "Resume" : "Start"}
          </Button>
          <Button
            onClick={handlePause}
            variant="outline"
            className="text-gray-800 dark:text-gray-200 transition-all ease-in-out duration-300 transform hover:bg-red-500 hover:text-white hover:scale-105"
          >
            Pause
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="text-gray-800 dark:text-gray-200 transition-all ease-in-out duration-300 transform hover:bg-gray-500 hover:text-white hover:scale-105"
          >
            Reset
          </Button>
        </div>

        {/* Display when the countdown finishes */}
        {isFinished && (
          <div className="mt-6 text-center text-2xl font-bold text-red-500">
            Time's Up!
          </div>
        )}
      </div>
    </div>
  );
}
