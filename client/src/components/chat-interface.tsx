import { useEffect, useMemo, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, ShieldCheck, MoreVertical, Paperclip, X, FileText, ImageIcon, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import {
  fetchConversationMessages,
  sendConversationMessage,
  uploadConversationAttachments,
  upsertConversation,
  type ChatMessage,
} from "@/lib/chat";

const SAFETY_SYSTEM_MESSAGE =
  "This chat is monitored by Justice City for your safety. Do not share financial details off-platform.";

interface ChatInterfaceProps {
  recipient: {
    id?: string;
    name: string;
    image: string;
    verified: boolean;
    role?: string;
  };
  propertyTitle: string;
  initialMessage?: string;
  listingId?: string;
  conversationId?: string;
  requesterId?: string;
  requesterName?: string;
  requesterRole?: string;
  conversationScope?: "listing" | "renting" | "service" | "support";
  serviceCode?: string;
}

function formatLocalTime(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return parsed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function buildFallbackMessages(initialMessage: string): ChatMessage[] {
  const now = new Date();
  const next = new Date(now.getTime() + 1000);

  return [
    {
      id: "local-system-message",
      sender: "system",
      content: SAFETY_SYSTEM_MESSAGE,
      time: formatLocalTime(now.toISOString()),
      createdAt: now.toISOString(),
      messageType: "system",
    },
    {
      id: "local-intro-message",
      sender: "them",
      content: initialMessage,
      time: formatLocalTime(next.toISOString()),
      createdAt: next.toISOString(),
      messageType: "text",
    },
  ];
}

function parseIssueCard(message: ChatMessage): {
  title: string;
  problemTag?: string;
  status?: string;
  detail: string;
} | null {
  if (message.messageType !== "issue_card") return null;
  const metadata =
    message.metadata && typeof message.metadata === "object"
      ? (message.metadata as Record<string, unknown>)
      : undefined;
  const issueCard =
    metadata?.issueCard && typeof metadata.issueCard === "object"
      ? (metadata.issueCard as Record<string, unknown>)
      : undefined;

  const title = String(issueCard?.title ?? "Issue Card").trim() || "Issue Card";
  const detail =
    String(issueCard?.message ?? "").trim() ||
    String(message.content ?? "").trim() ||
    "Issue update";
  const problemTag = String(issueCard?.problemTag ?? "").trim() || undefined;
  const status = String(issueCard?.status ?? "").trim() || undefined;

  return { title, problemTag, status, detail };
}

function isImageAttachment(mimeType?: string): boolean {
  return String(mimeType ?? "")
    .toLowerCase()
    .startsWith("image/");
}

export function ChatInterface({
  recipient,
  propertyTitle,
  initialMessage,
  listingId,
  conversationId: initialConversationId,
  requesterId,
  requesterName,
  requesterRole,
  conversationScope,
  serviceCode,
}: ChatInterfaceProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [resolvedSenderId, setResolvedSenderId] = useState<string>("");
  const [resolvedSenderName, setResolvedSenderName] = useState<string>("");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isLocalFallback, setIsLocalFallback] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const initialRecipientMessage =
    initialMessage || `Hello! I saw you were interested in ${propertyTitle}. Do you have any questions?`;

  const resolvedRequester = useMemo(
    () => ({
      id: requesterId || user?.id || "guest_user",
      name: requesterName || user?.name || "Guest User",
      role: requesterRole || user?.role || "buyer",
    }),
    [requesterId, requesterName, requesterRole, user?.id, user?.name, user?.role],
  );

  useEffect(() => {
    let cancelled = false;

    const bootstrapConversation = async () => {
      setIsInitializing(true);
      setLoadError(null);
      setIsLocalFallback(false);

      try {
        if (initialConversationId) {
          const nextSenderId = resolvedRequester.id;
          const nextSenderName = resolvedRequester.name;

          setConversationId(initialConversationId);
          setResolvedSenderId(nextSenderId);
          setResolvedSenderName(nextSenderName);

          const history = await fetchConversationMessages(initialConversationId, nextSenderId);
          if (cancelled) return;

          setMessages(Array.isArray(history) ? history : []);
          return;
        }

        const upserted = await upsertConversation({
          requesterId: resolvedRequester.id,
          requesterName: resolvedRequester.name,
          requesterRole: resolvedRequester.role || undefined,
          recipientId: recipient.id,
          recipientName: recipient.name,
          recipientRole: recipient.role,
          subject: propertyTitle,
          listingId,
          initialMessage: initialRecipientMessage,
          conversationScope,
          serviceCode,
        });

        if (cancelled) return;

        const nextConversationId = String(upserted.conversation.id);
        const nextSenderId = String(upserted.requester.id || resolvedRequester.id);
        const nextSenderName = String(upserted.requester.name || resolvedRequester.name);

        setConversationId(nextConversationId);
        setResolvedSenderId(nextSenderId);
        setResolvedSenderName(nextSenderName);

        const history = await fetchConversationMessages(nextConversationId, nextSenderId);
        if (cancelled) return;

        setMessages(Array.isArray(history) ? history : []);
      } catch (error) {
        if (cancelled) return;

        const message = error instanceof Error ? error.message : "Unable to load chat history.";
        setLoadError(message);
        setIsLocalFallback(true);
        setConversationId(null);
        setResolvedSenderId(resolvedRequester.id);
        setResolvedSenderName(resolvedRequester.name);
        setMessages(buildFallbackMessages(initialRecipientMessage));
      } finally {
        if (!cancelled) {
          setIsInitializing(false);
        }
      }
    };

    void bootstrapConversation();

    return () => {
      cancelled = true;
    };
  }, [
    initialConversationId,
    initialRecipientMessage,
    listingId,
    propertyTitle,
    recipient.id,
    recipient.name,
    recipient.role,
    resolvedRequester.id,
    resolvedRequester.name,
    resolvedRequester.role,
    conversationScope,
    serviceCode,
  ]);

  const handleSend = async () => {
    const content = newMessage.trim();
    if ((!content && pendingFiles.length === 0) || isSending) return;

    setNewMessage("");

    if (!conversationId || isLocalFallback) {
      const createdAt = new Date().toISOString();
      const localText =
        content ||
        (pendingFiles.length === 1
          ? `Shared attachment: ${pendingFiles[0].name}`
          : `Shared ${pendingFiles.length} attachments`);
      setMessages((current) => [
        ...current,
        {
          id: `local-${Date.now()}`,
          sender: "me",
          content: localText,
          time: formatLocalTime(createdAt),
          createdAt,
          senderId: resolvedSenderId || resolvedRequester.id,
          messageType: "text",
        },
      ]);
      setPendingFiles([]);
      return;
    }

    setIsSending(true);
    setLoadError(null);

    try {
      const attachments =
        pendingFiles.length > 0
          ? await uploadConversationAttachments({
              conversationId,
              senderId: resolvedSenderId || resolvedRequester.id,
              scope: conversationScope,
              files: pendingFiles,
            })
          : undefined;

      const messageContent =
        content ||
        (pendingFiles.length === 1
          ? `Shared attachment: ${pendingFiles[0].name}`
          : `Shared ${pendingFiles.length} attachments`);

      const saved = await sendConversationMessage({
        conversationId,
        senderId: resolvedSenderId || resolvedRequester.id,
        senderName: resolvedSenderName || resolvedRequester.name,
        senderRole: resolvedRequester.role || undefined,
        content: messageContent,
        attachments,
      });

      setMessages((current) => [...current, saved]);
      setPendingFiles([]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to send message.";
      setLoadError(message);

      const createdAt = new Date().toISOString();
      const fallbackContent =
        content ||
        (pendingFiles.length === 1
          ? `Shared attachment: ${pendingFiles[0].name}`
          : `Shared ${pendingFiles.length} attachments`);
      setMessages((current) => [
        ...current,
        {
          id: `local-${Date.now()}`,
          sender: "me",
          content: fallbackContent,
          time: formatLocalTime(createdAt),
          createdAt,
          senderId: resolvedSenderId || resolvedRequester.id,
          messageType: "text",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar>
              <AvatarImage src={recipient.image} />
              <AvatarFallback>{recipient.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {recipient.verified && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-green-600 fill-green-100" />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">{recipient.name}</h3>
            <p className="text-xs text-slate-500 truncate max-w-[220px]">Re: {propertyTitle}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreVertical className="w-4 h-4 text-slate-400" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4 bg-slate-50/30">
        {isInitializing ? (
          <div className="h-full flex items-center justify-center text-sm text-slate-500">
            Loading conversation...
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex w-full",
                  msg.sender === "me" ? "justify-end" : "justify-start",
                  msg.sender === "system" ? "justify-center" : "",
                )}
              >
                {msg.sender === "system" ? (
                  <div className="bg-amber-50 text-amber-800 text-xs px-3 py-1.5 rounded-full border border-amber-100 flex items-center gap-1.5 max-w-[90%] text-center">
                    <ShieldCheck className="w-3 h-3" />
                    {msg.content}
                  </div>
                ) : (
                  (() => {
                    const issueCard = parseIssueCard(msg);
                    const attachments = Array.isArray(msg.attachments) ? msg.attachments : [];

                    return (
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                          msg.sender === "me"
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm",
                        )}
                      >
                        {issueCard ? (
                          <div
                            className={cn(
                              "rounded-xl border px-3 py-2",
                              msg.sender === "me"
                                ? "border-blue-300/60 bg-blue-500/40"
                                : "border-amber-200 bg-amber-50",
                            )}
                          >
                            <p className="text-xs font-semibold uppercase tracking-wide opacity-90">
                              {issueCard.title}
                            </p>
                            {(issueCard.problemTag || issueCard.status) && (
                              <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] opacity-90">
                                {issueCard.problemTag && (
                                  <span className="rounded-full border px-2 py-0.5">
                                    {issueCard.problemTag}
                                  </span>
                                )}
                                {issueCard.status && (
                                  <span className="rounded-full border px-2 py-0.5">
                                    {issueCard.status}
                                  </span>
                                )}
                              </div>
                            )}
                            <p className="mt-2 text-sm">{issueCard.detail}</p>
                          </div>
                        ) : (
                          <p>{msg.content}</p>
                        )}
                        {attachments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {attachments.map((attachment, index) => {
                              const previewUrl = String(attachment.previewUrl ?? "").trim();
                              const fileName = String(attachment.fileName ?? "Attachment");
                              const isImage = isImageAttachment(attachment.mimeType);

                              if (previewUrl && isImage) {
                                return (
                                  <a
                                    key={`${attachment.storagePath}-${index}`}
                                    href={previewUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={cn(
                                      "block rounded-lg border overflow-hidden",
                                      msg.sender === "me"
                                        ? "border-blue-300/70"
                                        : "border-slate-200 bg-slate-50",
                                    )}
                                  >
                                    <img
                                      src={previewUrl}
                                      alt={fileName}
                                      className="max-h-44 w-full object-cover"
                                      loading="lazy"
                                    />
                                    <div className="flex items-center justify-between px-2 py-1 text-[11px]">
                                      <span className="truncate">{fileName}</span>
                                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                                    </div>
                                  </a>
                                );
                              }

                              if (previewUrl) {
                                return (
                                  <a
                                    key={`${attachment.storagePath}-${index}`}
                                    href={previewUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={cn(
                                      "flex items-center gap-2 rounded-md border px-2 py-1 text-xs",
                                      msg.sender === "me"
                                        ? "border-blue-300/70 hover:bg-blue-500/30"
                                        : "border-slate-200 bg-slate-50 hover:bg-slate-100",
                                    )}
                                  >
                                    <FileText className="h-3.5 w-3.5 shrink-0" />
                                    <span className="truncate">{fileName}</span>
                                    <ExternalLink className="ml-auto h-3.5 w-3.5 shrink-0" />
                                  </a>
                                );
                              }

                              return (
                                <div
                                  key={`${attachment.storagePath}-${index}`}
                                  className={cn(
                                    "flex items-center gap-2 rounded-md border px-2 py-1 text-xs",
                                    msg.sender === "me"
                                      ? "border-blue-300/70"
                                      : "border-slate-200 bg-slate-50",
                                  )}
                                >
                                  {isImage ? (
                                    <ImageIcon className="h-3.5 w-3.5 shrink-0" />
                                  ) : (
                                    <FileText className="h-3.5 w-3.5 shrink-0" />
                                  )}
                                  <span className="truncate">{fileName}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        <p
                          className={cn(
                            "text-[10px] mt-1 text-right",
                            msg.sender === "me" ? "text-blue-100" : "text-slate-400",
                          )}
                        >
                          {msg.time}
                        </p>
                      </div>
                    );
                  })()
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="p-3 bg-white border-t border-slate-100 space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(event) => {
            const selected = Array.from(event.target.files ?? []);
            if (selected.length === 0) return;

            setPendingFiles((current) => {
              const existing = new Set(
                current.map((file) => `${file.name}:${file.size}:${file.lastModified}`),
              );
              const merged = [...current];
              selected.forEach((file) => {
                const key = `${file.name}:${file.size}:${file.lastModified}`;
                if (!existing.has(key)) {
                  existing.add(key);
                  merged.push(file);
                }
              });
              return merged.slice(0, 5);
            });

            event.currentTarget.value = "";
          }}
        />
        {loadError && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-md px-2 py-1">
            {isLocalFallback
              ? "Chat sync unavailable, using local temporary messages."
              : loadError}
          </p>
        )}
        {pendingFiles.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {pendingFiles.map((file, index) => (
              <div
                key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700"
              >
                <span className="max-w-[180px] truncate">{file.name}</span>
                <button
                  type="button"
                  className="text-slate-400 hover:text-slate-700"
                  onClick={() =>
                    setPendingFiles((current) =>
                      current.filter((candidate, candidateIndex) => {
                        const sameFile =
                          candidate.name === file.name &&
                          candidate.size === file.size &&
                          candidate.lastModified === file.lastModified;
                        return !(sameFile && candidateIndex === index);
                      }),
                    )
                  }
                  disabled={isSending}
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-slate-600 shrink-0"
            onClick={() => fileInputRef.current?.click()}
            disabled={isInitializing || isSending}
            title="Attach files"
          >
            <Paperclip className="w-5 h-5" />
          </Button>
          <Input
            placeholder="Type a message..."
            className="flex-1 bg-slate-50 border-transparent focus-visible:ring-1 focus-visible:ring-blue-500"
            value={newMessage}
            onChange={(event) => setNewMessage(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void handleSend();
              }
            }}
            disabled={isInitializing || isSending}
          />
          <Button
            size="icon"
            className="bg-blue-600 hover:bg-blue-700 shrink-0"
            onClick={() => void handleSend()}
            disabled={
              isInitializing || isSending || (!newMessage.trim() && pendingFiles.length === 0)
            }
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
