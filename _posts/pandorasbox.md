---
title: "Pandora's Box AI Honeypot"
excerpt: "A fine-tuned LLM powered honey-pot, providing near-realtime realistic responses to web requests. Developed for LaunchHacks IV."
coverImage: "/assets/blog/pandorasbox/cover.webp"
date: "2025-07-14"
ogImage:
  url: "/assets/blog/pandorasbox/treasure.jpg"
---

## What is Pandora's Box?
Pandora's Box a LLM powered honey-pot. A security measure, who's goal is to study cyberattacks and deflect attackers away from real systems.

This is achieved by training our model to provide context-aware responses to web requests. This makes it less likely for an attacker to realise they're going after a honeypot and provides more insight into their methods and how to react.

We were inspired to build Pandora's Box during LaunchHacks IV (A hackathon hosted on devpost) after finding that existing honeypot solutions relied on external LLM APIs. These often come with ongoing costs, and privacy concerns. To fix this we set out to make a solution that was easy to deploy and could be run locally.

## The Build Process
I primarily worked on the underlying honey-pot during the project. One of my other teammates suggested we use Go and while all my experience with Go was reading some of the 'Go by Example' guide to the language I was keen for the challenge.

Having experience working with individual packets to make an intrusion detection system for a university assignment I initially utilised gopacket to try and intercept the packets. After spending the first night working on this I came to the realisation that this was way over complicating it and would require managing the handshake process as well as requiring Windows users to install either WinPcap or Npcap. The solution to this was Go's awesome net/http library to create a basic http server. Working with net/http proved to be quite fun, its well documented and has plenty of online guides centered around it. In the end I had a server I could send requests to and get back responses from our LLM.

For our LLM we trained the existing [distilgpt2](https://huggingface.co/distilbert/distilgpt2) to leverage its small size in creating fast responses. For training, a combination of real data and synthesised data created using a python script was used to conduct 10 training runs during the event. 