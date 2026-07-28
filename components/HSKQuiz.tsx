"use client";

import Link from "next/link";
import { useState } from "react";
import { hsk5Words } from "@/data/hsk5";

const QUIZ_COUNT = 20;

function getRandomWords() {
  return [...hsk5Words]
    .sort(() => Math.random() - 0.5)
    .slice(0, QUIZ_COUNT);
}

export default function HSKQuiz() {
  const [words, setWords] = useState(() => getRandomWords());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [knownCount, setKnownCount] = useState(0);
  const [unknownWords, setUnknownWords] = useState<typeof hsk5Words>([]);
  const [isFinished, setIsFinished] = useState(false);

  const currentWord = words[currentIndex];

  const progress =
    words.length > 0
      ? ((currentIndex + 1) / words.length) * 100
      : 0;

  function handleNext(isKnown: boolean) {
    if (!currentWord) return;

    if (isKnown) {
      setKnownCount((previous) => previous + 1);
    } else {
      setUnknownWords((previous) => {
        const alreadyExists = previous.some(
          (word) => word.id === currentWord.id
        );

        if (alreadyExists) {
          return previous;
        }

        return [...previous, currentWord];
      });
    }

    if (currentIndex === words.length - 1) {
      setIsFinished(true);
      return;
    }

    setCurrentIndex((previous) => previous + 1);
    setShowAnswer(false);
  }

  function restartQuiz() {
    setWords(getRandomWords());
    setCurrentIndex(0);
    setShowAnswer(false);
    setKnownCount(0);
    setUnknownWords([]);
    setIsFinished(false);
  }

  if (!currentWord) {
    return (
      <>
        <div
          style={{
            width: "100%",
            maxWidth: "720px",
            margin: "0 auto 20px",
          }}
        >
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "10px 18px",
              border: "3px solid #4c4037",
              borderRadius: "999px",
              background: "#ffffff",
              color: "#4c4037",
              fontWeight: 800,
              textDecoration: "none",
              boxShadow: "4px 4px 0 #4c4037",
            }}
          >
            ← 홈으로 돌아가기
          </Link>
        </div>

        <section className="hsk-empty-card">
          단어 데이터를 불러오지 못했어요.
        </section>
      </>
    );
  }

  if (isFinished) {
    return (
      <>
        <div
          style={{
            width: "100%",
            maxWidth: "720px",
            margin: "0 auto 20px",
          }}
        >
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "10px 18px",
              border: "3px solid #4c4037",
              borderRadius: "999px",
              background: "#ffffff",
              color: "#4c4037",
              fontWeight: 800,
              textDecoration: "none",
              boxShadow: "4px 4px 0 #4c4037",
            }}
          >
            ← 홈으로 돌아가기
          </Link>
        </div>

        <section className="hsk-result-card">
          <div className="hsk-result-sticker">
            完成!
          </div>

          <p className="hsk-small-label">
            TODAY&apos;S RESULT
          </p>

          <h2>오늘의 단어 공부 완료!</h2>

          <div className="hsk-score-circle">
            <strong>{knownCount}</strong>
            <span>/ {words.length}</span>
          </div>

          <p className="hsk-result-message">
            오늘 총 {words.length}개의 단어를 확인했어요.
            <br />
            다시 볼 단어는 {unknownWords.length}개예요.
          </p>

          {unknownWords.length > 0 && (
            <div className="hsk-wrong-section">
              <div className="hsk-wrong-heading">
                <span>📌</span>
                <strong>다시 볼 단어</strong>
              </div>

              <div className="hsk-wrong-list">
                {unknownWords.map((word) => (
                  <div
                    className="hsk-wrong-item"
                    key={word.id}
                  >
                    <div>
                      <strong>{word.chinese}</strong>
                      <span>{word.pinyin}</span>
                    </div>

                    <p>{word.korean}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            className="hsk-restart-button"
            onClick={restartQuiz}
          >
            ↻ 새로운 단어 20개 공부하기
          </button>
        </section>
      </>
    );
  }

  return (
    <>
      <div
        style={{
          width: "100%",
          maxWidth: "720px",
          margin: "0 auto 20px",
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "10px 18px",
            border: "3px solid #4c4037",
            borderRadius: "999px",
            background: "#ffffff",
            color: "#4c4037",
            fontWeight: 800,
            textDecoration: "none",
            boxShadow: "4px 4px 0 #4c4037",
          }}
        >
          ← 홈으로 돌아가기
        </Link>
      </div>

      <section className="hsk-quiz-card">
        <div className="hsk-card-tape" />

        <div className="hsk-quiz-top">
          <div>
            <p className="hsk-small-label">
              TODAY&apos;S VOCABULARY
            </p>

            <strong>
              {currentIndex + 1} / {words.length}
            </strong>
          </div>

          <span className="hsk-level-badge">
            HSK 5급
          </span>
        </div>

        <div className="hsk-progress">
          <div
            className="hsk-progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="hsk-word-area">
          {currentWord.category && (
            <span className="hsk-category">
              {currentWord.category}
            </span>
          )}

          <h2>{currentWord.chinese}</h2>

          <p className="hsk-pinyin">
            {currentWord.pinyin}
          </p>

          <div
            className={`hsk-answer-box ${
              showAnswer
                ? "hsk-answer-visible"
                : ""
            }`}
          >
            {showAnswer ? (
              <>
                <span>뜻</span>
                <strong>{currentWord.korean}</strong>
              </>
            ) : (
              <>
                <span>
                  먼저 뜻을 생각해 보세요
                </span>
                <strong>?</strong>
              </>
            )}
          </div>
        </div>

        {!showAnswer ? (
          <button
            type="button"
            className="hsk-show-answer-button"
            onClick={() => setShowAnswer(true)}
          >
            뜻 확인하기
          </button>
        ) : (
          <div className="hsk-answer-buttons">
            <button
              type="button"
              className="hsk-unknown-button"
              onClick={() => handleNext(false)}
            >
              <span>😵‍💫</span>
              아직 몰라요
            </button>

            <button
              type="button"
              className="hsk-known-button"
              onClick={() => handleNext(true)}
            >
              <span>🙆🏻‍♀️</span>
              알고 있어요
            </button>
          </div>
        )}

        <p className="hsk-card-tip">
          모르는 단어는 마지막에 다시 모아 보여줘요 ♡
        </p>
      </section>
    </>
  );
}
