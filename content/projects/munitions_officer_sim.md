---
title: "Munitions Officer Simulator"
description: "A dive into game feel and polish in the context of a Munitions Officer on a starship."
tags:
  - "Solo"
  - "Unreal Engine"
thumbnail: "/images/portfolio/munitions_officer_sim/nanotrasen_logo.png"
timestamp: 1698796800
buttonTexts:
buttonLinks:
---

<iframe width="854" height="480" src="https://www.youtube.com/embed/8z7NPgZNUYU?si=6T502YgYt7Khfw0M" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen style="margin-left:auto;margin-right:auto;"></iframe>

## Chapter 1
# Interaction System
### Design
- Loose objects in the world will be marked as `Grabbable`, likely through some sort of attachable `Component` or `Interface`.
- Attachment will be done via the `Physics Handle` functionality built into the `Chaos Physics Engine` in UE5.
- They can be picked up using a `Motion Controller` (or the cursor) by clicking and dragging.
- Larger / Heavier objects will lag behind more to simulate the effect of weight.
- Examples of such items in the world:
   - MAC Shells
   - Multi-Tool
   - Crates
   - Tools
### Justification
To create a Virtual Reality game, physics will always be a component a developer will need to account for. This is in part due to the inherent nature of using a head mounted display with hand-tracking controllers. Anything the player interacts with, at least relative to them, should respond predictably. This often involves objects succumbing to gravity or pressing up against solid walls.

<img src="/images/portfolio/munitions_officer_sim/interaction1.png" alt="">

To simulate this effect on the two-dimensional prototype I am constructing, any interactable objects will be set to continuously simulate their position in world space. The player’s cursor will not directly influence the positions of these objects, but instead impart forces upon them that “push” or “pull” the object in the intended direction. Combined with a slight delay, this creates the feeling of weight or drag on the object.

## Chapter 2
# User Interface
### Design
The interface design will be a combination of two pre-existing designs with some smaller tweaks and changes.
- The aesthetics will primarily be based off the [Space Station 14 UI Figma](https://www.figma.com/design/KE5eKymegsLrsQdjZGbTIs/UI?node-id=0-188) that they have publicly presented.
- Elements of the UI will be constructed modularly so they can be reused easily elsewhere in the project. (i.e. `Windows`, `Buttons` etc)
- The core layout of some UIs will be influenced from their origins in FTL13 (MAC and Ammo Racks) though these will be split into their own windows for ease of use.
- User Interfaces will consist of windows that popup on the screen, able to be moved around and re-ordered on the screen.

### Justification
The primary reason for using the SS14 UI design is due to it being the most modern version of the existing interfaces from the SpaceStation games. Being only a couple of years old and still actively developed means it's more suited for use in modern game engines compared to the original. It also features a relatively high contrast and easily readable system of elements that can be reused for quick construction of interfaces, following distinct patterns for formatting that assist in player understanding.

<div class="gallery">
    <img src="/images/portfolio/munitions_officer_sim/interface1.png" alt="">
    <img src="/images/portfolio/munitions_officer_sim/interface2.png" alt="">
</div>

FTL13’s UIs, for comparison, were created using basic HTML elements with simple CSS formatting due to the limitations of the [BYOND engine](https://www.byond.com/?) at the time. This means that almost all elements are simple square box buttons and text. While functional, this does limit readability to the player as there are no visual clues to guide their actions or formatting to organise the content.

<img src="/images/portfolio/munitions_officer_sim/interface3.png" alt="">

The goal of this system is to take the new design and apply it to the old systems, creating a far more visually appealing result. The new UI will also feature additional elements to aid in accessibility, such as the changing of colour for some elements when they are enabled/disabled or when a certain value is positive/negative in context. The use of a windowed design allows for multiple UI elements to be displayed and hidden within their relevant contexts while also maximising the player choice to organise their view as they see fit. While providing an initial increase in workload to setup, the longer term maintenance will be lower as there will not need to be as many considerations for fitting content on a static HUD.

## Chapter 3
# MAC System
### Design
- The MAC acts as the main static component of the gameplay loop, with the dynamic part being the Shells the player must load.
- The order of interactions on the MAC/Shells should go as follows:
  1. Open Breach
  2. Order Shell
  3. Arm Shell
  4. Insert Shell
  5. Close Breach
  6. Load Shell
  7. Fire
  8. Repeat
- The player’s performance will be rated on their ability to complete this loop.
- Penalties included for incorrect shells loaded.
- Ejecting an armed shell or firing an unarmed shell fails the game as it blows up the weapon.
- The MAC will have multiple secondary statistics that can influence operation, sometimes requiring small singular tasks to rectify before continuing.
  - Coil Alignment
  - Actuator Replacement
  - Oil Levels
- Shells will contain some form of minigame retain engagement
  - 2FA Style Captcha
  - Wire Cutting
  - Part Assembly
- Shells are to be a finite resource, with stock management included.
  - On longer runs player can acquire more shells from a “store”
  - Player must take care not to misuse their ammunition
  - Player must load the correct type of ammo for their current situation
### Justification
The design for this element of the project sources heavily from the original gameplay of [FTL13](https://ftl13.com/).
The concept of having the MAC that is loaded by an individual using different shells is from
the game. However, some of these elements have been adjusted for the standalone game,
including level changes to better fit with VR gameplay.

The level has been reduced to a side view approach. This is to match the VR viewpoint of
being in the world, including being able to pan and zoom the camera. Getting in close with
the focus of the gameplay will allow players to immerse themselves better. With this, every
action and task the player takes will feel more personal to the player, encouraging them into
a sense of “flow” and tunnel vision.

<img src="/images/portfolio/munitions_officer_sim/mac1.png" alt="">

The inclusion of many menu elements on the screen and various mini-game tasks to
complete are intentionally done to contribute to an overarching sense of pressure building in
the game. The captain issuing orders, juggling the MAC itself as well as the Ammo Racks,
Shells and Multi-Tool means that the player needs to consider their priorities and choose
their tasks. The need to make these decisions will further inhibit their proficiency at the tasks,
leading to a higher chance of failure. The stress induced fail conditions often leave players
with a feeling of frustration that encourages them to try again and push on to improve on
their own score or success.