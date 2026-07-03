import { jsPDF } from 'jspdf';

export interface AiWorkplaceSkillSummaryPdfInput {
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

const LEFT_MARGIN = 20;
const RIGHT_MARGIN = 190;
const TOP_MARGIN = 20;
const BOTTOM_MARGIN = 280;
const BODY_LINE_HEIGHT = 6;
const HEADING_LINE_HEIGHT = 8;
const SECTION_GAP = 4;
const CONTENT_WIDTH = RIGHT_MARGIN - LEFT_MARGIN;

class PdfDocumentBuilder {
  private readonly doc: jsPDF;
  private y = TOP_MARGIN;

  constructor(title: string) {
    this.doc = new jsPDF({ unit: 'mm', format: 'letter' });
    this.doc.setProperties({ title, creator: 'CLBHub Admin' });
  }

  save(filename: string): void {
    this.doc.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
  }

  addTitle(text: string): void {
    this.ensureSpace(HEADING_LINE_HEIGHT + SECTION_GAP);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(16);
    this.y = this.writeWrapped(text, LEFT_MARGIN, this.y, CONTENT_WIDTH, HEADING_LINE_HEIGHT);
    this.y += SECTION_GAP;
  }

  addSectionHeading(text: string): void {
    this.ensureSpace(HEADING_LINE_HEIGHT + 2);
    this.y += 2;
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(12);
    this.y = this.writeWrapped(text, LEFT_MARGIN, this.y, CONTENT_WIDTH, HEADING_LINE_HEIGHT);
  }

  addLabelValue(label: string, value: string): void {
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(11);
    this.y = this.writeWrapped(`${label}: ${value || '—'}`, LEFT_MARGIN, this.y, CONTENT_WIDTH, BODY_LINE_HEIGHT);
  }

  addBulletList(label: string, items: string[]): void {
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(11);
    if (label) {
      this.y = this.writeWrapped(`${label}:`, LEFT_MARGIN, this.y, CONTENT_WIDTH, BODY_LINE_HEIGHT);
    }
    const bulletLines = items.length
      ? items.map((item) => `• ${item}`)
      : ['• None selected'];
    for (const line of bulletLines) {
      this.y = this.writeWrapped(line, LEFT_MARGIN + 4, this.y, CONTENT_WIDTH - 4, BODY_LINE_HEIGHT);
    }
  }

  addBlankLine(): void {
    this.y += BODY_LINE_HEIGHT;
  }

  private ensureSpace(requiredHeight: number): void {
    if (this.y + requiredHeight <= BOTTOM_MARGIN) {
      return;
    }
    this.doc.addPage();
    this.y = TOP_MARGIN;
  }

  private writeWrapped(
    text: string,
    x: number,
    startY: number,
    maxWidth: number,
    lineHeight: number,
  ): number {
    const normalized = text.replace(/\s+/g, ' ').trim() || '—';
    const lines = this.doc.splitTextToSize(normalized, maxWidth) as string[];
    let currentY = startY;
    for (const line of lines) {
      this.ensureSpace(lineHeight);
      if (currentY !== this.y) {
        currentY = this.y;
      }
      this.doc.text(line, x, currentY);
      currentY += lineHeight;
      this.y = currentY;
    }
    return currentY;
  }
}

export function downloadAiWorkplaceSkillSummaryPdf(
  input: AiWorkplaceSkillSummaryPdfInput,
  filename: string,
): void {
  const builder = new PdfDocumentBuilder(input.surveyTitle);

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

  builder.save(filename);
}
