// page.js
"use client"

import dynamic from "next/dynamic"
import React, { useState, useEffect } from "react"
import styles from "./page.module.css"
import Image from "next/image"
import { cards } from "./cards.js"
import SearchComponent from "./searchComponent" 
import output from './data/output.json'

//import 'bootstrap';
//import 'bootstrap/dist/css/bootstrap.min.css'
//import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Dynamically import the CurrentDate and CurrentTime component
const CurrentDate = dynamic(() => import("./components/currentDate"), { ssr: false });
const CurrentTime = dynamic(() => import("./components/currentTime"), { ssr: false });

export default function Home() {
  const [activeCardId, setActiveCardId] = useState(null);
  const [view, setView] = useState('lines'); // Track which view is active
  const [selectedStation, setSelectedStation] = useState(null); // Track the selected station
  const [showIntro, setShowIntro] = useState(true); // New state for intro message
  const [lineDataAvailable, setLineDataAvailable] = useState(true);
  const [endStations, setEndStations] = useState({ firstStation: null, lastStation: null });
  const [lineColor, setLineColor] = useState(null); // New state for line color
  const [lineDay, setLineDay] = useState(null); // New state for day
  const [currentDay, setCurrentDay] = useState(null); // New state for current day
  const [currentTiming, setCurrentTiming] = useState(CurrentTime); // New state for current time
  const [nextTimingFirstStation, setNextTimingFirstStation] = useState(null);
  const [nextTimingLastStation, setNextTimingLastStation] = useState(null);
  const [nextTimingIndex, setNextTimingIndex] = useState(-1);
  const [nextTimingIndexDn, setNextTimingIndexDn] = useState(-1);
  const [showBackButton, setShowBackButton] = useState(false); // New state for back button

  const [dakhineshwarCheck, setDakhineshwarCheck] = useState([]);
  
  // Handle the click on a card to show its buttons
  const handleCardClick = (id) => {
    setActiveCardId(id);
    setView(null); 
    setShowBackButton(false); 
  };

  // Handle the click on a station button
  const handleStationClick = (stationName, lineColor) => {
    const stationNameFixed = stationName.split(' (')[0];

    // Clear state and set initial values
    //setActiveCardId(null);
    setView(null);
    setSelectedStation(stationName);
    setLineColor(lineColor);
    setEndStations(null);
    setCurrentTiming(CurrentTime);
    setNextTimingFirstStation(null);
    setNextTimingLastStation(null);
    setShowBackButton(true);
    
    const lineDataArray = output.filter(line => 
      line.color === lineColor && Object.keys(line).some(key => key.startsWith(stationNameFixed))
    );

    if (lineDataArray.length === 0) {
      setLineDataAvailable(false); // Line data not found
      return;
    }
  
    setLineDataAvailable(true);
    
    lineDataArray.forEach(lineData => {
      const stations = Object.keys(lineData).filter(
        key => key !== 'line' && key !== 'color' && key !== 'day' && key !== 'direction'
      );
      const stationNames = stations.map(station => station.replace(' (up)', '').replace(' (dn)', ''));
      const lineDay = lineData.day;
      setLineDay(lineDay);
      let firstStation, lastStation;
      
      if (lineDay == currentDay) {
        if (lineColor === 'green') {
          if (['Esplanade', 'New Mahakaran', 'Howrah', 'Howrah Maidan'].includes(stationNameFixed)) {
            firstStation = 'Esplanade';
            lastStation = 'Howrah Maidan';
            handleTimingUpdate(
              lineData[stationNameFixed + ' (up)'],
              setNextTimingFirstStation,
              setNextTimingIndexDn
            );
            handleTimingUpdate(
              lineData[stationNameFixed + ' (dn)'],
              setNextTimingLastStation,
              setNextTimingIndex
            );
            setEndStations({ firstStation, lastStation });
          } else {
            firstStation = 'Sealdah';
            lastStation = 'Salt Lake Sector-V';
            handleTimingUpdate(
              lineData[stationNameFixed + ' (up)'],
              setNextTimingLastStation,
              setNextTimingIndexDn
            );
            handleTimingUpdate(
              lineData[stationNameFixed + ' (dn)'],
              setNextTimingFirstStation,
              setNextTimingIndex
            );
            setEndStations({ firstStation, lastStation });
          }  
         } else if (lineColor === 'blue') {
            firstStation = stationNames[1];
            const dakhineshwarCheck = lineData['Dakhineshwar (up)'];
            setDakhineshwarCheck(dakhineshwarCheck);
            if (['Dum Dum', 'Noapara', 'Baranagar'].includes(stationNameFixed)) {
              lastStation = 'Dakhineshwar';
            } else {  
                //const dakhineshwarCheck = lineData['Dakhineshwar (up)'];
                lastStation =
                  nextTimingIndex >= 0 && dakhineshwarCheck[nextTimingIndex] === 'X'
                    ? 'Dum Dum'
                    : 'Dakhineshwar';
            }        
            setEndStations({ firstStation, lastStation }); 
            handleTimingUpdate(
              lineData[stationNameFixed + ' (up)'],
              setNextTimingLastStation,
              setNextTimingIndex
            );
            handleTimingUpdate(
              lineData[stationNameFixed + ' (dn)'],
              setNextTimingFirstStation,
              setNextTimingIndexDn
            );         
        } else if (lineColor === 'orange') {
            firstStation = stationNames[0] ;
            lastStation = stationNames[stationNames.length-1];
            const arrays_up = lineData[stationNameFixed + ' (up)'];
            if (arrays_up) {
              handleTimingUpdate(
                [].concat(...arrays_up),
                setNextTimingLastStation,
                setNextTimingIndex
              );
            }
            const arrays_dn = lineData[stationNameFixed + ' (dn)'];
            if (arrays_dn) {
              handleTimingUpdate(
                [].concat(...arrays_dn),
                setNextTimingFirstStation,
                setNextTimingIndexDn
              ); 
            }
            setEndStations({ firstStation, lastStation });
        } else {
            firstStation = stationNames[0] ;
            lastStation = stationNames[stationNames.length-1];
            handleTimingUpdate(
              lineData[stationNameFixed + ' (up)'],
              setNextTimingLastStation,
              setNextTimingIndex
            );
            handleTimingUpdate(
              lineData[stationNameFixed + ' (dn)'],
              setNextTimingFirstStation,
              setNextTimingIndexDn
            );
            setEndStations({ firstStation, lastStation });
        }
      } 
    });
  };

  // Handle the back button click
  const handleBackButtonClick = () => {
    setSelectedStation(null);
    setView(activeCardId); 
    setShowBackButton(false);
  };

  // Update current day on component mount and whenever the component updates
  useEffect(() => {
    const day = new Date().toLocaleDateString('en-us', { weekday: 'short' }).toLowerCase();
    let currentDay;
    if (day === 'sat') {
      currentDay = 'Saturday';
    } else if (day === 'sun') {
      currentDay = 'Sunday';
    } else {
      currentDay = 'Weekday';
    }
    setCurrentDay(currentDay);
  }, []);
 
  const handleTimingUpdate = (stationTiming, setTiming, setIndex) => {
    const result = findNextTiming(stationTiming);
    if (typeof result === 'string') {
      setTiming(result);
      setIndex(-1); // Reset index when no train is available
    } else {
      const { time, index } = result;
      setTiming(time);
      setIndex(index);
    }
  };

  // Function to find the next available timing after the current time
  const convertTo24HourFormat = (timeString) => {
    const [time, modifier] = timeString.split(' ');
    let [hours, minutes, seconds] = time.split(':');
  
    // Convert hours to string to use padStart
    hours = String(hours);
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM' && hours !== '12') {
      hours = String(parseInt(hours, 10) + 12);
    }
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  };

  // Helper function to find the index of the next valid timing for Dakhineshwar
  const findNextValidIndex = (dakhineshwarCheck, indexDakhineshwar) => {
    // Log the dakhineshwarCheck array and nextTimingIndex for debugging
    //console.log('Index:', indexDakhineshwar);

    // Find the index of the next valid timing after the nextTimingIndex
    for (let k = indexDakhineshwar; k < dakhineshwarCheck.length; k++) {
      //const keyIndexToday = dakhineshwarCheck.findIndex((val, k) => k > indexDakhineshwar && val !== 'X');
      if (dakhineshwarCheck[k] !== 'X'){
        //console.log('Found index:', k);
        //console.log('Timing at index:', dakhineshwarCheck[k]);
        return k;
      }
    }  
    // Log the results for debugging
    //console.log('Found index:', keyIndexToday);
    //console.log('Timing at index:', dakhineshwarCheck[keyIndexToday]);

    //return keyIndexToday;
  }

  const findNextTiming = (currentStationTiming) => {
    const { lastStation } = endStations;

    const current = convertTo24HourFormat(currentTiming);
    const actualtime = new Date(`1970-01-01T${current}`);

    //if (lastStation === 'Dakhineshwar') {
      //const nextValidIndex = findNextValidIndex(dakhineshwarCheck, nextTimingIndex);
      
      //if (nextValidIndex !== -1) {
       // const correspondingTiming = currentStationTiming[nextValidIndex];
       // if (correspondingTiming !== 'X' && correspondingTiming !== '') {
        //  console.log(`Next valid timing for selected station: ${correspondingTiming}`);
          //return { time: correspondingTiming, index: nextValidIndex };
        //}
     // }
    //} else{
    for (let i = 0; i < currentStationTiming.length; i++) {
      const time = currentStationTiming[i];
      if (time !== 'X' && time !== '' && time !== 'UP' && time !== 'DN' && time !== 'A' && time !== 'D') {
        const timingDate = new Date(`1970-01-01T${time}`);
        if (timingDate > actualtime) {
          if (lastStation === 'Dakhineshwar'){
            const nextValidIndex = findNextValidIndex(dakhineshwarCheck, i);
            //console.log(time);
            //console.log(i);
            if (nextValidIndex !== -1) {
              const correspondingTiming = currentStationTiming[nextValidIndex];
              //return { time: correspondingTiming, index: nextValidIndex };
              //console.log(`Next valid timing for selected station: ${correspondingTiming}`);
              if (correspondingTiming !== 'X' && correspondingTiming !== '') {
                console.log(`Next valid timing for selected station: ${correspondingTiming}`);
                return { time: correspondingTiming, index: nextValidIndex };
              }
            }
          } else {
              return { time, index: i };
          }
        }
      }
    }        
    return "No more trains today";
  };

  // Toggle between showing cards or all stations' buttons
  const toggleView = (newView) => {
    setActiveCardId(null); // Reset card view when toggling
    setView(newView);
    setSelectedStation(null); // Reset selected station when toggling views 
    setShowBackButton(false);
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div>
          <div className={styles.headercomponentDate}>
            <CurrentDate />
          </div>   
          <p className={styles.headercomponents}> 
            Kolkata Metro Rail Timings
          </p>
          <div className={styles.headercomponentTime}>
            <CurrentTime onTimeChange={setCurrentTiming} /> 
          </div>
        </div>
      </header>
      {showIntro ? (
        <div className={styles.introOverlay}>
          <div className={styles.introContent}>
            <p>Welcome to the Kolkata Metro Rail Timings website!</p> <br></br><br></br>
            <p>Here, you can find the latest timings for metro lines and stations.</p> <br></br>
            <ol style={{ paddingLeft: '30px', textAlign: 'left' }}>
              <li>Select a valid station from available choices.</li><br></br>
              <li>Find the latest metro departure/arrival time from the selected station.</li>
            </ol>
            <button onClick={() => setShowIntro(false)} className={styles.okayButton}>Okay</button>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.description}>
            <p>Please select the required route and station below:</p>
            <p style={{ color: '#42b883' }}> OR </p>
            <p>Type station name here:</p>
            <SearchComponent onStationSelect={handleStationClick} />
            <button className={styles.searchsubmitbutton}>Submit</button>
          </div>  
        
          <div className={styles.buttonsReset}>
            {showBackButton && activeCardId && (
              <button 
                onClick={handleBackButtonClick} 
                className={styles.activeButton}
              >
                Back
              </button>
            )}
            <button 
              onClick={() => toggleView('lines')} 
              className={view === 'lines' && !showBackButton ? '' : styles.activeButton}
            >
              Lines
            </button>
            <button 
              onClick={() => toggleView('stations')} 
              className={view === 'stations' && !showBackButton ? '' : styles.activeButton}
            >
              Stations
            </button>
          </div>
          
          <div className={styles.grid}>
            {selectedStation ? (
              <div  className={styles.nextMetro}>
                <h3>{selectedStation} Station</h3>
                <div className={styles.nextMetroPContainer}>
                  {!lineDataAvailable ? (
                    <p className={styles[`${lineColor}line`]}>Service in this line not yet available</p>
                  ) : (
                    <>
                      {endStations.firstStation && selectedStation.split(' (')[0] !== endStations.firstStation && (
                        <>
                        <p className={styles[`${lineColor}line`]}>
                          {endStations.firstStation}: {nextTimingFirstStation === "No more trains today" ? "No more trains today" : nextTimingFirstStation}
                        </p>
                        </>
                      )}
                      {endStations.lastStation && selectedStation.split(' (')[0] !== endStations.lastStation && (
                        <>
                        <p className={styles[`${lineColor}line`]}>
                          {endStations.lastStation}: {nextTimingLastStation === "No more trains today" ? "No more trains today" : nextTimingLastStation}
                        </p>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            ) : (
              <>
                {activeCardId ? (
                  <div className={styles.buttonsContainer}>
                    {cards.find(card => card.id === activeCardId).buttons.map((button) => {
                      const activeCard = cards.find(card => card.id === activeCardId);
                      return React.cloneElement(button, { 
                        onClick: () => handleStationClick(button.props.children, activeCard.id),
                      });
                    })}
                  </div>
                ) : (
                  view === 'stations' ? (
                    <div className={styles.buttonsContainer}>
                      {cards
                        .flatMap((card) =>
                          card.buttons.map((button) => ({
                            button, // The button component itself
                            cardId: card.id, // The corresponding card id for styling
                          }))
                        )
                        .sort((a, b) => {
                          const textA = a.button.props.children.toLowerCase();
                          const textB = b.button.props.children.toLowerCase();
                          return textA.localeCompare(textB); // Sort alphabetically
                        })
                        .map(({ button, cardId }) => 
                          React.cloneElement(button, { 
                            onClick: () => handleStationClick(button.props.children, cardId), 
                            className: styles[`${cardId}Button`],
                          })
                        )}
                    </div>
                  ) : (
                    cards.map((card) => (
                      <div key={card.id} className={`${styles.card} ${card.className}`} onClick={() => handleCardClick(card.id)}>
                        <h2>{card.title}</h2>
                      </div>
                    ))
                  )
                )}
              </>
            )}
          </div>
        </>
      )}
      <footer className={styles.footer}>
        <div >
          <a href="mailto:nshtngpl@gmail.com" rel="noopener noreferrer" target='_blank' className={styles.footercomponents}> 
            <Image alt="Email logo" src="email.svg" width={30} height={30} className={styles.imagecontainer}/>
          </a>
          <a
            href="http://nishitnagpal.github.io/portfolio" target="_blank" rel="noopener noreferrer" className={styles.footercomponents}> 
            <Image alt="Portfolio logo" src="website.svg" width={30} height={30} className={styles.imagecontainer}/>
          </a>
          <a
            href="http://linkedin.com/in/nishitnagpal" target="_blank" rel="noopener noreferrer" className={styles.footercomponents}> 
            <Image alt="LinkedIn logo" src="linkedin.svg" width={30} height={30} className={styles.imagecontainer}/>
          </a>
          <a
            href="Resume_NishitNagpal.pdf" target="_blank" rel="noopener noreferrer" className={styles.footercomponents}> 
            <Image alt="Resume logo" src="resume.svg" width={30} height={30} className={styles.imagecontainer}/>
          </a>
          <a
            href="https://github.com/nishitnagpal" target="_blank" rel="noopener noreferrer" className={styles.footercomponents}> 
            <Image alt="Github logo" src="github.svg" width={30} height={30} className={styles.imagecontainer}/>
          </a>
        </div>
      </footer>
    </main>
  );
}


