# Improvement ideas
## Editor
- Bug testing (I can't recall the issues we had previously)
- Remove some of the options (or hide them better)
- Fix animation for sidebar collapse -- done
- Move advanced options into a popover instead of the sidebar -- done
- Heatmap i.e. points are coloured based on the entropy
- Multiple entropy sources (switchable with dropdown)
- Annotations need also the source? -> Think about how to do this
- Word boxes rendering -- TODO: Do we really need this? (editor technically supports it, but handling code is missing) -- skipped for now
- Tour -- done
- ~~Indices rendering outside box if possible?~~


## General
- Fix top bar showing the name of the text when returning (i.e. fire event on closing the editor) -- done
- Deployment -- done
- Update theme colours (currently primarily the blue and black themes look good)
- Better error handling for backend errors (i.e. better notifications)
- RWD fixes (Signup and Login views)
- Block if device is too small (also touch devices don't work!) -> Design?
- Take care of all TODOs in the code
- Buttons with long actions need spinners or other progress indicator



## Admin
- Upload pre-assigned points with multi-file select button on Text creation -- done TODO: Test
- Design
- Bug testing
- New Survey options
- Upload: Allow multiple files for multiple readers or one file with multiple readers -- TODO: Testing
- Pre-annotations: One file for each algorithm, filename is the algo name (minus extension).
- Define file contents specs somewhere
- Magic link regen
- Magic link panel close warning


http://localhost:8081/login?magic=JTdCJTIydXNlcm5hbWUlMjIlM0ElMjJRdWlldFR1cnRsZTgyNiUyMiUyQyUyMnBhc3N3b3JkJTIyJTNBJTIydS1HMjV0OEolMjIlN0Q=
