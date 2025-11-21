---
title: "RMC-14 Contributor"
description: "Coordinated Sprite work, public repository triage and system implementation."
tags:
  - "Teamwork"
  - "Open Source"
  - "C#"
  - "Work-In-Progress"
thumbnail: "/images/projects/rmc14/coverimage.png"
timestamp: 1746850501
buttonTexts:
  - "GitHub"
buttonLinks:
  - "https://github.com/RMC-14/RMC-14"
hidden: "false"
---

# Introduction
RMC-14 is an Open Source project, based off the Space Station 14 codebase on github. It revolves around asymmetric PvP gameplay between a team of Marines versus a Xenonid horde.

I have spent my recent free time contributing to the project as a way to both repay my thanks for the work the maintainers (Whisper and Smug) have done, but also as a way to expand my knowledge and skills outside of Unreal Engine. This involved learning C#, the differences of an ECS based engine and practicing my pixel art skills. As well as this, I've been striving to help other people in the community by teaching what I do know, sharing knowledge and organising certain efforts.

# Modular Boxes
## My first PR and A revealing discovery.
- [PR 5933 - Modular Ammunition Storage](https://github.com/RMC-14/RMC-14/pull/5933)

My first contributions to the project were initially in the form of a simple resprite of the ammunition and magazine boxes the game used. Simple enough on its own, however as I began working with a spriter (artist) on this, I found that the old legacy system used a combination of over 500 different sprites in order to create their visuals for roughly 50 items in the game. This was, quite frankly, absurd and could certainly be improved in a few areas. Most specifically the fact that many sprites were identical if not for colour.

<img src="/images/projects/rmc14/modularsprites.png" alt=""/>

My solution was to make a set of modular sprites, these could then be coloured in-engine using some functions buried in the code for the engine. It would mean that with only about 50 sprites, I could reassemable all the existing assets in a way that would be far easier to maintain long term.

<img src="/images/projects/rmc14/modularboxes.png" alt=""/>

The end result was a far more consistent visual style as well as significant optimisations to the developer experience and even a slight resource usage improvement.

# CamoTech:tm:
## Migrating modern development techniques to a decades old game. 
- [PR 6005 - Addition of CamoTech:tm:](https://github.com/RMC-14/RMC-14/pull/6005)
- [PR 6325 - Update to resolve clothing issues.](https://github.com/RMC-14/RMC-14/pull/6325)

With some legal queries resolves in the development channels, some new sprites were needed for certain assets. In this case a few of us has collaborated to bring to life the M83 Rotary Grenade Launcher. However, I had noticed another hurdle in the development experience. Each camo colouring of the weapon was individually made and added to the game. This meant having multiples of the same folder of images across the repository. 

Calling back to the boxes, I suggested an idea, `"Why dont we just apply camo ingame?"`. I was told it couldnt be done, at least not with how the system was currently setup. That was the challenge I took upon myself. Over the span of a week, I disected the code relating to sprite rendering as well as learning from scratch how to use C# and work in an engine built around `ECS (Entity Component System)` architecture.

After a few long nights I had a working prototype. By combining two sprites, one pre-coloured and one in greyscale, I could have the game apply a colour to the greyscale sprite and layer it over to make up the weapon sprite in any colour desired. I then combined this with some easy to change component variables so that the existing CamouflageSystem could apply a colour hex value instead of a folder of entirely separate sprites. The system wasnt perfect, the code needs some cleanup from a standards point of view. However, it served a good function and acts well as a proof of concept for further optimisations that can be made in the game.

<img height="128" src="/images/projects/rmc14/m13.png" width="128" style="image-rendering: pixelated;" alt=""/>

This new system was dubbed **CamoTech:tm:** and it sped up the implementation of new weapons a great deal. In order to help maintain its longer term usage and onboard the other contributors to using it, I did write up a [guide](https://hackmd.io/@Ramiris/BkTi3lexge ) as well as guide them on some earlier implementations. The ultimate payoff happened when PRs were being made without any effort needed from myself to integrate CamoTech:tm:.
