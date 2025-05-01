"use client";

import type { TeamScores } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Minus, Plus } from "lucide-react";

interface ScoreboardProps {
  scores: TeamScores;
  onScoreChange: (teamIndex: number, delta: number) => void;
  teamNames?: [string, string];
}

export function Scoreboard({
  scores,
  onScoreChange,
  teamNames = ["Team 1", "Team 2"],
}: ScoreboardProps) {
  const handleScoreUpdate = (teamIndex: number, delta: number) => {
    onScoreChange(teamIndex, delta);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {scores.map((score, index) => (
        <Card key={index} className="bg-secondary text-secondary-foreground shadow-md rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">{teamNames[index]}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-4 text-center">{score}</div>
            <div className="flex justify-center space-x-4">
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleScoreUpdate(index, -100)} // Example delta, could be dynamic
                aria-label={`Decrease ${teamNames[index]} score`}
                className="rounded-full w-12 h-12 shadow-lg"
              >
                <Minus className="h-6 w-6" />
              </Button>
              <Button
                variant="default" // Uses primary color
                size="icon"
                onClick={() => handleScoreUpdate(index, 100)} // Example delta
                aria-label={`Increase ${teamNames[index]} score`}
                className="rounded-full w-12 h-12 shadow-lg"
              >
                <Plus className="h-6 w-6" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
