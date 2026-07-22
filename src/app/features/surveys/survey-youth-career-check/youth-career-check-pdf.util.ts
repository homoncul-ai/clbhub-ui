import { jsPDF } from 'jspdf';

export interface YouthCareerCheckPdfInput {
  surveyTitle: string;
  submittedAt: string;
  email: string;
  followUpSurvey: boolean;
  ageRange: string;
  workStatus: string;
  educationStatus: string;
  workGoals: string;
  educationGoals: string;
  careerExplorationStage: string;
  careerInfoSources: string[];
  aiToolUse: string;
  aiExperience: string[];
  supportPeople: string[];
  involvedInPrograms: string;
  programTypes: string[];
  planningApproach: string;
  planningTimeframe: string;
  onlineToolInterest: string;
  onlineToolFeatures: string[];
  cohortInterest: string;
  cohortActivities: string[];
  participationFrequency: string;
  cohortMotivators: string[];
  feedback: string;
  ideas: string;
  followUpConsent: string;
  clbHubAccountInterest: string;
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

function formatContactConsent(value: string): string {
  if (value === 'yes') {
    return 'Yes';
  }
  if (value === 'no') {
    return 'No';
  }
  return '—';
}

export function downloadYouthCareerCheckPdf(
  input: YouthCareerCheckPdfInput,
  filename: string,
): void {
  const builder = new PdfDocumentBuilder(input.surveyTitle);

  builder.addTitle(input.surveyTitle);
  builder.addLabelValue('Submitted', input.submittedAt || '—');
  builder.addBlankLine();

  builder.addSectionHeading('About you');
  builder.addLabelValue('Age range', input.ageRange);
  builder.addLabelValue('Work status', input.workStatus);
  builder.addLabelValue('Education status', input.educationStatus);
  builder.addLabelValue('Work goals', input.workGoals);
  builder.addLabelValue('Educational goals', input.educationGoals);
  builder.addBlankLine();

  builder.addSectionHeading('How you explore careers');
  builder.addLabelValue('Career exploration stage', input.careerExplorationStage);
  builder.addBulletList('Information sources', input.careerInfoSources);
  builder.addBlankLine();

  builder.addSectionHeading('Use of AI in career exploration');
  builder.addLabelValue('AI tool use', input.aiToolUse);
  builder.addBulletList('AI experience', input.aiExperience);
  builder.addBlankLine();

  builder.addSectionHeading('Who is involved in your career search');
  builder.addBulletList('Support people', input.supportPeople);
  builder.addLabelValue('Program involvement', input.involvedInPrograms);
  builder.addBulletList('Program types', input.programTypes);
  builder.addBlankLine();

  builder.addSectionHeading('Your approach to career planning');
  builder.addLabelValue('Planning approach', input.planningApproach);
  builder.addLabelValue('Planning timeframe', input.planningTimeframe);
  builder.addBlankLine();

  builder.addSectionHeading('CLBHub & cohort interest');
  builder.addLabelValue('Online tool interest', input.onlineToolInterest);
  builder.addBulletList('Online tool features', input.onlineToolFeatures);
  builder.addLabelValue('Cohort interest', input.cohortInterest);
  builder.addBulletList('Cohort activities', input.cohortActivities);
  builder.addLabelValue('Participation frequency', input.participationFrequency);
  builder.addBulletList('Cohort motivators', input.cohortMotivators);
  builder.addBlankLine();

  builder.addSectionHeading('Ideas & open feedback');
  builder.addLabelValue('What would help you most', input.feedback);
  builder.addLabelValue('Additional ideas or suggestions', input.ideas);
  builder.addBlankLine();

  builder.addSectionHeading('Follow-up');
  builder.addLabelValue('Follow-up survey', input.followUpSurvey ? 'Requested' : 'Not requested');
  builder.addLabelValue('May we contact you in the future?', formatContactConsent(input.followUpConsent));
  builder.addLabelValue('Email', input.email);
  builder.addLabelValue('CLBHub account interest', formatContactConsent(input.clbHubAccountInterest));

  builder.save(filename);
}
