type DailyMessageProps = {
  name: string;
  character: string;
  chineseMessage: string;
  koreanMessage: string;
  direction?: "left" | "right";
  characterColor: "pink" | "yellow";
};

export default function DailyMessage({
  name,
  character,
  chineseMessage,
  koreanMessage,
  direction = "left",
  characterColor,
}: DailyMessageProps) {
  return (
    <article
      className={`daily-message ${
        direction === "right" ? "daily-message-reverse" : ""
      }`}
    >
      <div className={`speech-box speech-box-${direction}`}>
        <p className="speech-chinese">{chineseMessage}</p>
        <p className="speech-korean">{koreanMessage}</p>
      </div>

      <div className="profile-character">
        <div className={`character-circle character-${characterColor}`}>
          <span>{character}</span>
        </div>

        <div className="character-name">{name}</div>
      </div>
    </article>
  );
}
