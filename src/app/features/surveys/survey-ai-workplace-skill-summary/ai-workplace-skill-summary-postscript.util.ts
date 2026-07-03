export interface AiWorkplaceSkillSummaryPostscriptInput {
  surveyTitle: string;
  submittedAt: string;
  email: string;
  wantsFollowUpSurvey: boolean;
  ageRange: string;
  primaryIndustry: string;
  baselineEssentials: {
    highSchool: string[];
    college: string[];
    nonDegreed: string[];
  };
  graduatePreparedness: {
    highSchool: string;
    college: string;
    nonDegreed: string;
  };
  expectedSupervision: {
    highSchool: string;
    college: string;
    nonDegreed: string;
  };
  aiProficiencyImpact: string[];
}

const LEFT_MARGIN = 72;
const TOP_MARGIN = 720;
const BOTTOM_MARGIN = 72;
const BODY_LINE_HEIGHT = 14;
const HEADING_LINE_HEIGHT = 18;
const SECTION_GAP = 8;

class PostscriptDocumentBuilder {
  private readonly output: string[] = [];
  private y = TOP_MARGIN;

  constructor(title: string) {
    this.output.push('%!PS-Adobe-3.0');
    this.output.push(`%%Title: ${title}`);
    this.output.push('%%Creator: CLBHub Admin');
    this.output.push('%%EndComments');
    this.output.push('');
    this.output.push('/FBody /Helvetica findfont 11 scalefont def');
    this.output.push('/FHeading /Helvetica-Bold findfont 13 scalefont def');
    this.output.push('/FSubheading /Helvetica-Bold findfont 11 scalefont def');
    this.output.push(`${LEFT_MARGIN} ${this.y} moveto`);
  }

  build(): string {
    this.output.push('showpage');
    this.output.push('%%EOF');
    return this.output.join('\n');
  }

  addTitle(text: string): void {
    this.ensureSpace(HEADING_LINE_HEIGHT + SECTION_GAP);
    this.setFont('FHeading');
    this.emitWrappedLines([text], HEADING_LINE_HEIGHT, true);
    this.y -= SECTION_GAP;
  }

  addSectionHeading(text: string): void {
    this.ensureSpace(HEADING_LINE_HEIGHT + 4);
    this.y -= 4;
    this.setFont('FSubheading');
    this.emitWrappedLines([text], HEADING_LINE_HEIGHT, true);
  }

  addLabelValue(label: string, value: string): void {
    this.setFont('FBody');
    this.emitWrappedLines([`${label}: ${value}`], BODY_LINE_HEIGHT);
  }

  addBulletList(label: string, items: string[]): void {
    this.setFont('FBody');
    if (label) {
      this.emitWrappedLines([`${label}:`], BODY_LINE_HEIGHT);
    }
    const bulletLines = items.length
      ? items.map((item) => `• ${item}`)
      : ['• None selected'];
    this.emitWrappedLines(bulletLines, BODY_LINE_HEIGHT);
  }

  addBlankLine(): void {
    this.y -= BODY_LINE_HEIGHT;
  }

  private setFont(fontName: string): void {
    this.output.push(`${fontName} setfont`);
  }

  private ensureSpace(requiredHeight: number): void {
    if (this.y - requiredHeight >= BOTTOM_MARGIN) {
      return;
    }
    this.output.push('showpage');
    this.y = TOP_MARGIN;
    this.output.push(`${LEFT_MARGIN} ${this.y} moveto`);
  }

  private emitWrappedLines(lines: string[], lineHeight: number, isHeading = false): void {
    const maxChars = isHeading ? 64 : 78;
    for (const rawLine of lines) {
      for (const wrapped of wrapText(rawLine, maxChars)) {
        this.ensureSpace(lineHeight);
        this.output.push(`${LEFT_MARGIN} ${this.y} moveto`);
        this.output.push(`(${escapePostscriptString(wrapped)}) show`);
        this.y -= lineHeight;
      }
    }
  }
}

export function buildAiWorkplaceSkillSummaryPostscript(
  input: AiWorkplaceSkillSummaryPostscriptInput,
): string {
  const builder = new PostscriptDocumentBuilder(input.surveyTitle);

  builder.addTitle(input.surveyTitle);
  builder.addLabelValue('Submitted', input.submittedAt || '—');
  builder.addBlankLine();

  builder.addSectionHeading('Attendee Information');
  builder.addLabelValue(
    'Follow-up survey',
    input.wantsFollowUpSurvey ? 'Requested' : 'Not requested',
  );
  builder.addLabelValue('Age range', input.ageRange || '—');
  builder.addLabelValue('Email', input.email || '—');
  builder.addBlankLine();

  builder.addSectionHeading('Part 1: Industry & Demographics');
  builder.addLabelValue('Primary industry', input.primaryIndustry || '—');
  builder.addBlankLine();

  builder.addSectionHeading('Part 2: Core Readiness');
  builder.addBulletList('Essential for High School Graduates', input.baselineEssentials.highSchool);
  builder.addBulletList('Essential for College Graduates', input.baselineEssentials.college);
  builder.addBlankLine();

  builder.addSectionHeading('Part 2a: Core Readiness - Other');
  builder.addBulletList('Non-Traditional Job Seekers', input.baselineEssentials.nonDegreed);
  builder.addBlankLine();

  builder.addSectionHeading('Part 3a: Performance & Onboarding Expectations');
  builder.addLabelValue(
    'Non-Traditional Job Seeker Preparedness',
    input.graduatePreparedness.nonDegreed || '—',
  );
  builder.addLabelValue(
    'Expected Supervision — Non-Traditional',
    input.expectedSupervision.nonDegreed || '—',
  );
  builder.addBlankLine();

  builder.addSectionHeading('Part 3: Performance & Onboarding');
  builder.addLabelValue(
    'High School Graduate Preparedness',
    input.graduatePreparedness.highSchool || '—',
  );
  builder.addLabelValue(
    'College Graduate Preparedness',
    input.graduatePreparedness.college || '—',
  );
  builder.addLabelValue(
    'Expected Supervision — High School',
    input.expectedSupervision.highSchool || '—',
  );
  builder.addLabelValue(
    'Expected Supervision — College',
    input.expectedSupervision.college || '—',
  );
  builder.addBlankLine();

  builder.addSectionHeading('Part 4: Market Value');
  builder.addBulletList('AI proficiency impact on hiring', input.aiProficiencyImpact);

  return builder.build();
}

export function downloadPostscriptDocument(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'application/postscript' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.ps') ? filename : `${filename}.ps`;
  link.click();
  URL.revokeObjectURL(url);
}

function escapePostscriptString(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function wrapText(text: string, maxChars: number): string[] {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (!normalized) {
    return ['—'];
  }
  if (normalized.length <= maxChars) {
    return [normalized];
  }

  const words = normalized.split(' ');
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars) {
      current = candidate;
      continue;
    }
    if (current) {
      lines.push(current);
    }
    current = word.length > maxChars ? word.slice(0, maxChars) : word;
  }

  if (current) {
    lines.push(current);
  }

  return lines.length ? lines : ['—'];
}
