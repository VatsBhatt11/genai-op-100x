"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Job, InterviewReport, PreScreeningQuestion } from "@prisma/client";
// import { Vapi } from "@vapi-ai/web"; // Removed Vapi import
import Vapi from "@vapi-ai/web";
import InterviewReportComponent from "./InterviewReport";
import "./interview.css";

interface InterviewAgentProps {
  job: Job;
  preScreeningQuestions: PreScreeningQuestion[];
  candidateId: string;
  applicationId: string;
}

type InterviewState =
  | "idle"
  | "connecting"
  | "in-progress"
  | "generating-report"
  | "report-generated"
  | "error";

export default function InterviewAgent({
  job,
  preScreeningQuestions,
  candidateId: propCandidateId,
  applicationId: propApplicationId,
}: InterviewAgentProps) {
  const [interviewState, setInterviewState] = useState<InterviewState>("idle");
  const [showInstructionsModal, setShowInstructionsModal] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<Array<{ role: string; text: string }>>([]);
  const [interviewReport, setInterviewReport] = useState<InterviewReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const vapiRef = useRef<Vapi | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);

console.log('job: ', job);

  const router = useRouter();
  const { data: session } = useSession();

  const jobDescription = job.description;
  const candidateId = session?.user?.id || propCandidateId;

  const handleVapiCallStart = useCallback(() => {
    console.log("Vapi Call started");
    setInterviewState("in-progress");
    setCurrentQuestion("Listening...");
    setIsCallActive(true);
  }, []);

  const handleVapiCallEnd = useCallback(() => {
    console.log("Vapi Call ended");
    setInterviewState("generating-report");
    setCurrentQuestion("Generating interview report...");
    setIsCallActive(false);
  }, []);

  const handleVapiSpeechStart = useCallback(() => {
    console.log("Vapi Assistant started speaking");
    setCurrentQuestion("Assistant Speaking...");
  }, []);

  const handleVapiSpeechEnd = useCallback(() => {
    console.log("Vapi Assistant stopped speaking");
    setCurrentQuestion("Listening...");
  }, []);

  const generateReport = useCallback(async () => {
    if (!candidateId) {
      setError("Candidate ID not found for report generation.");
      setInterviewState("error");
      return;
    }

    console.log("Generating report with:");
    console.log("  jobDescription:", jobDescription);
    console.log("  candidateId:", candidateId);
    console.log("  transcript:", transcript);

    try {
      const response = await fetch("/api/generate-interview-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobDescription, candidateId, interviewTranscript: transcript.map(t => ({ role: t.role, text: t.text })), applicationId: propApplicationId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate report");
      }

      const reportData: InterviewReport = await response.json();
      console.log("Generated report:", reportData);
      setInterviewReport(reportData.report);
      setInterviewState("report-generated");
    } catch (err: any) {
      console.error("Error generating report:", err);
      setError(`Failed to generate report: ${err.message}`);
      setInterviewState("error");
    }
  }, [candidateId, jobDescription, transcript, router, job.id]);

  const handleVapiMessage = useCallback((message: any) => {
    if (message.type === "transcript" && message.transcript.length > 0) {
      console.log("Vapi Transcript Message:", { type: message.type, transcript: message.transcript, is_final: message.is_final, from: message.from });
      // Only add to transcript when the speaker pauses (i.e., message.transcript.length > 0 and it's a final transcript)
      // Vapi sends interim transcripts with is_final: false, and final transcripts with is_final: true
      // We only want to add final transcripts to avoid showing partial sentences.
        if (message.is_final === true || message.is_final === undefined) {
          const role = message.role || (message.from === "user" ? "user" : "assistant");
          setTranscript((prev) => [
            ...prev,
            {
              role: role, text: message.transcript
            },
          ]);
        }
    } else if (message.type === "function_call") {
      console.log("Vapi Function call:", message.functionCall);
    } else if (message.type === "function_result") {
      console.log("Vapi Function result:", message.functionResult);
    }
  }, []);

  const handleVapiError = useCallback((e: any) => {
    console.error("Vapi Error:", e);
    setError(`Vapi AI Error: ${e.message}`);
    setInterviewState("error");
    if (vapiRef.current) {
      vapiRef.current.stop();
    }
  }, []);

  const startInterview = useCallback(async () => {
    if (!candidateId) {
      setError("Candidate ID not found. Please log in.");
      return;
    }

    setInterviewState("connecting");
    setError(null);
    setTranscript([]);
    setCurrentQuestion("Connecting to AI interviewer...");

    try {
      // Request camera and microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Start the Vapi AI call
      if (vapiRef.current) {
        vapiRef.current.start({
          name: "AI Recruiter",
          firstMessage: `Hi ${session?.user?.name}, how are you? Ready for your ${job.company.name} ${job.position} interview? `,
          transcriber: {
            provider: 'deepgram',
            model: 'nova-2',
            language: 'en-US',
          },
          voice: {
            provider: 'vapi',
            voiceId: 'Neha',
            fallbackPlan: {
              voices: [
                { provider: 'cartesia', voiceId: '248be419-c632-4f23-adf1-5324ed7dbf1d' },
                { provider: 'playht', voiceId: 'jennifer' },
              ],
            },
          },
          startSpeakingPlan: {
            waitSeconds: 2,
          },
          stopSpeakingPlan: {
            numWords: 1,
            voiceSeconds: 0.1,
            backoffSeconds: 0,
          },
            model: {
              provider: "groq",
              model: "llama-3.1-8b-instant",
              messages: [
                {
                  role: "system",
                  content: `You are an AI recruiter. Your name is ${job.company.name} AI Recruiter. You are interviewing a candidate for the ${job.position} position. Your goal is to assess the candidate's suitability for the role based on their answers to the pre-screening questions and their overall communication skills. Be polite, professional, and encouraging. Do not reveal the questions beforehand. Ask one question at a time and wait for the candidate's response. The interview should cover the following pre-screening questions: ${preScreeningQuestions.map((q) => q.question).join("\n")}`,
                },
              ],
              tools: [{ type: "endCall" }],
            },
        });
      }

    } catch (err) {
      console.error("Error accessing media devices:", err);
      setError("Failed to start interview: Please allow camera and microphone access.");
      setInterviewState("error");
    }
  }, [candidateId]);

  const endInterview = useCallback(() => {
    if (vapiRef.current) {
      vapiRef.current.stop();
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    setInterviewState("generating-report");
    setCurrentQuestion("Generating interview report...");
  }, [generateReport, vapi]);

  useEffect(() => {
    const vapiInstance = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY || "");
    setVapi(vapiInstance);
    vapiRef.current = vapiInstance;

    vapiInstance.on("call-start", handleVapiCallStart);
    vapiInstance.on("call-end", handleVapiCallEnd);
    vapiInstance.on("speech-start", handleVapiSpeechStart);
    vapiInstance.on("speech-end", handleVapiSpeechEnd);
    vapiInstance.on("message", handleVapiMessage);
    vapiInstance.on("error", handleVapiError);

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      vapiInstance.off("call-start", handleVapiCallStart);
      vapiInstance.off("call-end", handleVapiCallEnd);
      vapiInstance.off("speech-start", handleVapiSpeechStart);
      vapiInstance.off("speech-end", handleVapiSpeechEnd);
      vapiInstance.off("message", handleVapiMessage);
      vapiInstance.off("error", handleVapiError);
    };
  }, [handleVapiCallStart, handleVapiCallEnd, handleVapiSpeechStart, handleVapiSpeechEnd, handleVapiMessage, handleVapiError]);

  useEffect(() => {
    if (interviewState === "generating-report") {
      generateReport();
    }
  }, [interviewState, generateReport]);

  return (
    <div className="interview-container">
      {interviewState === "report-generated" && interviewReport ? (
        <InterviewReportComponent report={interviewReport} />
      ) : (
        <div className="interview-content">
          <div className="interview-panel left-panel">
            <div className="video-feed-container">
              <video ref={videoRef} autoPlay playsInline muted className="video-feed"></video>
                      {showInstructionsModal && (
                <div className="instructions-modal-overlay">
                  <div className="instructions-modal-content">
                    <h2>Interview Instructions</h2>
                    <p>Please read the following instructions carefully before starting your interview:</p>
                    <ul>
                      <li>Ensure you are in a quiet environment.</li>
                      <li>Check your microphone and camera are working correctly.</li>
                      <li>Maintain eye contact with the camera as much as possible.</li>
                      <li>Answer questions clearly and concisely.</li>
                      <li>The interview will start automatically once you click 'Understood'.</li>
                    </ul>
                    <button
                      onClick={() => {
                        setShowInstructionsModal(false);
                        startInterview();
                      }}
                      className="understood-button"
                    >
                      Understood
                    </button>
                  </div>
                </div>
              )}
              {interviewState === "idle" && !isCallActive && !showInstructionsModal && (
                <button onClick={startInterview} className="start-interview-button">
                  Start AI Interview
                </button>
              )}
              {interviewState === "in-progress" && (
                <button onClick={endInterview} className="end-interview-button">
                  End Interview
                </button>
              )}
              {interviewState === "connecting" && (
                <p className="interview-status">{currentQuestion}</p>
              )}
              {interviewState === "generating-report" && (
                <p className="interview-status">{currentQuestion}</p>
              )}
              {error && <p className="interview-status error">Error: {error}</p>}
            </div>
          </div>
          <div className="interview-panel right-panel">
            <h3>Interview Transcript</h3>
            <div className="transcript-box">
              {transcript.map((msg, index) => (
                <p key={index}>
                  <strong>{msg.role === "assistant" ? "AI Recruiter" : "You"}:</strong> {msg.text}
                </p>
              ))}
            </div>
            {currentQuestion && interviewState !== "generating-report" && (
              <p className="current-question">{currentQuestion}</p>
            )}
          </div>
        </div>
      )}
        </div>
      )};
// )}};