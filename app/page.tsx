import DailyMessage from "@/components/DailyMessage";
import TodayStudyRecords from "@/components/TodayStudyRecords";
import Link from "next/link";

const weekDays = [
  { day: "MON", date: "27", completed: true },
  { day: "TUE", date: "28", completed: true },
  { day: "WED", date: "29", completed: false },
  { day: "THU", date: "30", completed: false },
  { day: "FRI", date: "31", completed: false },
];

export default function Home() {
  return (
    <main className="site-background">
      <div className="floating-sticker sticker-star">★</div>
      <div className="floating-sticker sticker-heart">♥</div>
      <div className="floating-sticker sticker-flower">✿</div>

      <section className="diary-window">
        <header className="window-header">
          <div className="window-title">
            <span className="window-icon">📖</span>
            <span>我们的中文日记</span>
          </div>

          <div className="window-controls" aria-hidden="true">
            <span>—</span>
            <span>□</span>
            <span>×</span>
          </div>
        </header>

        <nav className="window-menu">
          <Link href="/">홈</Link>
          <Link href="/study-record">공부 기록</Link>
          <span>캘린더</span>
          <span>타임라인</span>
          <span>우리의 기록</span>
        </nav>

        <div className="diary-content">
          <section className="hero-section">
            <div className="masking-tape tape-left" />
            <div className="masking-tape tape-right" />

            <div className="hero-date">
              <span>2026</span>
              <strong>07.28</strong>
              <span>TUESDAY</span>
            </div>

            <div className="hero-title">
              <p className="hero-label">OUR CHINESE STUDY DIARY</p>
              <h1>我们的中文日记</h1>
              <p>지원과 재은이 함께 쓰는 중국어 공부 기록장</p>
            </div>

            <div className="hero-decoration">
              <span>中</span>
              <small>一起学习吧</small>
            </div>
          </section>

          <section className="message-board">
            <div className="section-heading">
              <div>
                <span className="heading-number">01</span>

                <div>
                  <p>TODAY&apos;S MESSAGE</p>
                  <h2>오늘의 한마디</h2>
                </div>
              </div>

              <button type="button" className="edit-message-button">
                ✎ 메시지 쓰기
              </button>
            </div>

            <div className="message-grid">
              <DailyMessage
                name="지원"
                character="🐰"
                chineseMessage="今天也不要放弃！"
                koreanMessage="오늘도 포기하지 말자!"
                direction="left"
                characterColor="pink"
              />

              <div className="friendship-line">
                <span>♥</span>
                <div />
                <span>♥</span>
              </div>

              <DailyMessage
                name="재은"
                character="🦁"
                chineseMessage="我们一起加油吧！"
                koreanMessage="우리 같이 힘내자!"
                direction="right"
                characterColor="yellow"
              />
            </div>
          </section>

          <section className="study-menu-section">
            <div className="section-heading">
              <div>
                <span className="heading-number">02</span>

                <div>
                  <p>START STUDY</p>
                  <h2>오늘의 중국어 공부</h2>
                </div>
              </div>
            </div>

            <div className="study-menu-grid">
              <Link
  href="/hsk"
  className="study-menu-card"
>
  <span className="study-menu-icon">📚</span>
  <strong>HSK 5급 단어 테스트</strong>
  <small>오늘의 단어 문제 풀기</small>
</Link>

              <button type="button" className="study-menu-card">
                <span className="study-menu-icon">📖</span>
                <strong>HSK 5급 단문 독해</strong>
                <small>짧은 지문 읽고 문제 풀기</small>
              </button>

              <button type="button" className="study-menu-card">
                <span className="study-menu-icon">🎬</span>
                <strong>중국 드라마 필사</strong>
                <small>드라마 대사를 따라 써보기</small>
              </button>

              <button type="button" className="study-menu-card">
                <span className="study-menu-icon">💬</span>
                <strong>오늘의 문형 회화</strong>
                <small>매일 다른 문형으로 연습하기</small>
              </button>

              <Link
                href="/study-record"
                className="study-menu-card study-record-link"
              >
                <span className="study-menu-icon">📝</span>
                <strong>공부일지 작성</strong>
                <small>오늘 공부한 내용과 메모 남기기</small>
              </Link>
            </div>
          </section>

          <div className="dashboard-grid">
            <section className="study-record-section">
              <div className="section-heading">
                <div>
                  <span className="heading-number">03</span>

                  <div>
                    <p>TODAY&apos;S STUDY</p>
                    <h2>오늘의 공부 기록</h2>
                  </div>
                </div>

                <Link
                  href="/study-record"
                  className="primary-button"
                >
                  ＋ 공부 인증하기
                </Link>
              </div>

              <TodayStudyRecords />
            </section>

            <aside className="side-dashboard">
              <section className="weekly-goal-card">
                <div className="card-pin">📌</div>

                <p className="small-title">WEEKLY GOAL</p>
                <h2>이번 주 공부</h2>

                <div className="weekly-time">
                  <strong>6</strong>
                  <span>시간</span>
                  <strong>35</strong>
                  <span>분</span>
                </div>

                <div className="goal-row">
                  <span>이번 주 목표</span>
                  <strong>10시간</strong>
                </div>

                <div className="goal-progress">
                  <div className="goal-progress-bar" />
                </div>

                <p className="goal-message">
                  목표까지 3시간 25분 남았어요 ♡
                </p>
              </section>

              <section className="weekly-calendar">
                <div className="calendar-top">
                  <div>
                    <p>2026 JULY</p>
                    <h2>이번 주 출석</h2>
                  </div>

                  <span>📅</span>
                </div>

                <div className="week-list">
                  {weekDays.map((item) => (
                    <div
                      className={`week-day ${
                        item.completed
                          ? "week-day-completed"
                          : ""
                      }`}
                      key={item.day}
                    >
                      <span>{item.day}</span>
                      <strong>{item.date}</strong>
                      <small>
                        {item.completed ? "✓" : "·"}
                      </small>
                    </div>
                  ))}
                </div>
              </section>

              <section className="quick-menu">
                <button type="button">
                  <span className="quick-icon">📆</span>

                  <span>
                    <strong>공부 캘린더</strong>
                    <small>월별 공부 기록 보기</small>
                  </span>

                  <b>›</b>
                </button>

                <button type="button">
                  <span className="quick-icon">⏰</span>

                  <span>
                    <strong>공부 타임라인</strong>
                    <small>시간대별 기록 확인</small>
                  </span>

                  <b>›</b>
                </button>

                <button type="button">
                  <span className="quick-icon">💌</span>

                  <span>
                    <strong>우리의 기록</strong>
                    <small>함께 쌓은 추억 보기</small>
                  </span>

                  <b>›</b>
                </button>
              </section>
            </aside>
          </div>
        </div>

        <footer className="diary-footer">
          <span>지원 × 재은</span>
          <p>今天也做得很好 ♡</p>
          <span>2026.07.28</span>
        </footer>
      </section>
    </main>
  );
}