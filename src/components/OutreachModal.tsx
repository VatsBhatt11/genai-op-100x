"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Send } from "lucide-react"

interface Candidate {
  id: string
  fullName: string
  email: string
  skills: string[]
}

interface OutreachModalProps {
  candidates: Candidate[]
  trigger?: React.ReactNode
  searchQuery?: string
  jobId?: string // Add jobId here
}

export function OutreachModal({ candidates, trigger, searchQuery, jobId }: OutreachModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSend = async () => {
    console.log('entered')
    if (!subject.trim() || !message.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both subject and message",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    console.log("Candidates being sent:", candidates); // Add this line
    try {
      const results = await Promise.allSettled(
        candidates.map(async (candidate) => {
          const response = await fetch("/api/outreach/send", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              candidateId: candidate.id, // Add candidateId for backend schema
              subject,
              message,
              query: searchQuery || "Looking for candidates",
              jobId, // Pass jobId to the API call
            }),
          });

          if (!response.ok) {
            throw new Error(`Failed to send message to ${candidate.fullName || candidate.email}`);
          }
          return response.json();
        })
      );

      const successfulSends = results.filter(result => result.status === 'fulfilled').length;
      const failedSends = results.filter(result => result.status === 'rejected').length;

      if (successfulSends > 0) {
        toast({
          title: "Success",
          description: `Message sent to ${successfulSends} candidate(s)`,
        });
      }

      if (failedSends > 0) {
        toast({
          title: "Warning",
          description: `Failed to send message to ${failedSends} candidate(s). Check console for details.`, // Or provide more specific error messages
          variant: "destructive",
        });
        results.filter(result => result.status === 'rejected').forEach(result => console.error(result.reason));
      }

      if (successfulSends > 0) {
        setIsOpen(false);
        setSubject("");
        setMessage("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Send className="w-4 h-4 mr-2" />
            Send Message
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Send Message to Candidates</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700">
              Recipients ({candidates.length} candidate{candidates.length !== 1 ? "s" : ""})
            </Label>
            <div className="mt-2 max-h-32 overflow-y-auto bg-gray-50 rounded-md p-3">
              {candidates.map((candidate) => (
                <div key={candidate.id} className="text-sm text-gray-600 mb-1">
                  {candidate.fullName || candidate.email}
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter message subject"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here..."
              rows={6}
              className="mt-1"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleSend} disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
