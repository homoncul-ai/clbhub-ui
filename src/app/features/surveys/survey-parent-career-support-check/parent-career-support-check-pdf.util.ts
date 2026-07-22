import { jsPDF } from 'jspdf';

export interface ParentCareerSupportCheckPdfInput {
  surveyTitle: string;
  submittedAt: string;
  email: string;
  followUpSurvey: boolean;
  relationship: string;
  youngPersonStatus: string;
  youngPersonWorkStatus: string;
  youngPersonEducationStatus: string;
  youngPersonWorkGoals: string;
  youngPersonEducationGoals: string;
  involvementFrequency: string;
  workLifeAspirations: string[];
  involvementPreferences: string[];
  informationSources: string[];
  youthExplorationOutlook: string;
  youthInvestigationAreas: string[];
  confidenceExploringCareers: string;
  confidenceEducationTraining: string;
  confidenceWorkExperiences: string;
  confidenceTrustworthyInfo: string;
  biggestChallenge: string;
  aiUse: string;
  aiFeelingAboutYouth: string;
  aiOpinion: string[];
  aiThoughts: string;
  clbHubImprovement: string;
  additionalFeedback: string;
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

export function downloadParentCareerSupportCheckPdf(
  input: ParentCareerSupportCheckPdfInput,
  filename: string,
): void {
  const builder = new PdfDocumentBuilder(input.surveyTitle);

  builder.addTitle(input.surveyTitle);
  builder.addLabelValue('Submitted', input.submittedAt || '—');
  builder.addBlankLine();

  builder.addSectionHeading('About you and the young person');
  builder.addLabelValue('Relationship', input.relationship);
  builder.addLabelValue("Young person's status", input.youngPersonStatus);
  builder.addLabelValue('Work status', input.youngPersonWorkStatus);
  builder.addLabelValue('Education status', input.youngPersonEducationStatus);
  builder.addLabelValue('Work goals', input.youngPersonWorkGoals);
  builder.addLabelValue('Educational goals', input.youngPersonEducationGoals);
  builder.addBlankLine();

  builder.addSectionHeading('Your involvement in career exploration');
  builder.addLabelValue('Involvement frequency', input.involvementFrequency);
  builder.addBulletList('Work life aspirations', input.workLifeAspirations);
  builder.addBulletList("How you'd like to be involved", input.involvementPreferences);
  builder.addBulletList('Information sources', input.informationSources);
  builder.addBlankLine();

  builder.addSectionHeading("Youth's exploration");
  builder.addLabelValue('Next 3 months outlook', input.youthExplorationOutlook);
  builder.addBulletList('Areas they may investigate', input.youthInvestigationAreas);
  builder.addBlankLine();

  builder.addSectionHeading('Confidence supporting career exploration');
  builder.addLabelValue('Exploring careers', input.confidenceExploringCareers);
  builder.addLabelValue('Education/training options', input.confidenceEducationTraining);
  builder.addLabelValue('Finding work experiences/jobs', input.confidenceWorkExperiences);
  builder.addLabelValue('Finding trustworthy information', input.confidenceTrustworthyInfo);
  builder.addLabelValue('Biggest challenge', input.biggestChallenge);
  builder.addBlankLine();

  builder.addSectionHeading('Technology & AI');
  builder.addLabelValue('AI use', input.aiUse);
  builder.addLabelValue('Feeling about youth using AI', input.aiFeelingAboutYouth);
  builder.addBulletList('AI opinions', input.aiOpinion);
  builder.addLabelValue('Thoughts on AI usage', input.aiThoughts);
  builder.addBlankLine();

  builder.addSectionHeading('Ideas & feedback');
  builder.addLabelValue('CLBHub improvement', input.clbHubImprovement);
  builder.addLabelValue('Additional feedback', input.additionalFeedback);
  builder.addBlankLine();

  builder.addSectionHeading('Follow-up');
  builder.addLabelValue('Follow-up survey', input.followUpSurvey ? 'Requested' : 'Not requested');
  builder.addLabelValue('Contact consent', formatContactConsent(input.followUpConsent));
  builder.addLabelValue('Email', input.email);
  builder.addLabelValue('CLBHub account interest', input.clbHubAccountInterest || '—');

  builder.save(filename);
}
