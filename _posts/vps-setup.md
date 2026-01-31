---
title: "How I Setup a VPS as a Reverse Proxy that Bypasses CGNAT"
excerpt: "Through a combination of CloudFlare, Caddy, Wireguard, and a VPS I have a safe and secure way to access my machines."
coverImage: "/assets/blog/ankiyear/cover.webp"
date: "2026-01-29"
ogImage:
  url: "/assets/blog/ankiyear/cover.webp"
---

# The Problem
After getting into home labbing I realised I had forgotten something important.

> How do I access my apps and services from outside my home network?

I figured the easiest way would be to open up some ports and go from there, ***except*** I forgot my connection has CGNAT enabled.

For those who don't know CGNAT or Carrier Grade Network Address Translation is a method used by internet service providers (ISPs) to allow multiple customers to share a single IP address. This is great for helping manage the shortage of IPv4 addresses but not so great when I need an address to be able to find my server on. While I could just opt-out of this with my ISP it was already past their opening hours for their support center so I figured I'd look into workarounds.

The next obvious choice to me was a VPN. I had recently heard about NetBird and wanted to give it a try so after setting up their free cloud plan I played around with it for a few days but just found needing to be connected to a vpn all the time a little annoying. Additionally I was still getting some practice with networking between docker containers 