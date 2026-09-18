---
title: "Bringing my Whole Office to a Hackathon"
excerpt: "5 computers, a network switch, an ultrawide monitor to a 48-hour hackathon to build DAIN: a Distributed Agentic Inference Network."
coverImage: "/assets/blog/dain/cover.webp"
date: "2026-09-11"
ogImage:
  url: "/assets/blog/dain/cover.webp"
---

# What is DAIN?

DAIN stands for **Distributed Agentic Inference Network**. The core idea behind the project is pooling computing resources, ranging from high-end desktop GPUs to low-power office PCs and laptops into a single unified distributed AI cluster. DAIN allows multiple machines to coordinate and distribute model inference and agentic workloads across the local network.

### Why Build a Distributed AI Cluster?

While taking turns pitching our ideas my team member Abdallah suggested the concept of a distributed AI cluster. Of all the ideas
we had this was definitely the one that piqued our interest the most. It was also the most ambitious idea but that made it all the more exciting.

# Friday Night: Getting Started

Because the week leading up to the hackathon had been flat out, I didn't have any spare time to prepare the machines or even install an operating system on the 3 office computers. Most of my Friday night ended up dedicated to getting all four machines desktop computers up and running with the ability to talk to each other.

I decided to install Fedora 43 on the office computers. Fedora 44 is what was already running on my personal desktop and laptop, so keeping the entire cluster on a very similar set-up was ideal as it is what I am most familiar with (I also hadn't updated the ISO on my usb of distros to 44 yet...).

The little Intel NUC installed without a hitch. The two office PCs on the other hand, turned into a huge pain. 

For hours, I couldn't figure out why my Ventoy USB drive refused to even show up in the boot menu, trying every configuration of secure boot and BIOS setting I could find. The rear IO of these PCs was also all USB 3.0 so I figured I might not have any USB 2.0 port options. Thankfully after a while I finally realised that on the front IO below the 2 more USB 3.0 ports was finally a 2.0 port. These two ports were the only ones wired directly to the motherboards bus all the other ports likely went to a controller that wasn't initalising in time for my USB to be visible in the boot menu. Never thought I'd be happy to find a slower port but thankfully I was then able to install the OS on the remaining computers.

With the OS finally installed across all the nodes, I finished the night by creating the basic `node.py` program that would run on all the machines in the cluster. This would later be fleshed out further but for the moment I just got something simple going and made it to bed at a reasonable enough time.

# Saturday: The Networking Rabbit Hole

Saturday morning was spent picking up where I left off on `node.py`, refining the script until we could successfully distribute and execute model tasks across the nodes. Getting it going locally was easy enough but facilitating communication across the machines wasn't so smooth.

None of the office computers had Wi-Fi cards and would require a cable. Thankfully I had come prepared with a network switch and cables to try and minimise the delays created by a slow connection.

I hooked all four of my machines into the switch, and started trying to manually configure all the network settings.
1. My main desktop connected to the venue Wi-Fi for internet access.
2. The desktop then shared its connection over ethernet to the switch.
3. Every node gets a static IP related to its hostname so I can easily ssh in even if I don't have my own ssh config.

```
       [ Venue Wi-Fi ]
              │
      ┌───────┴───────┐
      │ Main Desktop  │ (Gateway / Master)
      └───────┬───────┘
              │ (Ethernet)
      ┌───────┴───────┐
      │ 8-Port Switch │
      └───┬───┬───┬───┘
          │   │   │
     ┌────┘   │   └────┐
     ▼        ▼        ▼
 [Intel NUC] [Node 1] [Node 2] 
```

Getting the routing, NAT, and subnets sorted out was tedious and gave me plenty of headaches, but it was rewarding once the pings started working.

## Getting crossplatform going.

The goal wasn't to just get some office computers on linux with no GPU going though, in total we wanted to support:
- Nvidia and AMD GPUs
- CPU-only nodes
- Linux, MacOS, and Linux

While all my computers were on Linux my teammates had Macbooks and another teammate brought along their desktop computer running Windows. Meaning we could actually test most of the variations.
One of my teammates provided me with a base script to help create the different rpc servers for the different platforms but I then spent most of the day refining the creation and distribution scripts
to ensure all the computers would automatically get the correct rpc server for their architecture.

Another issue I struggled with for a bit was automated execution over SSH. The orchestrator needed to be able to SSH into a node, run `node.py` and disconnect leaving the process running.
At first this wasn't working and I kept thinking my code was the problem but I didn't think of how closing the connection might automatically stop the process.
Once I realised this it was a prety easy fix and reminded me to go update all the machines power settings to ensure there wouldn't be any interruptions.

# Sunday: Presentation Prep & The Last-Minute Scramble

Sunday morning kicked off with an all too common problem now, more network troubles, after spending most of my morning going crazy looking for what felt like imaginary issues I could move on to something more interesting.

Myself and a couple other teammates had been busy and weren't as familiar with some of the finer details from some parts of the project I took the time to bring myself and them up to speed to ensure everyone at the table would be able to comfortably talk to the judges and attendees. I also got to work on drawing up some stuff on the whiteboard we would display behind our table. We knew our table would be way in the corner of the room so having a big name visible from afar was important. I also added a simple blurb about the project and a little drawing just to keep it interesting.

Then time was up and we had to set up for our demo.

## The Showcase Table Curse

Our demo spot was only a few metres from where we had been working but still required that we unplug and move everything.

The moment we plugged everything back in however, **it all broke**.

Moving only a few metres had somehow made the Windows machine decide there was no way it would allow any form of SSH anymore. Additionally running any prompts on the cluster started producing errors. This was rather scary especially when we noticed the judges started coming around and we would be one of the earlier teams in their loop. I did everything I could think of for my parts and then handed over the computer to a teammate to try and diagnose some of the stuff he made.

# The Showcase & Demo

Very thankfully just in time we were able to get it all up and running again and I had an awesome time getting to talk to the judges along with my team.

Our final cluster consisted of **6 computers in total**:
- My main workstation (Handling orchestration and master logic)
- 4 dedicated hardware nodes (Office computers I brought in and my teammates desktop)
- 1 Macbook Pro (Running the model but also used for displaying info about the project)

Having an ultrawide monitor alongside an entire desk packed with glowing towers, an active network switch, and blinking ethernet activity lights looked visually very impressive and helps with getting people interested from afar. 

# Final Remarks

UQCS Hackathon 2026 was definitely one of the most exhausting yet entertaining hackathons I've done. Hauling 4 desktop computers, a giant monitor and a network switch through the venue was a bit funny, and I definitely spent more time fighting USB controllers, static IPs, and SSH tunnels than I originally planned. 

However, seeing all 6 machines working in unison to run distributed inference made the late nights and frantic troubleshooting completely worth it. A massive shoutout to my teammates for their hard work and support on the project.