---
title: "Dave's Blacksmith Shop"
description: "Pixel art crafting game for the Do You WANNA Jam 2025."
tags:
  - "Work-In-Progress"
  - "Teamwork"
  - "Open Source"
  - "Godot"
  - "C#"
thumbnail: "/images/projects/daves_blacksmith_shop/dbs1.png"
timestamp: 1755529200
buttonTexts:
  - "GitHub"
  - "Itch.io"
buttonLinks:
  - "https://github.com/MeowVal/SoYouWannaJam2025"
  - "https://sirchopwood.itch.io/davesblacksmithshop"
hidden: "false"
---

# Introduction
In the summer of 2025, myself and a few friends decided to take on a game jam. We settled on the [Do You WANNA Jam](https://itch.io/jam/do-you-wanna-jam-2025), spending one week to create an experience based around the theme of "PATCH IT UP".

<img src="/images/projects/daves_blacksmith_shop/dbs1.png" alt=""/>

# Sprites & Textures
## Bringing life and soul to a pixel world.
During the jam, I took a lead on the visual style of the project, with many group suggestions. This included sourcing or creating the sprites we'd be using. With the aim of everything being done in-house, we set our artist friend Shiro to work with concepting out the various assets we'd need.

Using these concepts I was able to go ahead and recreate them in Photoshop with a singular palette and with the different layers needed for use ingame. Initially this consisted of some walls and floors made of materials like stone and wood. 

<img src="/images/projects/daves_blacksmith_shop/dbs3.png" alt=""/>

After getting a base foundation and style set from those, I pivoted to the sprites for the items themselves. I used greyscale base sprites with colours applied at runtime to minimise the number of sprites we'd need to create while enabling the other members of the team to quickly add new things to the game by simply changing a variable. This is best shown with the different metals, all sharing their bases.

<img src="/images/projects/daves_blacksmith_shop/dbs2.png" alt=""/>

# Programming
## Items, Items and more Items.

For my programming contributions, I worked on the item system of the game. This involved setting up a system to have easily modifiable and customisable items. As well as enabling crafting of weapons and armour with a plethora of parts and customisations.

To begin with, I created a list of different item types we'd need. Collapsing this list into a smaller set of classes that could be used to construct them. Using inheritance I'd only end up needing three:

``Generic Items`` would be the base class, holding information about the general sprite, name and description as well as logic for picking up, storing etc. All these values were exposed as editor variables, allowing a large collection of resources to be made with minimal effort.

<img src="/images/projects/daves_blacksmith_shop/dbs5.png" alt=""/>

``Modular Parts`` inherit from ``Generic Items`` and contain some additional information and logic, such as materials and what slots on a ``Modular Item`` they fit within and their damage state. These would be what make up the different weapons and armour, with multiple variations existing with the sprites to give a sense of uniqueness to each craft.

<img src="/images/projects/daves_blacksmith_shop/dbs6.png" alt=""/>

``Modular Items`` are a special case of a ``Generic Item`` that itself doesnt do anything, but can contain various ``Modular Parts``. You will find a single one of these as the actual representation of a whole weapon or piece of armour, combining their sprites and stats. They contain the logic for swapping parts out, as well as tracking who their owners are and what their desired changes are. After developing the game for a while, we found it was too hard to visualise the difference of these directly, which is why we added the ``Inspection Table`` as shown below to display its contents in a more direct way.

<img src="/images/projects/daves_blacksmith_shop/dbs4.png" alt=""/>

After the initial version, I would iterate over rewriting much of the code to be more performant with the high numbers of items present as well as enabling more behaviors built in with exposed methods to interact with the items, such as on ``Crafting Stations``.

# Programming
## Crafting the tools to craft.

To be continued...

# User Interface
## Guide Books & Main Menus

To be continued...