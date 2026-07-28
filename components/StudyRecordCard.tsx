type StudyRecordCardProps = {
  name: string;
  emoji: string;
  category: string;
  studyTime: string;
  content: string;
  expression: string;
};

export default function StudyRecordCard({
  name,
  emoji,
  category,
  studyTime,
  content,
  expression,
}: StudyRecordCardProps) {
  return (
    <article className="study-record-card">
      <div className="record-profile">
        <div className="record-character">{emoji}</div>
        <strong>{name}</strong>
      </div>

      <div className="record-details">
        <div className="record-header">
          <span className="category-sticker">{category}</span>
          <span className="study-time">⏱ {studyTime}</span>
        </div>

        <p className="study-content">{content}</p>

        <div className="expression-box">
          <span>오늘의 표현</span>
          <strong>{expression}</strong>
        </div>
      </div>
    </article>
  );
}
