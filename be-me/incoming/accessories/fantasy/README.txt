DRAW HERE — accessories/fantasy
==============================

Wings, tails, halos, animal ears.

TARGET: 4 files

SIZE: whatever you want. Seriously — any dimensions, any crop, any
amount of empty space around it. Just draw the item on a transparent
background and save it as a .png with any filename you like
("blue hoodie.png" is fine — the name becomes the label in the game).

Then from the be-me folder run:
    node tools/normalize.js

It trims, scales and positions everything onto the shared canvas for
you and writes the result into assets/. Never edit assets/ by hand.
