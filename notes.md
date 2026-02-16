# Improvement ideas
## Editor
- nicer default colours
- bounding box stroke width smaller and lighter colour -- done (as options)
- index colour should become more legible when hovered or generally -- done (as options)
- Bug testing (I can't recall the issues we had previously)
- Completely rewrite history tracking (as it is quite broken currently, e.g. clicking a new point is a history entry) -- done
- "fireworks" or the like when annotation is completed -- done
- Remove some of the options (or hide them better)
- Fix animation for sidebar collapse
- Reader selection using dropdown instead of number input field (we can filter out the readers without a point) -- done (differently)
- Move advanced options into a popover instead of the sidebar -- done
- Change default rendering size of the editor -- done
- Improve next item selection -- done
- Make options not depend on each other except when they are a dropdown -- done
(i.e. we need to make a dropdown e.g. for "show boxes" as options we could have "always", "on hover" and "never")
- Heatmap (i.e. points are coloured based on the entropy), or shown as a small overlay somewhere sensible -- TODO: Really needed? Or how to do (support is technically there)
- Word boxes rendering -- TODO: Do we really need this? (again, editor technically supports it, but handling code is missing)
- Tour
- Zoom APIs -- done
- Integrate zoom -- done
- Keybind improvements
- Show keybinds
- ~~Indices rendering outside box if possible?~~
- On move to next annotation session, SAVE!!!


## General
- Do we need the export feature still? -> Into admin panel -- done
- General usability improvements
- Update theme colours (currently primarily the blue and black themes look good)
- Fix top bar showing the name of the text when returning (i.e. fire event on closing the editor) -- ~~done~~ someone broke it again
- Better error handling for backend errors (i.e. better notifications) -- done
- RWD fixes -- done
- Block if device is too small (also touch devices don't work!) -- done
- Improve animations (e.g. of the account slideover)
- Take care of all TODOs in the code
- Do deployment


## User login
- Magic link with password and username base64 or so encoded -- done


## Home
- Basically only have the file select -- done


## Admin
- Upload pre-assigned points with multi-file select button on Text creation
- Design
- Bug testing
- New Survey options
- Select all button for add survey



## Call notes
- Create admin panel (single page, at `/admin` in the frontend) where people can upload annotation sets and create the studies -- done
- Automatically generated study accounts (or we could also generate a group token that the user has to enter during signup to join a group) -- done
- We want to do the parsing of the CSV files on the frontend as we already have the code. I will be making that code a bit more flexible
and I will be creating the UI (minus design for it) -- done
- The parsed CSVs will then be sent as JSON to the backend according to the schema Paul has sent in the image. -- done
- Deployment will still need to be discussed, but I will handle all the implications (i.e. I will do the full CD pipeline including possibly helm charts, etc)
- The docker containers for both the frontend and backend now build successfully. -- done
- I have provided a docker-compose file in the eyetap repo (the monorepo) that will build the latest backend.
The frontend has to be run on your local machine (using `npm run dev` in the frontend folder / repo.
Do make sure to recursively clone the repo. (You run the backend with `docker compose up` and stop it with `docker compose down`)
- ~~We will likely use [this](https://github.com/marketplace/actions/helm-chart-releaser) to do the helm charts and that will end up in the `helm-chart` repo.~~


# Notes
These notes are from my initial gloss over back in December
- Make sure to `preventDefault` for the arrow keys (as it would scroll the page sometimes)
- Annotating to a comma (or dot) does not work (current regex does not include those, a regex that includes all is this: /[0-9a-zA-Z\,\.\"]/). -- no bounding boxes
- Also for multi-lingual documents, this regex does not allow special characters -- TODO: See how we could expand regex
- When hitting backspace, it doesn't always return to the previous annotation -- done
- ~~Maybe add a mode where the ordering is dictated by closest horizontally, then next lowest vertically??~~
- Fire an event when annotation is complete, we could display fireworks or the like on the event (custom event on document) -- done


CoolPelican953
http://localhost:8081/login?magic=JTdCJTIydXNlcm5hbWUlMjIlM0ElMjJDb29sUGVsaWNhbjk1MyUyMiUyQyUyMnBhc3N3b3JkJTIyJTNBJTIyJTI1JTJCKFZhWEpUJTIyJTdE
