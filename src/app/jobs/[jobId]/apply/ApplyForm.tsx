"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Job, Outreach } from "@prisma/client";

interface ApplyFormProps {
  job: Job & {
    company: {
      companyProfile: {
        name: string;
      } | null;
    };
  };
  outreach: Outreach & {
    preScreening: {
      questions: string[];
    } | null;
  };
  companyName: string;
}

export default function ApplyForm({ job, outreach, companyName }: ApplyFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/jobs/${job.id}/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId: job.id,
          outreachId: outreach.id === "default" ? null : outreach.id,
          answers: Object.entries(answers).map(([id, answer]) => ({
            id,
            answer,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit application");
      }

      toast.success("Application submitted successfully!");
      router.push(`/jobs/${job.id}/interview`);
    } catch (error) {
      // console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnswerChange = (id: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const hasPreScreeningQuestions = outreach.preScreening?.questions?.length > 0;

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Apply for {job.title} at {companyName}</CardTitle>
        </CardHeader>
        <CardContent>
          {!hasPreScreeningQuestions ? (
            <div className="text-center py-4">
              <p className="text-gray-600 mb-4">No pre-screening questions required for this position.</p>
              <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {outreach.preScreening?.questions.map((question, index) => (
                <div key={index} className="space-y-2">
                  <Label htmlFor={`question-${index}`}>{question}</Label>
                  <Textarea
                    id={`question-${index}`}
                    value={answers[`question-${index}`] || ""}
                    onChange={(e) => handleAnswerChange(`question-${index}`, e.target.value)}
                    required
                    className="min-h-[100px]"
                  />
                </div>
              ))}

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}