"use client";

import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import DailyMessage from "@/components/DailyMessage";

type UserName = "지원" | "재은";

type MessageData = {
  user_name: UserName;
  chinese_message: string;
  korean_message: string;
};

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

const defaultMessages: Record<UserName, MessageData> = {
  지원: {
    user_name: "지원",
    chinese_message: "今天也不要放弃！",
    korean_message: "오늘도 포기하지 말자!",
  },
  재은: {
    user_name: "재은",
    chinese_message: "我们一起加油吧！",
    korean_message: "우리 같이 힘내자!",
  },
};

export default function DailyMessageSection() {
  const [messages, setMessages] =
    useState<Record<UserName, MessageData>>(
      defaultMessages
    );

  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] =
    useState<UserName>("지원");

  const [chineseMessage, setChineseMessage] =
    useState("");
  const [koreanMessage, setKoreanMessage] =
    useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    async function loadMessages() {
      const { data, error } = await supabase
        .from("daily_messages")
        .select(
          "user_name, chinese_message, korean_message"
        );

      if (error || !data) {
        console.error(
          "메시지를 불러오지 못했습니다.",
          error
        );
        return;
      }

      const nextMessages = {
        ...defaultMessages,
      };

      data.forEach((message) => {
  if (
    message.user_name !== "지원" &&
    message.user_name !== "재은"
  ) {
    return;
  }

  const userName: UserName = message.user_name;

  nextMessages[userName] = {
    user_name: userName,
    chinese_message: message.chinese_message,
    korean_message: message.korean_message,
  };
});

      setMessages(nextMessages);
    }

    loadMessages();
  }, []);

  function openEditor(userName: UserName) {
    const currentMessage = messages[userName];

    setSelectedUser(userName);
    setChineseMessage(
      currentMessage.chinese_message
    );
    setKoreanMessage(
      currentMessage.korean_message
    );
    setErrorMessage("");
    setIsOpen(true);
  }

  function closeEditor() {
    if (isSaving) return;

    setIsOpen(false);
    setErrorMessage("");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const trimmedChinese =
      chineseMessage.trim();
    const trimmedKorean =
      koreanMessage.trim();

    if (!trimmedChinese) {
      setErrorMessage(
        "중국어 메시지를 입력해 주세요."
      );
      return;
    }

    if (!trimmedKorean) {
      setErrorMessage(
        "한국어 뜻을 입력해 주세요."
      );
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    const { error } = await supabase
      .from("daily_messages")
      .upsert(
        {
          user_name: selectedUser,
          chinese_message: trimmedChinese,
          korean_message: trimmedKorean,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_name",
        }
      );

    if (error) {
      console.error(error);
      setErrorMessage(
        "저장하지 못했어요. 잠시 후 다시 시도해 주세요."
      );
      setIsSaving(false);
      return;
    }

    setMessages((previous) => ({
      ...previous,
      [selectedUser]: {
        user_name: selectedUser,
        chinese_message: trimmedChinese,
        korean_message: trimmedKorean,
      },
    }));

    setIsSaving(false);
    setIsOpen(false);
  }

  return (
    <>
      <section className="message-board">
        <div className="section-heading">
          <div>
            <span className="heading-number">
              01
            </span>

            <div>
              <p>TODAY&apos;S MESSAGE</p>
              <h2>오늘의 한마디</h2>
            </div>
          </div>

          <button
            type="button"
            className="edit-message-button"
            onClick={() => openEditor("지원")}
          >
            ✎ 메시지 쓰기
          </button>
        </div>

        <div className="message-grid">
          <button
            type="button"
            className="daily-message-click-area"
            onClick={() => openEditor("지원")}
            aria-label="지원 메시지 수정"
          >
            <DailyMessage
              name="지원"
              character="🐰"
              chineseMessage={
                messages.지원.chinese_message
              }
              koreanMessage={
                messages.지원.korean_message
              }
              direction="left"
              characterColor="pink"
            />
          </button>

          <div className="friendship-line">
            <span>♥</span>
            <div />
            <span>♥</span>
          </div>

          <button
            type="button"
            className="daily-message-click-area"
            onClick={() => openEditor("재은")}
            aria-label="재은 메시지 수정"
          >
            <DailyMessage
              name="재은"
              character="🦁"
              chineseMessage={
                messages.재은.chinese_message
              }
              koreanMessage={
                messages.재은.korean_message
              }
              direction="right"
              characterColor="yellow"
            />
          </button>
        </div>
      </section>

      {isOpen && (
        <div
          className="message-modal-backdrop"
          onMouseDown={closeEditor}
        >
          <div
            className="message-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="message-modal-title"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div className="message-modal-tape" />

            <div className="message-modal-header">
              <div>
                <p>TODAY&apos;S MESSAGE</p>
                <h2 id="message-modal-title">
                  오늘의 한마디 쓰기
                </h2>
              </div>

              <button
                type="button"
                className="message-modal-close"
                onClick={closeEditor}
                aria-label="닫기"
              >
                ×
              </button>
            </div>

            <div className="message-user-selector">
              <button
                type="button"
                className={
                  selectedUser === "지원"
                    ? "message-user-active"
                    : ""
                }
                onClick={() =>
                  openEditor("지원")
                }
              >
                🐰 지원
              </button>

              <button
                type="button"
                className={
                  selectedUser === "재은"
                    ? "message-user-active"
                    : ""
                }
                onClick={() =>
                  openEditor("재은")
                }
              >
                🦁 재은
              </button>
            </div>

            <form
              className="message-editor-form"
              onSubmit={handleSubmit}
            >
              <label>
                <span>중국어 메시지</span>

                <textarea
                  value={chineseMessage}
                  onChange={(event) =>
                    setChineseMessage(
                      event.target.value
                    )
                  }
                  maxLength={80}
                  placeholder="例如：今天也一起加油吧！"
                />

                <small>
                  {chineseMessage.length}/80
                </small>
              </label>

              <label>
                <span>한국어 뜻</span>

                <textarea
                  value={koreanMessage}
                  onChange={(event) =>
                    setKoreanMessage(
                      event.target.value
                    )
                  }
                  maxLength={80}
                  placeholder="예: 오늘도 같이 힘내자!"
                />

                <small>
                  {koreanMessage.length}/80
                </small>
              </label>

              {errorMessage && (
                <p className="message-form-error">
                  {errorMessage}
                </p>
              )}

              <div className="message-form-buttons">
                <button
                  type="button"
                  className="message-cancel-button"
                  onClick={closeEditor}
                  disabled={isSaving}
                >
                  취소
                </button>

                <button
                  type="submit"
                  className="message-save-button"
                  disabled={isSaving}
                >
                  {isSaving
                    ? "저장 중..."
                    : "메시지 저장하기"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}