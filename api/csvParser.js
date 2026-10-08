/**
 * Robust CSV parser and validator for National Population Health Survey dataset.
 * Strictly adheres to schema validation, BOM removal, "na" to null mapping, and atomic updates.
 */

import fs from 'fs';
import path from 'path';

export const EXPECTED_HEADERS = ['DataSeries', '2023', '2021', '2019', '2007', '2022', '2020', '2017', '2013', '2010'];
export const SORTED_YEARS = ['2007', '2010', '2013', '2017', '2019', '2020', '2021', '2022', '2023'];
export const DEFAULT_CSV_FILENAME = 'PrevalenceOfOverweightObesityDailySmokingHypertensionDiabetesMellitusHyperlipidaemiaSufficientTotalPhysicalActivityAndBingeDrinkingAmongResidentsAged1874Years(1).csv';

let currentDatasetState = null;

/**
 * Parses raw CSV string handling quotes, newlines, and BOM
 */
export function parseCsvRaw(csvText) {
  // Strip BOM if present
  let cleanText = csvText.replace(/^\uFEFF/, '');
  const lines = [];
  let currentLine = [];
  let currentField = '';
  let insideQuote = false;

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

    if (char === '"') {
      if (insideQuote && nextChar === '"') {
        currentField += '"';
        i++; // skip escaped quote
      } else {
        insideQuote = !insideQuote;
      }
    } else if (char === ',' && !insideQuote) {
      currentLine.push(currentField.trim());
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !insideQuote) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentLine.push(currentField.trim());
      if (currentLine.some(f => f.length > 0)) {
        lines.push(currentLine);
      }
      currentLine = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }

  if (currentField.length > 0 || currentLine.length > 0) {
    currentLine.push(currentField.trim());
    if (currentLine.some(f => f.length > 0)) {
      lines.push(currentLine);
    }
  }

  return lines;
}

/**
 * Validates and normalises CSV content
 */
export function validateAndNormaliseCsv(csvText, filename = DEFAULT_CSV_FILENAME) {
  const errors = [];
  const lines = parseCsvRaw(csvText);

  if (lines.length === 0) {
    return { valid: false, errors: ['CSV content is empty.'] };
  }

  const headers = lines[0];
  if (headers.length !== EXPECTED_HEADERS.length) {
    errors.push(`Header count mismatch: expected ${EXPECTED_HEADERS.length}, found ${headers.length}.`);
  }

  for (let c = 0; c < EXPECTED_HEADERS.length; c++) {
    if (headers[c] !== EXPECTED_HEADERS[c]) {
      errors.push(`Header column ${c} mismatch: expected "${EXPECTED_HEADERS[c]}", found "${headers[c]}".`);
    }
  }

  const dataRows = lines.slice(1);
  if (dataRows.length !== 27) {
    errors.push(`Expected exactly 27 data rows, but found ${dataRows.length} rows.`);
  }

  const seriesSeen = new Set();
  const normalisedRecords = [];
  const seriesSummaries = [];

  for (let r = 0; r < dataRows.length; r++) {
    const row = dataRows[r];
    const inputRowNum = r + 2;

    if (row.length !== headers.length) {
      errors.push(`Row ${inputRowNum} length mismatch: expected ${headers.length} columns, found ${row.length}.`);
      continue;
    }

    const seriesName = row[0];
    if (!seriesName) {
      errors.push(`Row ${inputRowNum} has empty DataSeries.`);
      continue;
    }

    if (seriesSeen.has(seriesName)) {
      errors.push(`Duplicate DataSeries name found: "${seriesName}".`);
    }
    seriesSeen.add(seriesName);

    const yearData = {};
    let latestNonNullYear = null;
    let latestNonNullValue = null;

    // We process each year column in the row
    for (let c = 1; c < headers.length; c++) {
      const year = headers[c];
      const rawCell = row[c];
      let numValue = null;

      if (rawCell.toLowerCase() === 'na' || rawCell === '' || rawCell === '-') {
        numValue = null;
      } else {
        const parsed = Number(rawCell);
        if (isNaN(parsed)) {
          errors.push(`Row ${inputRowNum} (${seriesName}), Column "${year}": invalid numeric value "${rawCell}".`);
        } else {
          numValue = parsed;
        }
      }

      const record = {
        dataSeries: seriesName,
        year,
        numericValue: numValue,
        rawCellText: rawCell,
        sourceFilename: filename,
        inputRow: inputRowNum,
        originalColumn: c
      };
      normalisedRecords.push(record);
      yearData[year] = { value: numValue, raw: rawCell };
    }

    // Determine latest non-null year by sorting years chronologically descending
    const sortedDescYears = [...SORTED_YEARS].reverse();
    for (const yr of sortedDescYears) {
      if (yearData[yr] && yearData[yr].value !== null) {
        latestNonNullYear = yr;
        latestNonNullValue = yearData[yr].value;
        break;
      }
    }

    seriesSummaries.push({
      seriesName,
      inputRow: inputRowNum,
      latestYear: latestNonNullYear,
      latestValue: latestNonNullValue,
      yearsData: yearData,
      sortedHistory: SORTED_YEARS.map(yr => ({
        year: yr,
        value: yearData[yr] ? yearData[yr].value : null,
        raw: yearData[yr] ? yearData[yr].raw : 'na'
      }))
    });
  }

  const isValid = errors.length === 0;

  return {
    valid: isValid,
    errors,
    data: isValid ? {
      filename,
      importedAt: new Date().toISOString(),
      rowCount: dataRows.length,
      headers,
      seriesCount: seriesSummaries.length,
      series: seriesSummaries,
      records: normalisedRecords,
      noteOnUnits: 'Values represent survey estimates as documented in NPHS 18-74 years. Unit confirmation: percentage (%) per official NPHS methodology.'
    } : null
  };
}

/**
 * Loads and caches the primary dataset from disk
 */
export function loadPrimaryDataset() {
  if (currentDatasetState && currentDatasetState.valid) {
    return currentDatasetState;
  }

  const csvPath = path.resolve(process.cwd(), DEFAULT_CSV_FILENAME);
  if (!fs.existsSync(csvPath)) {
    return {
      valid: false,
      errors: [`Default dataset file not found at ${csvPath}`]
    };
  }

  try {
    const content = fs.readFileSync(csvPath, 'utf8');
    const result = validateAndNormaliseCsv(content, DEFAULT_CSV_FILENAME);
    if (result.valid) {
      currentDatasetState = result;
    }
    return result;
  } catch (err) {
    return {
      valid: false,
      errors: [`Error reading dataset: ${err.message}`]
    };
  }
}

/**
 * Atomic update of dataset
 */
export function updateDataset(newCsvText, newFilename) {
  const validation = validateAndNormaliseCsv(newCsvText, newFilename);
  if (!validation.valid) {
    return {
      success: false,
      errors: validation.errors,
      activeVersion: currentDatasetState?.data?.filename || DEFAULT_CSV_FILENAME
    };
  }

  // Atomically update in-memory state
  currentDatasetState = validation;
  return {
    success: true,
    data: validation.data
  };
}
