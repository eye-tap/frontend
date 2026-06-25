# Improvement ideas
## Editor
- [X] **Next annotation button animation** -> Verify that this works with a Backend
- [X] **Ask to save when moving next annotation or returning home** -> or autosave
- [ ] **Tutorial per bucket** -> Improve
- [ ] Improve tour and remove anything not strictly relevant (or do settings to show only part of the tour via toggle in admin)
- [ ] Colourblindness settings
- [ ] **Features of basic features group**
- [ ] **Entropy colours in HSV or HSL?**
- [X] **Legend popup**
- [X] **Save function** fix saving not doing what it should -> Looks to be only happening with pre-annotations

## General
- [ ] Take care of all TODOs in the code
- [X] **Assigned fixations counting** -> Don't count as assigned if not human-confirmed
- [ ] **Fixations counting** -> Do we count the invalid fixations?
- [ ] Details pane on file explorer has wordcount in it, but no details on that
- [X] **Logout timer**
- [X] **Timer only added when enabled in study**
- [X] **Timeout popup**
- [X] **Settings (such as how long 'till account closure, enabled feature sets in editor)**
- [X] **Button to end prematurely**
- [X] Buttons with long actions need spinners or other progress indicator
- [X] **Warning popup on Logout to confirm if user wants to end participation**

## UX/Onboarding

Once finished, test again with new users to see if improvements are helpful

- [x] disable settings, disable un-collapsing side bar (permanently collapsed)
- [x] expanded help panel, document all features
- [x] rewrite survey introduction / ethics for more context
- [ ] allow opening ethics approval again after survey start
- [ ] workflow video (link in ethics approval or similar spot)
- [x] reduce tour (or remove entirely)
- [ ] colorblind options (optional)
- [ ] Fix entropy color gradient math (so it actually uses the colors depicted in the legend)
- [ ] Microslop-like feed the video to users (i.e. don't allow them to proceed if they haven't watched it)


## Analytics
- [ ] Track what features user use (and how often)
- [ ] Store this together with what?
- [ ] What features to track the usage of? (my suggestions: keybind based annotation, undo & redo, zoom, annotation completion, ...??)


## Admin
- [X] **Limiting available features (pre-annotations need to be filtered out 
    (plus a setting in admin for that), settings need limiting (only make available some with certain scope))**
- [ ] Magic link regen

## Parsers
- [ ] Add parser for char bounding boxes for the uid based format (take inspiration from the annotations one)
- [ ] Upload: Allow multiple files for multiple readers or one file with multiple readers -- TODO: Testing
- [ ] Pre-annotations importing: One file for each algorithm, filename is the algo name (minus extension).
- [ ] Define file contents specs somewhere -> Needs integration & design, see `src/components/admin/FileSpecs.vue` (What is this for?)

http://localhost:8081/login?magic=JTdCJTIydXNlcm5hbWUlMjIlM0ElMjJCcmlza1NlYWwyMDklMjIlMkMlMjJwYXNzd29yZCUyMiUzQSUyMiUzRE9Ccy03cEIlMjIlN0Q=

LAPTOP: http://localhost:8081/login?magic=JTdCJTIydXNlcm5hbWUlMjIlM0ElMjJOaW1ibGVUdXJ0bGU5NjYlMjIlMkMlMjJwYXNzd29yZCUyMiUzQSUyMnJTRjBfKjYwOXQlMjROQ1EhNCUyMiU3RA==


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


http://localhost:8081/login?magic=JTdCJTIydXNlcm5hbWUlMjIlM0ElMjJTbW9vdGhMeW54NjEwJTIyJTJDJTIycGFzc3dvcmQlMjIlM0ElMjJwNDB3LTQzX2UxdCUzRG1rMnYlMjIlN0Q=
