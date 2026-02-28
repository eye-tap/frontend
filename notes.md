# Improvement ideas
## Editor
- [ ] Bug testing (I can't recall the issues we had previously)
- [ ] Possibly: Resize listener on canvas container
- [ ] **Move advanced options into a popover instead of the sidebar**
- [ ] **Autosave -- TODO: Add button to disable (`src/editor/index.ts` exports the option to do so)**
- [ ] **Legend displaying what the colours mean**
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
- [ ] **Do we need more settings for the above?**
- [X] Fixation click on fixation in box directly assigning it
- [X] Test the above, may need to be changed to a more complex handler
- [X] Filter annotations by algorithms
- [X] Drop shadow for fixations
- [X] Completion handler improvements (soft complete (not all manually done), complete (all manually done))
- [ ] ~~Indices rendering outside box if possible?~~


## General
- [X] Deployment
- [ ] **Update theme colours (currently primarily the blue and black themes look good)**
- [X] Better error handling for backend errors (i.e. better notifications)
- [ ] **RWD fixes (Signup and Login views)**
- [X] Block if device is too small (also touch devices don't work!) -> Design?
- [ ] Take care of all TODOs in the code
- [ ] **Buttons with long actions need spinners or other progress indicator** (I can also do that)



## Admin
- [X] "Select All" on Survey-creation doesn't work
- [X] Upload pre-assigned points with multi-file select button on Text creation
- [X] Design
- [ ] Bug testing
- [X] Reload surveys on create
- [X] New Survey options
- [ ] Add parser for char bounding boxes for the uid based format (take inspiration from the annotations one)
- [ ] Upload: Allow multiple files for multiple readers or one file with multiple readers -- TODO: Testing
- [ ] Pre-annotations: One file for each algorithm, filename is the algo name (minus extension).
- [ ] **Define file contents specs somewhere** -> Needs integration & design, see `src/components/admin/FileSpecs.vue`
- [ ] Magic link regen
- [ ] Magic link panel close warning
- [X] survey delete -- TODO: Testing
- [X] survey export -- TODO: Testing
- [X] on index errors open parser settings panel
- [X] How to get reader id for one file per reader import scheme for fixations?
