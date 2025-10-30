export interface BaseNote {
    title: "Nursing Note" | "Progress Note" | "Admission Note" | "Consult Note" | "Student Note";
    author: string;
    specialty: string;
    dateOffset: number;
    hospitalDay: string;
    publishTime: string;
}

export interface SoapNoteData {
    subjective?: string;
    objective?: string;
    assessment: string;
    plan?: string;
}

export interface SbarNote {
  situation: string;
  background: string;
  assessment: string;
  recommendation: string;
}

interface StudentNote extends BaseNote {
    title: "Student Note"
    noteBody: SbarNote
}

interface NursingNote extends BaseNote {
    title: "Nursing Note"
    noteBody: string
}

interface ProviderNote extends BaseNote {
    title: "Progress Note" | "Admission Note" | "Consult Note" ;
    noteBody: SoapNoteData;
}

export type NoteData = NursingNote | ProviderNote | StudentNote;


export const sampleNotes: NoteData [] = [
    {
        title: "Progress Note",
        author: "Dr. John Smith, MD",
        specialty: "Internal Medicine",
        dateOffset: 0, // Hospital Day 3 (July 18) - Current Day
        publishTime: "0900", // Matches the initial order time for the "current" day
        hospitalDay: "3",
        noteBody: {
            subjective: 'Patient continues to report improvement in energy and overall well-being. Foot numbness persists. Right great toe ulcer has no new pain. Patient verbalizes understanding of diabetes management and wound care principles.', 
            objective:    "Temp: 36.9°C, HR: 78 bpm, BP: 128/76 mmHg, RR: 16/min, SpO₂: 98% RA. Right great toe ulcer: 2x2 cm, clean base, good granulation. Erythema nearly resolved. No drainage or odor. Left foot: no changes. Lungs clear, heart RRR. Daily BMP stable.", 
            assessment: "60-year-old male, T2DM with infected right great toe ulcer. Significant improvement in local infection signs and systemic symptoms. Glycemic control is improving. Patient is stable and trending towards discharge.",
            plan: "1. Continue current medical regimen and wound care. 2. Continue daily BMP until 3 days are complete. 3. Continue to encourage progressive ambulation and deep breathing. 4. Case management consult to finalize home health services for wound care post-discharge. Daughter contacted and prepared for discharge. 5. Discuss discharge plan with patient, including medication reconciliation, follow-up with PCP and Podiatry, and signs of worsening infection. 6. Aim for discharge by end of day if home health is confirmed and patient remains stable on room air with good functional mobility."
        
        }
    },
    {
        title: "Nursing Note",
        author: "Samantha Bell, RN BSN",
        specialty: "Nursing",
        dateOffset: 0, 
        publishTime: "0800",
        hospitalDay: "3",
        noteBody: "Morning shift: Patient awoke alert and oriented. Vital signs stable, within parameters. BG at 07:00 was 155 mg/dL, administered insulin lispro per sliding scale. Assisted with full bed bath and linen change. Right great toe dressing changed, wound site clean and dry, no foul odor noted. Patient states 'my foot feels a bit better today.' Reinforcement of foot care education provided. Discussed importance of wearing hospital non-skid socks for fall prevention. Tolerated breakfast well."
    },

    // need to convert these notes to new structure
    {
        title: "Consult Note",
        author: "Dr. Lena Khan, DPM",
        specialty: "Podiatry",
        dateOffset: 1,
        publishTime: "1400",
        hospitalDay: "2",
        noteBody: {
            objective: 'Right great toe ulcer re-assessed. Size unchanged (2x2 cm). Surrounding erythema appears diminished compared to yesterday. No new signs of active infection (no increased drainage, odor, or pain). Wound base remains clean and granulating. Performed sharp debridement of peri-wound callus. Reinforced importance of offloading to patient. Discussed potential for specialized diabetic shoes upon discharge with Case Management. Intervention: Sharp debridement, wound cleansing, offloading reinforcement.',
            assessment: "Right great toe diabetic foot ulcer, improving.",
            plan: 'Continue daily wound checks. Re-evaluate Friday (07/18/2025).'
        }
    },
    {
        title: "Progress Note",
        author: "Dr. John Smith, MD",
        specialty: "Internal Medicine",
        dateOffset: 1,
        publishTime: "1100",
        hospitalDay: "2",
        noteBody: {
            subjective: 'Patient reports decreased fatigue, improved energy. Numbness in feet remains unchanged. Right great toe ulcer without new pain. Reports good appetite today, tolerating diabetic diet. No fever or chills.',
            objective: "Vitals (10:00): Temp: 36.8°C, HR: 80 bpm, BP: 130/78 mmHg, RR: 16/min, SpO₂: 97% RA. Physical Exam: Right great toe ulcer: mild erythema, no purulent drainage. Clean base. Distal pulses strong. Left foot: no changes. Lungs clear. Heart RRR. Labs (09:00): BMP stable. HbA1c returned at 9.8% (confirming poor glycemic control).",
            assessment: "60-year-old male, T2DM with infected right great toe ulcer. Improving on current therapy.",
            plan: '1. Continue current medical regimen. 2. BG control improving with sliding scale insulin, continue close monitoring. 3. Wound healing process appears adequate with current care. 4. Continue MRSA precautions. 5. Patient education reinforced on foot care and medication adherence. 6. Case management actively involved in discharge planning for home health wound care. 7. Podiatry to continue daily follow-up for wound management. 8. Target discharge in 1-2 days if stable and home care secured.'
        }
    },
    {
        title: "Nursing Note",
        author: "Chris Johnson, RN",
        specialty: "Nursing",
        dateOffset: 1,
        publishTime: "0730",
        hospitalDay: "2",
        noteBody: "Overnight: Patient rested well. Vital signs stable, within parameters. BG at 06:00 was 188 mg/dL, administered insulin lispro per sliding scale. Assisted with morning hygiene and partial bed bath. Patient ambulated to bathroom with 1-person assist. Wound dressing dry and intact. No new complaints of pain or dyspnea. Patient states he is 'feeling a bit better.' Continues to verbalize understanding of MRSA precautions and call light use. Pain: 2/10 (managed with Gabapentin) Activity: Ambulated with 1-person assist."
    },
    {
        title: "Consult Note",
        author: "Dr. Lena Khan, DPM",
        specialty: "Podiatry",
        dateOffset: 2,
        publishTime: "1500",
        hospitalDay: "1",
        noteBody: {
            subjective: 'Patient reports chronic foot numbness. Ulcer present for approx. 1 week, gradual onset of redness. Denies purulent drainage at home. Reports difficulty checking foot due to limited mobility. Primary concern is healing and preventing further complications.',
            objective: "Foot Exam: Right Foot: Great toe, dorsal aspect, 2x2 cm ulcer. Erythema extending 1 cm from wound edge. No fluctuance. Surrounding skin dry, intact. Pulse (DP/PT): 2+ bilaterally. Capillary refill: <3 sec. Protective sensation absent. Left Foot: Intact skin, no open wounds. Protective sensation diminished globally. Nails: Hypertrophic, mycotic on bilateral great toes. Foot deformities: mild hammertoes bilaterally. Wound: 2x2 cm, deep to dermis, mild erythema, no purulence, faint odor. Base clean, granulating. Probe to bone negative.",
            assessment: "Right great toe diabetic foot ulcer, Wagner Grade 1, infected. Background of Type 2 DM with peripheral neuropathy and limited self-care. Given current findings, infection appears localized. Importance of offloading and glycemic control emphasized.",
            plan: '1. Continue current topical antimicrobial per IM team. 2. Daily sterile dressing changes with NS. 3. Strict offloading of right great toe (consider specialized footwear/boot for ambulation). 4. Continue to monitor for signs of worsening infection (cellulitis, purulence). 5. Patient education on daily foot inspection, proper shoe wear, and importance of glycemic control. 6. Follow-up daily while inpatient for wound assessment and debridement as needed. 7. Discuss long-term offloading strategies with patient and care team.'
        }
    },
    {
        title: "Nursing Note",
        author: "Maria Sanchez, RN BSN",
        specialty: "Nursing",
        dateOffset: 2,
        publishTime: "1130",
        hospitalDay: "1",
        noteBody: "Patient admitted from ED with right great toe ulcer. Contact precautions initiated per orders. Oriented to room, call light, and precautions. Initial vital signs stable. BG 275 mg/dL, administered insulin lispro per sliding scale. Assisted patient with changing into hospital gown. Discussed basic foot safety and call light use. Patient expressed understanding of most instructions. Daughter contacted and updated on admission. Wound dressing observed: clean, dry, intact post-ED application. Pain: 3/10 (neuropathic baseline) Activity: Assisted with ambulation to bathroom, steady with help."
    },
    {
        title: "Admission Note",
        author: "Dr. John Smith, MD",
        specialty: "Internal Medicine",
        dateOffset: 2,
        publishTime: "1000",
        hospitalDay: "1",
        noteBody: {
            subjective: '60-year-old male with PMH of T2DM, HTN, peripheral neuropathy. Presents with non-healing right great toe ulcer over past week, associated with increasing redness. Reports feeling fatigued and bilateral foot numbness. Admits to inconsistent insulin use (missed doses for last 3 days). Denies fever, chills, or new pain in foot, but states baseline neuropathic pain is present. Reports poor dietary adherence, eating prepackaged foods.',
            objective: "Vitals (09:30): Temp: 37.0°C, HR: 88 bpm, BP: 145/85 mmHg, RR: 18/min, SpO₂: 97% RA. BG: 275 mg/dL (on admission). Physical Exam: Alert, oriented x3. Right great toe: 2x2 cm ulcer with mild surrounding erythema, no purulent drainage noted. Warm to touch. Distal pulses palpable (DP/PT 2+ bilaterally). Monofilament testing: absent sensation over right great toe and plantar aspect of foot. Left foot: intact skin, decreased sensation. Nails: Hypertrophic, mycotic on bilateral great toes. Foot deformities: mild hammertoes bilaterally. Labs (09:45): Initial BMP drawn. HbA1c pending. Wound culture from right great toe sent.",
            assessment: "60-year-old male, Type 2 Diabetes Mellitus with chronic poor glycemic control (evident by missed insulin doses and admission BG 275). Presents with infected right great toe diabetic foot ulcer. Also with hypertension and peripheral neuropathy. Currently on contact precautions for MRSA.",
            plan: '1. Admit to Internal Medicine service. 2. Continue q4h vital signs, ACHS BG monitoring. Notify parameters as per orders. 3. Activity as tolerated, fall risk precautions. 4. Contact precautions for MRSA. 5. Wound care: Daily NS cleansing, sterile dry dressing, topical antimicrobial. Monitor for worsening infection. 6. Medications: Insulin lispro sliding scale ACHS, Gabapentin 300 mg PO BID, Lisinopril 10 mg PO daily. 7. Nutrition: Diabetic diet, encourage fluids. 8. Labs: Daily BMP x3, HbA1c once (if not recent). 9. Consults: Case Management for discharge planning, Pharmacy for med review, Podiatry for ulcer management. 10. Patient education: Diabetes management, foot care, insulin adherence, MRSA precautions.'
        }
    },
];