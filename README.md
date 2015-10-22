# TheGame-0.2

##Description
'The Game' is a 2D Multiplayer Side-scrolling Shooting game built using MongoDB, NodeJS, ExpressJS, Socket.IO, and Phaser. Other tech included Jade, HTML, Grunt, and Yeoman.

Built with a team of 5 over a 6 day period, our goal for this project was to discover making a shooting game that allows multiple players to play together. Our team implemented agile development methodologies with Object-Orientation to help with the translation of data being passed to the sockets and attempted to use MVC design structure.


##Technologies Used
  * Frontend: Phaser, HTML, CSS, Socket.IO
  * Backend: MongoDB, NodeJS, ExpressJS

##User Stories
  * A user can login with oAuth via Facebook or Google.
  * A user can enter a game.
  * A users character is always on center on-screen.
  * A users character Left and Right, and are able to Jump.
  * A users character can aim and shoot with the mouse.
  * A users character can shoot another player.
  * A user can invite another player via hosts IP address and port number.
  * A users character can respawn on death.
  * A users character can collide with the ground and platforms.
  * A users character can grab onto the bottom and sides of platforms.

##Challenges we Faced
  * Lag issues between clients.
  * Object collision between clients.
  * Interaction between client and server.

##Next Steps
  * Score system
  * Improve lag issues
  * Add more weapons for players to interact with
  * Add health bar for players
  * Add leveling system
  * Add win/loss system
  * Add character name
  * Add character kills/deaths score
  * Upload to public site.
  
## The Team
  * Team Lead: Cameron Basham
  * Team Members: Makeven Yan, Philip Yoo, Mark Sunghyuk Park, Arturo Perez

##How to run Locally:
NOTE: Requirements to run include npm, mongo, and node.
NOTE: Because we are using a `.env` file with oAuth keys, we cannot run this as is. Therefore, we will remove oAuth to make this available for anyone to use.
Via the Command Line:
  1. Clone the repo: `git clone https://github.com/cpbasham/TheGame-0.2.git`
  2. Go into folder: `cd TheGame-0.2`
  3. `npm install`
  4. [Add `.env` file... Update coming soon.]
  5. In a separate terminal tab: `mongod`
  6. In a separate terminal tab: `node app.js`
  
Via the Internet Browser:
  1. In the URL: `http://localhost:8080/thegame`
  2. In `System Preferences` > `Network`: Find and copy IP Address
  3. Send the following URL to a friend: `(IP ADDRESS):8080/thegame`
  4. Enter the game and enjoy!
  
