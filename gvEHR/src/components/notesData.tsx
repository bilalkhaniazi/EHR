export interface NoteData {
    title: string; 
    author: string;
    specialty: string;
    dateOffset: number;
    publishTime: string;
    noteBody: NoteContent[]
}

interface NoteContent {
    type: "header" | "paragraphWithLabel" | "paragraph";
    content: string;
    label?: string;
}
export const sampleNotes: NoteData[] = [
    {
        title: "Nursing Note",
        author: "Marco Arop, RN BSN",
        specialty: "Nursing",
        dateOffset: 1, // Corresponds to Hospital Day 1
        publishTime: "0700",
        noteBody: [
            {
            type: 'paragraph',
            content:
                'Overnight shift: Patient initiated on oxygen via 2L NC; SpO₂ ranged between 91–93%. Required multiple nebulizer treatments for wheezing and dyspnea. Cough persistent with moderate yellow sputum; patient instructed on expectoration techniques. Appears fatigued, but alert and oriented x3. Required assist with toileting and repositioning. No acute distress. Completed first doses of prednisone and levofloxacin without issue.'
            },
            {
            type: 'paragraphWithLabel',
            label: 'Pain',
            content: '2/10 (mild throat discomfort and chest tightness)'
            },
            {
            type: 'paragraphWithLabel',
            label: 'Activity',
            content: 'Limited mobility; repositioned in bed with assistance'
            }
        ]
    },
    {
        title: "Progress Note",
        author: "Dr. Bryce Hoppel",
        specialty: "Internal Medicine",
        dateOffset: 1,
        publishTime: "1501",
        noteBody: [
            { type: 'paragraphWithLabel', label: 'Hospital Day', content: '3' },
            { type: 'header', content: "Subjective" },
            { type: 'paragraph', content: 'Patient is a 67-year-old male on hospital day 3 for COPD exacerbation, likely secondary to a lower respiratory tract infection. He reports mild improvement in dyspnea since initiation of corticosteroids and antibiotics. Still experiencing a productive cough with yellow sputum. Denies chest pain or hemoptysis. States he is sleeping better but still fatigued. Appetite remains poor.' },
            { type: 'header', content: 'Objective' },
            { type: 'paragraphWithLabel', label: 'Vitals', content: 'Temp: 37.2°C, HR: 88 bpm, BP: 132/78 mmHg, RR: 20/min, SpO₂: 94% on 2L nasal cannula.' },
            { type: 'paragraphWithLabel', label: 'Physical Exam', content: 'Alert, fatigued. Decreased breath sounds at bases, scattered wheezes, crackles noted bilaterally.' },
            { type: 'paragraphWithLabel', label: 'Labs', content: 'WBC: 10.2 x10⁹/L, CRP: 55, BMP: Stable, ABG (prior): Mild respiratory acidosis, Sputum culture: Pending' },
            { type: 'paragraphWithLabel', label: 'Imaging', content: 'CXR shows bilateral infiltrates, hyperinflation consistent with COPD exacerbation.' },
            { type: 'header', content: 'Assessment' },
            { type: 'paragraph', content: '67-year-old male with known COPD, presenting with acute exacerbation likely triggered by a lower respiratory infection. Clinical status improving with current therapy. No evidence of acute cardiac process. Monitoring for progression or secondary complications.' },
            { type: 'header', content: 'Plan' },
            { type: 'paragraph', content: 'Continue current prednisone taper (40 mg daily)—reassess need based on respiratory status. Continue levofloxacin (Day 3 of 5-day course) with plans to complete the course unless culture results suggest de-escalation. Maintain supplemental oxygen at 2L nasal cannula, titrate to keep SpO₂ ≥ 92%; consider weaning if patient remains stable. Continue chest physiotherapy PRN and encourage incentive spirometry every hour while awake to promote lung expansion and prevent atelectasis. Monitor for fever, increased sputum production, changes in breath sounds, or worsening dyspnea. Reassess sputum culture results upon return and tailor antibiotic therapy accordingly. Initiate nutrition consult to evaluate for caloric and protein needs due to poor appetite. Encourage ambulation with assistance to prevent deconditioning. Evaluate readiness for discharge once patient is stable on room air, has completed antibiotics, and shows functional improvement.'}
        ]
    },
    {
        title: "Nursing Note",
        author: "David Lee, RN BSN",
        specialty: "Nursing",
        dateOffset: 2, // Corresponds to Hospital Day 2 of the second IM note
        publishTime: "0700",
        noteBody: [
            { type: 'paragraph', content: 'Overnight shift: Patient tolerated oxygen at 2L NC, SpO2 maintaining 92-94%. Reports slight improvement in breathing, less effort. Coughing up thick yellow sputum, assisted with expectoration. Completed morning meds, including prednisone and levofloxacin. Skin intact. Encouraged fluid intake. A&O x3. Assisted with morning care.' },
            { type: 'paragraphWithLabel', label: 'Pain', content: '1/10 (sore throat from cough)' },
            { type: 'paragraphWithLabel', label: 'Activity', content: 'Assisted with ambulation to bathroom' }
        ]
    },
    {
        title: "Progress Note",
        author: "Dr. Bryce Hoppel",
        specialty: "Internal Medicine",
        dateOffset: 2,
        publishTime: "1135",
        noteBody: [
            { type: 'paragraphWithLabel', label: 'Hospital Day', content: '2' },
            { type: 'header', content: "Subjective" },
            { type: 'paragraph', content: 'Patient reports mild improvement in breathing with less wheezing. Cough remains productive with yellow sputum. Still feeling fatigued and short of breath with exertion. No fevers overnight. Appetite poor.' },
            { type: 'header', content: 'Objective' },
            { type: 'paragraphWithLabel', label: 'Vitals', content: 'Temp: 37.0°C, HR: 90 bpm, BP: 130/80 mmHg, RR: 22/min, SpO₂: 93% on 2L O₂.' },
            { type: 'paragraphWithLabel', label: 'Physical Exam', content: 'Breath sounds remain diminished with persistent wheezing and crackles. Less accessory muscle use. No cyanosis. Alert and cooperative.' },
            { type: 'paragraphWithLabel', label: 'Labs', content: 'WBC: 11.6 x10⁹/L, CRP: 72 (trending down), BMP: unchanged. ABG not repeated. Sputum culture: preliminary results suggest H. influenzae.' },
            { type: 'paragraphWithLabel', label: 'Imaging', content: 'No new imaging ordered. Previous CXR unchanged.' },
            { type: 'header', content: 'Assessment' },
            { type: 'paragraph', content: 'Day 2 of hospitalization for COPD exacerbation. Gradual clinical improvement with antibiotics and steroids. No signs of decompensation. Awaiting final culture confirmation.' },
            { type: 'header', content: 'Plan' },
            { type: 'paragraph', content: 'Continue current prednisone and levofloxacin regimen. Maintain O₂ at 2L nasal cannula. Encourage use of incentive spirometry and ambulation with staff support. Monitor for signs of worsening respiratory status. Recheck sputum culture for final sensitivity. Consider nutrition consult tomorrow if poor intake persists.' }
        ]
    },
    {
        title: "Nursing Note",
        author: "Sarah Chen, RN BSN",
        specialty: "Nursing",
        dateOffset: 3, 
        publishTime: "1430",
        noteBody: [
            { type: 'paragraph', content: 'Patient admitted to unit with acute SOB and wheezing. Placed on 2L NC, O2 sats 90% on arrival. Respiratory assessment: coarse breath sounds, productive cough. Assisted with bedside commode. Patient expressed anxiety about breathing. Educated on call light use and importance of deep breathing. Tolerated small sips of water. Dr. Hoppel notified of admission and current status.' },
            { type: 'paragraphWithLabel', label: 'Pain', content: '0/10' },
            { type: 'paragraphWithLabel', label: 'Activity', content: 'Bedrest with commode privileges' }
        ]
    },
    {
        title: "Progress Note",
        author: "Dr. Bryce Hoppel",
        specialty: "Internal Medicine",
        dateOffset: 3,
        publishTime: "0912",
        noteBody: [
            { type: 'paragraphWithLabel', label: 'Hospital Day', content: '1' },
            { type: 'header', content: "Subjective" },
            { type: 'paragraph', content: 'Patient is a 67-year-old male presenting with increasing shortness of breath, productive cough, and wheezing over the past 3 days. Symptoms unresponsive to home albuterol and nebulizer treatments. Reports fatigue and poor sleep due to nighttime dyspnea. Denies fever or chest pain.' },
            { type: 'header', content: 'Objective' },
            { type: 'paragraphWithLabel', label: 'Vitals', content: 'Temp: 37.1°C, HR: 94 bpm, BP: 138/82 mmHg, RR: 24/min, SpO₂: 90% on room air.' },
            { type: 'paragraphWithLabel', label: 'Physical Exam', content: 'Increased work of breathing. Diffuse wheezes and crackles bilaterally. Mild accessory muscle use noted. No peripheral edema.' },
            { type: 'paragraphWithLabel', label: 'Labs', content: 'WBC: 13.1 x10⁹/L, CRP: 88, BMP: normal. ABG shows mild respiratory acidosis with hypoxia. Sputum culture sent.' },
            { type: 'paragraphWithLabel', label: 'Imaging', content: 'CXR: Hyperinflation and patchy infiltrates consistent with COPD exacerbation and possible infection.' },
            { type: 'header', content: 'Assessment' },
            { type: 'paragraph', content: 'COPD exacerbation, likely infectious in origin. Hypoxic and symptomatic despite outpatient management. Requires hospitalization for oxygen support and systemic treatment.' },
            { type: 'header', content: 'Plan' },
            { type: 'paragraph', content: 'Initiate prednisone 40 mg daily. Begin levofloxacin empirically for suspected bacterial infection. Start 2L nasal cannula O₂, titrate to SpO₂ ≥ 92%. Albuterol/ipratropium nebulizers every 4 hours. Encourage incentive spirometry. Monitor respiratory status closely. Await sputum culture results. Consider pulmonology consult if symptoms worsen.' }
        ]
    },
]    
