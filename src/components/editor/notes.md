# Notes
A few notes:
- Make sure that the character to type doesn't have to necessarily respect case (i.e. use JS's `String.prototype.toLowerCase` function to convert, possibly a setting to toggle)
- Make sure to `preventDefault` for the arrow keys (as it would scroll the page sometimes)
- Annotating to a comma (or dot) does not work (your regex does not include those, a regex that includes all is this: /[0-9a-zA-Z\,\.\"]/)
- When hitting backspace, it doesn't always return to the previous annotation
- Maybe add a mode where the ordering is dictated by closest horizontally, then next lowest vertically??
- Pretty sure the `eventListeners` aren't added before you click one (haven't looked at the code yet)
- Fire an event when annotation is complete, we could display fireworks or the like on the event (custom event on document)


The code for the editor is now in `src/scripts/editor`

# TODOs
## Editor
- Scaling -- done
- Loading from backend
- Saving
- Undo / Redo (likely requires rewrite of history tracking) -- done
- Show boxes only on hover -- done
- ~~Show indices~~ - looks bad
- Give the rendering a bit of an upgrade (if the above cannot be easily implemented) -- done
- Export
- ~~Mode switch?~~
- Reader filter
- Refactor some of the logic -- done

## Main page
- Upload function
