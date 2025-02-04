---
title: "Adventurer's Guild Manager"
description: "My Master's Final Project. Working with a team of peers on Gameplay Programming & User Interfaces."
tags:
  - "Teamwork"
  - "Unreal Engine"
thumbnail: "/images/projects/adv_guild_manager/agm_logo.png"
timestamp: 1711926000
buttonTexts:
  - "GitHub"
  - "Itch.io"
buttonLinks:
  - "https://github.com/SirChopwood/Masters-Project"
  - "https://sirchopwood.itch.io/aventurers-guild-manager"
---

# Chapter 1
## Geometry Scripting
For this project, I spent a large amount of time using the `Geometry Script` plugin for UE5. The intention was to create rooms dynamically as a singular mesh. The primary reason for this being optimisation, but also as a research task for myself as the new technology was rather interesting and could have many potential uses in the future.

The first prototype was a simple box room made out of 5 cubes (4 walls and a floor). With this I had a singular mesh that I could make operations on. For example, cutting out holes for windows and doors. While this is a rather trivial task to do in other programs, the achievement came from getting this to function through pure blueprint without external libraries.

<img src="/images/projects/adv_guild_manager/geoscript_demo1.png" alt="">

I created a `Data Asset` alongside some variables on the blueprints themselves to expose controls to the developer. Things such as meshes, colours, sizes etc. could easily be controlled without needing to change them in an external package. Additionally, this would be useful later on in the project if we had the space to add room building to the player as we could hotswap out preset room designations when they're planning their builds.

<img src="/images/projects/adv_guild_manager/geoscript_demo2.png" alt="">

With the room bounds set and a rough prototype signed off by my university lecturer, It was time to add in the meshes from the room data assets. This began by copying the data of an existing `Static Mesh` into the new `Dynamic Mesh`. From here i could apply any transforms onto it before using the equivalent of the `Array` modifier from Blender to create a chain of meshes. Repeating this logic a few times and I could generate walls and floors as before, but now more detailed than a cube.

### This, however, had its own issues...
1. Newly generated meshes had no collisions. This would cause the NPC characters in our game to simply phase through them if they were ever nudged towards one. This was fixed with a quick recalculation and applying some collision settings after the new mesh component had been set up.
2. For an unknown reason, a boolean cut mesh does not interact well with dynamic navmesh generation. It was for this reason that I had to set up our doors in the project to use Navmesh Link Proxies in order to artificially bridge the gap.
3. Generated meshes had two sides to it. These were useful for exterior facing walls as it meant that they would be visible from either side. Unfortunately the interior walls would clip through each other, rendering things like pillars on the interiors of rooms that shouldn't have them. The solution here was to apply another subtraction boolean to the mesh, using any adjacent room's bounding box as the mask. This would cut away any mesh that stuck into said adjacent rooms. (before and after shown below)

<div class="gallery">
    <img src="/images/projects/adv_guild_manager/geoscript_demo3.png" alt="">
    <img src="/images/projects/adv_guild_manager/geoscript_demo4.png" alt="">
</div>

At this point the performance had become **significantly** worse. The game would stutter every time the scene updated and would hang for seconds at time if any major change occurred. It did not take much searching to notice it would occur whenever the rooms would regenerate. After trial and error with removing specific aspects to see what caused it, it was revealed to be Boolean operations. Any time I would cut a mesh up, it would become significantly more intensive. Now if this was purely for an editor tool, this would have sufficed. But due to the player being able to make changes at runtime, it needed to function during gameplay and despite multiple attempts to simplify and reduce the number of operations being done, it seemed that the engine at this moment in time is simply not cut out to handle it.

### The solution
With days remaining on the project and no feasible solution in sight, the feature had to be changed. It was at this point that we as a team had agree to use a backup solution. This involved using lines of individual static mesh components. For the game demo this functioned fine, however any long term gameplay would have suffered from the performance hit it induces from the high numbers found in the game (We were already easily reach 1000+ meshes just for walls in testing).

<img src="/images/projects/adv_guild_manager/geoscript_demo5.png" alt="">


# Chapter 2
## Tavern UI
For the UI of the game I was tasked with creating a window based system, akin to that seen in most management games. My primary reference is the similar system in [OpenTTD](https://www.openttd.org/screenshots/0.5.0-japanese) and I intended for it to be very quick and easy for the other developers to prototype their UIs without creating more tech debt, dubbed `TavernUI`.

I created a set of template widgets for the project. These functioned to keep the UI consistent between the different windows, including text and buttons as well as the window frame itself. These were set up with various controls and settings that could be quickly and easily adjusted by the other designers.

To start off with the logic, I created a `Player Controller Component` that would house most of the logic for handling the system. The first functions I added were the ability to Add, Remove and Toggle windows. This works by adding or removing them to the `Canvas Box` on the HUD, while also maintaining references to the root widget itself and bypassing the usual Add to/Remove from Viewport nodes. This was done to allow custom implementation and logic for the windows, as well as circumventing known issues such as a lack of Z-Ordering in the viewport itself.

Once these were in place I could add dragging and resizing to the windows, allowing the user or player to reposition and size the windows as they like on the screen. This was quite easy to set up logically, however it took a few iterations to get the correct calculations and inputs in regard to how Unreal Engine calculates the size of a widget on the screen. Then it was just a matter of refining out the bugs and adding in some UX improvements, such as limiting a window from being moved/resized outside the active screen. That way you could not "lose" a window.

<div class="gallery">
    <img src="/images/projects/adv_guild_manager/tavern_ui_demo1.png" alt="">
    <img src="/images/projects/adv_guild_manager/tavern_ui_demo2.png" alt="">
</div>

Additional features that followed included progress bars with customisable colour and text settings and more importantly a reusable `PIP (Picture-in-Picture)` setup for windows focussed on an `Actor` in the world. These could be easily added to anything ingame and plugged in with minimal effort or knowledge. Though warning was still given to the team about the potential performance impacts of overusing scene captures.

<div class="gallery">
    <img src="/images/projects/adv_guild_manager/tavern_ui_demo3.png" alt="">
    <img src="/images/projects/adv_guild_manager/tavern_ui_demo4.png" alt="">
</div>

# Chapter 3
## Particles & Materials
While my primary focus for this project was working on the gameplay programming, I did manage to get a small amount of time to create some particle systems and materials to use about the map.

One of the highlighted particle systems created for this project was the candles for the Coven. These utilised a set of still frames of the flame, scaling, moving and recolouring to give the impression of a living fire. On top of this I experimented with ribbon renderers, achieving a nice stylised smoke trail that fits naturally with the rest of the art style. This effect built on my previous work last year on flames and smoke, achieving a much more subtle and simple effect while also being far more optimised than the previous attempts.
<img src="/src/assets/images/projects/adv_guild_manager/tademo1.png" alt="">

Early on in the project I worked on a cleaned up version of my Cel Shader. This includes customisable outlines and shadow masking. Unlike many alternatives it attempts to remain subtle in its effects and works to make the textures of the asset pop and contract.
<img src="/src/assets/images/projects/adv_guild_manager/tempbg.png" alt="">