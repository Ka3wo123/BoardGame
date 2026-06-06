import React from 'react';
import {
  Dice5, Dice3, Hexagon, Puzzle, Crown,
  Spade, Club, Heart, Diamond
} from 'lucide-react';
import './BoardGameBackground.css';

export default function BoardGameBackground() {
  return (
    <div className="bg-board" aria-hidden="true">
      <div className="bg-board-gradient" />
      <div className="bg-board-stars" />
      <Dice5   className="float-deco deco-1" />
      <Hexagon className="float-deco deco-2" />
      <Puzzle  className="float-deco deco-3" />
      <Crown   className="float-deco deco-4" />
      <Dice3   className="float-deco deco-5" />
      <Spade   className="float-deco deco-6" />
      <Club    className="float-deco deco-7" />
      <Heart   className="float-deco deco-8" />
      <Hexagon className="float-deco deco-9" />
      <Diamond className="float-deco deco-10" />
    </div>
  );
}
