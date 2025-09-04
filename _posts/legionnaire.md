---
title: "Legionnaire - ML Powered SIEM"
excerpt: "A Security Information and Event Management platform that provides automated threat detection. Built for UQCS Hackathon 2025."
coverImage: "/assets/blog/legionnaire/cover.webp"
date: "2025-09-03"
ogImage:
  url: "/assets/blog/pandorasbox/cover.webp"
---

# What is Legionnaire?

Legionnaire is an AI-powered SIEM designed for businesses to streamline their monitoring of company systems. If you are not familiar with SIEMs it stands for Security Information and Event Management. It allows for systems to report back to a host on events that seem suspicious.

# Why a SIEM?

Earlier this year I attended a talk at CrikeyCon called "SIEM-less security; Panacea or placebo", after listening for a little while and hearing lots about terms like SIEM and EDR I tried to ask my friend Sam if he had any idea what they meant but we were both lost. After some quick research I had a better idea of what was going on and started to wonder if it would be possible to make a SIEM for the upcoming UQCS hackathon. I knew at the hackathon I'd likely be in a team of 6 or more so the idea of a larger project like a SIEM worked out great. It's an important cybersecurity tool, requires frontend and backend development, and involves working with large amounts of data. Add in a bit of machine learning to classify network requests and suddenly everyone on the team would be able to walk away with a relevant project for their resume.

# The Plan

At the last UQCS hackathon my team struggled with ensuring everyone had work to do and weren't just sitting around waiting for someone else to finish what they are working on.This year we made sure the work was divided evenly and allowed everyone to just put their heads down and get it done.

Sam came up with a great idea to divide the backend into these 4 modules:
Network Module

- Monitors and collecting network flow features to be sent for analysis.
  System Log Analysis Module
- Monitors key system logs and flags suspicious items for review.
  Program Analysis Module
- Hashes all the current running programs and checks if it matches any know malware via the MalwareBazaar API.
  Action Module
- Allows the person who reviews suspicious logs to take action. Includes options for creating and deleting firewall rules, deleting files, and killing processes.

After a little more planning we came up a design that looks like this:
(table of architecture and design)

I would've loved to use Go for this project after the success I had on [Pandora's Box](https://lachlanoc.com/pandorasbox) but to ensure everyone could easily work on the project Python ended up being our choice of programming language.

# 48 Hours to Make and Present

Since the project showcase occurs during the 48 hours for the event you only get from 7:30pm on Friday to 2:00pm on Sunday to actually build the project. The pressure from the deadline was really fun and helped you to continue working away when things got tough. Being in person instead of online for the event really gave the venue a great atmosphere making everything more enjoyable as well.

# Implementation

The actual creation process went surprisingly well. Trying to get things down quickly I wrote some pretty vulnerable code that wouldn't matter for our demo but I did make sure to go back and implement some more secure functions and command sanitisation. Our front end turned out looking pretty nice as well. No one on the team was especially passionate about designing and creating front-end interfaces but with already having some base code and design ideas drawn up, some help from an LLM tidied it up quick.

I didn't run into any real challenges with my code thankfully. Took a while to read and learn how to implement some aspects of my action module in Windows as I had previously just used GUIs to accomplish firewall rules but it was interesting learning some powershell basics.

# Presentation

![showcase](/assets/blog/legionnaire/showcase.jpg)
Getting to share and talk about the project was really fun. Just from the absurdity of our showcase setup pictured above we were able to entice people into coming to hear about what we've done.

In the end I was really happy with what my team had
