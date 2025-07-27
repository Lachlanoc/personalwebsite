---
title: "Replacing Static Price Tags with QR Codes"
excerpt: "Utilising QR codes to allow for easy adjustment of product prices without having to rewrite or print price tags every time."
coverImage: "/assets/blog/qrcodeprices/qrcode.webp"
date: "2025-07-27"
ogImage:
  url: "/assets/blog/qrcodeprices/qrcode.webp"
---

This is a solution I came up for a problem in a fishing tackle store where I was working.

## The Problem
For a long time if customers wanted to know how much an item cost they would either have to try and work out the product name and search the website
themselves or ask an employee how much it is. This is quite an inconvenience and can make customers feel bad for constantly asking especially if
they are looking for products on more of a budget. The reason why no price tags had been previously added was the sheer number of products, how often new products
are added to shelves and that the prices become out of date if they need to be changed. 

## A New Solution
I came up with an idea to try and address the concerns with traditional price tags. By utilising QR codes to the website's product page the price could be easily updated, 
and with a little bit of python the creation of the new QR code price tags could be almost completely automated. 

## Automatic Generated QR Codes
For this I used python's qrcode and pillow libraries. Inspired by QR code generating websites I wanted to be able to have a large company logo in the center of the image.
Taking this into account I went with the following parameters:

```python
qr = qrcode.QRCode(
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=10,
    border=1,
)
```
Things that stand out here is the high error correction allowing me to use the biggest logo possible and the really small border size of 1. The quiet zone is very important
for QR codes and typically you would leave this at around 4, but in my case the white paper I'm printing onto will provide the necessary extra blank space.

After generating the basic image, pillow can then be used to resize the company logo for layering over the top. I consulted [this](https://pillow.readthedocs.io/en/stable/handbook/concepts.html#filters-comparison-table)
comparison table from pillow's documentation and went with LANCZOS resampling as I wasn't overly concerned about performance.

## Getting Products Through BigCommerce's API
BigCommerce has a pretty well documented [API](https://developer.bigcommerce.com/docs/api) which allowed me to easily loop through everything instock to make a QR code. 
The API does utilise pagination for retreiving large quantities of products which is important to remember when it seems like your store suddenly has a fraction of the 
total products.

Filtering for only SKUs with atleast one item in stock and utilising the product id and slug for file names, I was able to generate about 100 QR codes a second.

In the end this solution was much faster than I anticipated and has made a big difference in the showroom to aid customers.
