import HSKQuiz from "@/components/HSKQuiz";

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-4xl font-bold text-center mb-8">
        📖 HSK5 단어 공부
      </h1>

      <HSKQuiz />

    </main>
  );
}