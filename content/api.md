# Twitch Channels

- Auth into a session
- Refresh Moderated Channels (save them to session)

# DMCA Session

- Get Session - Get session info and requests
- **Create Session** - Give all info, make new session
- **Update Session** - Give optional info, update matching values
  - Change Status (Open, Locked, Closed)
  - Change Host Name
  - Change Attached Channels
  - Change Notification

# DMCA Request

- Add Request - Give all info to add to session
- **Move Request** - Change position of one request
- **Delete Request** - Remove request from session

# API
- misc
  - ping.post
  - time.get
- rrm
  - twitch
    - auth.get
    - moderated.post
  - session
    - fetch.post
    - create.post
    - update.post
  - request
    - create.post
    - move.post
    - remove.post