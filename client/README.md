# Lightpack-client

### Done

- ✅ basic auth & login
- ✅ errors in routes should NOT crash the server
- ✅ pack index
- ✅ pack editing
- ✅ worn/consumable/baseweight calculations
- ✅ fetch qty from Lighterpack when importing
- ✅ weight editing (this one is a bit tricky)
- ✅ weight conversions

### TODO: Polish up the PackEditor

- implement re-ordering of items (https://5fc05e08a4a65d0021ae0bf2-goamnjvxea.chromatic.com/?path=/story/presets-sortable-multiple-containers--vertical)
- implement add item (with tab-to-add support!)
- edit pack name
- description display + edit (and fix LP description import)
- allow the user to change weight display on a per-type basis
- replace all instances of a weight unit string (e.g. 'oz') with a WeightUnitsSelect
- implement re-ordering of sections
- implement add section
- tooltips (for stuff like worn/consumable/base)

### TODO: Polish up the UI

- pull in Inter as a fallback font: https://fonts.google.com/specimen/Inter
- port the Popover/PopoverMenu over from Trailhead.club
- implment list select dropdown in navbar (model it after Scout Maps' map dropdown)
- implement account dropdown (again, scoutmaps style)
- implement create list flow
- tweak the share/options buttons to look less dumb
- implement copy list feature

### TODO: Work on the onboarding story

- polish up the Lighterpack import flow for both logged-out and logged-in users
- landing page (just a screenshot of the app on some kind of nice mountain backdrop)
- write about page

### TODO: Final bits

- replace SVG favicon with a PNG or ICO
- implement read-only share mode
- implement import page
- add "colorScheme" to packs table, and add user color editing
- system font fallback for non-MacOS users (use https://fonts.google.com/specimen/Roboto as fallback)
- emoji font fallback for non-MacOS users (use joypixels or similar) - https://demos.joypixels.com/latest/joypixels-web-font.html
- settings interface + password reset

### TODO: And beyond?

- have a peek at https://github.com/galenmaly/lighterpack/issues to find some cool features?
