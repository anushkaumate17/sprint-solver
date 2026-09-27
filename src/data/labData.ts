import { Reagent, MilkSample, AssayProtocol, AdulterantDetail, QuizQuestion, TestResultRecord } from '../types/lab';

export const REAGENTS: Reagent[] = [
  {
    id: 'iodine',
    name: 'Iodine Solution (1% I₂/KI)',
    chemicalFormula: 'I₂ + KI (aq)',
    colorHex: '#8b4513',
    fluidColor: '#78350f',
    glassTint: '#451a03',
    shelfPosition: 0,
    shelfRow: 'top',
    description: 'Lugol’s formulation for starch amylose helical complexation.',
    hazardNote: 'Mild irritant; stains skin and clothing.'
  },
  {
    id: 'conc_h2so4',
    name: 'Conc. Sulphuric Acid (98%)',
    chemicalFormula: 'Conc. H₂SO₄',
    colorHex: '#f1f5f9',
    fluidColor: '#cbd5e1',
    glassTint: '#64748b',
    shelfPosition: 1,
    shelfRow: 'top',
    description: 'Dehydrating mineral acid used for formalin ring layer formation.',
    hazardNote: 'Highly corrosive! Adds dense bottom layer without mixing.'
  },
  {
    id: 'conc_hcl',
    name: 'Conc. Hydrochloric Acid',
    chemicalFormula: 'Conc. HCl (37%)',
    colorHex: '#e2e8f0',
    fluidColor: '#cbd5e1',
    glassTint: '#94a3b8',
    shelfPosition: 2,
    shelfRow: 'top',
    description: 'Strong acid for hydrolyzing sucrose into ketohexoses (fructose).',
    hazardNote: 'Fuming corrosive acid. Handle with care.'
  },
  {
    id: 'resorcinol',
    name: 'Resorcinol Reagent (0.5%)',
    chemicalFormula: 'C₆H₄(OH)₂ in EtOH',
    colorHex: '#fafafa',
    fluidColor: '#f1f5f9',
    glassTint: '#e2e8f0',
    shelfPosition: 3,
    shelfRow: 'top',
    description: 'Seliwanoff phenolic reagent for specific detection of ketohexoses (sucrose).',
    hazardNote: 'Combustible phenolic solution.'
  },
  {
    id: 'fecl3',
    name: 'Ferric Chloride (FeCl₃, 10%)',
    chemicalFormula: 'FeCl₃ (aq)',
    colorHex: '#ca8a04',
    fluidColor: '#eab308',
    glassTint: '#a16207',
    shelfPosition: 4,
    shelfRow: 'top',
    description: 'Trace oxidant catalyst for formaldehyde tryptophan-condensed violet chromophore.',
    hazardNote: 'Astringent iron salt solution.'
  },
  {
    id: 'phenolphthalein',
    name: 'Phenolphthalein Indicator (1%)',
    chemicalFormula: 'C₂₀H₁₄O₄ in EtOH',
    colorHex: '#f8fafc',
    fluidColor: '#f1f5f9',
    glassTint: '#cbd5e1',
    shelfPosition: 5,
    shelfRow: 'top',
    description: 'pH indicator turning brilliant magenta-pink in alkaline surfactant solutions (pH > 8.3).',
    hazardNote: 'Ethanol based indicator.'
  },
  {
    id: 'dmab',
    name: 'DMAB Reagent (Ehrlich’s)',
    chemicalFormula: '(CH₃)₂NC₆H₄CHO in HCl',
    colorHex: '#e0e7ff',
    fluidColor: '#c7d2fe',
    glassTint: '#818cf8',
    shelfPosition: 6,
    shelfRow: 'bottom',
    description: 'p-Dimethylaminobenzaldehyde for condensation with urea to form diazotized yellow chromophore.',
    hazardNote: 'Contains dilute mineral acid.'
  },
  {
    id: 'rosalic_acid',
    name: 'Rosalic Acid (1% in Ethanol)',
    chemicalFormula: 'C₁₉H₁₄O₃',
    colorHex: '#f43f5e',
    fluidColor: '#fb7185',
    glassTint: '#be123c',
    shelfPosition: 7,
    shelfRow: 'bottom',
    description: 'Colorimetric detector for neutralizers (sodium carbonate, bicarbonate, sodium hydroxide).',
    hazardNote: 'Flammable alcohol reagent.'
  }
];

export const MILK_SAMPLES: MilkSample[] = [
  {
    id: 'sample_pure',
    name: 'Sample A: Certified Raw Cow Milk (Control)',
    origin: 'Anand Cooperative Dairy, Gujarat',
    adulterant: 'pure',
    description: 'Standard fresh unadulterated cow milk. Density: 1.030 g/cm³, natural cream hue.',
    fatContent: 4.2,
    snfContent: 8.6,
    isAdulterated: false
  },
  {
    id: 'sample_starch',
    name: 'Sample B: Suspected Thickened Milk (Starch Spiked)',
    origin: 'Urban Retail Bulk Canister #204',
    adulterant: 'starch',
    description: 'Watered down milk thickened with commercial starch/flour paste to mimic creamy viscosity.',
    fatContent: 2.1,
    snfContent: 9.8,
    isAdulterated: true
  },
  {
    id: 'sample_detergent',
    name: 'Sample C: Synthetic Emulsion (Detergent Spiked)',
    origin: 'Interstate Bulk Tanker #D-309',
    adulterant: 'detergent',
    description: 'Illegal synthetic milk concocted with low-grade vegetable oil emulsified using washing detergent.',
    fatContent: 3.8,
    snfContent: 7.2,
    isAdulterated: true
  },
  {
    id: 'sample_urea',
    name: 'Sample D: Nitrogen-Boosted Milk (Urea Spiked)',
    origin: 'District Collection Center #U-621',
    adulterant: 'urea',
    description: 'Fertilizer urea added to artificially elevate non-protein nitrogen (Kjeldahl reading) after dilution.',
    fatContent: 1.8,
    snfContent: 11.2,
    isAdulterated: true
  },
  {
    id: 'sample_formalin',
    name: 'Sample E: Preserved Raw Milk (Formaldehyde Spiked)',
    origin: 'Unrefrigerated Transit Can #F-412',
    adulterant: 'formalin',
    description: 'Toxic formaldehyde (37% formalin) added to preserve milk during long warm ambient transport.',
    fatContent: 3.9,
    snfContent: 8.5,
    isAdulterated: true
  },
  {
    id: 'sample_sucrose',
    name: 'Sample F: Sugar Masked Sample (Sucrose Spiked)',
    origin: 'Suburban Vendor Dispenser #C-518',
    adulterant: 'sucrose',
    description: 'Table cane sugar added to conceal watery taste and manipulate hydrometer density readings.',
    fatContent: 2.4,
    snfContent: 10.4,
    isAdulterated: true
  },
  {
    id: 'sample_neutralizer',
    name: 'Sample G: Sourness-Neutralized Milk (Soda Spiked)',
    origin: 'Market Stand Sample #N-705',
    adulterant: 'neutralizer',
    description: 'Sodium bicarbonate/caustic soda added to spoiled, souring milk to mask microbial acidity.',
    fatContent: 3.5,
    snfContent: 8.9,
    isAdulterated: true
  },
  {
    id: 'sample_mystery',
    name: 'Sample X: Mystery Vendor Specimen (Blind Audit)',
    origin: 'Roadside Chai Stall Random Seizure #X-99',
    adulterant: 'detergent', // mystery defaults to detergent or can be chosen
    description: 'Unknown seized specimen. Conduct full screening battery to identify chemical contaminants.',
    fatContent: 2.9,
    snfContent: 8.1,
    isAdulterated: true
  }
];

export const ASSAY_PROTOCOLS: AssayProtocol[] = [
  {
    id: 'assay_starch',
    title: 'Starch Detection Assay (Iodine Test)',
    targetAdulterant: 'starch',
    purpose: 'Detects illegal addition of flour, arrowroot, or potato starch used to artificially increase milk specific gravity and thickness.',
    chemicalPrinciple: 'Iodine molecules (I₃⁻ / I₅⁻ polyiodides) slip inside the helical coils of amylose polymers in starch, creating a charge-transfer complex that absorbs yellow-red light and reflects intense deep blue-black radiation.',
    reactionEquation: 'I₂ + KI + Amylose Helix → [Amylose · I₅⁻] (Intense Deep Blue Complex)',
    reagentsNeeded: ['iodine'],
    requiresHeating: true,
    heatingTimeSeconds: 5,
    positiveObservation: 'Intense indigo/dark blue-black coloration forms upon adding iodine and gentle heating.',
    positiveColor: '#1e1b4b',
    negativeObservation: 'Milk retains natural yellowish-white/cream appearance with faint yellowish iodine hue.',
    negativeColor: '#fef3c7',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Transfer 3 mL of milk sample into the clean test tube.',
        actionRequired: 'add_milk',
        requiredVolumeMl: 3,
        description: 'Ensure test tube is clean and dry to avoid false contamination.',
        visualCue: 'Milk sample fills lower third of test tube with opaque white liquid.'
      },
      {
        stepNumber: 2,
        instruction: 'Add 3 to 4 drops of Iodine Reagent from the upper shelf.',
        actionRequired: 'add_reagent',
        targetReagentId: 'iodine',
        description: 'Iodine reacts specifically with poly-glucan helical chains.',
        visualCue: 'Amber droplets fall into the milk suspension.'
      },
      {
        stepNumber: 3,
        instruction: 'Place the tube into the 95°C water bath for boiling and cool.',
        actionRequired: 'heat_sample',
        description: 'Boiling gelatinizes any raw starch granules, maximizing helical exposure to triiodide ions.',
        visualCue: 'Steam rises from heating bath; reaction color stabilizes.'
      },
      {
        stepNumber: 4,
        instruction: 'Inspect final chromophore: Deep blue-black indicates starch adulteration.',
        actionRequired: 'observe',
        description: 'Pure milk turns faint pale yellow; starch adulterated milk turns deep blue-purple.',
        visualCue: 'Colorimeter comparison confirms presence or absence.'
      }
    ],
    fssaiStandardRef: 'FSSAI Manual of Methods of Analysis of Foods - Milk (2022) Section 1.5.1',
    healthRiskLevel: 'Moderate'
  },
  {
    id: 'assay_detergent',
    title: 'Detergent & Alkalis Assay (Phenolphthalein Test)',
    targetAdulterant: 'detergent',
    purpose: 'Identifies commercial laundry powder, sodium carbonate, and synthetic surfactants blended into synthetic milk concoctions.',
    chemicalPrinciple: 'Commercial detergents and synthetic emulsifiers are highly alkaline (pH 9.5-11.0). Phenolphthalein is colorless in normal milk (pH 6.6-6.8) but ionizes into a quinoid dianion chromophore exhibiting brilliant magenta-pink in alkaline detergent solutions.',
    reactionEquation: 'Detergent Alkalis (OH⁻) + Phenolphthalein (colorless lactone) → Pink Quinoid Dianion',
    reagentsNeeded: ['phenolphthalein'],
    requiresHeating: false,
    positiveObservation: 'Immediate development of intense magenta / rose-pink color throughout the tube.',
    positiveColor: '#ec4899',
    negativeObservation: 'Liquid remains completely white/cream with no magenta coloration.',
    negativeColor: '#f8fafc',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Pipette 5 mL of milk specimen into the laboratory test tube.',
        actionRequired: 'add_milk',
        requiredVolumeMl: 5,
        description: 'Fresh milk has natural buffer capacity, which detergents overwhelm.',
        visualCue: 'Pure white milk fills test tube.'
      },
      {
        stepNumber: 2,
        instruction: 'Dispense 4 drops of 1% Phenolphthalein indicator from the reagent shelf.',
        actionRequired: 'add_reagent',
        targetReagentId: 'phenolphthalein',
        description: 'Phenolphthalein undergoes rapid base-catalyzed molecular isomerization.',
        visualCue: 'Colorless indicator droplets hit the milk surface.'
      },
      {
        stepNumber: 3,
        instruction: 'Agitate test tube gently and examine for alkaline chromophore.',
        actionRequired: 'observe',
        description: 'Any distinct rose-pink or deep magenta coloration confirms alkaline surfactant contamination.',
        visualCue: 'Immediate color shift if alkaline detergent is present.'
      }
    ],
    fssaiStandardRef: 'FSSAI Milk Testing Protocol Sec 2.1; AOAC Official Method 990.21',
    healthRiskLevel: 'Critical'
  },
  {
    id: 'assay_urea',
    title: 'Urea Detection Assay (DMAB Ehrlich’s Test)',
    targetAdulterant: 'urea',
    purpose: 'Quantifies illegal nitrogen fertilization used to fraudulently inflate protein readings during lactometer/Kjeldahl checks.',
    chemicalPrinciple: 'p-Dimethylaminobenzaldehyde (DMAB) in acidic medium reacts specifically with primary amide groups of urea to produce a Schiff base derivative displaying intense lemon-yellow to golden-amber coloration.',
    reactionEquation: 'Urea + p-DMAB (HCl) → 4-Dimethylaminobenzylidene Urea (Golden Yellow Chromophore)',
    reagentsNeeded: ['dmab'],
    requiresHeating: false,
    positiveObservation: 'Intense canary yellow or bright amber coloration (pure milk remains dull cream or pale peach).',
    positiveColor: '#eab308',
    negativeObservation: 'Light pale buff/cream color (natural physiological urea is < 70 mg/100 mL).',
    negativeColor: '#fef08a',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Add 3 mL of milk sample to the test tube.',
        actionRequired: 'add_milk',
        requiredVolumeMl: 3,
        description: 'Standard volumetric aliquot for micro-titration.',
        visualCue: 'Milk sample in tube.'
      },
      {
        stepNumber: 2,
        instruction: 'Add 3 mL of DMAB reagent (p-Dimethylaminobenzaldehyde) from the shelf.',
        actionRequired: 'add_reagent',
        targetReagentId: 'dmab',
        description: 'DMAB condenses with the amide nitrogen atoms.',
        visualCue: 'Reagent layers and mixes with sample.'
      },
      {
        stepNumber: 3,
        instruction: 'Allow reaction to develop for 60 seconds at room temperature.',
        actionRequired: 'observe',
        description: 'Compare with natural control: intense lemon-yellow signifies toxic exogenous urea.',
        visualCue: 'Vibrant chromatic change in presence of synthetic urea.'
      }
    ],
    fssaiStandardRef: 'FSSAI Manual of Methods of Analysis of Foods - Milk (2022) Section 1.5.3',
    healthRiskLevel: 'High'
  },
  {
    id: 'assay_formalin',
    title: 'Formalin Ring Assay (FeCl₃ & Conc. H₂SO₄)',
    targetAdulterant: 'formalin',
    purpose: 'Detects formaldehyde (formalin 37-40%), a known Group 1 human carcinogen illegally used to halt bacterial souring.',
    chemicalPrinciple: 'In the presence of ferric chloride catalyst (Fe³⁺) and concentrated sulphuric acid, formaldehyde condenses with the indole ring of tryptophan residues in casein protein to produce an intense violet-purple ring at the liquid interface.',
    reactionEquation: 'HCHO + Casein Tryptophan + Fe³⁺ + H₂SO₄ → Condensed Violet Ring at Interface',
    reagentsNeeded: ['fecl3', 'conc_h2so4'],
    requiresHeating: false,
    positiveObservation: 'Sharp, distinct violet or purple ring forms at the junction of the acid and milk layers.',
    positiveColor: '#7e22ce',
    negativeObservation: 'Brown or greenish-yellow interface ring with no trace of violet coloration.',
    negativeColor: '#78716c',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Pipette 5 mL of milk specimen into the glass test tube.',
        actionRequired: 'add_milk',
        requiredVolumeMl: 5,
        description: 'Casein proteins in milk provide the tryptophan substrate.',
        visualCue: 'Milk ready in tube.'
      },
      {
        stepNumber: 2,
        instruction: 'Add 2 drops of 10% Ferric Chloride (FeCl₃) catalyst from the rack.',
        actionRequired: 'add_reagent',
        targetReagentId: 'fecl3',
        description: 'Ferric ions accelerate oxidative condensation of the indole chromogen.',
        visualCue: 'Golden FeCl3 drops disperse in milk.'
      },
      {
        stepNumber: 3,
        instruction: 'Carefully slide 3 mL of Conc. Sulphuric Acid along the inner tube wall.',
        actionRequired: 'add_reagent',
        targetReagentId: 'conc_h2so4',
        description: 'Dense H₂SO₄ sinks beneath milk layer without turbulent mixing.',
        visualCue: 'Dense acid forms a clear lower phase under the white milk.'
      },
      {
        stepNumber: 4,
        instruction: 'Examine the interfacial boundary line between the two liquid phases.',
        actionRequired: 'observe',
        description: 'A violet/purple ring at the junction is definitive proof of formaldehyde.',
        visualCue: 'Formation of striking purple ring at interface.'
      }
    ],
    fssaiStandardRef: 'FSSAI Leach Test Method 2022 / AOAC 931.08',
    healthRiskLevel: 'Critical'
  },
  {
    id: 'assay_sucrose',
    title: 'Cane Sugar / Sucrose Assay (Resorcinol & HCl Boiling Test)',
    targetAdulterant: 'sucrose',
    purpose: 'Detects commercial sucrose (table sugar) added to watered milk to boost sweetness and falsely elevate lactometer readings.',
    chemicalPrinciple: 'Hydrochloric acid hydrolyzes non-reducing sucrose into glucose and fructose. Fructose (a ketohexose) dehydrates under hot acid into hydroxymethylfurfural (HMF), which condenses with resorcinol to form a deep cherry-red xanthene complex.',
    reactionEquation: 'Sucrose + HCl (heat) → HMF + Resorcinol → Cherry-Red Condensation Dye',
    reagentsNeeded: ['resorcinol', 'conc_hcl'],
    requiresHeating: true,
    heatingTimeSeconds: 5,
    positiveObservation: 'Intense cherry-red or ruby-crimson coloration within 5 minutes of boiling.',
    positiveColor: '#b91c1c',
    negativeObservation: 'Milk remains white or turns dull brownish-faint pink upon prolonged heating.',
    negativeColor: '#fed7aa',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Add 3 mL of milk sample to the reaction tube.',
        actionRequired: 'add_milk',
        requiredVolumeMl: 3,
        description: 'Lactose in natural milk does not form red complex under short heating.',
        visualCue: 'Milk sample in tube.'
      },
      {
        stepNumber: 2,
        instruction: 'Add 1 mL of Resorcinol solution from the shelf.',
        actionRequired: 'add_reagent',
        targetReagentId: 'resorcinol',
        description: 'Resorcinol acts as the phenolic chromogenic partner.',
        visualCue: 'Clear resorcinol drops added.'
      },
      {
        stepNumber: 3,
        instruction: 'Add 1 mL of Concentrated Hydrochloric Acid (Conc. HCl).',
        actionRequired: 'add_reagent',
        targetReagentId: 'conc_hcl',
        description: 'Acid catalyzes dehydration of ketohexose molecules.',
        visualCue: 'Acid blends into milk-resorcinol solution.'
      },
      {
        stepNumber: 4,
        instruction: 'Transfer tube to the 95°C water bath heater for boiling.',
        actionRequired: 'heat_sample',
        description: 'Heat drives rapid conversion to deep red xanthene dye.',
        visualCue: 'Steam rises; solution turns vivid deep red if sucrose is present.'
      }
    ],
    fssaiStandardRef: 'FSSAI Seliwanoff Modified Protocol (2022) Section 1.5.2',
    healthRiskLevel: 'High'
  },
  {
    id: 'assay_neutralizer',
    title: 'Neutralizers & Soda Assay (Rosalic Acid Test)',
    targetAdulterant: 'neutralizer',
    purpose: 'Exposes unlawful addition of sodium hydroxide (caustic soda) or sodium bicarbonate used to mask souring milk.',
    chemicalPrinciple: 'Rosalic acid (aurin) is sensitive to artificial basic salts used to neutralize microbial lactic acid. In neutralized milk, rosalic acid turns deep rose-red; in natural fresh milk, it produces a brownish-orange hue.',
    reactionEquation: 'Rosalic Acid + Carbonate/Hydroxide Salts → Rose-Red Aurin Salt Complex',
    reagentsNeeded: ['rosalic_acid'],
    requiresHeating: false,
    positiveObservation: 'Vivid rose-red or blood-red coloration indicating presence of neutralizer salts.',
    positiveColor: '#e11d48',
    negativeObservation: 'Brownish-orange or faint yellow coloration (normal unneutralized milk).',
    negativeColor: '#f97316',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Measure 5 mL of milk sample into the test tube.',
        actionRequired: 'add_milk',
        requiredVolumeMl: 5,
        description: 'Tests for alkaline carbonates used to fraudulently restore pH.',
        visualCue: 'Milk in tube.'
      },
      {
        stepNumber: 2,
        instruction: 'Add 4 drops of Rosalic Acid indicator solution.',
        actionRequired: 'add_reagent',
        targetReagentId: 'rosalic_acid',
        description: 'Rosalic acid dissociates selectively in carbonate-buffered milk.',
        visualCue: 'Reddish drops disperse in milk.'
      },
      {
        stepNumber: 3,
        instruction: 'Shake the test tube gently and inspect chromatic response.',
        actionRequired: 'observe',
        description: 'Rose-red indicates illegal alkali salts; brownish-orange confirms purity.',
        visualCue: 'Immediate rose-red reaction in neutralized milk.'
      }
    ],
    fssaiStandardRef: 'FSSAI Manual of Milk Testing 2022 Section 1.5.4',
    healthRiskLevel: 'High'
  }
];

export const ADULTERANT_DATABASE: AdulterantDetail[] = [
  {
    id: 'starch',
    name: 'Starch & Cereal Flours',
    commonSources: ['Cornstarch', 'Maida (refined wheat flour)', 'Potato starch', 'Arrowroot'],
    economicMotive: 'Increases consistency, thickness, and solids-not-fat (SNF) hydrometer readings after heavy water dilution.',
    chemicalNature: 'Polysaccharide macromolecule composed of amylose and amylopectin.',
    acuteToxicity: 'Digestive heaviness, bloating, allergic reactions in gluten-sensitive individuals.',
    chronicHazards: [
      'Gastrointestinal distress and severe indigestion in infants and toddlers',
      'Sudden blood glucose spikes in diabetic patients consuming raw milk',
      'Bacterial proliferation inside improperly cooked starch residues'
    ],
    fssaiTolerance: '0.00% (Strict Zero Tolerance in all dairy products)',
    affectedOrgans: ['Digestive Tract', 'Pancreas', 'Small Intestine'],
    preventionTip: 'Perform home tincture iodine test on 5 mL boiled milk.'
  },
  {
    id: 'detergent',
    name: 'Synthetic Detergent & Surfactants',
    commonSources: ['Laundry powder detergents', 'Lab grade alkyl sulfates', 'Dishwashing liquids'],
    economicMotive: 'Emulsifies non-dairy industrial oils and water into a creamy, frothy white emulsion that mimics whole milk.',
    chemicalNature: 'Anionic/non-ionic surfactants containing linear alkylbenzene sulfonate (LAS) and phosphates.',
    acuteToxicity: 'Severe nausea, burning esophagus sensation, chemical gastritis, explosive diarrhea.',
    chronicHazards: [
      'Destruction of mucous membrane lining stomach and intestines',
      'Progressive renal tubular damage and chronic kidney failure',
      'Corrosive injury to infant gastrointestinal microvilli'
    ],
    fssaiTolerance: '0.00% (Criminal offense under Food Safety and Standards Act)',
    affectedOrgans: ['Stomach Lining', 'Kidneys', 'Liver', 'Intestines'],
    preventionTip: 'Shake 10 mL milk in a bottle: persistent frothy soap foam indicates detergent.'
  },
  {
    id: 'urea',
    name: 'Urea (Fertilizer Grade)',
    commonSources: ['Agricultural fertilizer prills', 'Technical grade carbamide'],
    economicMotive: 'Falsely boosts non-protein nitrogen (NPN) to trick Kjeldahl protein analyzers after 50-70% water dilution.',
    chemicalNature: 'Diamide of carbonic acid: CO(NH₂)₂.',
    acuteToxicity: 'Metabolic acidosis, vomiting, dizziness, gastrointestinal cramping.',
    chronicHazards: [
      'Overloads glomerular filtration, leading to permanent nephrotoxicity',
      'Impaired cognitive development in growing children',
      'Chronic burden on liver urea-cycle enzymes'
    ],
    fssaiTolerance: 'Maximum natural threshold: 700 ppm (70 mg/100 mL)',
    affectedOrgans: ['Kidneys (Glomeruli)', 'Liver', 'Blood Chemistry'],
    preventionTip: 'Soybean powder / urease test paper strips or DMAB Ehrlich reagent.'
  },
  {
    id: 'formalin',
    name: 'Formaldehyde / Formalin',
    commonSources: ['37% Formaldehyde solution', 'Mortuary & anatomical embalming preservatives'],
    economicMotive: 'Potent disinfectant added to prevent milk from souring during hot transit without refrigeration.',
    chemicalNature: 'Methanal aqueous solution (HCHO).',
    acuteToxicity: 'Throat burning, abdominal colic, respiratory distress, shock.',
    chronicHazards: [
      'Classified as IARC Group 1 definitive human carcinogen',
      'Severe liver fibrosis and irreversible renal necrosis',
      'Gene mutations and irreversible cellular denaturation'
    ],
    fssaiTolerance: '0.00% (Strict prohibition; toxic chemical adulterant)',
    affectedOrgans: ['Liver', 'Kidneys', 'Respiratory Tract', 'Stomach'],
    preventionTip: 'Ferric chloride and concentrated sulphuric acid ring test.'
  },
  {
    id: 'sucrose',
    name: 'Cane Sugar / Sucrose',
    commonSources: ['Commercial table sugar', 'Confectionery sucrose syrup'],
    economicMotive: 'Increases sweetness and specific gravity reading (lactometer density) after water dilution.',
    chemicalNature: 'Disaccharide composed of α-D-glucopyranosyl and β-D-fructofuranoside.',
    acuteToxicity: 'Misleading caloric intake; false nutritional expectations.',
    chronicHazards: [
      'Dangerous for diabetic patients relying on dairy nutrition',
      'Tooth decay and altered lipid profile in young children',
      'Masks microbial spoilage in dilute dairy batches'
    ],
    fssaiTolerance: '0.00% (Unpermitted additive in standardized pasteurized milk)',
    affectedOrgans: ['Pancreas', 'Metabolic Endocrine System', 'Teeth'],
    preventionTip: 'Seliwanoff resorcinol test with boiling.'
  },
  {
    id: 'neutralizer',
    name: 'Neutralizers (Soda & Alkalis)',
    commonSources: ['Baking soda (NaHCO₃)', 'Washing soda (Na₂CO₃)', 'Caustic soda (NaOH)'],
    economicMotive: 'Neutralizes microbial lactic acid in spoiled milk so it does not curdle when boiled.',
    chemicalNature: 'Alkaline sodium carbonates and hydroxides.',
    acuteToxicity: 'Disruption of stomach acid-base equilibrium and digestive enzymes.',
    chronicHazards: [
      'Alkaline gastritis and reduced bioavailability of essential minerals (iron, zinc)',
      'Hypertension exacerbated by excessive sodium ingestion',
      'Hides pathogenic bacterial growth in spoiled milk'
    ],
    fssaiTolerance: '0.00% (Zero tolerance in raw and pasteurized milk)',
    affectedOrgans: ['Gastric Mucosa', 'Cardiovascular System', 'Kidneys'],
    preventionTip: 'Rosalic acid alcohol test or sensitive pH test strip.'
  }
];

export const INITIAL_BATCH_LOGS: TestResultRecord[] = [
  {
    id: 'REC-2026-081',
    timestamp: '2026-09-27 10:14:22',
    sampleId: 'sample_pure',
    sampleName: 'Sample A: Certified Raw Cow Milk (Control)',
    sampleBatch: 'ANAND-COOP-882',
    assayId: 'assay_starch',
    assayName: 'Starch Detection Assay (Iodine Test)',
    testedAdulterant: 'Starch & Cereal Flours',
    resultStatus: 'Negative (Pure)',
    colorObserved: '#fef3c7 (Natural Cream)',
    reactionNotes: 'No blue complex detected. Normal physiological response.',
    testedBy: 'Senior Dairy Microbiologist Dr. V. Patel',
    safetyRating: 'Safe'
  },
  {
    id: 'REC-2026-082',
    timestamp: '2026-09-27 10:35:10',
    sampleId: 'sample_starch',
    sampleName: 'Sample B: Suspected Thickened Milk',
    sampleBatch: 'MKT-RETAIL-204',
    assayId: 'assay_starch',
    assayName: 'Starch Detection Assay (Iodine Test)',
    testedAdulterant: 'Starch & Cereal Flours',
    resultStatus: 'Positive (Adulterated)',
    colorObserved: '#1e1b4b (Deep Indigo Blue)',
    reactionNotes: 'Strong positive reaction. High amylose content detected.',
    testedBy: 'Lab Technician R. Sharma',
    safetyRating: 'Hazardous'
  },
  {
    id: 'REC-2026-083',
    timestamp: '2026-09-27 11:02:45',
    sampleId: 'sample_detergent',
    sampleName: 'Sample C: Synthetic Emulsion',
    sampleBatch: 'HIGHWAY-TANKER-309',
    assayId: 'assay_detergent',
    assayName: 'Detergent & Alkalis Assay',
    testedAdulterant: 'Synthetic Detergent & Surfactants',
    resultStatus: 'Positive (Adulterated)',
    colorObserved: '#ec4899 (Intense Rose Magenta)',
    reactionNotes: 'pH exceeded 9.8. Surfactant emulsifiers present.',
    testedBy: 'Senior Dairy Microbiologist Dr. V. Patel',
    safetyRating: 'Hazardous'
  },
  {
    id: 'REC-2026-084',
    timestamp: '2026-09-27 11:40:02',
    sampleId: 'sample_formalin',
    sampleName: 'Sample E: Preserved Raw Milk',
    sampleBatch: 'TRANSIT-CAN-412',
    assayId: 'assay_formalin',
    assayName: 'Formalin Ring Assay',
    testedAdulterant: 'Formaldehyde / Formalin',
    resultStatus: 'Positive (Adulterated)',
    colorObserved: '#7e22ce (Violet Interface Ring)',
    reactionNotes: 'Distinct violet chromogen ring at interface. Formalin confirmed.',
    testedBy: 'Quality Assurance Officer K. Nair',
    safetyRating: 'Hazardous'
  }
];

export const CERTIFICATION_QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question: 'When Iodine solution is added to starch-adulterated milk, what color confirms a positive reaction?',
    options: [
      'Intense dark blue-black',
      'Vivid canary yellow',
      'Bright rose-pink',
      'Milky white precipitate'
    ],
    correctAnswer: 0,
    explanation: 'Iodine slips into helical amylose chains forming a polyiodide charge-transfer complex that reflects deep blue-black radiation.',
    adulterantTopic: 'Starch'
  },
  {
    id: 2,
    question: 'Why do unscrupulous vendors illegally introduce formaldehyde (formalin) into raw milk supplies?',
    options: [
      'To increase creaminess and fat content',
      'To prevent souring during unrefrigerated long-distance transport',
      'To make the milk taste noticeably sweeter',
      'To artificially increase lactometer reading'
    ],
    correctAnswer: 1,
    explanation: 'Formaldehyde is a strong biocidal preservative that halts bacterial souring, allowing unrefrigerated transport of spoiled milk.',
    adulterantTopic: 'Formalin'
  },
  {
    id: 3,
    question: 'Which reagent develops a brilliant magenta-pink color in milk adulterated with laundry detergent?',
    options: [
      'Iodine Reagent',
      'Phenolphthalein Indicator',
      'Ferric Chloride (FeCl₃)',
      'Resorcinol Solution'
    ],
    correctAnswer: 1,
    explanation: 'Phenolphthalein is colorless in unadulterated milk (pH ~6.6) but undergoes alkaline quinoid ionization into magenta-pink at pH > 8.3.',
    adulterantTopic: 'Detergent'
  },
  {
    id: 4,
    question: 'What is the primary motive behind spiking watered milk with urea fertilizer?',
    options: [
      'To artificially boost nitrogen levels and deceive Kjeldahl crude protein tests',
      'To whiten the yellow color of colostrum',
      'To lower boiling point for faster processing',
      'To convert skimmed milk into cheese'
    ],
    correctAnswer: 0,
    explanation: 'Urea contains high non-protein nitrogen (NPN), which falsely elevates nitrogen assays that multiply total N by 6.38 to calculate milk protein.',
    adulterantTopic: 'Urea'
  },
  {
    id: 5,
    question: 'In the Leach / Hehner assay for formalin, what visual phenomenon indicates a positive test?',
    options: [
      'Effervescence of carbon dioxide bubbles',
      'A distinct violet or purple ring at the interface of acid and milk',
      'A dense blue gel forming at the bottom of the tube',
      'Complete clearance into a transparent liquid'
    ],
    correctAnswer: 1,
    explanation: 'Formaldehyde condenses with casein tryptophan in the presence of ferric ions (Fe³⁺) and conc. H₂SO₄ to create a characteristic violet ring.',
    adulterantTopic: 'Formalin'
  },
  {
    id: 6,
    question: 'What reagent combination is utilized in the Seliwanoff test to detect cane sugar (sucrose) in milk?',
    options: [
      'Resorcinol and Concentrated Hydrochloric Acid (with heating)',
      'Sodium Hydroxide and Copper Sulphate',
      'Silver Nitrate and Potassium Chromate',
      'Methylene Blue and Ethanol'
    ],
    correctAnswer: 0,
    explanation: 'Acid hydrolyzes sucrose into fructose, which dehydrates to HMF and condenses with resorcinol to form a deep cherry-red dye.',
    adulterantTopic: 'Sucrose'
  },
  {
    id: 7,
    question: 'Why are neutralizers like sodium bicarbonate (baking soda) or caustic soda added to milk?',
    options: [
      'To neutralize sour lactic acid and prevent curdling upon boiling',
      'To boost the butterfat content',
      'To sterilize Salmonella bacteria',
      'To impart an aromatic flavor'
    ],
    correctAnswer: 0,
    explanation: 'Neutralizers chemically mask spoilage acidity, deceptively preventing the milk from curdling when boiled by the consumer.',
    adulterantTopic: 'Neutralizers'
  },
  {
    id: 8,
    question: 'What indicator turns rose-red in the presence of added neutralizer alkalis?',
    options: [
      'Rosalic Acid (1% in ethanol)',
      'Litmus paper only',
      'Bromothymol Blue only',
      'Methyl Orange only'
    ],
    correctAnswer: 0,
    explanation: 'Rosalic acid produces a rose-red color in neutralized milk, whereas fresh unadulterated milk yields an orange-brown shade.',
    adulterantTopic: 'Neutralizers'
  }
];
