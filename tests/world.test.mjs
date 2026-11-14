import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { Buffer } from 'node:buffer'
import { URL } from 'node:url'
import ts from 'typescript'
import { CubicBezierCurve3, Vector3 } from 'three'

// Load pure TypeScript configuration/math without adding a test runner dependency.
async function sourceModule(path) {
  const source = await fs.readFile(new URL(path, import.meta.url), 'utf8')
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } })
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`)
}
const { journeyProgress, journeyStage, cameraProgress } = await sourceModule('../src/utils/journey.ts')
const { world } = await sourceModule('../src/config/world.ts')
const { portfolio } = await sourceModule('../src/config/portfolio.ts')

test('scroll progress is viewport-independent, clamped and reversible', () => {
  for (const height of [568, 768, 960]) {
    const destination = height * 1.9
    for (const fraction of [0, .25, .5, .75, 1]) assert.ok(Math.abs(journeyProgress(destination * fraction, destination) - fraction) < 1e-10)
  }
  assert.equal(journeyProgress(-100, 1000), 0)
  assert.equal(journeyProgress(2000, 1000), 1)
  assert.equal(journeyProgress(0, 0), 0)
  assert.deepEqual([0, .4, 1, .4, 0].map(journeyStage), ['home', 'travel', 'about', 'travel', 'home'])
})
test('reduced motion uses destination snapshots, with both destinations reachable', () => {
  assert.equal(cameraProgress(.2, true), 0)
  assert.equal(cameraProgress(.8, true), 1)
  assert.equal(cameraProgress(.42, false), .42)
})
test('camera route retains the approved Home framing and reaches About continuously', () => {
  assert.deepEqual(world.cameras.desktop.home, [8, 6.7, 24])
  assert.deepEqual(world.cameras.desktop.homeTarget, [0, 1.6, 0])
  for (const shot of Object.values(world.cameras)) {
    const curve = new CubicBezierCurve3(new Vector3(...shot.home), new Vector3(...shot.controls[0]), new Vector3(...shot.controls[1]), new Vector3(...shot.about))
    assert.deepEqual(curve.getPoint(0).toArray(), [...shot.home])
    assert.deepEqual(curve.getPoint(1).toArray(), [...shot.about])
    let previous = curve.getPoint(0)
    for (let step = 1; step <= 100; step++) {
      const point = curve.getPoint(step / 100)
      assert.ok(point.distanceTo(previous) < 1, 'no discontinuity in the configured flight path')
      previous = point
    }
  }
})
test('all three cabin interactions have centralized, distinct accessible content', () => {
  assert.equal(portfolio.about.heading, 'Behind the Code')
  assert.deepEqual(portfolio.about.areas.map(area => area.id), ['laptop', 'bookshelf', 'crystal'])
  for (const area of portfolio.about.areas) {
    assert.ok(area.object && area.dialogTitle && area.detail && area.items.length)
  }
})


test('three destinations remain ordered and reversible across both travel segments', () => {
  assert.deepEqual([0, .5, 1, 1.5, 2, 1.5, 1, .5, 0].map(journeyStage), ['home', 'travel', 'about', 'travel', 'skills', 'travel', 'about', 'travel', 'home'])
  assert.equal(journeyProgress(3800, 1900, 2), 2)
  assert.equal(journeyProgress(9999, 1900, 2), 2)
  assert.deepEqual([0, .49, .51, 1.49, 1.51, 2].map(p => cameraProgress(p, true)), [0, 0, 1, 1, 2, 2])
})
test('the new camera segment joins the unchanged cabin pose in both layouts', () => {
  assert.deepEqual(world.cameras.desktop.about, [46, 7.5, 5])
  assert.deepEqual(world.cameras.desktop.aboutTarget, [32.5, 2.1, -12])
  for (const shot of Object.values(world.cameras)) {
    for (const [start, controls, end] of [[shot.about, shot.skillsControls, shot.skills], [shot.aboutTarget, shot.skillsTargetControls, shot.skillsTarget]]) {
      const curve = new CubicBezierCurve3(new Vector3(...start), new Vector3(...controls[0]), new Vector3(...controls[1]), new Vector3(...end))
      assert.deepEqual(curve.getPoint(0).toArray(), [...start])
      assert.deepEqual(curve.getPoint(1).toArray(), [...end])
      for (let i = 1; i <= 100; i++) assert.ok(curve.getPoint(i / 100).distanceTo(curve.getPoint((i - 1) / 100)) < 1)
    }
  }
})
test('six editable categories include all proposed technologies without invented proficiency', () => {
  const categories = portfolio.skills.categories
  assert.deepEqual(categories.map(c => c.id), ['frontend', 'backend', 'databases', 'tools', 'ai', 'mobile'])
  assert.equal(categories.flatMap(c => c.technologies).length, 23)
  for (const c of categories) {
    assert.ok(c.description && c.title && c.color)
    for (const technology of c.technologies) assert.equal(technology.status, 'Not specified')
  }
})


test('Projects extends the journey without changing Skills endpoints', () => {
 assert.deepEqual(world.cameras.desktop.skills, [70, 8, -7])
 assert.deepEqual([2,2.5,3,2.5,2].map(journeyStage), ['skills','travel','projects','travel','skills'])
 assert.equal(cameraProgress(2.8,true),3)
 assert.equal(journeyProgress(5700,1900,3),3)
 for(const shot of Object.values(world.cameras)) {
  const curve=new CubicBezierCurve3(new Vector3(...shot.skills),new Vector3(...shot.projectsControls[0]),new Vector3(...shot.projectsControls[1]),new Vector3(...shot.projects))
  assert.deepEqual(curve.getPoint(0).toArray(),[...shot.skills])
  assert.deepEqual(curve.getPoint(1).toArray(),[...shot.projects])
 }
})
test('Current project data preserves the configured portfolio and unconfigured links', async () => {
 const {projects}=await sourceModule('../src/config/projects.ts')
 assert.deepEqual(projects.map(p=>p.id),['gym-management','food-ordering-web','ctms','ai-clothing-shop','ageios-ai','food-ordering-mobile'])
 for(const p of projects){assert.ok(p.title&&p.description&&p.contribution&&p.status);assert.equal(p.github,'');assert.equal(p.demo,'');assert.deepEqual(p.gallery,[])}
 assert.deepEqual(projects.find(p=>p.id==='ageios-ai').technologies,[])
 assert.match(projects.find(p=>p.id==='ageios-ai').description,/confirmed/)
})

test('Journey is reachable in both directions without extending the Projects stage', () => {
 assert.deepEqual([3,3.15,3.5,3.85,4,3.5,3].map(journeyStage), ['projects','projects','travel','journey','journey','travel','projects'])
 assert.equal(journeyProgress(7600,1900,4),4)
 assert.equal(journeyProgress(99999,1900,4),4)
 assert.deepEqual([3.2,3.8,4,99].map(p=>cameraProgress(p,true)),[3,4,4,6])
})
test('Journey camera starts at unchanged Projects poses and stays continuous', () => {
 assert.deepEqual(world.cameras.desktop.projects,[97,12,-16])
 assert.deepEqual(world.cameras.desktop.projectsTarget,[85.5,2.7,-43])
 assert.deepEqual(world.cameras.mobile.projects,[95,12,-13])
 assert.deepEqual(world.cameras.mobile.projectsTarget,[90,2.3,-43])
 for(const shot of Object.values(world.cameras)){
  for(const [start,controls,end] of [[shot.projects,shot.journeyControls,shot.journey],[shot.projectsTarget,shot.journeyTargetControls,shot.journeyTarget]]){
   const curve=new CubicBezierCurve3(new Vector3(...start),new Vector3(...controls[0]),new Vector3(...controls[1]),new Vector3(...end))
   assert.deepEqual(curve.getPoint(0).toArray(),[...start])
   assert.deepEqual(curve.getPoint(1).toArray(),[...end])
   for(let i=1;i<=100;i++)assert.ok(curve.getPoint(i/100).distanceTo(curve.getPoint((i-1)/100))<1)
  }
 }
})
test('Six narrative milestones preserve project references and omit unconfirmed dates', async () => {
 const {milestones}=await sourceModule('../src/config/journey.ts')
 const {projects}=await sourceModule('../src/config/projects.ts')
 assert.equal(milestones.length,6)
 assert.equal(new Set(milestones.map(m=>m.id)).size,6)
 for(const m of milestones){
  assert.equal(m.date,undefined)
  assert.ok(m.title&&m.subtitle&&m.description&&m.category&&m.icon&&m.theme.color)
  for(const id of [...(m.relatedProjects??[]),...(m.relatedProject?[m.relatedProject]:[])])assert.ok(projects.some(p=>p.id===id))
 }
 assert.deepEqual(milestones.map(m=>m.id),['beginning','foundations','applications','intelligence','systems','ahead'])
 assert.match(milestones[2].description,/MERN/)
 assert.deepEqual(milestones[2].relatedProjects,['gym-management','food-ordering-web','ctms'])
 assert.deepEqual(milestones[3].relatedProjects,['ai-clothing-shop','ageios-ai'])
 assert.match(milestones[3].description,/recommendations/)
 assert.equal(milestones[4].relatedProject,'food-ordering-mobile')
 assert.deepEqual(milestones[4].technologies.slice(0,2),['React Native','Expo'])
 assert.equal(milestones[4].icon,'mobile')
 assert.equal(milestones[5].category,'Future Learning Goals')
})

test('Terminal extends the existing route while preserving Journey poses', () => {
 assert.deepEqual(world.cameras.desktop.journey,[132,13,-35])
 assert.deepEqual(world.cameras.desktop.journeyTarget,[117,3.5,-63])
 assert.deepEqual(world.cameras.mobile.journey,[130,14,-31])
 assert.deepEqual(world.journeyTablet.position,[135,15,-27])
 assert.deepEqual([4,4.15,4.5,4.85,5,4.5,4].map(journeyStage),['journey','journey','travel','terminal','terminal','travel','journey'])
 assert.equal(journeyProgress(9500,1900,5),5)
 assert.equal(cameraProgress(4.8,true),5)
 for(const shot of Object.values(world.cameras)){
  for(const [start,controls,end] of [[shot.journey,shot.terminalControls,shot.terminal],[shot.journeyTarget,shot.terminalTargetControls,shot.terminalTarget]]){
   const curve=new CubicBezierCurve3(new Vector3(...start),new Vector3(...controls[0]),new Vector3(...controls[1]),new Vector3(...end))
   assert.deepEqual(curve.getPoint(0).toArray(),[...start]);assert.deepEqual(curve.getPoint(1).toArray(),[...end])
   for(let i=1;i<=100;i++)assert.ok(curve.getPoint(i/100).distanceTo(curve.getPoint((i-1)/100))<1)
  }
 }
})
const {executeCommand,historyEntry,commandDescriptions}=await sourceModule('../src/utils/terminal.ts')
const {projects:terminalProjects}=await sourceModule('../src/config/projects.ts')
const {milestones:terminalMilestones}=await sourceModule('../src/config/journey.ts')
const terminalContext={name:portfolio.name,introduction:portfolio.about.introduction,skills:portfolio.skills.categories,projects:terminalProjects,milestones:terminalMilestones,contacts:[{label:'GitHub',value:portfolio.github}],secret:portfolio.terminal.secret,now:new Date(2026,10,13,12),locale:'en-US'}

test('Terminal allowlist implements all requested commands using configured data',()=>{
 for(const name of ['help','about','skills','projects','journey','contact','whoami','clear','date','theme','echo','neofetch','secret'])assert.ok(Object.hasOwn(commandDescriptions,name))
 for(const command of Object.keys(commandDescriptions))assert.ok(Array.isArray(executeCommand(command,terminalContext).lines))
 assert.equal(executeCommand(' ABOUT ',terminalContext).lines[0],portfolio.about.introduction)
 assert.deepEqual(executeCommand('projects',terminalContext).lines,terminalProjects.map(p=>p.title+' — '+p.summary))
 assert.equal(executeCommand('journey',terminalContext).lines.length,6)
 assert.match(executeCommand('skills',terminalContext).lines.join(' '),/Java/)
 assert.match(executeCommand('contact',terminalContext).lines[0],/not been configured/)
 assert.equal(executeCommand('contact',{...terminalContext,contacts:[{label:'Email',value:'example@example.test'}]}).lines[0],'Email: example@example.test')
 assert.match(executeCommand('whoami',terminalContext).lines[0],/Ashan/)
 assert.ok(executeCommand('neofetch',terminalContext).lines.join(' ').includes(`${terminalProjects.length} portfolio projects`))
})
test('Terminal rejects unsupported execution and preserves echo as literal text',()=>{
 for(const command of ['__proto__','constructor','rm -rf /','help; alert(1)','<script>alert(1)</script>'])assert.equal(executeCommand(command,terminalContext).error,true)
 const payload='<img src=x onerror=alert(1)> & $(whoami)'
 assert.equal(executeCommand('echo '+payload,terminalContext).lines[0],payload)
 assert.deepEqual(executeCommand('  ',terminalContext).lines,[])
 assert.equal(executeCommand('x'.repeat(513),terminalContext).error,true)
})
test('Terminal clear, theme, secret and local date have explicit results',()=>{
 assert.equal(executeCommand('clear',terminalContext).action,'clear')
 assert.deepEqual(executeCommand('clear',terminalContext).lines,[])
 assert.equal(executeCommand('theme MIDNIGHT',terminalContext).theme,'midnight')
 assert.equal(executeCommand('theme pastel',terminalContext).theme,'pastel')
 assert.equal(executeCommand('theme invalid',terminalContext).error,true)
 assert.match(executeCommand('theme',terminalContext).lines[0],/pastel, midnight/)
 assert.equal(executeCommand('secret',terminalContext).action,'secret')
 assert.equal(executeCommand('secret',terminalContext).lines[0],portfolio.terminal.secret)
 assert.equal(executeCommand('date',terminalContext).lines[0],new Intl.DateTimeFormat('en-US',{dateStyle:'full'}).format(terminalContext.now))
})
test('Terminal history clamps boundaries and restores an unfinished draft',()=>{
 const h=['help','projects']
 assert.deepEqual(historyEntry(h,2,-1,'draft'),{cursor:1,value:'projects'})
 assert.deepEqual(historyEntry(h,0,-1,'draft'),{cursor:0,value:'help'})
 assert.deepEqual(historyEntry(h,1,1,'draft'),{cursor:2,value:'draft'})
 assert.deepEqual(historyEntry([],0,-1,'draft'),{cursor:0,value:'draft'})
})

const {validateContact,contactLinks,emailDraftLink,copyContactEmail}=await sourceModule('../src/utils/contact.ts')
const {contact}=await sourceModule('../src/config/contact.ts')
test('Contact extends the route without changing Terminal endpoints',()=>{
 assert.deepEqual(world.cameras.desktop.terminal,[165,12,-62]);assert.deepEqual(world.cameras.desktop.terminalTarget,[148,4,-84])
 assert.deepEqual(world.cameras.mobile.terminal,[160,12,-59]);assert.deepEqual(world.cameras.mobile.terminalTarget,[154,3,-84])
 assert.deepEqual(world.terminalTablet.position,[167,14,-59])
 assert.deepEqual([5,5.15,5.5,5.85,6,5.5,5].map(journeyStage),['terminal','terminal','travel','contact','contact','travel','terminal'])
 assert.equal(journeyProgress(11400,1900,6),6);assert.equal(cameraProgress(5.8,true),6)
 for(const shot of Object.values(world.cameras))for(const [start,controls,end]of [[shot.terminal,shot.contactControls,shot.contact],[shot.terminalTarget,shot.contactTargetControls,shot.contactTarget]]){
  const curve=new CubicBezierCurve3(new Vector3(...start),new Vector3(...controls[0]),new Vector3(...controls[1]),new Vector3(...end))
  assert.deepEqual(curve.getPoint(0).toArray(),[...start]);assert.deepEqual(curve.getPoint(1).toArray(),[...end])
  for(let i=1;i<=100;i++)assert.ok(curve.getPoint(i/100).distanceTo(curve.getPoint((i-1)/100))<1)
 }
})
test('Contact hides missing and unsafe destinations',()=>{
 assert.deepEqual(contactLinks('',[{label:'GitHub',url:''},{label:'Unsafe',url:'javascript:alert(1)'}]),{email:'',socials:[]})
 assert.equal(contactLinks('hello@example.test',[{label:'Profile',url:'https://example.test/me'}]).socials.length,1)
 assert.equal(contactLinks('bad\naddress@example.test',[]).email,'')
 assert.equal(emailDraftLink(''),null)
 const href=emailDraftLink('hello@example.test',{name:'A & B',email:'visitor@example.test',message:'Hello? &bcc=not-a-recipient'})
 assert.ok(href.startsWith('mailto:hello%40example.test?subject='));assert.ok(!href.includes('&bcc='))
})
test('Contact validates required fields, email and length without delivery',()=>{
 assert.deepEqual(Object.keys(validateContact({name:' ',email:'',message:''})),['name','email','message'])
 assert.ok(validateContact({name:'Test',email:'bad',message:'hello'}).email)
 assert.ok(validateContact({name:'x'.repeat(81),email:'a@example.test',message:'x'.repeat(3001)}).message)
 assert.deepEqual(validateContact({name:'Visitor',email:'visitor@example.test',message:'A new idea'}),{})
 assert.equal(contact.delivery,'unconfigured')
 assert.equal(contact.closing,'Thank you for exploring my world. The next adventure starts with a hello.')
})
test('Email copying reports success only after clipboard resolves',async()=>{
 let copied='';assert.equal(await copyContactEmail('hello@example.test',async text=>{copied=text}),'Email copied.');assert.equal(copied,'hello@example.test')
 assert.match(await copyContactEmail('',async()=>{throw Error('must not run')}),/not configured/)
 assert.match(await copyContactEmail('hello@example.test',undefined),/Clipboard unavailable/)
 assert.match(await copyContactEmail('hello@example.test',async()=>{throw Error('denied')}),/Could not copy/)
})
