# LinkedIn Import Feature

## Overview

The Career Timeline app now includes a LinkedIn import feature that allows you to quickly add your work experience by copying and pasting directly from your LinkedIn profile.

## How to Use

### Step 1: Access the Import Feature

1. Navigate to the "Your Journey" page (Companies Page)
2. Click the **"Import from LinkedIn"** button (blue button with LinkedIn icon)

### Step 2: Copy Your LinkedIn Experience

On LinkedIn, go to your profile and copy the text for a work experience. Include:
- Your job title/role
- Company name
- Employment dates
- Location
- Job description

### Step 3: Paste and Parse

1. Paste the copied text into the textarea in the import modal
2. Click **"Parse & Import"**
3. The system will automatically extract and populate:
   - Company Name
   - Your Role
   - Start Date (formatted as YYYY-MM)
   - End Date (formatted as YYYY-MM, or left empty for current positions)
   - Location
   - Description

### Step 4: Review and Save

1. Review the auto-filled form
2. Make any necessary adjustments
3. Click **"Add Experience"** to save

## Supported Date Formats

The parser recognizes various date formats:

- **Month Year**: "Jan 2020", "January 2020"
- **Year-Month**: "2020-01"
- **Year Only**: "2020" (defaults to January)
- **Current Position**: "Present", "Current"

### Date Range Examples

- `Jan 2020 - Dec 2022`
- `January 2020 - Present`
- `2020-01 - 2022-12`
- `Jan 2020 - Current`

## Expected LinkedIn Text Format

```
Senior Software Engineer
Acme Corporation
Jan 2020 - Present
San Francisco, CA
Led development of microservices architecture using Node.js and React.
Managed a team of 5 engineers and delivered 3 major product releases.
```

## Tips for Best Results

1. **Copy exactly as shown on LinkedIn**: Include role, company, dates, location, and description in order
2. **One experience at a time**: Import one job at a time for best accuracy
3. **Review before saving**: Always review the parsed data to ensure accuracy
4. **Edit if needed**: You can manually edit any field after import

## Troubleshooting

### "Could not parse LinkedIn data" Error

This error occurs when the system cannot identify the required fields. Make sure your text includes:
- At least a role/position (first line)
- Company name (second line)

Try reformatting your text to match the expected format shown in the modal.

### Dates Not Parsing Correctly

- Ensure dates include both month and year
- Use common date formats (e.g., "Jan 2020" not "1/2020")
- Use "-" or "to" to separate date ranges

### Missing Location or Description

These fields are optional. If not detected, you can manually add them in the form after import.

## Future Enhancements

Planned improvements for the LinkedIn import feature:

- Support for bulk import (multiple experiences at once)
- Import from LinkedIn PDF export
- Automatic extraction of skills and technologies
- Import project details within each experience
