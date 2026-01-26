export interface ClinicalNote {
  title: string;
  author: string;
  specialty: string;
  timeOffset: number;
  excludedFromPresim: boolean;
  content: string;
}

export const sampleNotes: ClinicalNote[] = [
  {
    title: "Progress Note",
    author: "Dr. John Smith, MD",
    specialty: "Internal Medicine",
    timeOffset: 0,
    content: `
      <h1><u>Subjective</u></h1>
      <p>Patient continues to report <strong>improvement</strong> in energy and overall well-being.</p>
      <ul class="list-disc ml-6">
        <li>Foot numbness persists.</li>
        <li>Right great toe ulcer has <b>no new pain</b>.</li>
        <li>Patient verbalizes understanding of diabetes management and wound care principles.</li>
      </ul>
      <p></p>
      <h2><u>Objective</u></h2>
      <p><strong>Vitals:</strong> Temp: 36.9°C | HR: 78 bpm | BP: 128/76 mmHg | RR: 16/min | SpO₂: 98% RA</p>
      
      <h3><b>Physical Exam</b></h3>
      <ul class="list-disc ml-6">
        <li>Right great toe ulcer: 2x2 cm, clean base, good granulation. Erythema nearly resolved. No drainage or odor.</li>
        <li>Left foot: No changes.</li>
        <li>Pulm: Lungs clear.</li>
        <li>CV: Heart RRR.</li>
      </ul>
      
      <p><strong>Labs:</strong> Daily BMP stable.</p>
      <p></p>

      <h2><u>Assessment</u></h2>
      <p>60-year-old male, <b>T2DM with infected right great toe ulcer</b>.</p>
      <p>Significant improvement in local infection signs and systemic symptoms. Glycemic control is improving. Patient is stable and trending towards discharge.</p>
      <p></p>

      <h2><u>Plan</u></h2>
      <ol class="list-decimal ml-6">
        <li>Continue current medical regimen and wound care.</li>
        <li>Continue daily BMP until 3 days are complete.</li>
        <li>Continue to encourage progressive ambulation and deep breathing.</li>
        <li>Case management consult to finalize home health services for wound care post-discharge. <i>Daughter contacted and prepared for discharge.</i></li>
        <li>Discuss discharge plan with patient, including:
          <ul class="list-disc ml-6">
            <li>Medication reconciliation</li>
            <li>Follow-up with PCP and Podiatry</li>
            <li>Signs of worsening infection</li>
          </ul>
        </li>
        <li><b>Aim for discharge by end of day</b> if home health is confirmed and patient remains stable on room air with good functional mobility.</li>
      </ol>`
    ,


    excludedFromPresim: true
  },
  {
    title: "Nursing Note",
    author: "Samantha Bell, RN BSN",
    specialty: "Nursing",
    timeOffset: 60, // Day 3 @ 08:00 (1 hour ago)
    content: "Morning shift: Patient awoke alert and oriented. Vital signs stable, within parameters. BG at 07:00 was 155 mg/dL, administered insulin lispro per sliding scale. Assisted with full bed bath and linen change. Right great toe dressing changed, wound site clean and dry, no foul odor noted. Patient states 'my foot feels a bit better today.' Reinforcement of foot care education provided. Discussed importance of wearing hospital non-skid socks for fall prevention. Tolerated breakfast well.",
    excludedFromPresim: true

  }
  ,
  {
    title: "Consult Note",
    author: "Dr. Lena Khan, DPM",
    specialty: "Podiatry",
    timeOffset: 1140, // Day 2 @ 14:00 (19 hours ago)
    content: `
      <h2><u>Objective</u></h2>
      <p><strong>Physical Examination (Right Foot):</strong></p>
      <ul class="list-disc ml-6">
        <li><b>Ulcer Status:</b> Re-assessed. Size unchanged (2x2 cm).</li>
        <li><b>Peri-wound:</b> Surrounding erythema appears diminished compared to yesterday.</li>
        <li><b>Infection Signs:</b> No new signs of active infection (no increased drainage, odor, or pain).</li>
        <li><b>Wound Base:</b> Remains clean and granulating.</li>
      </ul>
      <p><strong>Interventions Performed:</strong></p>
      <ul class="list-disc ml-6">
        <li><i>Sharp debridement</i> of peri-wound callus.</li>
        <li>Wound cleansing.</li>
        <li>Reinforced importance of offloading to patient.</li>
        <li>Discussed potential for specialized diabetic shoes upon discharge with Case Management.</li>
      </ul>
      <p></p>

      <h2><u>Assessment</u></h2>
      <p>Right great toe diabetic foot ulcer, <strong>improving</strong>.</p>
      <p></p>

      <h2><u>Plan</u></h2>
      <ol>
        <li>Continue daily wound checks.</li>
        <li>Re-evaluate Friday (07/18/2025).</li>
      </ol>
    `,
    excludedFromPresim: true

  },
  {
    title: "Progress Note",
    author: "Dr. John Smith, MD",
    specialty: "Internal Medicine",
    timeOffset: 1320, // Day 2 @ 11:00 (22 hours ago)
    content: `
  <h2><u>Subjective</u></h2>
  <p>Patient reports <strong>decreased fatigue</strong> and improved energy.</p>
  <ul class="list-disc ml-6">
    <li>Numbness in feet remains unchanged.</li>
    <li>Right great toe ulcer without new pain.</li>
    <li>Reports good appetite today, tolerating diabetic diet.</li>
    <li>No fever or chills.</li>
  </ul>
  <p></p>

  <h2><u>Objective</u></h2>
  <p><strong>Vitals (10:00):</strong> Temp: 36.8°C | HR: 80 bpm | BP: 130/78 mmHg | RR: 16/min | SpO₂: 97% RA</p>
  
  <h3>Physical Exam</h3>
  <ul class="list-disc ml-6">
    <li><b>Right great toe ulcer:</b> Mild erythema, no purulent drainage. Clean base. Distal pulses strong.</li>
    <li><b>Left foot:</b> No changes.</li>
    <li><b>Lungs:</b> Clear.</li>
    <li><b>Heart:</b> RRR.</li>
  </ul>

  <p><strong>Labs (09:00):</strong></p>
  <ul class="list-disc ml-6">
    <li>BMP stable.</li>
    <li><b>HbA1c:</b> Returned at 9.8% (confirming poor glycemic control).</li>
  </ul>
  <p></p>

  <h2><u>Assessment</u></h2>
  <p>60-year-old male, <b>T2DM with infected right great toe ulcer</b>.</p>
  <p>Improving on current therapy.</p>
  <p></p>

  <h2><u>Plan</u></h2>
  <ol class="list-decimal ml-6">
    <li>Continue current medical regimen.</li>
    <li><b>BG control improving</b> with sliding scale insulin, continue close monitoring.</li>
    <li>Wound healing process appears adequate with current care.</li>
    <li>Continue MRSA precautions.</li>
    <li>Patient education reinforced on foot care and medication adherence.</li>
    <li>Case management actively involved in discharge planning for home health wound care.</li>
    <li>Podiatry to continue daily follow-up for wound management.</li>
    <li><b>Target discharge in 1-2 days</b> if stable and home care secured.</li>
  </ol>
`,
    excludedFromPresim: true
  },
  {
    title: "Nursing Note",
    author: "Chris Johnson, RN",
    specialty: "Nursing",
    timeOffset: 1530, // Day 2 @ 07:30 (25.5 hours ago)
    content: "Overnight: Patient rested well. Vital signs stable, within parameters. BG at 06:00 was 188 mg/dL, administered insulin lispro per sliding scale. Assisted with morning hygiene and partial bed bath. Patient ambulated to bathroom with 1-person assist. Wound dressing dry and intact. No new complaints of pain or dyspnea. Patient states he is 'feeling a bit better.' Continues to verbalize understanding of MRSA precautions and call light use. Pain: 2/10 (managed with Gabapentin) Activity: Ambulated with 1-person assist.",
    excludedFromPresim: true

  },
  {
    title: "Consult Note",
    author: "Dr. Lena Khan, DPM",
    specialty: "Podiatry",
    timeOffset: 2520, // Day 1 @ 15:00 (42 hours ago)
    content: `
      <h2><u>Subjective</u></h2>
      <p>Patient reports <strong>chronic foot numbness</strong>.</p>
      <ul class="list-disc ml-6">
        <li>Ulcer present for approx. 1 week, gradual onset of redness.</li>
        <li>Denies purulent drainage at home.</li>
        <li>Reports difficulty checking foot due to limited mobility.</li>
        <li><strong>Primary concern:</strong> Healing and preventing further complications.</li>
      </ul>
      <p></p>

      <h2><u>Objective</u></h2>
      <p><strong>Foot Exam (Right Foot):</strong></p>
      <ul class="list-disc ml-6">
        <li><b>Wound:</b> Great toe, dorsal aspect, 2x2 cm ulcer. Deep to dermis.</li>
        <li><b>Appearance:</b> Erythema extending 1 cm from wound edge. No fluctuance. Base clean, granulating. Mild erythema, no purulence, faint odor.</li>
        <li><b>Probe to bone:</b> Negative.</li>
        <li><b>Sensation:</b> Protective sensation absent.</li>
      </ul>

      <p><strong>Foot Exam (Left Foot):</strong></p>
      <ul class="list-disc ml-6">
        <li>Intact skin, no open wounds.</li>
        <li>Protective sensation diminished globally.</li>
      </ul>

      <p><strong>General Findings:</strong></p>
      <ul class="list-disc ml-6">
        <li><b>Pulse (DP/PT):</b> 2+ bilaterally. Capillary refill: <3 sec.</li>
        <li><b>Nails:</b> Hypertrophic, mycotic on bilateral great toes.</li>
        <li><b>Deformities:</b> Mild hammertoes bilaterally.</li>
      </ul>
      <p></p>

      <h2><u>Assessment</u></h2>
      <p>Right great toe diabetic foot ulcer, <strong>Wagner Grade 1, infected</strong>.</p>
      <p>Background of Type 2 DM with peripheral neuropathy and limited self-care. Given current findings, infection appears localized. Importance of offloading and glycemic control emphasized.</p>
      <p></p>

      <h2><u>Plan</u></h2>
      <ol class="list-decimal ml-6">
        <li>Continue current topical antimicrobial per IM team.</li>
        <li>Daily sterile dressing changes with NS.</li>
        <li><strong>Strict offloading</strong> of right great toe (consider specialized footwear/boot for ambulation).</li>
        <li>Continue to monitor for signs of worsening infection (cellulitis, purulence).</li>
        <li>Patient education on daily foot inspection, proper shoe wear, and importance of glycemic control.</li>
        <li>Follow-up daily while inpatient for wound assessment and debridement as needed.</li>
        <li>Discuss long-term offloading strategies with patient and care team.</li>
      </ol>
    `,
    excludedFromPresim: true

  },
  {
    title: "Nursing Note",
    author: "Maria Sanchez, RN BSN",
    specialty: "Nursing",
    timeOffset: 2730, // Day 1 @ 11:30 (45.5 hours ago)
    content: "Patient admitted from ED with right great toe ulcer. Contact precautions initiated per orders. Oriented to room, call light, and precautions. Initial vital signs stable. BG 275 mg/dL, administered insulin lispro per sliding scale. Assisted patient with changing into hospital gown. Discussed basic foot safety and call light use. Patient expressed understanding of most instructions. Daughter contacted and updated on admission. Wound dressing observed: clean, dry, intact post-ED application. Pain: 3/10 (neuropathic baseline) Activity: Assisted with ambulation to bathroom, steady with help.",
    excludedFromPresim: true

  },
  {
    title: "Admission Note",
    author: "Dr. John Smith, MD",
    specialty: "Internal Medicine",
    timeOffset: 2820, // Day 1 @ 10:00 (47 hours ago)
    content: `
  <h2><u>Subjective</u></h2>
  <p><strong>HPI:</strong> 60-year-old male with PMH of T2DM, HTN, peripheral neuropathy.</p>
      <ul class="list-disc ml-6">
    <li>Presents with non-healing right great toe ulcer over past week, associated with increasing redness.</li>
    <li>Reports feeling fatigued and bilateral foot numbness.</li>
    <li><b>Medication Adherence:</b> Admits to inconsistent insulin use (missed doses for last 3 days).</li>
    <li><b>Constitutional:</b> Denies fever, chills, or new pain in foot, but states baseline neuropathic pain is present.</li>
    <li><b>Diet:</b> Reports poor dietary adherence, eating prepackaged foods.</li>
  </ul>
  <p></p>

  <h2><u>Objective</u></h2>
  <p><strong>Vitals (09:30):</strong> Temp: 37.0°C | HR: 88 bpm | BP: 145/85 mmHg | RR: 18/min | SpO₂: 97% RA</p>
  <p><strong>Admission Glucose:</strong> 275 mg/dL</p>

  <h3><b>Physical Exam</b></h3>
      <ul class="list-disc ml-6">
    <li>General: Alert, oriented x3.</li>
    <li>Right Foot: 2x2 cm ulcer on great toe with mild surrounding erythema. No purulent drainage noted. Warm to touch. Sensation absent (monofilament).</li>
    <li>Left Foot: Intact skin, decreased sensation.</li>
    <li>Vascular: Distal pulses palpable (DP/PT 2+ bilaterally).</li>
    <li>Musculoskeletal: Mild hammertoes bilaterally. Hypertrophic/mycotic nails.</li>
  </ul>

  <p><strong>Labs/Workup (09:45):</strong></p>
  <ul class="list-disc ml-6">
    <li>Initial BMP drawn.</li>
    <li>HbA1c pending.</li>
    <li>Wound culture from right great toe sent.</li>
  </ul>
  <p></p>

  <h2><u>Assessment</u></h2>
  <p>60-year-old male, <strong>Type 2 Diabetes Mellitus with chronic poor glycemic control</strong> (evident by missed insulin doses and admission BG 275).</p>
  <p>Presents with <b>infected right great toe diabetic foot ulcer</b>. Also with hypertension and peripheral neuropathy. Currently on contact precautions for MRSA.</p>
  <p></p>

  <h2><u>Plan</u></h2>
      <ol class="list-decimal ml-6">
    <li><b>Admit</b> to Internal Medicine service.</li>
    <li>Continue q4h vital signs, ACHS BG monitoring. Notify parameters as per orders.</li>
    <li>Activity as tolerated, fall risk precautions.</li>
    <li><b>Infection Control:</b> Contact precautions for MRSA.</li>
    <li><b>Wound Care:</b> Daily NS cleansing, sterile dry dressing, topical antimicrobial. Monitor for worsening infection.</li>
    <li><b>Medications:</b>
      <ul class="list-disc ml-6">
        <li>Insulin lispro sliding scale ACHS</li>
        <li>Gabapentin 300 mg PO BID</li>
        <li>Lisinopril 10 mg PO daily</li>
      </ul>
    </li>
    <li><b>Nutrition:</b> Diabetic diet, encourage fluids.</li>
    <li><b>Labs:</b> Daily BMP x3, HbA1c once (if not recent).</li>
    <li><b>Consults:</b> Case Management (discharge planning), Pharmacy (med review), Podiatry (ulcer management).</li>
    <li><b>Education:</b> Diabetes management, foot care, insulin adherence, MRSA precautions.</li>
  </ol>
  <p></p>
`,
    excludedFromPresim: true
  },
];