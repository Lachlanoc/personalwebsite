---
title: "How to Securely Access your Homelab Remotely Despite Having CGNAT"
excerpt: "Through a combination of CloudFlare, Caddy, Authelia, Wireguard, and a VPS I have a safe and secure way to access my machines."
coverImage: "/assets/blog/vps-reverseproxy/cover.webp"
date: "2026-02-16"
ogImage:
  url: "/assets/blog/vps-reverseproxy/cover.webp"
---

# The Problem
After getting into home labbing I realised I had forgotten something important.

> How do I access my apps and services from outside my home network?

I figured the easiest way would be to open up some ports and go from there, **except** I forgot my connection has CGNAT enabled.

For those unfamiliar CGNAT or Carrier Grade Network Address Translation is a method used by internet service providers (ISPs) to allow multiple customers to share a single IP address. This is great for helping manage the shortage of IPv4 addresses but not so great when I need an address to be able to find my server on. While I could just opt-out of this with my ISP it was already past their opening hours for their support center so I figured I'd look into workarounds.

The next obvious choice to me was a VPN. I had recently heard about NetBird and wanted to give it a try, so after setting up their free cloud plan I played around with it for a few days but just found needing to be connected to a vpn a little annoying as I wanted to be able to give easier access to friends or teammates during hackathons.
While testing NetBird I also found out that the Cloudflare proxy I had been using for my domain has an upload limit of 150MB. This is fine for most things but I was planning to setup a replacement for Google Drive and figured I'd eventually run into issues. 

This is when I had the idea for my current setup:
![network-diagram](/assets/blog/vps-reverseproxy/diagram.webp)

With this I wouldn't need to worry if any of my future ISPs didn't allow you to disable CGNAT and is a great excuse to rent a VPS. 

Cloudflare will handle DNS records and TLS certificates, Caddy is an HTTPS server that is super simple to use as a reverse proxy. Working with Caddy is Authelia which will provide our authentication and authorisation for web applications, and rounding it out is wireguard to route traffic from the VPS back to my home server.

# Setting it up
The following setup will all be done on a VPS running Debian. If you're interested in learning how to set that up checkout my post on it: [How I Setup a New VPS](/posts/vps-setup).

For this tutorial some commands will use vim as that was installed in the VPS setup guide but nano or your favourite text editor can be used in its place.

# Cloudflare/DNS
In this tutorial I'm going to use Cloudflare for my DNS records and to get an API key for TLS certificates that will come up during the Caddy setup. 

1. Access your DNS settings or management page. Most companies have directions to this in their FAQs
2. Add a new A record and with the name of the subdomain you want to use for the service. 
3. Set the IP address to that of your server.
4. If you're using Cloudflare you'll have the option of proxying. It's important to keep in mind there is an upload limit of 150MB when proxying and it's worth doing a bit more research on whether or not you should enable this.
5. Wait, DNS changes can take time, you might have to wait a little for things to propagate.

The next thing we need from Cloudflare is an API key for TLS certificates. 

For this visit:
https://dash.cloudflare.com/profile/api-tokens

Then create a new API Token with the ability to edit Zone DNS. In the specific zone section select your domain. 
In 'Client Address Filtering' make the operator 'Is in' and enter the IP of your VPS so it can't be used elsewhere.
Then you can continue through until you get your API Token. Save this somewhere safe as we will need it later for the Caddy setup.

# Authelia
While I like Authelia, the setup is rather long and a little complex. I highy recommend reading their [Get Started](https://www.authelia.com/integration/prologue/get-started/) guide, however if you are really adverse to reading it all you can follow these commands to get a basic setup going.

*[From the Authelia docs on installing on bare-metal](https://www.authelia.com/integration/deployment/bare-metal/)*

Add the APT Repository
```bash
sudo apt install ca-certificates curl gnupg
sudo curl -fsSL https://www.authelia.com/keys/authelia-security.gpg -o /usr/share/keyrings/authelia-security.gpg
```
Verify the downloaded key
```bash
gpg --no-default-keyring --keyring /usr/share/keyrings/authelia-security.gpg --list-keys --with-subkey-fingerprint
```
Example Output
```
/usr/share/keyrings/authelia-security.gpg
-----------------------------------------
pub   rsa4096 2025-06-27 [SC]
      192085915BD608A458AC58DCE461FA1531286EEA
uid           [ unknown] Authelia Security <security@authelia.com>
uid           [ unknown] Authelia Security <team@authelia.com>
sub   rsa2048 2025-06-27 [E] [expires: 2033-06-25]
      7DBA42FED0069D5828A44079975E8FFC6876AFBB
sub   rsa2048 2025-06-27 [SA] [expires: 2033-06-25]
      C387CC1B5FFC25E55F75F3E6A228F3BD04CC9652
```
Add the repo to sources.list.d
```bash
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/authelia-security.gpg] https://apt.authelia.com stable main" | \
  sudo tee /etc/apt/sources.list.d/authelia.list > /dev/null
```
Update cache and install
```bash
sudo apt update && sudo apt install authelia
```

Now we need to setup a service so authelia runs on system startup.
```bash
sudo vim /etc/systemd/system/authelia.service
```

Add the following config.
```
[Unit]
Description=Authelia authentication and authorization server
Documentation=https://www.authelia.com
After=multi-user.target

[Service]
User=authelia
Group=authelia
UMask=027
Environment=AUTHELIA_SERVER_DISABLE_HEALTHCHECK=true
ExecStart=/usr/bin/authelia --config /etc/authelia/configuration.yml
SyslogIdentifier=authelia
CapabilityBoundingSet=
NoNewPrivileges=yes
RestrictNamespaces=yes
ProtectHome=true
PrivateDevices=yes
PrivateUsers=yes
ProtectControlGroups=yes
ProtectKernelModules=yes
ProtectKernelTunables=yes
SystemCallArchitectures=native
SystemCallFilter=@system-service
SystemCallErrorNumber=EPERM

[Install]
WantedBy=multi-user.target
```

And enable the newly added service.
```bash
sudo systemctl daemon-reload
sudo systemctl enable --now authelia.service
```

The Authelia config requires quite a few secrets. To help with this Authelia has this command.
```bash
authelia crypto rand --length 64 --charset alphanumeric
```
We can save these and use the values for our secrets in the config. 

For our basic config we will add the following.
```yaml
# /etc/authelia/configuration.yml
identity_validation:
  reset_password:
    jwt_secret: 'Replace_this'

authentication_backend:
  file:
    path: /opt/authelia/users_database.yml'

access_control:
  default_policy: 'one_factor'
  rules:
    - domain: [*.example.com]
      policy: 'one_factor'

session:
  secret: 'Replace_this'
  cookie:
    - domain: 'example.com'
      authelia_url: 'https://authelia.example.com'

storage: 
  encryption_key: 'Replace_this'
  local:
    path: '/opt/authelia/db.sqlite3'

notifier:
  filesystem:
    filename: '/opt/authelia/notification.txt'

identity_providers:
  oidc:
    hmac_secret: 'Replace_this'
    jwks:
    - key_id: 'example'
      key: |
          -----BEGIN PRIVATE KEY-----
          -----END PRIVATE KEY-----
```
The last thing that you need to add to the config is your private key. Authelia also has a command to help with this too.
```bash
authelia crypto pair rsa generate
```
This generates a public and private key. Copy just the private key in between the begin and end private key section in the config.

Final step is making the files we reference in the config.
```bash
sudo touch /opt/authelia/db.sqlite3
sudo touch /opt/authelia/notification.txt
sudo touch /opt/authelia/users_database.yml
```

# Wireguard

The next step is bridging from the VPS back to your homelab which I will use wireguard for. I have a bit of past experience writing and diagnosing wireguard configs from my work on (cyberbattl.es)[/posts/cyberbattles] which influenced my decision to use it.

First step is install wireguard on the VPS.
```bash
sudo apt install wireguard
```

Then for the keys I'm using this really handy set of bash commands from Mochman's (Bypassing a CGNAT with Wireguard)[github.com/mochman/Bypass_CGNAT] repo.
```bash
umask 077 && printf "[Interface]\nPrivateKey = " | sudo tee /etc/wireguard/wg0.conf > /dev/null
sudo wg genkey | sudo tee -a /etc/wireguard/wg0.conf | wg pubkey | sudo tee /etc/wireguard/publickey
```
This creates your wireguard config file at `/etc/wireguard/wg0.conf`, generates a private key and appends it into the file, then generates a public key both printing it out and saving it to `/etc/wireguard/publickey` incase you forget it.

Fill in most of the remaining config.
```
# /etc/wireguard/wg0.conf
[Interface]
PrivateKey = <Should_be_filled_out>
ListenPort = 55107
Address = 10.0.0.1/24

[Peer]
PublicKey = 
AllowedIPs = 10.0.0.2/32
```

And allow our ListenPort throught the firewall.
```bash
sudo ufw allow 55107/udp
```

Back to the machine you want to access.

Install wireguard and run generate the same keys.
```bash
sudo apt install wireguard
umask 077 && printf "[Interface]\nPrivateKey = " | sudo tee /etc/wireguard/wg0.conf > /dev/null
sudo wg genkey | sudo tee -a /etc/wireguard/wg0.conf | wg pubkey | sudo tee /etc/wireguard/publickey
```

Now the public key printed out here can go in the PublicKey section on the VPS.
```
[Peer]
PublicKey = <NEW PUBLIC KEY HERE>
```

Then finish off the rest of the config.
```
[Interface]
PrivateKey = <Should_be_filled_out>
Address = 10.0.0.2/24

[Peer]
PublicKey = <PUBLIC_KEY_FROM_VPS_WIREGUARD_SEUTP>
AllowedIPs = 0.0.0.0/0
EndPoint = <VPS_IP>:55107
PersistentKeepalive = 25
```

On both machines then run.
```bash
sudo systemctl start wg-quick@wg0
```

Test the connection by trying to ping the other machine.
```bash
ping 10.0.0.2
# or
ping 10.0.0.1
```

If that works enable run on startup.
```bash
sudo systemctl enable wg-quick@wg0
```

# Caddy
Now its time to tie it all together.

Setting up Caddy is super beginner friendly. For the most basic of reverse proxy jobs the configuration looks like:
```
example.com {
    reverse_proxy 1.2.3.4:80
}
```
That's it, really that simple.

To get started with a basic install the [Caddy documentation](https://caddyserver.com/docs/install#debian-ubuntu-raspbian) has you covered. However in my case I want the ability to manage DNS records with my Cloudflare account.

For this I'm instead going to install a custom version from from the [Caddy server download page](https://caddyserver.com/download).
Simply select the apropriate platform and the caddy-dns/cloudflare package.

There are other ways to install it such as using go and xcaddy or setting it up through docker but with my VPS' limited specs I'm trying to keep everything slim.

After installing its time to start updating our Caddyfile.

In this file we are going to add one example service and our reference to authelia.
```
# /etc/caddy/Caddyfile
# Replace example.com with your domain
authelia.example.com {
    reverse_proxy localhost:9091
}

service.example.com {
    tls {
        dns cloudflare {env.CLOUDFLARE_API_TOKEN}
    }
    reverse_proxy 10.0.0.2:3000
}
```
 
Now we need the Cloudflare API token generated earlier.
```bash
sudo systemctl edit caddy
```

Being careful you don't add it under the comment saying edits below will be discarded.
```
[Service]
Envrionment="CLOUDFLARE_API_TOKEN=<Add_your_token_here>"
```

Restart everything so it works.
```bash
sudo systemctl restart caddy
```

And allow http and https through the firewall.
```bash
sudo ufw allow 80
sudo ufw allow 443
```

# Troubleshooting
Now, hopefully everything is working and you can use the record you added to Cloudflare to access services running on your home server.

If it isn't however, here are some things to try and diagnose the issue.

1. Restart both machines, always worth a try.
2. https://letsdebug.net/ is a great tool for diagnosing most issues that might arise and tests that requests successfully make it to Caddy.
3. If letsdebug is happy try pinging between the two machines. The IPs designated are 10.0.0.1 on the remote server and 10.0.0.2 on your home server. Try pinging the other machine and see if thats where the issue lies.
4. If letsdebug has no errors, and wireguard is communicating alright it might just be an issue with the service you're trying to access whether it be a mistyped port or IP. 

Generally a helpful command to know is:
```bash
curl -vL <ip>
```
This gives you a verbose output and follows redirects which can really come in handy in tracking down any issues along the supply chain.

Another final note is reading the docs for your services. Some require extra configuration to be added to your Caddyfile to ensure smooth operation.

# Final Remarks
Hopefully this can help someone out, I spent a very long time configuring it all and writing out a tutorial gave me a chance to really iron out any leftover or unused config from previous attempts at setting it up. This project has helped me to learn about so much so I hope it can for you too.
