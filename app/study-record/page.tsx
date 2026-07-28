import Link from "next/link";
import StudyRecordForm from "@/components/StudyRecordForm";

export default function StudyRecordPage() {
  return (
    <main className="site-background">
      <div className="diary-window study-record-page">
        <header className="study-record-header">
          <div>
            <p className="section-kicker">STUDY DIARY</p>
            <h1>공부일지</h1>
            <p>오늘 공부한 내용과 헷갈린 표현을 기록해 보세요.</p>
          </div>

          <Link href="/" className="back-home-button">
            ← 홈으로
          </Link>
        </header>

        <StudyRecordForm />
      </div>
    </main>
  );
}