---
title: "How I Setup a UPS for My Proxmox Server"
excerpt: "Ditching cloud software and USB passthrough for a host-level apcupsd setup that gracefully shuts down my VMs."
coverImage: "/assets/blog/upsbackup/cover.webp"
date: "2026-04-02"
ogImage:
  url: "/assets/blog/upsbackup/cover.webp"
---

# The Problem
After getting my home lab running smoothly, I realised I was missing an important piece of my setup; a UPS. I picked up a second hand APC Smart-UPS C 1500 and hooked it up to my server using a USB cable. 

Initially, I followed the instructions on the back and tried to setup the cloud management only but as its for businesses I was completely priced out of anything useful. 

Searching for alternatives that didn't rely on the cloud I found the old PowerChute software by APC, this had an RPM package so I figured it would be great to run on my Fedora Server VM.

I quickly started running into issues with this however. As I was trying to learn how to change a USB port to be considered a serial port I realised if the software was running inside a VM, it would be pretty hard to get it to gracefully shutdown all my VMs.

This is when I decided to scrap running PowerChute on a VM and manage everything on the Proxmox host using `apcupsd`. Here is how I set it up so the host safely powers down all my VMs before shutting itself off.

# Setup

Firstly, install the APC daemon.
```bash
apt install apcupsd
```

Next, it's time to configure `apcupsd` to listen to the USB connection.
```bash
# /etc/apcupsd/apcupsd.conf

UPSNAME Smart1500
UPSCABLE usb
UPSTYPE usb
DEVICE 

# Ensure these are set so VMs can optionally listen to the host
NETSERVER on
NISIP 0.0.0.0
```
*(Note: Leaving the `DEVICE` line blank tells Linux to auto-detect the USB HID).*

To activate the service, we need to tell the system it's configured.
```bash
echo "ISCONFIGURED=yes" > /etc/default/apcupsd
systemctl restart apcupsd
```

You can test if it's working by running `apcaccess`. If you see `STATUS: ONLINE`, you're good to go. If you see `COMMLOST`, something has gone wrong and you might need to re-plugin the USB cable or switch the port it's plugged into.

# Graceful VM Shutdowns (QEMU Guest Agent)
Proxmox is smart. When `apcupsd` triggers a shutdown on the host, Proxmox will automatically tell all running VMs to shut down first. However, for this to gracefully shutdown all the VMs instead of force powering them off, your VMs need the QEMU Guest Agent acting as a translator. LXC containers don't need to worry about this step.

In the GUI under a VMs options you can check if the QEMU Guest Agent is already enabled.
If not on a Debian or Ubuntu VM you can log into the VM and run:
```bash
sudo apt install qemu-guest-agent -y
sudo systemctl enable --now qemu-guest-agent
```

After installing it inside the VM, go to the Proxmox GUI, click your VM and go to options, then check **Enabled** for QEMU Guest Agent. You must fully **Shutdown** and **Start** the VM from Proxmox for the virtual serial port to initialise.

# Configuring Shutdown Policies
We need to tell the server at what point should it start shutting down everything.

Back on the Proxmox host, edit the config again. Look for these three variables.

```bash
# /etc/apcupsd/apcupsd.conf
BATTERYLEVEL 40
MINUTES 10
TIMEOUT 0
```
Whichever of these values is reached first initiate things to start shutting down. Battery level refers to the remaining battery percentage. Minutes is an estimate of how many minutes of power are left, and timeout is a fixed amount of time. Since I have a smart UPS I'm going to leave the timeout at 0 to disable it and instead set the battery level to 40 and minutes to 10. This way there's plenty of leeway if my battery behaves weirdly due to it's age or systems take a long time to shutdown.

Restart the service to apply the logic:
```bash
sudo systemctl restart apcupsd
```

# Automatic Power On
Something important to remember is enabling your server to automatically turn back on. This isn't a UPS setting but rather one on your motherboard.

1. Reboot your machine and enter the BIOS.
2. Find **Power Management** or **ACPI Configuration**.
3. Change **Restore on AC Power Loss** (or similar) to **Always On**.

Once the server boots, Proxmox can automatically start your VMs if you go into their options and enable 'Start at boot'.

# An Unfortunate Outcome
After doing all this I immediately started getting emails about urgently needing to replace the battery in my UPS. Just to see if the battery still works at all I tried pulling the plug and immediately everything died, so after all this setup it doesn't actually do anything for me in the case of a power outage. 

New official batteries cost a lot so I might have to look into a bit more of a DIY setup but at least I know how to set it up once I have a working UPS. Hopefully if you've been following this it isn't how you find out your battery needs replacing too.
