---
title: "How I setup a new VPS"
excerpt: "Ensuring things are secure and ready for other applications on a VPS running Debian."
coverImage: "/assets/blog/vps-setup/cover.webp"
date: "2026-02-14"
ogImage:
  url: "/assets/blog/vps-setup/cover.webp"
---

For my reverse proxy setup (that I talk more about in my [guide](/posts/vps-reverseproxy)) I needed a secure VPS ready for everything to be installed on. 

Where you get your VPS from doesn't matter too much, in my case I just found a company with servers really close by for minimal latency. As for specs I went for the lowest and cheapest possible at 1VPCU, 1024MB of memory, and 20GB of storage, with a bare Debian install.

As I'm using Debian this guide will be tailored for it but is easily applicable to everything

# Setup
Before setting anything else up the first step is to ensure the VPS is secure.
Starting with a quick update.
```bash
apt update && apt upgrade -y
```
Then some handy tools.
```bash
apt install -y vim curl wget ufw unattended-upgrades
```
Now setup a non root user with a good password. I'll just use the name tutorial as the username for steps that require it.
```bash
adduser tutorial
usermod -aG sudo tutorial
```

# SSH
From here we are ready for setting up ssh. Firstly on your local machine **not the VPS** generate a key with.
```bash 
ssh-keygen
# And copy to the server, replace <SERVER_IP> with your actual server IP.
ssh-copy-id tutorial@<SERVER_IP>
```
By default ssh-keygen uses [Ed25519](https://en.wikipedia.org/wiki/EdDSA#Ed25519) which will work fine for this usecase.

Back on the VPS it's time to setup our ssh config.
```bash
# /etc/ssh/sshd_config
Port 2222
Protocol 2
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
ChallengeResponseAuthentication no
UsePAM yes
AllowUsers tutorial
MaxAuthTries 3
LoginGraceTime 30
```

With this you're all set to ssh onto the machine.
```bash
# On your local machine
ssh tutorial@<SERVER_IP>
```
Or to make things easier you can add a host in your ssh config.
```bash
# ~/.ssh/config
Host vps
  Hostname <SERVER_IP>
  User tutorial
  Port 2222
  IdentityFile /home/<user>/.ssh/id_ed25519
```

# Firewall
Moving onto the ufw firewall installed earlier. We are going to deny all incoming requests by default and just allow the ones we really need.
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 2222/tcp # So we can still ssh
```
Once these have all successfully run we can enable the firewall.
```bash
sudo ufw enable
```
# Automatic Security Updates
Next is enabling automatic security updates.
```bash
sudo dpkg-reconfigure unattended-upgrades
```
And ensure security updates are enabled.
```
# sudo vim /etc/apt/apt.conf.d/50unattended-upgrades
...
Unattended-Upgrade::Origins-Pattern{
  // I commented out the following line as I just want automatic security updates.
  //"origin=Debian,codename=${distro_codename},label=Debian";
  "origin=Debian,codename=${distro_codename},label=Debian-Security";
  "origin=Debian,codename=${distro_codename}-security,label=Debian-Security";
}
...
```

# Timezone
Rounding out the initial VPS setup we will set the time so logs make a bit more sense.
```bash
sudo timedatectl set-timezone Etc/GMT+10
sudo systemctl enable --now systemd-timesyncd
```

If you're having trouble getting it to accept your timezone run this to view all the options.
```bash
timedatectl list-timezones
```

# All Done
Now your vps is ready for whatever you plan on using it for!

In my case I need it for a reverse proxy and will continue with the setup in the [Caddy + Authelia setup guide](/posts/vps-reverseproxy).
