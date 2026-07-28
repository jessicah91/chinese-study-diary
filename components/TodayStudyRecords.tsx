"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

type StudyRecord = {
  id: number;
  user_id: string;
  activity_type:
    | "vocabulary"
    | "reading"
    | "drama_dictation"
    | "speaking_pattern"
    | "free_study";
  title: string;
  score: number | null;
  total_questions: number | null;
  content: string | null;
  memo: string | null;
  study_date: string;
  created_at: string;
};

type Profile = {
  id: string;
  name: string;
  emoji: string;
};

const activityLabels: Record<
  StudyRecord["activity_type"],
  string
> = {
  vocabulary: "HSK 5급 단어",
  reading: "HSK 5급 단문 독해",
  drama_dictation: "중국 드라마 필사",
  speaking_pattern: "오늘의 문형 회화",
  free_study: "자유 공부",
};

function getKoreanDateString() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export default function TodayStudyRecords() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [records, setRecords] = useState<StudyRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadTodayRecords() {
      setIsLoading(true);
      setErrorMessage("");

      const today = getKoreanDateString();

      const [
        { data: profileData, error: profileError },
        { data: recordData, error: recordError },
      ] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, name, emoji"),

        supabase
          .from("study_records")
          .select(
            `
              id,
              user_id,
              activity_type,
              title,
              score,
              total_questions,
              content,
              memo,
              study_date,
              created_at
            `,
          )
          .eq("study_date", today)
          .order("created_at", { ascending: false }),
      ]);

      if (profileError) {
        console.error("프로필 조회 오류:", profileError);

        setErrorMessage(
          `사용자 정보를 불러오지 못했어요: ${profileError.message}`,
        );
        setIsLoading(false);
        return;
      }

      if (recordError) {
        console.error("공부 기록 조회 오류:", recordError);

        setErrorMessage(
          `공부 기록을 불러오지 못했어요: ${recordError.message}`,
        );
        setIsLoading(false);
        return;
      }

      const profileOrder: Record<string, number> = {
        jiwon: 0,
        jaeeun: 1,
      };

      const orderedProfiles = [...(profileData ?? [])].sort(
        (first, second) =>
          (profileOrder[first.id] ?? 99) -
          (profileOrder[second.id] ?? 99),
      );

      setProfiles(orderedProfiles);
      setRecords(recordData ?? []);
      setIsLoading(false);
    }

    loadTodayRecords();
  }, []);

  if (isLoading) {
    return (
      <div className="today-record-loading">
        오늘의 공부 기록을 불러오는 중이에요...
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="today-record-error">
        {errorMessage}
      </div>
    );
  }

  return (
    <div className="today-record-users">
      {profiles.map((profile) => {
        const userRecords = records.filter(
          (record) => record.user_id === profile.id,
        );

        return (
          <article
            className="today-user-record-card"
            key={profile.id}
          >
            <header className="today-user-record-header">
              <div className="today-user-name">
                <span className="today-user-emoji">
                  {profile.emoji}
                </span>

                <div>
                  <strong>{profile.name}</strong>
                  <small>
                    {userRecords.length > 0
                      ? `오늘 ${userRecords.length}개 완료`
                      : "아직 공부 전"}
                  </small>
                </div>
              </div>

              <span
                className={`today-study-status ${
                  userRecords.length > 0
                    ? "today-study-completed"
                    : ""
                }`}
              >
                {userRecords.length > 0
                  ? "공부 완료 ✓"
                  : "미완료"}
              </span>
            </header>

            {userRecords.length === 0 ? (
              <div className="today-empty-record">
                <span>🌱</span>

                <div>
                  <strong>
                    오늘은 아직 공부하지 않았어요
                  </strong>
                  <p>
                    공부 기록을 남기면 여기에 바로
                    표시돼요.
                  </p>
                </div>
              </div>
            ) : (
              <div className="today-record-list">
                {userRecords.map((record) => (
                  <div
                    className="today-record-item"
                    key={record.id}
                  >
                    <div className="today-record-item-top">
                      <span className="today-record-category">
                        {activityLabels[record.activity_type]}
                      </span>

                      {record.score !== null &&
                        record.total_questions !== null && (
                          <strong className="today-record-score">
                            {record.score}/
                            {record.total_questions}
                          </strong>
                        )}
                    </div>

                    <h3>{record.title}</h3>

                    {record.content && (
                      <p className="today-record-content">
                        {record.content}
                      </p>
                    )}

                    {record.memo && (
                      <div className="today-record-memo">
                        <span>✎ 메모</span>
                        <p>{record.memo}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}