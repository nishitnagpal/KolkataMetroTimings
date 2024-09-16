//searchComponent.js
"use client"

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { getAllButtonLabels } from './cards'; 

export default function SearchComponent({ onStationSelect }) {
    const [query, setQuery] = useState('');
    const [filteredButtons, setFilteredButtons] = useState([]);
    const allButtons = getAllButtonLabels(); // Get all button labels from card.js
  
    useEffect(() => {
      if (query.trim()) {
        const results = allButtons.filter(button =>
          button.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredButtons(results);
      } else {
        setFilteredButtons([]);
      }
    }, [query]);
  
    const handleStationSelect = (stationName, lineColor) => {
      console.log(`Selected station color: ${lineColor}`);
      onStationSelect(stationName, lineColor);
      setQuery(stationName); 
      setFilteredButtons([]); 
    };
  
    return (
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Station name.."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.searchInput}
        />
        {filteredButtons.length > 0 && (
          <ul className={styles.dropdown}>
            {filteredButtons.map((button, index) => 
              <li 
                key={index} 
                className={styles.dropdownItem} 
                onClick={() => handleStationSelect(button.name, button.color)}
              >
                {`${button.name} (${button.color} line)`}
              </li>
            )}
          </ul>
        )}
      </div>
    );
}


