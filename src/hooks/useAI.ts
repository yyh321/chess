import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { cloneBoard } from '../engine/board';
import type { AIMove } from '../engine/ai/searcher';

const DEPTH_MAP = { 1: 2, 2: 3, 3: 4 };

export function useAI() {
  const mode = useGameStore(s => s.mode);
  const currentTurn = useGameStore(s => s.currentTurn);
  const playerSide = useGameStore(s => s.playerSide);
  const aiLevel = useGameStore(s => s.aiLevel);
  const board = useGameStore(s => s.board);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    if (mode !== 'pve') return;
    if (currentTurn === playerSide) return;

    const worker = new Worker(new URL('../engine/ai/worker.ts', import.meta.url), { type: 'module' });
    workerRef.current = worker;

    worker.postMessage({
      board: cloneBoard(board),
      side: currentTurn,
      depth: DEPTH_MAP[aiLevel],
    });

    worker.onmessage = (e: MessageEvent<AIMove | null>) => {
      const move = e.data;
      if (move) {
        useGameStore.getState().selectPiece(move.from);
        setTimeout(() => {
          useGameStore.getState().movePiece(move.to);
        }, 300);
      }
      worker.terminate();
    };

    return () => {
      worker.terminate();
    };
  }, [mode, currentTurn, playerSide, aiLevel, board]);
}
