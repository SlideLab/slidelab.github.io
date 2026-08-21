import Hero from "./components/Hero";
import SystemChapter from "./components/SystemChapter";
import ConfArenaChapter from "./components/ConfArenaChapter";
import ResultsChapter from "./components/ResultsChapter";
import ValidationChapter from "./components/ValidationChapter";
import DecksChapter from "./components/DecksChapter";

export default function Home() {
  return (
    <main className="page">
      <Hero />
      <SystemChapter />
      <ConfArenaChapter />
      <ResultsChapter />
      <ValidationChapter />
      <DecksChapter />
    </main>
  );
}
