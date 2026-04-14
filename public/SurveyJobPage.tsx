import Layout from "@/components/layout/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";


const SURVEY_TITLE = "Survey: Do you have a job for me?";

interface SurveyField {
  id: string;
  label: string;
}

const surveyFields: SurveyField[] = [
  { id: "currentAnswer", label: "How do you currently answer this question?" },
  { id: "findJobs", label: "How do you find the jobs you tell your clients about?" },
  { id: "currentProcess", label: "What's the current process? Do you help with introductions, work permits, introductions, searching for jobs (paper, online, apps)?" },
  { id: "educationGiven", label: "What kind of education do you give your clients around the job search?" },
  { id: "timeSink", label: "What part of helping clients find jobs is the most time consuming?" },
];

const helpOptions = [
  { id: "jobListing", label: "Job Listing" },
  { id: "clientCollab", label: "Client collaboration" },
  { id: "parentCollab", label: "Parent collaboration" },
  { id: "teamCollab", label: "Internal team collaboration" },
  { id: "orgCollab", label: "Non-Profit, School organization collaboration" },
  { id: "providerCollab", label: "Job Provider collaboration" },
];

export default function SurveyJobPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [selectedHelp, setSelectedHelp] = useState<string[]>([]);
  const [helpElaborate, setHelpElaborate] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleHelp = (id: string) => {
    setSelectedHelp((prev) =>
      prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id]
    );
  };

  const handleChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Build email body
    const bodyLines = [
      `Name: ${name || "(not provided)"}`,
      `Email: ${email || "(not provided)"}`,
      `Organization: ${organization || "(not provided)"}`,
      "",
      "--- Survey Responses ---",
      "",
    ];

    surveyFields.forEach((field) => {
      const answer = formData[field.id]?.trim();
      if (answer) {
        bodyLines.push(`${field.label}`);
        bodyLines.push(`${answer}`);
        bodyLines.push("");
      }
    });

    if (selectedHelp.length > 0) {
      bodyLines.push("How do you think software like \"CLBHub\" could help with the following?");
      selectedHelp.forEach((id) => {
        const option = helpOptions.find((o) => o.id === id);
        if (option) bodyLines.push(`  - ${option.label}`);
      });
      bodyLines.push("");
    }
    if (helpElaborate.trim()) {
      bodyLines.push("Elaboration:");
      bodyLines.push(helpElaborate.trim());
      bodyLines.push("");
    }

    const mailtoSubject = encodeURIComponent(SURVEY_TITLE);
    const mailtoBody = encodeURIComponent(bodyLines.join("\n"));
    const mailtoLink = `mailto:survey@clbhub.org?subject=${mailtoSubject}&body=${mailtoBody}`;

    // Open mailto link directly
    window.open(mailtoLink, "_blank");
    setIsSubmitted(true);
    toast({
      title: t("survey.success.title"),
      description: t("survey.success.description"),
    });
    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <Layout>
        <section className="py-16 px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h1 className="text-3xl font-bold text-primary">{t("survey.success.title")}</h1>
            <p className="text-lg text-muted-foreground">{t("survey.success.description")}</p>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-primary">
              {SURVEY_TITLE}
            </h1>
          </div>

          {/* Intro */}
          <div className="bg-muted/50 rounded-lg p-6 space-y-4 text-muted-foreground">
            <p>
              As our team has met with non-profit folks, one thing stuck with us — how often the non-profit community is asked to answer the question{" "}
              <strong className="text-foreground">"Do you have a job for me?"</strong>
            </p>
            <p>
              We'd like to hear from you. If you have a few minutes, answer whatever questions you'd like. Any feedback is appreciated.
            </p>
            <p>
              The CLBHub team will be presenting this Thursday at the INC meeting to share our work and our mission. We'd love your input ahead of time!
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact info */}
            <div className="space-y-4 border-b pb-6">
              <h2 className="text-lg font-semibold text-foreground">Your Information <span className="text-sm font-normal text-muted-foreground">(optional)</span></h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <Input id="organization" value={organization} onChange={(e) => setOrganization(e.target.value)} placeholder="Your organization" />
              </div>
            </div>

            {/* Big question header */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-primary italic">"Do you have a job for me?"</h2>
            </div>

            {/* Survey questions */}
            <div className="space-y-6">
              {surveyFields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id} className="text-base font-medium">
                    {field.label}
                  </Label>
                  <Textarea
                    id={field.id}
                    value={formData[field.id] || ""}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    placeholder="Your thoughts..."
                    className="min-h-[80px] resize-y"
                  />
                </div>
              ))}
            </div>

            {/* CLBHub help checkboxes */}
            <div className="space-y-4">
              <Label className="text-base font-medium">
                How do you think software like "CLBHub" could help with the following?
              </Label>
              <div className="space-y-3 pl-2">
                {helpOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={option.id}
                      checked={selectedHelp.includes(option.id)}
                      onCheckedChange={() => toggleHelp(option.id)}
                    />
                    <Label htmlFor={option.id} className="text-sm font-normal cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
              <div className="space-y-2 pt-2">
                <Label htmlFor="helpElaborate" className="text-sm font-medium">
                  If you selected any above, please elaborate.
                </Label>
                <Textarea
                  id="helpElaborate"
                  value={helpElaborate}
                  onChange={(e) => setHelpElaborate(e.target.value)}
                  placeholder="Your thoughts..."
                  className="min-h-[80px] resize-y"
                />
              </div>
            </div>

            {/* Anything else */}
            <div className="space-y-2">
              <Label htmlFor="anythingElse" className="text-base font-medium">
                Anything else you'd like to add?
              </Label>
              <Textarea
                id="anythingElse"
                value={formData["anythingElse"] || ""}
                onChange={(e) => handleChange("anythingElse", e.target.value)}
                placeholder="Your thoughts..."
                className="min-h-[80px] resize-y"
              />
            </div>

            {/* Submit */}
            <div className="pt-4">
              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? t("survey.submitting") : t("survey.submit")}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
}
