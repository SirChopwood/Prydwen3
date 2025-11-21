---
title: "Nebula Chat System"
description: "A recreation of the advanced chat system found in Space Station 13, including telecommunications."
tags:
  - "Solo"
  - "Unreal Engine"
  - "Modelling"
  - "Work-In-Progress"
thumbnail: "/images/projects/nebula_chat/day2_config.png"
timestamp: 1733788800
buttonTexts:
  - "GitHub"
buttonLinks:
  - "https://github.com/SirChopwood/DwarvesVSZombies"
hidden: "false"
---
## Overview
One of the core elements of the game [Space Station 13](https://spacestation13.com/) (SS13) is the iconic Chat Box. The UI for the chat takes up a considerable area of the screen, ranging from a quarter to half depending on preferences. It is also where a lot of the action actually occurs in the game. For example any kind of discussion, talking, radio chatter and even in character mental notes are all conveyed through the different fonts and styles displayed within the chat.
    
Adding on to this, SS13 has a hidden gem of a telecommunications system implemented into the game world itself. A spoken chat message does not simply teleport to the other players, instead it is processed by a variety of entities that ensure the correct characters and objects receive the message and in a format relevant to them. 

For example, if you scream down the engineering channel for the chief, he must have a headset or radio nearby that is tuned to the correct frequency to hear it. If power is out and the servers are down, he may well never receive the message anyway or it may come incomplete if power is intermittent.
    
The combination of diagetic and physicalised elements driving what is a simple User Interface feature is what makes this particular system so interesting to myself. To that end I decided that it would be a good practice task to undertake, porting the concept over to Unreal Engine and implementing it to be fully customisable and replicated in a multiplayer environment. 

Below is a log of my thoughts and processes as I worked to do just that...

# 20/11/2024
## Day 1 - The Plan
To begin this project, I researched the existing systems in place on the [/tg/station wiki](https://tgstation13.org/wiki/Guide_to_Telecommunications#Standard_Structure). Noting down the key features I was able to construct a rough diagram of the flow for a message in the telecomms system.

### A `Message` will consist of the following parts:
- Message `Content`, the raw text itself.
- The `Sender` which is a human readable name for the source of the message.
- Radio `Channel` will dictate who can receive the message, as well as which mainframes can accept it and what visual formatting rules it will follow.
- `Metadata` such as any custom text formatting or extra player character information that may be used by the Servers or receiving clients.

### A message will generally follow the flow shown below:
_In the Telecommunications (TComms) setup each step is controlled by a different `TComms Machine`._
- Messages arrive at `Receiver`.
- `Hub` distributes messages to `Routers`.
- `Mainframes` validate messages for their given channel.
- (Optional) `Processors` unscramble messages, else result will be "corrupted".
- (Optional) Messages are logged & scripts are applied by `Servers`.
- Resulting messages are broadcasted by the `Transmitter`.

<img src="/images/projects/nebula_chat/day1_diagram.png" alt=""/>

With those notes made, I also quickly took to blender to model out some placeholder meshes for each point. Shown in order; `Server`, `Mainframes`, `Transmitter`/`Receiver`, `Hub`, `Processor`.

<img src="/images/projects/nebula_chat/day1_models.png" alt=""/>

# 21/11/2024
## Day 2 - Initial Proof of Concept
The first in-engine task was to get an incredibly basic and simple example of the feature working. This would involve pressing a key, the message passing through the correct machines and landing in the debug log.

To facilitate the system, I created a base `TComms Machine` actor that would be used for communication, holding generalised functions that could be overridden for the handling of a message in all the child actors. This would ensure that there is a consistent method to pass data between the machines as well as simplify later updates to their functionality.

The machines for now would have the ability to directly link them via the Editor, adding any following machines to the preceding one's array. This is then verified at game start. In the future this is where multi tool and wiring functionality could be added to enable dynamically built setups, however, it is out of the scope of this system. Additionally the RouteRadioMessage function will facilitate that need to pass data between machines.
<img src="/images/projects/nebula_chat/day2_tcomms_machine.png" alt=""/>

### Receiver
For the concept, this simply takes any message given and just passes it onwards. Later on it'll be the target to receive a message from external sources.
### Hub
Any message given to a hub is checked against its internal list of connected Mainframes, if one matches the radio channel, it is sent the message. The message is also tagged by the Hub with it's Network name, allowing debugging to see where a message was handled.
### Mainframes
The Mainframe applies the channel settings such as colour. It also acts as a way to limit what radio channels a given network can provide support for, in SS13 this is handled via Encryption Keys that you can obtain from headsets or the Heads of Staff's lockers.
### Processor
The processor takes the message and reverses the scrambling algorithm, returning the message to a normal readable state. While not required, lacking this machine will leave a message that vaguely resembles the original, yet with missing characters.
### Server
For the demo, servers do nothing for now. In the future their primary purpose will be logging as well as the ability to customise any additional message processing. (Such as putting job roles in the message or whitelisting specific IDs to speak a channel.
### Transmitter
The transmitter simply prints text to the debug log for now, however in the future it will be what broadcasts messages to any listening machines.
<div class="gallery">
    <img src="/images/projects/nebula_chat/day2_actors.png" alt="" class=""/>
    <img src="/images/projects/nebula_chat/day2_config.png" alt="" class=""/>
</div>


# 22/11/2024
## Day 3 - Speaking and Listening
With a functional concept in place, it is time to go back and reconsider the scope and requirements of the project. For one, currently there is no proper way to send, receive or communicate messages of any kind between actors.

 My solution here is to add two new actor components to the project, the `Speaking Component` and `Listening Component`. These would contain all the logic needed for ANY actor to make use of, an in a manner that doesn't require both be present. For example, a vending machine speaking its little chimes to the player does not need to handle what the players mutter as they walk past. Likewise, a handheld microphone needs to be able to hear spoken messages, yet has no need to speak them itself.

Another issue is code scoping and how to handle the actual passing of messages, especially in a multiplayer context.
