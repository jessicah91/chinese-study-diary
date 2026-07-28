"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { supabase } from "@/lib/supabase";

export type CurrentUser = {
  id: string;
  name: string;
  emoji: string;
};

type UserContextType = {
  currentUser: CurrentUser;
  changeUser: () => void;
};

type UserProviderProps = {
  children: ReactNode;
};

const UserContext = createContext<UserContextType | null>(null);

export default function UserProvider({ children }: UserProviderProps) {
  const [users, setUsers] = useState<CurrentUser[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadUsers() {
      setIsLoading(true);
      setErrorMessage("");

      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, emoji")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("프로필 불러오기 실패:", error);
        setErrorMessage("사용자 정보를 불러오지 못했어요.");
        setIsLoading(false);
        return;
      }

      const loadedUsers = data ?? [];

      setUsers(loadedUsers);

      const savedUserId = localStorage.getItem("chinese-diary-user");
      const savedUser = loadedUsers.find(
        (user) => user.id === savedUserId,
      );

      if (savedUser) {
        setCurrentUser(savedUser);
      }

      setIsLoading(false);
    }

    loadUsers();
  }, []);

  function selectUser(user: CurrentUser) {
    localStorage.setItem("chinese-diary-user", user.id);
    setCurrentUser(user);
  }

  function changeUser() {
    localStorage.removeItem("chinese-diary-user");
    setCurrentUser(null);
  }

  if (isLoading) {
    return (
      <main className="user-loading-screen">
        <p>我们的中文日记</p>
        <span>다이어리를 펼치는 중...</span>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="user-loading-screen">
        <p>앗!</p>
        <span>{errorMessage}</span>
      </main>
    );
  }

  if (!currentUser) {
    return (
      <main className="user-select-screen">
        <section className="user-select-window">
          <div className="user-select-title-bar">
            <span>📖 我们的中文日记</span>

            <div aria-hidden="true">
              <span>—</span>
              <span>□</span>
              <span>×</span>
            </div>
          </div>

          <div className="user-select-content">
            <div className="user-select-tape" />

            <p className="user-select-label">
              WELCOME TO OUR DIARY
            </p>

            <h1>누구세요?</h1>

            <p className="user-select-description">
              오늘의 공부를 기록할 캐릭터를 선택해 주세요
            </p>

            <div className="user-options">
              {users.map((user) => (
                <button
                  type="button"
                  className={`user-option user-option-${user.id}`}
                  key={user.id}
                  onClick={() => selectUser(user)}
                >
                  <span className="user-option-emoji">
                    {user.emoji}
                  </span>

                  <strong>{user.name}</strong>

                  <small>입장하기 →</small>
                </button>
              ))}
            </div>

            <div className="user-select-message">
              <span>♥</span>
              <p>지원과 재은의 중국어 공부 기록장</p>
              <span>♥</span>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <UserContext.Provider value={{ currentUser, changeUser }}>
      <button
        type="button"
        className="change-user-button"
        onClick={changeUser}
      >
        {currentUser.emoji} {currentUser.name} · 사용자 바꾸기
      </button>

      {children}
    </UserContext.Provider>
  );
}

export function useCurrentUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error(
      "useCurrentUser는 UserProvider 안에서 사용해야 합니다.",
    );
  }

  return context;
}