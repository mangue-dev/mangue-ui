"use client";

import * as React from "react";
import { ArrowUp, Sparkles } from "lucide-react";

import { cn } from "../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: React.ReactNode;
  createdAt?: string;
}

export interface ChatSuggestion {
  key: string;
  label: string;
  onSelect?: () => void;
}

export interface NumoChatProps {
  messages: ChatMessage[];
  /** Called with the trimmed input when the user sends a message. */
  onSend?: (text: string) => void;
  /** Show the streaming "typing" indicator as an extra assistant bubble. */
  isStreaming?: boolean;
  assistantName?: string;
  assistantAvatarUrl?: string;
  /** Quick-reply chips, shown when the conversation is empty. */
  suggestions?: ChatSuggestion[];
  placeholder?: string;
  /** Optional custom header; defaults to the assistant identity row. */
  header?: React.ReactNode;
  /** Shown when there are no messages (above the suggestions). */
  emptyState?: React.ReactNode;
  className?: string;
}

/**
 * A fully presentational AI chat panel (modelled on project's "Numo"). It owns
 * no AI logic — wire `onSend` to your model and feed `messages` back in. Enter
 * sends, Shift+Enter inserts a newline.
 */
export function NumoChat({
  messages,
  onSend,
  isStreaming = false,
  assistantName = "Numo",
  assistantAvatarUrl,
  suggestions = [],
  placeholder = "Ask anything...",
  header,
  emptyState,
  className,
}: NumoChatProps) {
  const [value, setValue] = React.useState("");
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, isStreaming]);

  const send = () => {
    const text = value.trim();
    if (!text) return;
    onSend?.(text);
    setValue("");
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  };

  const initials = assistantName.slice(0, 1).toUpperCase();
  const isEmpty = messages.length === 0;

  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface-raised",
        className,
      )}
    >
      {/* Header */}
      {header ?? (
        <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-glow-muted text-accent-glow">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold">{assistantName}</div>
            <div className="text-xs text-muted-foreground">AI assistant</div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {isEmpty ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            {emptyState ?? (
              <div className="max-w-[240px] space-y-1.5">
                <div className="text-sm font-medium">How can I help?</div>
                <p className="text-xs text-muted-foreground">
                  Ask a question or pick a suggestion below.
                </p>
              </div>
            )}
          </div>
        ) : (
          messages.map((message) => (
            <ChatBubble
              key={message.id}
              message={message}
              assistantName={assistantName}
              assistantAvatarUrl={assistantAvatarUrl}
              initials={initials}
            />
          ))
        )}

        {isStreaming ? (
          <div className="flex items-start gap-2.5">
            <Avatar className="h-7 w-7">
              {assistantAvatarUrl ? <AvatarImage src={assistantAvatarUrl} alt={assistantName} /> : null}
              <AvatarFallback className="bg-accent-glow-muted text-accent-glow">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="rounded-2xl rounded-tl-sm bg-muted px-3.5 py-2.5">
              <TypingDots />
            </div>
          </div>
        ) : null}
      </div>

      {/* Suggestions (empty state only) */}
      {isEmpty && suggestions.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 px-4 pb-3">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.key}
              type="button"
              onClick={suggestion.onSelect}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-muted"
            >
              {suggestion.label}
            </button>
          ))}
        </div>
      ) : null}

      {/* Composer */}
      <div className="border-t border-border p-2.5">
        <div className="chat-input-surface flex items-end gap-2 rounded-xl border border-border bg-card p-1.5 pl-3 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
          <textarea
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            rows={1}
            className="max-h-32 flex-1 resize-none bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground select-text"
          />
          <Button
            type="button"
            size="icon-sm"
            onClick={send}
            disabled={!value.trim()}
            aria-label="Send message"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

interface ChatBubbleProps {
  message: ChatMessage;
  assistantName: string;
  assistantAvatarUrl?: string;
  initials: string;
}

function ChatBubble({ message, assistantName, assistantAvatarUrl, initials }: ChatBubbleProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-3.5 py-2.5 text-sm text-primary-foreground select-text">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2.5">
      <Avatar className="h-7 w-7 shrink-0">
        {assistantAvatarUrl ? <AvatarImage src={assistantAvatarUrl} alt={assistantName} /> : null}
        <AvatarFallback className="bg-accent-glow-muted text-accent-glow">{initials}</AvatarFallback>
      </Avatar>
      <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-muted px-3.5 py-2.5 text-sm text-foreground select-text">
        {message.content}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/70"
          style={{ animationDelay: `${index * 0.15}s` }}
        />
      ))}
    </div>
  );
}
