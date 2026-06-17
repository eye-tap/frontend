# Improvement ideas
## Editor
- [ ] **Render hovered boxes above everything else (to make it more legible, maybe add condition to this)**
- [ ] **Next annotation button animation (currently no feedback at all)**
- [ ] **Ask to save when moving next annotation or returning home**
- [ ] **Tutorial per bucket**
- [X] **Legend popup**

## General
- [ ] Take care of all TODOs in the code
- [ ] **Logout timer**
- [ ] Improve tour and remove anything not strictly relevant (or do settings to show only part of the tour via toggle in admin)
- [ ] **Settings (such as how long 'till account closure, enabled feature sets in editor)**
- [ ] **Button to end prematurely**
- [X] Buttons with long actions need spinners or other progress indicator


## Admin
- [ ] **Limiting available features (pre-annotations need to be filtered out 
    (plus a setting in admin for that), settings need limiting (only make available some with certain scope))**
- [ ] Magic link regen

## Parsers
- [ ] Add parser for char bounding boxes for the uid based format (take inspiration from the annotations one)
- [ ] Upload: Allow multiple files for multiple readers or one file with multiple readers -- TODO: Testing
- [ ] Pre-annotations importing: One file for each algorithm, filename is the algo name (minus extension).
- [ ] Define file contents specs somewhere -> Needs integration & design, see `src/components/admin/FileSpecs.vue` (What is this for?)

http://localhost:8081/login?magic=JTdCJTIydXNlcm5hbWUlMjIlM0ElMjJCcmlza1NlYWwyMDklMjIlMkMlMjJwYXNzd29yZCUyMiUzQSUyMiUzRE9Ccy03cEIlMjIlN0Q=

LIMITED FEATS: http://localhost:8081/login?magic=JTdCJTIydXNlcm5hbWUlMjIlM0ElMjJMdWNreVBlbGljYW4yMzElMjIlMkMlMjJwYXNzd29yZCUyMiUzQSUyMlcyNSUyM3VYN3UlMjIlN0Q=

LAPTOP: http://localhost:8081/login?magic=JTdCJTIydXNlcm5hbWUlMjIlM0ElMjJTbW9vdGhCYWRnZXI1MDclMjIlMkMlMjJwYXNzd29yZCUyMiUzQSUyMnFwTU4lMjZYVS0lMjIlN0Q=


# The workflow
## The editor
- Users have three different ways of annotating the tracking data: <br>
    (1) They can drag the point to the character they want to connect it with <br>
    (2) They click the character they want to connect it to. <br>
    (3) They press the key on their keyboard that corresponds to the character that they want to assign. 
    This will assign the selected point to the closest character that corresponds to the one pressed on the keyboard
- Some fixations may be incorrect, users can mark these as invalid using a button in the user interface or a keybind
- If algorithmically generated annotations are included and algorithms agree, then the user is shown the algorithm-generated suggestion for which character to assign it to.
- When a user annotates a fixation, the editor immediately jumps to the next one to speed up annotation

The editor also features multiple modes it can be put in to give the user more or less assistance, which is needed for what we are trying to show here.
We have implemented undo and redo functions, auto-save and many other creature comforts
