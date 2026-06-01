import { findBestMove } from './searcher';
import type { BoardState, Side } from '../../types';

export interface AIWorkerRequest {
  board: BoardState;
  side: Side;
  depth: number;
}

self.onmessage = (e: MessageEvent<AIWorkerRequest>) => {
  const { board, side, depth } = e.data;
  const move = findBestMove(board, side, depth);
  self.postMessage(move);
};
