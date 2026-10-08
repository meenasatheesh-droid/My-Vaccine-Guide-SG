/**
 * Central Evidence Layer and Deterministic NAIS Rule Engine
 * Source: NAIS Sept 2025 PDF & MOH Subsidy Guidelines
 */

export const NAIS_VACCINES = [
  {
    id: 'PNEUMO_PCV20',
    name: 'Pneumococcal Conjugate Vaccine (PCV20 / Prevenar 20)',
    diseaseTarget: 'Streptococcus pneumoniae (Invasive Pneumococcal Disease & Pneumonia)',
    naisStatus: 'Included in NAIS Sept 2025',
    evidenceLocator: 'NAIS Sept 2025 PDF Table 1, Page 2 & Footnote 4',
    sourceId: 'NAIS_SEPT_2025',
    clinicalRecommendation: 'Recommended for all adults aged 65 years and older, OR adults aged 18-64 with high-risk medical conditions (e.g., chronic heart/lung/kidney/liver disease, diabetes, immunocompromising conditions, anatomical/functional asplenia, CSF leaks, cochlear implants).',
    scheduleAndIntervals: 'Single dose. For PCV-naive adults 65+, 1 dose of PCV20 alone completes the adult pneumococcal schedule (PPSV23 is no longer routinely required following PCV20 in immunocompetent older adults under revised NAIS Sept 2025 guidelines). If prior PPSV23 was received, give PCV20 at least 1 year later.',
    distinctProductNote: 'PCV20 is a distinct 20-valent conjugate vaccine with expanded serotype coverage. Must not be interchanged indiscriminately with PCV13 or PPSV23 without verifying prior vaccine history.',
    contraindications: 'Severe allergic reaction (anaphylaxis) to any component of PCV20 or diphtheria toxoid.',
    subsidyEligibility: {
      healthierSg: 'Subsidised ($0 co-payment) for eligible Singapore Citizens enrolled in Healthier SG when received at their enrolled Healthier SG clinic.',
      chasGp: 'Subsidised under CHAS for eligible Singapore Citizens at CHAS GP clinics (co-payment capped per tier: Pioneer Gen, Merdeka Gen, CHAS Blue/Orange).',
      polyclinic: 'Subsidised for Singapore Citizens and Permanent Residents at public polyclinics.'
    }
  },
  {
    id: 'PNEUMO_PCV13_PPSV23',
    name: 'Pneumococcal Sequential Schedule (PCV13 followed by PPSV23)',
    diseaseTarget: 'Streptococcus pneumoniae (Pneumococcal Disease)',
    naisStatus: 'Included in NAIS Sept 2025 (Alternative Sequential Pathway)',
    evidenceLocator: 'NAIS Sept 2025 PDF Table 1, Page 2 & Footnote 5',
    sourceId: 'NAIS_SEPT_2025',
    clinicalRecommendation: 'Recommended for adults 65+ or adults 18-64 with specified chronic/immunocompromising conditions who receive PCV13 instead of PCV20.',
    scheduleAndIntervals: 'Sequential administration: 1 dose of PCV13, followed by 1 dose of PPSV23 at least 1 year later (or at least 8 weeks later for immunocompromised adults). A second PPSV23 dose 5 years after the first PPSV23 is recommended only for specified high-risk conditions.',
    distinctProductNote: 'Requires tracking 2 distinct vaccines (PCV13 conjugate + PPSV23 polysaccharide) and strictly observing minimum interval of 1 year (or 8 weeks for immunocompromised).',
    contraindications: 'Anaphylaxis to vaccine components.',
    subsidyEligibility: {
      healthierSg: 'Subsidised for eligible Singapore Citizens enrolled in Healthier SG at enrolled clinic.',
      chasGp: 'CHAS subsidized co-payment caps apply at participating GP clinics.',
      polyclinic: 'Subsidised rates for SC / PR at polyclinics.'
    }
  },
  {
    id: 'INFLUENZA',
    name: 'Influenza Vaccine (Annual Quadrivalent)',
    diseaseTarget: 'Influenza A and B Viruses',
    naisStatus: 'Included in NAIS Sept 2025',
    evidenceLocator: 'NAIS Sept 2025 PDF Table 1, Page 1',
    sourceId: 'NAIS_SEPT_2025',
    clinicalRecommendation: 'Recommended annually for all persons aged 65 years and older; adults with chronic medical conditions (asthma, COPD, chronic heart/liver/renal conditions, diabetes); adults with weakened immune systems; and pregnant women at any stage of pregnancy.',
    scheduleAndIntervals: '1 dose annually (seasonal formulation aligned with southern/northern hemisphere updates per HSA/MOH guidance).',
    distinctProductNote: 'Annual repeat required due to circulating strain mutation.',
    contraindications: 'History of severe allergic reaction to previous flu dose. Precautions for moderate/severe acute febrile illness.',
    subsidyEligibility: {
      healthierSg: '$0 co-payment for eligible enrolled Singapore Citizens at their enrolled Healthier SG clinic.',
      chasGp: 'Subsidised co-payment caps at CHAS GP clinics for eligible target populations (CHAS Blue/Orange, PG, MG).',
      polyclinic: 'Subsidised at polyclinics for target high-risk groups.'
    }
  },
  {
    id: 'SHINGLES_RZV',
    name: 'Herpes Zoster / Shingles Vaccine (Recombinant Zoster Vaccine - Shingrix)',
    diseaseTarget: 'Varicella-Zoster Virus reactivation (Herpes Zoster & Postherpetic Neuralgia)',
    naisStatus: 'Included in NAIS Sept 2025',
    evidenceLocator: 'NAIS Sept 2025 PDF Table 1, Page 3 & Footnote 8',
    sourceId: 'NAIS_SEPT_2025',
    clinicalRecommendation: 'Recommended for immunocompetent adults aged 50 years and older, and immunocompromised adults aged 19 years and older at increased risk.',
    scheduleAndIntervals: '2-dose series administered intramuscularly: second dose given 2 to 6 months after dose 1 (or 1 to 2 months after dose 1 for immunocompromised adults).',
    distinctProductNote: 'Recombinant non-live adjuvanted vaccine (RZV). Can be given to individuals who previously received live zoster vaccine or had shingles.',
    contraindications: 'Severe allergic reaction to any component of Shingrix. Delay if suffering from acute shingles episode until rash resolves.',
    subsidyEligibility: {
      healthierSg: 'Subsidised under Healthier SG for eligible cohorts (MOH enhanced subsidies roll-out per published policy). MediSave claimable under specified limits.',
      chasGp: 'MediSave 500/700 use allowed for approved indications at accredited clinics.',
      polyclinic: 'Subject to polyclinic formulary and prevailing subsidy tier.'
    }
  },
  {
    id: 'TDAP_PREGNANCY',
    name: 'Tdap Vaccine (Tetanus, Reduced Diphtheria, Acellular Pertussis)',
    diseaseTarget: 'Bordetella pertussis (Whooping cough), Clostridium tetani, Corynebacterium diphtheriae',
    naisStatus: 'Included in NAIS Sept 2025',
    evidenceLocator: 'NAIS Sept 2025 PDF Table 1, Page 1 & Table 2 Maternal Schedule',
    sourceId: 'NAIS_SEPT_2025',
    clinicalRecommendation: 'Recommended for all pregnant women during each pregnancy (ideally between 16 and 32 weeks of gestation) to transfer protective maternal antibodies to newborn. Also recommended for adults who have never received Tdap, and healthcare workers/infant caregivers.',
    scheduleAndIntervals: '1 dose during each pregnancy (optimal 16-32 weeks). For non-pregnant adults without prior Tdap, 1 single booster dose, with Td booster every 10 years.',
    distinctProductNote: 'Formulated with reduced diphtheria (d) and acellular pertussis (ap) suitable for adults.',
    contraindications: 'Encephalopathy not attributable to another identifiable cause within 7 days of previous pertussis vaccine.',
    subsidyEligibility: {
      healthierSg: 'Subsidised for enrolled Singapore Citizens at enrolled clinic.',
      chasGp: 'Subsidised under national schemes for eligible pregnant Singapore Citizens.',
      polyclinic: 'Subsidised at public healthcare institutions and polyclinics.'
    }
  },
  {
    id: 'HEPATITIS_B',
    name: 'Hepatitis B Vaccine',
    diseaseTarget: 'Hepatitis B Virus (Chronic Liver Disease & Hepatocellular Carcinoma)',
    naisStatus: 'Included in NAIS Sept 2025',
    evidenceLocator: 'NAIS Sept 2025 PDF Table 1, Page 2',
    sourceId: 'NAIS_SEPT_2025',
    clinicalRecommendation: 'Recommended for all adults without prior documented vaccination or evidence of immunity (anti-HBs < 10 mIU/mL), especially healthcare workers, contacts of chronic carriers, persons with chronic liver/kidney disease, and adults with diabetes.',
    scheduleAndIntervals: '3-dose primary series at 0, 1, and 6 months.',
    distinctProductNote: 'Requires screening (HBsAg and anti-HBs serology) before vaccination if status is uncertain.',
    contraindications: 'Anaphylaxis to baker\'s yeast or any vaccine component.',
    subsidyEligibility: {
      healthierSg: 'Subsidised for enrolled SC at enrolled clinic when medically indicated.',
      chasGp: 'Subsidies apply for high-risk indications at CHAS clinics.',
      polyclinic: 'Subsidised at polyclinics.'
    }
  },
  {
    id: 'MMR',
    name: 'MMR Vaccine (Measles, Mumps, Rubella)',
    diseaseTarget: 'Measles, Mumps, and Rubella Viruses',
    naisStatus: 'Included in NAIS Sept 2025',
    evidenceLocator: 'NAIS Sept 2025 PDF Table 1, Page 1',
    sourceId: 'NAIS_SEPT_2025',
    clinicalRecommendation: 'Recommended for non-immune adults born in or after 1975, healthcare personnel, and women of childbearing age prior to conception (rubella prevention).',
    scheduleAndIntervals: '1 or 2 doses (administered at least 4 weeks apart if 2 doses needed).',
    distinctProductNote: 'Live attenuated virus vaccine. Contraindicated in pregnancy; avoid pregnancy for 1 month following dose.',
    contraindications: 'Pregnancy, severe immunocompromise (e.g., severe cellular immunodeficiency, advanced HIV).',
    subsidyEligibility: {
      healthierSg: 'Fully subsidised ($0) for eligible enrolled Singapore Citizens.',
      chasGp: 'Subsidised at CHAS GP clinics.',
      polyclinic: 'Subsidised at polyclinics.'
    }
  },
  {
    id: 'HPV',
    name: 'HPV Vaccine (Human Papillomavirus - 9-valent / 4-valent / 2-valent)',
    diseaseTarget: 'High-risk HPV types (Cervical, Vulvar, Vaginal, Anal Cancers and Genital Warts)',
    naisStatus: 'Included in NAIS Sept 2025',
    evidenceLocator: 'NAIS Sept 2025 PDF Table 1, Page 2',
    sourceId: 'NAIS_SEPT_2025',
    clinicalRecommendation: 'Recommended for females aged 18 to 26 years who have not previously completed the series. (Under NAIS, HPV is specifically indicated for females up to age 26).',
    scheduleAndIntervals: '3-dose schedule at 0, 2, and 6 months for adults aged 15-26.',
    distinctProductNote: 'Subsidised under national programmes for eligible females aged 18-26. Not routinely subsidised under NAIS for males.',
    contraindications: 'Severe allergy to vaccine components or yeast.',
    subsidyEligibility: {
      healthierSg: 'Subsidised under national women\'s health framework for eligible female Singapore Citizens.',
      chasGp: 'CHAS subsidies and MediSave claimable for females aged 18-26.',
      polyclinic: 'Subsidised for eligible female Singapore Citizens.'
    }
  }
];

export const PUBMED_EVIDENCE_RECORDS = [
  {
    pmid: '34665487',
    title: 'Safety and immunogenicity of a 20-valent pneumococcal conjugate vaccine in adults 65 years of age and older',
    authors: 'Essink B, et al.',
    journal: 'Clin Infect Dis',
    publicationYear: 2022,
    studyDesign: 'Phase 3 randomized active-controlled trial',
    population: 'Adults aged 65 years and older (immunocompetent)',
    endpoint: 'Opsonophagocytic activity (OPA) geometric mean titers against 20 vaccine serotypes',
    findingSummary: 'PCV20 demonstrated non-inferior immunogenicity compared to PCV13 for 13 shared serotypes and robust immune responses for 7 additional serotypes, with a comparable safety and tolerability profile.',
    limitations: 'Immunogenicity surrogate endpoint; did not measure clinical pneumonia incidence directly in this trial cohort.',
    retrievalDepth: 'Abstract and published open summary'
  },
  {
    pmid: '30248473',
    title: 'Efficacy and safety of the adjuvanted recombinant zoster vaccine in older adults: systematic review and meta-analysis',
    authors: 'Tricco AC, et al.',
    journal: 'BMJ',
    publicationYear: 2018,
    studyDesign: 'Systematic review and network meta-analysis of randomized controlled trials',
    population: 'Adults aged 50 years and older',
    endpoint: 'Incidence of herpes zoster and postherpetic neuralgia',
    findingSummary: 'Recombinant zoster vaccine (Shingrix, 2 doses) exhibited high vaccine efficacy (>90%) against herpes zoster across age strata 50-69 and 70+, sustained over years, with transient injection site reactogenicity.',
    limitations: 'Systematic review of controlled trial populations; real-world persistence beyond 10 years under ongoing longitudinal evaluation.',
    retrievalDepth: 'Abstract and systematic evidence table'
  },
  {
    pmid: '25257962',
    title: 'Maternal vaccination against pertussis: effectiveness in protecting young infants',
    authors: 'Amirthalingam G, et al.',
    journal: 'Lancet',
    publicationYear: 2014,
    studyDesign: 'Observational national cohort and case-control study',
    population: 'Infants aged <3 months born to mothers vaccinated with Tdap in pregnancy',
    endpoint: 'Vaccine effectiveness against infant laboratory-confirmed pertussis disease',
    findingSummary: 'Maternal Tdap vaccination administered between 28 and 38 weeks of gestation (now recommended 16-32 weeks) was estimated at >90% effective in preventing infant pertussis in the first 2 months of life.',
    limitations: 'Observational surveillance design; optimal timing window updated to 16-32 weeks in modern guidelines.',
    retrievalDepth: 'Abstract and surveillance report'
  }
];

/**
 * Deterministic Evaluator for NAIS Vaccines & Subsidies
 * Strictly uses 3 states:
 * - MATCHES_CRITERIA ("May meet published criteria; confirm with your clinic.")
 * - DOES_NOT_MATCH ("Does not meet published criteria based on provided information.")
 * - INSUFFICIENT_INFO ("Insufficient information to assess.")
 */
export function evaluateVaccineSuitability(profile, vaccineId) {
  const {
    age,
    citizenship, // 'SC' (Singapore Citizen), 'PR', 'OTHER', or null
    healthierSgStatus, // 'ENROLLED_AT_ENROLLED_CLINIC', 'ENROLLED_OTHER_CLINIC', 'NOT_ENROLLED', or null
    subsidyTier, // 'PIONEER', 'MERDEKA', 'CHAS_BLUE', 'CHAS_ORANGE', 'CHAS_GREEN', 'NONE', or null
    hasChronicCondition, // boolean or null
    chronicConditions = [], // array of condition keys
    isImmunocompromised, // boolean or null
    isPregnant, // boolean or null
    pneumoHistory = null, // 'NEVER', 'PCV13_ONLY', 'PPSV23_ONLY', 'BOTH', 'UNKNOWN'
    fluThisSeason = null, // boolean or null
    shinglesDoses = null // 0, 1, 2, or null
  } = profile;

  // Validation: Check if fundamental age is provided
  if (age === null || age === undefined || isNaN(age)) {
    return {
      state: 'INSUFFICIENT_INFO',
      label: 'Insufficient Information',
      reason: 'Age is required to evaluate NAIS recommendations and subsidy rules.',
      ruleId: 'RULE_AGE_MISSING',
      evidenceLocator: 'NAIS Sept 2025 PDF Table 1'
    };
  }

  const numAge = Number(age);
  if (numAge < 18) {
    return {
      state: 'DOES_NOT_MATCH',
      label: 'Outside NAIS Adult Scope',
      reason: 'The National Adult Immunisation Schedule (NAIS) applies to adults aged 18 years and older. For individuals under 18, refer to the National Childhood Immunisation Schedule (NCIS).',
      ruleId: 'RULE_NCIS_AGE_LIMIT',
      evidenceLocator: 'NAIS Sept 2025 PDF Scope, Page 1'
    };
  }

  // --- PCV20 Evaluation ---
  if (vaccineId === 'PNEUMO_PCV20') {
    if (numAge >= 65) {
      // Age 65+ meets age criteria
      let subsidyMatch = getSubsidyDetermination(citizenship, healthierSgStatus, subsidyTier, 'PNEUMO');
      return {
        state: 'MATCHES_CRITERIA',
        label: 'May meet published criteria',
        clinicalNotice: 'Recommended under NAIS for adults aged 65 and older. If you have not previously received a pneumococcal conjugate vaccine, a single dose of PCV20 is recommended.',
        subsidyNotice: subsidyMatch.summary,
        coPaymentCap: subsidyMatch.coPaymentEstimate,
        ruleId: 'RULE_NAIS_PCV20_AGE65',
        evidenceLocator: 'NAIS Sept 2025 PDF Table 1, Page 2 & Footnote 4',
        providerAction: 'Confirm with your doctor whether you received prior PPSV23 or PCV13 to verify interval requirements.'
      };
    } else {
      // Age 18-64 requires chronic condition information
      if (hasChronicCondition === null || hasChronicCondition === undefined) {
        return {
          state: 'INSUFFICIENT_INFO',
          label: 'Insufficient Information',
          reason: 'For adults aged 18-64, PCV20 is recommended only for individuals with specific high-risk chronic conditions (e.g. chronic heart/lung/liver/kidney diseases, diabetes, or immunocompromise). Chronic condition status was not specified.',
          ruleId: 'RULE_NAIS_PCV_COND_UNKNOWN',
          evidenceLocator: 'NAIS Sept 2025 PDF Table 1, Page 2'
        };
      }
      if (hasChronicCondition === true) {
        let subsidyMatch = getSubsidyDetermination(citizenship, healthierSgStatus, subsidyTier, 'PNEUMO');
        return {
          state: 'MATCHES_CRITERIA',
          label: 'May meet published criteria',
          clinicalNotice: 'Recommended under NAIS for adults aged 18-64 with qualifying chronic or immunocompromising conditions.',
          subsidyNotice: subsidyMatch.summary,
          coPaymentCap: subsidyMatch.coPaymentEstimate,
          ruleId: 'RULE_NAIS_PCV20_CHRONIC1864',
          evidenceLocator: 'NAIS Sept 2025 PDF Table 1, Page 2 & Footnote 4',
          providerAction: 'Bring your medical condition history to your clinic to verify medical indication and prior vaccine timing.'
        };
      } else {
        return {
          state: 'DOES_NOT_MATCH',
          label: 'Does not meet published criteria',
          reason: 'Under NAIS, PCV20 is not routinely recommended for healthy adults aged 18-64 without specified high-risk medical conditions.',
          ruleId: 'RULE_NAIS_PCV20_NO_INDICATION',
          evidenceLocator: 'NAIS Sept 2025 PDF Table 1, Page 2'
        };
      }
    }
  }

  // --- Influenza Evaluation ---
  if (vaccineId === 'INFLUENZA') {
    const isTargetAge = numAge >= 65;
    const isPregnantTarget = isPregnant === true;
    const isChronicTarget = hasChronicCondition === true;

    if (hasChronicCondition === null && isPregnant === null && !isTargetAge) {
      return {
        state: 'INSUFFICIENT_INFO',
        label: 'Insufficient Information',
        reason: 'For adults aged 18-64, national subsidised flu vaccination recommendations depend on chronic disease status or pregnancy. Please indicate whether either applies.',
        ruleId: 'RULE_FLU_COND_UNKNOWN',
        evidenceLocator: 'NAIS Sept 2025 PDF Table 1, Page 1'
      };
    }

    if (isTargetAge || isPregnantTarget || isChronicTarget) {
      let subsidyMatch = getSubsidyDetermination(citizenship, healthierSgStatus, subsidyTier, 'FLU');
      return {
        state: 'MATCHES_CRITERIA',
        label: 'May meet published criteria',
        clinicalNotice: `Recommended annually under NAIS (${isTargetAge ? 'Age 65+' : isPregnantTarget ? 'Pregnancy indication' : 'Chronic health condition indication'}).`,
        subsidyNotice: subsidyMatch.summary,
        coPaymentCap: subsidyMatch.coPaymentEstimate,
        ruleId: 'RULE_NAIS_FLU_RECOMMENDED',
        evidenceLocator: 'NAIS Sept 2025 PDF Table 1, Page 1',
        providerAction: 'Consult your clinic regarding current seasonal formulation availability.'
      };
    } else {
      return {
        state: 'DOES_NOT_MATCH',
        label: 'Elective / Non-subsidised indication',
        reason: 'Healthy adults aged 18-64 without chronic conditions or pregnancy do not meet national subsidy criteria under NAIS, but may choose to receive influenza vaccination as an elective health protection at standard clinic charges.',
        ruleId: 'RULE_NAIS_FLU_ELECTIVE',
        evidenceLocator: 'NAIS Sept 2025 PDF Table 1, Page 1'
      };
    }
  }

  // --- Shingles Evaluation ---
  if (vaccineId === 'SHINGLES_RZV') {
    if (numAge >= 50) {
      let subsidyMatch = getSubsidyDetermination(citizenship, healthierSgStatus, subsidyTier, 'SHINGLES');
      return {
        state: 'MATCHES_CRITERIA',
        label: 'May meet published criteria',
        clinicalNotice: 'Recommended under NAIS for adults aged 50 years and older (2-dose series, 2 to 6 months apart).',
        subsidyNotice: subsidyMatch.summary,
        coPaymentCap: subsidyMatch.coPaymentEstimate,
        ruleId: 'RULE_NAIS_SHINGLES_AGE50',
        evidenceLocator: 'NAIS Sept 2025 PDF Table 1, Page 3 & Footnote 8',
        providerAction: 'Confirm with clinic whether your subsidy tier or MediSave allocation covers the 2-dose series.'
      };
    } else {
      if (isImmunocompromised === true) {
        return {
          state: 'MATCHES_CRITERIA',
          label: 'May meet published criteria',
          clinicalNotice: 'Recommended under NAIS for immunocompromised adults aged 19-49 years at increased risk of herpes zoster (2 doses, 1 to 2 months apart).',
          subsidyNotice: 'Subsidies depend on clinic setting and specialist review.',
          coPaymentCap: 'Check with clinic',
          ruleId: 'RULE_NAIS_SHINGLES_IMMUNO',
          evidenceLocator: 'NAIS Sept 2025 PDF Table 1, Page 3'
        };
      }
      return {
        state: 'DOES_NOT_MATCH',
        label: 'Does not meet published criteria',
        reason: 'Under NAIS, Shingrix is not routinely recommended for immunocompetent adults under 50 years of age.',
        ruleId: 'RULE_NAIS_SHINGLES_UNDER50',
        evidenceLocator: 'NAIS Sept 2025 PDF Table 1, Page 3'
      };
    }
  }

  // --- Tdap Evaluation ---
  if (vaccineId === 'TDAP_PREGNANCY') {
    if (isPregnant === true) {
      let subsidyMatch = getSubsidyDetermination(citizenship, healthierSgStatus, subsidyTier, 'TDAP');
      return {
        state: 'MATCHES_CRITERIA',
        label: 'May meet published criteria',
        clinicalNotice: 'Recommended during each pregnancy, ideally between 16 and 32 weeks of gestation, to protect both mother and newborn from pertussis (whooping cough).',
        subsidyNotice: subsidyMatch.summary,
        coPaymentCap: subsidyMatch.coPaymentEstimate,
        ruleId: 'RULE_NAIS_TDAP_PREG',
        evidenceLocator: 'NAIS Sept 2025 PDF Table 1 & Table 2 Maternal Schedule'
      };
    } else {
      return {
        state: 'DOES_NOT_MATCH',
        label: 'Routine pregnancy indication not active',
        reason: 'Recommended routinely for pregnant women (16-32 weeks) and adults without documented prior Tdap dose or who are close infant caregivers.',
        ruleId: 'RULE_NAIS_TDAP_NONPREG',
        evidenceLocator: 'NAIS Sept 2025 PDF Table 1, Page 1'
      };
    }
  }

  // --- HPV Evaluation ---
  if (vaccineId === 'HPV') {
    if (numAge >= 18 && numAge <= 26) {
      let subsidyMatch = getSubsidyDetermination(citizenship, healthierSgStatus, subsidyTier, 'HPV');
      return {
        state: 'MATCHES_CRITERIA',
        label: 'May meet published criteria',
        clinicalNotice: 'Recommended under NAIS for females aged 18 to 26 years who have not previously completed the HPV series.',
        subsidyNotice: subsidyMatch.summary,
        coPaymentCap: subsidyMatch.coPaymentEstimate,
        ruleId: 'RULE_NAIS_HPV_1826',
        evidenceLocator: 'NAIS Sept 2025 PDF Table 1, Page 2'
      };
    } else {
      return {
        state: 'DOES_NOT_MATCH',
        label: 'Does not meet published age range',
        reason: 'NAIS national target schedule for HPV covers females aged 18-26. Adults older than 26 may discuss individualized HPV vaccination with their clinician.',
        ruleId: 'RULE_NAIS_HPV_OVER26',
        evidenceLocator: 'NAIS Sept 2025 PDF Table 1, Page 2'
      };
    }
  }

  // Fallback for other vaccines
  return {
    state: 'INSUFFICIENT_INFO',
    label: 'Clinical Consultation Recommended',
    reason: 'Individualized evaluation requires review of your vaccination records and doctor consultation.',
    ruleId: 'RULE_GENERAL_CONSULT',
    evidenceLocator: 'NAIS Sept 2025 PDF Table 1'
  };
}

/**
 * Deterministic Subsidy Determination
 * Sourced strictly from MOH Healthier SG Vaccinations & CHAS Subsidies
 */
export function getSubsidyDetermination(citizenship, healthierSgStatus, subsidyTier, vaccineCategory) {
  if (!citizenship) {
    return {
      summary: 'Residency status required to estimate subsidy eligibility (Singapore Citizen, PR, or Non-Resident).',
      coPaymentEstimate: 'Subject to status verification',
      ruleId: 'SUB_CITIZENSHIP_REQUIRED'
    };
  }

  if (citizenship === 'OTHER') {
    return {
      summary: 'Government vaccination subsidies are reserved for Singapore Citizens and Permanent Residents. Non-residents pay full private clinic or polyclinic rates.',
      coPaymentEstimate: 'Full unsubsidised fee',
      ruleId: 'SUB_NON_RESIDENT'
    };
  }

  // If Singapore Citizen enrolled in Healthier SG and visiting enrolled clinic:
  if (citizenship === 'SC' && healthierSgStatus === 'ENROLLED_AT_ENROLLED_CLINIC') {
    return {
      summary: '$0 co-payment under Healthier SG for nationally recommended NAIS vaccinations when received at your enrolled Healthier SG clinic.',
      coPaymentEstimate: '$0 co-payment',
      ruleId: 'SUB_HEALTHIER_SG_ZERO_COPAY'
    };
  }

  // If Singapore Citizen visiting CHAS GP clinic:
  if (citizenship === 'SC') {
    if (subsidyTier === 'PIONEER') {
      return {
        summary: 'Pioneer Generation cardholders enjoy enhanced subsidies at CHAS GP clinics, with co-payments capped at maximum published rates (e.g. capped at ~$9 - $16 per dose for selected vaccines).',
        coPaymentEstimate: 'Pioneer Gen Capped Co-payment',
        ruleId: 'SUB_PIONEER_CHAS_CAP'
      };
    }
    if (subsidyTier === 'MERDEKA') {
      return {
        summary: 'Merdeka Generation cardholders receive enhanced subsidies at CHAS GP clinics, with co-payments capped at maximum published rates (e.g. capped at ~$18 - $31 per dose for selected vaccines).',
        coPaymentEstimate: 'Merdeka Gen Capped Co-payment',
        ruleId: 'SUB_MERDEKA_CHAS_CAP'
      };
    }
    if (subsidyTier === 'CHAS_BLUE' || subsidyTier === 'CHAS_ORANGE') {
      return {
        summary: 'CHAS Blue and Orange cardholders receive tiered vaccine subsidies at participating CHAS GP clinics, with maximum co-payments capped under MOH guidelines.',
        coPaymentEstimate: 'CHAS Subsidised Cap',
        ruleId: 'SUB_CHAS_BLUE_ORANGE_CAP'
      };
    }
    if (subsidyTier === 'CHAS_GREEN' || subsidyTier === 'NONE') {
      return {
        summary: 'General Singapore Citizens receive standard polyclinic subsidies, or standard Healthier SG $0 co-payment if enrolled and visiting their enrolled Healthier SG clinic.',
        coPaymentEstimate: 'Standard subsidised or $0 via Healthier SG enrolled clinic',
        ruleId: 'SUB_CHAS_GREEN_GENERAL'
      };
    }
  }

  if (citizenship === 'PR') {
    return {
      summary: 'Permanent Residents receive subsidized rates at public polyclinics for NAIS vaccines, but are not eligible for CHAS GP cash subsidies or Healthier SG $0 co-payment.',
      coPaymentEstimate: 'Polyclinic PR subsidised rate',
      ruleId: 'SUB_PR_POLYCLINIC'
    };
  }

  return {
    summary: 'Consult your clinic to determine applicable subsidy and MediSave eligibility based on your identity card.',
    coPaymentEstimate: 'Verify with clinic',
    ruleId: 'SUB_UNKNOWN'
  };
}
