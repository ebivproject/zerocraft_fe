interface ChatBubbleProps {
  message: string;
  isUser?: boolean;
  timestamp?: string;
}

export default function ChatBubble({
  message,
  isUser = false,
  timestamp,
}: ChatBubbleProps) {
  return (
    <div className={`chat-bubble ${isUser ? "user" : "assistant"}`}>
      <p>{message}</p>
      {timestamp && <span className="timestamp">{timestamp}</span>}
    </div>
  );
}
