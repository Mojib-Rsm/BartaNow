
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { BarChartHorizontal } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const pollData = {
  question: 'আগামী নির্বাচনে কোন দল জিতবে বলে আপনার মনে হয়?',
  options: [
    { id: 'option1', label: 'দল ক', votes: 42 },
    { id: 'option2', label: 'দল খ', votes: 35 },
    { id: 'option3', label: 'অন্যান্য', votes: 23 },
  ],
};

export default function PollSection() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(pollData.options.map(opt => ({ ...opt, percentage: 0 })));

  const totalVotes = results.reduce((sum, option) => sum + option.votes, 0);

  useEffect(() => {
    if (showResults) {
      const newResults = pollData.options.map(option => ({
        ...option,
        percentage: totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0,
      }));
      setResults(newResults);
    }
  }, [showResults, totalVotes]);

  const handleVote = () => {
    if (selectedOption) {
      // In a real app, you would submit the vote and then fetch the updated results.
      // For demonstration, we'll just simulate it.
      const selected = results.find(r => r.id === selectedOption);
      if (selected) {
        selected.votes += 1;
      }
      setShowResults(true);
    }
  };

  const toggleResults = () => {
    setShowResults(prev => !prev);
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-lg">
          <BarChartHorizontal className="h-5 w-5 text-primary" />
          মতামত জরিপ
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-semibold mb-4">{pollData.question}</p>
        {showResults ? (
          <div className="space-y-3">
            {results.map(option => (
              <div key={option.id} className="space-y-1">
                <div className="flex justify-between text-sm font-medium">
                  <span>{option.label}</span>
                  <span>{option.percentage}%</span>
                </div>
                <Progress value={option.percentage} className="h-2" />
              </div>
            ))}
          </div>
        ) : (
          <RadioGroup onValueChange={setSelectedOption} className="space-y-2">
            {pollData.options.map(option => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id} className="cursor-pointer">{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 items-stretch">
        {!showResults && (
          <Button onClick={handleVote} disabled={!selectedOption} className="w-full">
            ভোট দিন
          </Button>
        )}
        <Button variant="ghost" className="w-full text-primary" onClick={toggleResults}>
            {showResults ? 'পুনরায় ভোট দিন' : 'ফলাফল দেখুন'}
        </Button>
      </CardFooter>
    </Card>
  );
}
