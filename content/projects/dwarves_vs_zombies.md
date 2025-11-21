---
title: "Dwarves VS Zombies Standalone"
description: "Multiplayer asymmetric PvP survival personal project."
tags:
  - "Solo"
  - "Unreal Engine"
  - "Work-In-Progress"
thumbnail: "/images/projects/dwarves_vs_zombies/day11.png"
timestamp: 1722985200
buttonTexts:
  - "GitHub"
buttonLinks:
  - "https://github.com/SirChopwood/DwarvesVSZombies"
hidden: "true"
---
## Overview
[Dwarves VS Zombies](https://dwarves-vs-zombies.fandom.com/wiki/Dwarves_vs._Zombies_Wiki) is an old game built within Minecraft's engine by Robert Moran (Rawb). I have very fond memories of sinking countless hours into playing this game. Its systems were very fun and interesting and it was a great shame the servers had to go down. Since then I have always desired to relive those experiences hence why I'm looking to make my own take on the project.

To start off the project I made a simple little camera system. Just to get back into the groove of things, this predicts where you're moving and leads the camera on that way to keep things smooth. Also has some zooming.

# 07/08/2024
## Day 1 - New Beginnings
To start off the project I made a simple little camera system. Just to get back into the groove of things, this predicts where you're moving and leads the camera on that way to keep things smooth. Also has some zooming.

# 08/08/2024
## Day 2 - Dwarf Menu
Today I worked on the design of the main "inventory" menu for the dwarves. This is roughly based off Minecraft's inventory screen, though adjusted to make better use of space and fit my needs a bit better.
<img src="/images/projects/dwarves_vs_zombies/day2.png" alt="">

It looks lovely with the assets from [Kenney](https://www.kenney.nl/).
For now im thinking that 6 hotbar slots and 6 backpack slots will be fine for the inventory. Presuming the player holds a `Melee Weapon`, a `Ranged Weapon`, a stack of `Ammo`, a `Healing Item`, a stack of `Building Blocks`, and some `Light Blocks`. Add onto this room for 6 other items, be it more blocks or crafting items or even spare gear. Armour is also worn in another 4 dedicated slots.

# 09/08/2024
## Day 3 - I hate Networking (Part 1 of Many)
Got inventory stuff roughly working. Spent multiple hours slamming my head against a brick wall just to realise it was working fine... you just have to WAIT FOR THINGS TO SPAWN ACROSS CLIENTS!
Anyway you can now add items and it syncs properly. :)

# 10/08/2024
## Day 4 - Inventory Fixing
Hey would you look at that, the Inventory actually works now! Mostly thanks to my friend Val for being a Rubber Ducky for a bit. But now I have a generic inventory component I can reuse across the project for anything that has one. I also added some Tooltips to display info in.
<div class="gallery">
    <img src="/images/projects/dwarves_vs_zombies/day4.png" alt="">
    <img src="/images/projects/dwarves_vs_zombies/day4-1.png" alt="">
</div>

# 13/08/2024
## Day 5 - The Drag-on-ing
No... I didn't add any dragons... Yet...

I did however get item moving between inventories working. Meaning you can now equip, rearrange and even put items in/out of external inventories.
This was one of the biggest hurdles I had going with the interface work. Sadly the tooltips took a hit as a result, but they needed to be hooked up properly anyway so that'll be next i guess.
<div class="gallery">
    <img src="/images/projects/dwarves_vs_zombies/day5.png" alt="">
    <img src="/images/projects/dwarves_vs_zombies/day5-1.png" alt="">
</div>

# 14/08/2024
## Day 6 - The inventory to rule them all
Today I want to be done with the inventory systems so that I can move on to other features.
Some small bugfixes have been done as well as some code cleanup.
Also added back Tooltips with a much better system so that they can be raised where/whenever I like.
<img src="/images/projects/dwarves_vs_zombies/day6.png" alt="">

Item stack splitting and merging is now here. Crafters rejoice!
The new tooltips... yeah... they look a LOT nicer. Totally no inspiration from a certain blocky game.
<div class="gallery">
    <img src="/images/projects/dwarves_vs_zombies/day6-1.png" alt="">
    <img src="/images/projects/dwarves_vs_zombies/day6-2.png" alt="">
</div>

# 16/08/2024
## Day 7 - Welcome to the Internet
Got some backend stuff sorted out, including cleaning up some awful networking code. Benefit is a nicer framework for things going forward... right!?
<img src="/images/projects/dwarves_vs_zombies/day7.png" alt="">

I've also started adding the Hotbar to the HUD and with that the Health and Mana systems.

# 17/08/2024
## Day 8 - Thanks Kenney!
Updated a bunch of the asset packs to newer assets. (Thanks Kenney)

I also setup a base stat component that Mana, HP, Armour etc can all inherit from for the basic functionality. On top of this I worked on the reliability of the character component so that I can easily set up Server or Client functionality.

# 18/08/2024
## Day 9 - Why didnt I use Excel!?
Fun stuff today! Started off with some number crunching in the planning doc. (No spoilers!)

With these numbers i've added in Armour values, which contribute to both your max health and your mana regen. All this updates live as you equip/unequip. I also redid the equipment widget a little to make it cleaner and show the useful stuff, such as displaying enchantments on a given item or its durability.
<img src="/images/projects/dwarves_vs_zombies/day9.png" alt="">

# 19/08/2024
## Day 10 - Problems and Plans
Today's progress has been slow. I've quickly come to realise that some of the previous work is already going to need redoing if its to be integrated together.

For one, the camera system needs overhauling to work alongside the combat system. This was especially a headache as for some reason the rotators just randomly flip to using opposing directions?

The inventory system has already been marked for conversion over to C++ by Val (thank you :3) So that'll be good.

What's less good is that i want to change items from UActors to UObjects which will require redoing most things. Though this is a good chance to decouple some of the UI and functions.

# 22/08/2024
## Day 11 - We're SO back!
Took a couple of days off to just unwind and refresh my mind, plus I ported this devlog onto my personal [Twitter](https://x.com/LouisMayes2001) and website.

Back at it again now with the new camera angle set and rotation keybinds added. I also added a few little things to the test world to aid testing.
<img src="/images/projects/dwarves_vs_zombies/day11.png" alt="">

Expect news on Val's C++ branch very soon, already got Rider and VS setup so we can go once that's ready.