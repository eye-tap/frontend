# Improvement ideas
## Editor
- [X] Possibly: Resize listener on canvas container
- [X] Move advanced options into a popover instead of the sidebar -> default collapsed, expanded
- [X] Autosave
- [X] Legend displaying what the colours mean
- [X] Fix animation for sidebar collapse
- [X] Heatmap i.e. points are coloured based on the entropy
- [X] Loading of disagreement metrics from backend
- [ ] ~~Multiple entropy sources (switchable with dropdown)~~
- [X] Pre-Annotation sources name (retrieved from CSVs)
- [ ] ~~Word boxes rendering~~
- [X] Tour
- [X] Gradients with three points
- [X] Pick default algorithm
- [X] Loading of new data
- [X] true annotation delete with keybind
- [X] Space to confirm current assignment (i.e. create annotation for it)
- [X] Keybind to flag as invalid
- [X] Shift to show all algorithms for current fixation
- [X] Use other combination for the above, as shift key cannot be detected (neither all other modifiers)
- [X] Fixation click on fixation in box directly assigning it
- [X] Test the above, may need to be changed to a more complex handler
- [X] Filter annotations by algorithms
- [X] Drop shadow for fixations
- [X] Completion handler improvements (soft complete (not all manually done), complete (all manually done))
- [X] Scan path rendering
- [X] Good colours -> the current config is okay
- [X] *Clean up options (remove some, add some others)
- [X] Colour picker for Color objects
- [X] Moving back all the way with arrows -> arrow right stops working -> JS was dumb (mod of negative number is negative number wtf)
- [X] T1 R552, popeye slice point 2 assigns to multiple?
- [X] Multiple lines showing from annotations
- [X] Cmd-starting commands (cmd + +, etc) should also be a thing
- [X] Trackpad zoom & move
- [X] Highlighting current fixation (probably add colour change back, or some outline?)
- [X] Highlight box for all algos visualization
- [X] If high agreement, highlight the corresponding box only and user can then (obviously) press space to confirm, else show all options (togglable via setting ofc)
- [ ] ~~Keybind panel (possible to keep open?)~~ -> this wouldn't work well, the keybind panel is huge
- [X] Put button to open keybind panel in collapsed sidebar
- [X] Download annotations button -> *export to CSV*
- [X] Invalid fixation keybind -> shift delete or shift backspace
- [X] Fix delete annotation bind (doesn't fully unassign, also requires two backspaces)
- [X] Invalid fixation rendering
- [X] Add button to mark fixation as invalid -> annotations.markFixationAsInvalid is func to be called -> On hover show keybind
- [X] Backspace moves backwards if no annotation present
- [X] Space bar assignment doesn't work (on Mac at least) --> TODO: Verify
- [ ] ~~Optional: Show zoom box if lots of fixations close by~~
- [X] Zoom to fixation
- [X] Move to fixation when moving around (and zoom factor > 1)
- [ ] **Render hovered boxes above everything else (to make it more legible, maybe add condition to this)**

### ~~Quick guide~~
A short summary for how to use the editor, preferrably graphical, with the most important keybinds on there.
Just an idea from the meeting, doesn't have to happen, but could be a solid idea.
Alternatively add a button to restart the tour somewhere (maybe in the keybinds panel)

-> We already have a welcome panel, the tour & the keybinds panel.
I think adding more user guidance would end up being confusing (i.e. suppose I'm looking for info x, in which of these 4 places do I check for x now?)

## General
- [X] Deployment
- [X] Update theme colours 
- [X] Better error handling for backend errors (i.e. better notifications)
- [X] RWD fixes (Signup and Login views)
- [X] Block if device is too small (also touch devices don't work!) -> Design?
- [ ] Take care of all TODOs in the code
- [X] Buttons with long actions need spinners or other progress indicator



## Admin
- [X] "Select All" on Survey-creation doesn't work
- [X] Upload pre-assigned points with multi-file select button on Text creation
- [X] Design
- [X] Reload surveys on create
- [X] New Survey options
- [ ] Add parser for char bounding boxes for the uid based format (take inspiration from the annotations one)
- [ ] Upload: Allow multiple files for multiple readers or one file with multiple readers -- TODO: Testing
- [ ] Pre-annotations: One file for each algorithm, filename is the algo name (minus extension).
- [ ] **Define file contents specs somewhere** -> Needs integration & design, see `src/components/admin/FileSpecs.vue` (What is this for?)
- [ ] Optional: Magic link regen
- [X] Magic link panel close warning
- [X] survey delete -- TODO: Testing
- [X] survey export -- TODO: Testing
- [X] on index errors open parser settings panel
- [X] How to get reader id for one file per reader import scheme for fixations?

http://localhost:8081/login?magic=JTdCJTIydXNlcm5hbWUlMjIlM0ElMjJCcmlza1NlYWwyMDklMjIlMkMlMjJwYXNzd29yZCUyMiUzQSUyMiUzRE9Ccy03cEIlMjIlN0Q=

LAPTOP: http://localhost:8081/login?magic=JTdCJTIydXNlcm5hbWUlMjIlM0ElMjJTbW9vdGhCYWRnZXI1MDclMjIlMkMlMjJwYXNzd29yZCUyMiUzQSUyMnFwTU4lMjZYVS0lMjIlN0Q=
