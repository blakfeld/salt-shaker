## Salt-Shaker
This is my attempt at building a frontend for SaltStack. I know that the actual SaltStack team has a project called Halite, but it seems like that project is on the back burner for the time being, and I really wanted a UI to hand out to my clients quicker. Plus, I was super interested in learning Node.js, and due to its asyncronous nature, Salt seemed like a good match.

### This Project is Super Crazy Pre-Alpha

If you come across this and are thinking "Hey, I want a Salt frontend, should I use this?" The answer at this junction is no. Unless you feel like sending me a ton of pull requests.

At the moment, all this app does is let you see what active minions you have, and allows you to view their grains. To avoid constantly polling the salt-server, it stores everything in a mongodb database until you hit the refresh button.

### Features in Progress
Once these features are complete, I'll consider this project in alpha, and usable.

- [x] View Minions
- [x] View Minion Grains
- [x] Store Connection info in Database
- [ ] Add Login
- [ ] Run Salt Calls
- [ ] Alert Better on Timeout
- [ ] Show High State
- [ ] Show Current Pillars
- [ ] Show States
- [ ] Show States
- [ ] Create Global Dashboard
- [ ] Create Minion Dashboard
