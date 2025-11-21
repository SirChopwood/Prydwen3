---
title: "Siege & Shield"
description: "University Senior Collaborative Project, a third person tower defence game inspired by Orcs Must Die and Sanctum."
tags:
  - "Teamwork"
  - "Unreal Engine"
thumbnail: "/images/projects/siege_and_shield/promo_poster2.png"
timestamp: 1688166000
buttonTexts:
buttonLinks:
hidden: "false"
---

# Chapter 1
## Introduction
**Siege & Shield** (Project Name: `MageDefenders`) is a game that myself and ~20 other students created during a university event, collaborating in large teams with a mixture of disciplines.
The aim was to simulate the experience of working in a studio with different disciplines working together in subteams to all contrubute towards and finish a project.

<img src="/images/projects/siege_and_shield/banner.png" alt="">

As a team we decided on making a Third Person Tower Defence game, incorporating the unique viewpoint seen in games such as Orcs Must Die and Sanctum.
Our art style was majorly inspired by World of Warcraft and Dauntless, using a fantasy medieval theme.

My role within the team (dubbed `Team [REDACTED]`) was as Team Leader and the Tech (Gameplay & Engineering) Sub-Team Leader.

# Chapter 2
## Project Management
As Team leader I spent a lot of time coordinating the other SubTeams of the project. Ensuring information was passed from one group to another or pointing people in the correct direction to find it themselves. Multiple times a week I'd gather together the Seniors/SubTeam Leaders and discuss the progress of the project with them. A core goal being to keep the whole team up to date with development and address any questions floating about.

During our in-person sessions I'd often hover about my own team, discussing the project with our supervising lecturers and offering my knowledge to the junior members of the team. Some of which had minimal experience to work with at this point in the year. Additionally, during this time I was helping troubleshoot and set up the team with Source Control, running through Git (using Github Desktop, Git itself and Unreal Engine's interfaces. Multiple times this included sitting down and giving 1-to-1 tutorials or being called over to oversee potentially breaking merges.

By the end of the project we had over 850 commits, 4 active branches and 3.3GB of files in use without any major issues or conflicts. This included active use by artists and other non-engine based members as well as the core programmers.

# Chapter 3
## Building and Towers
My primary focus as a member of the Tech Team was the Building and Tower system. This meant creating a framework that could be used by other tech and design members.

For this, building is handled through an Actor Component, containing all the logic for handling the player's current state. Included with this would be a UI for the mode and an in-world decoy, previewing where and what would be built. This was set with easy to customise data in the editor via a struct on the tower blueprints.

<img src="/images/projects/siege_and_shield/building.gif" alt="">

The towers themselves work on an inheritance system from a master blueprints, with multiple helper components for reusable functionalities. This setup means designers can quickly test and implement new towers without needing to interact with the core functionalities.

All towers are then managed by a manager actor in the world, this acts as the main method of communication and interaction between the player and towers. This manager is how the player can Buy, Sell and Upgrade towers as well as holding the currency for the game. It contains systems in place for unlockable towers throughout the game and even branching upgrade paths, if designers wish to use them. Additionally, it was also what controlled the connections between towers, ensuring adjacent towers would become a solid wall.

# Chapter 4
## Materials and VFX
One of my other tasks was working with the Environment Team to create materials and vfx for multiple assets they were implementing into engine. Often this involved just helping them setup different adjustment parameters to their textures. I also took this opportunity to experiment with a couple new ideas and further my general knowledge of Unreal Engine's new(ish) Niagara systems.

<img src="/images/projects/siege_and_shield/tech_art.gif" alt="">

A larger task was to setup the landscape materials. This included dynamic grass and rocks and automatic cliff edges, making level editing as seamless as possible for the level designer. Along with this was tree leaves and grass meshes with materials setup for subtle swaying in the wind, brining life to otherwise entirely static meshes.

Lastly, once towers were being implemented, I worked on some particle systems that they'd use. This included the spinning crystals of the Pylon and the bubbling embers of the Cauldron tower. However, due to limitations in other areas, the priority of these elements was low so only a few were finished.
