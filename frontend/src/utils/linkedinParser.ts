/**
 * Parse LinkedIn experience text and extract structured data
 * 
 * Expected formats:
 * - Company Name
 * - Role/Position
 * - Dates (e.g., "Jan 2020 - Dec 2022", "Jan 2020 - Present")
 * - Location (optional)
 * - Description
 */

interface ParsedExperience {
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
}

const monthMap: Record<string, string> = {
  'jan': '01', 'january': '01',
  'feb': '02', 'february': '02',
  'mar': '03', 'march': '03',
  'apr': '04', 'april': '04',
  'may': '05',
  'jun': '06', 'june': '06',
  'jul': '07', 'july': '07',
  'aug': '08', 'august': '08',
  'sep': '09', 'sept': '09', 'september': '09',
  'oct': '10', 'october': '10',
  'nov': '11', 'november': '11',
  'dec': '12', 'december': '12',
};

function parseDate(dateStr: string): string {
  // Remove extra whitespace
  dateStr = dateStr.trim().toLowerCase();
  
  // Handle "present" or "current"
  if (dateStr.includes('present') || dateStr.includes('current')) {
    return '';
  }
  
  // Try to match "Month Year" format (e.g., "Jan 2020", "January 2020")
  const monthYearMatch = dateStr.match(/(\w+)\s+(\d{4})/);
  if (monthYearMatch) {
    const [, month, year] = monthYearMatch;
    const monthNum = monthMap[month.toLowerCase()];
    if (monthNum) {
      return `${year}-${monthNum}`;
    }
  }
  
  // Try to match "Year-Month" format (e.g., "2020-01")
  const isoMatch = dateStr.match(/(\d{4})-(\d{2})/);
  if (isoMatch) {
    return dateStr;
  }
  
  // Try to match just year (e.g., "2020")
  const yearMatch = dateStr.match(/(\d{4})/);
  if (yearMatch) {
    return `${yearMatch[1]}-01`;
  }
  
  return '';
}

export function parseLinkedInExperience(text: string): ParsedExperience | null {
  if (!text || text.trim().length === 0) {
    return null;
  }
  
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  if (lines.length < 2) {
    return null;
  }
  
  // Initialize result
  const result: ParsedExperience = {
    name: '',
    role: '',
    startDate: '',
    endDate: '',
    location: '',
    description: '',
  };
  
  let currentLine = 0;
  
  // First non-empty line is usually the role/position
  result.role = lines[currentLine++];
  
  // Second line is usually the company name
  if (currentLine < lines.length) {
    result.name = lines[currentLine++];
  }
  
  // Look for date range (usually contains "-" or "to")
  for (let i = currentLine; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if line contains date pattern
    if (line.match(/\d{4}/) || line.toLowerCase().includes('present') || line.toLowerCase().includes('current')) {
      // Try to parse date range (e.g., "Jan 2020 - Dec 2022" or "Jan 2020 - Present")
      const dateRangeMatch = line.match(/(.+?)\s*[-–—]\s*(.+)/);
      if (dateRangeMatch) {
        const [, start, end] = dateRangeMatch;
        result.startDate = parseDate(start);
        result.endDate = parseDate(end);
        currentLine = i + 1;
        break;
      }
      
      // Single date (probably start date)
      result.startDate = parseDate(line);
      currentLine = i + 1;
      break;
    }
  }
  
  // Look for location (usually contains city/country or "Remote")
  if (currentLine < lines.length) {
    const line = lines[currentLine];
    // Check if line looks like a location (contains comma, or common location keywords)
    if (line.includes(',') || line.toLowerCase().includes('remote') || 
        line.toLowerCase().includes('hybrid') || line.match(/^[A-Z][a-z]+,?\s+[A-Z]/)) {
      result.location = line;
      currentLine++;
    }
  }
  
  // Rest is description
  if (currentLine < lines.length) {
    result.description = lines.slice(currentLine).join('\n');
  }
  
  // Validate required fields
  if (!result.name || !result.role) {
    return null;
  }
  
  return result;
}

/**
 * Parse multiple experiences from LinkedIn export
 */
export function parseMultipleExperiences(text: string): ParsedExperience[] {
  // Split by common separators between experiences
  const experiences: ParsedExperience[] = [];
  
  // Try to split by common patterns (e.g., multiple newlines, or repeating company patterns)
  const sections = text.split(/\n\s*\n\s*\n/); // Split by 2+ empty lines
  
  for (const section of sections) {
    const parsed = parseLinkedInExperience(section);
    if (parsed) {
      experiences.push(parsed);
    }
  }
  
  return experiences;
}
