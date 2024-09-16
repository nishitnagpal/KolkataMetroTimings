// components/CurrentDate.js
"use client";

import { useState, useEffect } from "react";
import styles from "../page.module.css";

export default function CurrentDate({ className }) {
    const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString("en-US", {
      weekday: "short", 
      month: "short", // Abbreviated month name (e.g., "Aug")
      day: "numeric", // Day of the month (e.g., "3")
      /*year: "numeric", // Full year (e.g., "2024")*/
      })
    );
  
    useEffect(() => {
      const intervalId = setInterval(() => {
        setCurrentDate(new Date().toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          /*year: "numeric",*/
          })
        );
      }, 1000 * 60 * 60 * 24); // Update every day
  
      return () => clearInterval(intervalId); // Clean up on unmount
    }, []);
  
    return (
      <div>
        {currentDate}
      </div>
    );
  }