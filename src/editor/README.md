# Editor
## Rendering concept
The editor uses multiple, stacked canvases to allow for more efficient rendering and also the changing of stacking order.

Each kind of element has its own canvas and accompanying rendering (in `render/` directory) and manager (in `manager/` directory) functions,
of which most have mounted and unmounted hooks to configure them on attach.

The concept the renderer follows is that for most kinds of elements, it renders from a data structure defined in the `types/` directory.
What this allows for is a better separation of concerns, primarily making the renderer just take into account settings,
but not the state of the editor itself. So, for each element type that has a manager, the renderer just renders what the manager computed.

Input is also handled separately, with the keyboard handler calling functions and the mouse handler going beyond that to primarily
modifying a Vue ref that is watched by the mouse click and move managers.

The `io/` directory also contains a zoom helper that abstracts the raw canvas movements into the required format for the zoom manager.

The `association/` directory contains a few helper functions that compute the fixations / boxes from the current position,
while in the `util/` directory there are small utility functions, like distance computations, etc

The `loaders/` directory contains all the data loaders (for backend and testing)


**How the editor is started:**

1. Renderer startup function from `render/index.ts`, which in turn registers all renderers.
2. IO attach function from `io/index.ts`, which causes the io handlers to register even listeners
3. Managers loaded
4. Save and export handlers
5. Start loader if not in dev mode
6. Register cleanup functions and theme management


Many of the functions in the UI don't actually call the corresponding function in the editor directly, but fire events.
You can see all the events in `src/types/globals/events.d.ts`


## Structure
