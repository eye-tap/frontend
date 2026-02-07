# Improvement ideas
## Editor
- nicer default colours
- bounding box stroke width smaller and lighter colour
- index colour should become more legible when hovered or generally
- Bug testing (I can't recall the issues we had previously)
- Completely rewrite history tracking (as it is quite broken currently, e.g. clicking a new point is a history entry)
- "fireworks" or the like when annotation is completed
- Remove some of the options (or hide them better)
- Fix animation for sidebar collapse
- Reader selection using dropdown instead of number input field (we can filter out the readers without a point)
- Move advanced options into a popover instead of the sidebar
- Change default rendering size of the editor
- Improve next item selection
- Make options not depend on each other except when they are a dropdown
(i.e. we need to make a dropdown e.g. for "show boxes" as options we could have "always", "on hover" and "never")
- Heatmap (i.e. points are coloured based on the entropy), or shown as a small overlay somewhere sensible


## General
- Do we need the export feature still?
- General usability improvements
- Update theme colours (currently primarily the blue and black themes look good)
- Fix top bar showing the name of the text when returning (i.e. fire event on closing the editor)
- Better error handling for backend errors (i.e. better notifications)
- RWD fixes
- Improve animations (e.g. of the account slideover)



# Notes
These notes are from my initial gloss over back in December
- Make sure to `preventDefault` for the arrow keys (as it would scroll the page sometimes)
- Annotating to a comma (or dot) does not work (current regex does not include those, a regex that includes all is this: /[0-9a-zA-Z\,\.\"]/).
Also for multi-lingual documents, this regex does not allow special characters
- When hitting backspace, it doesn't always return to the previous annotation
- Maybe add a mode where the ordering is dictated by closest horizontally, then next lowest vertically??
- Fire an event when annotation is complete, we could display fireworks or the like on the event (custom event on document)
