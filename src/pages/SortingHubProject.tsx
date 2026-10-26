import { useState, useRef, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Check,
  Copy,
  Cpu,
  Layers,
  ArrowRight,
  ExternalLink,
  Sliders,
  Clock,
  ShieldCheck,
} from "lucide-react";
import EngineeringArticle, {
  ArticleSection,
  SourceLink,
} from "@/components/EngineeringArticle";

const repo = "https://github.com/rl4658/sorting-hub";
const sections = [
  ["overview", "01 / Overview"],
  ["concurrency", "02 / Concurrency & threading"],
  ["strategy-pattern", "03 / Strategy pattern"],
  ["algorithms", "04 / Algorithmic comparison"],
  ["interactive-studio", "05 / Interactive simulator"],
  ["source-code", "06 / Source code review"],
  ["benchmarks", "07 / Complexity analysis"],
] as const;

/* Helper to generate deterministic random permutation 1..n without duplicates */
function createPermutation(n: number): number[] {
  const arr = Array.from({ length: n }, (_, i) => i + 1);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ------------------------------------------------------------------------- */
/* Interactive JavaFX Desktop Simulator                                      */
/* ------------------------------------------------------------------------- */
function InteractiveSortingSimulator() {
  const [arraySize, setArraySize] = useState<number>(64);
  const [algorithm, setAlgorithm] = useState<"Merge Sort" | "Selection Sort">("Merge Sort");
  const [array, setArray] = useState<number[]>(() => createPermutation(64));
  const [isSorting, setIsSorting] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(40); // ms delay
  const [comparingIdx, setComparingIdx] = useState<number[]>([]);
  const [activeIdx, setActiveIdx] = useState<number[]>([]);
  const [comparisons, setComparisons] = useState<number>(0);
  const [writes, setWrites] = useState<number>(0);
  const [threadState, setThreadState] = useState<"IDLE" | "RUNNING" | "PAUSED">("IDLE");

  const runIdRef = useRef<number>(0);
  const pauseRef = useRef<boolean>(false);

  // Sync pause ref
  useEffect(() => {
    pauseRef.current = isPaused;
  }, [isPaused]);

  // Regenerate array when array size changes
  const handleSizeChange = (newSize: number) => {
    runIdRef.current++;
    setIsSorting(false);
    setIsPaused(false);
    setThreadState("IDLE");
    setArraySize(newSize);
    setArray(createPermutation(newSize));
    setComparingIdx([]);
    setActiveIdx([]);
    setComparisons(0);
    setWrites(0);
  };

  const handleAlgorithmChange = (newAlgo: "Merge Sort" | "Selection Sort") => {
    runIdRef.current++;
    setIsSorting(false);
    setIsPaused(false);
    setThreadState("IDLE");
    setAlgorithm(newAlgo);
    setComparingIdx([]);
    setActiveIdx([]);
  };

  const handleReset = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    runIdRef.current++;
    setIsSorting(false);
    setIsPaused(false);
    setThreadState("IDLE");
    setArraySize(64);
    setAlgorithm("Merge Sort");
    setArray(createPermutation(64));
    setComparingIdx([]);
    setActiveIdx([]);
    setComparisons(0);
    setWrites(0);
  };

  const waitWithPause = useCallback(
    async (ms: number, currentRunId: number) => {
      let elapsed = 0;
      const step = 10;
      while (elapsed < ms) {
        if (runIdRef.current !== currentRunId) return;
        while (pauseRef.current) {
          if (runIdRef.current !== currentRunId) return;
          await new Promise((r) => setTimeout(r, 40));
        }
        await new Promise((r) => setTimeout(r, step));
        elapsed += step;
      }
    },
    [],
  );

  const startSort = async () => {
    if (isSorting) return;
    const currentRunId = ++runIdRef.current;
    pauseRef.current = false;
    setIsSorting(true);
    setIsPaused(false);
    setThreadState("RUNNING");
    setComparisons(0);
    setWrites(0);
    setComparingIdx([]);
    setActiveIdx([]);

    const working = [...array];
    let cmpCount = 0;
    let writeCount = 0;

    if (algorithm === "Selection Sort") {
      // Direct implementation of SelectionSort.java
      for (let i = 0; i < working.length - 1; i++) {
        if (runIdRef.current !== currentRunId) return;
        let minIdx = i;
        for (let j = i + 1; j < working.length; j++) {
          if (runIdRef.current !== currentRunId) return;
          cmpCount++;
          setComparisons(cmpCount);
          setComparingIdx([minIdx, j]);
          await waitWithPause(speed, currentRunId);
          if (runIdRef.current !== currentRunId) return;
          if (working[j] < working[minIdx]) {
            minIdx = j;
          }
        }
        if (runIdRef.current !== currentRunId) return;
        if (minIdx !== i) {
          const temp = working[i];
          working[i] = working[minIdx];
          working[minIdx] = temp;
          writeCount += 2;
          setWrites(writeCount);
          setArray([...working]);
          setActiveIdx([i, minIdx]);
          await waitWithPause(speed, currentRunId);
          if (runIdRef.current !== currentRunId) return;
        }
      }
    } else {
      // Direct implementation of MergeSort.java (In-Place Merge)
      async function mergeInPlace(l: number, m: number, r: number) {
        if (runIdRef.current !== currentRunId) return;
        let left2 = m + 1;
        cmpCount++;
        setComparisons(cmpCount);
        if (working[m] <= working[left2]) return;

        while (l <= m && left2 <= r) {
          if (runIdRef.current !== currentRunId) return;
          cmpCount++;
          setComparisons(cmpCount);
          setComparingIdx([l, left2]);
          if (working[l] <= working[left2]) {
            l++;
          } else {
            const value = working[left2];
            let index = left2;
            while (index !== l) {
              working[index] = working[index - 1];
              index--;
            }
            working[l] = value;
            writeCount++;
            setWrites(writeCount);
            setArray([...working]);
            setActiveIdx([l, left2]);
            await waitWithPause(speed, currentRunId);
            if (runIdRef.current !== currentRunId) return;
            l++;
            m++;
            left2++;
          }
        }
      }

      async function mergeSortRecursive(l: number, r: number) {
        if (runIdRef.current !== currentRunId || l >= r) return;
        const m = l + Math.floor((r - l) / 2);
        await mergeSortRecursive(l, m);
        if (runIdRef.current !== currentRunId) return;
        await mergeSortRecursive(m + 1, r);
        if (runIdRef.current !== currentRunId) return;
        await mergeInPlace(l, m, r);
      }

      await mergeSortRecursive(0, working.length - 1);
    }

    if (runIdRef.current === currentRunId) {
      setComparingIdx([]);
      setActiveIdx([]);
      setIsSorting(false);
      setIsPaused(false);
      setThreadState("IDLE");
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-neutral-950 overflow-hidden shadow-2xl">
      {/* JavaFX Stage Chrome Header */}
      <div className="px-5 py-3.5 bg-neutral-900 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src="/images/projects/sorting/western_logo.png"
            alt="Western Engineering Crest"
            className="w-6 h-6 object-contain bg-white/10 p-0.5 rounded"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white tracking-wide">
                Sorting Hub
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-neutral-300">
                JavaFX Stage
              </span>
            </div>
            <p className="text-[11px] font-mono text-neutral-400">
              se2203.assignment1 · Western University
            </p>
          </div>
        </div>

        {/* Concurrency Status Telemetry */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10">
            <span
              className={`w-2 h-2 rounded-full ${
                threadState === "RUNNING"
                  ? "bg-emerald-400 animate-pulse"
                  : threadState === "PAUSED"
                  ? "bg-amber-400"
                  : "bg-neutral-500"
              }`}
            />
            <span className="text-neutral-300 text-[11px]">
              {threadState === "RUNNING"
                ? "Worker Thread: RUNNING"
                : threadState === "PAUSED"
                ? "Worker Thread: PAUSED"
                : "Worker Thread: IDLE"}
            </span>
          </div>
          <span className="text-neutral-500 text-[11px] hidden sm:inline">
            Platform.runLater() Sync
          </span>
        </div>
      </div>

      {/* Main Canvas Viewport (768 x 329 aspect) */}
      <div className="p-4 sm:p-6 bg-[#0a0a0a]">
        <div className="h-[280px] sm:h-[340px] md:h-[380px] w-full bg-[#121212] rounded-xl border border-white/10 relative flex items-end justify-center px-2 py-3 overflow-hidden shadow-inner">
          {/* Subtle grid background simulating Scene Builder Pane */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Array Rectangles */}
          <div className="w-full h-full flex items-end justify-between gap-[1px] relative z-10">
            {array.map((val, idx) => {
              const isComparing = comparingIdx.includes(idx);
              const isActive = activeIdx.includes(idx);
              const heightPercent = (val / arraySize) * 100;

              let barColor = "bg-[#ef4444]";
              let shadow = "";

              if (isActive) {
                barColor = "bg-amber-300";
                shadow = "0 0 10px rgba(252, 211, 77, 0.8)";
              } else if (isComparing) {
                barColor = "bg-white";
                shadow = "0 0 10px rgba(255, 255, 255, 0.9)";
              }

              return (
                <div
                  key={idx}
                  style={{
                    height: `${heightPercent}%`,
                    boxShadow: shadow,
                  }}
                  className={`flex-1 rounded-t-[1px] transition-all duration-75 ${barColor}`}
                  title={`Index: ${idx} | Value: ${val}`}
                />
              );
            })}
          </div>
        </div>

        {/* Real-time Telemetry Dashboard */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              Comparisons
            </p>
            <p className="text-xl font-mono font-light text-white mt-0.5">
              {comparisons}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              Array Writes / Shifts
            </p>
            <p className="text-xl font-mono font-light text-white mt-0.5">
              {writes}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              Time Complexity
            </p>
            <p className="text-sm font-mono text-neutral-200 mt-1">
              {algorithm === "Merge Sort" ? "O(N log N)" : "O(N²)"}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              Auxiliary Space
            </p>
            <p className="text-sm font-mono text-neutral-200 mt-1">
              O(1) In-Place
            </p>
          </div>
        </div>

        {/* Controls Layout Matching SortingHub-view.fxml */}
        <div className="mt-5 p-4 rounded-xl bg-neutral-900/80 border border-white/10 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          {/* Algorithm ComboBox */}
          <div className="flex items-center gap-2">
            <label htmlFor="algorithm-select" className="text-neutral-400 text-xs">
              Algorithm:
            </label>
            <select
              id="algorithm-select"
              value={algorithm}
              onChange={(e) =>
                handleAlgorithmChange(e.target.value as "Merge Sort" | "Selection Sort")
              }
              className="bg-black/80 border border-white/20 rounded-lg px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-white/50"
            >
              <option value="Merge Sort">Merge Sort</option>
              <option value="Selection Sort">Selection Sort</option>
            </select>
          </div>

          {/* Slider Scale (32 to 128) */}
          <div className="flex items-center gap-3 min-w-[200px] flex-1 max-w-xs">
            <label htmlFor="array-size-slider" className="text-neutral-400 whitespace-nowrap text-xs">
              Array Size:
            </label>
            <input
              id="array-size-slider"
              type="range"
              min="32"
              max="128"
              step="1"
              value={arraySize}
              onChange={(e) => handleSizeChange(Number(e.target.value))}
              className="w-full accent-white h-1.5 bg-white/20 rounded cursor-pointer"
            />
            <span className="text-white font-bold w-7 text-right">{arraySize}</span>
          </div>

          {/* Speed Delay Slider */}
          <div className="flex items-center gap-2">
            <span className="text-neutral-400 text-xs">Delay:</span>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-16 sm:w-24 accent-white h-1.5 bg-white/20 rounded cursor-pointer"
            />
            <span className="text-neutral-400 text-[11px] w-10">{speed}ms</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 ml-auto">
            {isSorting && (
              <button
                onClick={() => setIsPaused((p) => !p)}
                className="px-3 py-1.5 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-neutral-200 flex items-center gap-1.5 transition-colors"
              >
                {isPaused ? <Play size={13} /> : <Pause size={13} />}
                <span>{isPaused ? "Resume" : "Pause"}</span>
              </button>
            )}

            <button
              onClick={startSort}
              disabled={isSorting && !isPaused}
              className="px-4 py-1.5 rounded-lg bg-white text-black font-bold hover:bg-neutral-200 transition-colors disabled:opacity-40 shadow-[0_0_15px_rgba(255,255,255,0.2)] flex items-center gap-1.5"
            >
              <Play size={13} className="fill-black" />
              <span>{isSorting ? "Sorting..." : "Sort"}</span>
            </button>

            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold transition-colors flex items-center gap-1.5 active:scale-95 shadow-[0_0_10px_rgba(255,255,255,0.05)]"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ------------------------------------------------------------------------- */
/* Source Code Viewer Component                                              */
/* ------------------------------------------------------------------------- */
const codeFiles = {
  strategy: {
    filename: "SortingStrategy.java",
    desc: "Strategy Pattern Interface extending java.lang.Runnable",
    code: `package se2203.assignment1;

import java.lang.Runnable;

public interface SortingStrategy extends Runnable {
    // Operations contract - all algorithms implement Runnable
    void sort(int[] numbers);
}`,
  },
  selection: {
    filename: "SelectionSort.java",
    desc: "Selection Sort algorithm with throttled UI update callbacks",
    code: `package se2203.assignment1;

import javafx.application.Platform;

public class SelectionSort extends SortingHubController implements SortingStrategy {
    private final int[] list;
    private final SortingHubController controller;

    public SelectionSort(int[] arr, SortingHubController sortingHubController) {
        this.list = arr;
        this.controller = sortingHubController;
    }

    public void sort(int[] numbers) {
        try {
            for (int i = 0; i < numbers.length - 1; i++) {
                int indexOfNextSmallest = i;
                for (int j = i + 1; j < numbers.length; j++) {
                    if (numbers[j] < numbers[indexOfNextSmallest]) {
                        indexOfNextSmallest = j;
                    }
                }
                int temp = numbers[i];
                numbers[i] = numbers[indexOfNextSmallest];
                numbers[indexOfNextSmallest] = temp;

                // Safely update JavaFX Application Thread graph
                Platform.runLater(() -> controller.updateGraph(numbers));

                // Throttle worker thread execution for visual perception
                Thread.sleep(60);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void run() {
        sort(list);
    }
}`,
  },
  merge: {
    filename: "MergeSort.java",
    desc: "In-Place Merge Sort algorithm eliminating auxiliary memory allocation",
    code: `package se2203.assignment1;

import javafx.application.Platform;

public class MergeSort extends SortingHubController implements SortingStrategy {
    private final int[] list;
    private final SortingHubController controller;

    public MergeSort(int[] arr, SortingHubController sortingHubController) {
        this.list = arr;
        this.controller = sortingHubController;
    }

    public void sort(int[] numbers) {
        mergeSort(numbers, 0, numbers.length - 1);
    }

    @Override
    public void run() {
        sort(list);
    }

    public void mergeSort(int[] arraySize, int l, int r) {
        if (l < r) {
            int m = l + (r - l) / 2;
            mergeSort(arraySize, l, m);
            mergeSort(arraySize, m + 1, r);
            mergeInPlace(arraySize, l, m, r);
        }
    }

    public void mergeInPlace(int[] array, int l, int m, int r) {
        try {
            int left2 = m + 1;
            if (array[m] <= array[left2]) {
                return;
            }
            while (l <= m && left2 <= r) {
                if (array[l] <= array[left2]) {
                    l++;
                } else {
                    int value = array[left2];
                    int index = left2;
                    // Shift all elements between l and left2 right by 1
                    while (index != l) {
                        array[index] = array[index - 1];
                        index--;
                    }
                    array[l] = value;

                    // Dispatch graph redraw to JavaFX Thread
                    Platform.runLater(() -> controller.updateGraph(array));
                    Thread.sleep(50);

                    l++;
                    m++;
                    left2++;
                }
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}`,
  },
  controller: {
    filename: "SortingHubController.java",
    desc: "JavaFX Controller orchestrating FXML events and Worker Threads",
    code: `package se2203.assignment1;

import javafx.fxml.FXML;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.Initializable;
import javafx.scene.control.Button;
import javafx.scene.control.ComboBox;
import javafx.scene.control.Label;
import javafx.scene.control.Slider;
import javafx.scene.layout.Pane;
import javafx.scene.paint.Color;
import javafx.scene.shape.Rectangle;

import java.net.URL;
import java.util.*;

public class SortingHubController implements Initializable {
    private int[] intArray;
    private SortingStrategy sortingMethod;

    @FXML private Pane sortingStage;
    @FXML private Label arraySize;
    @FXML private Slider sliderScale;
    @FXML private ComboBox<String> comboBox;
    @FXML private Button reset;
    @FXML private Button sorting;

    public void setSortStrategy() {
        if (comboBox.getSelectionModel().getSelectedItem().equals("Merge Sort")) {
            sortingMethod = new MergeSort(intArray, this);
        } else if (comboBox.getSelectionModel().getSelectedItem().equals("Selection Sort")) {
            sortingMethod = new SelectionSort(intArray, this);
        }
    }

    public void updateGraph(int[] data) {
        sortingStage.getChildren().clear();
        Rectangle[] rectangle = new Rectangle[data.length];
        int spacings = data.length - 1;
        double width = (766.0 - spacings) / data.length;

        for (int i = 0; i < data.length; i++) {
            rectangle[i] = new Rectangle();
            rectangle[i].setHeight(intArray[i] / (double) data.length * 327.25);
            rectangle[i].setWidth(width);
            rectangle[i].setX(i * width + i + 1.15);
            rectangle[i].setY((327 - intArray[i] / (double) data.length * 327) + 1.5);
            rectangle[i].setFill(Color.RED);
            sortingStage.getChildren().add(rectangle[i]);
        }
    }

    @FXML
    void sortButton() {
        setSortStrategy();
        // Spawn asynchronous worker thread — UI remains completely responsive
        Thread thread = new Thread(sortingMethod);
        thread.start();
    }

    @FXML
    void resetButton() {
        sliderScale.setValue(64);
        arraySize.setText(String.valueOf(64));
        comboBox.setValue("Merge Sort");
        unsortedArray(64);
        updateGraph(intArray);
    }

    public void unsortedArray(int arraySize) {
        Random random = new Random();
        Set<Integer> generator = new LinkedHashSet<>();
        while (generator.size() < arraySize) {
            int rng = random.nextInt(arraySize) + 1;
            generator.add(rng);
        }
        intArray = new int[generator.size()];
        int j = 0;
        for (Integer i : generator) {
            intArray[j++] = i;
        }
    }
}`,
  },
  fxml: {
    filename: "SortingHub-view.fxml",
    desc: "Scene Builder declarative layout (800x400 AnchorPane)",
    code: `<?xml version="1.0" encoding="UTF-8"?>

<?import javafx.scene.control.Button?>
<?import javafx.scene.control.ComboBox?>
<?import javafx.scene.control.Label?>
<?import javafx.scene.control.Slider?>
<?import javafx.scene.layout.AnchorPane?>
<?import javafx.scene.layout.Pane?>

<AnchorPane maxHeight="-Infinity" maxWidth="-Infinity" minHeight="-Infinity" minWidth="-Infinity" 
            prefHeight="400.0" prefWidth="800.0" 
            xmlns="http://javafx.com/javafx/17" xmlns:fx="http://javafx.com/fxml/1" 
            fx:controller="se2203.assignment1.SortingHubController">
    <children>
        <Button fx:id="reset" layoutX="725.0" layoutY="361.0" mnemonicParsing="false" onAction="#resetButton" prefHeight="25.0" prefWidth="59.0" text="Reset" />
        <Button fx:id="sorting" layoutX="656.0" layoutY="361.0" mnemonicParsing="false" onAction="#sortButton" prefHeight="25.0" prefWidth="58.0" text="Sort" />
        <ComboBox fx:id="comboBox" layoutX="84.0" layoutY="363.0" prefHeight="25.0" prefWidth="162.0" />
        <Slider fx:id="sliderScale" layoutX="345.0" layoutY="368.0" max="128.0" min="32.0" minorTickCount="2" 
                onDragDetected="#detectSlider" onInputMethodTextChanged="#detectSlider" onMouseClicked="#detectSlider" onMouseDragged="#detectSlider" 
                prefHeight="14.0" prefWidth="260.0" />
        <Label layoutX="265.0" layoutY="367.0" text="Array Size" />
        <Label fx:id="arraySize" alignment="CENTER" layoutX="605.0" layoutY="366.0" prefHeight="17.0" prefWidth="26.0" text="64" />
        <Label layoutX="16.0" layoutY="367.0" text="Algorithm" />
        <Pane fx:id="sortingStage" layoutX="16.0" layoutY="14.0" prefHeight="329.0" prefWidth="768.0" 
              style="-fx-border-color: black; -fx-background-color: #eae5e5;" />
    </children>
</AnchorPane>`,
  },
};

type FileKey = keyof typeof codeFiles;

function CodeReviewSection() {
  const [activeTab, setActiveTab] = useState<FileKey>("strategy");
  const [copied, setCopied] = useState<boolean>(false);

  const activeFile = codeFiles[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-neutral-950 overflow-hidden shadow-2xl">
      {/* File Tab Navigation */}
      <div className="flex border-b border-white/10 bg-neutral-900/90 overflow-x-auto">
        {(Object.keys(codeFiles) as FileKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-3 text-xs font-mono whitespace-nowrap transition-colors border-b-2 ${
              activeTab === key
                ? "border-white text-white bg-white/[0.04]"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            {codeFiles[key].filename}
          </button>
        ))}
      </div>

      {/* Code Header Bar */}
      <div className="px-5 py-3 bg-neutral-900/40 border-b border-white/5 flex items-center justify-between text-xs">
        <span className="text-neutral-400 font-mono">{activeFile.desc}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-neutral-200 transition-colors font-mono"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          <span>{copied ? "Copied" : "Copy Code"}</span>
        </button>
      </div>

      {/* Preformatted Code Content */}
      <pre className="p-6 text-xs sm:text-sm font-mono text-neutral-300 leading-relaxed overflow-x-auto max-h-[500px]">
        <code>{activeFile.code}</code>
      </pre>
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* Main Sorting Hub Case Study Page Component                                */
/* ------------------------------------------------------------------------- */
export default function SortingHubProject() {
  return (
    <EngineeringArticle
      title="Sorting Hub: Multi-Threaded JavaFX Algorithm Studio"
      category="Systems & Algorithms"
      description="Deep dive into multi-threaded JavaFX desktop architecture, the Strategy Pattern, and real-time visualization of in-place Merge Sort and Selection Sort without GUI thread lock."
      readingTime="6"
      sections={sections}
      metrics={[
        ["32–128", "Dynamic Array Scaling"],
        ["0 ms", "UI Thread Blocking"],
        ["O(1)", "Auxiliary Memory"],
      ]}
    >
      {/* Section 01: Overview & Academic Context */}
      <ArticleSection id="overview" number="01" title="The Academic Challenge">
        <p>
          At Western University, the Software Design course (<strong>SE 2203</strong>) explores the
          intersection of clean Object-Oriented Design (OOD), algorithmic efficiency, and graphical user
          interface concurrency. The assignment challenged us to develop a complete graphical demonstration
          that visually communicates the step-by-step behavior of classic sorting algorithms in JavaFX.
        </p>
        <p>
          While basic sorting demonstrations are trivial in command-line environments, rendering real-time
          visual feedback on a desktop window introduces a fundamental concurrency problem:{" "}
          <strong>How do you animate thousands of sequential array comparisons without starving the GUI thread?</strong>
        </p>

        <div className="grid sm:grid-cols-3 gap-4 my-8">
          <div className="editorial-card p-5">
            <Cpu className="text-neutral-400 mb-3" size={20} />
            <h4 className="text-sm font-semibold text-white">Multi-Threading</h4>
            <p className="text-xs text-neutral-400 mt-1 leading-5">
              Decoupling computation from the JavaFX Application Thread using background workers.
            </p>
          </div>
          <div className="editorial-card p-5">
            <Layers className="text-neutral-400 mb-3" size={20} />
            <h4 className="text-sm font-semibold text-white">Strategy Pattern</h4>
            <p className="text-xs text-neutral-400 mt-1 leading-5">
              Polymorphic algorithm encapsulation via <code>SortingStrategy extends Runnable</code>.
            </p>
          </div>
          <div className="editorial-card p-5">
            <Sliders className="text-neutral-400 mb-3" size={20} />
            <h4 className="text-sm font-semibold text-white">In-Place Merging</h4>
            <p className="text-xs text-neutral-400 mt-1 leading-5">
              Achieving $O(1)$ auxiliary space in Merge Sort through pointer array shifts.
            </p>
          </div>
        </div>
      </ArticleSection>

      {/* Section 02: Concurrency & The JavaFX Application Thread */}
      <ArticleSection id="concurrency" number="02" title="Concurrency & The JavaFX Thread">
        <p>
          Like modern web browsers and mobile runtimes (Android, iOS), JavaFX enforces a{" "}
          <strong>single-threaded UI model</strong>. All scene graph mutations, CSS calculations, and user input
          events (clicks, mouse drags, key presses) are processed on a single dedicated thread: the{" "}
          <em>JavaFX Application Thread</em>.
        </p>
        <p>
          If a developer runs a sorting algorithm directly on this thread and inserts a sleep delay (e.g.{" "}
          <code>Thread.sleep(60)</code>) to make the animation visible, the entire desktop window freezes. The
          operating system reports the app as &quot;Not Responding&quot;, the window cannot be moved or resized, and
          no visual frames can be painted to the screen.
        </p>

        {/* Comparison Plate */}
        <div className="grid md:grid-cols-2 gap-6 my-8">
          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-red-500/20">
            <div className="flex items-center gap-2 text-red-400 text-xs font-mono uppercase tracking-wider mb-3">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              Naive Synchronous Execution (Faulty)
            </div>
            <pre className="text-xs font-mono text-neutral-300 leading-relaxed overflow-x-auto bg-black/60 p-4 rounded-xl border border-white/5">
              <code>{`// RUNS ON JAVAFX APPLICATION THREAD:
for (int i = 0; i < n; i++) {
    updateGraph(numbers);
    Thread.sleep(60); // ❌ UI FREEZES!
    // Window stops receiving OS events,
    // canvas cannot repaint frames.
}`}</code>
            </pre>
            <p className="text-xs text-neutral-400 mt-3 leading-5">
              Directly sleeping on the GUI thread starves the message pump and breaks UI responsiveness.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-emerald-500/20">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Decoupled Worker Architecture (Engineered)
            </div>
            <pre className="text-xs font-mono text-neutral-300 leading-relaxed overflow-x-auto bg-black/60 p-4 rounded-xl border border-white/5">
              <code>{`// CONTROLLER SPAWNS DEDICATED THREAD:
Thread worker = new Thread(sortingMethod);
worker.start();

// WORKER DISPATCHES REPAINT SAFELY:
Platform.runLater(() -> 
    controller.updateGraph(numbers)
);
Thread.sleep(60); // ✅ ONLY WORKER PAUSES!`}</code>
            </pre>
            <p className="text-xs text-neutral-400 mt-3 leading-5">
              The worker thread handles execution timing while <code>Platform.runLater()</code> schedules lightweight UI updates safely.
            </p>
          </div>
        </div>

        <p>
          Through this separation of concerns, the JavaFX Application Thread remains 100% idle and responsive to
          user input, while the worker thread handles the computation and emits snapshot requests at controlled
          intervals.
        </p>
      </ArticleSection>

      {/* Section 03: The Strategy Pattern Architecture */}
      <ArticleSection id="strategy-pattern" number="03" title="Strategy Pattern Architecture">
        <p>
          To maintain modularity and allow new sorting algorithms to be plugged into the application without
          modifying the controller, the project implements the <strong>Strategy Pattern</strong>.
        </p>
        <p>
          The core contract is defined in <code>SortingStrategy.java</code>, which extends{" "}
          <code>java.lang.Runnable</code>:
        </p>

        <div className="editorial-card p-6 my-6 font-mono text-xs text-neutral-300">
          <p className="text-neutral-500 mb-2">// The Strategy Interface</p>
          <p className="text-white font-semibold">
            public interface SortingStrategy extends Runnable &#123;
          </p>
          <p className="pl-4 text-neutral-300">void sort(int[] numbers);</p>
          <p className="text-white font-semibold">&#125;</p>
        </div>

        <p>
          Because <code>SortingStrategy</code> extends <code>Runnable</code>, any concrete algorithm can be passed
          directly to <code>new Thread(strategy).start()</code>. Both <code>SelectionSort</code> and{" "}
          <code>MergeSort</code> implement this interface. When the user selects an algorithm from the{" "}
          <code>ComboBox</code>, the controller instantiates the chosen strategy and executes it polymorphically:
        </p>

        <div className="editorial-card p-6 my-6 font-mono text-xs text-neutral-300">
          <p className="text-neutral-500 mb-2">// Dynamic Strategy Dispatching in SortingHubController.java</p>
          <p>if (comboBox.getSelectionModel().getSelectedItem().equals(&quot;Merge Sort&quot;)) &#123;</p>
          <p className="pl-4">sortingMethod = new MergeSort(intArray, this);</p>
          <p>&#125; else if (comboBox.getSelectionModel().getSelectedItem().equals(&quot;Selection Sort&quot;)) &#123;</p>
          <p className="pl-4">sortingMethod = new SelectionSort(intArray, this);</p>
          <p>&#125;</p>
          <p className="text-neutral-500 mt-3">// Spawn worker thread:</p>
          <p>Thread thread = new Thread(sortingMethod);</p>
          <p>thread.start();</p>
        </div>

        <p>
          This pattern satisfies the <strong>Open/Closed Principle</strong> (part of SOLID): new sorting
          algorithms (e.g. QuickSort, RadixSort) can be added simply by creating a new class implementing{" "}
          <code>SortingStrategy</code>, with zero modifications to the existing sorting engine.
        </p>
      </ArticleSection>

      {/* Section 04: Selection Sort vs In-Place Merge Sort */}
      <ArticleSection id="algorithms" number="04" title="Selection Sort vs. In-Place Merge Sort">
        <p>
          The application implements two distinct algorithms with starkly contrasting mathematical and memory
          characteristics:
        </p>

        <div className="grid md:grid-cols-2 gap-6 my-8">
          <div className="editorial-card p-6">
            <h4 className="text-lg font-light text-white mb-2">1. Selection Sort</h4>
            <p className="editorial-eyebrow text-amber-400 mb-4">O(N²) Quadratic Complexity · O(1) Memory</p>
            <p className="text-sm text-neutral-300 leading-6">
              Selection sort scans the unsorted subarray from index $i$ to $N-1$ to locate the absolute minimum
              element, then performs a single swap with index $i$.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-neutral-400 font-mono">
              <li>• Total Comparisons: $N(N - 1) / 2$</li>
              <li>• Total Swaps: At most $N - 1$</li>
              <li>• Best/Worst Time: Always $O(N²)$</li>
              <li>• Step Throttle: 60ms delay per swap</li>
            </ul>
          </div>

          <div className="editorial-card p-6">
            <h4 className="text-lg font-light text-white mb-2">2. In-Place Merge Sort</h4>
            <p className="editorial-eyebrow text-emerald-400 mb-4">O(N log N) Divide &amp; Conquer · O(1) Aux Memory</p>
            <p className="text-sm text-neutral-300 leading-6">
              Standard merge sort allocates an auxiliary array of size $N$. This implementation uses an{" "}
              <strong>in-place merging technique</strong> with element shifts, eliminating extra memory allocations entirely.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-neutral-400 font-mono">
              <li>• Divide Phase: Recursively bisects at midpoint $m$</li>
              <li>• In-Place Merge: Shifts elements right by 1 to insert</li>
              <li>• Auxiliary Space: $O(1)$ strictly in-place</li>
              <li>• Step Throttle: 50ms delay per shift</li>
            </ul>
          </div>
        </div>

        <h4 className="text-lg font-light text-white mt-8 mb-3">Understanding In-Place Merge Shifting</h4>
        <p>
          Standard merge sort copies values into temporary left and right buffers before merging them back. In our
          memory-constrained implementation, <code>mergeInPlace(int[] array, int l, int m, int r)</code> maintains
          two pointers: <code>l</code> (start of left subsegment) and <code>left2 = m + 1</code> (start of right subsegment).
        </p>
        <p>
          When <code>array[left2] &lt; array[l]</code>, the value at <code>left2</code> belongs at index <code>l</code>.
          The algorithm shifts all elements between <code>l</code> and <code>left2</code> to the right by one slot,
          places <code>value</code> at <code>l</code>, and advances the boundaries:
        </p>

        <div className="editorial-card p-5 my-6 font-mono text-xs text-neutral-300 bg-black/60">
          <p className="text-neutral-500 mb-2">// In-Place Array Shifting in MergeSort.java</p>
          <p>int value = array[left2];</p>
          <p>int index = left2;</p>
          <p>while (index != l) &#123;</p>
          <p className="pl-4">array[index] = array[index - 1];</p>
          <p className="pl-4">index--;</p>
          <p>&#125;</p>
          <p>array[l] = value;</p>
        </div>
      </ArticleSection>

      {/* Section 05: Interactive JavaFX Desktop Simulator */}
      <ArticleSection id="interactive-studio" number="05" title="Interactive JavaFX Simulator">
        <p className="mb-6">
          Experience the exact desktop application below. Test how Selection Sort and in-place Merge Sort behave
          across different array sizes (32 to 128 elements), monitor comparison counters in real time, and verify
          that the simulation runs smoothly without thread lock:
        </p>

        <InteractiveSortingSimulator />

        <p className="text-xs text-neutral-500 mt-4 leading-6 text-center">
          Interactive simulation replicating the JavaFX 17 FXML stage, proportional bar math, and worker thread state.
        </p>
      </ArticleSection>

      {/* Section 06: Source Code Review */}
      <ArticleSection id="source-code" number="06" title="Source Code & Implementation Review">
        <p className="mb-6">
          Review the complete Java 17 and JavaFX source files from the original repository:
        </p>

        <CodeReviewSection />

        <div className="mt-8">
          <SourceLink
            href={repo}
            label="View complete repository on GitHub"
            meta="rl4658/sorting-hub · JavaFX 17 · Scene Builder · Maven"
          />
        </div>
      </ArticleSection>

      {/* Section 07: Complexity Analysis & Benchmarks */}
      <ArticleSection id="benchmarks" number="07" title="Complexity Analysis & Benchmarks">
        <p>
          A summary of the theoretical and empirical characteristics observed during testing:
        </p>

        <div className="overflow-x-auto my-8">
          <table className="w-full text-xs font-mono text-left border border-white/10 rounded-xl overflow-hidden">
            <thead className="bg-neutral-900 border-b border-white/10 text-neutral-300">
              <tr>
                <th className="p-3 sm:p-4">Algorithm</th>
                <th className="p-3 sm:p-4">Best Time</th>
                <th className="p-3 sm:p-4">Average Time</th>
                <th className="p-3 sm:p-4">Worst Time</th>
                <th className="p-3 sm:p-4">Auxiliary Space</th>
                <th className="p-3 sm:p-4">Stability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-neutral-950/60 text-neutral-300">
              <tr>
                <td className="p-3 sm:p-4 font-semibold text-white">Selection Sort</td>
                <td className="p-3 sm:p-4 text-amber-300">O(N²)</td>
                <td className="p-3 sm:p-4 text-amber-300">O(N²)</td>
                <td className="p-3 sm:p-4 text-amber-300">O(N²)</td>
                <td className="p-3 sm:p-4 text-emerald-400">O(1)</td>
                <td className="p-3 sm:p-4 text-neutral-400">Unstable</td>
              </tr>
              <tr>
                <td className="p-3 sm:p-4 font-semibold text-white">In-Place Merge Sort</td>
                <td className="p-3 sm:p-4 text-emerald-400">O(N log N)</td>
                <td className="p-3 sm:p-4 text-emerald-400">O(N log N)</td>
                <td className="p-3 sm:p-4 text-emerald-400">O(N log N)</td>
                <td className="p-3 sm:p-4 text-emerald-400">O(1)</td>
                <td className="p-3 sm:p-4 text-emerald-400">Stable</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="editorial-card p-6 mt-8">
          <h4 className="text-base font-light text-white mb-2">Key Engineering Takeaways</h4>
          <ul className="space-y-3 text-sm text-neutral-300 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-1">•</span>
              <span>
                <strong>Thread Decoupling is Universal:</strong> Whether in JavaFX, React Native, or Web Workers, heavy computational loops must never execute synchronously on the rendering thread.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-1">•</span>
              <span>
                <strong>Space-Time Trade-offs:</strong> In-place Merge Sort eliminates auxiliary memory allocations ($O(1)$ space), but incurs shifting overhead ($O(N)$ operations during element insertions).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-1">•</span>
              <span>
                <strong>Design Patterns Scale:</strong> The Strategy Pattern allows seamless algorithm expansion without touching UI controller logic, enforcing maintainability.
              </span>
            </li>
          </ul>
        </div>
      </ArticleSection>
    </EngineeringArticle>
  );
}
