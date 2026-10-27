'use strict';

// The workbook is self-contained so it can also be opened directly from file://.
// Its checklist records personal tracking, never measured product capability.
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const STORAGE_KEY = 'tactile-world-preparation-v1';
const SNAPSHOT = '2026-10-26';

const gates = [
  {id:'rig',title:'Build a repeatable contact rig',scope:'Physical setup',body:'Secure the sensor opposite a translation stage or screw-driven slide. Use known sphere, cylinder, and blunt-edge geometries. Include a normal-force load cell if force is a target claim.',proof:'Repeated indentation and release with independently measured displacement and force.',dependency:'First confirm the sensor type, physical access, and safe measurement range.'},
  {id:'recording',title:'Record synchronized real measurements',scope:'Measurement',body:'Save sensor frames, timestamps, stage motion, force, sensor ID, object geometry, and calibration version. Separate calibration recordings from reserved evaluation recordings.',proof:'Replayable recordings with documented units, synchronization error, and provenance.',dependency:'Requires the rig and a verified acquisition clock.'},
  {id:'contact-model',title:'Implement contact mechanics and sensor response',scope:'Prototype',body:'Model normal contact, deformation, and force. Render the resulting optical response for one sensor. Keep mechanics state separate from the renderer; add shear only when validated.',proof:'Object motion produces internally consistent force, deformation, and tactile output.',dependency:'Requires geometry and calibration measurements; no completed engine is claimed here.'},
  {id:'heldout',title:'Compare against reserved physical contacts',scope:'Validation',body:'Replay measured physical motion in simulation. Freeze calibration first. Evaluate new trajectories and at least one reserved geometry, reporting force and observable contact/image errors.',proof:'A side-by-side sequence and error report that include representative failures.',dependency:'Requires recorded data and a fixed model; evaluation contacts cannot be tuning data.'},
  {id:'benchmark',title:'Measure speed at a stated fidelity',scope:'Performance',body:'Measure full-step throughput and latency separately from rendering throughput. State GPU, image resolution, number of sensors, batch size, warmup, timing method, and memory.',proof:'A reproducible command and a matched comparison with a simpler or existing simulator.',dependency:'Requires a fixed evaluation workload. Neither 500 FPS nor 1,000 Hz is assumed.'},
  {id:'api',title:'Package a runnable Python example',scope:'Developer utility',body:'Expose configuration, reset, step, and outputs. Include example contact replay, evaluation, and benchmark commands. Keep one sensor and one backend working before expanding integrations.',proof:'Another developer can reproduce the example from documented setup instructions.',dependency:'Requires the actual simulator implementation; this workbook does not implement it.'},
  {id:'transfer',title:'Test synthetic-to-real force estimation',scope:'Recommended extension',body:'Train a tactile-image force estimator on simulated contacts. Freeze it and evaluate on reserved real recordings against an independent load cell and a simple predictor baseline.',proof:'Real force-estimation error with object/trial counts, calibrated-data disclosure, and failures.',dependency:'Requires a load cell, physically calibrated simulation, and a clean evaluation split.'},
  {id:'feedback',title:'Add one-axis physical feedback',scope:'Stretch milestone',body:'Motorize the stage. Use the tactile estimate to reach or maintain a target force; keep the load cell outside the feedback path as independent evaluation.',proof:'A measured real feedback task. Distinguish estimator transfer from sim-trained policy transfer.',dependency:'Requires motorized actuation and a reliable estimator. A robot arm is optional.'}
];

const applicationTasks = [
  {id:'icp',title:'Choose an initial customer',detail:'Name a specific workflow, operator, buyer, and buying trigger.'},
  {id:'interviews',title:'Record actual customer discovery',detail:'Keep dated interviews, alternatives used, pain, and follow-up evidence.'},
  {id:'pilot',title:'Define a concrete pilot',detail:'Agree on input data, success criteria, owner, evaluation time, and commercial next step.'},
  {id:'positioning',title:'Write the plain-language description',detail:'One or two sentences that distinguish the current artifact from the proposed product.'},
  {id:'founders',title:'Complete founder facts',detail:'Names, roles, contributions, history, commitment, equity, and ownership.'},
  {id:'finances',title:'Verify company numbers',detail:'Current revenue, burn, runway, pricing assumptions, and actual traction.'},
  {id:'velocity',title:'Prepare a dated progress record',detail:'Use commits, recordings, experiment reports, and customer evidence.'},
  {id:'competition',title:'Choose the relevant comparison',detail:'Explain the specific advantage over open source, platform tools, or internal development.'},
  {id:'founder-video',title:'Record the founder video',detail:'Follow YC’s current one-minute founder-video guidance; use bullet points.'},
  {id:'demo-video',title:'Record and test the product demo',detail:'Show real operation; verify the viewer can access the submitted link.'},
  {id:'fact-drill',title:'Practice concise factual answers',detail:'Know the facts, involve every founder, and avoid memorized speeches.'},
  {id:'submission',title:'Check the live application',detail:'Verify deadlines, required fields, upload limits, claims, and contact information.'}
];

const fallbackQuestions = [
  ['Product','What does your company do?','Describe the target user, the concrete software, and the job it helps them do. Separate the proposed product from the working artifact.','Plain-language description and a matching runnable demonstration.','What can I run today?'],
  ['Product','Who needs this right now?','Name a narrowly defined robotics team and the contact-data or simulation bottleneck you have actually observed.','Dated customer interviews and the current workflow they use.','Who signs the purchase?'],
  ['Product','What problem does your first version solve?','Choose one workflow and describe its present cost or limitation using verified customer evidence.','A specific user task, alternative, and measurable pilot criterion.','How do they solve it without you?'],
  ['Product','What is your non-obvious insight?','State a testable observation about calibration, contact mechanics, data, or workflow. Explain what evidence would disprove it.','Measured comparisons or repeated customer observations.','What have you learned that changed your plan?'],
  ['Product','Why is now the right time?','Connect a specific enabling change to the customer workflow; keep timing hypotheses separate from facts.','Primary sources and customer confirmation of the changed constraint.','Why was this impractical two years ago?'],
  ['Product','Why start with one sensor?','Explain how narrow scope makes calibration and physical validation repeatable, and what must generalize later.','Sensor specification, evaluation regime, and expansion gates.','What breaks on a different sensor?'],
  ['Progress','How far along are you?','Name the current artifacts and dates. Prior work includes offline vibration development and synthetic force software; physical engine validation remains unestablished here.','Commits, saved reports, rig footage, benchmark files, and actual pilot records.','Show us the most recent working version.'],
  ['Progress','What changed in the last 30 days?','Give the actual before and after, your contribution, and the artifact supporting it. Leave unrecorded progress unknown.','Dated progress log and linked artifacts.','What was the hardest thing you shipped?'],
  ['Progress','How long have you worked on this full-time?','State actual start dates and time commitments, distinguishing research history from full-time company work.','Founder timeline and current commitments.','What is preventing faster progress?'],
  ['Progress','What are your most important metrics?','Choose metrics appropriate to this stage: validated error, reproducible throughput, researcher activation, pilot usage, or revenue when real.','Definitions, denominators, dates, and measurement artifacts.','Which metric improved this week?'],
  ['Progress','What does the current prototype not do?','Name the relevant limits directly: physical force validation, optical simulation, rollouts, or policy transfer if unfinished.','Evidence ledger with explicit current scope.','Which missing capability matters most to a buyer?'],
  ['Progress','What will you build next?','Name the next dependency-bound experiment and its decision criterion, rather than a broad feature list.','Experiment plan, measurement access, and owner.','What would make you stop or change direction?'],
  ['Market','Who pays, and for what?','Name the economic buyer and purchased outcome. Treat a paid calibration or evaluation pilot as a hypothesis until agreed.','Discovery notes, procurement details, and an actual offer when available.','Why will they pay instead of using open source?'],
  ['Market','How much will you charge?','Give actual pricing if established; otherwise identify the untested pricing hypothesis and how you will test willingness to pay.','Pilot proposals, accepted prices, or clearly labeled assumptions.','What budget does this come from?'],
  ['Market','Who are your direct competitors?','Distinguish tactile simulators, engines, learned world models, and internal customer tools. Compare the closest actual alternative.','Primary-source landscape and matched evaluation.','Which competitor do customers mention?'],
  ['Market','Why will NVIDIA or another platform not absorb this?','Explain the value you must deliver even if platforms add features: validated calibration, useful assets, workflow, or task evidence. Do not assume they cannot build it.','Measured differentiation and customer requirements.','What would you integrate with rather than replace?'],
  ['Market','How big can this market become?','Build from reachable accounts, workflow budgets, and adoption assumptions. Separate initial niche from expansion hypotheses.','Bottom-up market worksheet and customer spending evidence.','How many customers can buy today?'],
  ['Market','How will you get your first customers?','Describe a specific route to teams already operating tactile sensors, and a pilot with a measurable outcome.','Named channels, discovery funnel, and consented pilot discussions.','How will that process repeat?'],
  ['Market','Why would a lab switch from its own simulator?','Explain the integration effort and the verified advantage required to overcome it.','A workflow comparison or researcher-run pilot.','How long does onboarding take?'],
  ['Market','What could become defensible?','Describe a potential advantage and its validation path, such as rights-cleared measured contact assets or accumulated calibration evidence.','Data rights, task coverage, and actual customer retention when available.','What can an open-source team reproduce quickly?'],
  ['Team','How do the founders know each other?','Give the actual relationship, duration, and a concrete example of work together.','Founder history and shared artifacts.','How do you resolve disagreement?'],
  ['Team','Who builds the technology?','Attribute each component to the person who built it, and distinguish owned code from dependencies and prior research.','Code ownership and relevant technical artifacts.','Who can debug the mechanics pipeline?'],
  ['Team','Who handles customers and sales?','Name the actual owner and a concrete discovery or selling activity. Avoid assuming a missing role is covered.','Roles, interview records, and pilot ownership.','What did the last customer teach you?'],
  ['Team','What is the equity split?','Give the actual percentages and clear rationale, including commitments and vesting where applicable.','Accurate founder facts; no universal equal-split rule is assumed.','Are all founders aligned on it?'],
  ['Team','What is the hardest thing you have solved together?','Describe the problem, each person’s contribution, the technical or operational decision, and its supported outcome.','A shared shipped artifact or documented decision.','What did you disagree about?'],
  ['Team','What are burn and runway?','Use current cash and the relevant net monthly burn. If pre-company or bootstrapped, say what is actually known.','Dated financial worksheet and assumptions.','What changes after funding?'],
  ['Technical','Does visual similarity prove correct physics?','No. Explain separate measurements for force, deformation, contact geometry, and optical output under reserved motions.','Held-out physical error report and calibration split.','Which error actually affects the downstream task?'],
  ['Technical','How do you know material parameters are identifiable?','Explain controlled geometry, load, motion, and sensor properties; report ambiguity and effective parameters rather than asserting unique material truth.','Probe design, uncertainty, and alternative parameter fits.','Can two materials produce the same sensor reading?'],
  ['Technical','What exactly does your FPS measure?','State whether it is rendering, full physics step, aggregate batched throughput, or single-environment latency.','Hardware, resolution, batch size, synchronized timing, and peak memory.','Does that include contact solving and observation generation?'],
  ['Technical','What do you mean by zero-shot transfer?','Specify what was trained and frozen, what real calibration occurred, and whether any real task data or deployment adjustments were used.','Training provenance, frozen model hash, and predefined real trials.','Is this perception transfer or policy transfer?'],
  ['Technical','What can you prove without a robot?','Describe the calibrated benchtop comparison, independent force validation, and synthetic-to-real estimator. Physical robot task transfer remains a later claim.','Repeatable rig, held-out real recordings, and model evaluation.','What is the smallest real feedback task?'],
  ['Technical','What happens if the complex model loses to a simple baseline?','Report it, investigate the regime, and choose the next experiment based on customer-relevant error and cost.','Matched baselines, failure analysis, and a decision rule.','What result would invalidate the product thesis?']
].map((q,i)=>({id:`q${i+1}`,category:q[0],prompt:q[1],frame:q[2],evidence:q[3],followup:q[4]}));

const knowledge = window.TACTILE_WORLD_DATA || {};
const questions = Array.isArray(knowledge.questions?.questions) && knowledge.questions.questions.length
  ? knowledge.questions.questions.map(q=>({id:q.id,category:q.category,prompt:q.prompt,frame:q.answerFrame,evidence:q.evidenceNeeded.join('; '),followup:q.followup}))
  : fallbackQuestions;
const industryItems = Array.isArray(knowledge.industry?.items) ? knowledge.industry.items : [];

const sources = [
  ['OFFICIAL YC','Founder video instructions','https://www.ycombinator.com/video','One-minute founder introduction; product demos have a separate place in the application.'],
  ['OFFICIAL YC','Interview guide','https://www.ycombinator.com/interviews','Understand the business and metrics, involve the founders, and prepare a working demonstration.'],
  ['OFFICIAL YC','Frequently asked questions','https://www.ycombinator.com/faq','Early-stage eligibility and practical application guidance.'],
  ['OFFICIAL YC','Live application information','https://www.ycombinator.com/apply','Check the current batch, deadlines, and submission instructions here.'],
  ['PRIMARY PAPER','TACTO','https://arxiv.org/abs/2012.08456','Optical tactile simulation, high-resolution rendering, and initial sim-to-real demonstrations.'],
  ['PRIMARY PAPER','Taxim','https://arxiv.org/abs/2109.04027','Example-based GelSight optical response and elastic marker-motion modeling.'],
  ['PRIMARY PAPER','TacSL','https://arxiv.org/abs/2408.06506','GPU visuotactile simulation and learning, with reported policy transfer.'],
  ['PRIMARY PAPER','DiffTactile','https://arxiv.org/abs/2403.08716','Differentiable physical modeling of the sensing elastomer, objects, and contact.'],
  ['PRIMARY PAPER','HydroShear','https://arxiv.org/abs/2603.00446','Path-dependent shear and stick-slip modeling with reported task transfer.'],
  ['OFFICIAL DOCUMENTATION','MuJoCo modeling','https://mujoco.readthedocs.io/en/stable/modeling.html','General simulation modeling and contact context; assess exact backend capabilities.'],
  ['SUPPLIED SOURCE','Complete tactile world-model report','../sources/Tactile_World_Models_Complete_Report.pdf','Preserved 24-page report dated 23 October 2026. Treat its proposals and reported metrics within their stated scope.'],
  ['PRESERVED RESEARCH','99-paper literature dictionary','../sources/prior-research/docs/paper_dictionary.md','Dated prior literature map. Review depths and limitations are preserved rather than upgraded.'],
  ['REPOSITORY','Repository guide','../README.md','Start here for the document map, commands, current scope, and maintenance workflow.']
];

const slides = [
  {section:'01 / THESIS',title:'Make tactile simulation<br><em>measurable and useful.</em>',html:'<p class="slide-lede">A preparation brief for Tactile World: one sensor, a repeatable physical experiment, and an evidence-backed path to a YC application.</p><div class="slide-columns"><div class="slide-box tint"><h3>Available today</h3><p>A tactile sensor. No robot. Prior offline vibration research and synthetic force-analysis software.</p></div><div class="slide-box"><h3>Proposed next proof</h3><p>Predict held-out real contact, measure performance, and test whether simulated data trains a useful real-sensor model.</p></div></div><p class="slide-footnote">Internal preparation · snapshot 26 October 2026 · proposed product, not a claim of a completed physics engine.</p>'},
  {section:'02 / CUSTOMER',title:'Start with a specific<br>robotics workflow.',html:'<p class="slide-lede">Initial customer hypothesis: teams already using optical tactile sensors that need repeatable contact data, calibration, and model evaluation.</p><ul class="slide-list"><li><span>01</span><div><strong>Operator</strong><p>A researcher or robotics engineer generating and debugging tactile observations.</p></div></li><li><span>02</span><div><strong>Buying trigger</strong><p>Real data collection or unreliable simulation blocks an experiment or deployment.</p></div></li><li><span>03</span><div><strong>Outcome to validate</strong><p>Less calibration/data work, or better held-out task performance at an acceptable cost.</p></div></li></ul><p class="slide-footnote">Customer need, buyer, budget, price, and demand are hypotheses until supported by discovery or pilots. <a href="../docs/customer-discovery.md">Discovery plan</a>.</p>'},
  {section:'03 / INDUSTRY STACK',title:'Four layers.<br>Four different claims.',html:'<div class="mini-stack"><article><h3>Physical representation</h3><p>Geometry, materials, deformation, pressure, shear, slip, and contact history.</p></article><article><h3>Dynamics</h3><p>Actions and contact laws predict forces and evolving physical state.</p></article><article><h3>Sensor response</h3><p>Contact produces optical frames, marker motion, vibration, or other readings.</p></article><article><h3>Learning & control</h3><p>Infer contact, predict outcomes, and select useful probes or actions.</p></article></div><p class="slide-lede">Material is not sensation. A realistic image alone does not validate physical dynamics.</p><p class="slide-footnote"><a href="../docs/technical-architecture.md">Architecture and terminology</a> · whole-body sensing is a longer-term integration goal.</p>'},
  {section:'04 / PRIOR ART',title:'Fast tactile simulation<br>already exists.',html:'<div class="table-wrap"><table class="slide-table"><thead><tr><th>System</th><th>Relevant contribution</th><th>Our comparison must ask</th></tr></thead><tbody><tr><td>TACTO / Taxim</td><td>Optical rendering and calibrated sensor response.</td><td>What accuracy or calibration gain do we add?</td></tr><tr><td>TacSL</td><td>GPU simulation, learning, and reported sim-to-real transfer.</td><td>What improves at comparable fidelity and compute?</td></tr><tr><td>DiffTactile</td><td>Differentiable physical contact and deformation.</td><td>Which physical regime can we handle more practically?</td></tr><tr><td>HydroShear</td><td>History-dependent shear, stick-slip, and task transfer.</td><td>Where is our measured advantage?</td></tr></tbody></table></div><p class="slide-footnote">Paper results retain their original experimental scope. <a href="../docs/industry-landscape.md">Sourced landscape and broader world-model reading track</a>.</p>'},
  {section:'05 / WEDGE',title:'A calibration-to-evaluation<br>workflow is a testable wedge.',html:'<blockquote class="slide-quote">“We build software that simulates tactile sensor readings so robotics teams can train and evaluate models before collecting more hardware data.”</blockquote><span class="pill hypothesis big-status">Proposed positioning · validate with customers</span><div class="slide-columns"><div class="slide-box"><h3>First product question</h3><p>Can one sensor be calibrated, reproduced, and evaluated with substantially less friction for the user?</p></div><div class="slide-box tint"><h3>Long-term research hypothesis</h3><p>Measured material/contact assets plus physical structure and learned residuals may transfer across motions, loads, and sensors.</p></div></div><p class="slide-footnote">No measured superiority, market size, paid demand, or defensibility is established by this positioning.</p>'},
  {section:'06 / CURRENT EVIDENCE',title:'Show the foothold.<br>Preserve its limits.',html:'<div class="slide-columns"><div class="slide-box tint"><h3>Documented prior work</h3><ul><li>Offline vibration-spectrum prediction and development comparisons.</li><li>Synthetic force-analysis software and saved implementation checks.</li><li>Existing literature and experiment-design material.</li></ul></div><div class="slide-box"><h3>Still to establish</h3><ul><li>Physical force and contact accuracy.</li><li>Optical renderer and action-conditioned rollouts.</li><li>Measured speed/fidelity advantage.</li><li>Real task transfer and paying demand.</li></ul></div></div><p class="slide-footnote">Saved prior checks are attributed reports, not rerun or physical validation here. <a href="../docs/current-state.md">Current state</a> · <a href="../docs/evidence-ledger.md">evidence ledger</a>.</p>'},
  {section:'07 / BENCHTOP PROOF',title:'A robot arm is not the<br>first dependency.',html:'<ul class="slide-list"><li><span>01</span><div><strong>Repeatable rig</strong><p>Mounted sensor, controlled or measured stage motion, known object geometry, and a normal-force load cell.</p></div></li><li><span>02</span><div><strong>Aligned measurement</strong><p>Sensor frames, motion, force, timestamps, calibration version, and specimen identity.</p></div></li><li><span>03</span><div><strong>Independent evaluation</strong><p>Reserve trajectories and object geometries before fitting; freeze parameters before scoring.</p></div></li></ul><p class="slide-footnote">The rig is planned. Confirm sensor model and measurement access before selecting detailed hardware. <a href="../docs/poc-build-plan.md">PoC specification</a>.</p>'},
  {section:'08 / BUILD GATES',title:'Build in dependency order.',html:'<div class="slide-timeline"><div><strong>GATES 1–2</strong><h3>Rig + recording</h3><p>Repeatable normal contact with aligned motion, frames, and force.</p></div><div><strong>GATES 3–4</strong><h3>Model + held-out test</h3><p>Mechanics, sensor response, and an honest real/sim comparison.</p></div><div><strong>GATES 5–6</strong><h3>Benchmark + API</h3><p>Documented compute cost and a runnable developer example.</p></div><div><strong>GATES 7–8</strong><h3>Useful data + feedback</h3><p>Frozen synthetic-trained estimator; optional one-axis physical control.</p></div></div><p class="slide-lede">Advance when an artifact supports the claim. Defer cross-sensor breadth and whole-body ambition until the core contact experiment works.</p><p class="slide-footnote">No fixed FPS or one-hour RL requirement. These are proposed implementation gates, not YC admissions criteria.</p>'},
  {section:'09 / VALIDATION',title:'Measure mechanics,<br>sensor realism, and compute.',html:'<div class="slide-columns"><div class="slide-box"><h3>Physical and sensor error</h3><p>Force–indentation response, contact patch, observable deformation or marker displacement, and optical error on reserved contacts.</p><p>Include loading/unloading and failures. Add shear or slip metrics only when those behaviors are modeled and measured.</p></div><div class="slide-box tint"><h3>Reproducible performance</h3><p>Full-step latency and throughput; rendering throughput separately; hardware, resolution, sensors, batch size, warmup, synchronized GPU timing, and memory.</p><p>Compare the relevant baseline at matched conditions.</p></div></div><p class="slide-footnote">Aggregate frames per second is not single-environment latency or the real sensor’s sampling rate.</p>'},
  {section:'10 / REAL-WORLD UTILITY',title:'Train on synthetic contact.<br>Test on real measurements.',html:'<ul class="slide-list"><li><span>01</span><div><strong>Generate and train</strong><p>Use simulated tactile contacts to train a normal-force estimator, with geometry and motion variation.</p></div></li><li><span>02</span><div><strong>Freeze and evaluate</strong><p>Evaluate the frozen model on reserved real recordings; compare against an independent load cell and a simple estimator baseline.</p></div></li><li><span>03</span><div><strong>Disclose the boundary</strong><p>Identify real simulator-calibration data, any real model-training data, trial counts, errors, and failures.</p></div></li></ul><p class="slide-footnote">This is a planned perception-transfer experiment. It is not automatically policy transfer. Optional next step: one-axis force feedback using tactile estimates.</p>'},
  {section:'11 / DEMO',title:'A working sequence<br>makes the explanation short.',html:'<div class="slide-timeline"><div><strong>0–8 SEC</strong><h3>Actual setup</h3><p>Show the sensor and rig operating. State the concrete problem.</p></div><div><strong>8–25 SEC</strong><h3>Real ↔ simulated</h3><p>Same measured motion, reserved contact, force trace, and tactile frames.</p></div><div><strong>25–45 SEC</strong><h3>Useful output</h3><p>Show model transfer if completed, with ground truth and error.</p></div><div><strong>45–60 SEC</strong><h3>Speed + code</h3><p>Measured benchmark context and the runnable developer example.</p></div></div><p class="slide-lede">Record the stage you have reached. Label unfinished transfer as future work.</p><p class="slide-footnote">This timing is a suggested product-demo structure. YC’s one-minute founder video is separate. Check the live form’s product-demo requirements. <a href="../docs/demo-storyboard.md">Storyboard</a>.</p>'},
  {section:'12 / CUSTOMER EVIDENCE',title:'Replace interest<br>with a testable commitment.',html:'<div class="slide-columns"><div class="slide-box"><h3>Discovery</h3><p>Ask about the last failed tactile experiment, present workflow, calibration/data effort, alternatives, team budget, and buying process.</p><p>Record actual observations rather than imagined demand.</p></div><div class="slide-box tint"><h3>Pilot hypothesis</h3><p>One sensor, one dataset or task, agreed success criteria, a researcher owner, and a commercial next step if the result is useful.</p><p>Pricing and willingness to pay remain untested until verified.</p></div></div><div class="metric-labels"><span>Reachable accounts × relevant annual spend × adoption assumption</span><span>Bottom-up market model · inputs TBD</span></div><p class="slide-footnote">No invented customers, pilots, revenue, or market size. <a href="../docs/customer-discovery.md">Discovery</a> · <a href="../docs/business-model.md">business model</a>.</p>'},
  {section:'13 / FOUNDER FACT DRILL',title:'Know the facts.<br>Let every founder contribute.',html:'<div class="slide-columns"><div class="slide-box"><h3>Facts to complete — TBD</h3><p>Names and roles; history together; individual contributions; full-time dates; equity; launch/prototype milestones; revenue; burn and runway.</p><p>Use actual figures and explain their definitions.</p></div><div class="slide-box tint"><h3>Three objections to prepare</h3><p>Why will platform providers not erase your value?</p><p>What evidence supports sim-to-real reliability?</p><p>Who pays today, and how can the market expand?</p></div></div><p class="slide-footnote">Practice concise factual answers, not memorized speeches. No rigid CEO-answer quota or mandatory equal-equity rule. <a href="https://www.ycombinator.com/interviews" target="_blank" rel="noreferrer">YC interview guide</a>.</p>'},
  {section:'14 / BEFORE APPLYING',title:'Make the next claim<br><em>easy to inspect.</em>',html:'<ul class="slide-list"><li><span>01</span><div><strong>A clear description</strong><p>Specific user, problem, product, and the actual current stage.</p></div></li><li><span>02</span><div><strong>A concrete artifact</strong><p>Repeatable contact, held-out accuracy, reproducible speed, and useful synthetic data when demonstrated.</p></div></li><li><span>03</span><div><strong>A credible company plan</strong><p>Customer discovery, an initial buying hypothesis, founder facts, and dated progress.</p></div></li><li><span>04</span><div><strong>An accurate application</strong><p>Separate founder video and product demo. Verify the current form, access links, and every claim.</p></div></li></ul><p class="slide-footnote">Start with the workbook build plan and evidence ledger. <a href="../README.md">Repository guide</a> · <a href="../docs/readiness-checklist.md">readiness checklist</a> · <a href="https://www.ycombinator.com/apply" target="_blank" rel="noreferrer">current YC application information</a>.</p>'}
];

const validChecks = new Set([...gates,...applicationTasks].map(x=>x.id));
let checklist = Object.fromEntries([...validChecks].map(id=>[id,false]));
let currentView = 'overview';
let currentSlide = 0;
let questionIndex = 0;
let questionPool = questions;
let remainingMs = 10 * 60 * 1000;
let timerDeadline = 0;
let timerInterval = null;
let pendingConfirmation = null;

function escapeHtml(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function validateChecklist(value){
  if(!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Checklist must be an object.');
  for(const [key,checked] of Object.entries(value)){
    if(!validChecks.has(key) || typeof checked !== 'boolean') throw new Error('Checklist contains an unknown task or a non-boolean value.');
  }
  return {...Object.fromEntries([...validChecks].map(id=>[id,false])),...value};
}
function storageWarning(){const box=$('#storage-notice');box.hidden=false;box.textContent='Browser storage is unavailable. Checklist tracking still works for this session; export it to keep a copy.';}
function askConfirmation({title,message,confirmLabel}){
  const dialog=$('#confirm-dialog');
  if(dialog.open || pendingConfirmation)return Promise.resolve(false);
  const previousFocus=document.activeElement;
  $('#confirm-title').textContent=title;$('#confirm-message').textContent=message;$('#confirm-action').textContent=confirmLabel;
  dialog.returnValue='cancel';
  return new Promise(resolve=>{
    pendingConfirmation={resolve,previousFocus};
    try{dialog.showModal();}
    catch(error){pendingConfirmation=null;$('#announcement').textContent='Unable to display confirmation. No checklist changes were made.';resolve(false);}
  });
}
function loadProgress(){
  try{const raw=localStorage.getItem(STORAGE_KEY);if(raw){const parsed=JSON.parse(raw);if(parsed.schemaVersion!==1)throw new Error('Unsupported version');checklist=validateChecklist(parsed.checklist);}}
  catch(error){storageWarning();}
}
function saveProgress(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify({schemaVersion:1,checklist}));}catch(error){storageWarning();}}
function syncProgress(){
  $$('[data-check]').forEach(input=>{input.checked=checklist[input.dataset.check];const gate=input.closest('.gate');if(gate)gate.dataset.complete=String(input.checked);});
  const done=Object.values(checklist).filter(Boolean).length;$('#progress-count').textContent=`${done} / ${validChecks.size}`;$('#progress-bar').value=done;$('#progress-bar').max=validChecks.size;
}
function renderIndustry(){
  const query=$('#industry-search').value.trim().toLowerCase();
  const category=$('#industry-category').value;
  const items=industryItems.filter(item=>(category==='all'||item.category===category) && [item.name,item.category,item.relationship,item.status,item.summary,item.implication].join(' ').toLowerCase().includes(query));
  $('#industry-count').textContent=industryItems.length ? `${items.length} of ${industryItems.length} catalog entries · checked snapshot ${SNAPSHOT}` : 'The generated catalog is unavailable. Read the sourced industry landscape for the complete research map.';
  $('#industry-catalog').innerHTML=items.map(item=>`<article class="catalog-item"><div class="catalog-top"><p class="eyebrow">${escapeHtml(item.category)}</p><span class="pill ${item.verification==='report only'?'planned':'confirmed'}">${escapeHtml(item.verification)}</span></div><h3>${escapeHtml(item.name)}</h3><p class="catalog-relationship">${escapeHtml(item.relationship)}</p><p>${escapeHtml(item.summary)}</p><p class="catalog-implication"><strong>Implication for us</strong>${escapeHtml(item.implication)}</p><small>${escapeHtml(item.status)}</small><div class="catalog-links">${item.sources.filter(s=>/^(https:\/\/|\.\.\/)/.test(s.url)).map(s=>`<a href="${escapeHtml(s.url)}"${s.url.startsWith('https:')?' target="_blank" rel="noreferrer"':''}>${escapeHtml(s.title)} ↗</a>`).join('')}</div></article>`).join('');
  if(industryItems.length && !items.length)$('#industry-catalog').innerHTML='<p class="muted catalog-empty">No matching entries. Try another term or choose all categories.</p>';
}
function renderContent(){
  $('#build-gates').innerHTML=gates.map((g,i)=>`<article class="gate" data-complete="false"><span class="gate-number">${String(i+1).padStart(2,'0')}</span><div><span class="pill planned">${escapeHtml(g.scope)} · planned</span><h3>${escapeHtml(g.title)}</h3><p>${escapeHtml(g.body)}</p><p class="proof"><strong>Evidence to produce</strong>${escapeHtml(g.proof)}</p><p class="dependency">${escapeHtml(g.dependency)}</p></div><label class="gate-check"><input class="check-input" type="checkbox" data-check="${g.id}"><span class="sr-only">Mark personal task complete: ${escapeHtml(g.title)}</span></label></article>`).join('');
  $('#application-checklist').innerHTML=applicationTasks.map(t=>`<label class="app-check"><input class="check-input" type="checkbox" data-check="${t.id}"><span>${escapeHtml(t.title)}<small>${escapeHtml(t.detail)}</small></span></label>`).join('');
  $('#source-list').innerHTML=sources.map(s=>`<article class="source-item"><p class="eyebrow">${escapeHtml(s[0])}</p><a href="${escapeHtml(s[2])}"${s[2].startsWith('https:')?' target="_blank" rel="noreferrer"':''}>${escapeHtml(s[1])} ↗</a><p>${escapeHtml(s[3])}</p></article>`).join('');
  $('#slides').innerHTML=slides.map((s,i)=>`<article class="slide" id="slide-${i+1}" aria-labelledby="slide-heading-${i+1}" hidden><p class="slide-kicker">${escapeHtml(s.section)}</p><h2 id="slide-heading-${i+1}" tabindex="-1">${s.title}</h2>${s.html}</article>`).join('');
  $('#slide-toc').innerHTML=slides.map((s,i)=>`<a href="#slides/${i+1}" data-slide-link="${i}">${String(i+1).padStart(2,'0')} · ${escapeHtml(s.section.split(' / ')[1])}</a>`).join('');
  $('#question-category').innerHTML='<option value="all">All categories</option>'+[...new Set(questions.map(q=>q.category))].map(category=>`<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join('');
  $('#industry-category').innerHTML='<option value="all">All categories</option>'+[...new Set(industryItems.map(item=>item.category))].sort().map(category=>`<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join('');
  renderIndustry();
  $$('[data-check]').forEach(input=>input.addEventListener('change',()=>{checklist[input.dataset.check]=input.checked;saveProgress();syncProgress();}));
}

function route(focus=false){
  const hash=location.hash.slice(1);
  const slideMatch=hash.match(/^slides\/(\d+)$/);
  if(slideMatch){
    currentSlide=Math.min(slides.length-1,Math.max(0,Number(slideMatch[1])-1));
    if(hash!==`slides/${currentSlide+1}`)history.replaceState(null,'',`#slides/${currentSlide+1}`);
    $('#workspace').hidden=true;$('#presentation').hidden=false;document.body.classList.add('presenting');
    $$('.slide').forEach((slide,i)=>{slide.hidden=i!==currentSlide;});
    $$('[data-slide-link]').forEach(link=>{if(Number(link.dataset.slideLink)===currentSlide)link.setAttribute('aria-current','step');else link.removeAttribute('aria-current');});
    $('#slide-counter').textContent=`${String(currentSlide+1).padStart(2,'0')} / ${slides.length}`;
    $('#slide-section').textContent=slides[currentSlide].section;
    $('#previous-slide').disabled=currentSlide===0;$('#next-slide').disabled=currentSlide===slides.length-1;
    $('#slide-toc').hidden=true;$('#slide-toc-toggle').setAttribute('aria-expanded','false');
    document.title=`${currentSlide+1}. ${slides[currentSlide].section.split(' / ')[1]} — Tactile World`;
    if(focus)$(`#slide-heading-${currentSlide+1}`).focus({preventScroll:true});
  }else{
    const view=['overview','industry','build','application','rehearsal','sources'].includes(hash)?hash:'overview';
    if(hash && view!==hash)history.replaceState(null,'',`#${view}`);
    currentView=view;$('#workspace').hidden=false;$('#presentation').hidden=true;document.body.classList.remove('presenting');
    $$('.view').forEach(el=>{el.hidden=el.id!==`view-${view}`;});
    $$('[data-view]').forEach(link=>{if(link.dataset.view===view)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
    document.title=`Tactile World — ${view==='build'?'Build plan':view.charAt(0).toUpperCase()+view.slice(1)}`;
    if(focus)$('#main').focus({preventScroll:true});
  }
  window.scrollTo({top:0,left:0,behavior:'instant'});
}
function goSlide(index){location.hash=`slides/${Math.min(slides.length-1,Math.max(0,index))+1}`;}
function leavePresentation(){location.hash=currentView;}

function renderQuestion(){
  const q=questionPool[questionIndex];if(!q)return;
  $('#question-tag').textContent=`${q.category.toUpperCase()} / FACT DRILL`;
  $('#question-prompt').textContent=q.prompt;$('#question-frame').textContent=q.frame;$('#question-evidence').textContent=q.evidence;$('#question-followup').textContent=q.followup;
  $('#question-count').textContent=`${questionIndex+1} / ${questionPool.length}`;
  $('#answer-guidance').hidden=true;$('#reveal-answer').textContent='Reveal preparation prompts';$('#reveal-answer').setAttribute('aria-expanded','false');
}
function updateTimer(){
  if(timerDeadline)remainingMs=Math.max(0,timerDeadline-Date.now());
  const seconds=Math.ceil(remainingMs/1000);const min=Math.floor(seconds/60);const sec=seconds%60;
  $('#timer-display').textContent=`${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  $('#timer-display').setAttribute('aria-label',`${min} minutes and ${sec} seconds remaining`);
  $('#timer-display').classList.toggle('ended',remainingMs===0);
  if(remainingMs===0 && timerInterval!==null){clearInterval(timerInterval);timerInterval=null;timerDeadline=0;$('#timer-toggle').textContent='Restart timer';$('#announcement').textContent='The ten-minute practice timer has finished.';}
}
function pauseTimer(){if(timerDeadline)remainingMs=Math.max(0,timerDeadline-Date.now());if(timerInterval!==null)clearInterval(timerInterval);timerInterval=null;timerDeadline=0;$('#timer-toggle').textContent='Resume timer';updateTimer();}

renderContent();loadProgress();syncProgress();renderQuestion();route();
window.addEventListener('hashchange',()=>route(true));
$('#present-button').addEventListener('click',()=>goSlide(0));
$('#print-button').addEventListener('click',()=>window.print());
$('#exit-presentation').addEventListener('click',leavePresentation);
$('#previous-slide').addEventListener('click',()=>goSlide(currentSlide-1));
$('#next-slide').addEventListener('click',()=>goSlide(currentSlide+1));
$('#slide-toc-toggle').addEventListener('click',()=>{const next=$('#slide-toc').hidden;$('#slide-toc').hidden=!next;$('#slide-toc-toggle').setAttribute('aria-expanded',String(next));});
$('#confirm-dialog').addEventListener('cancel',()=>{$('#confirm-dialog').returnValue='cancel';});
$('#confirm-dialog').addEventListener('close',()=>{
  const pending=pendingConfirmation;if(!pending)return;
  pendingConfirmation=null;
  pending.resolve($('#confirm-dialog').returnValue==='confirm');
  if(pending.previousFocus instanceof HTMLElement && pending.previousFocus.isConnected)pending.previousFocus.focus({preventScroll:true});
});
document.addEventListener('keydown',event=>{
  if($('#confirm-dialog').open)return;
  if($('#presentation').hidden || event.altKey || event.ctrlKey || event.metaKey)return;
  const target=event.target;
  if(target instanceof Element && (target.matches('input,textarea,select') || target.isContentEditable))return;
  if(event.key==='ArrowRight'){event.preventDefault();goSlide(currentSlide+1);}
  if(event.key==='ArrowLeft'){event.preventDefault();goSlide(currentSlide-1);}
  if(event.key==='Home'){event.preventDefault();goSlide(0);}
  if(event.key==='End'){event.preventDefault();goSlide(slides.length-1);}
  if(event.key==='Escape'){event.preventDefault();leavePresentation();}
});
$('#export-progress').addEventListener('click',()=>{
  const payload={schemaVersion:1,snapshot:SNAPSHOT,exportedAt:new Date().toISOString(),trackingOnly:true,checklist};
  const blob=new Blob([JSON.stringify(payload,null,2)+'\n'],{type:'application/json'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='tactile-world-checklist.json';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  $('#import-message').classList.remove('error');$('#import-message').textContent='Checklist exported. This file records personal tracking, not verified technical results.';
});
$('#import-progress').addEventListener('click',()=>$('#import-file').click());
$('#import-file').addEventListener('change',async event=>{
  const file=event.target.files[0];if(!file)return;
  try{
    if(file.size>100000)throw new Error('Choose a checklist JSON file smaller than 100 KB.');
    const parsed=JSON.parse(await file.text());
    if(!parsed || parsed.schemaVersion!==1)throw new Error('This is not a supported Tactile World checklist export.');
    const imported=validateChecklist(parsed.checklist);
    if(!await askConfirmation({title:'Replace personal checklist?',message:'Replace this browser’s personal checklist with the imported tracking? This does not verify any evidence or change repository files.',confirmLabel:'Replace checklist'}))return;
    checklist=imported;saveProgress();syncProgress();$('#import-message').classList.remove('error');$('#import-message').textContent='Personal checklist imported. Verify evidence separately in the repository.';
  }catch(error){$('#import-message').classList.add('error');$('#import-message').textContent=`Import failed: ${error.message}`;}
  finally{event.target.value='';}
});
$('#reset-progress').addEventListener('click',async()=>{
  if(!await askConfirmation({title:'Reset personal checklist?',message:'Reset all personal checklist marks in this browser? Repository files and evidence will not change.',confirmLabel:'Reset checklist'}))return;
  checklist=Object.fromEntries([...validChecks].map(id=>[id,false]));saveProgress();syncProgress();$('#import-message').classList.remove('error');$('#import-message').textContent='Personal checklist reset.';
});
$('#question-category').addEventListener('change',event=>{questionPool=event.target.value==='all'?questions:questions.filter(q=>q.category===event.target.value);questionIndex=0;renderQuestion();});
$('#industry-search').addEventListener('input',renderIndustry);
$('#industry-category').addEventListener('change',renderIndustry);
$('#next-question').addEventListener('click',()=>{questionIndex=(questionIndex+1)%questionPool.length;renderQuestion();});
$('#random-question').addEventListener('click',()=>{if(questionPool.length>1){const offset=1+Math.floor(Math.random()*(questionPool.length-1));questionIndex=(questionIndex+offset)%questionPool.length;}renderQuestion();});
$('#reveal-answer').addEventListener('click',()=>{const revealed=$('#answer-guidance').hidden;$('#answer-guidance').hidden=!revealed;$('#reveal-answer').textContent=revealed?'Hide preparation prompts':'Reveal preparation prompts';$('#reveal-answer').setAttribute('aria-expanded',String(revealed));});
$('#timer-toggle').addEventListener('click',()=>{if(timerInterval!==null){pauseTimer();return;}if(remainingMs===0)remainingMs=600000;timerDeadline=Date.now()+remainingMs;timerInterval=setInterval(updateTimer,250);$('#timer-toggle').textContent='Pause timer';updateTimer();});
$('#timer-reset').addEventListener('click',()=>{if(timerInterval!==null)clearInterval(timerInterval);timerInterval=null;timerDeadline=0;remainingMs=600000;$('#timer-toggle').textContent='Start timer';updateTimer();});
