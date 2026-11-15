---
title: "Automating Labels and UV Print Prep for a Warehouse"
excerpt: "Two automations for We Are Likewise that replaced hours of tedious manual label work and cut daily print prep from 5 minutes to 30 seconds."
coverImage: "/assets/blog/likewise/cover.webp"
date: "2026-11-15"
tags: ["Projects"]
ogImage:
  url: "/assets/blog/likewise/cover.webp"
---

These are two automations I built for We Are Likewise,
one that creates product labels and one that prepares print files for their Mimaki
UV printer. Each of the 620 product labels used to take about 4 minutes to make by
hand and is now generated with no one involved, and setting up a bed of logos for
the Mimaki went from 5 or more minutes of focused work to about 30 seconds.

## The Problem

At Likewise the stock prep is organised through a web app built on top of a Google
Sheet, with other parts of the warehouse run through other systems. The staff use the
app to see what needs prepping, record what has been prepped, and print labels. Two
jobs around that app were still completely manual.

The first was labels. Every product needs a label with its name and a QR code of its
SKU, and each one was laid out by hand in Illustrator and saved as a file for the
label printer. At about 4 minutes each across 620 SKUs that's roughly 41 hours of
work for the full set, and every new product added to the pile.

The second was the Mimaki. Made to order items get a logo printed on them, with 9
fitting on the printer bed at a time in a 3x3 jig. There are currently 2 different
products that need different head heights in the printer, so they can't share a bed
and the job has to be done twice each day, once for each. Both times someone would
check the orders, open the jig template in Illustrator, line up each logo in its slot,
export the file, and bring it into the printer software. Afterwards the orders still
had to be marked as prepped and their labels printed separately.

![The old Illustrator jig template with logos placed by hand](/assets/blog/likewise/jig-template.webp)

## Working Out What Was Needed

Before writing anything I sat down with the people who do these jobs and took notes
on exactly what they expected. For the labels that meant getting the details that
make a label look right, like the QR code being exactly 18x18mm, the text sitting in
a 20mm wide box in Helvetica Now, and nothing going smaller than 5pt. For the Mimaki
it meant watching the whole process, from the 4 ink layers (primer, white, colour, and
clear) down to the small size corrections made in the printer software.

Once the first versions were in use I met with them again to find out what they liked,
what they didn't, and what they wanted added.

## Label Automation

Now when a product is switched to tracked in the sheet, its label is generated without
anyone touching it. For this I reused what I learnt generating QR codes in a previous
project, [replacing static price tags with QR codes](/posts/qrcodeprices). A Python
script builds the label at the printer's 600 DPI, fits the name into the text box by
stepping the font size down and wrapping onto extra lines, and saves it where the
label printer expects it. The warehouse PC already had a hidden
helper that prints labels queued from the web app, so I hooked the generator into it
and the new label is ready to print straight away.

There are a few names that just won't fit at 5pt, and for those the product is flagged
for someone to look at in Illustrator so a bad label never gets printed.

![A generated label next to one made by hand](/assets/blog/likewise/label.webp)

## Mimaki Automation

For the Mimaki the staff now press 'Send logos to Mimaki' in the web app. A dialog
lists the logos for the day's orders, and a small program running hidden on the Mimaki
PC picks up the request, places each logo in its slot on the bed, and saves the file
ready to load. Once that's done the orders are ticked off, both parts of each product
are recorded as prepped, and their labels come out of the label printer.

![The 'Send logos to Mimaki' dialog in the web app](/assets/blog/likewise/send-dialog.webp)

I wasn't able to automate all of it. My first plan was to drop the files into a hot
folder so the printer software, RasterLink, would do the rest, but it could only create
1 of the 3 extra layers it needed on its own. I then tried generating all 4 layers
myself in Python, but RasterLink treated every file as a colour layer and wouldn't let
me change it. In the end I worked with the staff member who runs the printer to find
the version he found easiest, which was for my program to make just the colour file and
for him to load it with a RasterLink tool that remembers the settings for the other
layers. It's one short manual step, but it's really straightforward and takes about 30
seconds.

![A finished bed of logos on the jig](/assets/blog/likewise/printed-bed.webp)

## Feedback and Changes

Most of the improvements came from the people using it.

- Labels now use a display name instead of the raw SKU. These were filled in
  automatically from the SKU so nobody had to type out 620 of them, and staff can fix up
  the odd one by hand.
- Existing labels are never touched unless someone asks for them to be overwritten, as
  some have manual adjustments that shouldn't be lost.
- The generator waits 2 minutes after a product is tracked, so it doesn't make a label
  while someone is still typing the name.
- Staff can untick logos before sending them to the Mimaki if there is already one on
  hand.
- Some logos are more visually weighted to one side, so their position can be nudged
  to achieve a better optical alignment.

## Keeping It Running

A few problems only showed up once everything was in daily use. The strangest was label
batches randomly printing twice. It turned out the sheet was converting some job IDs
into numbers (an ID like 00123456 lost its leading zeros), so the ID no longer matched
what the warehouse PC reported back and the job was sent again. Starting every ID with
a letter fixed it.

Another was products made of 2 parts drifting into negative stock, as both labels were
scanned at packing but only one part had been recorded as prepped. Prepping a product
now records both parts and prints both labels.

By this point the web app's code was one very large file shared between projects, so I
also split it up by feature and added some checks that catch mistakes before they reach
the live app.

## Final Remarks

This was a really rewarding project as I could see the difference it made straight
away. The biggest thing I learnt was how much the result depends on working closely
with the people doing the job. The Mimaki solution I ended up with is technically less
automated than what I first planned, but it's the one the operator actually preferred
using.

I used Gemini and Claude Code to help write and debug the code throughout. Thanks to
the team at Likewise for their time and feedback along the way.
