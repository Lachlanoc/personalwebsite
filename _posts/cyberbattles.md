---
title: "CyberBattl.es - An Attack-Defense Style CTF Platform"
excerpt: "Winner of the 2025 Best Cybersecurity and Data Privacy Project at The University of Queensland's Illuminate showcase."
coverImage: "/assets/blog/cyberbattles/cover.webp"
date: "2025-12-01"
ogImage:
  url: "/assets/blog/cyberbattles/cover.webp"
---

# What is CyberBattl.es and what is a CTF?

CyberBattl.es is an interactive attack-defence Capture The Flag (CTF) platform facilitating learning through hands-on experience.
If you're not familiar with CTFs, they're pretty much competitions where participants attempt to find strings of text called flags in purposefully vulnerable applications.

Normally CTF's are held in a jeopardy-style format and do not involve having to defend against attacks. On the other hand CyberBattl.es is an attack-defence style CTF where teams compete directly against each other in real-time. This means teams each get a set of identical virtual machines running deliberately vulnerable services such as websites, or email clients. This extra dynamic requires you to manage both attacking other teams for points and defending against them to prevent points being deducted. This provides a more realistic and challenging experience.
  
Targeted at educators, students and cyber-enthusiasts alike, CyberBattl.es provides a unique CTF experience for all skill levels.
## Why Build an Attack-Defence Platform?

This semester one of my courses was a studio-based capstone design project where you were provided 34 project briefs and had to apply to complete one of them. The brief that caught my eye the most was for an attack-defence CTF platform.

I had already heard plenty of really cool stories about international level attack-defence CTFs at [UQ CyberSquad](https://cybersquad.uqcloud.net/) events and wanted to give one a try. However participation involves gathering a team and joining an officially held competition. Before joining something official I wanted to get some practice in a low pressure environment just to play around and get used to things. After some research and discovering there's no easy solutions available online, I knew this project was the one I had to do.

With this project brief and its requirements in mind I got together with some other likeminded students who were interested in the project and we were successfully selected to try and create a new attack-defence CTF platform.
# Planning Phase
For most of us, this would be the largest project we've ever worked on in a team, so we thought we needed to put more into the planning, both before and during the semester. To assist with the planning our tutors suggested we use Jira, a piece of software specialising in issue tracking and agile project management.

To show initiative within the team and to try and encourage others to get started on things as soon as possible, I went and learnt how Jira works, and sifted through tutorials for the platform to find the one I felt suited our team's needs best. Once decided it was onto organising our epics (long term goals), stories (short term goals), and tasks for the upcoming week. 

Another aspect of planning I knew was necessary was how we would manage our codebase. Having experience with group projects in the past with wild west style GitHub repos I knew we had to come up with something a little more thought out. For this I ensured everyone created pull requests for their changes rather than pushing to main and volunteered to be the one to review them. After working through some issues and helping teach teammates how to better utilise Git I ended up reviewing 78 pull requests over the course of a semester. This is also what I spent a majority of my time on throughout the project.

The last part of our planning was to survey some people we knew who had experience in these types of competitions. This resulted in some great feedback on key features users would expect and common pitfalls that occur. One of the biggest challenges we were informed about was how to manage scoring. In attack-defence CTFs the flags users try to find need to be constantly swapped out. This provides an incentive for people to patch the vulnerabilities in their machines.

# Flag System and Scoring
My main coding contribution to the project was the creation of the flags service that helped in rotating the currently available flag for the attacking teams. The flag service would also be required to confirm the basic functionality and availability of the different teams apps and services. It does this by simulating interactions that a user might take and reviewing the results. 

This required a lot of planning and considered thinking, as any oversight could have unintended consequences like users identifying which requests are coming from the bot and selectively blacklisting everything else. Keeping this in mind along with the feedback we received in our initial survey I ended up designing and creating three wildly different iterations of a flag service for the platform.

The final version utilises a flags.ts script that continually runs throughout a game. This script iterates through the teams and their apps or services, calling another python script that's running on the same docker network as the teams virtual machines. This python script can then perform the necessary actions to verify the uptime and intended functionality. Sometimes this can easily be done all at once but often requires a backdoor to inject the flag and then simulates a normal user to check the functionality.

Creating the flag injection and uptime checking scripts can be pretty difficult, you need to be able to account for all the things people might do to a system to exploit the scoring logic or accidentally break it. In particular when I made the SkyRewards challenge my biggest constraint was just coming up with ways to manage the flags and uptime. The challenge and all the thinking required to successfully create the flags service was really rewarding and I'm thankful I was able to produce something I'm proud of in the end.

# Bug Testing, Code Review, and Pull Requests
While coding new features was really fun, majority of my time went to managing the GitHub pull requests and trying to help manage the team. At the beginning of the project Sam set up a Discord bot that relayed notifications and updates about the code repository to a channel on Discord. This worked out great for me as the moment a new pull request came in I could quickly get it up and start testing and the moment it was approved and merged everyone would know.

In handling pull requests, my general workflow was to first review the files changed, scanning through trying to spot any potential issues, that way if I noticed anything I could easily add comments at the right spot. Where possible I always tried to include a solution or suggestion to finding a solution to reduce the added workflow for others. I knew sending in code you had worked hard on, only to get a notification or email back wanting a list of changes done wasn't a very enjoyable thing for anyone so I worked hard during my reviews to ensure things such as my language came across in a friendly and encouraging way, ensuring I was supportive of good changes that had been made too. When things got really tough I also took the time to jump in calls and help out teammates in diagnosing issues with things like their code, git/GitHub and code editors. This was helpful for both people involved as I gained a further fluency in helping solve issues as well as helping my teammates overcome obstacles and get back on track.

Because this was a uni group project and several team members were friends, I made sure my feedback stayed constructive and not overly harsh to prevent people becoming discouraged from further work on the project. I also checked in with teammates whose code received extra comments to confirm my suggestions felt fair and helpful. To promote accountability, I took responsibility for any bugs that slipped through code I had approved and personally fixed them when they were discovered.

I thoroughly enjoyed taking on this role and while it was a considerably larger job than I initially anticipated I believe it has only helped me to grow. Through constantly trying to put myself in the shoes of other people who might use the platform I found I had quite the knack for discovering bugs of all sorts. Even down to some obscure ones such as finding a [packet limit](https://github.com/cyberbattles/cyberbattles/pull/72#issuecomment-3424587726) that would brick the network traffic viewer, or a button that only worked on the [5th attempt](https://github.com/cyberbattles/cyberbattles/pull/37#issuecomment-3280580274) if someone had other docker services running. 

This experience was extremely valuable, getting practice at communicating with team members in a professional and supportive manner will undoubtedly be helpful to me in any future endeavours. All the practice at spotting errors at a glance has already been coming in handy too as I continue to do further work on CyberBattl.es and other projects.

# Communication and Agile Development
Another thing I spent time on was creating things on Atlassian's Jira and Confluence software. I utilised Confluence to encourage brainstorming ideas together as a team creating pages to talk about new ideas, and collaborate on our necessary documentation for the project. This worked great as the shared files were often used for shorter periods and allowed easy collaboration. 

Jira on the other hand started out great at first but as the semester got busier and workloads for everyone increased, I found that having to log into another website just added another element to everyone's workloads resulting in it being sparsely used. To improve communication and ensure everyone was on the same page I switched to just relaying information and trying to organise things through Discord as everyone was much more active. This was pretty painful and definitely made me appreciate how convenient Jira can be but there wasn't much point in putting lots of effort into creating and managing sprints when most people will never see it. While it didn't work out in this case, in the future I hope to be able to better utilise platforms like Jira and Trello to aid in keeping a project organised.
# Final Architecture and Flow
![architecture](/assets/blog/cyberbattles/architecture.webp)

Once everything came together it was really cool to be able to quickly spin up a challenge and play around against friends. 

To play a game the platform is pretty flexible, you could go solo, participate in a game and administrate it, or just manage and setup a game for others.
Regardless of which way you play all that's required is someone creates a lobby from the dashboard and you use the codes and links that it generates to get some friends in.
![admin dashboard](/assets/blog/cyberbattles/admin.webp)
After that you can start it up and players are provided with instructions to get connected and start playing.

# Benefits of Building the Platform
** CyberBattl.es was a huge project and one of my most valuable experiences at university. Going in I wanted to practice leveraging my skills in being able to put my self in others shoes to think outside the box on problems. After completing CyberBattl.es I feel I've gotten so much more experience at this and **

Despite not spending most of my time actually writing code this project has helped me improve in unexpected ways. I am only improving when it comes to parsing others code to understand it faster and spot bugs quicker, this helps immensely when working on my own projects and have to diagnose issues.
I've also greatly improved my soft skills in my ability to work in teams, collaborate effectively, share ideas, and so much more.

Another huge thing that has come from building CyberBattl.es is the award we won at UQ Illuminate.
# An Awesome Turnout
After being one of 5 teams to be nominated from the course to participate in UQ Illuminate, UQ's showcase for projects by final year students. Sam and I were more motivated than ever to polish off the project and create something awesome. We both got cracking trying to tidy up the website and create an extra challenge for demonstrations. After bouncing some ideas off each other we also came up with some awesome ideas for our display at the showcase.
![showcase](/assets/blog/cyberbattles/showcase.webp)

Standing out from others with our oversized monitors, red and blue themed sweets, and dark sheets as tablecloths, our first impressions at the event were like no other.

Getting to present something we had worked so hard on was a lot of fun. When it came time for judging however I really focused in on memorising a solid introduction and explanation of the product. Then Sam and I co-ordinated the flow of the demonstration so we could best utilise the time we were given to keep the judges engaged and distract them from any downtime such as when I have to download the VPN config and connect to it.

![award](/assets/blog/cyberbattles/award.webp)

Evidently this must've worked well as later that night we got to get up on stage and received the award for [Best Cyber Security and Data Privacy Project](https://illuminate.uqcloud.net/winners). This was such an exciting moment getting to stand on stage in front of a large audience and be recognised for something we worked so hard on. A big thankyou to Sam for all his effort and work in the project and in the showcase as well as the rest of the CyberBattl.es team for their continued work and support throughout the semester.
![stage](/assets/blog/cyberbattles/stage.webp)
# Final Remarks and Future Plans
CyberBattl.es represents the most time I've put into a single coding project and was such a blast. I hope that through the creation of this platform we have been able to solve a real problem and help out others to get their start in attack-defence CTFs in the future.

Going forward Sam and I are still keen to keep working on the project starting with a shift away from Firebase to something more sustainable and I will be working on improving the accessibility of the platform furthering the current guides and tutorials so users aren't left wondering what's happening or what to do at any stage.

If you're interested in running your own attack-defence CTF or contributing to the project, you can find the source code on [GitHub](https://github.com/cyberbattles/cyberbattles). The platform is designed to be easy to work with and new challenges just require a dockerfile to run and a system to score it.