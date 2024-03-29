"use client";
import { useState, useEffect, useMemo } from "react";
import cx from "clsx";
import { notes, threeOctaves, majorScaleSteps, majorChords } from "@/lib/music";

export default function Home() {
  const [selectedRoot, setSelectedRoot] = useState("");
  const [selectedRootIdx, setSelectedRootIdx] = useState();
  const [selectedChords, setSelectedChords] = useState([]);
  const [selectedMajorScale, setSelectedMajorScale] = useState([]);

  useEffect(() => {
    setSelectedRootIdx(notes.indexOf(selectedRoot));
  }, [selectedRoot]);

  useEffect(() => {
    const majorScale = [notes[selectedRootIdx]];

    majorScaleSteps.forEach((interval) => {
      const lastIdx = notes.indexOf(majorScale[majorScale.length - 1]);
      majorScale.push(threeOctaves[lastIdx + interval]);
    });

    setSelectedMajorScale(
      majorScale
        .concat(majorScale.slice(1, majorScale.length))
        .concat(majorScale.slice(1, majorScale.length))
    );
  }, [selectedRootIdx]);

  const chordTones = (chord) => {
    const chordIdx = majorChords.indexOf(chord);
    return [0, 2, 4, 6, 8, 10, 12].map((n) => selectedMajorScale[chordIdx + n]);
  };

  const selectedChordColors = [
    "bg-green-600",
    "bg-sky-600",
    "bg-pink-600",
    "bg-orange-600",
  ];

  const selectedRootStyle = (note) =>
    selectedRoot == note
      ? "bg-slate-100 text-black pointer-events-none"
      : "bg-slate-600 text-slate-400 hover:bg-slate-300";

  const selectedChordStyle = (chord) => {
    const idx = selectedChords.indexOf(chord);

    if (idx > -1) {
      return cx("text-white", selectedChordColors[idx]);
    } else if (!selectedRoot || selectedChords.length > 3) {
      return "opacity-70 bg-slate-600 text-slate-400 pointer-events-none";
    } else {
      return "bg-slate-600 text-slate-400 hover:bg-slate-300";
    }
  };

  const manageSelectedScales = (chord) => {
    if (selectedChords.includes(chord))
      setSelectedChords([...selectedChords.filter((s) => s !== chord)]);
    else if (selectedChords.length < 4)
      setSelectedChords([...selectedChords, chord]);
  };

  return (
    <main className="grid grid-cols-3 md:grid-cols-12 w-full gap-4 md:p-4">
      {notes.map((note, i) => (
        <button
          key={`root-picker-${i}`}
          className={cx(
            "text-5xl py-2 rounded-lg w-[115px]",
            selectedRootStyle(note)
          )}
          onClick={(e) => setSelectedRoot(e.target.textContent)}
        >
          {note}
        </button>
      ))}

      {!!selectedRoot &&
        majorChords.map((chord, i) => (
          <button
            key={`chord-picker-${i}`}
            className={cx(
              "text-5xl py-2 rounded-lg w-[115px]",
              selectedChordStyle(chord)
            )}
            onClick={() => manageSelectedScales(chord)}
          >
            {chord}
          </button>
        ))}

      <div className="col-span-2 md:col-span-5">&nbsp;</div>

      {selectedChords.map((chord, i) => (
        <>
          {[1, 3, 5, 7, 9, 11, 13].map((degree, n) => (
            <div
              key={`chord-tone-${i}-${n}`}
              className={cx(
                "flex flex-col items-center justify-center py-2 w-[115px] rounded-lg",
                selectedChordColors[i]
              )}
            >
              <span className="text-2xl">{degree}</span>
              <span className="text-5xl">{chordTones(chord)[n]}</span>
            </div>
          ))}
          <div className="col-span-2 md:col-span-5">&nbsp;</div>
        </>
      ))}
    </main>
  );
}
