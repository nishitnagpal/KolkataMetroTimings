// components/CurrentTime.js
"use client";

import { useState, useEffect } from "react";
import styles from "../page.module.css";

//export default function CurrentTime({ className }) {
    //const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

export default function CurrentTime({ onTimeChange, className }) {
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  
    
    useEffect(() => {
      const intervalId = setInterval(() => {
        const newTime = new Date().toLocaleTimeString();
        setCurrentTime(newTime);
        if (onTimeChange) {
          onTimeChange(newTime); // Call the callback with the current time
        }
      }, 1000); // Update every 1 second
  
      return () => clearInterval(intervalId); // Clean up on unmount
    }, [onTimeChange]);
  
    return (
      <div> 
        {currentTime} 
      </div>
    );
  }