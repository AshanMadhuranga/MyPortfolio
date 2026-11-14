# Ashan's Portfolio World — Phase 1



A local React + TypeScript + Vite homepage built with actual procedural Three.js geometry, React Three Fiber, Drei, GSAP/ScrollTrigger, Motion, Tailwind CSS and Lucide. No backend. No invented projects, experience, or social URLs.



## Run



Use Node.js 22.12+ (Node 24 recommended) and npm:



```powershell

cd C:\Users\madhu\Music\portfolio

npm install

npm run dev

```



Open the localhost URL printed by Vite. To validate and preview the production build:



```powershell

npm run lint

npm run build

npm run preview

```



## Architecture



- `src/app/`: React entry and homepage composition; lazy scene loading and WebGL error boundary.

- `src/scenes/HomeScene/`: world arrangement, lighting, fog, responsive rendering quality.

- `src/components/three/`: reusable islands, blossom trees, instanced grass/petals, shader water, waterfalls, clouds, mountains, crystals, portal and explorer.

- `src/components/layout/`: responsive floating navigation.

- `src/components/ui/`: native modal for upcoming destinations and opt-in audio controls.

- `src/animations/CameraRig.tsx`: configurable establishing shot, eased arrival, pointer response and small scroll journey. GSAP context cleans up ScrollTrigger and tweens.

- `src/hooks/`: reactive media queries with listener cleanup.

- `src/config/portfolio.ts`: real social URLs, CV path and audio path go here.

- `src/styles/`: responsive styling, typography and reduced-motion overrides.



React 19 and Fiber 9 are paired according to the official compatibility guidance: https://r3f.docs.pmnd.rs/getting-started/installation



## Content and assets



All scenery and the explorer are original procedural geometry. The explorer is deliberately a **replaceable prototype**, not a finished character model. No reference image is used as a background. No external 3D assets are downloaded. Fonts load from Google Fonts with system fallbacks.



Create `public/ashan-cv.pdf` and set `cv: '/ashan-cv.pdf'` to enable Download CV. Add genuine GitHub and LinkedIn profile URLs in `src/config/portfolio.ts` to enable those links.



For music, add your original or properly licensed track at `public/audio/ambient.mp3`, retain its license/attribution as appropriate, and set `audio: '/audio/ambient.mp3'`. No audio is bundled or autoplayed. Until configured, all playback controls are disabled and labeled as coming soon. Audio errors disable controls gracefully.



Home is the only implemented destination. Other navigation items and hero actions open a keyboard-accessible “next chapter” dialog, including Escape handling and native focus restoration. No fabricated CV or projects are included.



## Motion and rendering



The loading overlay waits for the lazy scene to mount. Its progress bar is intentionally indeterminate: this procedural scene has no network model/texture asset queue to measure. A failure renders the readable homepage over a simple CSS fallback with a visible unavailable status.



Reduced-motion preferences and the leaf control stop environmental motion and camera animation. Mobile reduces grass and petal instances, omits one distant island, reduces DPR and disables antialiasing. PerformanceMonitor lowers DPR on sustained slow rendering. Shared tree geometry/materials and instanced grass/petals reduce allocations and draw calls. Desktop uses one 1024px directional shadow map; mobile disables shadows. Magical halos use local additive shaders rather than full-screen bloom. Performance targets still require real-device measurement.



## Phase 1 visual refinement - November 8, 2026



- `HomeScene.tsx`: lower ambient lighting, purple fill, a warm directional key, desktop shadows, clearer character-to-portal composition, continuous stepping stones and responsive vegetation budgets.

- `Environment.tsx`: varied blossom crowns, saturated pink meadow instances, instanced flowers and small rocks, layered island cliffs, crystal clusters, lantern halos, animated waterfall streaks and two mountain layers.

- `Portal.tsx`: beveled annular stone wedges, a procedural spiral vortex, energy rings, restrained orbiting sparks and localized glow.

- `Explorer.tsx`: larger procedural explorer, tapered hoodie, cuffs, hands, straps and a brighter code backpack. Still replaceable with a licensed GLB.

- `Glow.tsx`: reusable additive radial halo, without extra dependencies or postprocessing render targets.

- `CameraRig.tsx` and `index.css`: framing changes and a narrower desktop readability gradient. Existing navigation, hero controls and configuration are preserved.

- `public/favicon.svg` and `index.html`: local icon to remove the missing-favicon request.



## Verification and remaining limitations



Production build and lint pass. Headless Chrome rendered and screenshots were inspected at 1440x960 and 390x844. The scene loaded without the fallback; the Projects dialog and mobile navigation opened successfully, and neither viewport had horizontal overflow. The final browser check reported no runtime exceptions or network errors. Local screenshots are in `artifacts/desktop.png` and `artifacts/mobile.png` (ignored by Git).



This is still a procedural low-poly interpretation, not a reproduction of the concept artwork. The explorer remains a prototype; water has no physical reflections, and glow is a lightweight approximation of bloom. Real mid-range mobile GPU performance and touch input have not been measured. Future destinations remain placeholders, and this project has not been published.



**Next improvement:** review the composition on physical mobile devices, then replace the procedural explorer and selected hero trees with optimized authored GLB assets while preserving the existing component interfaces.



## Phase 1.3 polish



This is an incremental revision of the same homepage. Navigation, configuration, hero actions, portal shader and upcoming-section behavior are preserved; no dependencies or portfolio sections were added.



### Modified and added files



- `src/components/three/Explorer.tsx`: grounded placement wrapper. All character geometry stays within this local frame.

- `src/components/three/ExplorerModel.tsx` (new): improved procedural proportions, layered hair, jacket panels, articulated arms, gloves, segmented legs, boots, backpack pockets/straps and illuminated code emblem. Geometries and materials are reused within the model and disposed on teardown. No local GLB was found or downloaded. A future GLB should use a sole-level origin and face negative Z.

- `src/animations/ExplorerIdle.tsx` (new): separate breathing and idle logic, applied to the upper body so the feet stay planted. Reduced motion freezes the current pose.

- `src/animations/CameraRig.tsx`: reusable desktop and portrait shots, aspect-ratio compensation, tiny idle drift, gentle desktop pointer parallax and a limited scroll move. GSAP cleanup remains intact.

- `src/components/three/Environment.tsx`: asymmetric island edges, clear grass/flower corridors, more distant clouds, tree shadows, and water highlights with explicit tone-mapping, color-space and fog shader support.

- `src/components/three/Pathway.tsx` (new): eleven stepping stones rendered as one instanced mesh with shared geometry and material.

- `src/scenes/HomeScene/HomeScene.tsx`: soft pink sun, lavender ambient/fill lighting, explicit ACES/sRGB renderer settings, lantern placement outside the path and lower-quality shadow fallback.

- `src/styles/index.css`: stronger label contrast, safer control spacing, compact-height desktop adjustments, and mobile grid flow separating the hero, scene and music controller. Short screens scroll naturally instead of clipping a fixed-height composition.

- `README.md`: revision and validation notes.



### Clipping investigation



The prior mobile frame forced an 850px minimum height and used an oversized absolutely positioned scene behind the hero controls. Those layout constraints were corrected before tuning portrait framing. No detached character geometry was reproduced; the shapes at the top of the scene were clouds. All character parts now live in an explicitly named model group; cloud placement was moved farther back.



### Phase 1.3 verification



- `npm run build`: passed, including TypeScript checking.

- `npm run lint`: passed.

- Chrome: rendered and visually inspected at 1440x960 and 390x844 (full-page mobile capture).

- Additional 320x568 layout checks: no horizontal overflow; scene controls/music stay inside the page frame.

- All six upcoming navigation destinations, Explore My Work, About Me, Escape dismissal, Home scrolling, mobile menu and two scene replays passed.

- Disabled music and reduced-motion control states passed. No runtime exceptions, console errors or network errors in the final run.

- Evidence: `artifacts/phase13-desktop.png`, `artifacts/phase13-mobile-full.png`, and `artifacts/phase13-results.json`. These local QA files are ignored by Git.



The browser run initially caught missing fog uniforms in the new water shader; those were fixed and the complete check repeated successfully. This is still a procedural interim character, and glow remains a localized shader approximation rather than a full-screen bloom pass. The lazy scene chunk is approximately 297 KB gzip. Real-device FPS, touch feel, physical reflections and authored character animation remain unvalidated or out of scope.



Run the existing project:



```powershell

cd C:\Users\madhu\Music\portfolio

npm run dev

```



For a fresh checkout, run `npm install` first. Use `npm run build`, `npm run lint`, and `npm run preview` for production verification and preview. The next step is a real-device performance review followed by an optimized custom Blender character using the preserved placement interface.



## Phase 1.4 stability and visual cleanup



### Root cause investigation



The reproduced pair of foot-like shapes below the desktop navigation were the outer lobes of a cloud whose center was obscured by the navigation bar. Disabling only the cloud layer removed them. The old randomized cloud altitude (13-17 world units) placed these silhouettes behind the header in the opening and settled camera views. Cloud altitude now uses a lower, narrower world-space band (10.5-11.7); the camera frustum and CSS clipping were not changed to conceal the problem.



Live scene inspection found exactly one `explorer` instance. After the opening animation settled, its world bounds were approximately X 5.12-6.49, Y 0.35-3.26, Z 7.57-8.62. All projected character vertices were in the lower half of the view (normalized screen Y -0.486 to -0.040). The near/far planes remained 0.1/180. No detached or duplicated character geometry was found, so the model, idle animation and placement wrapper did not need changes. Temporary scene-graph instrumentation was removed after measurement.



### Changes



- `src/components/three/Environment.tsx`: named cloud layer and corrected world-space cloud placement.

- `src/animations/CameraRig.tsx`: entering calm/reduced-motion mode freezes the current camera pose rather than resetting intro/scroll progress. Tween cleanup no longer rewinds state; resuming uses the actual scroll position. Resizing still reframes appropriately.

- `src/scenes/HomeScene/HomeScene.tsx`: slightly smaller foreground tree, moved away from the path. The portal, explorer and stepping stones retain their placement.

- `src/styles/index.css`: desktop camera controls have a consistent inset, spacing and compact translucent container. Mobile controls and the approved layout are preserved.

- `README.md`: investigation and verification evidence.



### Validation



Build (including TypeScript) and lint pass. Inspected settled Chrome renders at 1440x900, 1366x768 and 390x844. Opening and replay were polled until camera Z reached the home position within 0.025 units, rather than assuming an arbitrary screenshot delay was sufficient.



Measured opening Z moved from 29.99 to 24.01; replay returned from 30.00 to 24.01. Small idle drift and mouse parallax were observed; scrolling moved Z to 23.15. Both calm and OS reduced-motion tests produced zero camera displacement during the measured pause, including pointer/scroll input. Mobile navigation, the Projects dialog and overflow checks passed. The final motion test reported no console, runtime or network errors.



Evidence is local and Git-ignored: `artifacts/phase14-before.png`, `artifacts/phase14-without-clouds.png`, `artifacts/phase14-before-laptop.png`, `artifacts/phase14-desktop.png`, `artifacts/phase14-laptop.png`, `artifacts/phase14-mobile.png`, and `artifacts/phase14-results.json`.



No new sections, assets or dependencies were introduced. The explorer remains procedural. Browser verification uses desktop Chrome with mobile emulation; physical mobile GPU performance and other browser engines remain untested.





## Phase 2 - The Developer's Sanctuary



### Architecture and implementation



The existing Home geometry is preserved in `src/scenes/HomeScene/HomeScene.tsx`. It now renders inside `src/scenes/WorldScene.tsx`, the only Canvas and shared lighting host. About is a second geographic destination at `[38, 0.1, -12]`, reached from the portal island by a curved, instanced wooden bridge. Water level and existing environment materials/components are shared. No new dependencies or backend were introduced.



`src/animations/CameraRig.tsx` remains the only camera writer. Its cubic position/look-target curves are configured in `src/config/world.ts`, with separate desktop and portrait shots. The approved Home camera endpoints are retained. `src/hooks/useWorldJourney.ts` observes actual scroll position relative to a viewport-sized About marker and supplies progress to the camera, navigation, location indicator and HTML stages. Scroll direction is reversible. Direct `#home` / `#about` links, initial refresh, hash navigation and browser history are handled independently of WebGL. Replay from About travels back Home and repeats the flight; wheel, touch, keyboard and resize events interrupt playback. At Home, replay repeats the opening shot without remounting the Canvas.



Reduced motion uses stationary destination views instead of a flying camera; decorative motion is disabled through existing component props. The About interface stays available when the Canvas fails. Its content and all object-dialog copy live in `src/config/portfolio.ts`.



### New components and files



- `src/scenes/WorldScene.tsx`: one Canvas, shared lights/fog, adaptive DPR and one moving shadow map.

- `src/scenes/AboutScene/AboutScene.tsx`: cabin island, blossom garden, stepping stones, lanterns, crystal and waterfall.

- `src/scenes/AboutScene/Cabin.tsx`: procedural timber cottage with pitched roof, roof seams, chimney, warm windows, front door, porch and an open studio wall. The studio contains real 3D desk/laptop, code lines, chair, mug and a stocked bookshelf.

- `src/scenes/AboutScene/ConnectingBridge.tsx`: 46 instanced planks on a curved route, with supporting posts and lanterns.

- `src/components/ui/AboutPanel.tsx`: centralized biography, three concise interest areas and accessible object controls.

- `src/components/ui/AboutDialog.tsx`: native modal details, Escape/backdrop/close actions and focus restoration.

- `src/hooks/useWorldJourney.ts`, `src/config/world.ts`, `src/utils/journey.ts`: shared navigation, route configuration and pure progress helpers.

- `src/styles/about.css`: About and connected-world styles; existing palette, typography and navigation appearance are retained.

- `tests/world.test.mjs`: Node built-in regression tests, using the existing TypeScript dependency to load pure config/helpers.



Modified existing files: `App.tsx`, `main.tsx`, `Navigation.tsx`, `HomeScene.tsx`, `CameraRig.tsx`, `portfolio.ts`, `package.json` and this README. The explorer, portal, water shader, vegetation and existing audio/upcoming controls were reused.



### Interactions and responsive behavior



The laptop opens technology interests, the bookshelf opens learning interests, and the crystal opens a developer philosophy. Each 3D object has pointer/touch handlers and hover feedback, with a matching keyboard-accessible HTML button that opens the same modal. No real experience, qualifications or achievements were invented.



Desktop overlays compact translucent content on the left, leaving the cabin to the right. Mobile keeps text and the shared scene in separate grid rows; the About reading area scrolls independently, with all three interaction controls inside it. Very short screens can scroll the frame to reach lower controls. Mobile uses reduced foliage, no directional shadow map and capped DPR. Repeated bridge planks and vegetation are instanced; cabin blocks share geometry/materials with explicit teardown. No full-screen bloom, high-resolution textures or external models are added.



### Validation status and limitations



The production build (including TypeScript) and lint passed for this revision. All four regression tests passed. The test suite checks normalized/reversible scroll progress, reduced-motion endpoints, preservation of the approved Home camera pose, continuity of configured flight curves and complete interaction content. These source-level checks do not replace browser testing.



**Phase 2 visual/browser validation is incomplete.** The Chrome capture/interaction command was declined before execution. No Phase 2 browser screenshot has been produced, and no claim is made about visual similarity, console cleanliness, raycast target visibility, mobile layout, or end-to-end navigation/dialog behavior. `artifacts/phase2/` is reserved for the required actual captures; earlier phase screenshots do not validate this revision.



Before visual approval, render the application and inspect the cottage cutaway, bookshelf/laptop sightlines, bridge alignment, forward/reverse scrolling, direct links, replay, keyboard focus restoration, mobile reading controls and WebGL fallback. Save `about-desktop.png`, `about-mobile.png`, `home-to-about-transition.png` and `about-interaction.png` from the real browser in `artifacts/phase2/`. The building and explorer are procedural interim assets; physical-device GPU performance remains unmeasured. Future destinations remain upcoming.



### Run Phase 2



```powershell

cd C:\Users\madhu\Music\portfolio

npm run dev

```



Open the URL printed by Vite. Use its About navigation or append `/#about` to go directly to the sanctuary. For a fresh checkout, run `npm install` first.



```powershell

npm run build

npm run lint

npm test

npm run preview

```



The next step is browser visual and interaction review, not adding another destination.





### Phase 2.1 refinement



The transition now looks ahead along the existing connected bridge, framing its lanterns and destination cottage. Home camera endpoints and the shared Canvas remain unchanged. Cabin refinements reuse box geometry/materials for a projecting gable, fascia, timber braces, raised porch and balusters, monitor/code details and desk books. Selective flower pots, grass and tree placement frame the open studio. Existing petals provide restrained magical motion; no additional particle system or dependency was added. About controls have stronger contrast, bounded scrolling and centered dialogs.



Modified implementation files: `src/config/world.ts`, `src/animations/CameraRig.tsx`, `src/scenes/AboutScene/Cabin.tsx`, `src/scenes/AboutScene/AboutScene.tsx`, and `src/styles/about.css`.



Phase 2.1 supersedes the earlier incomplete browser-validation note above: actual Chrome desktop (1440 × 960) and mobile emulation (390 × 844) were rendered and inspected. Home/About navigation, forward/reverse scroll, direct #about, refresh, reduced-motion endpoint navigation, all three HTML interaction buttons, Escape dismissal and focus restoration passed. One Canvas remained mounted; no console errors or runtime exceptions were observed. Evidence is in `artifacts/phase21/{bridge,about,mobile,dialog}.png` and `results.json`. Production build, lint and all four regression tests pass.



Limitations: mobile panels intentionally scroll independently; physical-device performance and 3D pointer hit areas have not been measured. Mountains and procedural geometry remain stylized rather than matching the detailed reference exactly. Reduced-motion navigation was exercised, but frame-by-frame motion suppression was not instrumented. No new destination was implemented.





## Phase 3: The Skills Crystal Garden



The third destination extends the existing world beyond the developer cabin. Home and About geometry and their camera endpoints remain intact. The original explorer remains at Home; there is still one Canvas and one explorer.



### Environment and interaction



`SkillsScene` adds a faceted, vertex-colored central crystal above a three-tier stone dais, six category crystals with hover/selection illumination, rotating energy rings, floating fragments, an instanced lantern-lined stone path, cherry trees, selective pink grass, flowers, rocks and turquoise waterfalls. A shared scene light continues along the journey. One local non-shadow light and additive halos provide restrained illumination without postprocessing. Labels use local canvas-texture sprites instead of separate React roots or downloaded fonts. Generated textures and geometry are disposed on cleanup. Grass/path geometry uses instancing, and tablet/mobile density is reduced.



Each crystal opens the same compact native dialog as its corresponding HTML button. Enter/Space, Escape, focus restoration, pointer clicks and mobile touch are supported. Closing the dialog preserves scroll position. The desktop dialog sits beside the central crystal; mobile dialogs fit the viewport.



### Configuration and journey



Edit `portfolio.skills.categories` in `src/config/portfolio.ts`. All 23 proposed technologies are included in six categories. Each technology has an editable status, defaulting to **Not specified** so proficiency is not invented. Supported confirmed statuses are **Comfortable using**, **Project experience**, and **Currently learning**. No experience claims, percentages or certifications were added.



Scroll progress is measured in destination intervals: 0 = Home, 1 = About, 2 = Skills. `CameraRig` selects one of two cubic position/target curves and applies the existing damping, parallax and reduced-motion handling. The original Home-to-About controls are unchanged. The second curve starts exactly at the About pose; its smoothstep easing settles at both ends. The About scroll marker retains its original position. Hash navigation, history restoration, replay and section progress support all three destinations. Projects and later destinations remain upcoming.



### Files



Created:

- `src/scenes/SkillsScene/SkillsScene.tsx`

- `src/scenes/SkillsScene/SkillsPath.tsx`

- `src/scenes/SkillsScene/CrystalDetails.tsx`

- `src/components/ui/SkillsPanel.tsx`

- `src/styles/skills.css`



Modified:

- `src/app/App.tsx`, `src/app/main.tsx`

- `src/config/portfolio.ts`, `src/config/world.ts`

- `src/hooks/useWorldJourney.ts`, `src/utils/journey.ts`

- `src/animations/CameraRig.tsx`, `src/scenes/WorldScene.tsx`

- `src/components/layout/Navigation.tsx`

- `tests/world.test.mjs`, `README.md`



No dependencies were added. HomeScene, AboutScene, Cabin, Explorer and their existing style files were not modified for Phase 3.



### Validation and visual review



`npm run build`, `npm run lint`, and `npm test` pass (7 tests). Regression tests cover both route segments, endpoint preservation, reversible progress, reduced-motion destination selection and the six editable skill categories.



Actual headless Chrome testing rendered desktop 1440 x 960 and mobile 390 x 844 views. Home/About regression captures were inspected. Browser checks passed for both directions of navigation and scrolling, direct `/#skills`, refresh, all six categories via keyboard, all six 3D pointer targets, mobile HTML controls, a mobile crystal tap, Escape/focus restoration, a frozen reduced-motion camera and navigation to all three destinations. One Canvas and one explorer were observed, with no runtime exceptions or console errors. Temporary scene inspection instrumentation was removed after testing.



Evidence in `artifacts/phase3/`:

- `skills-desktop.png`

- `skills-mobile.png`

- `about-to-skills-transition.png`

- `skills-dialog.png`

- `home-regression.png`, `about-regression.png`

- `results.json` (full interaction results)



The desktop result was compared visually with the supplied Skills Crystal Hub concept. It retains pink/lavender/turquoise colors, a large central crystal surrounded by six satellites, a clear stone platform, planted island edges and a visible arrival path. The UI follows the approved portfolio's lighter glass panels, placed to the left to keep the crystal visible. Two visual passes improved faceting, foreground density and transition framing. It is a procedural interpretation, not a pixel-identical recreation: the reference has denser vegetation, stronger bloom, more intricate crystal surfaces and a character at the garden. The existing explorer was intentionally retained at Home without duplication. Physical-device GPU performance and cross-browser behavior remain to be measured; mobile testing used Chrome emulation. Confirm skill statuses before publishing.



Final smoke testing also inspected the 1024 x 768 tablet layout, confirmed no horizontal overflow on tablet/mobile, one Canvas, removal of the temporary scene probe, and no console errors. See artifacts/phase3/final-smoke.json and skills-tablet.png.







## Phase 3.1: Skills visual polish



The desktop Skills panel now uses a compact two-column category grid with refined type, spacing and proportions. All six controls fit without internal scrolling at the tested 1440 x 960 and 1366 x 768 sizes. Overflow remains available for smaller or zoomed viewports, and the existing mobile panel retains accessible scrolling.



The central crystal has stronger emissive facets and edge accents; energy rings have narrow translucent halos without postprocessing. Twelve static fragments were replaced with a single instanced mesh of 36 drifting fragments (18 at reduced density). Its local clock pauses under reduced motion. Instanced lavender flower beds, three decorative crystal clusters and redistributed foreground grass enrich the garden while leaving the approach open. Only the second segment's position/target controls changed to bring the destination closer during approach; Home and About camera endpoints and the original first route remain unchanged.



Files: added `src/scenes/SkillsScene/GardenAccents.tsx`; modified `src/scenes/SkillsScene/SkillsScene.tsx`, `src/styles/skills.css`, `src/config/world.ts`, and this README. The temporary browser scene probe was removed. No dependencies or later sections were added.



Validation: production build, lint and all seven regression tests pass. Actual Chrome checks passed Home/About/Skills navigation in both directions, forward/reverse scroll, direct Skills links and refresh, all six keyboard controls and 3D crystal clicks, Escape/focus restoration, mobile controls and crystal touch, desktop/laptop panel fit, and reduced-motion navigation. Camera coordinates and fragment instance matrices remained unchanged during the reduced-motion idle checks. No console errors were recorded. Desktop, laptop, mobile and transition captures were visually inspected.



Updated evidence is in `artifacts/phase31/`: `skills-desktop.png`, `skills-laptop.png`, `skills-mobile.png`, `skills-dialog.png`, `about-to-skills-transition.png`, and `results.json`. Physical-device GPU performance, other browsers and assistive-technology testing were not completed; mobile checks used Chrome emulation.





## Phase 4: Projects Floating Islands



The fourth destination extends the shared world beyond Skills. A central stone PROJECTS gateway and luminous platform connect to five smaller islands using instanced stone pathways. LandHub has a house and property plot, RideLink a car and route ring, Bike Rental a bicycle and booking display, Student Success AI bars and network nodes, and Bristo PM a task board. Trees, grass, flowers, crystals, lanterns and waterfalls reuse the existing environment primitives. Displays are abstract geometric representations, not screenshots or claims about the real applications. The water continues onto a second adjacent patch. No new dependencies, Canvas, explorer, camera controller or shadow lights were introduced.



### Data and attribution



`src/config/projects.ts` is the typed editable source for IDs, summaries, descriptions, technologies/methods, features, categories, contributions, status, repository/demo/documentation URLs and screenshot galleries. It uses the supplied project facts. LandHub, RideLink and Student Success AI retain group-project attribution; Bike Rental explicitly notes incomplete ownership documentation. Bristo PM is an academic case study, not deployed software. No model metrics or commercial claims were added. Links remain hidden while empty; galleries remain empty until real screenshots are supplied.



Still requiring confirmation: repository/demo/documentation URLs and screenshots for all projects; Bike Rental's exact individual ownership and deployment status; completion of LandHub integration and RideLink cross-service/live verification. Status text can be updated directly in the configuration when confirmed.



### Camera, navigation and interaction



Progress now spans 0=Home, 1=About, 2=Skills, 3=Projects. A third cubic position/target segment starts at the existing Skills endpoint. Earlier camera endpoints and geometry remain unchanged. Hash restore, scroll, reverse navigation, replay, section progress and reduced-motion destination snapshots include Projects. Upcoming destinations remain disabled via the existing upcoming dialog.



Each island supports hover response and selection. Five equivalent native HTML buttons provide keyboard/touch access to a compact scrolling native dialog. Dialogs contain confirmed stacks, features, contribution and status, support Escape, restore focus and preserve navigation progress. Mobile uses simplified vegetation and omits project-island waterfalls.



### Files



Created: `src/config/projects.ts`, `src/scenes/ProjectsScene/ProjectsScene.tsx`, `src/components/ui/ProjectsPanel.tsx`, `src/styles/projects.css`.



Modified: `src/config/world.ts`, `src/utils/journey.ts`, `src/hooks/useWorldJourney.ts`, `src/animations/CameraRig.tsx`, `src/scenes/WorldScene.tsx`, `src/components/layout/Navigation.tsx`, `src/app/App.tsx`, `src/app/main.tsx`, `tests/world.test.mjs`, and `README.md`.



### Validation and evidence



Build, lint and nine regression tests pass. Actual Chrome testing exercised direct #projects and refresh, all five 3D clicks and HTML keyboard controls, Escape/focus restoration, Skills-to-Projects scroll and reverse navigation, Home/About/Skills navigation, mobile touch selectors, reduced-motion navigation and a stationary reduced-motion camera. One Canvas, no horizontal mobile overflow and no runtime/console errors were observed. Screenshots were inspected and the initial water edge and label overlap were corrected; the gateway was raised to improve its visual priority. A temporary scene probe used for pointer/camera verification was removed after testing.



Evidence: `artifacts/phase4/projects-desktop.png`, `projects-mobile.png`, `skills-to-projects-transition.png`, `project-details-dialog.png`, and `results.json`.



The archipelago follows the supplied composition and pastel palette but remains less detailed and less bloom-heavy than the concept. Five islands are visible from the settled overview; small labels/miniatures are secondary to accessible HTML controls on mobile. The existing explorer stays at Home. Physical-device performance, assistive-technology and cross-browser checks remain outstanding. No later sections were implemented.


## Phase 4.1: Projects visual polish

Modified `src/scenes/ProjectsScene/ProjectsScene.tsx`, `src/styles/projects.css`, `src/config/world.ts`, and this README. The five islands now have extra blossom trees, flowers, crystals, rocks and lanterns, larger project miniatures, darker schematic displays and one title each. A segmented stone arch with emissive edging replaces the rectangular gateway. Existing environment primitives, shared box geometry/materials and instanced paths are reused; no dependencies or postprocessing were added.

Only Projects destination camera poses changed. Home, About and Skills poses, the shared Canvas, camera controller, project data and navigation remain intact. Desktop selectors use a compact two-column grid; small screens retain accessible scrolling.

Validation: `npm run build`, `npm run lint`, and all nine `npm test` regression tests passed. Headless Chrome checks passed all four destinations, forward/reverse travel and scroll, direct Projects links and refresh, all five 3D clicks, keyboard activation/Escape/focus restoration, mobile touch selectors, and reduced-motion navigation with a stationary camera. Desktop 1440x960 and laptop 1366x768 panels fit without internal scrolling. No horizontal overflow was observed at those sizes or mobile 390x844. No console/runtime errors were recorded. The temporary scene probe was removed and a final browser smoke check confirmed one Canvas and no exposed probe.

Screenshots in `artifacts/phase41/`: `projects-desktop.png`, `projects-laptop.png`, `projects-mobile.png`, `project-details-dialog.png`, and `skills-to-projects-transition.png`. Captures were visually inspected against the previous implementation and supplied concept. Browser results are in `results.json`, `final-smoke.json`, and `reverse-scroll.json`.

Remaining limitations: the procedural scenery is less detailed than the artistic concept; dashboards are schematic, not application screenshots. Mobile miniatures and labels are small, with HTML selectors providing access. Physical-device GPU performance, screen-reader and cross-browser testing remain outstanding. No Phase 5 work was implemented.


## Phase 5: Developer Journey

The fifth destination continues from Projects into an ascending S-shaped trail of six floating milestone islands. Instanced stepping stones and a thin luminous ribbon join the islands. Each monument has a distinct physical sculpture: an open book and spark, a code terminal, application layers, an AI network, service racks, and the future crystal. Blossom trees, pink grass, lavender flowers, lanterns, rocks, waterfalls and drifting crystal particles reuse the existing landscape style. The geometry is procedural; no flat scene artwork, new dependencies, extra Canvas, shadow lights or postprocessing were added.

### Content and interactions

`src/config/journey.ts` defines six typed, editable narrative chapters with IDs, titles, subtitles, descriptions, categories, technology lists, optional dates/project references, icons and visual themes. No dates, awards, certifications or employment claims are supplied. LandHub and RideLink retain group attribution; the AI chapter refers to academic model development and evaluation. The final chapter is explicitly future learning goals.

Six native HTML buttons mirror the six selectable 3D monuments. Pointer hover gives restrained glow/scale feedback. Native modal dialogs use the existing interaction pattern, with labelled content, Escape closing and focus restoration. Mobile selectors remain scrollable and touch-friendly; desktop/laptop use a compact two-column grid.

### Camera and integration

Progress now spans 0=Home through 4=Journey. One new cubic position/target segment starts at the unchanged Projects endpoint in the existing CameraRig. The new approach target was refined after inspecting Chrome captures to show Journey earlier. Previous camera endpoints and Home/About/Skills/Projects scene implementations remain unchanged. The existing shadow light continues following the route; reduced motion uses destination snapshots and freezes idle movement.

Journey is enabled in the existing navigation. Scroll travel, reverse travel, direct `/#journey`, refresh and replay include the new destination. Terminal and Contact stay upcoming. The former page-root `journey` ID was renamed to `portfolio-world` so the new scroll marker has a unique ID. The location indicator now shows 05 / 07 at Journey.

### Files

Created:
- `src/config/journey.ts`
- `src/scenes/JourneyScene/JourneyScene.tsx`
- `src/components/ui/JourneyPanel.tsx`
- `src/styles/journey.css`

Modified:
- `src/config/world.ts`
- `src/utils/journey.ts`
- `src/hooks/useWorldJourney.ts`
- `src/animations/CameraRig.tsx`
- `src/scenes/WorldScene.tsx`
- `src/components/layout/Navigation.tsx`
- `src/app/App.tsx`
- `src/app/main.tsx`
- `tests/world.test.mjs`
- `README.md`

### Validation and evidence

Headless Chrome checks passed direct Journey links and refresh, all five destinations, forward/reverse scroll and navigation, six 3D selections, six keyboard controls, dialog focus containment/restoration, six mobile touch selectors and reduced-motion navigation. Camera coordinates and particle matrices remained stationary in reduced motion. Desktop 1440x960 and laptop 1366x768 selectors fit without internal scrolling. Mobile was tested at 390x844. No console/runtime errors were recorded. Browser checks and raw results live in `artifacts/phase5/results.json`; final checks after removing the temporary scene probe are recorded in `final-smoke.json`.

Screenshots in `artifacts/phase5/`: `journey-desktop.png`, `journey-laptop.png`, `journey-mobile.png`, `projects-to-journey-transition.png`, and `journey-milestone-dialog.png`. Additional regression and tablet captures are kept alongside these. The desktop composition was compared with the supplied Journey artwork and refined while retaining the established implementation palette.

Remaining limitations: the procedural environment is less detailed than the artistic concept. Small mobile monuments are supported by readable HTML selectors. The explorer remains in its existing Home location. Physical-device GPU performance, screen-reader testing and other browsers have not been verified. Terminal, Music, Easter Eggs and Contact were not implemented in this phase.


Final validation: `npm run build`, `npm run lint`, and all 12 `npm test` tests passed. After probe removal, Chrome also passed all 3 About, 6 Skills and 5 Projects HTML interactions, tablet 1024x900 layout, normal-motion mobile Projects/Journey navigation and overflow checks at laptop/tablet/mobile sizes. Final desktop, mobile and tablet captures were inspected; one WebGL Canvas remains and no runtime/console errors were observed.


## Phase 5.1: Journey environment refinement

This is a focused refinement of the existing Journey. Milestone data, numbering, order, dialog content, navigation and all earlier environments are unchanged. No new section or dependency was added.

### Composition

Journey retains the existing 43-degree field of view and authoritative CameraRig. Only Journey endpoints changed; all preceding poses and every transition control point remain unchanged.

| Layout | Previous position / target | Phase 5.1 position / target |
| --- | --- | --- |
| Desktop/laptop | `[136,15,-29]` / `[118,3,-63]` | `[132,13,-35]` / `[117,3.5,-63]` |
| Mobile | `[132,16,-27]` / `[123,3,-63]` | `[130,14,-31]` / `[122,3.5,-63]` |
| Tablet, 761–1100px | Used the desktop endpoint | `[135,15,-27]` / `[115.5,3.5,-63]` |

The closer three-quarter desktop view makes the islands and monuments larger while retaining the future crystal and winding route. Tablet uses its own Journey endpoint to leave room for the information panel. Existing aspect compensation, easing, reverse travel and reduced-motion behavior are retained. A Journey-only desktop wash adjustment clears the first monument while keeping the pale panel backing; mobile styles and panel layout are unchanged.

### Monuments, path and atmosphere

Monuments now have tiered bases with illuminated insets, stronger dark/lavender contrast and larger numbered labels. The book, application layers and service racks have stronger proportions. The future crystal has a larger silhouette and no hexagonal backing. Server accents were moved onto the front of their enlarged geometry after visual inspection. Lanterns were moved away from labels.

The original route and connection points remain. Two restrained lavender/pink edge ribbons replace the centre stripe. Stepping stones have slight size variation and use 110 instances rather than 125. Shared tree positions/scales vary around each island. Instanced mushrooms add small ground details in two draw calls. Existing particle instances now include slow flattened petals; their matrices stop updating while reduced motion is active. Flower and vegetation quality reductions remain in place. Waterfall tops and heights were aligned with the island rims and the existing water level, retaining the shared turquoise flow shader.

Lighting changes are confined to Journey material balance and emissive accents. The existing pink sunlight, lavender fill, fog and shadow system are reused unchanged. No extra lights or bloom were introduced.

### Complete source-file changes

Modified:
- `src/scenes/JourneyScene/JourneyScene.tsx` — monuments, labels, path edges, vegetation, mushrooms, petals and local materials.
- `src/config/world.ts` — Journey desktop/mobile endpoints and separate tablet endpoint.
- `src/animations/CameraRig.tsx` — selects the tablet endpoint only for the Journey segment.
- `src/styles/journey.css` — Journey-only desktop scene-wash contrast.
- `README.md` — this report.

No production source files were created. `WorldScene.tsx` briefly exposed a test probe for browser measurements; it was restored before final validation. Existing milestone and project configurations, panels, dialogs, navigation, scroll logic and regression tests were not changed.

### Evidence and limitations

Actual Chrome evidence is in `artifacts/phase51/`: `journey-desktop.png`, `journey-laptop.png`, `journey-mobile.png`, `journey-tablet.png`, `projects-to-journey-transition.png`, `journey-milestone-dialog.png`, and `home-regression.png`. `journey-before.png` preserves the Phase 5 desktop capture; `comparison.html` displays it beside the final Phase 5.1 render. Browser scripts and JSON reports are retained in the same ignored artifacts directory.

The procedural result remains less detailed than the artistic reference. On mobile, small 3D labels are complemented by the accessible HTML selectors. Physical-device GPU performance, screen readers and non-Chrome browsers remain untested. No Phase 6 work was implemented.


Final Phase 5.1 validation: `npm run build`, `npm run lint`, and all 12 `npm test` tests passed after the tablet correction. Actual headless Chrome checks passed direct Journey links/refresh; all five destinations; forward/reverse scrolling and navigation; all six 3D clicks, keyboard controls, focus containment/restoration and touch selectors; and reduced-motion navigation with stationary camera/particle matrices. Final checks also passed all 3 About, 6 Skills and 5 Projects HTML controls. Viewports inspected: desktop 1440x960, laptop 1366x768, tablet 1024x900 and mobile 390x844. The tablet was pulled back after visual inspection exposed a clipped island; its corrected capture and `tablet-recheck.json` confirm the settled view and no overflow. No unexpected console/runtime errors or horizontal overflow were observed. Results are in `results.json`, `final-smoke.json`, and `tablet-recheck.json`. Final captures and the before/after comparison were visually inspected. The test probe is absent from the delivered source.



## Phase 6: The Developer's Terminal

The Neon Observatory is the sixth destination in the existing world. A curved, lantern-lined stone path connects the final Journey island to a lavender workstation island, with blossom trees, pink grass, flowers, crystals, a waterfall, floating code panels and restrained energy rings. The desk, chair, keyboard and monitor are procedural geometry. Monitor lettering uses a texture aligned to its surface; command input and output remain accessible HTML.

### Architecture and camera

The existing Canvas, CameraRig, sunlight, environment primitives and adaptive-quality system are reused. Progress now spans 0–5. A fifth cubic camera position/target segment joins the unchanged Journey endpoint to Terminal, with desktop, tablet and mobile framing. All five earlier destination poses remain unchanged. The new look-at controls were refined after Chrome screenshots showed the approaching workstation at the viewport edge. Forward/reverse scrolling, navigation, hash restoration, replay and the 06 / 07 indicator include Terminal. Contact remains upcoming.

Keyboard keys, path stones and particles are instanced. Shared geometry/materials limit allocations. Particle counts drop from 32 to 16 and vegetation density decreases on smaller/adaptive-quality views. No dependencies, postprocessing, additional shadow lights or camera controllers were added. Frame-loop animation uses refs; command processing is independent of the render loop. Textures and path geometry have disposal cleanup. Reduced motion stops ambient animation and retains the established camera snapshots.

### Commands and content

`src/utils/terminal.ts` is a pure, typed allowlist with injected portfolio context. Commands cannot execute JavaScript, HTML, operating-system commands or network requests. React renders output as text. Input is limited to 512 characters, output to 80 entries and history to 50 commands.

| Command | Behavior |
| --- | --- |
| `help` | Lists all 13 commands. |
| `about`, `whoami` | Existing introduction and identity. |
| `skills` | Existing categories and technology names. |
| `projects` | Five existing titles and summaries, preserving attribution. |
| `journey` | Six existing narrative milestones. |
| `contact` | Configured email/GitHub/LinkedIn; explicitly reports unconfigured details when empty. |
| `clear` | Clears output and announces the change. |
| `date` | Visitor's current local date using Intl formatting. |
| `theme` | Lists themes; `theme pastel` and `theme midnight` change only the terminal panel. |
| `echo <text>` | Prints literal text, including markup characters. |
| `neofetch` | ASCII profile with configuration-derived counts. |
| `secret` | Configured hidden message and a gentle five-second crystal halo; text only in reduced motion. |

Command/theme names are case-insensitive. Unknown commands provide a help hint. Theme choice is validated and persisted in `ashan-terminal-theme-v1`; unavailable storage is handled safely. No personal links or career claims were invented. Welcome, introduction and secret copy are editable in `portfolio.terminal`.

### Accessibility and responsive behavior

The labelled input supports Enter and Up/Down history with draft restoration. Output is a keyboard-focusable, scrollable polite live log. Quick commands and Focus terminal provide keyboard/touch access. Clicking the workstation focuses the same field with `preventScroll`, without initiating a camera move. Hidden controls are inert. A clear button, focus feedback and theme toggle remain available without precise WebGL interaction. No input autofocus opens a mobile keyboard unexpectedly.

Desktop/laptop place the panel beside the workstation. Tablet reduces scenery and uses its own camera endpoint. Mobile reserves separate interface/scene rows, a 16px input and 44px quick commands. Short screens retain panel scrolling with compact spacing. Earlier section styles and content are unchanged.

### Source files

Created:
- `src/scenes/TerminalScene/TerminalScene.tsx` — observatory, approach, workstation and secret effect.
- `src/components/ui/TerminalPanel.tsx` — command interface, history and theme persistence.
- `src/utils/terminal.ts` — command registry and history helper.
- `src/styles/terminal.css` — layout, themes and extended scroll marker.

Modified:
- `src/config/portfolio.ts` — Terminal copy and optional empty email field.
- `src/config/world.ts` — Terminal location and camera controls/endpoints.
- `src/utils/journey.ts`, `src/hooks/useWorldJourney.ts` — sixth destination, stages, hash and replay.
- `src/animations/CameraRig.tsx` — new segment in the existing controller.
- `src/scenes/WorldScene.tsx` — scene integration and existing sun's extended route.
- `src/components/layout/Navigation.tsx` — enabled Terminal.
- `src/app/App.tsx`, `src/app/main.tsx` — panel, callbacks, indicator, marker and stylesheet.
- `tests/world.test.mjs` — five new command/history/route tests and updated final progress bound.
- `README.md` — this report; normalized six legacy Windows-encoded punctuation bytes to UTF-8.

### Validation and screenshots

`npm run build`, `npm run lint` and all 17 `npm test` tests pass. Tests cover configured facts, unsupported commands, literal text, history bounds/drafts, themes, clear, secret, local dates and route continuity.

Actual headless Chrome testing passed 58 checks in `artifacts/phase6/results.json`: all six destination links, direct Terminal and refresh, forward/reverse scroll, all commands, unknown input, literal markup, history, clear, persisted themes, keyboard focus/tab access, 3D workstation focus, secret reset/no replay, reduced-motion navigation with frozen camera/particle matrices, and mobile touch/input/navigation. No console/runtime errors were recorded. The temporary camera/3D test probe was removed afterward.

Final corrected captures and 40 smoke checks are recorded in `final-smoke.json`, including all 3 About, 6 Skills, 5 Projects and 6 Journey HTML interactions. Laptop, tablet, mobile and compact mobile showed no horizontal overflow and accepted input. Captures were rendered in Chrome and visually inspected.

Screenshots in `artifacts/phase6/`:
- `terminal-desktop.png` — 1440×960.
- `terminal-laptop.png` — 1366×768.
- `terminal-mobile.png` — 390×844.
- `journey-to-terminal-transition.png`.
- `terminal-commands.png`.
- `terminal-midnight-theme.png`.
- `terminal-easter-egg.png`.
- `terminal-tablet.png` — 1024×900.
- `terminal-mobile-small.png` — 360×640.

Remaining limitations: no finalized Terminal concept asset was available in the supplied attachments/repository, so the implementation follows the written brief and established procedural pastel world. Geometry remains simpler than the earlier artistic concepts. Chrome mobile emulation verifies touch and input but does not reproduce a physical phone's software keyboard; physical-device GPU performance, screen readers and other browsers remain untested. Contact and the existing soundtrack placeholder remain unfinished by design.
