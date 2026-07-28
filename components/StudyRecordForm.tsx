"use client";

import { useState, type FormEvent } from "react";

import { supabase } from "@/lib/supabase";
import { useCurrentUser } from "@/components/UserProvider";

type ActivityType =
  | "vocabulary"
  | "reading"
  | "drama_dictation"
  | "speaking_pattern"
  | "free_study";

const activityOptions: {
  value: ActivityType;
  label: string;
}[] = [
  {
    value: "vocabulary",
    label: "HSK 5급 단어 테스트",
  },
  {
    value: "reading",
    label: "HSK 5급 단문 독해",
  },
  {
    value: "drama_dictation",
    label: "중국 드라마 필사",
  },
  {
    value: "speaking_pattern",
    label: "오늘의 문형 회화",
  },
  {
    value: "free_study",
    label: "자유 공부 기록",
  },
];

export default function StudyRecordForm() {
  const { currentUser } = useCurrentUser();

  const [activityType, setActivityType] =
    useState<ActivityType>("vocabulary");

  const [title, setTitle] = useState("");
  const [score, setScore] = useState("");
  const [totalQuestions, setTotalQuestions] = useState("");
  const [content, setContent] = useState("");
  const [memo, setMemo] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const showScoreFields =
    activityType === "vocabulary" ||
    activityType === "reading";

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!title.trim()) {
      setMessage("공부 제목을 입력해 주세요.");
      return;
    }

    const parsedScore =
      score.trim() === "" ? null : Number(score);

    const parsedTotalQuestions =
      totalQuestions.trim() === ""
        ? null
        : Number(totalQuestions);

    if (
      parsedScore !== null &&
      (!Number.isInteger(parsedScore) || parsedScore < 0)
    ) {
      setMessage(
        "맞힌 개수는 0 이상의 정수로 입력해 주세요.",
      );
      return;
    }

    if (
      parsedTotalQuestions !== null &&
      (!Number.isInteger(parsedTotalQuestions) ||
        parsedTotalQuestions < 1)
    ) {
      setMessage(
        "전체 문제 수는 1 이상의 정수로 입력해 주세요.",
      );
      return;
    }

    if (
      parsedScore !== null &&
      parsedTotalQuestions !== null &&
      parsedScore > parsedTotalQuestions
    ) {
      setMessage(
        "맞힌 개수는 전체 문제 수보다 클 수 없어요.",
      );
      return;
    }

    setIsSaving(true);
    setMessage("");

    const koreanStudyDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());

    const { error } = await supabase
  .from("study_records")
  .insert({
    user_id: currentUser.id,
    activity_type: activityType,
    title: title.trim(),
    score: parsedScore,
    total_questions: parsedTotalQuestions,
    content: content.trim() || null,
    memo: memo.trim() || null,
    study_date: koreanStudyDate,
  });


    if (error) {
      console.error(error);

      setMessage(
        `저장하지 못했어요: ${error.message}`,
      );

      setIsSaving(false);
      return;
    }

    setTitle("");
    setScore("");
    setTotalQuestions("");
    setContent("");
    setMemo("");

    setMessage(
      `${currentUser.emoji} ${currentUser.name}의 공부 기록을 저장했어요!`,
    );

    setIsSaving(false);
  }

  return (
    <section className="study-form-section">
      <div className="section-heading">
        <div>
          <p className="section-kicker">
            STUDY RECORD
          </p>

          <h2>오늘의 공부 기록</h2>
        </div>

        <span className="study-form-user">
          {currentUser.emoji} {currentUser.name}
        </span>
      </div>

      <form
        className="study-record-form"
        onSubmit={handleSubmit}
      >
        <label>
          <span>공부 종류</span>

          <select
            value={activityType}
            onChange={(event) =>
              setActivityType(
                event.target.value as ActivityType,
              )
            }
          >
            {activityOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>공부 제목</span>

          <input
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="예: HSK 5급 단어 Day 1"
            maxLength={100}
          />
        </label>

        {showScoreFields && (
          <div className="study-score-grid">
            <label>
              <span>맞힌 개수</span>

              <input
                type="number"
                min="0"
                value={score}
                onChange={(event) =>
                  setScore(event.target.value)
                }
                placeholder="8"
              />
            </label>

            <label>
              <span>전체 문제 수</span>

              <input
                type="number"
                min="1"
                value={totalQuestions}
                onChange={(event) =>
                  setTotalQuestions(event.target.value)
                }
                placeholder="10"
              />
            </label>
          </div>
        )}

        <label>
          <span>오늘 공부한 내용</span>

          <textarea
            value={content}
            onChange={(event) =>
              setContent(event.target.value)
            }
            placeholder="배운 단어, 문장, 드라마 대사 등을 적어 주세요."
            rows={5}
          />
        </label>

        <label>
          <span>메모</span>

          <textarea
            value={memo}
            onChange={(event) =>
              setMemo(event.target.value)
            }
            placeholder="헷갈린 내용이나 복습할 내용을 적어 주세요."
            rows={3}
          />
        </label>

        <button
          type="submit"
          className="study-save-button"
          disabled={isSaving}
        >
          {isSaving
            ? "저장 중..."
            : "공부 기록 저장하기"}
        </button>

        {message && (
          <p className="study-form-message">
            {message}
          </p>
        )}
      </form>
    </section>
  );
}