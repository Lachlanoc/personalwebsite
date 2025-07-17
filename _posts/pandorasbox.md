---
title: "Pandora's Box AI Honeypot"
excerpt: "A fine-tuned LLM powered honeypot, providing near-realtime realistic responses to web requests. Developed for LaunchHacks IV.
          
          5th Place Winner LaunchHacks IV Hackathon 🏆"
coverImage: "/assets/blog/pandorasbox/cover.webp"
date: "2025-07-14"
ogImage:
  url: "/assets/blog/pandorasbox/treasure.jpg"
---

## What is Pandora's Box?
Pandora's Box a LLM powered honeypot. A security measure, who's goal is to study cyberattacks and deflect attackers away from real systems.

This is achieved by training our model to provide context-aware responses to web requests. This makes it less likely for an attacker to realise they're going after a honeypot and provides more insight into their methods and how to react.

We were inspired to build Pandora's Box during LaunchHacks IV (A hackathon hosted on devpost) after finding that existing honeypot solutions relied on external LLM APIs. These often come with ongoing costs, and privacy concerns. To fix this we set out to make a solution that was easy to deploy and could be run locally.

## The Build Process
I primarily worked on the underlying honeypot during the project. One of my other teammates suggested we use Go and while all my experience with Go was reading some of the 'Go by Example' guide to the language I was keen for the challenge.

Having experience working with individual packets to make an intrusion detection system for a university assignment I initially utilised gopacket to try and intercept the packets. After spending the first night working on this I came to the realisation that this was way over complicating it and would require managing the handshake process as well as requiring Windows users to install either WinPcap or Npcap. The solution to this was Go's awesome net/http library to create a basic http server. Working with net/http proved to be quite fun, its well documented and has plenty of online guides centered around it. In the end I had a server I could send requests to and get back responses from our LLM.

For our LLM our teammate Brandon fintuned the existing [distilgpt2](https://huggingface.co/distilbert/distilgpt2) to leverage its small size in creating fast responses. For training, a combination of real data and synthesised data created using a python script was used to conduct 10 training runs during the event. 
In the end we had a model that we were satisfied with its speed and quality of response. Running on an RTX 5070ti it will produce results in an under a second. The final model can be found on [Hugging Face](https://huggingface.co/bangu7/honeypot-http-response).

For monitoring the honeypot and its statistics Sam designed and developed a front end dashboard and corresponding statistics server. These turned out great providing an easy way to view relevant statistics and request history.

![dashboard](/assets/blog/pandorasbox/dashboard.webp)
Additionally a classification for requests was added. Unforunately we ran out of time to train another model to classify these, but optionally a Gemini API key can be added to use this functionality.
![dashboard](/assets/blog/pandorasbox/classification.webp)

## Biggest Challenges
Finding data was a huge hurdle for this project. Our final solution ended up being to collect and create it ourselves but had we been able to find existing data sets I belive we could have extended the capabilities of Pandora's Box and remove the need for a Gemini API key.

Another challenge I personally faced was trying to setup an SSH server so my GPU could be used for the LLM training. I spent way too long unable to workout why I couldn't get SSH working and considering moving my GPU to a Fedora machine which I'd had success in hosting an SSH server on in the past. 
As a last attempt I setup Ubuntu through WSL and realised my ISP had CGNAT enabled and I'd actually just wasted a bunch of time. Well, not completely wasted, as I learnt plenty about how SSH and CGNAT works. I ended up using Tailscale which was exactly what I needed and worked flawlessly.

## Final Remarks
This hackathon was a lot of fun, I gained valuable knowledge and experience in Go and remote access for computers and we even ended up taking 5th place in the end. With a bit over 100 projects submitted I'm very happy with the outcome.

Feel free to checkout the project at its [GitHub](https://github.com/Honeypotters/PandorasBox), [LaunchHacks IV](https://devpost.com/software/pandora-s-box-jlp6vm) submission page, or the final model on [Hugging Face](https://huggingface.co/bangu7/honeypot-http-response).


