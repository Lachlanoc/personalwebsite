---
title: "Legionnaire - ML Powered SIEM"
excerpt: "A Security Information and Event Management platform that provides automated threat detection. Built for UQCS Hackathon 2025."
coverImage: "/assets/blog/legionnaire/cover.webp"
date: "2025-09-03"
ogImage:
  url: "/assets/blog/legionnaire/icon.webp"
---

# What is Legionnaire?

Legionnaire is an AI-powered SIEM designed for businesses to streamline their monitoring of company computers. If you are not familiar with SIEMs it stands for Security Information and Event Management. It allows for systems to report back to a host on events that seem suspicious.

## Why make a SIEM?

Earlier this year I attended a talk at CrikeyCon called "SIEM-less security; Panacea or placebo", after listening for a little while and hearing lots about terms like SIEM and EDR I tried to ask my friend Sam if he had any idea what they meant but we were both lost. After some quick research I had a better idea of what was going on and started to wonder if it would be possible to make a SIEM for the upcoming UQCS hackathon. I knew at the hackathon I'd likely be in a team of 6 or more so the idea of a larger project like a SIEM worked out great. It's an important cybersecurity tool, requires frontend and backend development, and involves working with large amounts of data. Add in a bit of machine learning to classify network requests and suddenly everyone on the team would be able to walk away with a relevant project for their resume.

![crikeycon](/assets/blog/legionnaire/crikeycon.webp)

# The Plan

At the last UQCS hackathon my team struggled with ensuring everyone had work to do and weren't just sitting around waiting for someone else to finish what they are working on.This year we made sure the work was divided evenly and allowed everyone to just put their heads down and get it done.

Sam came up with a great idea to divide the client program into these 4 modules:

Network Module
- Monitors and collecting network flow features to be sent for analysis.

System Log Analysis Module
- Monitors key system logs and flags suspicious items for review.

Program Analysis Module
- Hashes all the current running programs and checks if it matches any know malware via the MalwareBazaar API.

Action Module
- Allows the person who reviews suspicious logs to take action. Includes options for creating and deleting firewall rules, deleting files, and killing processes.

This modules would report to and receive instructions from the control server which would:
- Run the network flow analysis and flag suspicious entries.
- Proxy actions from the Web Interface to the appropriate Client's Action Module.
- Collate logs and store the client identifiers for entries.

Then the Web Interface connects to the control server through a REST-ful API, its main features include:
- Context specific actions for each Client.
- Overview of flagged logs.
- Monitoring of invidual client logs.
- Relevant stats and graphs.

After a little more planning we came up a design that looks like this:
![program_architecture](/assets/blog/legionnaire/architecture.webp)

## Tech Stack

For the frontend we went with Vite, React, and TailwindCSS making it easy to develop and quick to jump in and make design tweaks.

For the backend I would've loved to use Go for this project after the success Sam and I had on [Pandora's Box](https://lachlanoc.com/pandorasbox) but
to ensure everyone could easily work on the project Python ended up being our choice of programming language. This allowed us to use some great libraries
like Flask for creating our APIs.

# Competition Start

## 48 Hours to Make and Present

Since the project showcase occurs during the 48 hours for the event you only get from 7:30pm on Friday to 2:00pm on Sunday to actually build the project. The pressure from the deadline was really fun and helped you to continue working away when things got tough. Being in person instead of online for the event really gave the venue a great atmosphere making everything more enjoyable as well.

## Implementation

The actual creation process went surprisingly well. Trying to get things down quickly I wrote some pretty vulnerable code that wouldn't matter for our demo but I did make sure to go back and implement some more secure functions and command sanitisation. Our front end turned out looking pretty nice as well. No one on the team was especially passionate about designing and creating front-end interfaces but with already having some base code and design ideas drawn up, some help from an LLM tidied it up quick.

I didn't run into any real challenges with my code thankfully. Took a while to read and learn how to implement some aspects of my action module in Windows as I had previously just used GUIs to accomplish firewall rules but it was interesting learning some powershell basics.

As a whole the biggest challenge was getting enough relevant data for the model training. After training on [CIC-IDS2017](https://www.unb.ca/cic/datasets/ids-2017.html)
and being unable to get reliable results with the way we collected data we swapped over to having Sam manually collect benign and malicious data using a VM.
With the new data the model turned out really reliable for quick classification of traffic.

## Presentation

![showcase](/assets/blog/legionnaire/showcase.webp)

Getting to share and talk about the project was really fun. Just from the absurdity of our showcase setup with crazy monitors we were able to entice people into coming to hear about what we've done. 
For the showcase I had Brandon who worked the projects ML write some talking points for me but when people started wanting to get into the maths of it all
I was pretty lost which made for an interesting challenge.

# Final Remarks

While we weren't able to take out any prizes I was really happy with what my team was able to create.
If you want to check out the project further you can find the source code on [GitHub](https://github.com/LegionnaireDevs/legionnaire).

![teamphoto](/assets/blog/legionnaire/team.webp)
