# Kolkata Metro Rail Train Timings

[Website](https://kolkata-metro-timings.vercel.app)

## Metro Railway, Kolkata: A Confluence of Culture, Technology, and Eco-Friendliness 🌍🚉

Welcome to the Metro Railway, Kolkata project! This repository is dedicated to building a responsive and efficient platform that provides real-time train schedules for Kolkata’s metro network.

🏙️ Kolkata Metro: A Brief Overview
The Kolkata Metro, the lifeline of the city’s transportation, is not just India’s first but also Asia’s fifth underground railway system, with its journey starting in 1984. From its humble beginnings with just five stations, the network now spans across the city:

Blue Line (North-South) – Fully operational 🌐
Green Line (East-West) – Almost complete 🟢
Purple Line & Orange Line – Partially operational 🟣🟠
Upcoming Yellow and Pink Lines are set to further expand this ever-growing suburban railway network 🌟
With its reach across Kolkata’s northern, southern, eastern, and western regions, the Metro is crucial for the city’s daily commute.

🚀 Project Overview
Accurate Metro Timings at Your Fingertips!

This project addresses a core problem: the need for up-to-date, accurate metro train timings. With each line following a unique daily schedule, it’s difficult to keep track of every detail. This inspired the development of a responsive website that delivers the next available metro train timings based on your selected route and station.

Tech Stack: Built using Next.js, bootstrapped with Create Next App.
Data Handling: Timings are scraped using Python Scrapy from official sources, processed into a JSON file, and made accessible to the website for real-time information.
User Experience: Intuitive selection of lines and stations using color-coded cards, alphabetically sorted station lists, or manual entry via a search bar with autocomplete.

📈 How It Works
1. Users can easily select their desired metro line from color-coded cards for better visibility.
2. Choose your station from a well-organized alphabetical list or by typing the station name directly into the search bar.
3. The site responds with real-time departure times for both up and down directions, based on the current time and date.
4. If the service is not yet operational, the site will provide an appropriate error message. 
5. If there are no more trains available for the selected station in a particular line, appropriate warning message will be provided.

🚨 Pro Tip: The system is so accurate, it calculates timings down to the second – ensuring you won’t miss your next train!

🔄 Routine Updates
To maintain accuracy, the official Metro website is scraped regularly to ensure all timings are up to date. This makes certain that the website reflects the latest schedules, so you can always rely on the most current information.

👋 User-Friendly Intro
When you first load the website, an introductory message will walk you through the process of selecting your metro route and station. Once you’re ready, simply click "OK" and get direct access to real-time metro details.

🌟 This project aims to enhance your daily commute and help you stay on top of your metro schedules with ease and precision. Feel free to explore, contribute, or share your feedback!

The website is deployed through Vercel with Github @ [https://kolkata-metro-timings.vercel.app/](https://kolkata-metro-timings.vercel.app/)
