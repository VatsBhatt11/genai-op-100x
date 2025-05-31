"use client"

import { useState, useEffect } from "react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"

interface MessageTemplate {
  id: string
  type: string
  content: string
  createdAt: string
}

interface MessageLog {
  id: string
  channel: string
  content: string
  status: string
  sentAt: string
  createdAt: string
}

export default function CompanyOutreachPage() {
  const [templates, setTemplates] = useState<MessageTemplate[]>([])
  const [messageLogs, setMessageLogs] = useState<MessageLog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      // Fetch templates and message logs
      const [templatesRes, logsRes] = await Promise.all([fetch("/api/template"), fetch("/api/message/logs")])

      if (templatesRes.ok) {
        const templatesData = await templatesRes.json()
        setTemplates(templatesData)
      }

      if (logsRes.ok) {
        const logsData = await logsRes.json()
        setMessageLogs(logsData)
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "sent":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="outreach-page">
      <div className="page-container">
        <header className="page-header">
          <h1 className="page-title">Outreach Management</h1>
          <p className="page-subtitle">Manage your candidate communications</p>
        </header>

        <Tabs defaultValue="messages" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="messages">Recent Messages</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Recent Messages</h2>
              <Button>New Message</Button>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading messages...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messageLogs.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-gray-600">No messages sent yet</p>
                      <Button className="mt-4">Send Your First Message</Button>
                    </CardContent>
                  </Card>
                ) : (
                  messageLogs.map((log) => (
                    <Card key={log.id}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{log.content.split("\n")[0] || "Message"}</CardTitle>
                            <p className="text-sm text-gray-600">Sent via {log.channel.toLowerCase()}</p>
                          </div>
                          <Badge className={getStatusColor(log.status)}>{log.status}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700 mb-3">
                          {log.content.split("\n").slice(1).join("\n").substring(0, 150)}
                          {log.content.length > 150 && "..."}
                        </p>
                        <p className="text-xs text-gray-500">
                          {log.sentAt
                            ? `Sent ${new Date(log.sentAt).toLocaleDateString()}`
                            : `Created ${new Date(log.createdAt).toLocaleDateString()}`}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Message Templates</h2>
              <Button>Create Template</Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {templates.length === 0 ? (
                <Card className="md:col-span-2">
                  <CardContent className="text-center py-8">
                    <p className="text-gray-600">No templates created yet</p>
                    <Button className="mt-4">Create Your First Template</Button>
                  </CardContent>
                </Card>
              ) : (
                templates.map((template) => (
                  <Card key={template.id}>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span>{template.type} Template</span>
                        <Badge variant="outline">{template.type}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700 mb-4">{template.content.substring(0, 100)}...</p>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Use
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <h2 className="text-xl font-semibold">Outreach Analytics</h2>

            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{messageLogs.length}</div>
                  <p className="text-xs text-gray-600">All time</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Sent Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {
                      messageLogs.filter((log) => {
                        const today = new Date().toDateString()
                        return log.sentAt && new Date(log.sentAt).toDateString() === today
                      }).length
                    }
                  </div>
                  <p className="text-xs text-gray-600">Last 24 hours</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Success Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {messageLogs.length > 0
                      ? Math.round(
                          (messageLogs.filter((log) => log.status === "SENT").length / messageLogs.length) * 100,
                        )
                      : 0}
                    %
                  </div>
                  <p className="text-xs text-gray-600">Messages delivered</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{templates.length}</div>
                  <p className="text-xs text-gray-600">Created templates</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <style jsx>{`
        .outreach-page {
          min-height: 100vh;
          background: #f8fafc;
          padding: 2rem 1rem;
        }

        .page-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-header {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }

        .page-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 0.5rem;
        }

        .page-subtitle {
          color: #718096;
        }
      `}</style>
    </div>
  )
}
