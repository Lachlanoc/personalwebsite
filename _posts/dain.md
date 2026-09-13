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

## Why Build a Distributed AI Cluster?

While taking turns pitching our ideas my team member Abdallah suggested the concept of a distributed AI cluster. Of all the ideas
we had this was definitely the one that piqued our interest the most. It was also the most ambitious idea but that made it all the more exciting.

## 
# Friday Night: Getting Started

Because the week leading up to the hackathon had been flat out, I hadn't had any spare time to prepare the machines or install operating systems on the extra nodes beforehand. My entire Friday night was dedicated to getting all four machines up and running with clean installs.

I decided to install Fedora 44 across the fleet. Fedora is what I run on my main rig, so keeping the entire cluster on the identical distro and package base was the easiest way to minimise weird environment mismatches down the track.

The Intel NUC installed without a hitch. The two refurbished office PCs, on the other hand, turned into a massive pain. 

For hours, I couldn't figure out why my Ventoy USB drive refused to boot on either machine. The installer would hang or the drive wouldn't even appear in the boot menu. After banging my head against the desk for what felt like ages, a memory suddenly clicked: Ventoy and certain BIOS implementations can be notoriously picky about USB 3.0 controllers before the kernel drivers load. 

Looking at the back of the chassis, every single port was USB 3.0. Moving to the front panel, there were four ports—and sure enough, upon closer inspection, only two of them were wired to the onboard USB 2.0 bus. The other ports were routed through an auxiliary controller that wasn't initialising in time for boot. The moment I plugged into the front USB 2.0 port, the installer booted immediately.

With the OS finally installed across all the nodes, I stayed up late writing `node.py`—the foundational worker script designed to run on each node in the cluster. The goal for `node.py` was to handle local worker lifecycle: listening for incoming workload assignments from the coordinator, managing local hardware resources, running inference, and streaming back results.

# Saturday: The Networking Rabbit Hole

Saturday morning was spent picking up where I left off on `node.py`, refining the script until we could successfully distribute and execute model tasks across the nodes. But getting code running locally is one thing; getting a cluster of disparate machines communicating seamlessly on a hackathon venue network is a completely different beast.

None of the secondary nodes had Wi-Fi cards; they were purely reliant on wired ethernet. Thankfully, I had brought along a dedicated network switch and a bundle of ethernet cables. 

I hooked all four of my machines into the switch, but that meant I had to manually configure the network topology:
1. My main desktop connected to the venue Wi-Fi for internet access.
2. The desktop then shared/bridged its connection over ethernet to the local switch.
3. Every node had to be manually assigned static IPs on our private subnet so they could reliably discover each other and talk back to the master coordinator.

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
 [Intel NUC] [Node 1] [Node 2] (Fedora 44 Worker Nodes)
```

Getting the routing, NAT, and subnets sorted out was tedious and gave me plenty of headaches, but it was rewarding once the pings started flying across the switch.

## Heterogeneous Hardware & Background Workers

Our goal wasn't just to support identical hardware. We wanted DAIN to be truly heterogeneous, supporting:
- NVIDIA GPUs
- AMD GPUs
- CPU-only nodes
- Linux and macOS machines

Our teammates wanted to hook their MacBooks into the cluster, which meant we had to ensure our node runners could gracefully handle Apple Silicon alongside our x86 Linux machines. Most of Saturday afternoon went into deploying and configuring the worker endpoints across the different environments.

Another practical challenge was automated execution over SSH. The master orchestrator needed to be able to SSH into a node, spin up `node.py` to run a task, and disconnect without the process terminating when the session closed. I had to audit power settings across every single box to ensure sleep, suspend, and hibernation were completely disabled, and write wrapper scripts so the head computer could fire-and-forget workloads without hung sessions.

By the end of Saturday, I had a slight pang of regret that I'd spent so many hours acting as the team's sysadmin, network technician, and hardware troubleshooter rather than writing pure application code. But without that infrastructure in place, none of the distributed magic would have had a platform to run on.

# Sunday: Presentation Prep & The Last-Minute Scramble

Sunday morning kicked off with a classic hackathon surprise: brand new networking gremlins that had somehow materialized overnight. After ironing those out, I turned my attention to helping the team prepare for the final showcase.

Since some of our teammates weren't as deeply familiar with the underlying distributed computing and agentic AI concepts, I spent time going over the architecture with everyone so anyone at our table could comfortably talk to judges and attendees. I also got to work on our whiteboard, drawing out the network topology, node communication flow, and key talking points to make our booth look as professional and clear as possible.

Then came the demo crunch.

## The Showcase Table Curse

When it was time to move our setup from the hacking area over to the showcase tables, we had to unplug everything and transport the entire rig a couple of metres across the room.

The moment we plugged everything back in, **everything broke**.

Moving just a few metres had somehow scrambled our interfaces. With the judges actively walking the floor and heading towards our row, we were in full panic mode. To make matters worse, one of our teammates was running Fedora inside WSL on a Windows laptop as one of our worker nodes. Suddenly, WSL decided it would no longer accept incoming SSH connections—a critical component of how our orchestrator dispatched tasks to nodes.

With only minutes to spare before our turn, we were frantically diagnosing network adapters, restarting services, and repairing the WSL bridge. We managed to get SSH listening and the cluster communicating again just as the judges arrived at our booth.

# The Showcase & Demo

Despite the heart attack ten minutes prior, our demo ran smoothly!

Our final cluster consisted of **6 computers in total**:
- My main workstation (handling orchestration and master logic)
- 3 dedicated hardware nodes (the Intel NUC and two Fedora SFF desktops)
- 2 teammate laptops (including macOS and Windows/WSL)

Having an ultrawide monitor alongside an entire desk packed with glowing towers, an active network switch, and blinking ethernet activity lights looked visually impressive and immediately drew a crowd. 

Getting to explain DAIN and demonstrate real-time distributed inference across such a wild mix of hardware was an absolute blast. People loved seeing cheap office PCs and laptops pulling their weight alongside dedicated desktop hardware to complete complex agentic tasks.

# Final Remarks

UQCS Hackathon 2026 was definitely one of the most exhausting yet entertaining hackathons I've participated in. Hauling 4 desktop towers and a network switch through the venue was a bit ridiculous, and I definitely spent more time fighting USB controllers, static IPs, and SSH tunnels than I originally planned. 

However, seeing all 6 machines working in unison to run distributed inference made the late nights and frantic troubleshooting completely worth it. A massive shoutout to my teammates for their hard work on the models, coordination, and putting up with my mini server-rack taking over the desk!