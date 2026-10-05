import React, { useState } from 'react';
import { READING_PLANS } from '../../data/bibleData';
import { StorageService } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, Circle, ArrowLeft, BookOpen, Calendar, Check, ChevronRight } from 'lucide-react';
import { ReadingPlan, ReadingPlanDay } from '../../types';

interface ReadingPlansViewProps {
  onBackToBible: () => void;
  onNavigateToScripture: (bookId: string, chapter: number, verse?: number) => void;
}

export const ReadingPlansView: React.FC<ReadingPlansViewProps> = ({
  onBackToBible,
  onNavigateToScripture
}) => {
  const { currentUser } = useAuth();
  const [plans] = useState<ReadingPlan[]>(READING_PLANS);
  const [selectedPlan, setSelectedPlan] = useState<ReadingPlan | null>(null);

  // Force re-render on progress toggle
  const [progressKey, setProgressKey] = useState(0);

  const handleToggleDay = (planId: string, day: number) => {
    StorageService.toggleReadingPlanDay(currentUser.id, planId, day);
    setProgressKey((prev) => prev + 1);
  };

  const getCompletedDays = (planId: string): number[] => {
    return StorageService.getUserReadingPlanProgress(currentUser.id, planId).completedDays;
  };

  const parseScriptureRef = (refStr: string): { bookId: string; chapter: number; verse?: number } => {
    // E.g. "Proverbs 3:5-6" -> bookId: 'PRO', chapter: 3, verse: 5
    // "Romans 8:1-4" -> bookId: 'ROM', chapter: 8, verse: 1
    const lower = refStr.toLowerCase();
    let bookId = 'PSA';
    if (lower.includes('proverb')) bookId = 'PRO';
    else if (lower.includes('roman')) bookId = 'ROM';
    else if (lower.includes('john')) bookId = 'JHN';
    else if (lower.includes('matthew')) bookId = 'MAT';
    else if (lower.includes('genesis')) bookId = 'GEN';

    const match = refStr.match(/(\d+):(\d+)/);
    const chapter = match ? parseInt(match[1], 10) : 1;
    const verse = match ? parseInt(match[2], 10) : 1;

    return { bookId, chapter, verse };
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-28 pt-6">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => {
              if (selectedPlan) setSelectedPlan(null);
              else onBackToBible();
            }}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-teal-400 hover:text-teal-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{selectedPlan ? 'All Reading Plans' : 'Back to Bible Reader'}</span>
          </button>
        </div>

        {/* View Header */}
        {!selectedPlan ? (
          <>
            <div className="mb-8">
              <div className="flex items-center gap-2 text-teal-400 text-sm font-semibold tracking-wider uppercase">
                <Calendar className="h-4 w-4" />
                <span>Scripture Journeys</span>
              </div>
              <h1 className="mt-2 text-3xl sm:text-4xl font-serif font-bold text-slate-100">
                Bible Reading Plans
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl">
                Structured devotional journeys designed to root your heart in Scripture, chapter by chapter.
              </p>
            </div>

            {/* Plans List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" key={progressKey}>
              {plans.map((plan) => {
                const completed = getCompletedDays(plan.id);
                const percent = Math.round((completed.length / plan.durationDays) * 100);

                return (
                  <div
                    key={plan.id}
                    className="flex flex-col justify-between p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all shadow-lg"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/20">
                          {plan.category}
                        </span>
                        <span className="text-xs text-slate-400">{plan.durationDays} Days</span>
                      </div>

                      <h3 className="font-serif text-xl font-bold text-slate-100">{plan.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                        {plan.description}
                      </p>

                      <div className="mt-6">
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-medium">
                          <span>Progress</span>
                          <span className="text-teal-400">{percent}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-teal-500 rounded-full transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-slate-500 mt-2">
                          {completed.length} of {plan.durationDays} days completed
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-800/80">
                      <button
                        onClick={() => setSelectedPlan(plan)}
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-teal-600 hover:text-white transition-colors flex items-center justify-center gap-2"
                      >
                        <span>Open Journey</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* Single Plan View */
          <div className="space-y-6" key={progressKey}>
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800">
              <span className="px-3 py-1 rounded-md text-xs font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/20">
                {selectedPlan.category}
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100 mt-3">
                {selectedPlan.title}
              </h1>
              <p className="text-sm text-slate-400 mt-2">{selectedPlan.description}</p>

              {/* Progress Summary */}
              {(() => {
                const completed = getCompletedDays(selectedPlan.id);
                const percent = Math.round((completed.length / selectedPlan.durationDays) * 100);
                return (
                  <div className="mt-6 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                    <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                      <span className="font-semibold">Your Progress</span>
                      <span className="text-teal-400 font-bold">{percent}% Completed</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-teal-500 rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Daily Readings */}
            <div className="space-y-4">
              <h2 className="font-serif text-xl font-bold text-slate-200">Daily Readings & Reflections</h2>

              {selectedPlan.days.map((dayItem: ReadingPlanDay) => {
                const isCompleted = getCompletedDays(selectedPlan.id).includes(dayItem.day);

                return (
                  <div
                    key={dayItem.day}
                    className={`p-6 rounded-3xl border transition-all ${
                      isCompleted
                        ? 'bg-slate-900/40 border-teal-500/30'
                        : 'bg-slate-900/70 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                            Day {dayItem.day}
                          </span>
                          {isCompleted && (
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 flex items-center gap-1">
                              <Check className="h-3 w-3" />
                              Done
                            </span>
                          )}
                        </div>
                        <h3 className="font-serif text-lg font-bold text-slate-100 mt-1">
                          {dayItem.title}
                        </h3>
                      </div>

                      <button
                        onClick={() => handleToggleDay(selectedPlan.id, dayItem.day)}
                        className={`p-2 rounded-xl transition-colors ${
                          isCompleted
                            ? 'text-teal-400 hover:text-teal-300 bg-teal-500/10'
                            : 'text-slate-500 hover:text-slate-300 bg-slate-800/80'
                        }`}
                        title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-6 w-6 text-teal-400" />
                        ) : (
                          <Circle className="h-6 w-6" />
                        )}
                      </button>
                    </div>

                    {/* Scripture Reference Buttons */}
                    <div className="mb-4 flex flex-wrap gap-2">
                      {dayItem.scriptureRefs.map((ref) => {
                        const parsed = parseScriptureRef(ref);
                        return (
                          <button
                            key={ref}
                            onClick={() =>
                              onNavigateToScripture(parsed.bookId, parsed.chapter, parsed.verse)
                            }
                            className="px-3 py-1.5 rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/20 text-xs font-medium hover:bg-teal-500/20 flex items-center gap-1.5 transition-colors"
                          >
                            <BookOpen className="h-3.5 w-3.5" />
                            <span>{ref}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Passage text excerpt */}
                    <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/60 mb-4">
                      <p className="font-serif text-sm sm:text-base text-slate-200 italic leading-relaxed">
                        "{dayItem.passageText}"
                      </p>
                    </div>

                    {/* Reflection */}
                    <div className="pt-2">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Daily Meditation
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {dayItem.reflection}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
